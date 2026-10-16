
export function addTodo(todos, text) {
  const trimmed = text.trim();

  if (!trimmed) return todos;

  const nextId = todos.length === 0
    ? 1
    : Math.max(...todos.map(todo => todo.id)) + 1;

  return [
    ...todos,
    { id: nextId, text: trimmed, done: false }
  ];
}

export function toggleTodo(todos, id) {
  return todos.map(todo =>
    todo.id === id
      ? { ...todo, done: !todo.done }
      : todo
  );
}

export function deleteTodo(todos, id) {
  return todos.filter(todo => todo.id !== id);
}

// Add a new server todo or update an existing one
export function applyServerTodo(todos, saved) {
  const exists = todos.some(todo => todo.id === saved.id);

  if (exists) {
    return todos.map(todo =>
      todo.id === saved.id ? saved : todo
    );
  }

  return [...todos, saved];
}

// Filter todos by status and search text
export function visibleTodos(todos, mode, search) {
  return todos.filter(todo => {
    const matchesMode =
      mode === 'all' ||
      (mode === 'active' && !todo.done) ||
      (mode === 'done' && todo.done);

    const matchesSearch = todo.text
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesMode && matchesSearch;
  });
}

// Convert API errors into readable messages
export function uiError(status) {
  if (status === 400) return 'Please check what you typed.';
  if (status === 0) return 'Network error. Check your connection.';
  return 'Something went wrong. Please try again.';
}
