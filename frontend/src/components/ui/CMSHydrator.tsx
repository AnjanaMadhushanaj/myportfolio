"use client";

import { useEffect } from "react";
import { useCMSStore } from "@/store/useCMSStore";
import { HeroData, AboutData, ServicesData, SkillsData, ProjectsData } from "@/types/cms";

interface CMSHydratorProps {
  hero?: HeroData;
  about?: AboutData;
  services?: ServicesData;
  skills?: SkillsData;
  projects?: ProjectsData;
}

/**
 * A Client Component that populates the Zustand store with server-fetched data.
 * This ensures the global state is available to all <Editable /> wrappers.
 */
export default function CMSHydrator({ hero, about, services, skills, projects }: CMSHydratorProps) {
  const setHero = useCMSStore((s) => s.setHero);
  const setAbout = useCMSStore((s) => s.setAbout);
  const setServices = useCMSStore((s) => s.setServices);
  const setSkills = useCMSStore((s) => s.setSkills);
  const setProjects = useCMSStore((s) => s.setProjects);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    if (hero) setHero(hero);
    if (about) setAbout(about);
    if (services) setServices(services);
    if (skills) setSkills(skills);
    if (projects) setProjects(projects);
  }, [hero, about, services, skills, projects, setHero, setAbout, setServices, setSkills, setProjects]);

  return null;
}
