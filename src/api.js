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

export async function getTodos(mode = 'all') {
  const res = await fetch(BASE + '/todos', requestInit());

  if (!res.ok) {
    throw new Error('Failed to load todos');
  }

  const data = await res.json();

  if (mode === 'active') return data.filter(todo => !todo.done);
  if (mode === 'done') return data.filter(todo => todo.done);

  return data;
}

export async function createTodo(text) {
  const res = await fetch(
    BASE + '/todos',
    requestInit('POST', { text })
  );

  if (!res.ok) throw new Error('Failed to create todo');

  return res.json();
}

export async function patchTodo(id, changes) {
  const res = await fetch(
    `${BASE}/todos/${id}`,
    requestInit('PATCH', changes)
  );

  if (!res.ok) throw new Error('Failed to update todo');

  return res.json();
}

export async function removeTodo(id) {
  const res = await fetch(
    `${BASE}/todos/${id}`,
    requestInit('DELETE')
  );

  if (!res.ok) throw new Error('Failed to delete todo');
}
