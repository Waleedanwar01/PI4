// 🚨 ADD THIS LINE AT THE VERY TOP to make the component interactive (Client Component)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
// Icons for Services Section
import { FiHeart, FiBriefcase, FiHome, FiPhone, FiMail, FiUser, FiEdit, FiLogIn } from 'react-icons/fi';
import { MdDirectionsCar } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

import Hero from './components/Hero';
import { apiUrl } from './lib/api';
const logos = [
  { name: 'Allied Insurance 1', src: '/images/logos/allied-insurance.jpg' },
  { name: 'Allied Insurance 2', src: '/images/logos/allied-insurance.jpg' },
  { name: 'Allied Insurance 3', src: '/images/logos/allied-insurance.jpg' },
  { name: 'Allied Insurance 4', src: '/images/logos/allied-insurance.jpg' },
  { name: 'Allied Insurance 5', src: '/images/logos/allied-insurance.jpg' },
  { name: 'Allied Insurance 6', src: '/images/logos/allied-insurance.jpg' },
  { name: 'Allied Insurance 7', src: '/images/logos/allied-insurance.jpg' },
  { name: 'Allied Insurance 8', src: '/images/logos/allied-insurance.jpg' },
];

function toSlug(name = '') {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function AboutPreviewSection() {
  const [about, setAbout] = useState({ title: '', hero_subtitle: '', hero_image: '', body_html: '' });
  const [config, setConfig] = useState({ phone: '' });
  useEffect(() => {
    (async () => {
      try {
        const [a, c] = await Promise.all([
          fetch(apiUrl('/api/about/page'), { cache: 'no-store' }),
          fetch(apiUrl('/api/site-config'), { cache: 'no-store' }),
        ]);
        if (a.ok) setAbout(await a.json());
        if (c.ok) setConfig(await c.json());
      } catch {}
    })();
  }, []);

  const img = about.hero_image || '/images/about-home-page.png';
  const subtitle = about.hero_subtitle || 'We put your protection first.';
  const firstPara = String(about.body_html || '')
    .split(/<\/p>/i)
    .map((s) => s.trim())
    .filter(Boolean)[0] || '';
  const phoneDisplay = (config && config.phone) ? config.phone : '1-818-302-3060';
  const phoneHref = `tel:${((config && config.phone) ? config.phone : '+18183023060').replace(/[^+\d]/g, '')}`;

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:space-x-12">
        <div className="md:w-1/2 relative mb-8 md:mb-0">
          <div className="relative w-full h-72 sm:h-80 md:h-full rounded-lg overflow-hidden shadow-xl">
            <Image src={img} alt="About" fill style={{ objectFit: 'cover' }} className="rounded-lg" />
          </div>
        </div>
        <div className="md:w-1/2">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">About Us</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{about.title || 'About Gaspar Insurance'}</h2>
          <p className="text-gray-700 mb-4">{subtitle}</p>
          {firstPara && (
            <div className="text-gray-600 mb-8 text-lg" dangerouslySetInnerHTML={{ __html: firstPara }} />
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-4 sm:space-y-0">
            <a href="/about" className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-base font-semibold rounded-full text-white bg-blue-600 hover:bg-white hover:text-blue-600 transition duration-300 ease-in-out shadow-lg hover:shadow-xl">WHO WE ARE</a>
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500">Call anytime</p>
              <a href={phoneHref} className="text-xl font-bold text-blue-600 hover:text-blue-800">{phoneDisplay}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// -------------------- CARRIER LOGOS SECTION (FINAL GSAP) --------------------
function CarrierLogosSection({ onScrollComplete }) {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const scrollViewportRef = useRef(null);
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(apiUrl('/api/home/partners'), { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const raw = (data.items || []).map((it) => ({ name: it.name, src: it.image, url: it.url }));
          const unique = Array.from(new Map(raw.map((x) => [x.src, x])).values());
          setLogos(unique);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const section = scrollRef.current;
    const track = trackRef.current;
    const scrollViewport = scrollViewportRef.current;

    if (!section || !track || !scrollViewport) return;

    // Cleanup previous triggers
    ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
            trigger.kill();
        }
    });

    const setupGSAP = () => {
        // Calculate the full width of the logo track
        const fullWidth = track.scrollWidth;
        // Calculate the width of the visible container
        const viewportWidth = scrollViewport.offsetWidth;
        // Calculate required horizontal movement
        const scrollDistance = fullWidth - viewportWidth;

        if (scrollDistance <= 10) {
            console.log("Logos fit, no horizontal scroll needed.");
            if (onScrollComplete) onScrollComplete();
            return;
        }

        // Set the vertical scroll duration (slightly longer for smoother feel)
        const verticalScrollDuration = scrollDistance * 4; 

        gsap.set(track, { x: 0 }); // Initial position reset

        let done = false;
        gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                // Pin the section and define the total vertical scroll required
                end: `+=${verticalScrollDuration}px`, 
                scrub: 0.8, 
                pin: true,
                pinSpacing: true, 
                onUpdate: (self) => {
                    if (!done && self.progress >= 0.999) {
                        done = true;
                        if (onScrollComplete) onScrollComplete();
                    }
                },
                onLeave: () => {
                    if (!done) {
                        done = true;
                        if (onScrollComplete) onScrollComplete();
                    }
                },
                onComplete: () => {
                    if (!done) {
                        done = true;
                        if (onScrollComplete) onScrollComplete();
                    }
                },
                // markers: true, // For debugging the trigger bounds
            },
        })
        .to(track, {
            x: -scrollDistance, // Animate the track left
            ease: "none",
        });
        
        ScrollTrigger.refresh();
        };

    setupGSAP();

    // Cleanup function
    return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [logos]);

  return (
    // Franchise-style gradient background
    <div 
      ref={scrollRef} 
      className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden pt-24 pb-12 z-20 min-h-screen"
    >
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -left-20 bottom-0 w-[70%] h-48 md:h-64 bg-[radial-gradient(ellipse_at_bottom_left,rgba(17,24,39,0.6),transparent_60%)]" />
          <div className="absolute -right-24 top-10 w-[60%] h-52 md:h-64 bg-[radial-gradient(ellipse_at_top_right,rgba(31,41,55,0.5),transparent_60%)]" />
        </div>

        

        {/* Header Text - Z-index ensures it's above the background elements */}
        <div className="text-center mb-12 px-4 sm:px-6 lg:px-8 relative z-20">
            <p className="text-sm font-light text-gray-400 uppercase tracking-widest mb-4">
            — Who we work with —
            </p>
            <h2 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
            Over 246 A-rated <br /> insurance carriers
            </h2>
        </div>

        {/* Horizontal Scroll Viewport (The masking element) */}
        <div 
            ref={scrollViewportRef} 
            className="relative w-full max-w-7xl mx-auto overflow-hidden bg-slate-900 sm:bg-white rounded-2xl shadow-2xl ring-1 ring-gray-700 sm:ring-gray-200 py-8 sm:py-10 mb-8 z-20"
        >
            {/* Logo Track: w-max/w-fit is CRITICAL for scrollWidth calculation */}
            <div 
                ref={trackRef} 
                className="flex flex-nowrap items-center gap-16 sm:gap-24 px-8 sm:px-16 w-max will-change-transform"
            >
                {logos.map((logo, i) => (
                    // Larger logos and better fit
                    <div key={i} className="flex-shrink-0 w-56 h-24 sm:w-48 sm:h-20 flex items-center justify-center p-2">
                        <img
                            src={logo.src}
                            alt={logo.name}
                            className="max-w-full max-h-full object-contain drop-shadow brightness-110"
                            onError={(e) => { e.currentTarget.src = '/images/logo.png'; }}
                        />
                    </div>
                ))}
            </div>
        </div>


        

        {/* Background Dots and Circles (Z-0) */}
        <div className="absolute top-1/4 left-8 h-12 w-12 grid grid-cols-3 gap-1 z-0">
            {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-2 w-2 bg-blue-500 rounded-full opacity-60"></div>
            ))}
        </div>
        <div className="absolute top-1/4 right-1/4 h-24 w-24 border-2 border-gray-600 rounded-full opacity-50 z-0"></div>
    </div>
  );
}

