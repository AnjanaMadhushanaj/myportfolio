"use client";

/**
 * ProjectsClient.tsx — Client Interactive Inner
 * Fully integrated with CMS Store for inline editing.
 */

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Plus, Trash2, Star, Image as ImageIcon } from "lucide-react";
import type { ProjectsData, ProjectItem } from "@/types/cms";
import { useCMSStore } from "@/store/useCMSStore";
import { useAdmin } from "@/context/AuthContext";
import Editable from "@/components/ui/Editable";
import { updateCMSSection } from "@/app/actions/cms";

interface Props {
  data: ProjectsData;
}

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } } };

interface CardProps {
  project: ProjectItem;
  path: string;
  isAdmin: boolean;
  onDelete: () => void;
  onToggleFeatured: () => void;
}

function FeaturedCard({ project, path, isAdmin, onDelete, onToggleFeatured }: CardProps) {
  return (
    <motion.div variants={itemVariants} className="w-full h-full shrink-0 snap-center relative group/card">
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2 z-50">
          <button onClick={onToggleFeatured} className="p-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40 rounded-xl transition-all" title="Featured Project">
            <Star size={18} fill="currentColor" />
          </button>
          <button onClick={onDelete} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-xl transition-all opacity-0 group-hover/card:opacity-100" title="Delete Project">
            <Trash2 size={18} />
          </button>
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 to-fuchsia-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex flex-col lg:flex-row bg-[#141021]/95 md:bg-[#141021]/60 backdrop-blur-md border border-white/25 md:border-white/10 group-hover:border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 h-full">
        <div className="w-full lg:w-1/2 relative min-h-48 md:min-h-75 lg:min-h-full overflow-hidden bg-[#0A0710]">
          {isAdmin ? (
            <Editable path={`${path}.imageUrl`} type="image" className="absolute inset-0 h-full w-full">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url('${project.imageUrl}')` }}
              />
            </Editable>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url('${project.imageUrl}')` }}
            />
          )}
          <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
        </div>
        <div className="w-full lg:w-1/2 p-5 md:p-6 lg:p-8 flex flex-col justify-center border-l-0 lg:border-l border-white/5">
          <Editable path={`${path}.category`} className="inline-block" isAdmin={isAdmin}>
            <span className="text-cyan-400 font-mono text-[10px] md:text-sm font-semibold tracking-wider mb-2 uppercase block">{project.category}</span>
          </Editable>
          <Editable path={`${path}.title`} className="inline-block" isAdmin={isAdmin}>
            <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-cyan-300 group-hover:to-fuchsia-300 transition-all duration-300">
              {project.title}
            </h3>
          </Editable>
          <Editable path={`${path}.description`} type="textarea" className="inline-block" isAdmin={isAdmin}>
            <p className="text-slate-300 font-light leading-snug md:leading-relaxed mb-4 md:mb-5 text-[13px] md:text-sm">{project.description}</p>
          </Editable>

          <div className="flex flex-wrap gap-2 md:gap-2.5 mb-4 md:mb-5">
            <Editable path={`${path}.techStack`} type="array" className="inline-block" isAdmin={isAdmin}>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="px-2.5 md:px-3 py-1 md:py-1 text-[10px] md:text-[11px] font-medium text-cyan-100 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm group-hover:border-cyan-500/40 transition-all duration-300">{tech}</span>
                ))}
              </div>
            </Editable>
          </div>

          <div className="flex items-center gap-5 mt-auto">
            <Editable path={`${path}.githubLink`} className="inline-block" isAdmin={isAdmin}>
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all duration-300 block"><Github className="w-6 h-6" /></a>
            </Editable>
            <Editable path={`${path}.liveLink`} className="inline-block" isAdmin={isAdmin}>
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 hover:scale-110 transition-all duration-300 block"><ExternalLink className="w-6 h-6" /></a>
            </Editable>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StandardCard({ project, path, isAdmin, onDelete, onToggleFeatured, accentColor }: CardProps & { accentColor: "fuchsia" | "cyan" }) {
  const borderHover = accentColor === "fuchsia" ? "hover:border-fuchsia-500/50" : "hover:border-cyan-500/50";
  const catColor = accentColor === "fuchsia" ? "text-fuchsia-400" : "text-cyan-400";
  const overlayColor = accentColor === "fuchsia" ? "bg-fuchsia-900/20" : "bg-cyan-900/20";

  return (
    <motion.div
      variants={itemVariants}
      className={`w-full h-full shrink-0 snap-center relative bg-[#141021]/95 md:bg-[#141021]/60 backdrop-blur-md border border-white/25 md:border-white/10 ${borderHover} rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group/card hover:-translate-y-2 flex flex-col items-start text-left`}
    >
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2 z-50">
          <button onClick={onToggleFeatured} className="p-2 bg-white/10 text-white/40 hover:text-yellow-400 hover:bg-yellow-500/20 rounded-xl transition-all" title="Make Featured">
            <Star size={18} />
          </button>
          <button onClick={onDelete} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-xl transition-all opacity-0 group-hover/card:opacity-100" title="Delete Project">
            <Trash2 size={18} />
          </button>
        </div>
      )}

      <div className="w-full h-48 md:h-40 relative overflow-hidden bg-[#0A0710] shrink-0">
        {isAdmin ? (
          <Editable path={`${path}.imageUrl`} type="image" className="absolute inset-0 h-full w-full">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url('${project.imageUrl}')` }}
            />
          </Editable>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url('${project.imageUrl}')` }}
          />
        )}
        <div className={`absolute inset-0 ${overlayColor} mix-blend-overlay pointer-events-none`} />
      </div>

      <div className="p-5 md:p-6 border-t border-white/5 flex flex-col grow w-full items-start">
        {/* Static content area - no scrolling */}
        <div className="flex flex-col grow w-full items-start space-y-3 pt-1">
          <div className="w-full flex justify-start">
            <Editable path={`${path}.category`} className="block" isAdmin={isAdmin}>
              <span className={`${catColor} font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase`}>{project.category}</span>
            </Editable>
          </div>
          
          <div className="w-full flex justify-start text-left">
            <Editable path={`${path}.title`} className="block" isAdmin={isAdmin}>
              <h3 className="text-lg md:text-xl font-extrabold text-white leading-tight pr-4">{project.title}</h3>
            </Editable>
          </div>
          
          <div className="w-full flex justify-start text-left">
            <Editable path={`${path}.description`} type="textarea" className="block w-full" isAdmin={isAdmin}>
              <p className="text-slate-400 text-[12px] md:text-[13px] font-normal leading-relaxed pr-4 line-clamp-4">{project.description}</p>
            </Editable>
          </div>
          
          <div className="pt-1 w-full flex justify-start">
            <Editable path={`${path}.techStack`} type="array" className="block w-full" isAdmin={isAdmin}>
              <div className="flex flex-wrap gap-2 justify-start">
                {project.techStack.filter(t => t.trim() !== "").slice(0, 8).map((tech, i) => (
                  <span key={i} className="px-3 py-1 text-[10px] font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/10 transition-colors uppercase tracking-wider">{tech}</span>
                ))}
              </div>
            </Editable>
          </div>
        </div>

        {/* Fixed bottom area - icons close together */}
        <div className="flex items-center justify-start gap-5 shrink-0 pt-4 mt-auto border-t border-white/5 w-full">
          <Editable path={`${path}.githubLink`} className="inline-block" isAdmin={isAdmin}>
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors cursor-pointer block"><Github className="w-5 h-5" /></a>
          </Editable>
          <Editable path={`${path}.liveLink`} className="inline-block" isAdmin={isAdmin}>
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className={`text-slate-400 ${accentColor === "fuchsia" ? "hover:text-fuchsia-400" : "hover:text-cyan-400"} transition-colors cursor-pointer block`}><ExternalLink className="w-5 h-5" /></a>
          </Editable>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsClient({ data: initialData }: Props) {
  const { isAdmin } = useAdmin();
  const { projects: storeData, updateField } = useCMSStore();

  // Safe data merge
  const data = React.useMemo(() => {
    return storeData || initialData;
  }, [storeData, initialData]);

  const featured = React.useMemo(() => data.items.filter((p) => p.featured), [data.items]);
  const standard = React.useMemo(() => data.items.filter((p) => !p.featured), [data.items]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset scroll position on mount or when switching to mobile
  useEffect(() => {
    if (isMobile && scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'auto' });
      setActiveIndex(0);
    }
  }, [isMobile]);

  // Reset slider on scroll away (when not intersecting)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && scrollRef.current) {
          // Use scrollTo with behavior auto to bypass scroll-smooth for immediate reset
          scrollRef.current.scrollTo({ left: 0, behavior: 'auto' });
          setActiveIndex(0);
        }
      },
      { threshold: 0 }
    );

    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      observer.observe(currentScrollRef);
    }

    return () => {
      if (currentScrollRef) observer.unobserve(currentScrollRef);
    };
  }, []);

  const displayItems = React.useMemo(() => {
    if (!isMobile) return standard;
    // On mobile, always put featured project first if it exists
    return [...data.items].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [data.items, isMobile, standard]);


  const addProject = async () => {
    try {
      const newProject: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: "New Project Title",
        category: "Project Category",
        description: "Click here to edit the project description and details.",
        techStack: ["Next.js", "React"],
        githubLink: "https://github.com",
        liveLink: "https://example.com",
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80",
        featured: false // Default to false so it appears in the slider
      };

      const newItems = [...data.items, newProject];
      // 1. Instant local update
      updateField("projects", { items: newItems });

      // 2. Background sync (no await)
      updateCMSSection("projects", { items: newItems }).catch(err => console.error("Sync failed:", err));

      // 3. Scroll to the far right to see the new project
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: scrollRef.current.scrollWidth,
            behavior: "smooth"
          });
        }
      }, 100);
    } catch (error) {
      console.error("❌ Add project failed:", error);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const newItems = data.items.filter(p => p.id !== id);
    // 1. Instant local update
    updateField("projects", { items: newItems });
    // 2. Background sync
    updateCMSSection("projects", { items: newItems }).catch(err => console.error("Sync failed:", err));
  };

  const toggleFeatured = async (id: string) => {
    const newItems = data.items.map(p => {
      if (p.id === id) return { ...p, featured: !p.featured };
      return { ...p, featured: false };
    });

    // 1. Instant local update
    updateField("projects", { items: newItems });
    // 2. Background sync
    updateCMSSection("projects", { items: newItems }).catch(err => console.error("Sync failed:", err));
  };



  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;
    
    // Get actual width of a card (including gap)
    const firstCard = scrollRef.current.firstElementChild as HTMLElement;
    if (!firstCard) return;
    
    const cardWidthWithGap = firstCard.offsetWidth + 24; // 24px is gap-6
    const index = Math.round(scrollLeft / cardWidthWithGap);
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.firstElementChild as HTMLElement;
    if (!firstCard) return;
    
    const cardWidthWithGap = firstCard.offsetWidth + 24;
    scrollRef.current.scrollTo({
      left: index * cardWidthWithGap,
      behavior: "smooth"
    });
  };

  return (
    <section id="projects" className="relative w-full pt-6 pb-6 md:pt-10 md:pb-10 z-10 border-t border-white/5 bg-[#0f0a1a]/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-6 md:mb-10 flex justify-between items-end">
          <h3 className="text-white text-xl md:text-2xl font-bold border-l-4 border-[#d946ef] pl-4">Projects</h3>
          {isAdmin && (
            <button
              onClick={addProject}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Plus size={18} />
              Add Project
            </button>
          )}
        </div>

        {/* 1. Featured Project(s) at the Top - Static (Desktop Only) */}
        {!isMobile && featured.length > 0 && (
          <div className="space-y-10 mb-12">
            {featured.map((p) => {
              const originalIdx = data.items.findIndex(item => item.id === p.id);
              return (
                <FeaturedCard
                  key={p.id}
                  project={p}
                  path={`projects.items.${originalIdx}`}
                  isAdmin={isAdmin}
                  onDelete={() => deleteProject(p.id)}
                  onToggleFeatured={() => toggleFeatured(p.id)}
                />
              );
            })}
          </div>
        )}

        {/* 2. Projects Slider */}
        {displayItems.length > 0 && (
          <div className="relative">
            <motion.div
              ref={scrollRef as React.RefObject<HTMLDivElement>}
              onScroll={handleScroll}
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "100px" }}
              className="flex gap-6 pb-8 pt-2 -mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto snap-x snap-mandatory scroll-pl-6 md:scroll-pl-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth items-stretch"
            >
              {displayItems.map((p, i) => {
                const originalIdx = data.items.findIndex(item => item.id === p.id);
                const accentColor = i % 2 === 0 ? "cyan" : "fuchsia";
                
                return (
                  <motion.div key={p.id} variants={itemVariants} className="w-[85vw] md:w-[calc(50%-12px)] flex-shrink-0 snap-center md:snap-start snap-always">
                    {isMobile && p.featured ? (
                      <FeaturedCard
                        project={p}
                        path={`projects.items.${originalIdx}`}
                        isAdmin={isAdmin}
                        onDelete={() => deleteProject(p.id)}
                        onToggleFeatured={() => toggleFeatured(p.id)}
                      />
                    ) : (
                      <StandardCard
                        project={p}
                        path={`projects.items.${originalIdx}`}
                        isAdmin={isAdmin}
                        onDelete={() => deleteProject(p.id)}
                        onToggleFeatured={() => toggleFeatured(p.id)}
                        accentColor={accentColor}
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Pagination dots for slider - clickable and accurate */}
            {displayItems.length > (isMobile ? 1 : 2) && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <div className="flex gap-2.5">
                  {Array.from({ length: isMobile ? displayItems.length : displayItems.length - 1 }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToIndex(index)}
                      className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                        activeIndex === index
                          ? "bg-cyan-400 w-8 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                          : "bg-white/10 w-1.5 hover:bg-white/30"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
