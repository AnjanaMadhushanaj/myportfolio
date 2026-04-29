"use client";

import { Github, Linkedin, Twitter, Mail, ArrowUp, Facebook } from 'lucide-react';
import Link from 'next/link';
import { useCMSStore } from '@/store/useCMSStore';

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.52 3.44A12 12 0 0 0 12 0C5.38 0 0 5.38 0 12a11.96 11.96 0 0 0 1.6 6L0 24l6.15-1.61A11.96 11.96 0 0 0 12 24c6.62 0 12-5.38 12-12a12 12 0 0 0-3.48-8.56zm-8.52 18.57c-1.88 0-3.72-.51-5.34-1.47l-.38-.23-3.97 1.04 1.06-3.87-.25-.4A9.97 9.97 0 0 1 2.01 12C2.01 6.49 6.49 2 12 2s9.99 4.49 9.99 10-4.48 10-9.99 10zm5.48-7.5c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.49-1.79-1.67-2.09-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.24-.24-.59-.48-.5-.67-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.1 3.21 5.08 4.5.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.11.56-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z" />
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroData = useCMSStore((state) => state.hero);

  const socialLinks = [
    { icon: Github,       href: heroData?.githubUrl || "https://github.com/AnjanaMadhushanaj" },
    { icon: Linkedin,     href: heroData?.linkedinUrl || "#" },
    { icon: Facebook,     href: heroData?.facebookUrl || "#" },
    { icon: Mail,         href: heroData?.emailUrl ? (heroData.emailUrl.startsWith('mailto:') ? heroData.emailUrl : `mailto:${heroData.emailUrl}`) : "mailto:contact@example.com" },
  ];

  return (
    <footer className="relative mt-12 md:mt-24 border-t border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      {/* Background glow effects */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-24 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-8 md:pt-16 pb-8">
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
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target={social.href.startsWith('mailto') ? "_self" : "_blank"} 
                  rel="noopener noreferrer" 
                  className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:-translate-y-1 hover:text-cyan-400 transition-all text-slate-300"
                >
                  <social.icon size={20} />
                </a>
              ))}
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
