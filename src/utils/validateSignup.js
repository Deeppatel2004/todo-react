
export function validateSignup({ email, password }) {
  if (
    !email ||
    email.split('@').length !== 2 ||
    !email.split('@')[0] ||
    !email.split('@')[1]
  ) {
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
