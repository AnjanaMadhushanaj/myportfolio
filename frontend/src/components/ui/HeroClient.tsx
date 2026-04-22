"use client";

/**
 * HeroClient.tsx — Client Interactive Inner Component
 *
 * Receives all data as props from the Hero Server Component.
 * Owns: image error fallback, social icon rendering.
 * All markup and content comes from the server-fetched props.
 */

import { Github, Linkedin, Facebook, Mail } from "lucide-react";
import { useCMSStore } from "@/store/useCMSStore";
import Editable from "@/components/ui/Editable";
import type { HeroData } from "@/types/cms";

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.52 3.44A12 12 0 0 0 12 0C5.38 0 0 5.38 0 12a11.96 11.96 0 0 0 1.6 6L0 24l6.15-1.61A11.96 11.96 0 0 0 12 24c6.62 0 12-5.38 12-12a12 12 0 0 0-3.48-8.56zm-8.52 18.57c-1.88 0-3.72-.51-5.34-1.47l-.38-.23-3.97 1.04 1.06-3.87-.25-.4A9.97 9.97 0 0 1 2.01 12C2.01 6.49 6.49 2 12 2s9.99 4.49 9.99 10-4.48 10-9.99 10zm5.48-7.5c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.49-1.79-1.67-2.09-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.24-.24-.59-.48-.5-.67-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.1 3.21 5.08 4.5.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.11.56-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z" />
  </svg>
);
interface Props {
  data: HeroData;
}

