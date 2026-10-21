
export function filterTodos(todos, mode = 'all') {
  if (mode === 'active') {
    return todos.filter(todo => !todo.done);
  }

  if (mode === 'done') {
    return todos.filter(todo => todo.done);
  }

  return todos;
}

export function countLeft(todos) {
  return todos.filter(todo => !todo.done).length;
}
