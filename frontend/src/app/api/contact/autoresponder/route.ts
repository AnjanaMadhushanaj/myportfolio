/**
 * /api/contact/autoresponder  — POST
 *
 * Sends a professional auto-response to the user's email via Resend.
 *
 * Security hardening:
 *  - Rate limiting: max 5 requests per IP per 10 minutes (in-memory bucket)
 *  - Input sanitization: HTML entity-encode name/subject before injecting into email HTML
 *  - Strict email validation + field length caps
 *
 * Environment variables required (server-only, no NEXT_PUBLIC_ prefix):
 *   RESEND_API_KEY          — your Resend API key
 *   RESEND_FROM_EMAIL       — verified sender, e.g. "Anjana <hello@yourdomain.com>"
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// NOTE: Resend is intentionally NOT instantiated at module level.
// Doing so would cause `next build` to fail when RESEND_API_KEY is absent
// (e.g. during a Docker build that doesn't inject runtime env vars).
// Lazy initialization happens inside the handler, after the env guard.

// ─── Rate Limiter (in-memory token bucket) ────────────────────────────────────
// 5 requests per IP per 10 minutes.  Resets on server restart.
const RATE_LIMIT_MAX    = 5;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes in ms
const rateLimitMap      = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ─── Input Sanitization ───────────────────────────────────────────────────────
function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#039;");
}

// ─── Email validation ─────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── HTML template for the auto-reply ────────────────────────────────────────
function buildAutoReplyHtml(name: string, subject: string): string {
  const displayName    = escapeHtml(name?.trim()    || "there");
  const displaySubject = escapeHtml(subject?.trim() || "your inquiry");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>We received your message</title>
</head>
<body style="margin:0;padding:0;background:#0f0a1a;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0a1a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:linear-gradient(145deg,#1a0f2e,#12081e);border:1px solid rgba(217,70,239,0.2);border-radius:20px;overflow:hidden;box-shadow:0 0 60px rgba(217,70,239,0.15);">
          <tr>
            <td style="background:linear-gradient(90deg,#c026d3,#d946ef);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
                Application Received! &#128640;
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 16px;font-size:16px;color:#e2e8f0;">
                Hi <strong style="color:#d946ef;">${displayName}</strong>,
              </p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#cbd5e1;">
                Thank you for reaching out regarding <em>${displaySubject}</em>.
                I have successfully received your message and I am excited to connect!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:rgba(217,70,239,0.08);border:1px solid rgba(217,70,239,0.2);border-radius:12px;margin:24px 0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#d946ef;text-transform:uppercase;letter-spacing:0.15em;">
                      What happens next?
                    </p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#cbd5e1;">
                      I will personally review your inquiry and <strong style="color:#fff;">reply within 24 hours</strong>
                      with proposed dates and times for a quick discovery call.
                      No automated scheduling links - just a direct, human reply.
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:14px;color:#94a3b8;">
                In the meantime, feel free to explore my work at
                <a href="https://anjanam.dev" style="color:#d946ef;text-decoration:none;">anjanam.dev</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 32px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:24px 0 0;font-size:13px;color:#64748b;text-align:center;">
                &copy; ${new Date().getFullYear()} Anjana Madhushan &middot; This is an automated confirmation.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting ──────────────────────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes." },
        { status: 429 }
      );
    }

    // ── Parse & validate body ─────────────────────────────────────────────────
    const body = await req.json();
    const { to, name, subject } = body as {
      to: string;
      name: string;
      subject?: string;
    };

    if (!to || !EMAIL_REGEX.test(to)) {
      return NextResponse.json({ error: "Invalid recipient email." }, { status: 400 });
    }

    if (
      (name    && name.length    > 200) ||
      (subject && subject.length > 300)
    ) {
      return NextResponse.json({ error: "Input exceeds maximum length." }, { status: 400 });
    }

    // ── Guard: skip if RESEND_API_KEY is not configured ───────────────────────
    if (!process.env.RESEND_API_KEY) {
      console.warn("[autoresponder] RESEND_API_KEY not set - skipping auto-reply.");
      return NextResponse.json({ skipped: true }, { status: 200 });
    }

    // Lazy-initialize Resend only when the key is confirmed present
    const resend    = new Resend(process.env.RESEND_API_KEY);
    const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Anjana Madhushan <noreply@anjanam.dev>";

    const { error } = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      [to],
      subject: "Application Received! I'll be in touch within 24 hours",
      html:    buildAutoReplyHtml(name ?? "", subject ?? ""),
    });

    if (error) {
      console.error("[autoresponder] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[autoresponder] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
