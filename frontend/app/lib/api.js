export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'https://pi4-cf9i.onrender.com').replace(/\/+$/, '');

export function apiUrl(path = '') {
  const p = String(path || '').replace(/^\/+/, '');
  return `${API_BASE}/${p}`;
}

export async function apiFetch(path, init) {
  const url = apiUrl(path);
  return fetch(url, init);
}
