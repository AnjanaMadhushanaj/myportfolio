"use client";

/**
 * EditButton.tsx
 *
 * A floating pencil-icon button that appears ONLY when `isAdmin === true`.
 * It is designed to be embedded directly inside Server Components —
 * making it the critical "hybrid composition" join-point of this architecture.
 *
 * Usage inside a Server Component:
 * ─────────────────────────────────
 *   import EditButton from "@/components/ui/EditButton";
 *
 *   export default async function Hero() {
 *     const data = await getHeroData();          // Server-side Firestore fetch
 *     return (
 *       <section id="hero">
 *         <EditButton section="hero" label="Edit Hero" />
 *         ...content...
 *       </section>
 *     );
 *   }
 *
 * Props:
 *  - section:   Firestore document key (passed up to EditModal via callback)
 *  - label:     Accessible tooltip / aria-label text
 *  - onEdit:    Optional override callback — if omitted the button fires a
 *               custom DOM event (`admin:edit`) that the EditModal listens to.
 *               This decouples the button from any specific modal import,
 *               keeping the Server Component boundary clean.
 *  - position:  Controls absolute position within the parent section.
 *               Defaults to top-right.
 *
 * Design System:
 *  - Resting:   fuchsia glow ring, bg-white/5 glass pill
 *  - Hover:     scale-110, intensified glow, text label reveals
 *  - Focus:     accessible cyan focus ring
 *  - Animation: CSS keyframe `admin-pulse` — subtle breathe effect
 */

import { useAdmin } from "@/context/AuthContext";
import { Pencil } from "lucide-react";
import { useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EditSection =
  | "hero"
  | "about"
  | "techStack"
  | "services"
  | "skills"
  | "projects"
  | "footer"
  | (string & {}); // Allow arbitrary section strings for extensibility.

interface EditButtonProps {
  /** The Firestore document key / section identifier. */
  section: EditSection;
  /** Human-readable label shown on hover + used as aria-label. */
  label?: string;
  /**
   * Optional click handler override.
   * When omitted, a `admin:edit` CustomEvent is dispatched on `window`
   * so the EditModal (rendered elsewhere in the tree) can open itself.
   */
  onEdit?: (section: EditSection) => void;
  /** Tailwind class(es) to position the button within its parent. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EditButton({
  section,
  label,
  onEdit,
  className = "absolute bottom-4 left-4",
}: EditButtonProps) {
  const { isAdmin, isAuthLoading } = useAdmin();

  const handleClick = useCallback(() => {
    if (onEdit) {
      onEdit(section);
      return;
    }
    // Broadcast a CustomEvent — EditModal listens to this on `window`.
    // This keeps EditButton ↔ EditModal decoupled (no shared import needed).
    window.dispatchEvent(
      new CustomEvent("admin:edit", { detail: { section } })
    );
  }, [section, onEdit]);

  // Do not render during auth resolution or for non-admin users.
  if (isAuthLoading || !isAdmin) return null;

  const resolvedLabel = label ?? `Edit ${section}`;

  return (
    <>
      {/* Inject keyframe once — idempotent in React 19 */}
      <style>{`
        @keyframes admin-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(217, 70, 239, 0.4), 0 0 12px 2px rgba(217, 70, 239, 0.2); }
          50%       { box-shadow: 0 0 0 4px rgba(217, 70, 239, 0),  0 0 20px 4px rgba(217, 70, 239, 0.35); }
        }
        .admin-edit-btn { animation: admin-pulse 2.4s ease-in-out infinite; }
        .admin-edit-btn:hover { animation: none; }
      `}</style>

      <button
        id={`edit-btn-${section}`}
        onClick={handleClick}
        aria-label={resolvedLabel}
        title={resolvedLabel}
        className={`
          admin-edit-btn
          group
          ${className}
          z-50
          flex items-center gap-2
          h-8 pl-2 pr-3
          rounded-full
          bg-white/5 backdrop-blur-md
          border border-fuchsia-500/40
          text-fuchsia-400
          hover:bg-fuchsia-500/15
          hover:border-fuchsia-400/70
          hover:text-fuchsia-300
          hover:scale-110
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-cyan-400
          focus-visible:ring-offset-2
          focus-visible:ring-offset-transparent
          transition-all duration-200 ease-out
          cursor-pointer
          select-none
          shadow-[0_2px_10px_rgba(0,0,0,0.3)]
        `}
      >
        {/* Icon */}
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-fuchsia-500/20 group-hover:bg-fuchsia-500/30 transition-colors shrink-0">
          <Pencil
            size={11}
            strokeWidth={2.5}
            aria-hidden="true"
            className="transition-transform group-hover:rotate-[-8deg]"
          />
        </span>

        {/* Label — reveals on hover via max-width transition */}
        <span
          className="
            text-[11px] font-semibold tracking-wide
            overflow-hidden whitespace-nowrap
            max-w-0 group-hover:max-w-30
            opacity-0 group-hover:opacity-100
            transition-all duration-200 ease-out
          "
        >
          {resolvedLabel}
        </span>
      </button>
    </>
  );
}
