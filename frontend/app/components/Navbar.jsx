"use client";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { HiMenu, HiX, HiChevronDown, HiPhone, HiHome, HiCog, HiUserGroup, HiBriefcase, HiBookOpen, HiShieldCheck } from "react-icons/hi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { apiUrl } from "../lib/api";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Enhanced MENU structure (Kept the same)
const MENU = [
  { label: "Home", href: "/", items: [], icon: HiHome },
  {
    label: "Solutions",
    href: "/solutions",
    items: [],
    icon: HiCog,
  },
  {
    label: "About Us",
    href: "/about",
    items: [
      { label: "Our Team", href: "/about/our-team" },
      { label: "Community Outreach", href: "/about/community-outreach" },
    ],
    icon: HiUserGroup,
  },
  { label: "Careers", href: "https://foundationrp.com/careers/", items: [{ label: "FRP Careers", href: "https://foundationrp.com/careers/" }], icon: HiBriefcase },
  {
    label: "Resources",
    href: "/resources",
    items: [
      { label: "Claims", href: "/resources/claims" },
      { label: "Blogs", href: "/resources/blogs" },
      { label: "FAQ", href: "/resources/faq" },
    ],
    icon: HiBookOpen,
  },
  { label: "Customer Portal", href: "/portal", items: [], icon: HiShieldCheck },
];

