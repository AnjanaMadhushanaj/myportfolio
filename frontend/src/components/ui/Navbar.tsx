"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[110] pt-4 md:pt-8 pb-4 w-full flex justify-start md:justify-center px-4 md:px-0 drop-shadow-2xl">
      <div 
        className={`bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 ${isOpen ? 'rounded-2xl w-full max-w-sm' : 'rounded-full p-1 md:px-6 md:py-2'}`}
      >
        {/* Mobile Header (Visible only on small screens when closed, or always when open) */}
        <div className={`md:hidden flex justify-between items-center ${isOpen ? 'p-4 border-b border-white/10' : ''}`}>
          {isOpen && <span className="text-white font-semibold ml-2">Menu</span>}
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className={`text-slate-300 hover:text-white min-h-[48px] min-w-[48px] flex justify-center items-center rounded-full hover:bg-white/10 transition-colors cursor-pointer ${!isOpen && 'hidden'}`}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          
          {/* Hamburger Icon when closed */}
          {!isOpen && (
            <button 
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-slate-300 hover:text-white min-h-[48px] min-w-[48px] flex justify-center items-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-1 items-center text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="px-4 py-1.5 hover:text-[#d946ef] hover:bg-white/10 rounded-full transition-all duration-300 min-h-[44px] flex items-center"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 hover:text-[#d946ef] hover:bg-white/10 rounded-xl transition-all duration-300 min-h-[44px] w-full text-left font-medium text-slate-300 flex items-center"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
