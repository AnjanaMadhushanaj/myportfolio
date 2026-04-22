"use client";

/**
 * AdminBar.tsx
 *
 * A fixed top banner that is ONLY rendered when `isAdmin === true`.
 * It gives the admin clear visual feedback that they are in edit mode,
 * and exposes a one-click Sign Out button.
 *
 * Design System:
 *  - Background:  deep dark glassmorphism (bg-white/5 + backdrop-blur-md)
 *  - Accent left:  cyan-400  (#22d3ee)
 *  - Accent right: fuchsia-500 (#d946ef)
 *  - Border:       white/10
 *  - Height:       40px (h-10) — reserves space via `pt-10` applied in layout
 *
 * Architecture note:
 *  This component is a "Client Island" — imported by the Server Component
 *  layout.tsx, but executed entirely on the client. It contributes zero bytes
 *  to the server-rendered HTML when the user is not signed in, because the
 *  `isAuthLoading` guard prevents a flash.
 */

import { useAdmin } from "@/context/AuthContext";
import { ShieldCheck, LogOut, Pencil } from "lucide-react";

export default function AdminBar() {
  const { isAdmin, adminUser, isAuthLoading, signOut } = useAdmin();

  // ── Do not render anything during auth resolution (prevents layout shift)
  if (isAuthLoading || !isAdmin) return null;

  return (
    <div
      id="admin-bar"
      role="banner"
      aria-label="Admin mode indicator"
      className="
        fixed top-0 left-0 right-0 z-[9999]
        h-10
        flex items-center justify-between
        px-4 sm:px-6
        bg-white/5 backdrop-blur-md
        border-b border-white/10
        shadow-[0_2px_20px_rgba(0,0,0,0.4)]
      "
    >
      {/* ── Left: Status badge ── */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        {/* Pulsing green dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>

        <ShieldCheck
          size={14}
          className="text-cyan-400 shrink-0"
          aria-hidden="true"
        />

        <span className="font-semibold tracking-wide">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            ADMIN MODE
          </span>
        </span>

        {/* Email — hidden on very small screens */}
        {adminUser?.email && (
          <span className="hidden sm:inline text-slate-400 font-mono text-[10px] ml-1">
            [{adminUser.email}]
          </span>
        )}
      </div>

      {/* ── Centre: Edit mode hint ── */}
      <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px]">
        <Pencil size={11} className="text-fuchsia-400" aria-hidden="true" />
        <span>Click any&nbsp;</span>
        <span className="inline-flex items-center gap-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded px-1.5 py-0.5 text-fuchsia-300 font-medium">
          <Pencil size={9} aria-hidden="true" />
          Edit
        </span>
        <span>&nbsp;icon to update content</span>
      </div>

      {/* ── Right: Sign-out button ── */}
      <button
        id="admin-bar-signout"
        onClick={signOut}
        aria-label="Sign out of admin mode"
        className="
          flex items-center gap-1.5
          text-xs font-medium
          text-slate-300 hover:text-white
          bg-white/0 hover:bg-white/10
          border border-white/10 hover:border-white/20
          rounded-md px-3 py-1
          transition-all duration-200
          cursor-pointer
          group
        "
      >
        <LogOut
          size={12}
          className="group-hover:text-red-400 transition-colors"
          aria-hidden="true"
        />
        <span className="hidden xs:inline">Sign Out</span>
      </button>
    </div>
  );
}