export default function Navbar({ config = {} }) {
  const headerRef = useRef(null);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null); // Controls the Right Panel content
  const [mobileSections, setMobileSections] = useState({});
  const closeTimer = useRef(null);
  const [solutionsItems, setSolutionsItems] = useState([
    { label: "Personal Insurance", href: "/solutions/personal-insurance" },
    { label: "Business Insurance", href: "/solutions/business-insurance" },
    { label: "Life & Health", href: "/solutions/life-health" },
    {
      label: "Special Programs",
      href: "/solutions/special-programs",
      items: [
        { label: "Specialty Entertainment", href: "/solutions/special-programs/specialty-entertainment" },
        { label: "Apartment Building", href: "/solutions/special-programs/apartment-building" },
        { label: "Consulting Services", href: "/solutions/special-programs/consulting-services" },
        { label: "Dental Practice", href: "/solutions/special-programs/dental-practice" },
        { label: "Franchise Protection", href: "/solutions/special-programs/franchise-protection" },
        { label: "Private Client", href: "/solutions/special-programs/private-client" },
        { label: "Workers’ Compensation", href: "/solutions/special-programs/workers-compensation" },
      ],
    },
    { label: "Get A Quote", href: "/get-a-quote" },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/resources/solutions/tree"), { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const toItems = (nodes) => (nodes || []).map((n) => ({
          label: n.title,
          href: `/solutions/${n.slug}`,
          items: toItems(n.children || []),
        }));
        let items = toItems(data.items || []);
        const hasQuote = items.some(it => it.label === "Get A Quote");
        if (!hasQuote) items = [...items, { label: "Get A Quote", href: "/get-a-quote" }];
        if (items && items.length) setSolutionsItems(items);
      } catch {}
    })();
  }, []);

  // --- GSAP Scroll-Based Header Attach/Hide Logic (Replaces old scroll logic) ---
  useLayoutEffect(() => {
    const header = headerRef.current;
    const container = containerRef.current;
    const logo = logoRef.current;
    if (!header) return;

    // We use a local context for cleanup
    let ctx = gsap.context(() => {
      // Define a custom function to hide/show the header
      const showAnim = gsap.from(header, {
        yPercent: -100, // Start hidden above the viewport
        paused: true,
        duration: 0.3,
        ease: "power2.inOut",
      }).progress(1); // Set progress to 1 so it's visible initially

      // Create the ScrollTrigger
      ScrollTrigger.create({
        start: "top top", // When the top of the viewport hits the top of the page
        end: 99999, // Run for a long time
        onUpdate: (self) => {
          if (open) return; // Disable scroll hide/show when mobile menu is open
          
          if (self.direction === -1) {
            // Scrolling up
            showAnim.play();
          } else {
            // Scrolling down
            if (self.progress > 0.05) { // Only hide after scrolling down a bit (e.g., 5% of the start gap)
              showAnim.reverse();
            }
          }
        },
      });

      let lastSolid = false;
      ScrollTrigger.create({
        start: "top+=60 top",
        end: 99999,
        onUpdate: (self) => {
          if (!container) return;
          const solid = self.scroll() > 60;
          if (solid !== lastSolid) {
            gsap.to(container, { height: solid ? 64 : 80, duration: 0.3, ease: "power2.out" });
            if (logo) gsap.to(logo, { scale: solid ? 0.92 : 1, duration: 0.3, ease: "power2.out" });
            lastSolid = solid;
          }
          setIsFixed(solid);
        },
      });
    }, header); // <- scope the context to the header element

    return () => ctx.revert(); // Cleanup GSAP animations
  }, [open]);


  // --- Body Scroll Lock ---
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Allow scrolling when mobile menu is closed, or if the user is on desktop (where overflow is not hidden)
      document.body.style.overflow = (open && window.innerWidth < 1024) ? "hidden" : "";
    }
    // Cleanup function
    return () => {
        if (typeof document !== "undefined") {
            document.body.style.overflow = "";
        }
    };
  }, [open]);

  // --- Desktop Dropdown Handlers ---
  const openDropdown = (label) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdown(label);
    
    // Clear activeGroup immediately on opening the main dropdown
    setActiveGroup(null);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
        setDropdown(null);
        setActiveGroup(null);
    }, 200);
  };

  const clearClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  // Handler for Left Panel Items (to control Right Panel)
  const handleLeftPanelHover = (item) => {
    // Only set activeGroup if the item itself has sub-items
    if (item.items && item.items.length > 0) {
        setActiveGroup(item.label);
    } else {
        // Clear activeGroup for simple links
        setActiveGroup(null);
    }
  };
    
  // --- Mobile Accordion Handlers ---
  const toggleSection = (label) => {
    setMobileSections((s) => ({ ...s, [label]: !s[label] }));
  };

  const toggleMenu = () => {
    setOpen((prev) => !prev);
    // Reset mobile sections when closing
    if (open) {
      setMobileSections({});
    }
  };

  // Function to determine if a menu item has sub-dropdown content (for desktop)
  const isComplexMenu = (m) => m.items && m.items.some(it => it.items && it.items.length > 0);

  // The main header component now uses 'absolute' for GSAP to control its position
  return (
    <header 
      ref={headerRef}
      className={`${isFixed ? "fixed" : "absolute"} top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md shadow-lg`}
    >
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">

        <Link href="/" className="flex items-center">
          <img ref={logoRef} src={config.logo_url || "/images/logos/foundation-risk-partners-logo.png"} alt="Logo" className="h-8 md:h-10 lg:h-12 w-auto filter brightness-0 invert" />
        </Link>

        {/* ======================================================= */}
        {/* DESKTOP NAVIGATION (lg:flex) */}
        {/* ======================================================= */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-nowrap ml-6 lg:ml-8">
          {MENU.map((m) => {
            const items = m.label === "Solutions" ? solutionsItems : m.items;
            const hasComplexChildren = items && items.some(it => it.items && it.items.length > 0);

            return (
              <div
                key={m.label}
                className="relative group"
                onMouseEnter={() => openDropdown(m.label)}
                onMouseLeave={scheduleClose}
              >
                <Link 
                  href={m.href} 
                  className="text-white text-sm lg:text-[14px] xl:text-[15px] font-medium hover:text-blue-400 flex items-center gap-1.5 whitespace-nowrap transition-colors duration-200"
                >
                  {m.icon && <m.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />}
                  {m.label}
                  {items && items.length > 0 && <HiChevronDown className="w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform duration-200 group-hover:rotate-180" />}
                </Link>

                {/* DESKTOP DROPDOWN / MEGA MENU CONTAINER */}
                {items && items.length > 0 && (
                  <div
                    onMouseEnter={clearClose}
                    onMouseLeave={scheduleClose}
                    // Adjusted width: Auto width based on content. Only grow if Right Panel is active.
                    className={`absolute top-14 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-xl w-auto max-w-[calc(100vw-40px)] border border-gray-100 overflow-hidden transition-all duration-300 ${
                      dropdown === m.label ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                    style={{ 
                        // Dynamically adjust min-width based on whether it needs a right panel
                        minWidth: hasComplexChildren ? (activeGroup ? '560px' : '240px') : '240px' 
                    }}
                  >
                    <div className="flex">
                      
                      {/* Left Panel: Main links / Group Headers */}
                      <div className={`w-60 py-3 ${hasComplexChildren ? 'border-r border-gray-100' : 'w-full'}`}>
                        {items.map((it) => {
                            const isGroupHeader = it.items && it.items.length > 0;
                            return (
                                isGroupHeader ? (
                                    // Group Header with Sub-Dropdown (HOVER ACTIVATES RIGHT PANEL)
                                    <div
                                        key={`${m.label}-${it.label}`}
                                        className={`group relative mx-2 rounded-xl transition-all duration-200 cursor-pointer ${
                                          activeGroup === it.label ? "bg-blue-50" : "hover:bg-gray-50"
                                        }`}
                                        onMouseEnter={() => handleLeftPanelHover(it)} // <<-- KEY: Controls Right Panel
                                    >
                                        <div className="flex items-center justify-between text-gray-700 text-sm font-medium px-4 py-3">
                                            <span>{it.label}</span>
                                            <HiChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-200 -rotate-90 ${
                                              activeGroup === it.label ? "text-blue-600" : "group-hover:text-blue-600"
                                            }`} />
                                        </div>
                                    </div>
                                ) : (
                                    // Simple Link
                                    <Link
                                        key={`${m.label}-${it.label}`}
                                        href={it.href}
                                        onClick={() => { scheduleClose(); setOpen(false); }}
                                        onMouseEnter={() => handleLeftPanelHover(it)} // <<-- KEY: Clears Right Panel if it was active
                                        className="block mx-2 text-gray-700 text-sm hover:text-blue-600 hover:bg-blue-50 rounded-xl px-4 py-3 transition-all duration-200 font-medium"
                                    >
                                        <div className="flex items-center gap-2">
                                            {it.label}
                                        </div>
                                    </Link>
                                )
                            );
                        })}
                      </div>

                      {/* Right Panel: Sub-Links (Flyout) - Only visible for complex menus and when an active group is set */}
                      {hasComplexChildren && (
                          // Conditionally render based on activeGroup to control space/display
                          <div 
                              className={`w-0 transition-all duration-300 overflow-hidden ${activeGroup ? 'w-60' : ''}`}
                          >
                              {activeGroup && (
                                  <div className="py-3 px-3">
                                      {items.find((it) => it.label === activeGroup && it.items) ? (
                                          <div className="space-y-1">
                                              <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3 px-3">
                                                  {activeGroup}
                                              </h4>
                                              {items
                                                  .find((it) => it.label === activeGroup)
                                                  .items.map((sub) => (
                                                      <Link
                                                          key={`${m.label}-${activeGroup}-${sub.label}`}
                                                          href={sub.href}
                                                          onClick={() => { scheduleClose(); setOpen(false); }}
                                                          className="block text-gray-600 text-sm hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2.5 transition-all duration-200"
                                                      >
                                                          {sub.label}
                                                      </Link>
                                                  ))}
                                          </div>
                                      ) : (
                                          // This block should ideally never be hit if logic is correct
                                          <div className="p-4 text-center text-gray-400 text-sm">No sub-items found.</div>
                                      )}
                                  </div>
                              )}
                          </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        {/* DESKTOP CTA (lg:flex) */}
        <div className="hidden lg:flex items-center gap-6 ml-auto">
          <a
            href={config.phone ? `tel:${config.phone.replace(/\s+/g,'')}` : "tel:+18183023060"}
            className="group relative flex items-center bg-blue-600 text-white rounded-none pl-2 pr-3 py-1 shadow-lg hover:bg-blue-700 transition-colors duration-200 overflow-hidden"
          >
            <HiPhone className="w-4 h-4 mr-2"/>
            <span className="text-sm">Call Us:</span>
            <span className="font-bold text-sm xl:text-base ml-1">{config.phone || "1-818-302-3060"}</span>
          </a>
        </div>

        {/* ======================================================= */}
        {/* MOBILE ACTIONS (lg:hidden) */}
        {/* ======================================================= */}
        <div className="lg:hidden ml-auto flex items-center gap-2">
          <a
            href={config.phone ? `tel:${config.phone.replace(/\s+/g,'')}` : "tel:+18183023060"}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700"
          >
            <HiPhone className="w-4 h-4" />
            <span>Call:</span>
            <span className="font-bold">{config.phone || "1-818-302-3060"}</span>
          </a>
          <button 
            onClick={toggleMenu} 
            className="text-white hover:text-blue-400 transition-colors duration-200 p-2"
            aria-label="Toggle menu"
          >
            {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ======================================================= */}
      {/* MOBILE MENU OVERLAY (md:hidden) - ACCORDION */}
      {/* ======================================================= */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full z-[1000] transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 pb-4">
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-3xl p-5 space-y-4 shadow-2xl max-w-7xl mx-auto max-h-[75vh] overflow-y-auto border border-white/10">
            {MENU.map((m) => (
              <div key={m.label} className="space-y-3">
                {(() => { const items = m.label === "Solutions" ? solutionsItems : m.items; return items && items.length > 0; })() ? (
                  <>
                    {/* Level 1 Accordion Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleSection(m.label)}
                      className="w-full flex items-center justify-between text-white font-semibold py-4 px-5 bg-white/15 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-200"
                    >
                      <span className="flex items-center gap-3">{m.icon && <m.icon className="w-5 h-5" />}{m.label}</span>
                      <HiChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileSections[m.label] ? "rotate-180" : ""}`} />
                    </button>
                    
                    {/* Level 1 Content */}
                    {mobileSections[m.label] && (
                      <div className="pl-4 space-y-2">
                        {(m.label === "Solutions" ? solutionsItems : m.items).map((it) => (
                          it.items && it.items.length > 0 ? (
                            <div key={`${m.label}-${it.label}`} className="space-y-2">
                              {/* Level 2 Accordion Toggle */}
                              <button
                                type="button"
                                onClick={() => toggleSection(`${m.label}-${it.label}`)}
                                className="w-full flex items-center justify-between text-white/90 font-medium py-3 px-4 bg-white/10 rounded-xl hover:bg-white/15 transition-all duration-200"
                              >
                                <span>{it.label}</span>
                                <HiChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileSections[`${m.label}-${it.label}`] ? "rotate-180" : ""}`} />
                              </button>
                              
                              {/* Level 2 Content */}
                              {mobileSections[`${m.label}-${it.label}`] && (
                                <div className="pl-4 space-y-1">
                                  {it.items.map((sub) => (
                                    <Link
                                      key={`${m.label}-${it.label}-${sub.label}`}
                                      href={sub.href}
                                      onClick={() => setOpen(false)}
                                      className="block w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-5 py-3 transition-all duration-200 border border-transparent hover:border-white/10"
                                    >
                                      {sub.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Link 
                              key={`${m.label}-${it.label}`} 
                              href={it.href} 
                              onClick={() => setOpen(false)}
                              className="block w-full text-white/90 hover:text-white hover:bg-white/10 rounded-xl px-5 py-3 transition-all duration-200 font-medium border border-transparent hover:border-white/10"
                            >
                              {it.label}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    href={m.href} 
                    onClick={() => setOpen(false)}
                    className="block w-full text-white text-lg font-semibold py-4 flex items-center gap-3 bg-white/15 hover:bg-white/20 rounded-2xl px-5 transition-all duration-200 border border-white/20 hover:border-white/30"
                  >
                    {m.icon && <m.icon className="w-5 h-5" />}
                    {m.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile CTA */}
            <div className="pt-4">
              <a 
                href={config.phone ? `tel:${config.phone.replace(/\s+/g,'')}` : "tel:+18183023060"}
                onClick={() => setOpen(false)}
                className="block bg-blue-600 text-white px-5 py-4 rounded-2xl text-center font-bold shadow-lg hover:bg-blue-700 transition-all duration-200 border border-blue-500/50"
              >
                <div className="flex items-center justify-center gap-3">
                  <HiPhone className="w-5 h-5" />
                  <span>Call:</span>
                  <span className="font-bold">{config.phone || "1-818-302-3060"}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
