async function fetchConfig() {
  try {
    const res = await fetch(apiUrl("/api/site-config"), { cache: "no-store" });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { apiUrl } from "@/app/lib/api";

async function fetchQuote() {
  try {
    const res = await fetch(apiUrl("/api/resources/quote"), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    return res.json();
  } catch {
    return {
      title: 'Get A Quote',
      intro_text: 'Select solutions to fit your needs',
      button_text: 'OR ASK AN AGENT',
      button_url: '',
      cards: [],
    };
  }
}

export default async function Page() {
  const data = await fetchQuote();
  const heroSrc = data.hero_image || "https://picsum.photos/seed/quote-hero/1600/800";
  return (
    <section className="bg-white">
      <div className="relative w-full h-56 sm:h-64 md:h-80 lg:h-[28rem] overflow-hidden" style={{ backgroundImage: `url(${heroSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            {data.intro_text && (
              <p className="text-blue-200 text-xs sm:text-sm font-semibold">{data.intro_text}</p>
            )}
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{data.title || 'Get A Quote'}</h1>
            <div className="mt-6">
              <Link href="/about/our-team" className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold">
                OR ASK AN AGENT
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {([...((data.cards) || [])].sort((a, b) => (a.order || 0) - (b.order || 0))).map((c, i) => {
            const content = (
              <div className={`group relative h-full rounded-2xl bg-white ring-1 ring-slate-200 transition duration-300 shadow-sm overflow-hidden ${c.active ? 'ring-2 ring-blue-600 bg-blue-50/50' : ''} hover:-translate-y-0.5 hover:shadow-2xl hover:ring-blue-500`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-blue-50/60 to-transparent" />
                {c.active && (
                  <div className="absolute top-0 right-0 m-3 px-2 py-1 text-xs font-bold rounded-md bg-blue-600 text-white shadow-sm">Active</div>
                )}
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3">
                    {c.icon ? (
                      <img src={c.icon} alt="" className="w-10 h-10 rounded-md object-cover ring-1 ring-slate-200" />
                    ) : (
                      <span className="w-10 h-10 rounded-md bg-blue-600/10 text-blue-700 grid place-items-center font-bold">{(c.title || '').slice(0,1)}</span>
                    )}
                    <h3 className="text-slate-900 font-extrabold text-lg leading-tight">{c.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{c.description}</p>
                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">Learn more <span className="text-blue-400 transform group-hover:translate-x-0.5 transition-transform">›</span></span>
                  </div>
                </div>
              </div>
            );
            const href = c.url || '#';
            const external = /^https?:\/\//i.test(href);
            if (external) {
              return (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="block">
                  {content}
                </a>
              );
            }
            return (
              <a key={i} href={href} className="block">
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata() {
  try {
    const data = await fetchQuote();
    return {
      title: data.meta_title || data.title || 'Get A Quote',
      description: data.meta_description || undefined,
    };
  } catch {}
  return { title: 'Get A Quote' };
}
