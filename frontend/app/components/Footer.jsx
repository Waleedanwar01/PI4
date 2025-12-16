"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiExternalLink, FiLinkedin, FiArrowUp, FiMessageSquare, FiPhone, FiMail } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Reveal from "./Reveal";
import { apiUrl } from "../lib/api";

export default function Footer({ config = {} }) {
  const [open, setOpen] = useState({ ca: false, az: false, nj: false });
  const [showTop, setShowTop] = useState(false);
  const [legalPages, setLegalPages] = useState([]);
  const toggle = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }));
  const pathname = usePathname();
  const phoneDisplay = config.phone || "1-818-302-3060";
  const phoneHref = `tel:${(config.phone || "+18183023060").replace(/[^+\d]/g, "")}`;
  const smsHref = `sms:${(config.phone || "+18183023060").replace(/[^+\d]/g, "")}`;
  const emailDisplay = config.email || "FRPWoodlandHills@FoundationRP.com";
  const emailHref = `mailto:${config.email || "FRPWoodlandHills@FoundationRP.com"}`;

  useEffect(() => {
    const onScroll = () => setShowTop((window.scrollY || 0) > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/legal"), { cache: "no-store" });
        if (!res.ok) return;
        const js = await res.json();
        setLegalPages(Array.isArray(js.items) ? js.items : []);
      } catch {}
    })();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {pathname === "/about/community-outreach" && (
          <div className="mb-12">
            <Reveal>
              <h2 className="text-white text-3xl font-extrabold text-center mb-8">Nominate a Nonprofit</h2>
            </Reveal>
            <Reveal>
              <form action={apiUrl("/api/community/nominate")} method="POST" className="space-y-4 max-w-3xl mx-auto">
                <input name="nonprofit_name" placeholder="Which Nonprofit do you want to nominate?" className="w-full bg-slate-800 text-white border border-slate-700 rounded-md px-4 py-3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="years_established" placeholder="How many years has the organization been established?" className="w-full bg-slate-800 text-white border border-slate-700 rounded-md px-4 py-3" />
                  <input name="areas_served" placeholder="What areas do they serve?" className="w-full bg-slate-800 text-white border border-slate-700 rounded-md px-4 py-3" />
                </div>
                <textarea name="community_impact" placeholder="How does this organization give back to the community?" className="w-full bg-slate-800 text-white border border-slate-700 rounded-md px-4 py-3 h-28" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input name="your_name" placeholder="Your Name" className="w-full bg-slate-800 text-white border border-slate-700 rounded-md px-4 py-3" />
                  <input name="your_email" placeholder="Your Email" className="w-full bg-slate-800 text-white border border-slate-700 rounded-md px-4 py-3" />
                  <input name="your_phone" placeholder="Your Phone Number" className="w-full bg-slate-800 text-white border border-slate-700 rounded-md px-4 py-3" />
                </div>
                <textarea name="relationship_description" placeholder="Please describe your relationship to the organization" className="w-full bg-slate-800 text-white border border-slate-700 rounded-md px-4 py-3 h-28" />
                <button type="submit" className="w-full sm:w-auto px-6 py-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700">Send</button>
              </form>
            </Reveal>
          </div>
        )}
        {/* Top contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <a href={phoneHref} className="group flex items-center justify-between rounded-2xl p-6 bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl ring-1 ring-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FiPhone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white/90 text-sm">Call</div>
                <div className="text-white text-lg font-bold tracking-wide">{phoneDisplay}</div>
              </div>
            </div>
            <div className="opacity-20 group-hover:opacity-30 transition-opacity">
              <svg viewBox="0 0 120 120" className="w-20 h-20"><circle cx="60" cy="60" r="50" fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="6" /></svg>
            </div>
          </a>
          <a href={emailHref} className="group flex items-center justify-between rounded-2xl p-6 bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl ring-1 ring-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FiMail className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white/90 text-sm">E-mail</div>
                <div className="text-white text-lg font-bold tracking-wide">{emailDisplay}</div>
              </div>
            </div>
            <div className="opacity-20 group-hover:opacity-30 transition-opacity">
              <svg viewBox="0 0 120 120" className="w-20 h-20"><rect x="20" y="20" width="80" height="60" fill="none" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="6" rx="8" /></svg>
            </div>
          </a>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <img src={config.logo_url || "/images/logos/foundation-risk-partners-logo.png"} alt="Logo" className="h-8 w-auto filter brightness-0 invert" />
              <span className="text-white/80 text-sm"></span>
            </div>
            <nav className="flex items-center gap-6 text-white/90 text-sm">
              <Link href="/" className="hover:text-blue-400">Home</Link>
              <Link href="/solutions" className="hover:text-blue-400">Solutions</Link>
              <Link href="/about" className="hover:text-blue-400">About</Link>
              <Link href="/blog" className="hover:text-blue-400">Blog</Link>
              <Link href="/contact" className="hover:text-blue-400">Contact Us</Link>
            </nav>
          </div>

          <hr className="border-white/10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-white/90 font-semibold mb-4">Addresses</h3>
              {(config.addresses && config.addresses.length > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {config.addresses.slice(0,3).map((a, idx) => (
                    <div key={idx} className="rounded-xl bg-white/5 p-4">
                      {a.label && <div className="text-white font-semibold mb-2">{a.label}</div>}
                      <div className="text-white/80 text-sm">
                        {a.line1 && <div>{a.line1}</div>}
                        {a.line2 && <div>{a.line2}</div>}
                        <div>{[a.city, a.state, a.postal_code].filter(Boolean).join(", ")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <button onClick={() => toggle("ca")} className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg px-4 py-3">
                    <span>California</span>
                    <FiChevronDown className={`transition-transform ${open.ca ? "rotate-180" : ""}`} />
                  </button>
                  {open.ca && (
                    <ul className="pl-5 text-white/80 text-sm space-y-1">
                      <li>Woodland Hills</li>
                      <li>Los Angeles</li>
                      <li>San Diego</li>
                    </ul>
                  )}
                  <button onClick={() => toggle("az")} className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg px-4 py-3">
                    <span>Arizona</span>
                    <FiChevronDown className={`transition-transform ${open.az ? "rotate-180" : ""}`} />
                  </button>
                  {open.az && (
                    <ul className="pl-5 text-white/80 text-sm space-y-1">
                      <li>Phoenix</li>
                      <li>Scottsdale</li>
                    </ul>
                  )}
                  <button onClick={() => toggle("nj")} className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-lg px-4 py-3">
                    <span>New Jersey</span>
                    <FiChevronDown className={`transition-transform ${open.nj ? "rotate-180" : ""}`} />
                  </button>
                  {open.nj && (
                    <ul className="pl-5 text-white/80 text-sm space-y-1">
                      <li>Jersey City</li>
                      <li>Newark</li>
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-white/90 font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="flex items-center gap-2 text-white/80 hover:text-white">
                    ePay by Credit or Check (ACH)
                    <FiExternalLink className="opacity-70" />
                  </a>
                </li>
                <li>
                  <Link href="/careers" className="text-white/80 hover:text-white">Careers</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/80 hover:text-white">Contact Us</Link>
                </li>
                <li>
                  <div className="flex items-center gap-3">
                    {config.social && config.social.facebook ? (
                      <a href={config.social.facebook} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                        <FaFacebook className="w-5 h-5" />
                        Facebook
                      </a>
                    ) : null}
                    {config.social && config.social.instagram ? (
                      <a href={config.social.instagram} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                        <FaInstagram className="w-5 h-5" />
                        Instagram
                      </a>
                    ) : null}
                    {config.social && config.social.twitter ? (
                      <a href={config.social.twitter} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                        <FaTwitter className="w-5 h-5" />
                        Twitter
                      </a>
                    ) : null}
                    {config.social && config.social.youtube ? (
                      <a href={config.social.youtube} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                        <FaYoutube className="w-5 h-5" />
                        YouTube
                      </a>
                    ) : null}
                    {config.social && config.social.linkedin ? (
                      <a href={config.social.linkedin} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                        <FiLinkedin className="w-5 h-5" />
                        LinkedIn
                      </a>
                    ) : null}
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">{config.footer_about || "Gaspar Insurance Services, a Foundation Risk Partners Company"}</p>
            {legalPages.length > 0 && (
              <div className="flex items-center gap-4 text-white/60 text-sm">
                {legalPages.map((p, idx) => (
                  <span key={`legal-${p.slug}`} className="flex items-center gap-4">
                    {idx > 0 && <span>•</span>}
                    <Link href={`/legal/${p.slug}`} className="hover:text-white">{p.title}</Link>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
            aria-label="Back to top"
          >
            <FiArrowUp className="w-6 h-6" />
          </button>
        )}
        <a
          href={smsHref}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 text-white shadow-lg hover:bg-slate-900 border border-white/10"
          aria-label="Text Us"
        >
          <FiMessageSquare className="w-5 h-5" />
          <span className="text-sm font-semibold">Text Us</span>
          <span className="text-xs text-white/80">{phoneDisplay}</span>
        </a>
      </div>
    </footer>
  );
}
