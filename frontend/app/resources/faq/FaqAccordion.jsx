"use client";

import { useRef, useState, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";

export default function FaqAccordion({ groups }) {
  const [open, setOpen] = useState({});
  const panels = useRef({});
  const contents = useRef({});
  const setPanel = (id, el) => { if (el) panels.current[id] = el; };
  const setContent = (id, el) => { if (el) contents.current[id] = el; };
  const toggle = (id) => {
    setOpen((o) => {
      const willOpen = !o[id];
      const panel = panels.current[id];
      const content = contents.current[id];
      if (panel && content) {
        const h = content.scrollHeight || 0;
        panel.style.transition = "height 300ms ease, opacity 300ms ease";
        if (willOpen) {
          panel.style.opacity = "0";
          panel.style.height = "0px";
          requestAnimationFrame(() => {
            panel.style.opacity = "1";
            panel.style.height = h + "px";
          });
          setTimeout(() => { panel.style.transition = ""; panel.style.height = "auto"; }, 320);
        } else {
          panel.style.opacity = "1";
          panel.style.height = h + "px";
          requestAnimationFrame(() => {
            panel.style.opacity = "0";
            panel.style.height = "0px";
          });
          setTimeout(() => { panel.style.transition = ""; }, 320);
        }
      }
      return { ...o, [id]: willOpen };
    });
  };
  useEffect(() => {
    try {
      const firstGroup = Array.isArray(groups) && groups.length ? groups[0] : null;
      const firstItem = firstGroup && Array.isArray(firstGroup.items) && firstGroup.items.length ? firstGroup.items[0] : null;
      if (firstItem && !open[firstItem.id]) {
        setOpen({ [firstItem.id]: true });
        const panel = panels.current[firstItem.id];
        const content = contents.current[firstItem.id];
        if (panel && content) {
          panel.style.height = content.scrollHeight + "px";
          panel.style.opacity = "1";
          setTimeout(() => { panel.style.height = "auto"; }, 320);
        }
      }
    } catch {}
  }, [groups]);
  return (
    <div className="space-y-12">
      {groups.map((g, gi) => (
        <section key={gi} className="w-full">
          <div className="text-center mb-10">
            <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-tight mb-3">{g.category}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {g.items.map((it) => {
              const isOpen = !!open[it.id];
              return (
                <div 
                  id={`faq-card-${it.id}`} 
                  key={it.id} 
                  className={`group w-full rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                      isOpen 
                      ? 'bg-blue-50 border-blue-600 shadow-2xl shadow-blue-600/20' 
                      : 'bg-white border-slate-300 hover:border-blue-500 shadow-sm hover:shadow-lg hover:shadow-blue-500/10'
                  }`}
                >
                  <button 
                    onClick={() => toggle(it.id)} 
                    aria-expanded={isOpen} 
                    aria-controls={`faq-panel-${it.id}`} 
                    className={`w-full flex items-center justify-between text-left px-8 py-6 font-bold transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white' : 'text-slate-900 hover:bg-blue-50'}`}
                  >
                    <span className="pr-6 text-lg sm:text-xl leading-relaxed">{it.question}</span>
                    <span className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 transform ${
                      isOpen 
                        ? 'bg-blue-600 text-white rotate-180 shadow-lg' 
                        : 'bg-slate-200 text-slate-600 group-hover:bg-blue-600 group-hover:text-white'
                    }`}>
                      <HiChevronDown className="w-5 h-5" />
                    </span>
                  </button>
                  <div ref={(el) => setPanel(it.id, el)} id={`faq-panel-${it.id}`} className="overflow-hidden" style={{ height: 0 }}>
                    <div ref={(el) => setContent(it.id, el)} className="px-8 pb-8">
                      <div className="border-t border-blue-200 pt-6">
                        <div className="prose prose-slate prose-lg max-w-none text-slate-800 leading-relaxed">
                          <div dangerouslySetInnerHTML={{ __html: it.answer_html || '' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
