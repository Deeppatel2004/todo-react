
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

// Build query string for the selected filter
function buildQuery(mode) {
  if (mode === 'active') return '?done=false';
  if (mode === 'done') return '?done=true';
  return '';
}

export async function getTodos(mode = 'all') {
  const query = buildQuery(mode);

  const res = await fetch(
    BASE + '/todos' + query,
    requestInit()
  );

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return res.json();
}

export async function createTodo(text) {
  const res = await fetch(
    BASE + '/todos',
    requestInit('POST', { text })
  );

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return res.json();
}

export async function patchTodo(id, changes) {
  const res = await fetch(
    `${BASE}/todos/${id}`,
    requestInit('PATCH', changes)
  );

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return res.json();
}

export async function removeTodo(id) {
  const res = await fetch(
    `${BASE}/todos/${id}`,
    requestInit('DELETE')
  );

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  // A successful DELETE may return 204 No Content.
}
