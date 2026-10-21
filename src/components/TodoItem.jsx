
import { Link } from 'react-router-dom';

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="todo-item">
      <label className={todo.done ? 'todo-done' : ''}>
        <input
          type="checkbox"
          checked={Boolean(todo.done)}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark ${todo.text} as ${
            todo.done ? 'not done' : 'done'
          }`}
        />

        <Link to={`/todos/${todo.id}`}>
          {todo.text}
        </Link>
      </label>

      <button
        type="button"
        onClick={() => onToggle(todo.id)}
      >
        {todo.done ? 'Undo' : 'Done'}
      </button>

      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </button>
    </li>
  );
}
