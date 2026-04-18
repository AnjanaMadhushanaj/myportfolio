"use client";

import React from 'react';

const techRow1 = [
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
  { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
  { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg' },
  { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg' },
];

const techRow2 = [
  { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg' },
  { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg' },
  { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg' },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Laravel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg' },
];

const techRow3 = [
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
  { name: 'JS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'TS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
  { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg' },
  { name: 'Postman', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg' },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
];

const TechCard = ({ name, icon }: { name: string; icon: string }) => (
  <div className="flex flex-col items-center justify-center py-3 px-4 min-w-[100px] md:min-w-[110px] bg-[#141021]/80 backdrop-blur-md border border-white/5 rounded-2xl hover:bg-[#201836] transition-all duration-300 hover:scale-105 group hover:border-white/10 hover:shadow-[0_0_15px_rgba(217,70,239,0.1)]">
    <div className="h-7 w-7 md:h-9 md:w-9 mb-2 relative flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
      <img src={icon} alt={name} className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
    </div>
    <span className="text-slate-400 text-xs md:text-sm font-medium group-hover:text-white transition-colors">{name}</span>
  </div>
);

export default function TechStack() {
  const mobileRow1 = [techRow1[0], techRow1[2], techRow2[4], techRow2[5], techRow3[0]]; // Docker, Git, Node.js, React, HTML5
  const mobileRow2 = [techRow1[3], techRow1[4], techRow2[3], techRow3[1], techRow3[4]]; // Python, Java, MySQL, CSS3, Tailwind
  const mobileRow3 = [techRow1[1], techRow2[0], techRow3[3], techRow3[6]]; // Linux, C++, TS, Postman
  const mobileRow4 = [techRow1[5], techRow2[1], techRow2[6], techRow3[2]]; // Kotlin, C#, Laravel, JS
  const mobileRow5 = [techRow1[6], techRow2[2], techRow3[5], techRow3[7]]; // C, PHP, Bootstrap, Figma

  const desktopRow1 = [...techRow1, techRow3[0], techRow3[1], techRow3[2], techRow3[3]]; // 11 items
  const desktopRow2 = [...techRow2, techRow3[4], techRow3[5], techRow3[6], techRow3[7]]; // 11 items

  return (
    <section className="py-12 relative w-full overflow-hidden border-y border-white/5 bg-[#0e0a1a]/50">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <h3 className="text-white text-xl md:text-2xl font-bold border-l-4 border-[#d946ef] pl-4">Languages & Tools</h3>
      </div>
      
      {/* Container for Infinite Scroll - DESKTOP (2 Rows) */}
      <div className="hidden md:flex relative w-full max-w-7xl mx-auto flex-col gap-6 mask-image-linear-x pt-2 pb-6">
        
        {/* Row 1 - scrolling left */}
        <div className="flex w-full overflow-hidden">
          <div className="flex gap-4 animate-scroll-left w-max">
            {/* Duplicate the children for seamless wrap */}
            {[...desktopRow1, ...desktopRow1, ...desktopRow1].map((tech, i) => (
              <TechCard key={`desktop-row1-${i}`} {...tech} />
            ))}
          </div>
        </div>

        {/* Row 2 - scrolling right */}
        <div className="flex w-full overflow-hidden">
          <div className="flex gap-4 animate-scroll-right w-max">
            {/* Duplicate the children for seamless wrap */}
            {[...desktopRow2, ...desktopRow2, ...desktopRow2].map((tech, i) => (
              <TechCard key={`desktop-row2-${i}`} {...tech} />
            ))}
          </div>
        </div>

      </div>

      {/* Container for Infinite Scroll - MOBILE (5 Rows) */}
      <div className="flex md:hidden relative w-full flex-col gap-4 mask-image-linear-x pt-2 pb-2">
        
        {/* Mobile Row 1 */}
        <div className="flex w-full overflow-hidden">
          <div className="flex gap-4 animate-scroll-left w-max" style={{ animationDuration: '25s' }}>
            {[...mobileRow1, ...mobileRow1, ...mobileRow1].map((tech, i) => (
              <TechCard key={`mobile-row1-${i}`} {...tech} />
            ))}
          </div>
        </div>

        {/* Mobile Row 2 */}
        <div className="flex w-full overflow-hidden">
          <div className="flex gap-4 animate-scroll-right w-max" style={{ animationDuration: '25s' }}>
            {[...mobileRow2, ...mobileRow2, ...mobileRow2].map((tech, i) => (
              <TechCard key={`mobile-row2-${i}`} {...tech} />
            ))}
          </div>
        </div>

        {/* Mobile Row 3 */}
        <div className="flex w-full overflow-hidden">
          <div className="flex gap-4 animate-scroll-left w-max" style={{ animationDuration: '20s' }}>
            {[...mobileRow3, ...mobileRow3, ...mobileRow3].map((tech, i) => (
              <TechCard key={`mobile-row3-${i}`} {...tech} />
            ))}
          </div>
        </div>

        {/* Mobile Row 4 */}
        <div className="flex w-full overflow-hidden">
          <div className="flex gap-4 animate-scroll-right w-max" style={{ animationDuration: '20s' }}>
            {[...mobileRow4, ...mobileRow4, ...mobileRow4].map((tech, i) => (
              <TechCard key={`mobile-row4-${i}`} {...tech} />
            ))}
          </div>
        </div>

        {/* Mobile Row 5 */}
        <div className="flex w-full overflow-hidden">
          <div className="flex gap-4 animate-scroll-left w-max" style={{ animationDuration: '20s' }}>
            {[...mobileRow5, ...mobileRow5, ...mobileRow5].map((tech, i) => (
              <TechCard key={`mobile-row5-${i}`} {...tech} />
            ))}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .mask-image-linear-x {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        
        .animate-scroll-left {
          animation: scrollLeft 40s linear infinite;
        }
        
        .animate-scroll-right {
          animation: scrollRight 40s linear infinite;
        }

        .animate-scroll-left:hover, .animate-scroll-right:hover {
          animation-play-state: paused;
        }
        
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        
        @keyframes scrollRight {
          0% { transform: translateX(calc(-100% / 3)); }
          100% { transform: translateX(0); }
        }
      `}} />
    </section>
  );
}
