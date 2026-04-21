"use client";

import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      {/* Background glow effects */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-24 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 relative z-10">
          {/* Brand & Intro */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent inline-block">
              Anjana Madhushan
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Crafting scalable web applications and intuitive digital experiences. Dedicated to modern design and clean code.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <span className="w-4 h-0.5 bg-cyan-500"></span>
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              {['About', 'Services', 'Skills', 'Projects'].map((link) => (
                <Link 
                  key={link} 
                  href={`#${link.toLowerCase()}`}
                  className="text-slate-400 hover:text-cyan-400 transition-colors w-w-fit text-sm"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials & Connect */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <span className="w-4 h-0.5 bg-cyan-500"></span>
              Connect
            </h4>
            <div className="flex gap-4">
              <a href="https://github.com/AnjanaMadhushanaj" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:-translate-y-1 hover:text-cyan-400 transition-all text-slate-300">
                <Github size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:-translate-y-1 hover:text-cyan-400 transition-all text-slate-300">
                <Linkedin size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:-translate-y-1 hover:text-cyan-400 transition-all text-slate-300">
                <Twitter size={20} />
              </a>
              <a href="mailto:contact@example.com" className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:-translate-y-1 hover:text-cyan-400 transition-all text-slate-300">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} <span className="text-slate-300">Anjana Madhushan</span>. All rights reserved.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors group px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30"
          >
            Back to top
            <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
