"use client";

export const dynamic = 'force-dynamic';

import Reveal from "../components/Reveal";
import { apiUrl } from "../lib/api";
import Link from "next/link";
import PortalLogin from "../components/PortalLogin";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";

function embedUrl(u) {
  try {
    if (!u) return "";
    const x = new URL(u);
    const id = x.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;
    const p = x.pathname.replace(/^\/+/, "");
    if (p.startsWith("shorts/")) return `https://www.youtube.com/embed/${p.split("/")[1]}`;
    if (p.startsWith("embed/")) return u;
    return u;
  } catch {
    return u || "";
  }
}

async function fetchPortalPage() {
  try {
    const res = await fetch(apiUrl("/api/portal/page"), { cache: "no-store" });
    if (!res.ok) throw new Error("bad");
    const data = await res.json();
    return data;
  } catch {
    return {
      title: "Customer Portal",
      hero_subtitle: "Access policies, ID cards, certificates, claims and more",
      hero_image: "",
      portal_url: "",
      features: [
        "View policies and ID cards",
        "Request changes and certificates",
        "File and track claims",
      ],
      videos: ["https://www.youtube.com/watch?v=5qap5aO4i9A"],
      partners: [],
      appstore_ios_url: "",
      appstore_android_url: "",
      contact_email: "",
      contact_phone: "",
    };
  }
}

async function fetchFaqs() {
  try {
    const res = await fetch(apiUrl("/api/resources/faq"), { cache: "no-store" });
    if (!res.ok) throw new Error("bad");
    const data = await res.json();
    return data.groups || [];
  } catch {
    return [];
  }
}

