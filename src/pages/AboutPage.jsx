
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <section>
      <h2>About This App</h2>

      <p>This is my Todo application built with React.</p>
      <p>React Router manages navigation between pages.</p>
      <p>The application uses my deployed Express Todo API.</p>

      <Link to="/">← Back to todos</Link>
    </section>
  );
}
