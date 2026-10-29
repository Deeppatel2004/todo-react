export default function TodoFilters({ mode, onChange }) {
  return (
    <div className="todo-filters" role="group" aria-label="Filter todos">
      <button
        type="button"
        className={mode === 'all' ? 'selected' : ''}
        aria-pressed={mode === 'all'}
        onClick={() => onChange('all')}
      >
        All
      </button>
      <button
        type="button"
        className={mode === 'active' ? 'selected' : ''}
        aria-pressed={mode === 'active'}
        onClick={() => onChange('active')}
      >
        Active
      </button>
      <button
        type="button"
        className={mode === 'done' ? 'selected' : ''}
        aria-pressed={mode === 'done'}
        onClick={() => onChange('done')}
      >
        Done
      </button>
    </div>
  );
}