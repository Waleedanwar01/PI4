export const dynamic = 'force-dynamic';

import Reveal from "../../../components/Reveal";
import { apiUrl } from "../../../lib/api";
import Link from "next/link";
import Image from "next/image";
import { HiCalendar, HiUser, HiTag } from "react-icons/hi";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

async function fetchBlog(slug) {
  try {
    const res = await fetch(apiUrl(`/api/resources/blogs/${slug}`), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    const data = await res.json();
    return data;
  } catch {
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    return {
      id: 0,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      author: "GASPAR",
      date,
      categories: ["Information", "Auto"],
      image: `https://picsum.photos/seed/${slug}-cover/1200/800`,
      excerpt: "",
      content_html: `<p>This is sample content for <strong>${slug}</strong>. Replace with real blog content in admin.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Vivamus sed justo consequat, ultrices nisl at, luctus orci.</p><h3>Section Heading</h3><p>Aliquam nec felis in velit porta dictum. Etiam vitae tortor sit amet purus vulputate placerat.</p><ul><li>Bullet one</li><li>Bullet two</li><li>Bullet three</li></ul>`
    };
  }
}

async function fetchPopular() {
  try {
    const res = await fetch(apiUrl(`/api/resources/blogs?page=1&page_size=5`), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    const data = await res.json();
    return data.items;
  } catch {
    return Array.from({ length: 5 }).map((_, i) => ({
      slug: `sample-blog-${i + 1}`,
      title: `Sample Blog Post ${i + 1}`,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    }));
  }
}

function interleaveImages(html, images, slug) {
  try {
    const blocks = (html || "")
      .split(/<\/p>/i)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (s.endsWith("</p>") ? s : s + "</p>"));
    if (!blocks.length) return html;
    const imgs = Array.isArray(images) ? images : [];
    let imgIdx = 0;
    const out = [];
    for (let i = 0; i < blocks.length; i++) {
      out.push(blocks[i]);
      if ((i + 1) % 2 === 0 && imgIdx < imgs.length) {
        const im = imgs[imgIdx++];
        const url = im?.url || `https://picsum.photos/seed/${slug}-inline-${i}/1000/600`;
        const cap = im?.caption || "";
        out.push(
          `<figure class="my-6 rounded-xl overflow-hidden ring-1 ring-slate-200 transition-transform duration-200 hover:scale-[1.01]">` +
            `<img src="${url}" alt="${cap || "Related image"}" class="w-full object-cover aspect-[16/9] h-[180px] sm:h-[220px] md:h-[260px]" />` +
            (cap ? `<figcaption class="p-3 text-xs text-slate-600">${cap}</figcaption>` : "") +
          `</figure>`
        );
      }
    }
    return out.join("");
  } catch {
    return html;
  }
}

async function fetchCategories() {
  try {
    const res = await fetch(apiUrl(`/api/resources/blog-categories`), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    const data = await res.json();
    return data.items || [];
  } catch {
    return ["Information","Life-And-Health","Cyber","Business","Auto","Home","Umbrella","Travel","Boat"].map((n) => ({ name: n, slug: n.toLowerCase().replace(/\s+/g,'-') }));
  }
}

export default async function Page({ params }) {
  const slug = params.slug;
  const blog = await fetchBlog(slug);
  const popular = await fetchPopular();
  const allCats = await fetchCategories();
  const heroSrc = blog.image || `https://picsum.photos/seed/${slug}-hero/1600/800`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/resources/blogs/${slug}`;
  const shareTwitter = `https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(blog.title)}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`;
  const shareLinkedIn = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(canonicalUrl)}&title=${encodeURIComponent(blog.title)}`;
  const primarySlug = (blog.primary_category || '').toLowerCase().replace(/\s+/g,'-');
  const randomCats = allCats.filter(c => c.slug !== primarySlug).sort(() => Math.random() - 0.5).slice(0, 8 - (primarySlug ? 1 : 0));
  const showCats = (primarySlug ? [{ name: blog.primary_category, slug: primarySlug }] : []).concat(randomCats);
  const interleavedHtml = interleaveImages(blog.content_html || blog.excerpt || "", blog.images || [], slug);

  return (
    <section className="bg-white">
      <div
        className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden"
        style={{ backgroundImage: `url(${heroSrc})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-center max-w-5xl px-6">{blog.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="flex items-center gap-6 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2"><HiCalendar className="w-4 h-4" />{blog.date}</span>
                <span className="inline-flex items-center gap-2"><HiUser className="w-4 h-4" />{blog.author}</span>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                {blog.categories.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white">{c}</span>
                ))}
              </div>
              <Image src={heroSrc} alt={blog.title} width={1600} height={900} className="mt-6 w-full rounded-xl object-cover aspect-[16/9] max-h-[360px] sm:max-h-[400px]" />
              {Array.isArray(blog.images) && blog.images.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {blog.images.slice(0, 3).map((im, i) => (
                    <figure key={i} className="rounded-xl overflow-hidden ring-1 ring-slate-200 transition-transform duration-200 hover:scale-[1.02]">
                      <Image src={im.url || `https://picsum.photos/seed/${slug}-extra-${i}/900/600`} alt={im.caption || blog.title} width={900} height={600} className="w-full object-cover aspect-[16/9] h-[180px] sm:h-[220px] md:h-[260px]" />
                      {im.caption && (<figcaption className="p-3 text-xs text-slate-600">{im.caption}</figcaption>)}
                    </figure>
                  ))}
                </div>
              )}
              <div className="prose prose-slate mx-auto max-w-3xl sm:max-w-4xl mt-8 [&_h1]:text-slate-900 [&_h2]:text-slate-900 [&_h3]:text-slate-900 [&_p]:leading-relaxed [&_p]:mt-4 [&_p]:mb-4 [&_h2]:mt-10 [&_h3]:mt-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mt-6 [&_ul]:mb-6 [&_li]:leading-relaxed [&_li]:mt-2 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:text-slate-700 [&_a]:text-blue-700 [&_a]:font-semibold [&_a]:hover:underline [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-extrabold [&_h3]:text-xl [&_h3]:font-bold [&_p]:text-base [&_p]:sm:text-lg [&_p]:text-slate-700" dangerouslySetInnerHTML={{ __html: interleavedHtml }} />

              <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
                <div className="text-slate-900 font-extrabold">Share:</div>
                <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start w-full sm:w-auto">
                  <a href={shareFacebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md hover:bg-blue-700/90 transition">
                    <FaFacebookF className="w-4 h-4" /> Facebook
                  </a>
                  <a href={shareTwitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-sky-500 text-white font-semibold shadow-sm hover:shadow-md hover:bg-sky-500/90 transition">
                    <FaTwitter className="w-4 h-4" /> Twitter
                  </a>
                  <a href={shareLinkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-800 text-white font-semibold shadow-sm hover:shadow-md hover:bg-blue-800/90 transition">
                    <FaLinkedinIn className="w-4 h-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6">
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
              <div className="mt-6 rounded-2xl bg-white ring-1 ring-slate-200 p-6">
                <h3 className="text-lg font-extrabold text-slate-900">Liked this article?</h3>
                <p className="mt-2 text-sm text-slate-600">Follow us</p>
                <div className="mt-3 flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                  <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-md bg-blue-700 text-white grid place-items-center transition-transform hover:scale-110">
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                  <a href={process.env.NEXT_PUBLIC_TWITTER_URL || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-md bg-sky-500 text-white grid place-items-center transition-transform hover:scale-110">
                    <FaTwitter className="w-4 h-4" />
                  </a>
                  <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-md bg-blue-800 text-white grid place-items-center transition-transform hover:scale-110">
                    <FaLinkedinIn className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-white ring-1 ring-slate-200 p-6">
                <h3 className="text-lg font-extrabold text-slate-900">Categories</h3>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {showCats.map((c, i) => (
                    <Link key={i} href={`/category/${encodeURIComponent(c.slug)}`} className="flex items-center gap-2 px-3 py-2 rounded-md ring-1 ring-slate-200 hover:ring-blue-300 transition text-sm">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white">
                        <HiTag className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-semibold text-slate-900">{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
              {Array.isArray(blog.images) && blog.images.length > 3 && (
                <div className="mt-6 rounded-2xl bg-white ring-1 ring-slate-200 p-6">
                  <h3 className="text-lg font-extrabold text-slate-900">Related Images</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {blog.images.slice(3).map((im, i) => (
                      <Image key={i} src={im.url || `https://picsum.photos/seed/${slug}-extra-side-${i}/600/400`} alt={im.caption || blog.title} width={600} height={400} className="w-full object-cover rounded-md ring-1 ring-slate-200 hover:ring-blue-300 transition aspect-[16/9] h-[120px] md:h-[140px]" />
                  ))}
                </div>
              </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  try {
    const res = await fetch(apiUrl(`/api/resources/blogs/${slug}`), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title || 'Blog',
        description: data.excerpt || '',
      };
    }
  } catch {}
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { title };
}
