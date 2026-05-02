"use client";

import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home',     id: 'home' },
    { name: 'About',    id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Skills',   id: 'skills' },
    { name: 'Projects', id: 'projects' },
  ];

  // On first load — always start at top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setActiveSection('home');
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
            const path = id === 'home' ? '/' : `/${id}`;
            history.replaceState(null, '', path);
          }
        },
        { threshold: 0.25, rootMargin: '-72px 0px -35% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Click outside to close mobile menu
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [isOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const path = id === 'home' ? '/' : `/${id}`;
    history.pushState(null, '', path);
    setActiveSection(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[999] pt-4 md:pt-6 pb-2 w-full flex justify-end md:justify-center px-4 md:px-0 pointer-events-none">
      <div ref={menuRef} className="relative pointer-events-auto">

        {/* ── Desktop pill ── */}
        <div className={`hidden md:block relative transition-[background-color,box-shadow,border-color] duration-500 rounded-full border ${
          isScrolled
            ? 'bg-[#0d0820]/85 backdrop-blur-2xl border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]'
            : 'bg-[#0d0820]/50 backdrop-blur-xl border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]'
        }`}>
          {/* Top shimmer */}
          <div className="absolute inset-x-6 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

          <div className="flex items-center px-2 py-1.5">
            {navLinks.map(({ name, id }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 group cursor-pointer ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className={`relative z-10 transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]' : ''}`}>
                    {name}
                  </span>

                  {/* Animated underline */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-line"
                      className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400"
                      style={{ boxShadow: '0 0 10px rgba(34,211,238,0.9), 0 0 20px rgba(217,70,239,0.5)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}

                  {/* Hover underline */}
                  <span className="absolute bottom-1 left-3 right-3 h-px rounded-full bg-white/15 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Mobile: fixed-size pill button (never changes shape) ── */}
        <div className={`md:hidden relative transition-[background-color,box-shadow,border-color] duration-500 rounded-full border ${
          isScrolled || isOpen
            ? 'bg-[#0d0820]/85 backdrop-blur-md border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]'
            : 'bg-[#0d0820]/50 backdrop-blur-md border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]'
        }`}>
          {/* Top shimmer */}
          <div className="absolute inset-x-2 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

          <div className="p-1.5">
            <button
              type="button"
              onClick={() => setIsOpen(prev => !prev)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.span>
                  : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile Dropdown — absolute so it never resizes the pill ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              style={{ transformOrigin: 'top right', willChange: 'transform, opacity' }}
              className="md:hidden absolute right-0 top-[calc(100%+8px)] w-52
                bg-[#0d0820]/95 backdrop-blur-md rounded-2xl
                border border-white/10
                shadow-[0_8px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)]
                overflow-hidden"
            >
              {/* Dropdown shimmer */}
              <div className="absolute inset-x-6 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

              {/* Header label */}
              <div className="px-4 pt-3 pb-2 border-b border-white/8">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Navigation
                </span>
              </div>

              <div className="flex flex-col p-2 gap-0.5">
                {navLinks.map(({ name, id }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors duration-150 cursor-pointer ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-cyan-500/15 to-fuchsia-500/15 border border-white/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                      )}
                      {name}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </nav>
  );
}