export default function HeroClient({ data: initialData }: Props) {
  const storeData = useCMSStore((state) => state.hero);
  const data = storeData || initialData;

  const socialLinks = [
    { icon: Github,       href: data.githubUrl || "https://github.com/", path: "hero.githubUrl" },
    { icon: Linkedin,     href: data.linkedinUrl || "#", path: "hero.linkedinUrl" },
    { icon: Facebook,     href: data.facebookUrl || "#", path: "hero.facebookUrl" },
    { icon: WhatsappIcon, href: data.whatsappUrl || "#", path: "hero.whatsappUrl" },
    { icon: Mail,         href: data.emailUrl || "mailto:example@gmail.com", path: "hero.emailUrl" },
  ];

  return (
    <>
      {/* Main Hero Section */}
      <section
        id="home"
        className="relative w-full min-h-screen flex items-center pt-16 md:pt-40 pb-24 md:pb-20 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid md:grid-cols-2 gap-10 md:gap-12 items-center">

          {/* Left: Text */}
          <div className="flex flex-col space-y-6 text-center md:text-left">
            <div className="space-y-4">
              <Editable path="hero.greeting">
                <h3 className="text-lg md:text-xl font-medium text-slate-100 mb-2">{data.greeting}</h3>
              </Editable>

              {/* Desktop H1 */}
              <div className="hidden md:inline-flex m-0 p-0">
                <Editable path="hero.name">
                  <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-none">
                    <span className="typing-name inline-block">{data.name}</span>
                  </h1>
                </Editable>
              </div>

              {/* Mobile H1 */}
              <div className="flex md:hidden justify-center items-center w-full max-w-[100vw] overflow-hidden m-0 p-0">
                <Editable path="hero.name">
                  <h1 className="text-[7.5vw] sm:text-5xl font-bold tracking-tight text-white leading-none">
                    <span className="typing-name inline-block max-w-[90vw] overflow-hidden">{data.name}</span>
                  </h1>
                </Editable>
              </div>

              <Editable path="hero.title">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#d946ef] m-0 p-0 leading-tight dev-fade whitespace-normal md:whitespace-nowrap">
                  {data.title}
                </h2>
              </Editable>

              <Editable path="hero.description" type="textarea">
                <p className="text-sm md:text-md text-slate-300 max-w-lg mx-auto md:mx-0 leading-relaxed pt-2 md:pt-4 relative z-20 mix-blend-lighten px-2 md:px-0">
                  {data.description}
                </p>
              </Editable>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex flex-wrap items-center gap-6 pt-6 relative z-20">
              <Editable path="hero.hireLink" className="inline-block">
                <a href={data.hireLink} className="px-8 py-3.5 rounded-xl bg-[#c026d3] text-white font-bold transition-all duration-300 hover:scale-105 hover:bg-[#d946ef] shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] active:scale-95 block">
                  Hire Me
                </a>
              </Editable>
              <Editable path="hero.worksLink" className="inline-block">
                <a href={data.worksLink} className="px-8 py-3.5 rounded-xl glass border-2 border-white/20 text-white font-bold transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/50 active:scale-95 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] block">
                  Works
                </a>
              </Editable>
            </div>
          </div>

          {/* Right: Profile Image */}
          <div className="relative w-full max-w-md mx-auto md:ml-auto flex justify-center md:justify-end -mt-6 md:mt-0">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full p-3 md:p-4 glass backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_rgba(217,70,239,0.2)] md:shadow-[0_0_60px_rgba(217,70,239,0.25)] flex items-center justify-center transition-all duration-500 hover:shadow-[0_0_60px_rgba(217,70,239,0.4)] md:hover:shadow-[0_0_80px_rgba(217,70,239,0.4)] hover:border-white/40">
              <Editable path="hero.profileImageUrl" type="image" className="w-full h-full rounded-full overflow-hidden">
                <div className="w-full h-full rounded-full overflow-hidden relative shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] border-4 border-white/5 inner-glass">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.profileImageUrl}
                    alt={data.name}
                    className="w-full h-full object-cover relative z-10 transition-transform duration-700 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                </div>
              </Editable>

              {/* Experience Badge */}
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-0 md:bottom-10 md:-right-4 z-30">
                <Editable path="hero.experienceYears">
                  <div className="bg-slate-900/80 backdrop-blur-xl pl-2 pr-4 md:pr-5 py-1.5 md:py-2 rounded-full border border-white/10 flex items-center gap-2 md:gap-3 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-white/30 cursor-default">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-linear-to-tr from-[#c026d3] to-[#d946ef] flex items-center justify-center shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                      <span className="text-white text-[10px] md:text-xs font-bold">{data.experienceYears}</span>
                    </div>
                    <span className="text-slate-200 text-xs md:text-sm font-medium tracking-wide">Years Experience</span>
                  </div>
                </Editable>
              </div>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="flex md:hidden flex-wrap items-center justify-center gap-4 mt-2 mb-4 w-full relative z-20">
            <Editable path="hero.hireLink" className="inline-block">
              <a href={data.hireLink} className="px-6 py-3 rounded-xl bg-[#c026d3] text-white font-bold transition-all duration-300 hover:scale-105 hover:bg-[#d946ef] active:scale-95 text-sm sm:text-base block">
                Hire Me
              </a>
            </Editable>
            <Editable path="hero.worksLink" className="inline-block">
              <a href={data.worksLink} className="px-6 py-3 rounded-xl glass border-2 border-white/20 text-white font-bold transition-all duration-300 hover:scale-105 hover:bg-white/10 active:scale-95 text-sm sm:text-base shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] block">
                Works
              </a>
            </Editable>
          </div>
        </div>
      </section>

      {/* Fixed Social Icons — Desktop */}
      <div className="hidden md:flex fixed top-1/2 right-4 md:right-6 flex-col gap-6 md:gap-7 z-100 transform -translate-y-1/2">
        {socialLinks.map((social, i) => {
          const isEmail = social.path === "hero.emailUrl";
          const finalHref = isEmail && social.href && !social.href.startsWith("mailto:") 
            ? `mailto:${social.href}` 
            : social.href;

          return (
            <Editable key={i} path={social.path} className="inline-block">
              <a
                href={finalHref}
                target={isEmail ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/80 backdrop-blur-xl border border-[#d946ef]/20 flex items-center justify-center text-[#d946ef] transition-all duration-300 hover:scale-110 hover:bg-[#d946ef]/20 hover:text-white hover:border-[#d946ef]/60 hover:shadow-[0_0_25px_rgba(217,70,239,0.6)] group block"
              >
                <div className="absolute inset-0 rounded-full bg-[#d946ef] animate-ping opacity-20 group-hover:hidden" style={{ animationDuration: "3s", animationDelay: `${i * 0.3}s` }} />
                <social.icon className="w-5 h-5 relative z-10 group-hover:-translate-y-0.5 transition-transform drop-shadow-[0_0_5px_rgba(217,70,239,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </a>
            </Editable>
          );
        })}
      </div>

      {/* Fixed Social Icons — Mobile */}
      <div className="flex md:hidden fixed top-1/2 right-2 sm:right-4 flex-col gap-6 sm:gap-7 z-100 transform -translate-y-1/2">
        {socialLinks.map((social, i) => {
          const isEmail = social.path === "hero.emailUrl";
          const finalHref = isEmail && social.href && !social.href.startsWith("mailto:") 
            ? `mailto:${social.href}` 
            : social.href;

          return (
            <Editable key={i} path={social.path} className="inline-block">
              <a
                href={finalHref}
                target={isEmail ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/80 backdrop-blur-xl border border-[#d946ef]/20 flex items-center justify-center text-[#d946ef] transition-all duration-300 hover:scale-110 hover:bg-[#d946ef]/20 hover:text-white hover:border-[#d946ef]/60 hover:shadow-[0_0_25px_rgba(217,70,239,0.6)] group block"
              >
                <social.icon className="w-5 h-5 relative z-10 transition-transform drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]" />
              </a>
            </Editable>
          );
        })}
      </div>
    </>
  );
}
