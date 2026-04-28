"use client";

/**
 * SkillsClient.tsx — Client Interactive Inner
 * Dynamic Category Cards with Horizontal Sliding.
 */

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Globe, Terminal, Code } from "lucide-react";
import Image from "next/image";
import type { SkillsData, SkillItem, SkillCategory } from "@/types/cms";
import { useCMSStore } from "@/store/useCMSStore";
import { useAdmin } from "@/context/AuthContext";
import Editable from "@/components/ui/Editable";
import { updateCMSSection } from "@/app/actions/cms";

interface Props {
  data: SkillsData;
}

const SkillBadge = ({ skill, path, onDelete, isAdmin }: { skill: SkillItem; path: string; onDelete: () => void; isAdmin: boolean }) => (
  <div className="flex justify-between items-center bg-[#1a1429]/60 backdrop-blur-md border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(34,211,238,0.15)] rounded-2xl py-2 px-3 md:p-4 transition-all duration-300 group relative cursor-default">
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 md:w-7 md:h-7 shrink-0 flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform duration-300">
        {isAdmin ? (
          <Editable path={`${path}.icon`} className="inline-block">
            <Image 
              src={skill.icon} 
              alt={skill.name} 
              width={28} 
              height={28} 
              className="max-w-full max-h-full object-contain"
              unoptimized // SVGs don't need resizing optimization
              loading="lazy"
            />
          </Editable>
        ) : (
          <Image 
            src={skill.icon} 
            alt={skill.name} 
            width={28} 
            height={28} 
            className="max-w-full max-h-full object-contain"
            unoptimized
            loading="lazy"
          />
        )}
      </div>
      <Editable path={`${path}.name`} className="inline-block" isAdmin={isAdmin}>
        <span className="font-semibold text-[13px] md:text-sm lg:text-base text-slate-300 group-hover:text-white transition-colors tracking-wide">{skill.name}</span>
      </Editable>
    </div>
    <div className="flex items-center gap-2">
      <Editable path={`${path}.proficiency`} className="inline-block" isAdmin={isAdmin}>
        <span className="font-mono text-cyan-400 font-bold text-xs md:text-sm bg-[#141021]/80 px-2 py-1 rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500/10 group-hover:border-cyan-400/40 transition-colors shadow-[0_0_5px_rgba(0,0,0,0.5)]">
          {skill.proficiency}%
        </span>
      </Editable>
      {isAdmin && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all absolute -top-1 -right-1 bg-slate-900 rounded-full border border-red-500/30"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  </div>
);

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } } };

