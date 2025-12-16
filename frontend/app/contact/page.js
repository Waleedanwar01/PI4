'use client';

import { useEffect, useState } from 'react';
import { FiPhone, FiMail, FiUser, FiEdit } from 'react-icons/fi';

export default function Page() {
  const [cfg, setCfg] = useState({ phone: '', email: '' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(apiUrl('/api/site-config'), { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCfg({ phone: data.phone || '', email: data.email || '' });
        }
      } catch {}
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setSent(false);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (res.ok) {
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setSent(true);
      }
    } catch {}
    setSending(false);
  };

  return (
    <section className="bg-white">
      <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 overflow-hidden" style={{ backgroundImage: 'url(/images/about-home-page.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <p className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-widest">Get In Touch</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">We are here to help</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 ring-1 ring-blue-100">
                <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center"><FiPhone /></div>
                <div>
                  <p className="font-semibold text-gray-900">Our Phone</p>
                  <p className="text-sm text-gray-600">Office Telephone: {cfg.phone || '1-818-302-3060'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 ring-1 ring-blue-100">
                <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center"><FiMail /></div>
                <div>
                  <p className="font-semibold text-gray-900">Our Email</p>
                  <a href={`mailto:${cfg.email || 'FRPWoodlandHills@FoundationRP.com'}`} className="text-sm text-blue-600 font-semibold">{cfg.email || 'FRPWoodlandHills@FoundationRP.com'}</a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 text-white p-6 sm:p-8 shadow-xl">
              <p className="text-sm sm:text-base font-semibold mb-6">Call, email or send us a note.</p>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full rounded-md bg-white/10 border border-white/20 text-white placeholder-white/70 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-white/50" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"><FiUser /></span>
                  </div>
                  <div className="relative">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full rounded-md bg-white/10 border border-white/20 text-white placeholder-white/70 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-white/50" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"><FiMail /></span>
                  </div>
                </div>
                <div className="relative">
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full rounded-md bg-white/10 border border-white/20 text-white placeholder-white/70 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-white/50" />
                </div>
                <div className="relative">
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Additional information" rows={5} className="w-full rounded-md bg-white/10 border border-white/20 text-white placeholder-white/70 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-white/50" />
                  <span className="absolute right-3 top-3 text-white/80"><FiEdit /></span>
                </div>
                <button type="submit" className="w-full bg-black/70 hover:bg-black text-white font-bold py-3 rounded-md" disabled={sending}>{sending ? 'SENDING...' : 'SEND'}</button>
                {sent && <div className="text-center text-white/90 text-sm">Message sent</div>}
              </form>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 shadow flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center"><FiPhone className="text-white" /></div>
                <div>
                  <p className="text-sm">Call</p>
                  <p className="font-bold">{cfg.phone || '1-818-302-3060'}</p>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 shadow flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center"><FiMail className="text-white" /></div>
                <div>
                  <p className="text-sm">E-mail</p>
                  <p className="font-bold">{cfg.email || 'FRPWoodlandHills@FoundationRP.com'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

