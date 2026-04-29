"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reliable active section tracking with IntersectionObserver
  useEffect(() => {
    const sectionIds = ['home', 'about', 'services', 'skills', 'projects'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home',     href: '#home' },
    { name: 'About',    href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Skills',   href: '#skills' },
    { name: 'Projects', href: '#projects' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[999] pt-4 md:pt-6 pb-4 w-full flex justify-end md:justify-center px-4 md:px-0 transition-all duration-500">
      <div ref={menuRef} className="relative">

        {/* Ambient glow behind pill */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-700 pointer-events-none
            bg-gradient-to-r from-cyan-500/25 via-fuchsia-500/20 to-cyan-500/25
            ${isScrolled ? 'opacity-100' : 'opacity-40'}`}
        />

        <div className={`relative transition-all duration-500 ${
          isOpen
            ? 'bg-[#0d0820]/96 backdrop-blur-2xl rounded-2xl w-[calc(100vw-2rem)] max-w-sm border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]'
            : isScrolled
              ? 'bg-[#0d0820]/85 backdrop-blur-2xl rounded-full px-2 py-2 border border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]'
              : 'bg-[#0d0820]/40 backdrop-blur-xl rounded-full px-2 py-2 border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]'
        }`}>

          {/* Top shimmer line */}
          <div className="absolute inset-x-4 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

          {/* Mobile: Hamburger */}
          <div className={`md:hidden flex justify-between items-center ${isOpen ? 'px-4 pt-4 pb-3 border-b border-white/10' : ''}`}>
            {isOpen && (
              <span className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent tracking-[0.2em] uppercase">
                Menu
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(prev => !prev)}
              className="text-slate-300 hover:text-white min-h-11 min-w-11 flex justify-center items-center rounded-full hover:bg-white/10 transition-colors cursor-pointer ml-auto"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-0.5 items-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/25 to-fuchsia-500/25 border border-cyan-500/30 shadow-[0_0_16px_rgba(34,211,238,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden"
              >
                <div className="flex flex-col p-3 gap-1">
                  {navLinks.map((link, i) => {
                    const isActive = activeSection === link.href.replace('#', '');
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-500/15 to-fuchsia-500/15 text-white border border-white/10'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          )}
                          {link.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
