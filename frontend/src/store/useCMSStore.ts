import { create } from 'zustand';
import { HeroData, AboutData, ServicesData, SkillsData, ProjectsData } from '@/types/cms';

export interface CMSState {
  hero: HeroData | null;
  about: AboutData | null;
  services: ServicesData | null;
  skills: SkillsData | null;
  projects: ProjectsData | null;

  // Hydration
  setHero: (data: HeroData) => void;
  setAbout: (data: AboutData) => void;
  setServices: (data: ServicesData) => void;
  setSkills: (data: SkillsData) => void;
  setProjects: (data: ProjectsData) => void;

  // Field Updates (Dot notation support for deep updates)
  updateField: (path: string, value: any) => void;
}

export const useCMSStore = create<CMSState>((set) => ({
  hero: null,
  about: null,
  services: null,
  skills: null,
  projects: null,

  setHero: (data) => set({ hero: data }),
  setAbout: (data) => set({ about: data }),
  setServices: (data) => set({ services: data }),
  setSkills: (data) => set({ skills: data }),
  setProjects: (data) => set({ projects: data }),

  updateField: (path, value) => set((state) => {
    const newState = { ...state };
    const keys = path.split('.');
    let current: any = newState;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (Array.isArray(current[key])) {
          current[key] = [...current[key]];
      } else {
          current[key] = { ...current[key] };
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return newState;
  }),
}));
