
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { login } from '../api';
import { validateLogin } from '../utils/validateLogin';

// Handle API errors
function handleStatus(status) {
  if (status === 401) {
    return { message: 'Incorrect email or password.' };
  }

  if (status === 400) {
    return { message: 'Please check your email and password.' };
  }

  if (status >= 500) {
    return { message: 'Server error. Please try again later.' };
  }

  return { message: 'Login failed. Please try again.' };
}

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');

    // Validate inputs
    const validation = validateLogin({
      email,
      password
    });

    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    try {
      setLoading(true);

      // Call login API
      const data = await login(email, password);
      console.log('Login response:', {
  hasToken: Boolean(data.token),
  hasUser: Boolean(data.user),
  keys: Object.keys(data)
});

      // Save token and user in App.jsx
      onLogin({
        token: data.token,
        user: data.user
      });

    } catch (error) {
      if (error.status) {
        setError(handleStatus(error.status).message);
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <p className="error">{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>

      <p>
        Don't have an account?{' '}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
