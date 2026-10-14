import './App.css';
import Counter from './Counter';

const todos = [
  { id: 1, text: 'milk', done: false },
  { id: 2, text: 'bread', done: true }
];

function TodoItem({ text, done }) {
  return (
    <li className={done ? 'todo done' : 'todo'}>
      {text}
    </li>
  );
}


function TodoCount({ todos }) {
  const left = todos.filter(todo => !todo.done).length;
  const done = todos.filter(todo => todo.done).length;

  return <p>{left} left, {done} done</p>;
}


function App() {
  return (
    <div>
      <h1>My Todos</h1>
      <Counter />

      <ul>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            text={todo.text}
            done={todo.done}
          />
        ))}
      </ul>

<TodoCount todos={todos} />
    </div>
  );
}

export default App;
