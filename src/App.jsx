
import { useEffect, useState } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoFilters from './TodoFilters';
import {
  deleteTodo,
  applyServerTodo,
  uiError,
  visibleTodos
} from './todoHelpers';
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

  // Load todos from the API using the selected mode
  useEffect(() => {
    async function loadTodos() {
      try {
        setLoading(true);
        setError('');

        const data = await getTodos(mode);
        setTodos(data);
      } catch (err) {
        setError('Unable to load todos. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadTodos();
  }, [mode]);

  // Add through the API
  async function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim() || busy) return;

    try {
      setBusy(true);
      setError('');

      const saved = await createTodo(text.trim());

      setTodos(current => applyServerTodo(current, saved));
      setText('');
    } catch (err) {
      setError(uiError(Number(err.message) || 0));
    } finally {
      setBusy(false);
    }
  }

  // Toggle through the API
  async function handleToggle(todo) {
    try {
      setError('');

      const saved = await patchTodo(todo.id, {
        done: !todo.done
      });

      setTodos(current => applyServerTodo(current, saved));
    } catch (err) {
      setError('Could not update');
    }
  }

  // Delete through the API
  async function handleDelete(id) {
    try {
      setError('');

      await removeTodo(id);

      setTodos(current => deleteTodo(current, id));
    } catch (err) {
      setError('Could not delete');
    }
  }

  const filteredTodos = visibleTodos(todos, mode, search);

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
          {filteredTodos.map(todo => (
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




/*

// REACT ROUTER CODE 
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import TodoDetail from './pages/TodoDetail';
import Setting from './pages/Setting';

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {' | '}
        <Link to="/about">About</Link>
        {' | '}
        <Link to="/todos/5">Todo 5</Link>
        {' | '}
        <Link to="/Setting">Setting</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/todos/:id" element={<TodoDetail />} />
        <Route path="/Setting" element={<Setting />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
} 
*/


