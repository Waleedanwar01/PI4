export const dynamic = 'force-dynamic';

import Reveal from "../../components/Reveal";
import { apiUrl } from "../../lib/api";

async function fetchPage(slug) {
  try {
    const res = await fetch(apiUrl(`/api/legal/${encodeURIComponent(slug)}`), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    return res.json();
  } catch {
    const t = String(slug || '').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    return { slug, title: t ? t[0].toUpperCase() + t.slice(1) : 'Page', body_html: '<p>Content coming soon.</p>' };
  }
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function addAnchors(html) {
  let i = 0;
  const used = new Map();
  return String(html || '').replace(/<(h2|h3)[^>]*>([\s\S]*?)<\/\1>/gi, (_m, tag, inner) => {
    const base = slugify(inner) || `section-${i++}`;
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    const id = count ? `${base}-${count + 1}` : base;
    return `<${tag} id="${id}" class="group">${inner}<a href="#${id}" class="ml-2 no-underline text-blue-600 opacity-0 group-hover:opacity-100">#</a></${tag}>`;
  });
}

function extractToc(html) {
  const items = [];
  const rx = /<(h2|h3)[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = rx.exec(html))) {
    items.push({ level: m[1], id: m[2], text: m[3].replace(/<[^>]*>/g, '').trim() });
  }
  return items;
}

export default async function Page({ params }) {
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : String(params.slug || '');
  const data = await fetchPage(slug);
  const heroSrc = `https://picsum.photos/seed/legal-${encodeURIComponent(slug || 'page')}/1600/800`;
  const htmlWithAnchors = addAnchors(data.body_html || '');
  const toc = extractToc(htmlWithAnchors);
  return (
    <section className="bg-white">
      <div className="relative w-full">
        <div className="relative h-44 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroSrc})` }} />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-blue-900/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12),transparent_60%)]" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-blue-200 text-xs sm:text-sm font-semibold">Legal</p>
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold">{data.title}</h1>
              {data.updated_at && (
                <p className="mt-2 text-blue-200 text-xs">Updated {new Date(data.updated_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <Reveal>
                  <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow p-6 sm:p-8">
                    <div
                  className="prose prose-slate lg:prose-lg max-w-none [&_p]:mb-4 [&_p]:leading-7 [&_ul]:my-5 [&_ol]:my-5 [&_li]:mt-2 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-24 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:text-slate-700 [&_img]:rounded-lg [&_img]:w-full [&_img]:h-auto [&_table]:w-full [&_table]:text-sm [&_table]:border [&_th]:bg-slate-50 [&_td]:border"
                  dangerouslySetInnerHTML={{ __html: htmlWithAnchors }}
                />
                  </div>
                </Reveal>
              </div>
              <div className="lg:col-span-4">
                {toc.length > 0 && (
                  <Reveal>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow p-5 lg:sticky lg:top-24">
                  <div className="text-slate-900 font-bold">On this page</div>
                  <nav className="mt-3 space-y-2">
                    {toc.map((it) => (
                      <a key={it.id} href={`#${it.id}`} className={`block text-sm px-3 py-2 rounded-md hover:bg-slate-100 ${it.level === 'h3' ? 'pl-6 text-slate-600' : 'text-slate-800 font-medium'}`}>{it.text}</a>
                    ))}
                  </nav>
                </div>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
    </section>
  );
}
