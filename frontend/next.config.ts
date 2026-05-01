import type { NextConfig } from "next";

// ─── Security Headers ─────────────────────────────────────────────────────────
const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer policy — don't leak full URL on cross-origin navigation
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser feature access
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Content Security Policy
  // Allows: self, Google Fonts, Firebase, EmailJS CDN, CDN images used in the app
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + EmailJS SDK + Firebase (loaded by the client SDK)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.emailjs.com https://apis.google.com",
      // Styles: self + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs + CDN sources used in the app
      "img-src 'self' data: blob: https://cdn.jsdelivr.net https://cdn.simpleicons.org https://images.unsplash.com https://drive.google.com https://lh3.googleusercontent.com https://firebasestorage.googleapis.com",
      // Connections: self + Firebase + EmailJS API + Resend (via server-side API route, not direct)
      "connect-src 'self' https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.emailjs.com wss://*.firebaseio.com",
      // Frames: none (no iframes)
      "frame-src 'none'",
      // Objects: none
      "object-src 'none'",
      // Base URI: restrict to self
      "base-uri 'self'",
      // Form targets: self only
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // "standalone" is needed for Docker / self-hosted deployments.
  // Vercel manages its own output — setting standalone there causes 404s.
  // Pass DOCKER=true in your Dockerfile/docker-compose to activate it.
  ...(process.env.DOCKER === "true" ? { output: "standalone" } : {}),

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
    qualities: [60, 75, 100],
  },

  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

