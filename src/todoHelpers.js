export function addTodo(todos, text) {
  const trimmed = text.trim();

  if (!trimmed) return todos;

  const nextId = todos.length === 0
    ? 1
    : Math.max(...todos.map(todo => todo.id)) + 1;

  return [
    ...todos,
    {
      id: nextId,
      text: trimmed,
      done: false
    }
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
