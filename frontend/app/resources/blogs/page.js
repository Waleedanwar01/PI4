export const revalidate = 60;

import Link from "next/link";
import Reveal from "../../components/Reveal";
import { HiCalendar, HiUser } from "react-icons/hi";
import { apiUrl } from "@/app/lib/api";

async function fetchConfig() {
  try {
    const res = await fetch(apiUrl("/api/site-config"), { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

const PAGE_SIZE = 9;

async function fetchBlogs(page, category) {
  try {
    const url = new URL(apiUrl("/api/resources/blogs"));
    url.searchParams.set('page', page);
    url.searchParams.set('page_size', PAGE_SIZE);
    if (category) url.searchParams.set('category', category);
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('bad');
    const data = await res.json();
    if (!data.items || data.items.length === 0) throw new Error('empty');
    return data;
  } catch {
    const allBlogs = makeFakeBlogs(45);
    const filtered = category ? allBlogs.filter(b => (b.categories || []).some(n => n.toLowerCase().includes(String(category).toLowerCase()))) : allBlogs;
    const total_pages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const safePage = Math.min(Math.max(1, page), total_pages);
    const start = (safePage - 1) * PAGE_SIZE;
    const items = filtered.slice(start, start + PAGE_SIZE).map((b) => ({
      id: b.id, title: b.title, author: b.author, date: b.date, categories: b.categories, image: b.image,
    }));
    return { page: safePage, total_pages, total_items: filtered.length, items };
  }
}

function makeFakeBlogs(count) {
  const cats = ["Information", "Life-And-Health", "Cyber", "Business", "Auto", "Home"];
  const arr = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i * 3);
    arr.push({
      id: i + 1,
      title: `Sample Blog Post ${i + 1}`,
      author: "GASPAR",
      date: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      categories: [cats[i % cats.length], cats[(i + 1) % cats.length]].slice(0, (i % 2) + 1),
      image: `https://picsum.photos/seed/blog-${i + 1}/900/600`,
      slug: `sample-blog-${i + 1}`,
    });
  }
  return arr;
}

function buildPages(current, total) {
  const pages = [];
  const add = (p) => pages.push(p);
  add(1);
  let start = Math.max(2, current - 2);
  let end = Math.min(total - 1, current + 2);
  if (start > 2) add("ellipsis-left");
  for (let p = start; p <= end; p++) add(p);
  if (end < total - 1) add("ellipsis-right");
  if (total > 1) add(total);
  return pages;
}

export default async function Page({ searchParams }) {
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const category = (searchParams?.category || "").toString();
  const [data, config] = await Promise.all([fetchBlogs(page, category || undefined), fetchConfig()]);
  const safePage = data.page;
  const pages = buildPages(safePage, data.total_pages);
  const heroSrc = "https://picsum.photos/seed/blogs-hero/1600/800";
  const slug = "resources/blogs";
  const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "blogs")) || null;
  const pageTitle = meta?.title || "Blogs";

  return (
    <section className="bg-white">
      <div
        className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden"
        style={{ backgroundImage: `url(${heroSrc})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold px-6">{pageTitle}</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.map((b) => (
              <Link key={b.id} href={`/resources/blogs/${b.slug || `sample-blog-${b.id}`}`} className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 overflow-hidden transition hover:shadow-md">
                <div className="relative">
                   <img src={b.image} alt={b.title} className="w-full h-40 sm:h-48 md:h-56 object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    {b.categories.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-6 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-2"><HiCalendar className="w-4 h-4" />{b.date}</span>
                    <span className="inline-flex items-center gap-2"><HiUser className="w-4 h-4" />{b.author}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-extrabold text-slate-900 leading-snug">{b.title}</h3>
                </div>
              </Link>
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
                    href={`/resources/blogs?page=${p}`}
                    className={`${p === safePage ? 'bg-blue-700 text-white ring-1 ring-blue-700' : 'bg-white text-slate-800 ring-1 ring-slate-200'} px-4 py-3 rounded-md font-semibold`}
                  >
                    {p}
                  </Link>
                )
              ))}
            </nav>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export async function generateMetadata() {
  try {
    const config = await fetchConfig();
    const slug = "resources/blogs";
    const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "blogs")) || null;
    if (meta) {
      return {
        title: meta.meta_title || meta.title || "Blogs",
        description: meta.meta_description || undefined,
      };
    }
  } catch {}
  return { title: "Blogs" };
}
