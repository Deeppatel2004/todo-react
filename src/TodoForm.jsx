function TodoForm({ text, onTextChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        value={text}
        onChange={event => onTextChange(event.target.value)}
        placeholder="Enter a todo"
      />

      <button type="submit">Add</button>
    </form>
  );
}

export default TodoForm;