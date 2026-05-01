"use client";

/**
 * ContactModal.tsx — Hire-Me Contact Form
 *
 * Flow:
 *  1. User fills Name / Email / Message and clicks Send.
 *  2. EmailJS sends the admin-notification email via the PUBLIC service,
 *     with reply_to mapped to the user's email.
 *  3. A Next.js API route (/api/contact/autoresponder) fires a confirmation
 *     email back to the user via Resend.
 *  4. On success the modal transitions to a professional success-state card.
 */

import { useState, useEffect, useCallback } from "react";
import { X, Send, CheckCircle2, Loader2, Mail, User, MessageSquare } from "lucide-react";
import emailjs from "@emailjs/browser";

// ─── EmailJS public config (safe to expose in client bundles) ──────────────
const EMAILJS_SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? "";

// ─── Types ─────────────────────────────────────────────────────────────────
interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type ModalStatus = "idle" | "submitting" | "success" | "error";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function ContactModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus]     = useState<ModalStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset form state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setForm({ name: "", email: "", subject: "", message: "" });
        setStatus("idle");
        setErrorMsg("");
      }, 300);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      // ── 1. Admin notification via EmailJS ────────────────────────────
      //    reply_to is the user's email → hitting "Reply" in Gmail goes to client.
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    form.name,
          from_email:   form.email,        // for display in template
          reply_to:     form.email,        // ← crucial: reply goes to client
          subject:      form.subject || `New inquiry from ${form.name}`,
          message:      form.message,
        },
        EMAILJS_PUBLIC_KEY,
      );

      // ── 2. Auto-responder via server API route (Resend) ──────────────
      //    Fire-and-forget — don't block on it; user still sees success.
      fetch("/api/contact/autoresponder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to:      form.email,
          name:    form.name,
          subject: form.subject,
        }),
      }).catch(() => {/* intentionally swallowed */});

      setStatus("success");
    } catch (err) {
      console.error("[ContactModal] EmailJS error:", err);
      setErrorMsg(
        "Oops! Something went wrong. Please try emailing me directly."
      );
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Panel — stop clicks from bubbling to the backdrop handler */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full max-w-lg rounded-3xl overflow-hidden
          bg-slate-950/90 border border-white/10
          shadow-[0_0_80px_rgba(217,70,239,0.2),inset_0_0_40px_rgba(217,70,239,0.03)]
          backdrop-blur-2xl
          transition-all duration-300
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        {/* Decorative top-left orb */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-[#d946ef]/20 rounded-full blur-3xl pointer-events-none" />
        {/* Decorative bottom-right orb */}
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          id="contact-modal-close"
          onClick={onClose}
          aria-label="Close contact modal"
          className="absolute top-5 right-5 z-50 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <X size={18} />
        </button>

        {/* ── Success State ────────────────────────────────────────────── */}
        {status === "success" ? (
          <div className="relative z-10 flex flex-col items-center text-center px-8 py-14 gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c026d3] to-cyan-400 flex items-center justify-center shadow-[0_0_40px_rgba(217,70,239,0.5)]">
                <CheckCircle2 size={40} className="text-white" />
              </div>
              <span className="absolute -top-1 -right-1 text-2xl animate-bounce">🚀</span>
            </div>

            <div className="space-y-3">
              <h2 id="contact-modal-title" className="text-2xl font-bold text-white">
                Application Received!
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                I will review your inquiry and email you within{" "}
                <span className="text-[#d946ef] font-semibold">24 hours</span> with
                proposed dates for a quick meeting.
              </p>
              <p className="text-slate-500 text-xs">
                Check your inbox — a confirmation email is on its way.
              </p>
            </div>

            <button
              id="contact-modal-success-close"
              onClick={onClose}
              className="mt-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#c026d3] to-[#d946ef] text-white font-bold shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.7)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form State ──────────────────────────────────────────────── */
          <div className="relative z-10 px-6 sm:px-8 pt-8 pb-8">
            {/* Header */}
            <div className="mb-7">
              <p className="text-[#d946ef] text-xs font-semibold uppercase tracking-[0.2em] mb-1">
                Let&apos;s Connect
              </p>
              <h2 id="contact-modal-title" className="text-2xl font-bold text-white leading-tight">
                Send me a message
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Fill in the details below and I&apos;ll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <label htmlFor="contact-name" className="sr-only">Name</label>
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#d946ef] transition-colors pointer-events-none" />
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#d946ef]/60 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(217,70,239,0.1)] transition-all duration-200"
                  />
                </div>

                <div className="relative group">
                  <label htmlFor="contact-email" className="sr-only">Email</label>
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#d946ef] transition-colors pointer-events-none" />
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#d946ef]/60 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(217,70,239,0.1)] transition-all duration-200"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="relative group">
                <label htmlFor="contact-subject" className="sr-only">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="Subject (optional)"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#d946ef]/60 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(217,70,239,0.1)] transition-all duration-200"
                />
              </div>

              {/* Message */}
              <div className="relative group">
                <label htmlFor="contact-message" className="sr-only">Message</label>
                <MessageSquare size={15} className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-[#d946ef] transition-colors pointer-events-none" />
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project or inquiry..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#d946ef]/60 focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(217,70,239,0.1)] transition-all duration-200 resize-none"
                />
              </div>

              {/* Error message */}
              {status === "error" && (
                <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                  {errorMsg}
                </p>
              )}

              {/* Submit */}
              <button
                id="contact-modal-submit"
                type="submit"
                disabled={status === "submitting"}
                className="
                  w-full flex items-center justify-center gap-2.5
                  py-3.5 rounded-xl font-bold text-white text-sm
                  bg-gradient-to-r from-[#c026d3] to-[#d946ef]
                  shadow-[0_0_20px_rgba(217,70,239,0.3)]
                  hover:shadow-[0_0_30px_rgba(217,70,239,0.6)]
                  hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none
                  transition-all duration-300
                "
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
