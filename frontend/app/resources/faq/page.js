export const dynamic = 'force-dynamic';

import Reveal from "../../components/Reveal";
import { apiUrl } from "../../lib/api";
import FaqAccordion from "./FaqAccordion";

async function fetchConfig() {
  try {
    const res = await fetch(apiUrl("/api/site-config"), { cache: "no-store" });
    if (!res.ok) return {};
    return res.json();
  } catch {
    return {};
  }
}

async function fetchFaqs() {
  try {
    const res = await fetch(apiUrl(`/api/resources/faq`), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    const data = await res.json();
    return data.groups || [];
  } catch {
    return [
      { category: "Auto", items: [
        { id: 1, question: "Do I need a car rental insurance?", answer_html: "<p>It depends on your policy and credit card benefits.</p>" },
        { id: 2, question: "Will an accident affect my insurance?", answer_html: "<p>Claims may impact premiums based on fault and severity.</p>" },
      ]},
      { category: "Business", items: [
        { id: 3, question: "How do I get a certificate?", answer_html: "<p>Contact support with policy details to receive a certificate.</p>" },
      ]},
      { category: "Life & Health", items: [
        { id: 4, question: "Can I switch my health insurance now?", answer_html: "<p>During open enrollment you can switch.</p>" },
      ]},
    ];
  }
}

export default async function Page() {
  const [groups, config] = await Promise.all([fetchFaqs(), fetchConfig()]);
  const slug = "resources/faq";
  const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "faq")) || null;
  const pageTitle = meta?.title || "Frequently asked questions";
  const heroSrc = `https://picsum.photos/seed/faq-hero/1600/800`;
  
  return (
    <section className="bg-white min-h-screen">
      <div className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden" style={{ backgroundImage: `url(${heroSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-blue-900/60" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-blue-100 text-xs sm:text-sm font-semibold tracking-wide">Ask us anything</p>
            <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{pageTitle}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Reveal>
          <FaqAccordion groups={groups} />
        </Reveal>
      </div>
    </section>
  );
}

export async function generateMetadata() {
  try {
    const config = await fetchConfig();
    const slug = "resources/faq";
    const meta = ((config.pages_meta || []).find((m) => (m.slug || "") === slug || (m.slug || "") === "faq")) || null;
    if (meta) {
      return {
        title: meta.meta_title || meta.title || "Frequently asked questions",
        description: meta.meta_description || undefined,
      };
    }
  } catch {}
  return { title: "Frequently asked questions" };
}
