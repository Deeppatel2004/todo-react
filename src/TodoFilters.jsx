function TodoFilters({
  mode,
  onModeChange,
  search,
  onSearchChange
}) {
  return (
    <div>
      <button
        type="button"
        onClick={() => onModeChange('all')}
        disabled={mode === 'all'}
      >
        All
      </button>

      <button
        type="button"
        onClick={() => onModeChange('active')}
        disabled={mode === 'active'}
      >
        Active
      </button>

      <button
        type="button"
        onClick={() => onModeChange('done')}
        disabled={mode === 'done'}
      >
        Done
      </button>

      <input
        value={search}
        onChange={event => onSearchChange(event.target.value)}
        placeholder="Search todos"
      />
    </div>
  );
}

export default TodoFilters;