// -------------------- SERVICES SECTION (IMPROVED PROFESSIONAL DESIGN, DARK THEME) --------------------
function ServicesSection() {
  return (
    // MERGED COLOR: bg-gray-800 to create a seamless transition from the CarrierLogosSection
    <div className="relative bg-gray-800 text-white pt-12 pb-24 sm:pt-16 sm:pb-32">
      {/* Top wave */}
      <div className="absolute -top-12 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1px)] h-24 rotate-180">
          <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,40 1440,100 L1440 0 L0 0 Z" fill="#1f2937"></path>
        </svg>
      </div>
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -left-24 top-24 w-[55%] h-56 md:h-72 bg-[radial-gradient(ellipse_at_top_left,rgba(17,24,39,0.5),transparent_60%)]" />
        <div className="absolute -right-20 bottom-10 w-[65%] h-56 md:h-72 bg-[radial-gradient(ellipse_at_bottom_right,rgba(31,41,55,0.5),transparent_60%)]" />
      </div>
      {/* Bottom wave */}
      <div className="absolute -bottom-12 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1px)] h-24">
          <path d="M0,20 C240,80 480,40 720,60 C960,80 1200,20 1440,60 L1440 120 L0 120 Z" fill="#111827"></path>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-base font-semibold text-blue-400 uppercase tracking-widest mb-2">
             Our Expertise
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
            Protection for You, Your Family, and Your Business
          </h2>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Personal Insurance (Auto/Home) */}
          {/* Card background is light gray for contrast, text is dark gray */}
          <div className="group rounded-xl bg-gray-700 text-gray-50 hover:bg-gray-700/80 transition duration-300 shadow-xl hover:shadow-2xl ring-1 ring-gray-600 p-8 flex flex-col items-center text-center border-t-4 border-blue-600/0 hover:border-blue-500">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-6">
              <MdDirectionsCar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Personal Insurance</h3>
            <p className="text-md text-gray-300">
              Comprehensive coverage for your assets: auto, home, renters, and umbrella liability. We prioritize the protection of your family and possessions.
            </p>
          </div>
          
          {/* Card 2: Business Insurance (Commercial - Primary Blue Accent) */}
          <div className="group rounded-xl bg-blue-600 text-white shadow-xl hover:shadow-2xl ring-1 ring-blue-600 p-8 flex flex-col items-center text-center border-t-4 border-white/0 hover:border-white">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-6">
              <FiBriefcase className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Business Insurance</h3>
            <p className="text-md text-blue-100">
              Tailored risk management for all industries: General Liability, Property, Workers Comp, Cyber, and Group Health to safeguard your operations.
            </p>
          </div>
          
          {/* Card 3: Life and Health */}
          {/* Card background is light gray for contrast, text is dark gray */}
          <div className="group rounded-xl bg-gray-700 text-gray-50 hover:bg-gray-700/80 transition duration-300 shadow-xl hover:shadow-2xl ring-1 ring-gray-600 p-8 flex flex-col items-center text-center border-t-4 border-blue-600/0 hover:border-blue-500">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-6">
              <FiHeart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Life and Health</h3>
            <p className="text-md text-gray-300">
              Navigate healthcare with ease. Our licensed agents help you choose the right Group Health, Life, Disability, and Long-Term Care plans for peace of mind.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
           <Link href={"get-a-quote"}> <button 
                className="inline-flex items-center justify-center px-10 py-4 border-2 border-blue-600 text-lg font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 hover:border-blue-700 transition duration-300 ease-in-out shadow-xl transform hover:scale-105"
                
            >
                GET A CUSTOM QUOTE TODAY
            </button></Link>
        </div>
      </div>
    </div>
  );
}

