"use client";

/**
 * EditModal.tsx — Inline Admin CMS Modal
 */

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type FormEvent,
} from "react";
import { X, Save, Loader2, CheckCircle2, AlertCircle, ChevronDown, ImageUp, Trash2 } from "lucide-react";
import { useAdmin } from "@/context/AuthContext";
import { updateSectionAction } from "@/app/actions/updateSection";
import type { SectionKey } from "@/types/cms";

type ModalState = "idle" | "loading" | "success" | "error";

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "url";
  placeholder?: string;
  rows?: number;
}

interface AdminEditEventDetail {
  section: SectionKey;
  focusField?: string;
}

const SECTION_FIELDS: Record<SectionKey, FieldDef[]> = {
  hero: [
    { key: "greeting", label: "Greeting Text", type: "text", placeholder: "Hello I'm" },
    { key: "name", label: "Full Name", type: "text", placeholder: "Anjana Madhushan" },
    { key: "title", label: "Job Title", type: "text", placeholder: "Fullstack Developer" },
    { key: "description", label: "Bio Paragraph", type: "textarea", placeholder: "I'm a Developer...", rows: 4 },
    { key: "hireLink", label: "Hire Me Link", type: "text", placeholder: "#contact" },
    { key: "worksLink", label: "Works/Projects Link", type: "text", placeholder: "#projects" },
    { key: "experienceYears", label: "Experience Years", type: "text", placeholder: "1+" },
    { key: "profileImageUrl", label: "Profile Image URL", type: "url", placeholder: "/pro1.png" },
  ],
  about: [
    { key: "headline", label: "Headline", type: "text", placeholder: "Hi! I am..." },
    { key: "subline", label: "Subline / Roles", type: "text", placeholder: "Full-Stack Developer | ..." },
    { key: "bio", label: "Bio Paragraph", type: "textarea", rows: 5, placeholder: "A 3rd-year..." },
    { key: "location", label: "Location", type: "text", placeholder: "Sri Lanka" },
    { key: "currentFocus", label: "Current Focus", type: "textarea", rows: 2 },
    { key: "favoriteStack", label: "Favourite Stack", type: "text" },
    { key: "achievements", label: "Achievements", type: "textarea", rows: 2 },
    { key: "languages", label: "Languages (JSON Array)", type: "textarea", rows: 4, placeholder: '["Sinhala","English"]' },
    { key: "softSkills", label: "Soft Skills (JSON Array)", type: "textarea", rows: 4, placeholder: '["Communication","Teamwork"]' },
    { key: "certificates", label: "Certificates (JSON Array)", type: "textarea", rows: 4, placeholder: '["AWS Certified ...","Google Cloud ..."]' },
    { key: "badges", label: "Badges (JSON Array)", type: "textarea", rows: 4, placeholder: '["Top Performer","Open Source"]' },
    { key: "education", label: "Education", type: "text", placeholder: "Sri Lanka" },
    { key: "resumeLink", label: "Resume Link", type: "text", placeholder: "#resume" },
  ],
  services: [
    {
      key: "items",
      label: "Services (JSON Array)",
      type: "textarea",
      rows: 14,
      placeholder: '[{"id":"web","title":"Web Development","description":"...","color":"from-cyan-500 to-blue-500","iconName":"Globe"}]',
    },
  ],
  skills: [
    { key: "languages", label: "Languages (JSON Array)", type: "textarea", rows: 8, placeholder: '[{"name":"JavaScript","proficiency":90,"icon":"https://..."}]' },
    { key: "frontend", label: "Frontend (JSON Array)", type: "textarea", rows: 8, placeholder: '[{"name":"React","proficiency":90,"icon":"https://..."}]' },
    { key: "backend", label: "Backend (JSON Array)", type: "textarea", rows: 6, placeholder: '[{"name":"Node.js","proficiency":85,"icon":"https://..."}]' },
    { key: "tools", label: "Tools & DevOps (JSON Array)", type: "textarea", rows: 6, placeholder: '[{"name":"Docker","proficiency":75,"icon":"https://..."}]' },
  ],
  projects: [
    {
      key: "items",
      label: "Projects (JSON Array)",
      type: "textarea",
      rows: 16,
      placeholder: '[{"id":"cicd","title":"...","category":"...","description":"...","techStack":["Docker"],"githubLink":"#","liveLink":"#","imageUrl":"https://...","featured":true}]',
    },
  ],
};

const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero Section",
  about: "About Me",
  services: "Services",
  skills: "Skills",
  projects: "Projects",
};

const JSON_FIELD_KEYS = new Set([
  "items",
  "languages",
  "frontend",
  "backend",
  "tools",
  "softSkills",
  "certificates",
  "badges",
]);

