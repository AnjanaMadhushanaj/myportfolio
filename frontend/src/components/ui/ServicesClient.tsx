"use client";

import { useRef, useState, useEffect } from "react";
import { 
  Globe, Palette, Terminal, Database, Plus, Trash2, Settings,
  ChevronLeft, ChevronRight,
  type LucideIcon 
} from "lucide-react";
import { useCMSStore } from "@/store/useCMSStore";
import { useAdmin } from "@/context/AuthContext";
import Editable from "@/components/ui/Editable";
import { updateCMSSection } from "@/app/actions/cms";
import type { ServicesData, ServiceItem } from "@/types/cms";

const ICON_MAP: Record<string, LucideIcon> = {
  Globe,
  Palette,
  Terminal,
  Database,
};

interface Props {
  data: ServicesData;
}

export default function ServicesClient({ data: initialData }: Props) {
  const { isAdmin } = useAdmin();
  const storeData = useCMSStore((state) => state.services);
  const updateField = useCMSStore((state) => state.updateField);
  const data = storeData || initialData;
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset slider on scroll away (when not intersecting)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0;
          setActiveIndex(0);
        }
      },
      { threshold: 0 }
    );

    const currentScrollRef = scrollContainerRef.current;
    if (currentScrollRef) {
      observer.observe(currentScrollRef);
    }

    return () => {
      if (currentScrollRef) observer.unobserve(currentScrollRef);
    };
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setActiveIndex(0);
      return;
    }
    
    const numItems = data.items?.length || 0;
    const numPages = isMobile ? numItems : Math.ceil(numItems / 4);
    if (numPages <= 1) {
      setActiveIndex(0);
      return;
    }
    
    const scrollRatio = scrollLeft / maxScroll;
    const index = Math.round(scrollRatio * (numPages - 1));
    setActiveIndex(index);
  };

  const addService = async () => {
    const newService: ServiceItem = {
      id: `service-${Date.now()}`,
      title: "New Service",
      description: "Description of your new service.",
      color: "from-cyan-500 to-blue-500",
      iconName: "Globe",
    };
    
    const newItems = [...data.items, newService];
    updateField("services.items", newItems);
    
    // Auto-scroll to the end after adding
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.scrollWidth,
          behavior: 'smooth'
        });
      }
    }, 50);

    await updateCMSSection("services", { items: newItems });
  };

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const newItems = data.items.filter(item => item.id !== id);
    updateField("services.items", newItems);
    await updateCMSSection("services", { items: newItems });
  };

  return (
    <section id="services" className="pt-6 pb-6 md:pt-10 md:pb-10 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-6 md:mb-12 flex justify-between items-end">
          <div>
            <h3 className="text-white text-xl md:text-2xl font-bold border-l-4 border-[#d946ef] pl-4">Services</h3>
          </div>
          {isAdmin && (
            <button 
              onClick={addService}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Plus size={18} />
              Add Service
            </button>
          )}
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{ gridAutoColumns: 'calc(50% - 8px)' }}
          className="flex overflow-x-auto md:grid md:grid-rows-2 md:grid-flow-col gap-3 md:gap-4 pb-8 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory scroll-pl-6 md:scroll-pl-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.items.map((service, i) => {
            const Icon = ICON_MAP[service.iconName] ?? Globe;
            return (
              <div
                key={service.id ?? i}
                className="w-[85vw] md:w-full shrink-0 snap-start snap-always glass-panel p-4 md:p-5 rounded-3xl group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-start min-h-[260px] md:min-h-[240px]"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${service.color} opacity-20 blur-3xl rounded-full group-hover:opacity-40 transition-opacity`} />
                
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-50 flex gap-2">
                    <Editable path={`services.items.${i}.color`} className="bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors">
                      <Settings size={14} className="text-white/70" />
                    </Editable>
                    <button 
                      onClick={() => deleteService(service.id)}
                      className="bg-red-500/20 p-2 rounded-full hover:bg-red-500/40 text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${service.color} p-0.5 mb-4 shadow-lg`}>
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      {isAdmin ? (
                        <Editable path={`services.items.${i}.iconName`}>
                          <Icon className="w-5 h-5 text-white" />
                        </Editable>
                      ) : (
                        <Icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                  
                  <Editable path={`services.items.${i}.title`}>
                    <h3 className="text-base md:text-lg font-bold text-white mb-2 md:mb-3 group-hover:text-cyan-300 transition-colors tracking-wide">
                      {service.title}
                    </h3>
                  </Editable>
                  
                  <Editable path={`services.items.${i}.description`} type="textarea">
                    <p className="text-[13px] md:text-sm text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                  </Editable>
                </div>
              </div>
            );
          })}
        </div>

        {/* Universal Scroll Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: isMobile ? data.items.length : Math.ceil(data.items.length / 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const container = scrollContainerRef.current;
                  const firstCard = container.firstElementChild as HTMLElement;
                  const cardWidth = firstCard ? firstCard.offsetWidth + 16 : container.clientWidth;
                  const scrollAmount = isMobile ? cardWidth * index : container.clientWidth * index;
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
