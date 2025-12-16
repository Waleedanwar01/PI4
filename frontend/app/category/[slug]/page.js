export const dynamic = 'force-dynamic';

import Link from "next/link";
import Reveal from "../../components/Reveal";
import { HiCalendar, HiUser } from "react-icons/hi";
import { apiUrl } from "../../lib/api";

async function fetchConfig() {
  try {
    const res = await fetch(apiUrl("/api/site-config"), { cache: "no-store" });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

const PAGE_SIZE = 9;

function buildPages(current, total) {
  const pages = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);
  if (start > 1) pages.push(1, "ellipsis-left");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total) pages.push("ellipsis-right", total);
  return pages;
}

function makeFakeBlogs(count, category) {
  const cats = ["Information", "Life-And-Health", "Cyber", "Business", "Auto", "Home", "COVID-19"]; 
  const arr = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i * 3);
    const itemCats = [cats[i % cats.length]];
    arr.push({
      id: i + 1,
      title: `Sample ${itemCats[0]} Post ${i + 1}`,
      author: "GASPAR",
      date: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      categories: itemCats,
      image: `https://picsum.photos/seed/${(category || itemCats[0]).toLowerCase()}-${i + 1}/900/600`,
      slug: `${(itemCats[0]).toLowerCase().replace(/\s+/g,'-')}-post-${i + 1}`,
    });
  }
  return arr;
}

async function fetchCategoryBlogs(slug, page, q) {
  try {
    const url = new URL(apiUrl(`/api/resources/blogs`));
    url.searchParams.set('page', page);
    url.searchParams.set('page_size', PAGE_SIZE);
    url.searchParams.set('category', slug);
    if (q) url.searchParams.set('q', q);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    const data = await res.json();
    return data;
  } catch {
    let all = makeFakeBlogs(36, slug);
    if (q) {
      const ql = String(q).toLowerCase();
      all = all.filter(b => (b.title || '').toLowerCase().includes(ql));
    }
    const total_pages = Math.ceil(all.length / PAGE_SIZE) || 1;
    const safePage = Math.min(Math.max(1, page), total_pages);
    const start = (safePage - 1) * PAGE_SIZE;
    const items = all.slice(start, start + PAGE_SIZE);
    return { page: safePage, total_pages, total_items: all.length, items };
  }
}

