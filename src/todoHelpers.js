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

export function clearDone(todos) {
  return todos.filter(todo => !todo.done);
}
