"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { HiArrowRight, HiUser } from "react-icons/hi";
import Link from "next/link";
import { apiUrl } from "../lib/api";
const slides = [
  {
    title: "Custom Insurance Solutions",
    subtitle: "For Individuals & Businesses",
    image: "https://picsum.photos/seed/hero-a/1600/900",
  },
  {
    title: "Protect What Matters Most",
    subtitle: "Reliable & Affordable Insurance Plans",
    image: "https://picsum.photos/seed/hero-b/1600/900",
  },
  {
    title: "Your Partner In Risk Management",
    subtitle: "Smart Solutions For a Safer Future",
    image: "https://picsum.photos/seed/hero-c/1600/900",
  },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    gsap.fromTo(
      imgRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 1.2 }
    );

    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2 }
    );
  }, [i]);

  useEffect(() => {
    const id = setInterval(() => {
      setI((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(apiUrl('/api/auth/me'), { credentials: 'include' });
        if (r.ok) {
          const d = await r.json();
          if (d && d.ok) setUser({ email: d.email });
        }
      } catch {}
    })();
  }, []);

  async function doLogout() {
    try {
      const r = await fetch(apiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' });
      if (r.ok) setUser(null);
    } catch {}
  }

  const next = () => setI((i + 1) % slides.length);
  const prev = () => setI((i - 1 + slides.length) % slides.length);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-16 md:pt-20">

      {/* Background Image */}
      <img
        ref={imgRef}
        src={slides[i].image}
        alt={slides[i].title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Text Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-0">
        <div ref={textRef} className="max-w-4xl text-left text-white pl-6 md:pl-10">
          <p className="text-sm md:text-base lg:text-lg tracking-wide mb-4 text-white/80">
            {slides[i].subtitle}
          </p>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-6">
            {slides[i].title}
          </h1>
          
          
          
          <div className="flex flex-col sm:flex-row gap-4 justify-start items-start max-w-md sm:max-w-none mb-10">
            {user ? (
              <>
                <Link href = {"/portal"} className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2">
                  Customer Portal
                </Link>
                <button onClick={doLogout} className="w-full sm:w-auto px-6 py-3 bg-slate-900/90 text-white rounded-md font-semibold hover:bg-slate-900 transition-colors inline-flex items-center justify-center gap-2">
                  Logout
                </button>
              </>
            ) : (
              <Link href = {"/portal"} className="w-full sm:w-auto px-6 py-3 bg-slate-900/90 text-white rounded-md font-semibold hover:bg-slate-900 transition-colors inline-flex items-center justify-center gap-2">
                <HiUser />
                Login
              </Link>
            )}
            <Link href = {"/about/our-team"}><button className="w-full sm:w-auto px-6 py-3 bg-yellow-400 text-black rounded-md font-semibold hover:bg-yellow-500 transition-colors inline-flex items-center justify-center gap-2">
              Ask an Agent
              <HiArrowRight />
            </button></Link>
          </div>
          <div className="mt-6 flex items-center gap-4">
            {[
              'https://picsum.photos/seed/thumb1/200/200',
              'https://picsum.photos/seed/thumb2/200/200',
              'https://picsum.photos/seed/thumb3/200/200',
            ].map((src, idx) => (
              <img
                key={`hero-pic-${idx}`}
                src={src}
                alt="Preview"
                className="h-14 w-14 object-cover ring-2 ring-white/50 transition-transform duration-200 hover:scale-105"
                onError={(e) => { e.currentTarget.src = '/images/logo.png'; }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-white/90 text-black p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 z-30"
      >
        <HiChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={next}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-white/90 text-black p-2 sm:p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 z-30"
      >
        <HiChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>
    </section>
  );
}
