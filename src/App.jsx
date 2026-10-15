import { useEffect, useState } from 'react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoFilters from './TodoFilters';
import {
  addTodo,
  toggleTodo,
  deleteTodo
} from './todoHelpers';
import {
  getTodos,
  createTodo,
  patchTodo,
  removeTodo
} from './api.js';
import './App.css';

        async function handleAdd(e) {
          e.preventDefault();
         try {
            const saved = await createTodo(text);
            setTodos(applyServerTodo(todos, saved));
            setText('');
         } catch (e) {
            setError(uiError(Number(e.message) || 0));
          }
        }


function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState(''); const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

         useEffect(() => {
          async function load() {
            try {
              setLoading(true);
              setError('');
              const data = await getTodos('all');
              setTodos(data);
            } catch (e) {
             setError('Unable to load todos. Please try again.');
           } finally {
              setLoading(false);
            }
          }
          load();
        }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim()) return;

    setTodos(current => addTodo(current, text));
    setText('');
  }

  function handleToggle(id) {
    setTodos(current => toggleTodo(current, id));
  }

  function handleDelete(id) {
    setTodos(current => deleteTodo(current, id));
  }

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

      <TodoFilters
        mode={mode}
        onModeChange={setMode}
        search={search}
        onSearchChange={setSearch}
      />

    {loading && <p>Loading...</p>}

    {error && <p className="error">{error}</p>}

    {!loading && !error && (

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


export default App