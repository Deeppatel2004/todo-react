
import {
  Link,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

import { useState } from 'react';

import TodoListPage from './pages/TodoListPage';
import TodoDetailPage from './pages/TodoDetailPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/NotFound';

import { parseAuth } from './utils/parseAuth';

import './App.css';

function RequireAuth({ auth, children }) {
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const { pathname } = useLocation();

  const [auth, setAuth] = useState(() =>
    parseAuth(localStorage.getItem('auth'))
  );

  function handleLogin(data) {
    localStorage.setItem('auth', JSON.stringify(data));
    setAuth(data);
  }

  function handleLogout() {
    localStorage.removeItem('auth');
    setAuth(null);
  }

  function linkClass(path) {
    return pathname === path ? 'active' : '';
  }

  return (
    <div className="app">
      <header>
        <h1>My Todos</h1>

        <nav>
          {auth ? (
            <>
              <span>{auth.user?.email}</span>

              <Link to="/" className={linkClass('/')}>
                Todos
              </Link>

              <Link to="/about" className={linkClass('/about')}>
                About
              </Link>

              <button onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>
                Login
              </Link>

              <Link to="/register" className={linkClass('/register')}>
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route
            path="/login"
            element={
              auth
                ? <Navigate to="/" replace />
                : <LoginPage onLogin={handleLogin} />
            }
          />

          <Route
            path="/register"
            element={
              auth
                ? <Navigate to="/" replace />
                : <RegisterPage onLogin={handleLogin} />
            }
          />

          <Route
            path="/"
            element={
              <RequireAuth auth={auth}>
                <TodoListPage
                  token={auth?.token}
                  onAuthError={handleLogout}
                />
              </RequireAuth>
            }
          />

          <Route
            path="/todos/:id"
            element={
              <RequireAuth auth={auth}>
                <TodoDetailPage
                  token={auth?.token}
                  onAuthError={handleLogout}
                />
              </RequireAuth>
            }
          />

          <Route
            path="/about"
            element={<AboutPage />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
