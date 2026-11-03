
const BASE = import.meta.env.VITE_API_URL;
const STORAGE_KEY = 'todo-react.todos.v1';

let useLocalStorage = false;

// =====================================
// AUTH HEADER HELPER
// =====================================

function authHeaders(token = null) {
  return {
    'Content-Type': 'application/json',
    ...(token && {
      Authorization: `Bearer ${token}`
    })
  };
}

// =====================================
// REQUEST HELPER
// =====================================

function requestInit(method = 'GET', body = undefined, token = null) {
  return {
    method,
    headers: authHeaders(token),
    ...(body !== undefined && {
      body: JSON.stringify(body)
    })
  };
}

async function request(path, options = requestInit()) {
  const res = await fetch(`${BASE}${path}`, options);

  if (!res.ok) {
    let message = String(res.status);

    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {
      // Keep the status as the error message.
    }

    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

// =====================================
// LOGIN + REGISTER
// =====================================

export async function login(email, password) {
  return request(
    '/auth/login',
    requestInit('POST', { email, password })
  );
}

export async function register(email, password) {
  return request(
    '/auth/register',
    requestInit('POST', { email, password })
  );
}

// =====================================
// LOCAL STORAGE HELPERS
// =====================================

function readStoredTodos() {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored === null) return [];

  const todos = JSON.parse(stored);

  if (!Array.isArray(todos)) {
    throw new Error('Stored todos are invalid.');
  }

  return todos;
}

function writeStoredTodos(todos) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(todos)
  );
}

function updateStoredTodo(todo) {
  const todos = readStoredTodos();

  const index = todos.findIndex(
    item => item.id === todo.id
  );

  if (index === -1) {
    todos.push(todo);
  } else {
    todos[index] = todo;
  }

  writeStoredTodos(todos);
}

function isApiUnavailable(error) {
  return error instanceof TypeError
    || error.status === 404
    || error.status >= 500;
}

async function withLocalFallback(remoteOperation, localOperation) {
  if (useLocalStorage) {
    return {
      value: await localOperation(),
      isLocal: true
    };
  }

  try {
    return {
      value: await remoteOperation(),
      isLocal: false
    };
  } catch (error) {
    if (!isApiUnavailable(error)) {
      throw error;
    }

    useLocalStorage = true;

    return {
      value: await localOperation(),
      isLocal: true
    };
  }
}

// =====================================
// LOCAL TODO HELPERS
// =====================================

function createLocalTodo(text) {
  const id = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {
    id: `local-${id}`,
    text,
    done: false
  };
}

function findLocalTodo(id) {
  const todo = readStoredTodos().find(
    item => item.id === id
  );

  if (!todo) {
    throw new Error('404');
  }

  return todo;
}

export function isUsingLocalStorage() {
  return useLocalStorage;
}

// =====================================
// GET ALL TODOS
// =====================================

export async function getTodos(token, mode = 'all') {
  const query = mode === 'all'
    ? ''
    : `?done=${mode === 'done'}`;

  const result = await withLocalFallback(
    async () => {
      const todos = await request(
        `/todos${query}`,
        requestInit('GET', undefined, token)
      );

      if (!Array.isArray(todos)) {
        throw new Error('The todo API returned an invalid list.');
      }

      return todos;
    },
    async () => {
      const todos = readStoredTodos();

      if (mode === 'active') {
        return todos.filter(todo => !todo.done);
      }

      if (mode === 'done') {
        return todos.filter(todo => todo.done);
      }

      return todos;
    }
  );

  if (!result.isLocal) {
    writeStoredTodos(result.value);
  }

  return result.value;
}

// =====================================
// GET SINGLE TODO
// =====================================

export async function getTodo(token, id) {
  const result = await withLocalFallback(
    () => request(
      `/todos/${encodeURIComponent(id)}`,
      requestInit('GET', undefined, token)
    ),
    () => findLocalTodo(id)
  );

  if (!result.isLocal) {
    updateStoredTodo(result.value);
  }

  return result.value;
}

// =====================================
// CREATE TODO
// =====================================

export async function createTodo(token, text) {
  const result = await withLocalFallback(
    () => request(
      '/todos',
      requestInit('POST', { text }, token)
    ),
    () => {
      const todo = createLocalTodo(text);
      updateStoredTodo(todo);
      return todo;
    }
  );

  if (!result.isLocal) {
    updateStoredTodo(result.value);
  }

  return result.value;
}

// =====================================
// UPDATE TODO
// =====================================

export async function patchTodo(token, id, changes) {
  const result = await withLocalFallback(
    () => request(
      `/todos/${encodeURIComponent(id)}`,
      requestInit('PATCH', changes, token)
    ),
    () => {
      const todo = {
        ...findLocalTodo(id),
        ...changes
      };

      updateStoredTodo(todo);
      return todo;
    }
  );

  if (!result.isLocal) {
    updateStoredTodo(result.value);
  }

  return result.value;
}

// =====================================
// DELETE TODO
// =====================================

export async function removeTodo(token, id) {
  const result = await withLocalFallback(
    () => request(
      `/todos/${encodeURIComponent(id)}`,
      requestInit('DELETE', undefined, token)
    ),
    () => {
      writeStoredTodos(
        readStoredTodos().filter(todo => todo.id !== id)
      );

      return null;
    }
  );

  if (!result.isLocal) {
    writeStoredTodos(
      readStoredTodos().filter(todo => todo.id !== id)
    );
  }

  return result.value;
}
