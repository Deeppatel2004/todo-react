
const BASE = 'https://todo-api-4y68.onrender.com';
const STORAGE_KEY = 'todo-react.todos.v1';

let useLocalStorage = false;

function requestInit(method = 'GET', body = undefined) {
  return {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    ...(body !== undefined && {
      body: JSON.stringify(body)
    })
  };
}

async function request(path, options = requestInit()) {
  const res = await fetch(`${BASE}${path}`, options);

  if (!res.ok) {
<<<<<<< HEAD
    const error = new Error(String(res.status));
    error.status = res.status;
    throw error;
=======
    throw new Error(String(res.status));
>>>>>>> 2accb05a052019598bbb3f667497c3b77f47cf1f
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
<<<<<<< HEAD
}

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
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function updateStoredTodo(todo) {
  const todos = readStoredTodos();
  const index = todos.findIndex(item => item.id === todo.id);

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
    return { value: await localOperation(), isLocal: true };
  }

  try {
    return { value: await remoteOperation(), isLocal: false };
  } catch (error) {
    if (!isApiUnavailable(error)) {
      throw error;
    }

    useLocalStorage = true;
    return { value: await localOperation(), isLocal: true };
  }
}

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
  const todo = readStoredTodos().find(item => item.id === id);
  if (!todo) throw new Error('404');
  return todo;
}

export function isUsingLocalStorage() {
  return useLocalStorage;
=======
>>>>>>> 2accb05a052019598bbb3f667497c3b77f47cf1f
}

export async function getTodos(mode = 'all') {
  const query = mode === 'all'
    ? ''
    : `?done=${mode === 'done'}`;

<<<<<<< HEAD
  const result = await withLocalFallback(
    async () => {
      const todos = await request(`/todos${query}`);
      if (!Array.isArray(todos)) {
        throw new Error('The todo API returned an invalid list.');
      }
      return todos;
    },
    async () => {
      const todos = readStoredTodos();
      if (mode === 'active') return todos.filter(todo => !todo.done);
      if (mode === 'done') return todos.filter(todo => todo.done);
      return todos;
    }
  );

  if (!result.isLocal) writeStoredTodos(result.value);
  return result.value;
}

export async function getTodo(id) {
  const result = await withLocalFallback(
    () => request(`/todos/${encodeURIComponent(id)}`),
    () => findLocalTodo(id)
  );

  if (!result.isLocal) updateStoredTodo(result.value);
  return result.value;
}

export async function createTodo(text) {
  const result = await withLocalFallback(
    () => request('/todos', requestInit('POST', { text })),
    () => {
      const todo = createLocalTodo(text);
      updateStoredTodo(todo);
      return todo;
    }
  );

  if (!result.isLocal) updateStoredTodo(result.value);
  return result.value;
}

export async function patchTodo(id, changes) {
  const result = await withLocalFallback(
    () => request(
      `/todos/${encodeURIComponent(id)}`,
      requestInit('PATCH', changes)
    ),
    () => {
      const todo = { ...findLocalTodo(id), ...changes };
      updateStoredTodo(todo);
      return todo;
    }
  );

  if (!result.isLocal) updateStoredTodo(result.value);
  return result.value;
}

export async function removeTodo(id) {
  const result = await withLocalFallback(
    () => request(
      `/todos/${encodeURIComponent(id)}`,
      requestInit('DELETE')
    ),
    () => {
      writeStoredTodos(readStoredTodos().filter(todo => todo.id !== id));
      return null;
    }
  );

  if (!result.isLocal) {
    writeStoredTodos(readStoredTodos().filter(todo => todo.id !== id));
  }
  return result.value;
}
=======
  return request(`/todos${query}`);
}

export async function getTodo(id) {
  return request(`/todos/${encodeURIComponent(id)}`);
}

export async function createTodo(text) {
  return request(
    '/todos',
    requestInit('POST', { text })
  );
}

export async function patchTodo(id, changes) {
  return request(
    `/todos/${encodeURIComponent(id)}`,
    requestInit('PATCH', changes)
  );
}

export async function removeTodo(id) {
  return request(
    `/todos/${encodeURIComponent(id)}`,
    requestInit('DELETE')
  );
}
>>>>>>> 2accb05a052019598bbb3f667497c3b77f47cf1f
