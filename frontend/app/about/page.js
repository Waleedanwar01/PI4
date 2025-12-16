"use client";

import { useEffect, useState, useRef } from "react";
import { apiUrl } from "../lib/api";
import Reveal from "../components/Reveal";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const [data, setData] = useState({ title: "About Us", hero_subtitle: "", hero_image: "", body_html: "", images: [] });
  const [stats, setStats] = useState([]);
  const [teams, setTeams] = useState([]);
  const [config, setConfig] = useState({ phone: '', email: '' });
  const statsRef = useRef(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [aboutRes, statsRes, teamRes, cfgRes] = await Promise.all([
          fetch(apiUrl("/api/about/page"), { cache: "no-store" }),
          fetch(apiUrl("/api/about/stats"), { cache: "no-store" }),
          fetch(apiUrl("/api/teams/groups"), { cache: "no-store" }),
          fetch(apiUrl("/api/site-config"), { cache: "no-store" }),
        ]);
        if (aboutRes.ok) setData(await aboutRes.json());
        if (statsRes.ok) {
          const js = await statsRes.json();
          setStats(js.items || []);
        }
        if (teamRes.ok) {
          const js = await teamRes.json();
          const flat = (js.groups || []).flatMap((g) => (g.members || []).map((m) => ({
            name: m.name,
            role: m.rank,
            src: m.photo_url,
            linkedin: m.linkedin_url,
          })));
          setTeams(flat);
        }
        if (cfgRes.ok) setConfig(await cfgRes.json());
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setStartCount(true);
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [stats.length]);

  const heroSrc = data.hero_image || "/images/about-home-page.png";
  const phoneDisplay = config.phone || "1-818-302-3060";
  const phoneHref = `tel:${(config.phone || "+18183023060").replace(/[^+\d]/g, "")}`;

  return (
    <section className="bg-white">
      <div className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden" style={{ backgroundImage: `url(${heroSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            {data.hero_subtitle && <p className="text-blue-200 text-xs sm:text-sm font-semibold">{data.hero_subtitle}</p>}
            <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold">{data.title || 'About Us'}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex items-center justify-center gap-6">
          <a href={phoneHref} className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-blue-600 text-white font-semibold">Call {phoneDisplay}</a>
          {config.email && (
            <a href={`mailto:${config.email}`} className="inline-flex items-center justify-center px-5 py-2 rounded-md ring-1 ring-slate-200 bg-white text-slate-900 font-semibold">Email {config.email}</a>
          )}
        </div>
        {(() => {
          const html = String(data.body_html || "");
          const parts = html
            .split(/<\/p>/i)
            .map((s) => s.trim())
            .filter(Boolean)
            .map((s) => (s.endsWith("</p>") ? s : s + "</p>"));
          const first = parts[0] || "";
          const rest = parts.slice(1).join("");
          const imgs = Array.isArray(data.images) ? [...data.images].sort((a,b) => (a.order ?? 0) - (b.order ?? 0)) : [];
          const img1 = imgs[0];
          const img2 = imgs[1];
          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <Reveal>
                  <div className="rounded-md bg-yellow-50 border-l-2 border-yellow-400 p-3 sm:p-4">
                    <div className="text-slate-900 italic text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: first }} />
                  </div>
                </Reveal>
                {rest && (
                  <Reveal>
                    <div className="mt-8 prose prose-slate max-w-none [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: rest }} />
                  </Reveal>
                )}
              </div>
              <div className="space-y-8">
                {img1 && (
                  <Reveal>
                    <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 bg-white shadow">
                      <Image src={img1.url} alt={img1.caption || "About image"} width={1200} height={800} className="w-full h-80 object-cover" />
                      {img1.caption && (
                        <div className="p-4">
                          <p className="text-sm text-slate-700">{img1.caption}</p>
                        </div>
                      )}
                    </div>
                  </Reveal>
                )}
                {img2 && (
                  <Reveal>
                    <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 bg-white shadow">
                      <Image src={img2.url} alt={img2.caption || "About image"} width={1200} height={800} className="w-full h-80 object-cover" />
                      {img2.caption && (
                        <div className="p-4">
                          <p className="text-sm text-slate-700">{img2.caption}</p>
                        </div>
                      )}
                    </div>
                  </Reveal>
                )}
              </div>
            </div>
          );
        })()}

        <div ref={statsRef} className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(stats.length ? stats : [
            { label: 'Years in Business', value: 13, suffix: '' },
            { label: 'Carrier Partners', value: 246, suffix: '' },
            { label: 'Bound Policies', value: 23000, suffix: '' },
            { label: 'Annual Premiums in US$', value: 67000000, suffix: '' },
          ]).map((s, idx) => (
            <div key={idx} className="rounded-xl bg-white ring-1 ring-slate-200 p-6 shadow-sm">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {startCount ? (
                  <CountUp to={s.value} />
                ) : (
                  0
                )}
              </div>
              <div className="mt-2 text-slate-600 text-sm">{s.suffix || s.label}</div>
            </div>
          ))}
        </div>

        {teams.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 text-center">Your Agents, Advisors and Friends</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
              {teams.slice(0, 6).map((m, i) => (
                <Link key={i} href={`/team/${String(m.name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}`} className="w-64 rounded-xl overflow-hidden border border-gray-200 shadow bg-white">
                  <div className="relative h-64 w-full bg-slate-100">
                    {m.src ? (
                      <Image src={m.src} alt={m.name} width={600} height={800} className="w-full h-64 object-cover" />
                    ) : (
                      <div className="w-full h-64 bg-slate-100" />
                    )}
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener" className="absolute top-2 left-2 w-6 h-6 grid place-items-center rounded-md bg-blue-600 text-white text-xs font-bold">in</a>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-slate-900 font-bold leading-snug">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.role}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CountUp({ to = 0, duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const cur = Math.floor(p * to);
      setVal(cur);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, duration]);
  return <span>{val.toLocaleString()}</span>;
}
