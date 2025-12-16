async function fetchConfig() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/site-config", { cache: "no-store" });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

export default async function Page() {
  const config = await fetchConfig();
  const slug = "about/team";
  const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "team")) || null;
  const pageTitle = meta?.title || "Our Team";
  return (
    <section className="min-h-[60vh] bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">{pageTitle}</h1>
        <p className="text-gray-600 text-lg">Content coming soon.</p>
      </div>
    </section>
  );
}

export async function generateMetadata() {
  try {
    const config = await fetchConfig();
    const slug = "about/team";
    const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "team")) || null;
    if (meta) {
      return {
        title: meta.meta_title || meta.title || "Our Team",
        description: meta.meta_description || undefined,
      };
    }
  } catch {}
  return { title: "Our Team" };
}
