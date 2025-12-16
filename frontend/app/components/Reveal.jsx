"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Reveal({ children, y = 30, duration = 0.8, delay = 0, once = true, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y });
    const tl = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: once ? "play none none none" : "play none none reverse",
      },
    });
    return () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, [y, duration, delay, once]);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}

