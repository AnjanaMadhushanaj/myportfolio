/**
 * cms.ts — Shared TypeScript Interfaces for the CMS Data Layer
 *
 * These types are the single source of truth for every section's data shape.
 * They are used by:
 *  - Firestore server fetchers (firestore.server.ts)
 *  - Server Actions (updateSection.ts)
 *  - Client Component props (HeroClient.tsx, etc.)
 *  - EditModal field rendering (EditModal.tsx)
 */

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export interface HeroData {
  greeting: string;        // "Hello I'm"
  name: string;            // "Anjana Madhushan"
  title: string;           // "Fullstack Developer"
  description: string;     // Paragraph text
  hireLink: string;        // "#contact"
  worksLink: string;       // "#projects"
  experienceYears: string; // "1+" shown in badge
  profileImageUrl: string; // "/pro1.png"
  githubUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
  emailUrl: string;
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------
export interface AboutData {
  headline: string;       // "Hi! I am Anjana Madhushan"
  subline: string;        // "Full-Stack Developer | DevOps Engineer | MLOps Enthusiast"
  bio: string;            // Long paragraph
  location: string;       // "Sri Lanka"
  languages: string[];    // ["Sinhala", "English"]
  softSkills: string[];   // ["Communication", ...]
  currentFocus: string;   // "Cloud Infrastructure, ..."
  favoriteStack: string;  // "Next.js, Tailwind, Docker, ..."
  achievements: string;   // "Awarded Top Performer ..."
  certificates: string[]; // ["AWS Certified ...", ...]
  badges: string[];        // ["Top Performer", ...]
  education: string;      // "BSc (Hons) Software Engineering ..."
  resumeLink: string;     // "#resume"
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  color: string;  // Tailwind gradient classes e.g. "from-cyan-500 to-blue-500"
  iconName: string; // lucide icon name: "Globe" | "Palette" | "Terminal" | "Database"
}

export interface ServicesData {
  items: ServiceItem[];
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
export interface SkillItem {
  name: string;
  proficiency: number; // 0–100
  icon: string;        // CDN URL
}

export interface SkillCategory {
  id: string;
  label: string;
  items: SkillItem[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];  // ["Docker", "AWS", ...]
  githubLink: string;
  liveLink: string;
  imageUrl: string;
  featured: boolean;    // true = renders as the wide "crown jewel" card
}

export interface ProjectsData {
  items: ProjectItem[];
}

// ---------------------------------------------------------------------------
// Union type — used by EditModal to know which section is being edited
// ---------------------------------------------------------------------------
export type SectionKey = "hero" | "about" | "services" | "skills" | "projects";

export type SectionData =
  | { section: "hero";     data: HeroData }
  | { section: "about";    data: AboutData }
  | { section: "services"; data: ServicesData }
  | { section: "skills";   data: SkillsData }
  | { section: "projects"; data: ProjectsData };
