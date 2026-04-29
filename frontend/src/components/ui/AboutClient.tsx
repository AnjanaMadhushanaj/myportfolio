"use client";

import React, { useState, useEffect } from "react";
import {
  Download, MapPin, Clock, Languages, MessageSquare,
  Terminal, Layers, Award, GraduationCap, FileBadge,
} from "lucide-react";
import { useCMSStore } from "@/store/useCMSStore";
import { useAdmin } from "@/context/AuthContext";
import Editable from "@/components/ui/Editable";
import type { AboutData } from "@/types/cms";

interface Props {
  data: AboutData;
}

export default function AboutClient({ data: initialData }: Props) {
  const { isAdmin } = useAdmin();
  const storeData = useCMSStore((state) => state.about);
  const data = storeData || initialData;
  const [time, setTime] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Colombo" });
    setTime(fmt());
    const timer = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) {
      setActiveIndex(0);
      return;
    }
    const numPages = 4; // Bio Box + 3 groups
    const scrollRatio = scrollLeft / maxScroll;
    const index = Math.round(scrollRatio * (numPages - 1));
    setActiveIndex(index);
  };

  const [headlineName, ...rest] = data.headline.split(" ");
  const headlineRest = rest.join(" ");

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!data.resumeLink || data.resumeLink === "#resume") {
      window.open(data.resumeLink, "_blank");
      return;
    }
    
    try {
      const response = await fetch(data.resumeLink);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "Anjana_Madhushana_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Forced download failed (possibly CORS), opening in new tab...", error);
      window.open(data.resumeLink, "_blank");
    }
  };

  return (
    <section id="about" className="relative w-full pt-6 pb-6 md:pt-10 md:pb-10 overflow-hidden z-10">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 md:w-125 md:h-125 bg-cyan-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 md:w-100 md:h-100 bg-fuchsia-500/5 rounded-full blur-[120px] translate-x-1/4 translate-y-1/3 pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-6 md:mb-10">
          <h3 className="text-white text-xl md:text-2xl font-bold border-l-4 border-[#d946ef] pl-4">About Me</h3>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-5 mb-5">
            {/* Bio Box */}
            <div className="col-span-2 flex flex-col justify-between bg-[#141021]/95 md:bg-[#141021]/80 backdrop-blur-md border border-white/25 md:border-white/5 rounded-3xl p-5 md:p-6 lg:p-8 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-500" />
              <div className="relative z-10 space-y-3 mb-6 md:mb-8 text-left">
                <Editable path="about.headline">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    {headlineName}&nbsp;
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500">
                      {headlineRest}
                    </span>
                  </h2>
                </Editable>
                <Editable path="about.subline">
                  <h3 className="text-[12px] md:text-[1rem] lg:text-lg font-semibold text-cyan-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] mt-2 tracking-wide">
                    {data.subline.split("|").map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part.trim()}
                        {i < arr.length - 1 && (
                          <span className="text-fuchsia-400 mx-1.5 font-light">|</span>
                        )}
                      </React.Fragment>
                    ))}
                  </h3>
                </Editable>
                <Editable path="about.bio" type="textarea">
                  <p className="text-[13px] md:text-base text-slate-200 leading-snug md:leading-relaxed font-light mt-3 md:mt-4 max-w-2xl">
                    {data.bio}
                  </p>
                </Editable>
              </div>
              <div className="relative z-10 mt-auto flex items-start gap-4">
                <a
                  href={data.resumeLink}
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#d946ef] text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-[#e85bff] shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] text-[13px] group/btn cursor-pointer"
                >
                  <Download className="w-4 h-4 text-white group-hover/btn:-translate-y-1 transition-transform" />
                  Resume / Download
                </a>
                {isAdmin && (
                  <Editable path="about.resumeLink" type="file" accept=".pdf">
                    <span className="text-[10px] text-slate-500 mt-2 block cursor-pointer">Update Resume (PDF)</span>
                  </Editable>
                )}
              </div>
            </div>

            {/* Right Stack */}
            <div className="col-span-1 flex flex-col gap-4">
              {/* Location */}
              <div className="flex-1 bg-[#141021]/95 md:bg-[#141021]/80 backdrop-blur-md border border-white/25 md:border-white/5 rounded-3xl p-4 md:p-5 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="flex items-center gap-3 md:gap-4">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <h3 className="text-sm md:text-base font-bold text-white tracking-wide">Location</h3>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 text-cyan-300 font-mono text-[10px] md:text-xs px-2 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                    <Clock className="w-3 h-3" /> {time || "Loading..."}
                  </div>
                </div>
                <ul className="space-y-1 md:space-y-1.5 pl-6 md:pl-8 text-[11px] md:text-[13px] text-slate-200">
                  <Editable path="about.location">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_5px_#22d3ee]" />
                      {data.location}
                    </li>
                  </Editable>
                </ul>
              </div>

              {/* Languages */}
              <div className="flex-1 bg-[#141021]/95 md:bg-[#141021]/80 backdrop-blur-md border border-white/25 md:border-white/5 rounded-3xl p-4 md:p-5 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center relative overflow-hidden group">
                <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                  <Languages className="w-4 h-4 md:w-5 md:h-5 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
                  <h3 className="text-sm md:text-base font-bold text-white tracking-wide">Languages</h3>
                </div>
                <Editable path="about.languages" type="array">
                  <ul className="space-y-1 md:space-y-1.5 pl-6 md:pl-8 text-[11px] md:text-[13px] text-slate-200">
                    {data.languages.map((lang, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/80 shadow-[0_0_5px_#d946ef]" />
                        {lang}
                      </li>
                    ))}
                  </ul>
                </Editable>
              </div>

              {/* Soft Skills */}
              <div className="flex-1 bg-[#141021]/95 md:bg-[#141021]/80 backdrop-blur-md border border-white/25 md:border-white/5 rounded-3xl p-4 md:p-5 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center relative overflow-hidden group">
                <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                  <h3 className="text-sm md:text-base font-bold text-white tracking-wide">Soft Skills</h3>
                </div>
                <Editable path="about.softSkills" type="array">
                  <ul className="space-y-1 md:space-y-1.5 pl-6 md:pl-8 text-[11px] md:text-[13px] text-slate-200">
                    {data.softSkills.map((skill, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400/80 shadow-[0_0_5px_#22c55e]" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </Editable>
              </div>
            </div>
          </div>

          {/* Row 2: Focus / Stack / Achievements */}
          <div className="grid grid-cols-3 gap-5 mb-5">
            <div className="bg-[#141021]/95 md:bg-[#141021]/80 backdrop-blur-md border border-white/25 md:border-white/5 rounded-3xl p-4 md:p-6 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-[50px] pointer-events-none" />
              <Terminal className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] mb-2 md:mb-3" />
              <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 tracking-wide">Current Focus</h3>
              <Editable path="about.currentFocus">
                <p className="text-[12px] md:text-[13px] text-slate-200 leading-relaxed font-light">{data.currentFocus}</p>
              </Editable>
            </div>

            <div className="bg-[#141021]/95 md:bg-[#141021]/80 backdrop-blur-md border border-white/25 md:border-white/5 rounded-3xl p-4 md:p-6 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/15 rounded-full blur-[50px] pointer-events-none" />
              <Layers className="w-5 h-5 md:w-6 md:h-6 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] mb-2 md:mb-3" />
              <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 tracking-wide">Favorite Stack</h3>
              <Editable path="about.favoriteStack">
                <p className="text-[12px] md:text-[13px] text-slate-200 leading-relaxed font-light">{data.favoriteStack}</p>
              </Editable>
            </div>

            <div className="bg-[#141021]/95 md:bg-[#141021]/80 backdrop-blur-md border border-white/25 md:border-white/5 rounded-3xl p-4 md:p-6 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/15 rounded-full blur-[50px] pointer-events-none" />
              <Award className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] mb-2 md:mb-3" />
              <h3 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 tracking-wide">Achievements</h3>
              <Editable path="about.achievements">
                <p className="text-[12px] md:text-[13px] text-slate-200 leading-relaxed font-light">{data.achievements}</p>
              </Editable>
            </div>
          </div>

          {/* Row 3: Certificates & Badges */}
          <div className="grid grid-cols-2 gap-5 mb-5">
            <div className="bg-[#141021]/95 md:bg-[#141021]/80 backdrop-blur-md border border-white/25 md:border-white/5 rounded-3xl p-4 md:p-6 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-fuchsia-500/15 rounded-full blur-[60px] pointer-events-none" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#141021] border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shadow-[inset_0_0_15px_rgba(217,70,239,0.2)] shrink-0">
                  <FileBadge className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-2 tracking-wide">Certificates</h3>
                  <Editable path="about.certificates" type="array">
                    <ul className="text-[11px] md:text-xs text-slate-200 leading-relaxed space-y-1.5 md:space-y-2">
                      {data.certificates.map((cert, i) => (
                        <li key={i} className="flex items-center gap-2 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/80 shadow-[0_0_5px_#d946ef]" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </Editable>
                </div>
              </div>
            </div>

            <div className="bg-[#141021]/95 md:bg-[#141021]/80 backdrop-blur-md border border-white/25 md:border-white/5 rounded-3xl p-4 md:p-6 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/15 rounded-full blur-[60px] pointer-events-none" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#141021] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)] shrink-0">
                  <Award className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-2 tracking-wide">Badges</h3>
                  <Editable path="about.badges" type="array">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {data.badges.map((badge, i) => (
                        <span key={i} className="px-2.5 py-1 bg-[#1a1429] border border-cyan-500/30 rounded-full text-[10px] md:text-xs text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)] font-medium tracking-wide">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </Editable>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Education */}
          <div className="bg-[#141021]/95 md:bg-[#141021]/80 backdrop-blur-md border border-white/25 md:border-white/5 rounded-3xl p-4 md:p-6 shadow-xl hover:border-white/10 hover:bg-[#1a1429]/90 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-500/15 rounded-full blur-[60px] pointer-events-none" />
            <div className="flex items-start gap-4 md:gap-5 relative z-10">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#141021] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)] shrink-0">
                <GraduationCap className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1.5 tracking-wide">Education</h3>
                <Editable path="about.education">
                  <p className="text-[13px] md:text-sm text-slate-200 leading-relaxed">
                    <strong className="text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] font-medium">
                      {data.education.split("—")[0]?.trim()}
                    </strong>
                    {data.education.includes("—") && ` — ${data.education.split("—")[1]?.trim()}`}
                  </p>
                </Editable>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout (Slider for everything including Bio Box) */}
        <div className="block md:hidden">
          {/* Cards Slider */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-3 pb-4 pt-2 -mx-6 px-6 snap-x snap-mandatory scroll-pl-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden items-stretch"
          >
            {/* Slide 1: Bio Box Mobile */}
            <div className="w-[85vw] shrink-0 snap-center flex flex-col justify-between bg-[#141021]/95 backdrop-blur-md border border-white/25 rounded-3xl p-5 shadow-xl group relative overflow-hidden h-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10 space-y-3 mb-6 text-left">
                <Editable path="about.headline">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                    {headlineName}&nbsp;
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500">
                      {headlineRest}
                    </span>
                  </h2>
                </Editable>
                <Editable path="about.subline">
                  <h3 className="text-[12px] font-semibold text-cyan-100 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] mt-2 tracking-wide">
                    {data.subline.split("|").map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part.trim()}
                        {i < arr.length - 1 && <span className="text-fuchsia-400 mx-1.5 font-light">|</span>}
                      </React.Fragment>
                    ))}
                  </h3>
                </Editable>
                <Editable path="about.bio" type="textarea">
                  <p className="text-[13px] text-slate-200 leading-snug font-light mt-3 max-w-2xl">
                    {data.bio}
                  </p>
                </Editable>
              </div>
              <div className="relative z-10 mt-auto flex items-start gap-4">
                <a
                  href={data.resumeLink}
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#d946ef] text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-[#e85bff] shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] text-[13px] group/btn cursor-pointer"
                >
                  <Download className="w-4 h-4 text-white group-hover/btn:-translate-y-1 transition-transform" />
                  Resume / Download
                </a>
              </div>
            </div>

            {/* Slide 2: Basic Info (Location, Languages, Soft Skills) */}
            <div className="w-[85vw] shrink-0 snap-center flex flex-col gap-3">
              <div className="flex-1 flex flex-col justify-center bg-[#141021]/95 backdrop-blur-md border border-white/25 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <h3 className="text-sm font-bold text-white tracking-wide">Location</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[10px] px-2 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                    <Clock className="w-3 h-3" /> {time || "Loading..."}
                  </div>
                </div>
                <ul className="space-y-1 pl-6 text-[11px] text-slate-200">
                  <Editable path="about.location">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_5px_#22d3ee]" />
                      {data.location}
                    </li>
                  </Editable>
                </ul>
              </div>

              <div className="flex-1 flex flex-col justify-center bg-[#141021]/95 backdrop-blur-md border border-white/25 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-2">
                  <Languages className="w-4 h-4 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
                  <h3 className="text-sm font-bold text-white tracking-wide">Languages</h3>
                </div>
                <Editable path="about.languages" type="array">
                  <ul className="space-y-1 pl-6 text-[11px] text-slate-200">
                    {data.languages.map((lang, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/80 shadow-[0_0_5px_#d946ef]" />
                        {lang}
                      </li>
                    ))}
                  </ul>
                </Editable>
              </div>

              <div className="flex-1 flex flex-col justify-center bg-[#141021]/95 backdrop-blur-md border border-white/25 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-4 h-4 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                  <h3 className="text-sm font-bold text-white tracking-wide">Soft Skills</h3>
                </div>
                <Editable path="about.softSkills" type="array">
                  <ul className="space-y-1 pl-6 text-[11px] text-slate-200">
                    {data.softSkills.map((skill, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400/80 shadow-[0_0_5px_#22c55e]" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </Editable>
              </div>
            </div>

            {/* Slide 2: Focus, Stack, Achievements */}
            <div className="w-[85vw] shrink-0 snap-center flex flex-col gap-3">
              <div className="flex-1 flex flex-col justify-center bg-[#141021]/95 backdrop-blur-md border border-white/25 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-[50px] pointer-events-none" />
                <Terminal className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] mb-2" />
                <h3 className="text-base font-bold text-white mb-1 tracking-wide">Current Focus</h3>
                <Editable path="about.currentFocus">
                  <p className="text-[12px] text-slate-200 leading-relaxed font-light">{data.currentFocus}</p>
                </Editable>
              </div>

              <div className="flex-1 flex flex-col justify-center bg-[#141021]/95 backdrop-blur-md border border-white/25 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/15 rounded-full blur-[50px] pointer-events-none" />
                <Layers className="w-5 h-5 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] mb-2" />
                <h3 className="text-base font-bold text-white mb-1 tracking-wide">Favorite Stack</h3>
                <Editable path="about.favoriteStack">
                  <p className="text-[12px] text-slate-200 leading-relaxed font-light">{data.favoriteStack}</p>
                </Editable>
              </div>

              <div className="flex-1 flex flex-col justify-center bg-[#141021]/95 backdrop-blur-md border border-white/25 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/15 rounded-full blur-[50px] pointer-events-none" />
                <Award className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] mb-2" />
                <h3 className="text-base font-bold text-white mb-1 tracking-wide">Achievements</h3>
                <Editable path="about.achievements">
                  <p className="text-[12px] text-slate-200 leading-relaxed font-light">{data.achievements}</p>
                </Editable>
              </div>
            </div>

            {/* Slide 4: Certificates, Badges, Education */}
            <div className="w-[85vw] shrink-0 snap-center flex flex-col gap-3">
              <div className="flex-1 flex flex-col justify-center bg-[#141021]/95 backdrop-blur-md border border-white/25 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-fuchsia-500/15 rounded-full blur-[60px] pointer-events-none" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-[#141021] border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shadow-[inset_0_0_15px_rgba(217,70,239,0.2)] shrink-0">
                    <FileBadge className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 tracking-wide">Certificates</h3>
                    <Editable path="about.certificates" type="array">
                      <ul className="text-[11px] text-slate-200 leading-relaxed space-y-1.5">
                        {data.certificates.map((cert, i) => (
                          <li key={i} className="flex items-center gap-2 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400/80 shadow-[0_0_5px_#d946ef]" />
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </Editable>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center bg-[#141021]/95 backdrop-blur-md border border-white/25 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/15 rounded-full blur-[60px] pointer-events-none" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-[#141021] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)] shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 tracking-wide">Badges</h3>
                    <Editable path="about.badges" type="array">
                      <div className="flex flex-wrap gap-2 mt-2">
                        {data.badges.map((badge, i) => (
                          <span key={i} className="px-2.5 py-1 bg-[#1a1429] border border-cyan-500/30 rounded-full text-[10px] text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)] font-medium tracking-wide">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </Editable>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center bg-[#141021]/95 backdrop-blur-md border border-white/25 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-500/15 rounded-full blur-[60px] pointer-events-none" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-[#141021] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)] shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5 tracking-wide">Education</h3>
                    <Editable path="about.education">
                      <p className="text-[13px] text-slate-200 leading-relaxed">
                        <strong className="text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] font-medium">
                          {data.education.split("—")[0]?.trim()}
                        </strong>
                        {data.education.includes("—") && ` — ${data.education.split("—")[1]?.trim()}`}
                      </p>
                    </Editable>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollRef.current) {
                    const container = scrollRef.current;
                    const firstCard = container.firstElementChild as HTMLElement;
                    const cardWidth = firstCard ? firstCard.offsetWidth + 12 : container.clientWidth; // gap-3 is 12px
                    container.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
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
      </div>
    </section>
  );
}
