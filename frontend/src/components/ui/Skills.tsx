"use client";

import React from 'react';
import { motion } from 'framer-motion';

const languages = [
  { name: 'JavaScript', proficiency: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript', proficiency: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
  { name: 'Python', proficiency: 75, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
  { name: 'Java', proficiency: 70, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
  { name: 'C#', proficiency: 70, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg' },
  { name: 'C++', proficiency: 65, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg' },
];

const frontend = [
  { name: 'React', proficiency: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Next.js', proficiency: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
  { name: 'Tailwind CSS', proficiency: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'HTML5', proficiency: 95, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  { name: 'CSS3', proficiency: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
  { name: 'Bootstrap', proficiency: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg' },
];

const backend = [
  { name: 'Node.js', proficiency: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'PHP', proficiency: 75, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg' },
  { name: 'MySQL', proficiency: 80, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
  { name: 'C', proficiency: 60, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg' },
];

const toolsAndDevops = [
  { name: 'Docker', proficiency: 75, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
  { name: 'Git', proficiency: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
  { name: 'Linux', proficiency: 75, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
  { name: 'Figma', proficiency: 70, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
  { name: 'Postman', proficiency: 80, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg' },
];

const SkillBadge = ({ name, proficiency, icon }: { name: string, proficiency: number, icon: string }) => {
  return (
    <div className="flex justify-between items-center bg-[#1a1429]/60 backdrop-blur-md border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(34,211,238,0.15)] rounded-2xl p-3 md:p-4 transition-all duration-300 group cursor-default">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform duration-300">
          <img src={icon} alt={name} className="max-w-full max-h-full object-contain" />
        </div>
        <span className="font-semibold text-[13px] md:text-sm lg:text-base text-slate-300 group-hover:text-white transition-colors tracking-wide">{name}</span>
      </div>
      <span className="font-mono text-cyan-400 font-bold text-xs md:text-sm bg-[#141021]/80 px-2 py-1 rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500/10 group-hover:border-cyan-400/40 transition-colors shadow-[0_0_5px_rgba(0,0,0,0.5)]">
        {proficiency}%
      </span>
    </div>
  );
};

export default function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <section id="skills" className="relative w-full py-16 z-10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header (Matched to other sections) */}
        <div className="mb-10">
          <h3 className="text-white text-xl md:text-2xl font-bold border-l-4 border-[#d946ef] pl-4">Skills</h3>
        </div>

        {/* 2x2 Grid for Categorized Skill Bars */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          
           {/* Languages */}
           <motion.div variants={itemVariants} className="bg-[#141021]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                Languages
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
               {languages.map((skill, i) => (
                  <SkillBadge key={i} name={skill.name} proficiency={skill.proficiency} icon={skill.icon} />
               ))}
             </div>
           </motion.div>

           {/* Frontend */}
           <motion.div variants={itemVariants} className="bg-[#141021]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-fuchsia-400 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]" />
                Frontend Development
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
               {frontend.map((skill, i) => (
                  <SkillBadge key={i} name={skill.name} proficiency={skill.proficiency} icon={skill.icon} />
               ))}
             </div>
           </motion.div>

           {/* Backend & DB */}
           <motion.div variants={itemVariants} className="bg-[#141021]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" />
                Backend & Databases
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
               {backend.map((skill, i) => (
                  <SkillBadge key={i} name={skill.name} proficiency={skill.proficiency} icon={skill.icon} />
               ))}
             </div>
           </motion.div>

           {/* Tools & DevOps */}
           <motion.div variants={itemVariants} className="bg-[#141021]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" />
                Tools & DevOps
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
               {toolsAndDevops.map((skill, i) => (
                  <SkillBadge key={i} name={skill.name} proficiency={skill.proficiency} icon={skill.icon} />
               ))}
             </div>
           </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
