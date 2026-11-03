
import { useEffect, useState } from 'react';

import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import TodoFilters from '../components/TodoFilters';

import {
  getTodos,
  createTodo,
  patchTodo,
  removeTodo,
  isUsingLocalStorage
} from '../api';

import { countLeft, filterTodos } from '../todoHelpers';

export default function TodoListPage({ token, onAuthError }) {
  const [todos, setTodos] = useState([]);
  const [mode, setMode] = useState('all');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);

  // HANDLE API ERRORS
  function handleRequestError(error, message) {
    if (error.status === 401) {
      onAuthError();
      return;
    }

    setError(message);
  }

  // LOAD TODOS
  async function load() {
    setLoading(true);
    setError('');

    try {
      const data = await getTodos(token, 'all');
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      handleRequestError(
        error,
        'Unable to load todos. Please try again.'
      );
    } finally {
      setUsingLocalStorage(isUsingLocalStorage());
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  const visibleTodos = filterTodos(todos, mode);

  // ADD TODO
  async function handleAdd(text) {
    setBusy(true);
    setError('');

    try {
      const todo = await createTodo(token, text);
      setTodos(current => [...current, todo]);
      return true;
    } catch (error) {
      handleRequestError(
        error,
        'Unable to add todo. Please try again.'
      );
      return false;
    } finally {
      setUsingLocalStorage(isUsingLocalStorage());
      setBusy(false);
    }
  }

  // TOGGLE TODO
  async function handleToggle(id) {
    const todo = todos.find(item => item.id === id);

    if (!todo) return;

    setError('');

    try {
      const updated = await patchTodo(token, id, {
        done: !todo.done
      });

      setTodos(current =>
        current.map(item =>
          item.id === id ? updated : item
        )
      );
    } catch (error) {
      handleRequestError(
        error,
        'Unable to update todo. Please try again.'
      );
    } finally {
      setUsingLocalStorage(isUsingLocalStorage());
    }
  }

  // DELETE TODO
  async function handleDelete(id) {
    setError('');

    try {
      await removeTodo(token, id);

      setTodos(current =>
        current.filter(item => item.id !== id)
      );
    } catch (error) {
      handleRequestError(
        error,
        'Unable to delete todo. Please try again.'
      );
    } finally {
      setUsingLocalStorage(isUsingLocalStorage());
    }
  }

  return (
    <section>
      <h2>My Todos</h2>

      <TodoForm onAdd={handleAdd} busy={busy} />

      {usingLocalStorage && (
        <p role="status">
          The todo service is unavailable.
          Todos are saved in this browser only.
        </p>
      )}

      {error && (
        <p className="error" role="alert">
          {error}{' '}
          <button type="button" onClick={load}>
            Reload
          </button>
        </p>
      )}

      <TodoFilters mode={mode} onChange={setMode} />

      <p className="remaining">
        {countLeft(todos)} todo(s) left
      </p>

      {loading ? (
        <p>Loading todos...</p>
      ) : visibleTodos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul className="todo-list">
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
    </section>
  );
}
