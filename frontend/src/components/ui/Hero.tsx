"use client";

import { Github, Linkedin, Facebook, MessageCircle, Mail } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section id="home" className="relative w-full flex items-center pt-40 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text and Actions */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-slate-100 mb-2">Hello I'm</h3>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white m-0 p-0 leading-none inline-flex">
              <span className="typing-name inline-block">Anjana Madhushan</span>
            </h1>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-[#d946ef] m-0 p-0 leading-tight dev-fade whitespace-nowrap">
              Fullstack Developer
            </h2>
            
            <p className="text-md text-slate-300 max-w-lg leading-relaxed pt-4 relative z-20 mix-blend-lighten">
              I'm a Developer, Designer, Content Creator, and Entrepreneur, passionate about technology, creativity, and digital innovation building impactful digital experiences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-6 relative z-20">
            <a href="#contact" className="px-8 py-3.5 rounded-xl bg-[#c026d3] text-white font-bold transition-all duration-300 hover:scale-105 hover:bg-[#d946ef] shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] active:scale-95">
              Hire Me
            </a>
            
            <a href="#projects" className="px-8 py-3.5 rounded-xl glass border-2 border-white/20 text-white font-bold transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/50 active:scale-95 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Works
            </a>
          </div>
        </div>

        {/* Right Side: Circular Glassmorphism Profile Image */}
        <div className="relative w-full max-w-md mx-auto md:ml-auto flex justify-center md:justify-end">
          {/* Glass Outer Ring */}
          <div className="relative w-[380px] h-[380px] md:w-[420px] md:h-[420px] rounded-full p-4 glass backdrop-blur-2xl border border-white/20 shadow-[0_0_60px_rgba(217,70,239,0.25)] flex items-center justify-center transition-all duration-500 hover:shadow-[0_0_80px_rgba(217,70,239,0.4)] hover:border-white/40">
            {/* Inner Profile Image Wrapper */}
            <div className="w-full h-full rounded-full overflow-hidden relative shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border-4 border-white/5 inner-glass">
              <img 
                src="/pro1.png" 
                alt="Anjana Madhushan" 
                className="w-full h-full object-cover relative z-10 transition-transform duration-700 hover:scale-110" 
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=800&auto=format&fit=crop';
                }}
              />
            </div>
          </div>
        </div>

        {/* Vertical Social Icons on the Far Right Edge aligned from top to bottom */}
        <div className="fixed top-1/2 right-4 md:right-8 flex flex-col gap-8 z-40 transform -translate-y-1/2">
          {[
            { icon: Github, href: 'https://github.com/' },
            { icon: Linkedin, href: '#' },
            { icon: Facebook, href: '#' },
            { icon: MessageCircle, href: '#' }, // representing whatsapp
            { icon: Mail, href: 'mailto:example@gmail.com' }, // newly added Email icon
          ].map((social, i) => (
            <a 
              key={i} 
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-slate-300 transition-all duration-300 hover:scale-110 hover:bg-[#d946ef]/20 hover:text-white hover:border-[#d946ef]/50 hover:shadow-[0_0_15px_rgba(217,70,239,0.4)] group"
            >
              <social.icon className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
