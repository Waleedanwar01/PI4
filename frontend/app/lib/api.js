export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || (process.env.NODE_ENV === 'production' ? 'https://pi4-cf9i.onrender.com' : 'http://127.0.0.1:8000')).replace(/\/+$/, '');

export function apiUrl(path = '') {
  const p = String(path || '');
  return `${API_BASE}/${p.replace(/^\/+/, '')}`;
}

export async function apiFetch(path, init) {
  const url = apiUrl(path);
  return fetch(url, init);
}
