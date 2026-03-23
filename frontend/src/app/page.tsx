import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/ui/Hero';
import TechStack from '@/components/ui/TechStack';
import About from '@/components/ui/About';
import Services from '@/components/ui/Services';
import Skills from '@/components/ui/Skills';
import Projects from '@/components/ui/Projects';

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-cyan-500/30 selection:text-cyan-200 bg-[url('/herobg.png')] bg-cover bg-center bg-fixed">
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#0f0a1a]/80 pointer-events-none z-0" />

      {/* Global Background Noise overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>
      
      <div className="relative z-10 w-full">
        <Navbar />
        
        <div className="pb-24">
          <Hero />
          <TechStack />
          <About />
          <Services />
          <Skills />
          <Projects />
        </div>

        {/* Simple Footer */}
        <footer className="py-8 text-center text-slate-400 border-t border-white/10 mt-12 bg-black/20 backdrop-blur-md">
          <p>© {new Date().getFullYear()} Anjana Madhushan. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
