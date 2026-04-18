"use client";

import React, { useState, useEffect } from 'react';
import { 
  Download, MapPin, Clock, Languages, MessageSquare, 
  Terminal, Layers, Award, GraduationCap, FileBadge 
} from 'lucide-react';

export default function About() {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo' }));
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="relative w-full py-12 md:py-16 overflow-hidden z-10">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-[120px] translate-x-1/4 translate-y-1/3 pointer-events-none mix-blend-screen" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-6 md:mb-10">
          <h3 className="text-white text-xl md:text-2xl font-bold border-l-4 border-[#d946ef] pl-4">About Me</h3>
        </div>

        {/* Row 1: Bio + 3 Stacked Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-6 mb-4 md:mb-6">
          
          {/* Main Bio Box (left, col-span-2) */}
          <div className="lg:col-span-2 flex flex-col justify-between bg-[#141021]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 pr-16 sm:pr-8 sm:p-8 lg:p-10 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-500" />
            
            <div className="relative z-10 space-y-3 mb-6 md:mb-8 text-left">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Hi! I am <br className="md:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                   Anjana Madhushan
                </span>
              </h2>
              <h3 className="text-[13px] md:text-[1.1rem] lg:text-xl font-semibold text-cyan-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] mt-2 md:mt-3 tracking-wide">
                Full-Stack Developer <span className="text-fuchsia-400 mx-1.5 font-light">|</span> DevOps Engineer <span className="text-fuchsia-400 mx-1.5 font-light">|</span> MLOps Enthusiast
              </h3>
              <p className="text-sm md:text-lg text-slate-200 leading-snug md:leading-relaxed font-light mt-4 md:mt-5 max-w-2xl">
                A 3rd-year university student transitioning from building scalable 
                user experiences as a Full-Stack Developer to designing high-performance 
                computational systems. My current drive lies in automating robust CI/CD pipelines, 
                architecting resilient cloud infrastructure, and integrating MLOps workflows to support AI-driven outcomes.
              </p>
            </div>

            <div className="relative z-10 mt-auto flex justify-start">
              <a 
                href="#resume" 
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#d946ef] text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-[#e85bff] shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] text-sm group/btn"
              >
                <Download className="w-4 h-4 text-white group-hover/btn:-translate-y-1 transition-transform" />
                Resume / Download
              </a>
            </div>
          </div>

          {/* Right Stack (Location, Languages, Soft Skills) */}
          <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6">
            {/* Box: Location */}
            <div className="flex-1 bg-[#141021]/80 backdrop-blur-md border border-white/5 rounded-3xl p-5 md:p-6 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className="flex items-center gap-3 md:gap-4">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <h3 className="text-base md:text-lg font-bold text-white tracking-wide">Location</h3>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 text-cyan-300 font-mono text-[10px] md:text-xs px-2 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                  <Clock className="w-3 h-3" /> {time || "Loading..."}
                </div>
              </div>
              <ul className="space-y-1 md:space-y-2 pl-7 md:pl-9 text-xs md:text-sm text-slate-200">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_5px_#22d3ee]" /> Sri Lanka</li>
              </ul>
            </div>

            {/* Box: Languages */}
            <div className="flex-1 bg-[#141021]/80 backdrop-blur-md border border-white/5 rounded-3xl p-5 md:p-6 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center relative overflow-hidden group">
              <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                <Languages className="w-4 h-4 md:w-5 md:h-5 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
                <h3 className="text-base md:text-lg font-bold text-white tracking-wide">Languages</h3>
              </div>
              <ul className="space-y-1 md:space-y-2 pl-7 md:pl-9 text-xs md:text-sm text-slate-200">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/80 shadow-[0_0_5px_#d946ef]" /> Sinhala</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/80 shadow-[0_0_5px_#d946ef]" /> English</li>
              </ul>
            </div>

            {/* Box: Soft Skills */}
            <div className="flex-1 bg-[#141021]/80 backdrop-blur-md border border-white/5 rounded-3xl p-5 md:p-6 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center relative overflow-hidden group">
              <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                <h3 className="text-base md:text-lg font-bold text-white tracking-wide">Soft Skills</h3>
              </div>
              <ul className="space-y-1 md:space-y-2 pl-7 md:pl-9 text-xs md:text-sm text-slate-200">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-400/80 shadow-[0_0_5px_#22c55e]" /> Communication</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Row 2: 3 Equal Boxes (Focus, Stack, Achievements) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Current Focus */}
          <div className="bg-[#141021]/80 backdrop-blur-md border border-white/5 rounded-3xl p-5 md:p-8 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-[50px] pointer-events-none" />
             <Terminal className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] mb-3 md:mb-4" />
             <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 md:mb-2 tracking-wide">Current Focus</h3>
             <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-light">
               Cloud Infrastructure, Containerization, and reliable pipelines.
             </p>
          </div>

          {/* Favorite Stack */}
          <div className="bg-[#141021]/80 backdrop-blur-md border border-white/5 rounded-3xl p-5 md:p-8 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/15 rounded-full blur-[50px] pointer-events-none" />
             <Layers className="w-6 h-6 md:w-8 md:h-8 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] mb-3 md:mb-4" />
             <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 md:mb-2 tracking-wide">Favorite Stack</h3>
             <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-light">
               Next.js, Tailwind, Docker, JavaScript/TS, Python
             </p>
          </div>

          {/* Achievements */}
          <div className="bg-[#141021]/80 backdrop-blur-md border border-white/5 rounded-3xl p-5 md:p-8 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/15 rounded-full blur-[50px] pointer-events-none" />
             <Award className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] mb-3 md:mb-4" />
             <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 md:mb-2 tracking-wide">Achievements</h3>
             <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-light">
               Awarded Top Performer in Hackathon 2024 and Postman API Certified.
             </p>
          </div>
        </div>

        {/* Row 3: Certificates & Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Certificates */}
          <div className="bg-[#141021]/80 backdrop-blur-md border border-white/5 rounded-3xl p-5 md:p-8 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-48 h-48 bg-fuchsia-500/15 rounded-full blur-[60px] pointer-events-none" />
             <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#141021] border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shadow-[inset_0_0_15px_rgba(217,70,239,0.2)] shrink-0">
                  <FileBadge className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 tracking-wide">Certificates</h3>
                  <ul className="text-xs md:text-sm text-slate-200 leading-relaxed space-y-1.5 md:space-y-2">
                    <li className="flex items-center gap-2 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/80 shadow-[0_0_5px_#d946ef]" /> AWS Certified Cloud Practitioner</li>
                    <li className="flex items-center gap-2 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/80 shadow-[0_0_5px_#d946ef]" /> HackerRank Problem Solving Basic</li>
                  </ul>
                </div>
             </div>
          </div>

          {/* Badges */}
          <div className="bg-[#141021]/80 backdrop-blur-md border border-white/5 rounded-3xl p-5 md:p-8 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/15 rounded-full blur-[60px] pointer-events-none" />
             <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#141021] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)] shrink-0">
                  <Award className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 tracking-wide">Badges</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2.5 py-1 bg-[#1a1429] border border-cyan-500/30 rounded-full text-[10px] md:text-xs text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)] font-medium tracking-wide">Top Performer</span>
                    <span className="px-2.5 py-1 bg-[#1a1429] border border-yellow-500/30 rounded-full text-[10px] md:text-xs text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.2)] font-medium tracking-wide">Problem Solver</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Row 4: Education */}
        <div className="bg-[#141021]/80 backdrop-blur-md border border-white/5 rounded-3xl p-5 md:p-8 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-500/15 rounded-full blur-[60px] pointer-events-none" />
           <div className="flex items-start gap-4 md:gap-5 relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#141021] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)] shrink-0">
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 md:mb-2 tracking-wide">Education</h3>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                  <strong className="text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] font-medium">BSc (Hons) Software Engineering</strong> — 3rd Year Undergraduate
                </p>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
