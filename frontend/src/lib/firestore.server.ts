/**
 * firestore.server.ts  —  Server-only Firestore Data Fetchers
 *
 * IMPORTANT: This file must ONLY be imported by Server Components or
 * Server Actions. It uses the Firebase client SDK with a server-side guard
 * (no Firebase Admin SDK required — keeps the setup simple while the data
 * is non-sensitive portfolio content).
 *
 * Each fetcher:
 *  1. Returns typed data on success.
 *  2. Returns hardcoded defaults on any error (Firestore unavailable,
 *     document missing, etc.) so the site always renders correctly.
 *  3. Is async so Next.js can deduplicate and cache the fetch.
 *
 * Cache strategy:
 *  By default Next.js caches Server Component data per-request during SSR.
 *  After an admin edit, `revalidatePath('/')` in the Server Action
 *  invalidates the cache and the next request re-fetches from Firestore.
 */

import type {
  HeroData,
  AboutData,
  ServicesData,
  SkillsData,
  ProjectsData,
} from "@/types/cms";

// ─── Firestore Lazy Init ──────────────────────────────────────────────────────
// We import lazily to avoid running Firebase code at build time (prerender phase).

async function getFirestore() {
  // Guard: never run in a browser context (this file is server-only)
  if (typeof window !== "undefined") {
    throw new Error("[firestore.server] Called in a browser context.");
  }

  const { initializeApp, getApps, getApp } = await import("firebase/app");
  const { getFirestore: _getFirestore } = await import("firebase/firestore");

  const config = {
    apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };

  const isConfigured = Object.values(config).every((v) => v.length > 0);
  if (!isConfigured) return null;

  const app = !getApps().length ? initializeApp(config) : getApp();
  return _getFirestore(app);
}

// ─── Generic Document Fetcher ─────────────────────────────────────────────────

async function fetchDoc<T>(docPath: string, fallback: T): Promise<T> {
  try {
    const db = await getFirestore();
    if (!db) return fallback;

    const { doc, getDoc } = await import("firebase/firestore");
    const snap = await getDoc(doc(db, docPath));

    if (!snap.exists()) return fallback;
    return { ...fallback, ...(snap.data() as Partial<T>) };
  } catch (err) {
    console.warn(`[firestore.server] Failed to fetch "${docPath}":`, err);
    return fallback;
  }
}

// ─── Section Defaults (identical to what was previously hardcoded in components) ──

const DEFAULT_HERO: HeroData = {
  greeting: "Hello I'm",
  name: "Anjana Madhushan",
  title: "Fullstack Developer",
  description:
    "I'm a Developer, Designer, Content Creator, and Entrepreneur, passionate about technology, creativity, and digital innovation building impactful digital experiences.",
  hireLink: "#contact",
  worksLink: "#projects",
  experienceYears: "1+",
  profileImageUrl: "/pro1.png",
};

const DEFAULT_ABOUT: AboutData = {
  headline: "Hi! I am Anjana Madhushan",
  subline: "Full-Stack Developer | DevOps Engineer | MLOps Enthusiast",
  bio: "A 3rd-year university student transitioning from building scalable user experiences as a Full-Stack Developer to designing high-performance computational systems. My current drive lies in automating robust CI/CD pipelines, architecting resilient cloud infrastructure, and integrating MLOps workflows to support AI-driven outcomes.",
  location: "Sri Lanka",
  languages: ["Sinhala", "English"],
  softSkills: ["Communication"],
  currentFocus: "Cloud Infrastructure, Containerization, and reliable pipelines.",
  favoriteStack: "Next.js, Tailwind, Docker, JavaScript/TS, Python",
  achievements: "Awarded Top Performer in Hackathon 2024 and Postman API Certified.",
  certificates: ["AWS Certified Cloud Practitioner", "HackerRank Problem Solving Basic"],
  badges: ["Top Performer", "Problem Solver"],
  education: "BSc (Hons) Software Engineering — 3rd Year Undergraduate",
  resumeLink: "#resume",
};

