"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

export default function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      // 3 items in total, so index 0 to 2
      const newIndex = Math.round((scrollLeft / maxScroll) * 2);
      setActiveIndex(newIndex);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } }
  };

  return (
    <section id="projects" className="relative w-full py-12 md:py-24 z-10 border-t border-white/5 bg-[#0f0a1a]/40">
      {/* Background blend */}
      <div className="absolute top-0 left-0 w-full h-full bg-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-6 md:mb-10">
          <h3 className="text-white text-xl md:text-2xl font-bold border-l-4 border-[#d946ef] pl-4">Projects</h3>
        </div>

        <motion.div 
          ref={scrollRef as any}
          onScroll={handleScroll}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "100px" }}
          className="flex touch-pan-x md:touch-auto overflow-x-auto md:grid md:grid-cols-2 gap-5 md:gap-10 pb-4 pt-2 -mx-6 px-6 md:mx-0 md:px-0 md:pb-0 md:pt-0 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Project 1: The Crown Jewel */}
          <motion.div variants={itemVariants} className="w-[85vw] sm:w-[400px] md:max-w-none md:w-full md:col-span-2 shrink-0 snap-center relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex flex-col lg:flex-row bg-[#141021]/60 backdrop-blur-md border border-white/10 group-hover:border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
              
              {/* Left Side: Image/Architecture Placeholder */}
              <div className="w-full lg:w-1/2 relative min-h-[160px] md:min-h-[300px] lg:min-h-full overflow-hidden bg-[#0A0710]">
                {/* Simulated frosted glass overlay image */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-[40px]" />
              </div>

              {/* Right Side: Content */}
              <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center border-l-0 lg:border-l border-white/5">
                <span className="text-cyan-400 font-mono text-[10px] md:text-sm font-semibold tracking-wider mb-2 uppercase">Platform Engineering</span>
                <h3 className="text-xl md:text-4xl font-bold text-white mb-3 md:mb-6 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-fuchsia-300 transition-all duration-300">
                  Automated CI/CD Microservices Pipeline
                </h3>
                <p className="text-slate-300 font-light leading-snug md:leading-relaxed mb-5 md:mb-8 text-xs md:text-base">
                  A complete DevOps lifecycle demonstrating containerized Next.js and Python microservices, automated testing, and seamless deployment using GitHub Actions, Docker, and AWS.
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3 mb-5 md:mb-8">
                  {['Docker', 'AWS', 'GitHub Actions', 'Next.js'].map((tech, i) => (
                    <span key={i} className="px-3 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-medium text-cyan-100 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm group-hover:border-cyan-500/40 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all duration-300">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-5 mt-auto">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 hover:scale-110 transition-all duration-300 cursor-pointer">
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Projects 2 & 3: Full-Stack Roots */}
          
            {/* Project 2 */}
            <motion.div variants={itemVariants} className="w-[85vw] sm:w-[400px] md:max-w-none md:w-auto shrink-0 snap-center relative bg-[#141021]/60 backdrop-blur-md border border-white/10 hover:border-fuchsia-500/50 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group hover:-translate-y-2 md:h-auto flex flex-col">
              <div className="w-full h-44 md:h-56 relative overflow-hidden bg-[#0A0710]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-fuchsia-900/20 mix-blend-overlay" />
              </div>
              <div className="p-6 md:p-8 border-t border-white/5 flex-grow flex flex-col">
                <span className="text-fuchsia-400 font-mono text-[10px] md:text-xs font-semibold tracking-wider mb-2 uppercase block">Full-Stack Application</span>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 leading-tight">Enterprise Task Management System</h3>
                <p className="text-slate-300 text-xs md:text-sm font-light leading-snug md:leading-relaxed mb-4 md:mb-6 flex-grow">
                  A high-performance MERN stack application featuring real-time collaborative boards, role-based access control, and automated daily reporting.
                </p>
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6 mt-auto">
                  {['MongoDB', 'Express', 'React', 'Node.js', 'Socket.io'].map((tech, i) => (
                    <span key={i} className="px-3 py-1 text-[11px] font-medium text-slate-300 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors cursor-pointer"><Github className="w-5 h-5" /></a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-fuchsia-400 transition-colors cursor-pointer"><ExternalLink className="w-5 h-5" /></a>
                </div>
              </div>
            </motion.div>

            {/* Project 3 */}
            <motion.div variants={itemVariants} className="w-[85vw] sm:w-[400px] md:max-w-none md:w-auto shrink-0 snap-center relative bg-[#141021]/60 backdrop-blur-md border border-white/10 hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group hover:-translate-y-2 md:h-auto flex flex-col">
              <div className="w-full h-44 md:h-56 relative overflow-hidden bg-[#0A0710]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay" />
              </div>
              <div className="p-6 md:p-8 border-t border-white/5 flex-grow flex flex-col">
                <span className="text-cyan-400 font-mono text-[10px] md:text-xs font-semibold tracking-wider mb-2 uppercase block">Data Pipeline / ML</span>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 leading-tight">Real-Time Sensor Data Analytics</h3>
                <p className="text-slate-300 text-xs md:text-sm font-light leading-snug md:leading-relaxed mb-4 md:mb-6 flex-grow">
                  A scalable Python-based data ingestion pipeline predicting hardware failures using Random Forest models, deployed via Docker containers.
                </p>
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6 mt-auto">
                  {['Python', 'Scikit-Learn', 'Docker', 'PostgreSQL', 'Grafana'].map((tech, i) => (
                    <span key={i} className="px-3 py-1 text-[11px] font-medium text-slate-300 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors cursor-pointer"><Github className="w-5 h-5" /></a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"><ExternalLink className="w-5 h-5" /></a>
                </div>
              </div>
            </motion.div>

        </motion.div>
        
        {/* Dotted Indicators for Mobile */}
        <div className="flex justify-center gap-2 mt-4 md:mt-8 md:hidden">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "bg-cyan-400 w-4 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}
