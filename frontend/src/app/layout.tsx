/**
 * layout.tsx  —  Root Layout (Server Component)
 *
 * Architecture:
 *  ┌─────────────────────────────────────────────────────────┐
 *  │  RootLayout  [Server Component — no "use client"]       │
 *  │                                                         │
 *  │  <AdminOverlayProvider>    ← "use client" boundary      │
 *  │    <AdminBar />            ← "use client" island        │
 *  │    {children}              ← Server Components resume   │
 *  │  </AdminOverlayProvider>                                │
 *  └─────────────────────────────────────────────────────────┘
 *
 * Key rules followed:
 *  1. layout.tsx itself has NO "use client" directive — it is a pure
 *     Server Component and can export `metadata` / `viewport` as required.
 *  2. <AdminOverlayProvider> and <AdminBar> are imported from client modules,
 *     but Next.js handles the boundary automatically.  The RSC payload for
 *     the shell is still server-rendered; only the provider subtree ships JS.
 *  3. `pt-10` is conditionally added via a server-rendered wrapper so that
 *     when AdminBar is present (40px / h-10), page content is not obscured.
 *     Because we cannot know at render-time whether the user is an admin
 *     (auth is client-only), AdminBar uses CSS to push content down
 *     via `margin-top` on the body when it mounts (see AdminBar.tsx).
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AdminOverlayProvider } from "@/context/AuthContext";
import AdminBar from "@/components/ui/AdminBar";

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ---------------------------------------------------------------------------
// Metadata  (static — exported from a Server Component, perfect for SEO)
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: "Anjana Madhushan — Full-Stack Developer",
    template: "%s | Anjana Madhushan",
  },
  description:
    "Portfolio of Anjana Madhushan — Full-Stack Developer, DevOps Engineer, and MLOps Enthusiast. Showcasing production-grade projects and open-source contributions.",
  keywords: [
    "Full-Stack Developer",
    "DevOps Engineer",
    "MLOps",
    "Next.js",
    "React",
    "TypeScript",
    "Anjana Madhushan",
  ],
  authors: [{ name: "Anjana Madhushan" }],
  creator: "Anjana Madhushan",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Anjana Madhushan Portfolio",
    title: "Anjana Madhushan — Full-Stack Developer",
    description:
      "Production-grade portfolio showcasing Full-Stack, DevOps, and MLOps expertise.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: "dark",
  themeColor: "#0a0514",
};

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex flex-col relative overflow-x-hidden"
        suppressHydrationWarning
      >
        {/*
         * AdminOverlayProvider — the single "use client" boundary for all
         * admin state. Everything it wraps can still be a Server Component;
         * React will "pass through" the server-rendered children as RSC slots.
         *
         * AdminBar — fixed at top, contributes h-10 (40px) to the layout when
         * the admin is signed in.  It renders null for all public visitors,
         * causing zero layout impact and zero JS cost for them.
         */}
        <AdminOverlayProvider>
          <AdminBar />
          {children}
        </AdminOverlayProvider>
      </body>
    </html>
  );
}
