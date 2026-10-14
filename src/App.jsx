
import { useState } from 'react';
import { visibleTodos, clearDone } from './todoHelpers';
import TodoCount from './TodoCount.jsx';
import Counter from './Counter.jsx';


function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState('');

  const shown = visibleTodos(todos, mode, search);

  function handleSubmit(e) {
    e.preventDefault();

    if (!text.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      done: false,
    };

    setTodos([...todos, newTodo]);
    setText('');
  }

  function toggleTodo(id) {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? { ...todo, done: !todo.done }
          : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  function handleClearDone() {
    setTodos(clearDone(todos));
  }

  return (
    <div>
      <Counter />
      <h1>My Todos</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter a todo"
        />
        <button type="submit">Add</button>
      </form>

      <TodoCount todos={todos} />

      <div>
        <button
          className={mode === 'all' ? 'btn active' : 'btn'}
          onClick={() => setMode('all')}
        >
          All
        </button>

        <button
          className={mode === 'active' ? 'btn active' : 'btn'}
          onClick={() => setMode('active')}
        >
          Active
        </button>

        <button
          className={mode === 'done' ? 'btn active' : 'btn'}
          onClick={() => setMode('done')}
        >
          Done
        </button>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search todos..."
      />

      <button onClick={handleClearDone}>
        Clear done
      </button>

      {shown.length === 0 ? (
        <p>Nothing to show</p>
      ) : (
        <ul>
          {shown.map(todo => (
            <li key={todo.id}>
              <span
                onClick={() => toggleTodo(todo.id)}
                style={{
                  textDecoration: todo.done
                    ? 'line-through'
                    : 'none',
                  cursor: 'pointer',
                }}
              >
                {todo.text}
              </span>

              <button onClick={() => toggleTodo(todo.id)}>
                {todo.done ? 'Undo' : 'Done'}
              </button>

              <button onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;