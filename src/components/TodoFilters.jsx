export default function TodoFilters({ mode, onChange }) {
  return (
    <div>
      <button onClick={() => onChange('all')}>All</button>
      <button onClick={() => onChange('active')}>Active</button>
      <button onClick={() => onChange('done')}>Done</button>
    </div>
  );
}