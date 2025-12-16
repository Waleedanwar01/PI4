import { apiUrl } from "../../lib/api";

async function fetchCommunity() {
  try {
    const res = await fetch(apiUrl("/api/community/page"), { next: { revalidate: 10 } });
    if (!res.ok) return { title: "Community Outreach", hero_image: "", hero_subtitle: "", sections: [] };
    return res.json();
  } catch (error) {
    console.error("Error fetching community:", error);
    return { title: "Community Outreach", hero_image: "", hero_subtitle: "", sections: [] };
  }
}

async function fetchConfig() {
  try {
    const res = await fetch(apiUrl("/api/site-config"), { cache: "no-store" });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

import Reveal from "../../components/Reveal";
import { HiOutlineGift } from "react-icons/hi2";

export default async function Page() {
  const [data, config] = await Promise.all([fetchCommunity(), fetchConfig()]);
  const slug = "about/community-outreach";
  const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "community-outreach")) || null;
  const pageTitle = meta?.title || data.title || "Community Outreach";
  const DEFAULT_SECTIONS = [
    {
      title: "Nonprofits We Support",
      description: "Local organizations making a difference in our communities.",
      items: [
        { title: "West Valley Family YMCA", description: "Programs that empower youth and families.", image: "/images/team/Emily-Kaplan-Headshot-2.jpg", button_text: "Donate Now", button_url: "#" },
        { title: "Valley Cultural Foundation", description: "Arts and culture programs across the Valley.", image: "/images/team/TL-Web-1024x1536.jpg", button_text: "Learn More", button_url: "#" },
        { title: "Boys & Girls Club", description: "Safe spaces and opportunities for youth.", image: "/images/team/Charity-Headshot-1.jpg", button_text: "Get Involved", button_url: "#" },
      ],
    },
    {
      title: "Local Business Spotlights",
      description: "Businesses giving back to the community.",
      items: [
        { title: "Jersey Mike's", description: "Meals donated for frontline heroes.", image: "/images/team/christy-opt.jpg", button_text: "Email Daniel", button_url: "mailto:daniel@example.com" },
        { title: "Duffy Kruspodin, LLP", description: "Annual fundraising and volunteering.", image: "/images/team/josh-opt.jpg", button_text: "Visit Website", button_url: "#" },
      ],
    },
    {
      title: "Additional Resources",
      description: "Guides and materials for nonprofits and teams.",
      items: [
        { title: "Common Exposures for Nonprofits", description: "Risk topics all nonprofits should review.", image: "", button_text: "Download", button_url: "#" },
        { title: "Preventing Office Ergonomic Injuries", description: "Tips to reduce workplace strain.", image: "", button_text: "Read Guide", button_url: "#" },
        { title: "90 Ideas to Cut Costs", description: "Practical ideas to save money.", image: "", button_text: "View", button_url: "#" },
      ],
    },
    {
      title: "Recent Community Efforts",
      description: "Highlights from our latest activities and cleanups.",
      items: [
        { title: "Woodland Hills Clean up", description: "Recurring effort every other Saturday.", image: "/images/team/tim-f-opt.jpg", button_text: "Join Next Event", button_url: "#" },
        { title: "Thank You First Responders", description: "Partnered with local businesses to provide meals.", image: "/images/team/tim-f-opt.jpg", button_text: "See Photos", button_url: "#" },
      ],
    },
  ];
  const sections = (data.sections && data.sections.length > 0) ? data.sections : DEFAULT_SECTIONS;
  const toPlaceholder = (key) => `https://picsum.photos/seed/${encodeURIComponent(key || 'community')}/900/600`;
  const normalizedSections = sections.map((s) => ({
    ...s,
    items: (s.items || []).map((it) => ({
      ...it,
      image: toPlaceholder(it.title)
    }))
  }));
  const flatItems = normalizedSections.flatMap((s) => (s.items || []).map((it) => ({ ...it })));
  return (
    <section className="bg-white">
      <div
        className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden"
        style={{ backgroundImage: `url(${data.hero_image || "/images/about-home-page.png"})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold">{pageTitle}</h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto -mt-8 sm:-mt-10 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 text-xs font-semibold">FRP Cares</span>
            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-black text-gray-900">We care about our community</h2>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div className="mt-6 rounded-2xl bg-blue-50 ring-1 ring-blue-100 p-6">
              <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                WE ARE COMMITTED TO THE COMMUNITIES WHERE WE DO BUSINESS BECAUSE IT’S WHERE OUR PEOPLE ARE: OUR EMPLOYEES, OUR CUSTOMERS, AND OUR PARTNERS. FRP CARES IS OUR EFFORT TO HIGHLIGHT THE WORK BEING DONE TO STRENGTHEN OUR COMMUNITY BY LOCAL NONPROFITS, COMMUNITY PARTNERS, AND OTHER BUSINESS LEADERS.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <p className="uppercase tracking-widest text-xs text-blue-600">Around the nation</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">Join us and support our local charities and small businesses</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { title: "West Valley Family YMCA", img: "https://picsum.photos/seed/ymca/800/600", text: "Programs that empower youth and families across our region." },
              { title: "Valley Cultural Foundation", img: "https://picsum.photos/seed/vcf/800/600", text: "Arts and culture initiatives bringing communities together." },
              { title: "West Valley Boys & Girls Club", img: "https://picsum.photos/seed/bgclub/800/600", text: "Safe spaces, mentorship, and growth opportunities for youth." },
              { title: "Day of Service", img: "https://picsum.photos/seed/service/800/600", text: "Hands-on volunteering alongside local partners and neighbors." },
            ].map((card, idx) => (
              <Reveal key={idx} className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                <img src={card.img} alt={card.title} className="w-full h-44 object-cover" />
                <div className="p-5">
                  <h3 className="text-slate-900 font-semibold">{card.title}</h3>
                  <p className="mt-2 text-slate-600 text-sm">{card.text}</p>
                  <div className="mt-4">
                    <a href="#" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 transition-colors text-sm font-semibold">
                      <HiOutlineGift className="w-4 h-4" />
                      Donate Now
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-900 mb-10">Local Businesses Setting Examples</h2>
          </Reveal>
          <div className="space-y-10">
            {[
              {
                title: "Jersey Mike's",
                text: "Our friends Charshay and Daniel are doing great things for our frontline healthcare workers. They are almost halfway to their goal of donating 3,000 subs!",
                img: "https://picsum.photos/seed/jerseymikes/900/600",
                buttons: [
                  { label: "Email Daniel", href: "mailto:daniel@example.com" },
                  { label: "Jersey Mike's locations", href: "https://www.jerseymikes.com/locations" },
                ],
              },
              {
                title: "Duffy Kruspodin, LLP",
                text: "Certified Public Accountants giving back to the community through fundraising and volunteering.",
                img: "https://picsum.photos/seed/duffy/900/600",
                buttons: [
                  { label: "Donate to your local nonprofit", href: "#" },
                  { label: "Visit Duffy Kruspodin, LLP", href: "https://dkllp.com/" },
                ],
              },
              {
                title: "Detail Garage",
                text: "Detail Garage helps our community with care packages and support for local departments and hospitals.",
                img: "https://picsum.photos/seed/detailgarage/900/600",
                buttons: [
                  { label: "Email the team", href: "mailto:team@example.com" },
                  { label: "Visit Online Store", href: "https://detailgarage.com/" },
                ],
              },
            ].map((item, idx) => (
              <Reveal key={idx}>
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4">
                    <img src={item.img} alt={item.title} className="w-full h-56 object-cover rounded-xl shadow-sm" />
                  </div>
                  <div className="md:col-span-8">
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-slate-600 text-sm">{item.text}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {item.buttons.map((b, i) => (
                        <a key={i} href={b.href} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 transition-colors text-sm font-semibold">
                          {b.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-900 mb-10">More Community Highlights</h2>
          </Reveal>
          <div className="space-y-12">
            {flatItems.map((item, idx) => (
              <Reveal key={idx}>
                <div className={`grid md:grid-cols-12 gap-6 items-center`}>
                  {idx % 2 === 0 ? (
                    <>
                      <div className="md:col-span-5">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-56 object-cover rounded-xl shadow-sm" />
                        ) : (
                          <div className="w-full h-56 rounded-xl bg-slate-100" />
                        )}
                      </div>
                      <div className="md:col-span-7">
                        <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                        {item.description && <p className="mt-2 text-slate-600 text-sm">{item.description}</p>}
                        {item.button_url && item.button_text && (
                          <div className="mt-4">
                            <a href={item.button_url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 transition-colors text-sm font-semibold">{item.button_text}</a>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-7 order-2 md:order-1">
                        <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                        {item.description && <p className="mt-2 text-slate-600 text-sm">{item.description}</p>}
                        {item.button_url && item.button_text && (
                          <div className="mt-4">
                            <a href={item.button_url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-100 transition-colors text-sm font-semibold">{item.button_text}</a>
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-5 order-1 md:order-2">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-56 object-cover rounded-xl shadow-sm" />
                        ) : (
                          <div className="w-full h-56 rounded-xl bg-slate-100" />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Nomination form moved to global Footer (conditional render on this route) */}
    </section>
  );
}

export async function generateMetadata() {
  try {
    const config = await fetchConfig();
    const slug = "about/community-outreach";
    const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "community-outreach")) || null;
    if (meta) {
      return {
        title: meta.meta_title || meta.title || "Community Outreach",
        description: meta.meta_description || undefined,
      };
    }
  } catch {}
  return { title: "Community Outreach" };
}
