"use client";

import { useRef, useState } from 'react';
import { Globe, Palette, Terminal, Database } from 'lucide-react';

export default function Services() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const newIndex = Math.round((scrollLeft / maxScroll) * (services.length - 1));
      setActiveIndex(newIndex);
    }
  };

  const services = [
    {
      title: 'Web Development',
      description: 'Building responsive and performant web applications using modern frameworks like React and Next.js.',
      icon: Globe,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'UI/UX Design',
      description: 'Crafting premium, glassmorphic interfaces that provide an exceptional user experience.',
      icon: Palette,
      color: 'from-magenta-500 to-purple-500'
    },
    {
      title: 'DevOps & CI/CD',
      description: 'Streamlining deployment pipelines and managing cloud infrastructure for robust applications.',
      icon: Terminal,
      color: 'from-emerald-400 to-cyan-500'
    },
    {
      title: 'MLOps Integration',
      description: 'Deploying machine learning models into production environments with scalability and monitoring.',
      icon: Database,
      color: 'from-orange-400 to-pink-500'
    }
  ];

  return (
    <section id="services" className="py-24 relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <h3 className="text-white text-xl md:text-2xl font-bold border-l-4 border-[#d946ef] pl-4">Services</h3>
        </div>

        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto md:grid md:grid-cols-2 gap-5 md:gap-8 pb-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {services.map((service, i) => (
            <div key={i} className="w-[80vw] max-w-[300px] md:w-full md:max-w-none shrink-0 md:shrink snap-center snap-always glass-panel p-6 md:p-8 rounded-3xl group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-20 blur-3xl rounded-full group-hover:opacity-40 transition-opacity`} />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} p-0.5 mb-6 shadow-lg`}>
                  <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {services.map((_, index) => (
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
