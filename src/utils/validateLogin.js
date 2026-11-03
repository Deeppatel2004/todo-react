export function validateLogin({ email, password }) {
  if (!email || !email.includes('@')) {
    return {
      ok: false,
      message: 'Please enter a valid email.'
    };
  }

  if (!password || password.length < 8) {
    return {
      ok: false,
      message: 'Password must be at least 8 characters.'
    };
  }

  return {
    ok: true
  };
}