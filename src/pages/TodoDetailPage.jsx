
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTodo } from '../api';

export default function TodoDetailPage({ token, onAuthError }) {
  const { id } = useParams();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadTodo() {
      setLoading(true);
      setError('');

      try {
        const data = await getTodo(token, id);

        if (!cancelled) {
          setTodo(data);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 401) {
            onAuthError();
            return;
          }

          setError(
            err.status === 404
              ? 'Todo not found'
              : 'Unable to load todo. Please try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTodo();

    return () => {
      cancelled = true;
    };
  }, [id, token, onAuthError]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !todo) {
    return (
      <section>
        <h2>{error || 'Todo not found'}</h2>
        <Link to="/">← Back to todos</Link>
      </section>
    );
  }

  return (
    <section className="detail">
      <h2>Todo Details</h2>

      <h3>{todo.text}</h3>

      <p>
        Status: <strong>{todo.done ? 'Done' : 'Not done'}</strong>
      </p>

      <p>Todo ID: {todo.id}</p>

      <Link to="/">← Back to todos</Link>
    </section>
  );
}
