import {
  Link,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import TodoListPage from './pages/TodoListPage';
import TodoDetailPage from './pages/TodoDetailPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';

export default function App() {
  const { pathname } = useLocation();

  function linkClass(path) {
    return pathname === path ? 'active' : '';
  }

  return (
    <div className="app">
      <header>
        <h1>My Todos</h1>

        <nav>
          <Link to="/" className={linkClass('/')}>
            Todos
          </Link>
          { ' | ' }

          <Link to="/about" className={linkClass('/about')}>
            About
          </Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<TodoListPage />} />
          <Route path="/todos/:id" element={<TodoDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
