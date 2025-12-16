import { apiUrl } from "../lib/api";
import Reveal from "../components/Reveal";

async function fetchTree() {
  try {
    const res = await fetch(apiUrl("/api/resources/solutions/tree"), { cache: "no-store" });
    if (!res.ok) return { items: [] };
    return res.json();
  } catch {
    return { items: [] };
  }
}

export default async function Page() {
  const data = await fetchTree();
  const roots = Array.isArray(data.items) ? data.items : [];
  return (
    <section className="bg-white">
      <div
        className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden"
        style={{ backgroundImage: `url(https://picsum.photos/seed/solutions/1600/900)`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-blue-900/60" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-blue-200 text-xs sm:text-sm font-semibold">Explore</p>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold">Insurance Solutions</h1>
            <p className="mt-2 text-blue-200 text-xs sm:text-sm">Find coverage for individuals and businesses</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Reveal>
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <h2 className="text-slate-900 text-xl font-bold">Choose a category</h2>
                <p className="mt-2 text-slate-600 text-sm">Browse our solution groups. Each category includes programs and services tailored to your needs.</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {roots.slice(0,4).map((it, idx) => (
                    <a key={idx} href={`/solutions/${it.slug}`} className="rounded-lg px-3 py-2 bg-slate-50 ring-1 ring-slate-200 text-slate-800 text-sm hover:bg-slate-100">{it.title}</a>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roots.length > 0 ? (
                    roots.map((it, idx) => (
                      <a key={idx} href={`/solutions/${it.slug}`} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow transition">
                        <div className="flex items-center justify-between">
                          <h3 className="text-slate-900 font-semibold">{it.title}</h3>
                          <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                        </div>
                        {Array.isArray(it.children) && it.children.length > 0 && (
                          <div className="mt-3 text-sm text-slate-600">
                            {(it.children.slice(0,4)).map((c,i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>{c.title}</span>
                              </div>
                            ))}
                            {it.children.length > 4 && (<div className="text-slate-500 mt-1">+{it.children.length - 4} more</div>)}
                          </div>
                        )}
                      </a>
                    ))
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">Menu coming soon.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      
      </div>
    </section>
  );
}

export async function generateMetadata() {
  return { title: "Solutions" };
}
