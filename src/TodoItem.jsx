
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={todo.done ? 'todo done' : 'todo'}>
      <span>{todo.text}</span>

      <button onClick={() => onToggle(todo)}>
        {todo.done ? 'Undo' : 'Done'}
      </button>

      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}

export default TodoItem;
