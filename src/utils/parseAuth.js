export function parseAuth(raw) {
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);

    if (!data.token) {
      return null;
    }

    return {
      token: data.token,
      user: data.user
    };
  } catch {
    return null;
  }
}