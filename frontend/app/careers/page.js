import { apiUrl } from "../lib/api";

async function fetchConfig() {
  try {
    const res = await fetch(apiUrl("/api/site-config"), { cache: "no-store" });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function Page() {
  const config = await fetchConfig();
  const slug = "careers";
  const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug)) || null;
  const pageTitle = meta?.title || "FRP Careers";
  return (
    <section className="min-h-[60vh] bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">{pageTitle}</h1>
        <p className="text-gray-600 text-lg">Explore opportunities with Foundation Risk Partners.</p>
        <div className="mt-8">
          <a href="https://foundationrp.com/careers/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">
            FRP Careers
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h4a1 1 0 011 1v4M7 17l10-10" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata() {
  try {
    const config = await fetchConfig();
    const slug = "careers";
    const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug)) || null;
    if (meta) {
      return {
        title: meta.meta_title || meta.title || "FRP Careers",
        description: meta.meta_description || undefined,
      };
    }
  } catch {}
  return { title: "FRP Careers" };
}