const ABOUT_CARD_FIELDS: Record<string, string[]> = {
  headline: ["headline", "subline", "bio", "resumeLink"],
  location: ["location"],
  languages: ["languages"],
  softSkills: ["softSkills"],
  currentFocus: ["currentFocus"],
  favoriteStack: ["favoriteStack"],
  achievements: ["achievements"],
  certificates: ["certificates"],
  badges: ["badges"],
  education: ["education"],
  resumeLink: ["resumeLink"],
};

const HERO_CARD_FIELDS: Record<string, string[]> = {
  profileImageUrl: ["profileImageUrl"],
};

export default function EditModal() {
  const { isAdmin, adminUser } = useAdmin();

  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<SectionKey | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [modalState, setModalState] = useState<ModalState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [focusFieldKey, setFocusFieldKey] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    const handler = (e: Event) => {
      const { section: sec, focusField } = (e as CustomEvent<AdminEditEventDetail>).detail;
      if (!SECTION_FIELDS[sec]) return;

      setSection(sec);
      setFormData({});
      setModalState("idle");
      setErrorMsg("");
      setExpandedField(null);
      setFocusFieldKey(focusField ?? null);
      setOpen(true);
    };

    window.addEventListener("admin:edit", handler);
    return () => window.removeEventListener("admin:edit", handler);
  }, [isAdmin]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (focusFieldKey) {
        const focusEl = document.getElementById(`field-${focusFieldKey}`) as HTMLInputElement | HTMLTextAreaElement | null;
        focusEl?.focus();
        return;
      }
      firstInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [open, section, focusFieldKey]);

  const closeModal = useCallback(() => {
    if (modalState === "loading") return;
    setOpen(false);
    setTimeout(() => {
      setSection(null);
      setFormData({});
      setModalState("idle");
      setErrorMsg("");
      setFocusFieldKey(null);
    }, 300);
  }, [modalState]);

  const focusProfileImageField = useCallback(() => {
    setFocusFieldKey("profileImageUrl");
    const input = document.getElementById("field-profileImageUrl") as HTMLInputElement | null;
    input?.focus();
  }, []);

  const handleDeleteProfileImage = useCallback(async () => {
    if (!adminUser || modalState === "loading") return;
    const confirmed = window.confirm("Delete current profile picture and reset to default image?");
    if (!confirmed) return;

    setModalState("loading");
    setErrorMsg("");

    try {
      const idToken = await adminUser.getIdToken(true);
      const result = await updateSectionAction("hero", { profileImageUrl: "/pro1.png" }, idToken);

      if (!result.success) {
        setModalState("error");
        setErrorMsg(result.error ?? "Profile image delete failed.");
        return;
      }

      setFormData((prev) => ({ ...prev, profileImageUrl: "/pro1.png" }));
      setModalState("success");
      setTimeout(() => setModalState("idle"), 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      setModalState("error");
      setErrorMsg(msg);
    }
  }, [adminUser, modalState]);

  const handleFieldChange = useCallback((key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!section || !adminUser || modalState === "loading") return;

    setModalState("loading");
    setErrorMsg("");

    try {
      const idToken = await adminUser.getIdToken(true);
      const fields = SECTION_FIELDS[section];
      const payload: Record<string, unknown> = {};

      for (const field of fields) {
        const raw = formData[field.key] ?? "";
        if (raw.trim() === "") continue;

        if (JSON_FIELD_KEYS.has(field.key)) {
          try {
            payload[field.key] = JSON.parse(raw);
          } catch {
            setModalState("error");
            setErrorMsg(`"${field.label}" contains invalid JSON. Please fix it and try again.`);
            return;
          }
        } else {
          payload[field.key] = raw;
        }
      }

      if (Object.keys(payload).length === 0) {
        setModalState("error");
        setErrorMsg("No changes to save. Fill in at least one field.");
        return;
      }

      const result = await updateSectionAction(section, payload, idToken);

      if (result.success) {
        setModalState("success");
        setTimeout(closeModal, 1800);
      } else {
        setModalState("error");
        setErrorMsg(result.error ?? "Update failed.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      setModalState("error");
      setErrorMsg(msg);
    }
  }, [section, adminUser, formData, modalState, closeModal]);

  if (!isAdmin || !open || !section) return null;

  const fields = SECTION_FIELDS[section];
  const sectionLabel = SECTION_LABELS[section];
  const visibleFields =
    section === "about" && focusFieldKey && ABOUT_CARD_FIELDS[focusFieldKey]
      ? fields.filter((field) => ABOUT_CARD_FIELDS[focusFieldKey].includes(field.key))
      : section === "hero" && focusFieldKey && HERO_CARD_FIELDS[focusFieldKey]
        ? fields.filter((field) => HERO_CARD_FIELDS[focusFieldKey].includes(field.key))
        : fields;
  let refAssigned = false;

  return (
    <div
      ref={overlayRef}
      id="edit-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${sectionLabel}`}
      className="fixed inset-0 z-10000 flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => { if (e.target === overlayRef.current) closeModal(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div
        id="edit-modal-panel"
        className="
          relative z-10 w-full max-w-2xl max-h-[90vh]
          flex flex-col
          bg-[#0d0920]/95 backdrop-blur-xl
          border border-white/10
          rounded-2xl
          shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]
          overflow-hidden
        "
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-linear-to-br from-cyan-400 to-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
            <div>
              <h2 className="text-white font-bold text-lg leading-none">
                Edit{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500">
                  {sectionLabel}
                </span>
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Changes are saved instantly and take effect on the next page load.
              </p>
            </div>
          </div>

          <button
            id="edit-modal-close"
            onClick={closeModal}
            disabled={modalState === "loading"}
            aria-label="Close edit modal"
            className="
              w-8 h-8 rounded-lg flex items-center justify-center
              text-slate-400 hover:text-white
              bg-white/0 hover:bg-white/10
              border border-transparent hover:border-white/25
              transition-all duration-150
              disabled:opacity-40 cursor-pointer
            "
          >
            <X size={16} />
          </button>
        </div>

        <form id="edit-modal-form" onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
            {section === "hero" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={focusProfileImageField}
                  disabled={modalState === "loading"}
                  className="w-full rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 transition-all duration-150 px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <ImageUp size={16} />
                  Update Profile Picture
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProfileImage}
                  disabled={modalState === "loading"}
                  className="w-full rounded-xl border border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 transition-all duration-150 px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 size={16} />
                  Delete Profile Picture
                </button>
              </div>
            )}

            {visibleFields.map((field) => {
              const isExpanded = expandedField === field.key;
              const assignRef = !refAssigned;
              if (assignRef) refAssigned = true;

              return (
                <div key={field.key} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor={`field-${field.key}`}
                      className="text-sm font-medium text-slate-300 group-focus-within:text-cyan-400 transition-colors"
                    >
                      {field.label}
                    </label>
                    {field.type === "textarea" && (
                      <button
                        type="button"
                        onClick={() => setExpandedField(isExpanded ? null : field.key)}
                        className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                      >
                        <ChevronDown size={12} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        {isExpanded ? "Collapse" : "Expand"}
                      </button>
                    )}
                  </div>

                  {field.type === "textarea" ? (
                    <textarea
                      id={`field-${field.key}`}
                      ref={assignRef ? (el) => { firstInputRef.current = el; } : undefined}
                      rows={isExpanded ? (field.rows ?? 4) * 2 : (field.rows ?? 4)}
                      value={formData[field.key] ?? ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={modalState === "loading"}
                      className="
                        w-full bg-white/3 border border-white/10
                        rounded-xl px-4 py-3
                        text-white text-sm font-mono leading-relaxed
                        placeholder-slate-600
                        focus:outline-none focus:border-cyan-500/60 focus:bg-white/5
                        focus:ring-1 focus:ring-cyan-500/30
                        transition-all duration-150
                        resize-none disabled:opacity-50
                      "
                    />
                  ) : (
                    <input
                      id={`field-${field.key}`}
                      ref={assignRef ? (el) => { firstInputRef.current = el; } : undefined}
                      type={field.type}
                      value={formData[field.key] ?? ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={modalState === "loading"}
                      className="
                        w-full bg-white/3 border border-white/10
                        rounded-xl px-4 py-3
                        text-white text-sm
                        placeholder-slate-600
                        focus:outline-none focus:border-cyan-500/60 focus:bg-white/5
                        focus:ring-1 focus:ring-cyan-500/30
                        transition-all duration-150
                        disabled:opacity-50
                      "
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="px-6 py-4 border-t border-white/10 shrink-0 space-y-3">
            {modalState === "error" && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{errorMsg}</p>
              </div>
            )}
            {modalState === "success" && (
              <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <p className="text-emerald-300 text-sm font-medium">Saved successfully! Page is revalidating…</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={modalState === "loading"}
                className="
                  flex-1 py-2.5 rounded-xl
                  text-sm font-medium text-slate-400 hover:text-white
                  bg-white/5 hover:bg-white/10
                  border border-white/10 hover:border-white/20
                  transition-all duration-150
                  disabled:opacity-40 cursor-pointer
                "
              >
                Cancel
              </button>

              <button
                id="edit-modal-save"
                type="submit"
                disabled={modalState === "loading" || modalState === "success"}
                className="
                  flex-2 py-2.5 rounded-xl
                  text-sm font-bold text-white
                  bg-linear-to-r from-cyan-500 to-fuchsia-500
                  hover:from-cyan-400 hover:to-fuchsia-400
                  shadow-[0_4px_15px_rgba(34,211,238,0.25)]
                  hover:shadow-[0_4px_20px_rgba(34,211,238,0.4)]
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                  cursor-pointer
                "
              >
                {modalState === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving…
                  </>
                ) : modalState === "success" ? (
                  <>
                    <CheckCircle2 size={16} />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
