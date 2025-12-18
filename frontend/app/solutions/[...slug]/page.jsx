export const dynamic = 'force-dynamic';

import Link from "next/link";
import Reveal from "../../components/Reveal";
import { ServiceDropdown, IndustryDropdown, ConsultantDropdown } from "../../components/SolutionDropdowns";
import { apiUrl } from "../../lib/api";

function pointsFromHtml(html) {
  try {
    const s = String(html || "");
    const li = Array.from(s.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)).map((m) => m[1].trim());
    if (li.length) return li;
    const paras = Array.from(s.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)).map((m) => m[1].trim()).filter(Boolean);
    if (paras.length) return paras;
    const lines = s
      .replace(/<br\s*\/>/gi, "\n")
      .replace(/<br\s*>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .split(/\n+/)
      .map((x) => x.trim())
      .filter(Boolean);
    return lines;
  } catch {
    return [];
  }
}
function introFromHtml(html) {
  try {
    const s = String(html || "");
    const beforeList = s.split(/<ul[\s\S]*?>|<ol[\s\S]*?>/i)[0];
    const m = beforeList.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (m && m[1]) return m[1].trim();
    const fallback = s.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (fallback && fallback[1]) return fallback[1].trim();
    return "";
  } catch {
    return "";
  }
}
function headingFromHtml(html) {
  try {
    const s = String(html || "");
    const m = s.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
    if (m && m[1]) return m[1].trim();
    return "";
  } catch {
    return "";
  }
}
function heroPlaceholder(slug) {
  const seed = String(slug || "solutions").split("/").pop() || "solutions";
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/900`;
}
const isPdf = (u) => {
  try { const x = String(u || ""); return x.toLowerCase().includes(".pdf"); } catch { return false; }
};
function embedUrl(u) {
  try {
    if (!u) return '';
    const x = new URL(u);
    const id = x.searchParams.get('v');
    if (id) return `https://www.youtube.com/embed/${id}`;
    const p = x.pathname.replace(new RegExp('^/+'), '');
    if (p.startsWith('shorts/')) return `https://www.youtube.com/embed/${p.split('/')[1]}`;
    if (p.startsWith('embed/')) return u;
    return u;
  } catch {
    return u || '';
  }
}