function ReviewsSection() {
  const reviews = [
    {
      name: "Lisa Romaniello",
      text:
        "Pam Folbaum was extremely helpful and stayed on top of everything we asked. They are super fast, reliable, and competitive. I would definitely recommend Gaspar Insurance and use them again.",
    },
    {
      name: "Michael Skokowski",
      text:
        "The team has helped me over the last 5 years with all of my homeowner insurance needs. From start to finish their team is always there when I need them! Their service is professional, responsive and easy to work with.",
    },
    {
      name: "Marc Pouw",
      text:
        "Always happy to work with Vanessa. She responds within the hour and sorts out all our insurance issues quickly and with expertise. We are very well insured at great rates and with great advice and guidance from Vanessa and the team.",
    },
    {
      name: "Spencer Schmerling",
      text:
        "They handle all of my company's insurance needs, which can sometimes be challenging. They are expert at finding creative solutions to complicated insurance requirements. They are super responsive and very knowledgeable.",
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white/80">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="text-sm font-semibold tracking-widest">Online Reviews</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">What our clients say</h2>
            <p className="text-white/90 max-w-md">
              There's nothing better than hearing from our customers and reading their 5-star reviews. If we've taken care of your insurance needs, we'd love to hear from you.
            </p>
            <Link
              href = {"https://review.podium.com/#/6e25654f-0a37-4e9e-ba88-ffd04baade08/leave-review/0?v2=true"}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/70 text-white font-semibold rounded-md hover:bg-white/10 transition"
            >
              LEAVE US A REVIEW
              <span className="ml-2">→</span>
            </Link>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reviews.map((r, idx) => (
              <div key={idx} className="relative bg-white text-gray-900 rounded-xl shadow-xl p-6 sm:p-7">
                <div className="absolute top-4 right-4 text-gray-300 text-4xl select-none">“”</div>
                <h3 className="text-lg font-bold mb-2">{r.name}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/teams/groups"), { cache: "no-store" });
        const data = await res.json();
        const groups = data.groups || [];
        const flat = groups.flatMap((g) => (g.members || []).map((m) => ({
          name: m.name,
          role: m.rank,
          src: m.photo_url,
          linkedin: m.linkedin_url,
        })));
        setMembers(flat.slice(0, 6));
      } catch {
        setMembers([]);
      }
    })();
  }, []);

  return (
    <section className="relative z-20 bg-white py-24 sm:py-28 -mb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-widest">Meet our team</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Your Agents, Advisors and Friends</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {members.map((m, i) => (
            <Link key={i} href={`/team/${toSlug(m.name)}`} className="group rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden">
              <div className="relative w-full mx-auto bg-gray-50">
                <Image
                  src={m.src || "/images/logo.png"}
                  alt={m.name}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); if (m.linkedin) window.open(m.linkedin, '_blank', 'noopener,noreferrer'); }}
                  aria-label={`View ${m.name} on LinkedIn`}
                  className="absolute top-4 left-4 h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center shadow hover:bg-blue-700 transition"
                >
                  <FaLinkedin className="text-white w-4 h-4" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">{m.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{m.role || ""}</p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); if (m.linkedin) window.open(m.linkedin, '_blank', 'noopener,noreferrer'); }}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold"
                  >
                    <FaLinkedin className="w-4 h-4" />
                    Connect
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/about/our-team" className="inline-flex items-center justify-center px-6 py-3 bg-slate-900/90 text-white rounded-md font-semibold hover:bg-slate-900 transition-colors">MEET THE TEAM</Link>
        </div>
      </div>
      <div className="absolute -left-10 bottom-0 w-64 h-64 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none" />
    </section>
  );
}

