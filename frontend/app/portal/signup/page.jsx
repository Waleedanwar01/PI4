'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Reveal from '../../components/Reveal';
import { apiUrl } from "@/app/lib/api";

function embedUrl(u) {
  try {
    if (!u) return '';
    const x = new URL(u);
    const id = x.searchParams.get('v');
    if (id) return `https://www.youtube.com/embed/${id}`;
    const p = x.pathname.replace(/^\/+/, '');
    if (p.startsWith('shorts/')) return `https://www.youtube.com/embed/${p.split('/')[1]}`;
    if (p.startsWith('embed/')) return u;
    return u;
  } catch {
    return u || '';
  }
}

export default function Page() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [policy, setPolicy] = useState('');
  const [password, setPassword] = useState('');
  const [portal, setPortal] = useState({ portal_url: '', features: [], appstore_ios_url: '', appstore_android_url: '', videos: [], hero_image: '' });
  const [cfgLogo, setCfgLogo] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r1 = await fetch(apiUrl('/api/portal/page'), { cache: 'no-store' });
        if (r1.ok) {
          const d = await r1.json();
          setPortal({
            portal_url: d.portal_url || '',
            features: Array.isArray(d.features) ? d.features.slice(0, 6) : [],
            appstore_ios_url: d.appstore_ios_url || '',
            appstore_android_url: d.appstore_android_url || '',
            videos: Array.isArray(d.videos) ? d.videos : [],
            hero_image: d.hero_image || '',
          });
        }
      } catch {}
      try {
        const r2 = await fetch('http://localhost:8000/api/site-config', { cache: 'no-store' });
        if (r2.ok) {
          const c = await r2.json();
          setCfgLogo(c.logo_url || '');
        }
      } catch {}
    })();
    (async () => {
      try {
        const r = await fetch('http://localhost:8000/api/auth/me', { credentials: 'include' });
        if (r.ok) {
          const d = await r.json();
          if (d && d.ok) setUser({ email: d.email });
        }
      } catch {}
    })();
  }, []);

  

  const portalUrl = portal.portal_url || process.env.NEXT_PUBLIC_PORTAL_URL || 'https://gasparinsurance.com/gaspar-customer-portal/';
  async function handleSignup(e) {
    e.preventDefault();
    if (!email || !password) return;
    try {
      const res = await fetch(apiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, phone, policyNumber: policy }),
      });
      if (res.ok) {
        window.location.href = `/portal?email=${encodeURIComponent(email)}`;
      }
    } catch {}
  }

  return (
    <section className="bg-white">
      <div className="relative w-full overflow-hidden">
        <div className="relative h-40 sm:h-56 md:h-64 overflow-hidden" style={{ backgroundImage: `url(${portal.hero_image || '/images/logos/allied-insurance.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-blue-900/70" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold">Create New Account</h1>
              <p className="text-blue-200 mt-2">Access policies, ID cards, certificates, claims and more</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              {cfgLogo ? (<img src={cfgLogo} alt="Logo" className="h-10 w-auto object-contain" />) : null}
              <h2 className="text-xl font-extrabold text-slate-900">Create Account</h2>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 px-3 py-2" placeholder="Enter email" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                <input name="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 px-3 py-2" placeholder="Enter phone" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Policy Number</label>
                <input name="policyNumber" type="text" value={policy} onChange={e => setPolicy(e.target.value)} className="w-full rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 px-3 py-2" placeholder="Enter policy number" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 px-3 py-2" placeholder="Enter password" />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 transition">Create Account</button>
              <div className="flex justify-between items-center text-sm">
                <Link href="/portal" className="text-blue-600 font-semibold">Back</Link>
                <a href={portalUrl} className="text-blue-600 font-semibold">Trouble Logging In?</a>
              </div>
            </form>
            {portal.videos && portal.videos.length ? (
              <div className="mt-8">
                <iframe src={embedUrl(portal.videos[0])} className="w-full h-52 rounded-xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}></iframe>
              </div>
            ) : null}
          </div>

          <div>
            <Reveal>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-8">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Account access at your fingertips</h3>
                <ul className="space-y-3">
                  {(portal.features || []).map((t, i) => (
                    <li key={`pt-${i}`} className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-blue-600" /><span className="text-slate-700">{t}</span></li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/portal" className="text-blue-600 font-semibold">Back to Login</Link>
                </div>
              </div>
            </Reveal>

            <div className="mt-8 rounded-2xl bg-white ring-1 ring-slate-200 p-8 text-center">
              <p className="text-slate-700">Download our MyAccess App</p>
              <div className="mt-4 flex items-center justify-center gap-4">
                <a href={portal.appstore_ios_url || portalUrl} className="inline-block"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10" /></a>
                <a href={portal.appstore_android_url || portalUrl} className="inline-block"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Google Play" className="h-12" /></a>
              </div>
              <div className="mt-6">
                {user ? (
                  <a href={portalUrl} className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-slate-900 text-white font-semibold">Go to portal now</a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