async function fetchPopular() {
  try {
    const res = await fetch(apiUrl(`/api/resources/blogs?page=1&page_size=5`), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    const data = await res.json();
    return data.items || [];
  } catch {
    return Array.from({ length: 5 }).map((_, i) => ({
      slug: `sample-blog-${i + 1}`,
      title: `Sample Blog Post ${i + 1}`,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    }));
  }
}

async function fetchCategories() {
  try {
    const res = await fetch(apiUrl(`/api/resources/blog-categories`), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    const data = await res.json();
    return data.items || [];
  } catch {
    return ["Information","Life-And-Health","Cyber","Business","Auto","Home","Umbrella","Travel","Boat","COVID-19"].map((n) => ({ name: n, slug: n.toLowerCase().replace(/\s+/g,'-') }));
  }
}

export default async function Page({ params, searchParams }) {
  const slug = params.slug;
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const q = (searchParams?.q || "").toString();
  const [data, config] = await Promise.all([fetchCategoryBlogs(slug, page, q || undefined), fetchConfig()]);
  const pages = buildPages(data.page, data.total_pages);
  const pmSlug = `category/${slug}`;
  const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === pmSlug || (m.slug || "") === "category")) || null;
  const title = meta?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const heroSrc = `https://picsum.photos/seed/category-${encodeURIComponent(slug)}/1600/800`;
  const popular = await fetchPopular();
  const allCats = await fetchCategories();

  return (
    <section className="bg-white">
      <div className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden" style={{ backgroundImage: `url(${heroSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold px-6">{title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="space-y-10">
                {data.items.map((b) => (
                  <article key={b.id} className="rounded-2xl bg-white ring-1 ring-slate-200 overflow-hidden">
                    <div className="relative">
                      <img src={b.image} alt={b.title} className="w-full object-cover aspect-[16/9] h-[220px] sm:h-[260px]" />
                      <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                        {(b.categories || []).map((c, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-6 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-2"><HiCalendar className="w-4 h-4" />{b.date}</span>
                        <span className="inline-flex items-center gap-2"><HiUser className="w-4 h-4" />{b.author}</span>
                      </div>
                      <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">{b.title}</h2>
                      <p className="mt-3 text-slate-700 text-sm sm:text-base leading-relaxed">{b.excerpt || ""}</p>
                      <div className="mt-4">
                        <Link href={`/resources/blogs/${b.slug || `sample-blog-${b.id}`}`} className="inline-flex items-center justify-center px-5 py-3 bg-slate-900 text-white rounded-md font-semibold hover:bg-slate-800 transition-colors">
                          READ MORE
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-3">
                  {pages.map((p, idx) => (
                    p === "ellipsis-left" || p === "ellipsis-right" ? (
                      <span key={idx} className="px-4 py-3 rounded-md ring-1 ring-slate-200 text-slate-500">…</span>
                    ) : (
                      <Link
                        key={idx}
                        href={`/category/${encodeURIComponent(slug)}?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                        className={`${p === data.page ? 'bg-blue-700 text-white ring-1 ring-blue-700' : 'bg-white text-slate-800 ring-1 ring-slate-200'} px-4 py-3 rounded-md font-semibold`}
                      >
                        {p}
                      </Link>
                    )
                  ))}
                </nav>
              </div>
            </Reveal>

            
          </div>

          <div className="lg:col-span-4">
            <Reveal>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6">
                <h3 className="text-lg font-extrabold text-slate-900">Search</h3>
                <form action={`/category/${encodeURIComponent(slug)}`} method="GET" className="mt-3 flex">
                  <input name="q" defaultValue={q} placeholder="Search..." className="flex-1 px-3 py-2 rounded-l-md ring-1 ring-slate-200 focus:outline-none" />
                  <button type="submit" className="px-4 py-2 rounded-r-md bg-blue-600 text-white font-semibold">Go</button>
                </form>
              </div>
              <div className="mt-6 rounded-2xl bg-white ring-1 ring-slate-200 p-6">
                <h3 className="text-lg font-extrabold text-slate-900">Categories</h3>
                <ul className="mt-4 space-y-2">
                  {allCats.slice(0, 12).map((c, i) => (
                    <li key={i}>
                      <Link href={`/category/${encodeURIComponent(c.slug)}`} className="flex items-center justify-between px-3 py-2 rounded-md ring-1 ring-slate-200 hover:ring-blue-300 transition text-sm font-semibold text-slate-900">
                        <span>{c.name}</span>
                        <span className="text-slate-400">›</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 rounded-2xl bg-white ring-1 ring-slate-200 p-6">
                <h3 className="text-lg font-extrabold text-slate-900">Popular Feeds</h3>
                <ul className="mt-4 space-y-3">
                  {popular.map((p, idx) => (
                    <li key={idx}>
                      <Link href={`/resources/blogs/${p.slug || `sample-blog-${idx + 1}`}`} className="block">
                        <div className="text-slate-900 font-semibold leading-snug">{p.title}</div>
                        <div className="text-xs text-slate-500">{p.date}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        
      </div>
    </section>
  );
}

export async function generateMetadata({ params }) {
  try {
    const config = await fetchConfig();
    const slug = params.slug;
    const pmSlug = `category/${slug}`;
    const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === pmSlug || (m.slug || "") === "category")) || null;
    const fallback = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    if (meta) {
      return {
        title: meta.meta_title || meta.title || fallback,
        description: meta.meta_description || undefined,
      };
    }
    return { title: fallback };
  } catch {}
  const fallback = params.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: fallback };
}