function ArticlesSection() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/resources/blogs?page=1&page_size=3"), { cache: "no-store" });
        const data = await res.json();
        const items = (data.items || []).map((b) => ({
          title: b.title,
          categories: b.categories || [],
          date: b.date,
          author: b.author,
          image: b.image,
          excerpt: b.excerpt || "",
          slug: b.slug,
        }));
        setArticles(items);
      } catch {
        setArticles([]);
      }
    })();
  }, []);

  return (
    <section className="relative bg白 py-24 sm:py-28"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-widest">Latest News</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Helpful tips and insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((a, i) => (
            <article key={i} className="bg-white rounded-xl shadow-xl ring-1 ring-gray-200 overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={a.image || "/images/logo.png"}
                  alt={a.title}
                  width={1200}
                  height={800}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {a.categories.map((c, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-gray-500 text-[11px] sm:text-xs font-semibold tracking-wider mb-3">
                  <span>{a.date}</span>
                  <span>•</span>
                  <span>{a.author}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{a.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{a.excerpt}</p>
                {a.slug ? (
                  <Link href={`/resources/blogs/${a.slug}`} className="inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700">Read More</Link>
                ) : (
                  <span className="inline-flex items-center text-blue-600 font-semibold text-sm">Read More</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [cfg, setCfg] = useState({ phone: "", email: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/site-config"), { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCfg({ phone: data.phone || "", email: data.email || "" });
        }
      } catch {}
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setSent(false);
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (res.ok) {
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setSent(true);
      }
    } catch {}
    setSending(false);
  };

  return (
    <section className="relative bg-white py-24 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <p className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-widest">Contact Us</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">The Team is here to help</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 ring-1 ring-blue-100">
                <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center"><FiPhone /></div>
                <div>
                  <p className="font-semibold text-gray-900">Our Phone</p>
                  <p className="text-sm text-gray-600">Office Telephone: {cfg.phone || "1-818-302-3060"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 ring-1 ring-blue-100">
                <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center"><FiMail /></div>
                <div>
                  <p className="font-semibold text-gray-900">Our Email</p>
                  <a href={`mailto:${cfg.email || "FRPWoodlandHills@FoundationRP.com"}`} className="text-sm text-blue-600 font-semibold">{cfg.email || "FRPWoodlandHills@FoundationRP.com"}</a>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 ring-1 ring-blue-100">
                <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center"><FiLogIn /></div>
                <div>
                  <p className="font-semibold text-gray-900">Client Portal</p>
                  <Link href = {"/portal"} className="text-sm text-blue-600 font-semibold">Login</Link>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 text-white p-6 sm:p-8 shadow-xl">
              <p className="text-sm sm:text-base font-semibold mb-6">Have questions on how to file a claim, make a payment, or manage your account balance? Call, email or send us a note.</p>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full rounded-md bg-white/10 border border-white/20 text-white placeholder-white/70 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"><FiUser /></span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full rounded-md bg-white/10 border border-white/20 text-white placeholder-white/70 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80"><FiMail /></span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="w-full rounded-md bg-white/10 border border-white/20 text-white placeholder-white/70 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Additional information"
                    rows={5}
                    className="w-full rounded-md bg-white/10 border border-white/20 text-white placeholder-white/70 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <span className="absolute right-3 top-3 text-white/80"><FiEdit /></span>
                </div>
                <button type="submit" className="w-full bg-black/70 hover:bg-black text-white font-bold py-3 rounded-md" disabled={sending}>{sending ? "SENDING..." : "SEND"}</button>
                {sent && <div className="text-center text-white/90 text-sm">Message sent</div>}
              </form>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 shadow flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center"><FiPhone className="text-white" /></div>
                <div>
                  <p className="text-sm">Call</p>
                  <p className="font-bold">{cfg.phone || "1-818-302-3060"}</p>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 shadow flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center"><FiMail className="text-white" /></div>
                <div>
                  <p className="text-sm">E-mail</p>
                  <p className="font-bold">{cfg.email || "FRPWoodlandHills@FoundationRP.com"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------- MAIN PAGE --------------------
export default function Page() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Hero />
      <AboutPreviewSection />
      <CarrierLogosSection />
      <ServicesSection />
      <ReviewsSection />
      <TeamSection />
      <ArticlesSection />
      <ContactSection />
    </div>
  );
}
