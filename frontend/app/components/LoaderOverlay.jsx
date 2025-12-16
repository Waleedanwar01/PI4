"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function LoaderOverlay() {
  const [active, setActive] = useState(0);
  const pathname = usePathname();
  const timerRef = useRef(null);
  const MAX_MS = 3000;
  useEffect(() => {
    if (typeof window === "undefined") return;
    const orig = window.fetch?.bind(window);
    if (!orig) return;
    const patched = async (...args) => {
      setActive((c) => c + 1);
      try {
        return await orig(...args);
      } finally {
        setActive((c) => Math.max(0, c - 1));
      }
    };
    window.fetch = patched;
    return () => {
      window.fetch = orig;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const isInternal = href.startsWith("/");
      const isMail = href.startsWith("mailto:") || href.startsWith("tel:");
      const isHash = href.startsWith("#");
      if (isInternal && !isMail && !isHash) {
        setActive((c) => c + 1);
        setTimeout(() => setActive((c) => Math.max(0, c - 1)), 800);
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    setActive((c) => c + 1);
    const t = setTimeout(() => setActive((c) => Math.max(0, c - 1)), 600);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (active > 0 && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        setActive(0);
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }, MAX_MS);
    }
    if (active === 0 && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [active]);

  const show = active > 0;
  return (
    <div
      aria-hidden={!show}
      className={`${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} fixed inset-0 z-[1000] transition-opacity duration-200`}
      style={{ background: "rgba(15, 23, 42, 0.35)" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-4 border-white/30 border-t-white animate-spin" />
      </div>
    </div>
  );
}
