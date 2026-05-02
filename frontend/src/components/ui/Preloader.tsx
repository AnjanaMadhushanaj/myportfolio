"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    const unmountTimeout = setTimeout(() => {
      setIsRendered(false);
    }, 3200);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(unmountTimeout);
    };
  }, []);

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020108] transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Dynamic Background Glow Effect — Only on desktop to save mobile performance */}
      <div className="hidden md:block absolute inset-0 bg-radial-[circle_at_center] from-fuchsia-500/10 via-transparent to-transparent pointer-events-none opacity-60 animate-pulse duration-1000" />

      <div className="flex flex-col items-center justify-center relative">
        {/* Large Outer Rotating Glowing Ring */}
        <div className="absolute inset-[-32px] rounded-full border border-cyan-500/15 border-t-cyan-500 border-b-fuchsia-500 animate-spin [animation-duration:3s] blur-[1px] pointer-events-none" />
        <div className="hidden md:block absolute inset-[-16px] rounded-full bg-gradient-to-tr from-cyan-500/10 to-fuchsia-500/10 animate-pulse blur-[15px] pointer-events-none" />

        {/* Pulsing Large Logo in the Center */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 animate-pulse transition-all duration-300 flex items-center justify-center">
          <div className="hidden md:block absolute inset-4 bg-cyan-500/25 via-fuchsia-500/15 to-transparent rounded-full blur-[40px] opacity-80 pointer-events-none" />
          <img
            src="/logo.png"
            alt="Logo"
            className="relative z-10 w-full h-full object-contain hover:scale-105 transition-transform duration-300 md:drop-shadow-[0_0_35px_rgba(34,211,238,0.75)] md:drop-shadow-[0_0_15px_rgba(217,70,239,0.4)] drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          />
        </div>
      </div>

      {/* Styled Brand/Name Text under the logo */}
      <div className="mt-10 flex flex-col items-center gap-4 relative z-10">
        <h1 className="text-sm md:text-base font-bold tracking-[0.4em] uppercase bg-gradient-to-r from-cyan-400 via-white to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
          Anjana Madhushan
        </h1>

        {/* High-tech Loading Progress Line */}
        <div className="relative w-48 h-[3px] bg-white/10 rounded-full overflow-hidden shadow-[0_0_10px_rgba(34,211,238,0.1)]">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.3, ease: [0.12, 1, 0.3, 1] }}
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.6)]"
          />
        </div>
      </div>
    </div>
  );
}