const DEFAULT_SERVICES: ServicesData = {
  items: [
    { id: "web", title: "Web Development", description: "Building responsive and performant web applications using modern frameworks like React and Next.js.", color: "from-cyan-500 to-blue-500", iconName: "Globe" },
    { id: "design", title: "UI/UX Design", description: "Crafting premium, glassmorphic interfaces that provide an exceptional user experience.", color: "from-fuchsia-500 to-purple-500", iconName: "Palette" },
    { id: "devops", title: "DevOps & CI/CD", description: "Streamlining deployment pipelines and managing cloud infrastructure for robust applications.", color: "from-emerald-400 to-cyan-500", iconName: "Terminal" },
    { id: "mlops", title: "MLOps Integration", description: "Deploying machine learning models into production environments with scalability and monitoring.", color: "from-orange-400 to-pink-500", iconName: "Database" },
  ],
};

const DEFAULT_SKILLS: SkillsData = {
  languages: [
    { name: "JavaScript", proficiency: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { name: "TypeScript",  proficiency: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    { name: "Python",      proficiency: 75, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "Java",        proficiency: 70, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
    { name: "C#",          proficiency: 70, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" },
    { name: "C++",         proficiency: 65, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
  ],
  frontend: [
    { name: "React",       proficiency: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
    { name: "Next.js",     proficiency: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
    { name: "Tailwind CSS",proficiency: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "HTML5",       proficiency: 95, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
    { name: "CSS3",        proficiency: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
    { name: "Bootstrap",   proficiency: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg" },
  ],
  backend: [
    { name: "Node.js",     proficiency: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "PHP",         proficiency: 75, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" },
    { name: "MySQL",       proficiency: 80, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
    { name: "C",           proficiency: 60, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
  ],
  tools: [
    { name: "Docker",      proficiency: 75, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
    { name: "Git",         proficiency: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    { name: "Linux",       proficiency: 75, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" },
    { name: "Figma",       proficiency: 70, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" },
    { name: "Postman",     proficiency: 80, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" },
  ],
};

const DEFAULT_PROJECTS: ProjectsData = {
  items: [
    {
      id: "cicd",
      title: "Automated CI/CD Microservices Pipeline",
      category: "Platform Engineering",
      description: "A complete DevOps lifecycle demonstrating containerized Next.js and Python microservices, automated testing, and seamless deployment using GitHub Actions, Docker, and AWS.",
      techStack: ["Docker", "AWS", "GitHub Actions", "Next.js"],
      githubLink: "#",
      liveLink: "#",
      imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1000&q=80",
      featured: true,
    },
    {
      id: "task",
      title: "Enterprise Task Management System",
      category: "Full-Stack Application",
      description: "A high-performance MERN stack application featuring real-time collaborative boards, role-based access control, and automated daily reporting.",
      techStack: ["MongoDB", "Express", "React", "Node.js", "Socket.io"],
      githubLink: "#",
      liveLink: "#",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      featured: false,
    },
    {
      id: "sensor",
      title: "Real-Time Sensor Data Analytics",
      category: "Data Pipeline / ML",
      description: "A scalable Python-based data ingestion pipeline predicting hardware failures using Random Forest models, deployed via Docker containers.",
      techStack: ["Python", "Scikit-Learn", "Docker", "PostgreSQL", "Grafana"],
      githubLink: "#",
      liveLink: "#",
      imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
      featured: false,
    },
  ],
};

// ─── Public Fetcher API ───────────────────────────────────────────────────────

export const getHeroData     = () => fetchDoc<HeroData>    ("portfolio/hero",     DEFAULT_HERO);
export const getAboutData    = () => fetchDoc<AboutData>   ("portfolio/about",    DEFAULT_ABOUT);
export const getServicesData = () => fetchDoc<ServicesData>("portfolio/services", DEFAULT_SERVICES);
export const getSkillsData   = () => fetchDoc<SkillsData>  ("portfolio/skills",   DEFAULT_SKILLS);
export const getProjectsData = () => fetchDoc<ProjectsData>("portfolio/projects", DEFAULT_PROJECTS);