export default function Page() {
  const [data, setData] = useState({ title: "Customer Portal", hero_subtitle: "Access policies, ID cards, certificates, claims and more", hero_image: "", portal_url: "", features: [], videos: [], partners: [], appstore_ios_url: "", appstore_android_url: "", contact_email: "", contact_phone: "" });
  const [faqGroups, setFaqGroups] = useState([]);
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user authentication first
    const checkLocalAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
          setAuthed(true);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error checking local authentication:", error);
      }
      
      // If no local auth, check API auth
      (async () => {
        try {
          const r = await fetch(apiUrl("/api/auth/me"), { credentials: "include" });
          if (r.ok) {
            const d = await r.json();
            setAuthed(Boolean(d && d.ok));
          } else {
            setAuthed(false);
          }
        } catch {
          setAuthed(false);
        }
      })();
      
      // Load page data
      (async () => {
        try {
          const res = await fetch(apiUrl("/api/portal/page"), { cache: "no-store" });
          if (res.ok) {
            const d = await res.json();
            setData(d);
          }
        } catch {}
        try {
          const res = await fetch(apiUrl("/api/resources/faq"), { cache: "no-store" });
          if (res.ok) {
            const d = await res.json();
            setFaqGroups(d.groups || []);
          }
        } catch {}
      })();
      
      setLoading(false);
    };

    checkLocalAuth();
  }, []);

  useEffect(() => {
    // No redirects. Keep user on this page and show either login or details.
  }, [authed, loading]);

  const portalUrl = data.portal_url || process.env.NEXT_PUBLIC_PORTAL_URL || "https://gasparinsurance.com/gaspar-customer-portal/";
  const heroSrc = data.hero_image || "/images/family.jpg";
  const portalPoints = (data.features || []).slice(0, 6);
  const videoLinks = (data.videos || []);
  const partners = (data.partners || []);
  const prefer = ["Portal", "Customer Portal", "MyAccess", "General"];
  const faqChosen = faqGroups.find(g => prefer.some(p => (g.category || "").toLowerCase() === p.toLowerCase())) || faqGroups[0] || { items: [] };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <section className="bg-white">
      <div className="relative w-full overflow-hidden">
        <div className="relative h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden" style={{ backgroundImage: `url(${heroSrc})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0 bg-blue-900/70" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-extrabold">Customer Portal</h1>
              <p className="text-blue-200 mt-2">Access policies, ID cards, certificates, claims and more</p>
              <div className="mt-6">
                {!authed ? (
                  <a href="#login" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-white text-blue-700 font-semibold hover:bg-blue-50 transition">Login</a>
                ) : (
                  <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-white text-blue-700 font-semibold hover:bg-blue-50 transition">Go Home</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div id="login" className="rounded-2xl bg-white ring-1 ring-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-extrabold text-slate-900">Customer Portal</h2>
            </div>
            <PortalLogin portalUrl={portalUrl} />
            {videoLinks.length ? (
              <div className="mt-8">
                <iframe src={embedUrl(videoLinks[0])} className="w-full h-52 rounded-xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}></iframe>
              </div>
            ) : null}
          </div>

          <div>
            <Reveal>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-8">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Account access at your fingertips</h3>
                <ul className="space-y-3">
                  {portalPoints.length ? portalPoints.map((t, i) => (
                    <li key={`pt-${i}`} className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-blue-600" /><span className="text-slate-700">{t}</span></li>
                  )) : null}
                </ul>
              <div className="mt-6">
                <Link href="/portal/signup" className="text-blue-600 font-semibold">Create New Account</Link>
              </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="rounded-xl ring-1 ring-emerald-400 p-6">
                  <p className="text-emerald-700 font-bold">Securely Send Documents</p>
                </div>
                <div className="rounded-xl ring-1 ring-amber-400 p-6">
                  <p className="text-amber-700 font-bold">24 Hours Policy Access</p>
                </div>
                <div className="rounded-xl ring-1 ring-blue-600 p-6">
                  <p className="text-blue-700 font-bold">File Claims Instantly</p>
                </div>
              </div>
            </Reveal>

            <div className="mt-8 rounded-2xl bg-white ring-1 ring-slate-200 p-8 text-center">
              <p className="text-slate-700">Download our MyAccess App</p>
              <div className="mt-4 flex items-center justify-center gap-4">
                <a href={data.appstore_ios_url || portalUrl} className="inline-block"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10" /></a>
                <a href={data.appstore_android_url || portalUrl} className="inline-block"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Google Play" className="h-12" /></a>
              </div>
              <div className="mt-6">
                <Link href="/portal/signup" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-slate-900 text-white font-semibold">Create New Account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {videoLinks.length ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Reveal>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-8">Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {videoLinks.slice(0, 6).map((u, i) => (
                  <iframe key={`vid-${i}`} src={embedUrl(u)} className="w-full aspect-video rounded-xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}></iframe>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      ) : null}

      {faqChosen.items && faqChosen.items.length ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Reveal>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
              <div className="space-y-8">
                {faqChosen.items.slice(0, 6).map((it, i) => (
                  <div key={`fq-${i}`}>
                    <p className="font-bold text-slate-900">{it.question}</p>
                    <div className="mt-2 text-slate-700" dangerouslySetInnerHTML={{ __html: it.answer_html || "" }} />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      ) : null}

      <div className="border-t border-slate-200" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-6">
            <p className="text-slate-700">Need help? {data.contact_email ? (<a href={`mailto:${data.contact_email}`} className="text-blue-600 font-semibold">{data.contact_email}</a>) : null} {data.contact_phone ? (<span className="ml-2">• {data.contact_phone}</span>) : null}</p>
          </div>
      </div>

      {partners.length ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Reveal>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-8">Other Insurance Carrier Applications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {Array.from(new Map(partners.map(p => [p.image, p])).values()).map((p, i) => (
                  <a key={`pl-${i}`} href={p.url || "#"} target="_blank" rel="noopener noreferrer" className="block rounded-xl ring-1 ring-slate-200 p-4 bg-white hover:shadow transition">
                    {p.image ? (<img src={p.image} alt={p.name} className="w-full h-16 object-contain" />) : (<div className="w-full h-16 bg-slate-100"></div>)}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      ) : null}
    </section>
  );
}