export default function SkillsClient({ data: initialData }: Props) {
  const { isAdmin } = useAdmin();
  const { skills: storeData, updateField } = useCMSStore();
  
  // Combine store data and initial data
  const rawData = storeData || initialData;
  
  // Safety check: ensure categories exists. If not, handle legacy data or empty state.
  const data: SkillsData = React.useMemo(() => {
    if (rawData && rawData.categories) return rawData as SkillsData;
    
    // Convert legacy data to new structure if possible
    const legacy = rawData as any;
    if (legacy.languages || legacy.frontend || legacy.backend || legacy.tools) {
      return {
        categories: [
          { id: 'languages', label: 'Languages', items: legacy.languages || [] },
          { id: 'frontend', label: 'Frontend Development', items: legacy.frontend || [] },
          { id: 'backend', label: 'Backend & Databases', items: legacy.backend || [] },
          { id: 'tools', label: 'Tools & DevOps', items: legacy.tools || [] },
        ]
      };
    }
    
    return { categories: [] };
  }, [rawData]);

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;
    
    const index = Math.round((scrollLeft / container.clientWidth));
    setActiveIndex(index);
  };

  const addCategory = async () => {
    try {
      console.log("🛠️ Attempting to add new skill category...");
      const newCategory: SkillCategory = {
        id: `cat-${Date.now()}`,
        label: "New Skill Category",
        items: [
          { name: "Skill Name", proficiency: 80, icon: "https://cdn.simpleicons.org/react/61DAFB" }
        ],
      };
      
      const currentCategories = data.categories || [];
      const newCategories = [...currentCategories, newCategory];
      
      // 1. Update Local Store (Instant UI change)
      updateField("skills", { categories: newCategories });
      
      console.log("✅ Store updated locally. New count:", newCategories.length);

      // 2. Scroll to the new card
      setTimeout(() => {
        if (scrollRef.current) {
          const container = scrollRef.current;
          container.scrollTo({
            left: container.scrollWidth,
            behavior: 'smooth'
          });
        }
      }, 150);

      // 3. Sync with Backend
      await updateCMSSection("skills", { categories: newCategories });
      console.log("☁️ Backend sync completed.");
    } catch (error) {
      console.error("❌ Failed to add category:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this entire skill category?")) return;
    const newCategories = data.categories.filter(c => c.id !== id);
    updateField("skills.categories", newCategories);
    await updateCMSSection("skills", { categories: newCategories });
  };

  const addSkillToCategory = async (catIndex: number) => {
    const newSkill: SkillItem = {
      name: "New Skill",
      proficiency: 80,
      icon: "https://cdn.simpleicons.org/react/61DAFB",
    };
    const newCategories = [...data.categories];
    newCategories[catIndex].items = [...newCategories[catIndex].items, newSkill];
    
    updateField("skills.categories", newCategories);
    await updateCMSSection("skills", { categories: newCategories });
  };

  const deleteSkillFromCategory = async (catIndex: number, skillIndex: number) => {
    const newCategories = [...data.categories];
    newCategories[catIndex].items = newCategories[catIndex].items.filter((_, i) => i !== skillIndex);
    
    updateField("skills.categories", newCategories);
    await updateCMSSection("skills", { categories: newCategories });
  };

  return (
    <section id="skills" className="relative w-full pt-2 pb-8 md:pt-4 md:pb-16 z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-6 md:mb-10 flex justify-between items-end">
          <h3 className="text-white text-xl md:text-2xl font-bold border-l-4 border-[#d946ef] pl-4">Skills</h3>
          {isAdmin && (
            <button 
              onClick={addCategory}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Plus size={18} />
              Add Skill Card
            </button>
          )}
        </div>

        <motion.div
          ref={scrollRef as React.RefObject<HTMLDivElement>}
          onScroll={handleScroll}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "100px" }}
          style={{ gridAutoColumns: 'calc(50% - 16px)' }}
          className="flex overflow-x-auto md:grid md:grid-rows-2 md:grid-flow-col gap-5 md:gap-8 pb-8 pt-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory scroll-pl-6 md:scroll-pl-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.categories && data.categories.map((cat, catIndex) => (
            <motion.div
              key={cat.id || catIndex}
              variants={itemVariants}
              className="w-[85vw] md:w-full shrink-0 snap-start snap-always bg-[#141021]/95 md:bg-[#141021]/60 backdrop-blur-xl border border-white/25 md:border-white/5 rounded-3xl p-5 md:p-8 shadow-xl relative group/card"
            >
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                  <button 
                    onClick={() => addSkillToCategory(catIndex)}
                    className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                    title="Add Skill"
                  >
                    <Plus size={16} />
                  </button>
                  <button 
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover/card:opacity-100"
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              
              <div className="mb-4 md:mb-6 border-b border-white/10 pb-3 md:pb-4 flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full bg-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]`} />
                <Editable path={`skills.categories.${catIndex}.label`} className="inline-block" isAdmin={isAdmin}>
                  <h3 className="text-lg md:text-xl font-bold text-white">{cat.label}</h3>
                </Editable>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {cat.items && cat.items.map((skill, i) => (
                  <SkillBadge 
                    key={i} 
                    skill={skill} 
                    path={`skills.categories.${catIndex}.items.${i}`} 
                    isAdmin={isAdmin}
                    onDelete={() => deleteSkillFromCategory(catIndex, i)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Indicators for both mobile and desktop views */}
        <div className="flex justify-center gap-2 mt-6">
          {data.categories && Array.from({ length: Math.ceil(data.categories.length / 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollRef.current) {
                  const container = scrollRef.current;
                  const scrollAmount = container.clientWidth * index;
                  container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "bg-cyan-400 w-8 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  : "bg-white/20 w-2 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
