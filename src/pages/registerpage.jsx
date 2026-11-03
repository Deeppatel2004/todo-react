
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { register } from '../api';
import { validateSignup } from '../utils/validateSignup';

export default function RegisterPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');

    // Validate signup details
    const validation = validateSignup({
      email,
      password
    });

    if (!validation.ok) {
      setError(validation.message || 'Please check your details.');
      return;
    }

    try {
      setLoading(true);

      // Register user
      const data = await register(email, password);

      // Automatically log in after registration
      onLogin({
        token: data.token,
        user: data.user
      });

    } catch (error) {
      if (error.status === 409) {
        setError('That email is already registered.');
      } else if (error.status === 400) {
        setError(error.message);
      } else if (error.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <h2>Register</h2>

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
            placeholder="Create a password"
          />
        </div>

        {error && (
          <p className="error">{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
