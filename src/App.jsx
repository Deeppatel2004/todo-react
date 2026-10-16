import { useEffect, useState } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoFilters from './TodoFilters';
import {
  getTodos,
  createTodo,
  patchTodo,
  removeTodo
} from './api.js';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Load todos from the API
  useEffect(() => {
    async function loadTodos() {
      try {
        setLoading(true);
        setError('');

        const data = await getTodos('all');
        setTodos(data);
      } catch (err) {
        setError('Unable to load todos. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadTodos();
  }, []);

  // Add todo through the API
  async function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim() || busy) return;

    try {
      setBusy(true);
      setError('');

      const savedTodo = await createTodo(text.trim());

      setTodos(current => [...current, savedTodo]);
      setText('');
    } catch (err) {
      setError(
        err.message === '400'
          ? 'Please check what you typed.'
          : 'Unable to add todo. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }

  // Toggle Done / Undo through the API
  async function handleToggle(id) {
    const todo = todos.find(item => item.id === id);

    if (!todo) return;

    try {
      setError('');

      const updatedTodo = await patchTodo(id, {
        done: !todo.done
      });

      setTodos(current =>
        current.map(item =>
          item.id === id ? updatedTodo : item
        )
      );
    } catch (err) {
      setError('Unable to update todo. Please try again.');
    }
  }

  // Delete todo through the API
  async function handleDelete(id) {
    try {
      setError('');

      await removeTodo(id);

      setTodos(current =>
        current.filter(item => item.id !== id)
      );
    } catch (err) {
      setError('Unable to delete todo. Please try again.');
    }
  }

  // Filter and search todos
  const visibleTodos = todos.filter(todo => {
    const matchesMode =
      mode === 'all' ||
      (mode === 'active' && !todo.done) ||
      (mode === 'done' && todo.done);

    const matchesSearch = todo.text
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesMode && matchesSearch;
  });

  return (
    <main>
      <h1>My Todos</h1>

      <TodoForm
        text={text}
        onTextChange={setText}
        onSubmit={handleSubmit}
      />

      {busy && <p>Saving todo...</p>}

      <TodoFilters
        mode={mode}
        onModeChange={setMode}
        search={search}
        onSearchChange={setSearch}
      />

      {loading && <p>Loading...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && (
        <ul>
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
