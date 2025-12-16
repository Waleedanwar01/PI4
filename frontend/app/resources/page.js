import Reveal from "../components/Reveal";

export default function Page() {
  const cards = [
    { title: "Claims", desc: "Submit and track insurance claims.", href: "/resources/claims" },
    { title: "Blogs", desc: "Read latest updates and guides.", href: "/resources/blogs" },
    { title: "FAQ", desc: "Answers to common questions.", href: "/resources/faq" },
  ];
  return (
    <section className="bg-white">
      <div
        className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden"
        style={{ backgroundImage: `url(https://picsum.photos/seed/resources/1600/900)`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-blue-900/60" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-blue-200 text-xs sm:text-sm font-semibold">Help Center</p>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold">Resources</h1>
            <p className="mt-2 text-blue-200 text-xs sm:text-sm">Claims, blogs, FAQs and helpful tools</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Reveal>
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <h2 className="text-slate-900 text-xl font-bold">Start here</h2>
                <p className="mt-2 text-slate-600 text-sm">Quick links to popular sections. Dive into guides and answers curated by our team.</p>
                <div className="mt-4 space-y-2">
                  {cards.map((c, i) => (
                    <a key={i} href={c.href} className="block rounded-lg px-3 py-2 bg-slate-50 ring-1 ring-slate-200 text-slate-800 text-sm hover:bg-slate-100">{c.title}</a>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((c, i) => (
                    <a key={i} href={c.href} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow transition">
                      <div className="flex items-center justify-between">
                        <h3 className="text-slate-900 font-semibold">{c.title}</h3>
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{c.desc}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function generateMetadata() { return { title: "Resources" }; }
