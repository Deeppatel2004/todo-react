
const BASE = 'https://todo-api-kr2p.onrender.com';

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
    throw new Error(String(res.status));
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export async function getTodos(mode = 'all') {
  const query = mode === 'all'
    ? ''
    : `?done=${mode === 'done'}`;

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
