import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/ui/Hero';
import Stats from '@/components/ui/Stats';
import Services from '@/components/ui/Services';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0514] relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Global Image Background */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none">
        <Image 
          src="/herobg.png" 
          alt="Site Background" 
          fill 
          priority
          className="object-cover object-center opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0514]/60 to-[#0a0514]" />
      </div>

      {/* Global Background Noise overlay for premium feel */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>
      
      <Navbar />
      
      <div className="pb-24">
        <Hero />
        <Stats />
        <Services />
      </div>

      {/* Simple Footer */}
      <footer className="py-8 text-center text-slate-400 relative z-10 border-t border-white/10 mt-12">
        <p>© {new Date().getFullYear()} Anjana Madhushan. All rights reserved.</p>
      </footer>
    </main>
  );
}