async function fetchSolution(slug) {
  try {
    const res = await fetch(apiUrl(`/api/resources/solutions/page/${slug}`), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    return await res.json();
  } catch {
    const base = String(slug || '').split('/').pop();
    const title = base.split('-').map(s => s ? (s[0].toUpperCase() + s.slice(1)) : '').join(' ');
    return {
      title,
      hero_subtitle: '',
      hero_image: '',
      body_html: '',
      button_text: '',
      button_url: '',
      phone: '',
      images: [],
      consultants: [],
      services: [],
      videos: [],
      industries: [],
    };
  }
}

async function fetchSiteConfig() {
  try {
    const res = await fetch(apiUrl("/api/site-config"), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    return await res.json();
  } catch {
    return { phone: "" };
  }
}

export default async function Page({ params }) {
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : String(params.slug || '');
  const data = await fetchSolution(slug);
  const config = await fetchSiteConfig();
  const heroSrc = data.hero_image || heroPlaceholder(slug);
  const ctaUrl = data.button_text ? (data.button_url || '/contact') : '';
  const parts = slug.split('/').filter(Boolean);
  const toTitle = (s) => s.split('-').map(x => x ? (x[0].toUpperCase() + x.slice(1)) : '').join(' ');
  const crumbItems = parts.map((p, i) => ({ name: toTitle(p), href: '/solutions/' + parts.slice(0, i + 1).join('/') }));
  const isFranchise = slug === 'special-programs/franchise-protection';
  const logoList = Array.isArray(data.images)
    ? Array.from(new Map((data.images || []).map((im) => [im.url, im])).values())
    : [];
  const marqueeImages = logoList;
  const phoneDisplay = data.phone || config.phone || '';
  
  
  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Enhanced Hero Section */}
      <div className="relative w-full">
        <div className="relative h-56 sm:h-72 md:h-96 lg:h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: 'url(' + heroSrc + ')' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-blue-900/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <Reveal y={50}>
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 drop-shadow-2xl">
                  {data.title || 'Solutions'}
                </h1>
              </Reveal>
              <Reveal y={50} delay={0.2}>
                {data.hero_subtitle ? (
                  <p className="mt-4 text-blue-100 text-lg sm:text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
                    {data.hero_subtitle}
                  </p>
                ) : null}
              </Reveal>
              <Reveal y={50} delay={0.4}>
                {ctaUrl ? (
                  <div className="mt-8 sm:mt-10">
                    <a
                      href={ctaUrl}
                      className="inline-flex items-center justify-center px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-bold hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25"
                      target={isPdf(ctaUrl) ? "_blank" : undefined}
                      rel={isPdf(ctaUrl) ? "noopener noreferrer" : undefined}
                    >
                      <span className="mr-2">{data.button_text}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                ) : null}
              </Reveal>
            </div>
          </div>
        </div>
        {/* Enhanced bottom gradient */}
        <div className="h-3 w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700" />
      </div>

      {/* Enhanced Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="py-6 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/solutions" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Solutions</Link>
          <span className="text-gray-400">›</span>
          {crumbItems.map((c, i) => (
            i < crumbItems.length - 1 ? (
              <span key={`bc-${i}`} className="flex items-center gap-2">
                <Link href={c.href} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">{c.name}</Link>
                <span className="text-gray-400">›</span>
              </span>
            ) : (
              <span key={`bc-last`} className="font-bold text-gray-900 text-base">{c.name}</span>
            )
          ))}
        </nav>
        
      </div>

      {/* Enhanced Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-16 md:pb-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16">
          {data.body_html ? (
            (() => {
              const pts = pointsFromHtml(data.body_html);
              const intro = introFromHtml(data.body_html);
              if (pts.length) {
                return (
                  <>
                    {(() => {
                      const heading = headingFromHtml(data.body_html);
                      return heading ? (
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-3">{heading}</h2>
                      ) : null;
                    })()}
                    {intro ? (
                      (() => {
                        const hasImg = /<img/i.test(intro);
                        return hasImg ? (
                          <div className="mb-4 max-w-7xl mx-auto" dangerouslySetInnerHTML={{ __html: intro }} />
                        ) : (
                          <p className="text-base sm:text-lg text-gray-700 mb-4 text-center max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: intro }} />
                        );
                      })()
                    ) : null}
                    <ul className="space-y-2 sm:space-y-3 list-disc list-inside marker:text-blue-600 text-gray-700 text-left max-w-3xl mx-auto">
                      {pts.map((it, k) => (
                        <li key={`bp-${k}`} className="leading-relaxed">
                          <span className="text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: it }} />
                        </li>
                      ))}
                    </ul>
                  </>
                );
              }
              return (
                <div className="prose prose-gray sm:prose-lg max-w-4xl mx-auto prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline text-center" dangerouslySetInnerHTML={{ __html: data.body_html }} />
              );
            })()
          ) : null}
          {Array.isArray(data.page_buttons) && data.page_buttons.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {data.page_buttons.map((b, i) => {
                const href = b.file_url || b.url || '#';
                const isPdf = !!b.file_url && String(b.file_url).toLowerCase().includes('.pdf');
                const downloadName = isPdf ? String(b.file_url).split('/').pop() : undefined;
                return (
                  <a
                    key={`pb-${i}`}
                    href={href}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                    target={isPdf ? "_blank" : undefined}
                    rel={isPdf ? "noopener noreferrer" : undefined}
                    download={downloadName}
                  >
                    {b.label}
                  </a>
                );
              })}
            </div>
          ) : null}
          {isFranchise && data.cards && data.cards.length > 0 ? (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900">{data.cards_title || 'Franchise Protection'}</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-3" />
                {data.cards_intro_html ? (
                  <p className="mt-4 text-gray-600 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: data.cards_intro_html }} />
                ) : null}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.cards.map((c, idx) => (
                  <Reveal key={`fc-${idx}`}>
                    <div className="rounded-2xl bg-gray-900 text-white overflow-hidden">
                      <div className="p-6 text-left leading-relaxed">
                        <div className="flex items-center gap-3 mb-3">
                          {c.icon ? (<img src={c.icon} alt="" className="w-8 h-8 object-contain" />) : null}
                          <h3 className="text-xl sm:text-2xl font-bold">{c.title}</h3>
                        </div>
                        {c.body_html ? (
                          (() => {
                            const pts = pointsFromHtml(c.body_html);
                            return pts.length ? (
                              <ul className="space-y-3">
                                {pts.map((it, k) => (
                                  <li key={`fpt-${k}`} className="flex items-start">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span className="text-white/80" dangerouslySetInnerHTML={{ __html: it }} />
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="prose prose-invert max-w-none prose-p:text-white/80 text-left" dangerouslySetInnerHTML={{ __html: c.body_html }} />
                            );
                          })()
                        ) : null}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
          {slug === 'special-programs/private-client' && data.cards && data.cards.length > 0 ? (
            <div className="mt-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900">{data.cards_title || 'Advantages of Private Client Insurance'}</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-3" />
                {data.cards_intro_html ? (
                  <p className="mt-4 text-gray-600 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: data.cards_intro_html }} />
                ) : null}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.cards.map((c, idx) => (
                  <Reveal key={`pc-${idx}`}>
                    <div className="rounded-2xl border border-gray-200 bg-gray-900 text-white shadow-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {c.icon ? (<img src={c.icon} alt="" className="w-8 h-8 object-contain" />) : null}
                          <h3 className="text-xl font-bold">{c.title}</h3>
                        </div>
                        {c.body_html ? (
                          (() => {
                            const pts = pointsFromHtml(c.body_html);
                            return pts.length ? (
                              <ul className="space-y-3">
                                {pts.map((it, k) => (
                                  <li key={`pcpt-${k}`} className="flex items-start">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span className="text-white/80" dangerouslySetInnerHTML={{ __html: it }} />
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="prose prose-invert max-w-none prose-p:text-white/80" dangerouslySetInnerHTML={{ __html: c.body_html }} />
                            );
                          })()
                        ) : null}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
          {slug === 'special-programs/workers-compensation' && data.cards && data.cards.length > 0 ? (
            <div className="mt-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900">{data.cards_title || "Workers' Compensation Highlights"}</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-3" />
                {data.cards_intro_html ? (
                  <p className="mt-4 text-gray-600 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: data.cards_intro_html }} />
                ) : null}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.cards.map((c, idx) => (
                  <Reveal key={`wc-${idx}`}>
                    <div className="rounded-2xl border border-gray-200 bg-gray-900 text-white shadow-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {c.icon ? (<img src={c.icon} alt="" className="w-8 h-8 object-contain" />) : null}
                          <h3 className="text-xl font-bold">{c.title}</h3>
                        </div>
                        {c.body_html ? (
                          (() => {
                            const pts = pointsFromHtml(c.body_html);
                            return pts.length ? (
                              <ul className="space-y-3">
                                {pts.map((it, k) => (
                                  <li key={`wcpt-${k}`} className="flex items-start">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span className="text-white/80" dangerouslySetInnerHTML={{ __html: it }} />
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="prose prose-invert max-w-none prose-p:text-white/80" dangerouslySetInnerHTML={{ __html: c.body_html }} />
                            );
                          })()
                        ) : null}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
          
          {slug === 'special-programs/consulting-services' ? (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">Professional Consulting Services</h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Our consulting services support employers with comprehensive training, written programs, and ongoing HR guidance, tailored to your specific operations and industry requirements.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    What We Provide
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">Comprehensive training programs tailored to your industry</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">Written compliance programs and documentation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">Ongoing HR guidance and support</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">Customized solutions for your specific operations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">Regulatory compliance monitoring and updates</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Our Approach
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">Industry-specific expertise and best practices</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">Proactive compliance management</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">Regular training and skill development</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">Risk assessment and mitigation strategies</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">Continuous support and consultation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* NEW DROPDOWN SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-8">
          {/* Services Dropdowns */}
          {data.services && data.services.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {data.services.map((service, index) => (
                <ServiceDropdown key={index} service={service} />
              ))}
            </div>
          )}

          {/* Industries Dropdown */}
          {data.industries && data.industries.length > 0 && (
            <IndustryDropdown industries={data.industries} />
          )}

          {/* Consultants Dropdown */}
          {data.consultants && data.consultants.length > 0 && (
            <ConsultantDropdown consultants={data.consultants} />
          )}
        </div>
      </div>

      {/* Continue with existing sections */}
      {slug === 'special-programs/dental-practice' && data.cards && data.cards.length > 0 ? (
        <div className="mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">{data.cards_title || 'What we offer'}</h2>
                {data.cards_intro_html ? (
                  <p className="mt-2 text-gray-600 max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: data.cards_intro_html }} />
                ) : null}
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.cards.map((c, idx) => (
                <Reveal key={`dc-${idx}`}>
                  <div className="rounded-2xl border border-gray-200 bg-gray-900 text-white shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        {c.icon ? (<img src={c.icon} alt="" className="w-8 h-8 object-contain" />) : null}
                        <h3 className="text-xl font-bold">{c.title}</h3>
                      </div>
                      {c.body_html ? (
                        (() => {
                          const pts = pointsFromHtml(c.body_html);
                          return pts.length ? (
                            <ul className="space-y-3">
                              {pts.map((it, k) => (
                                <li key={`pt-${k}`} className="flex items-start">
                                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                  <span className="text-white/80" dangerouslySetInnerHTML={{ __html: it }} />
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="prose prose-invert max-w-none prose-p:text-white/80" dangerouslySetInnerHTML={{ __html: c.body_html }} />
                          );
                        })()
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {data.videos && data.videos.length > 0 ? (
        <div className="mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <p className="text-indigo-600 text-sm font-bold uppercase tracking-wider mb-2">Featured Content</p>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Videos</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto" />
              </div>
            </Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {data.videos.map((v, i) => (
                <Reveal key={`rv-${i}`}>
                  <div className="group rounded-3xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
                    <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      <iframe
                        src={embedUrl(v.youtube_url)}
                        className="w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen={true}
                      ></iframe>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{v.title}</h3>
                      {v.description_html ? (
                        <div className="prose prose-gray max-w-none prose-p:text-gray-600" dangerouslySetInnerHTML={{ __html: v.description_html }} />
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {data.services && data.services.length > 0 ? (
        <div className="mt-20 bg-gradient-to-br from-gray-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-16">
                <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">What We Offer</p>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Consulting Services</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto" />
              </div>
            </Reveal>
            <div className="space-y-12">
              {data.services.map((s, i) => {
                const gradients = [
                  'from-yellow-400 to-orange-500',
                  'from-emerald-400 to-teal-500',
                  'from-blue-400 to-indigo-500',
                  'from-purple-400 to-pink-500',
                  'from-red-400 to-rose-500'
                ];
                const gradient = gradients[i % gradients.length];
                return (
                  <Reveal key={`rs-${i}`}>
                    <div className="group relative rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white hover:-translate-y-1">
                      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${gradient}`} />
                      <div className="p-8 sm:p-10">
                        <div className="flex items-start justify-between mb-6">
                          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 flex-1">{s.title}</h3>
                          <div className={`ml-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        {s.description_html ? (
                          <div className="prose prose-lg prose-gray max-w-none mb-6 prose-p:text-gray-700 prose-headings:text-gray-900" dangerouslySetInnerHTML={{ __html: s.description_html }} />
                        ) : null}
                        {s.pricing_html ? (
                          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                            <div className="prose max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: s.pricing_html }} />
                          </div>
                        ) : null}
                        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                          {s.buttons && s.buttons.length > 0 ? s.buttons.map((b, j) => {
                            const href = b.file_url || b.url || '#';
                            const pdf = isPdf(href);
                            const downloadName = pdf && b.file_url ? href.split('/').pop() : undefined;
                            return (
                              <a
                                key={`b-${i}-${j}`}
                                href={href}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                target={pdf ? "_blank" : undefined}
                                rel={pdf ? "noopener noreferrer" : undefined}
                                download={downloadName}
                              >
                                {b.label}
                              </a>
                            );
                          }) : null}
                          {s.learn_more_url ? (
                            <a href={s.learn_more_url} className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-blue-300 hover:text-blue-600 transition-all duration-200">
                              Learn more
                            </a>
                          ) : null}
                          {s.schedule_url ? (
                            <a href={s.schedule_url} className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200">
                              Schedule
                            </a>
                          ) : null}
                          {s.upcoming_url ? (
                            <a href={s.upcoming_url} className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-purple-300 hover:text-purple-600 transition-all duration-200">
                              Upcoming classes
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {data.industries && data.industries.length > 0 ? (
        <div className="mt-20">
          <div className="relative w-full">
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <Reveal>
                  <div className="text-center mb-16">
                    <p className="text-blue-300 text-sm font-bold uppercase tracking-wider mb-2">Our Expertise</p>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Industries We Specialize In</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto" />
                  </div>
                </Reveal>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                  {data.industries.map((i, idx) => (
                    <Reveal key={`ri-${idx}`} delay={idx * 0.1}>
                      <div className="group relative rounded-2xl border border-white/10 p-6 lg:p-8 text-center bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-white/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                          {i.icon ? (
                            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 p-3 group-hover:scale-110 transition-transform duration-300">
                              <img src={i.icon} alt={i.name} className="w-full h-full object-contain filter brightness-0 invert" />
                            </div>
                          ) : (
                            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                              </svg>
                            </div>
                          )}
                          <h3 className="text-base lg:text-lg font-bold text-white group-hover:text-blue-200 transition-colors duration-300">{i.name}</h3>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {data.consultants && data.consultants.length > 0 ? (
        <div className="mt-20 bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-16">
                <p className="text-indigo-600 text-sm font-bold uppercase tracking-wider mb-2">Our Team</p>
                <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Expert Consultants</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto" />
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {data.consultants.map((c, idx) => (
                <Reveal key={`rc-${idx}`} delay={idx * 0.1}>
                  <div className="group relative rounded-3xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2">
                    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {c.photo ? (
                        <img
                          src={c.photo}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                          <svg className="w-20 h-20 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">{c.name}</h3>
                      {c.title ? (
                        <p className="text-sm font-semibold text-indigo-600 mb-4 uppercase tracking-wider">{c.title}</p>
                      ) : null}
                      {c.intro_html ? (
                        <div className="text-gray-600 mb-6 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: c.intro_html }} />
                      ) : null}
                      <div className="flex gap-3">
                        {c.email ? (
                          <a
                            href={`mailto:${c.email}`}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                          </a>
                        ) : null}
                        {c.phone ? (
                          <a
                            href={`tel:${c.phone}`}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {data.images && data.images.length > 0 ? (
        isFranchise ? (
          <div className="mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="text-center mb-10">
                  <p className="text-indigo-600 text-sm font-bold uppercase tracking-wider mb-2">Our Clients</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Insured Franchises</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto" />
                </div>
              </Reveal>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-7 min-h-[10rem] sm:min-h-[12rem]">
                <div className="flex items-center gap-6 sm:gap-10 whitespace-nowrap" style={{ animation: 'slideLeft 24s linear infinite' }}>
                  {marqueeImages.map((im, idx) => (
                    <div key={`logo-${idx}`} className="h-32 sm:h-40 md:h-44 flex items-center">
                      <img src={im.url} alt={im.caption || ''} className="h-full w-auto object-contain drop-shadow brightness-110" />
                    </div>
                  ))}
                </div>
                <style>{`@keyframes slideLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }`}</style>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="text-center mb-16">
                  <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">Visual Showcase</p>
                <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Gallery</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto" />
                </div>
              </Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {data.images.map((im, idx) => (
                  <Reveal key={`rg-${idx}`} delay={idx * 0.05}>
                    <div className="group relative rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        <img
                          src={im.url}
                          alt={im.caption || ''}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {im.caption ? (
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-sm font-medium">{im.caption}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        )
      ) : null}

      <div className="mt-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Reveal>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">Get in Touch</h3>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">We're ready to help with the right solution.</p>
              {(phoneDisplay || data.button_text) ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {phoneDisplay ? (
                    <a
                      href={`tel:${String(phoneDisplay || '').replace(/[^+\d]/g, '')}`}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 text-white font-bold backdrop-blur border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {phoneDisplay}
                    </a>
                  ) : null}
                  {data.button_text ? (
                    <a
                      href={ctaUrl}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-blue-700 font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
                      target={isPdf(ctaUrl) ? "_blank" : undefined}
                      rel={isPdf(ctaUrl) ? "noopener noreferrer" : undefined}
                    >
                      {data.button_text}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </a>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-blue-700 font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    Contact Us
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </a>
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
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : String(params.slug || '');
  const data = await fetchSolution(slug);
  const title = data.meta_title || data.title || 'Solutions';
  const description = data.meta_description || (data.hero_subtitle || 'Explore our solutions');
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: data.hero_image ? [data.hero_image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: data.hero_image ? [data.hero_image] : undefined,
    },
  };
}