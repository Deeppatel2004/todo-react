function TodoCount({ todos }) {
  const remaining = todos.filter(todo => !todo.done).length;

  return <p>Remaining todos: {remaining}</p>;
}

export default TodoCount;