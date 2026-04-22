import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/ui/Hero';
import Image from 'next/image';
import TechStack from '@/components/ui/TechStack';
import About from '@/components/ui/About';
import Services from '@/components/ui/Services';
import Skills from '@/components/ui/Skills';
import Projects from '@/components/ui/Projects';
import Footer from '@/components/ui/Footer';
import EditModal from '@/components/ui/EditModal';
import CMSHydrator from '@/components/ui/CMSHydrator';
import { 
  getHeroData, 
  getAboutData, 
  getServicesData, 
  getSkillsData, 
  getProjectsData 
} from '@/lib/firestore.server';

export default async function Home() {
  // Fetch all data in parallel for hydration
  const [hero, about, services, skills, projects] = await Promise.all([
    getHeroData(),
    getAboutData(),
    getServicesData(),
    getSkillsData(),
    getProjectsData(),
  ]);

  return (
    <main className="min-h-screen relative overflow-x-hidden w-full selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Hydrate the global store for Inline CMS */}
      <CMSHydrator 
        hero={hero} 
        about={about} 
        services={services} 
        skills={skills} 
        projects={projects} 
      />

      {/* Optimized Fixed Background Image */}
      <div className="fixed inset-0 z-[-2]">
        <Image
          src="/herobg.png"
          alt="Background"
          fill
          priority
          quality={60}
          className="object-cover"
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#0f0a1a]/85 pointer-events-none z-[-1]" />

      {/* Global Background Noise overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      
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

        {/* Premium Footer */}
        <Footer />
      </div>

      {/*
       * EditModal — rendered once at the page root.
       * It is a Client Component that listens to the global `admin:edit`
       * CustomEvent dispatched by any EditButton. Placing it here keeps
       * it completely decoupled from every section component.
       */}
      <EditModal />
    </main>
  );
}
