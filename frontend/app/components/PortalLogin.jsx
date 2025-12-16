'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiUrl } from '../lib/api';

export default function PortalLogin({ onSuccess, portalUrl, detailsOnly, guard }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const e = params.get('email') || '';
      if (e) setEmail(e);
    } catch {}
    (async () => {
      try {
        const r = await fetch(apiUrl('/api/auth/me'), { credentials: 'include' });
        if (r.ok) {
          const d = await r.json();
          if (d && d.ok) setUser({ email: d.email, phone: d.phone, policy_number: d.policy_number });
          else if (guard) window.location.href = '/portal/signup';
        } else if (guard) {
          window.location.href = '/portal/signup';
        }
      } catch {}
    })();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setOk(false);
    if (!email || !password) { setError('Enter email and password'); return; }
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (!res.ok) {
        const t = await res.text();
        setError(t || 'Login failed');
      } else {
        setOk(true);
        try {
          const r = await fetch(apiUrl('/api/auth/me'), { credentials: 'include' });
          if (r.ok) {
            const d = await r.json();
            if (d && d.ok) setUser({ email: d.email, phone: d.phone, policy_number: d.policy_number });
          }
        } catch {}
        if (typeof onSuccess === 'function') onSuccess();
        else window.location.href = '/portal';
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  }

  async function doLogout() {
    setError('');
    try {
      const r = await fetch(apiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' });
      if (r.ok) {
        setUser(null);
        setOk(false);
      }
    } catch {}
  }

  if (detailsOnly && !user) return null;
  if (user) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-green-50 text-green-700 ring-1 ring-green-200 p-2 text-sm">Logged in</div>
        <div className="rounded-md ring-1 ring-slate-200 p-4">
          <p className="text-sm text-slate-600">Email</p>
          <p className="font-semibold text-slate-900">{user.email}</p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Phone</p>
              <p className="font-semibold text-slate-900">{user.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Policy Number</p>
              <p className="font-semibold text-slate-900">{user.policy_number || '-'}</p>
            </div>
          </div>
        </div>
        <Link href="/" className="w-full inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 transition">Go Home</Link>
        <button onClick={doLogout} className="w-full inline-flex items-center justify-center px-6 py-3 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800 transition">Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 px-3 py-2" placeholder="Enter email" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 px-3 py-2" placeholder="Enter password" />
      </div>
      {error ? (<div className="rounded-md bg-red-50 text-red-700 ring-1 ring-red-200 p-2 text-sm">{error}</div>) : null}
      {ok ? (<div className="rounded-md bg-green-50 text-green-700 ring-1 ring-green-200 p-2 text-sm">Logged in</div>) : null}
      <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 transition">{loading ? 'Logging in...' : 'Login'}</button>
    </form>
  );
}
