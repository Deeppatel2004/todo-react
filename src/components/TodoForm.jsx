
import { useState } from 'react';

export default function TodoForm({ onAdd, busy = false }) {
  const [text, setText] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    const value = text.trim();

    if (!value || busy) return;

    const success = await onAdd(value);

    if (success) {
      setText('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={text}
        onChange={event => setText(event.target.value)}
        placeholder="Enter a todo..."
        aria-label="New todo"
        disabled={busy}
      />

      <button type="submit" disabled={busy || !text.trim()}>
        {busy ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}
