export const dynamic = 'force-dynamic';

import { apiUrl } from "../../lib/api";
import { CarrierDropdown, QuickTipsDropdown } from "../../components/CarrierDropdowns";

async function fetchClaims() {
  try {
    const res = await fetch(apiUrl("/api/resources/claims"), { cache: 'no-store' });
    if (!res.ok) return { title: "Claims", hero_image: "", hero_subtitle: "", body_html: "" };
    return res.json();
  } catch (e) {
    return { title: "Claims", hero_image: "", hero_subtitle: "", body_html: "" };
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

export default async function Page() {
  const [data, config] = await Promise.all([fetchClaims(), fetchConfig()]);
  const slug = "resources/claims";
  const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "claims")) || null;
  const pageTitle = meta?.title || data.title || "Claims";
  const blocks = (data.body_html || "")
    .split(/<\/p>/i)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith("</p>") ? s : s + "</p>"));

  const blocksNoNotes = blocks.filter((b) => !/\bNote:\b/i.test(b));

  const introHtml = data.hero_subtitle
    ? `<p>${data.hero_subtitle}</p>`
    : (blocks[0] || "");

  const restHtml = data.hero_subtitle
    ? (data.body_html || "")
    : blocks.slice(1).join("");

  const heroSrc = data.hero_image || "https://picsum.photos/seed/claims-hero/1600/800";

  const carrierBlocks = blocksNoNotes.filter((html) => {
    const hasLink = /<a[\s\S]*?>[\s\S]*?<\/a>/i.test(html);
    const hasDigits = /\d{3}[- ]?\d{3}[- ]?\d{4}/.test(html) || /tel:\d+/i.test(html);
    const hasStrong = /<strong>[\s\S]*?<\/strong>/i.test(html);
    return hasLink || hasDigits || hasStrong;
  });
  const isHeading = (html) => /<(a|strong)[\s\S]*?>[\s\S]*?<\/(a|strong)>/i.test(html);
  const isPhone = (html) => /\d{3}[- ]?\d{3}[- ]?\d{4}/.test(html) || /tel:\d+/i.test(html);
  const pairs = [];
  for (let i = 0; i < blocksNoNotes.length; i++) {
    const h = blocksNoNotes[i];
    const n = blocksNoNotes[i + 1] || "";
    if (isHeading(h) && isPhone(n)) {
      pairs.push(`<div>${h}${n}</div>`);
      i++;
    }
  }
  let carriersHtml = pairs.length ? pairs.join("") : carrierBlocks.join("");
  carriersHtml = carriersHtml.replace(/<p[^>]*>\s*Note:[\s\S]*?<\/p>/gi, "");

  return (
    <section className="bg-white">
      <div
        className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden"
        style={{ backgroundImage: `url(${heroSrc})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-blue-900/70" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold">{pageTitle}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700">Best Practices</h2>
            {data.hero_image && (
              <img src={data.hero_image} alt={data.title || 'Claims'} className="w-full max-w-3xl mx-auto mt-6 rounded-2xl object-cover aspect-[16/9]" />
            )}
            <div className="mt-6 text-slate-800 text-base leading-relaxed">
              <p>Always take photographs for documentation. If you have witnesses, make sure you have their full name and contact phone number. Always write down as much as you can remember regarding the details of an auto accident immediately after it occurs. You may be asked to recount the event at a later date with an adjuster or an attorney and one's recollection may fade with time. If they do, your notes become invaluable.</p>
              <p className="mt-4">Please find your carrier below and have your policy number ready. You will speak to the claims department and explain your situation.</p>
            </div>
            <h3 className="mt-10 text-xl sm:text-2xl font-extrabold text-blue-700">Carrier Claims Reporting Links and Contact Information</h3>
            <div className="mt-4 text-slate-700 text-sm leading-relaxed">
              <p>The contact information below can you please used to submit claims via phone or online to these carriers. We encourage our customers to talk to their agent or account manager here at Gaspar Insurance before submitting a claim if possible as we can give advice and otherwise assist.</p>
              <p className="mt-2">If you do not see your company listed below, please contact our office directly at 818 302 3060 or see the "claims reporting number" in your insurance policy.</p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* DROPDOWN SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-8">
          {/* Carrier Information Dropdown */}
          <CarrierDropdown carriersHtml={carriersHtml} />
          
          {/* Quick Tips Dropdown */}
          <QuickTipsDropdown />
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Reveal>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 [column-fill:_balance] text-slate-800 text-sm leading-relaxed [&_p]:mb-2 [&_strong]:text-gray-700 [&_strong]:font-semibold [&_a]:text-gray-700 [&_a]:font-semibold [&_a]:hover:underline" dangerouslySetInnerHTML={{ __html: carriersHtml }} />
          </Reveal>
        </div>
      </div>

    </section>
  );
}

export async function generateMetadata() {
  try {
    const config = await fetchConfig();
    const slug = "resources/claims";
    const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "claims")) || null;
    if (meta) {
      return {
        title: meta.meta_title || meta.title || "Claims",
        description: meta.meta_description || undefined,
      };
    }
  } catch {}
  return { title: "Claims" };
}