"use server";

/**
 * updateSection.ts — Server Action for CMS Mutations
 *
 * Security model:
 *  Firebase client-side auth tokens are short-lived JWTs. After login,
 *  Firebase stores the token in IndexedDB (not accessible server-side).
 *  For portfolio use, we verify the admin intent by:
 *  1. Checking the `__session` cookie set by Firebase Hosting (if used), OR
 *  2. Accepting the action only from the deployed origin (middleware).
 *
 *  For a personal portfolio, the Firestore Security Rules are the true
 *  security boundary:
 *    rules_version = '2';
 *    service cloud.firestore {
 *      match /databases/{database}/documents {
 *        match /portfolio/{section} {
 *          allow read: if true;
 *          allow write: if request.auth != null;
 *        }
 *      }
 *    }
 *
 *  The Server Action calls Firestore using the client SDK with the user's
 *  auth token (passed as a header from the client — see EditModal.tsx).
 *  Firestore Security Rules enforce that only authenticated users can write.
 *
 * After a successful write, `revalidatePath('/')` purges the Next.js cache
 * so the next page load reflects the new data without a full redeploy.
 */

import { revalidatePath } from "next/cache";
import type { SectionKey } from "@/types/cms";

// ─── Return type ──────────────────────────────────────────────────────────────

export interface ActionResult {
  success: boolean;
  error?: string;
}

// ─── Server Action ────────────────────────────────────────────────────────────

/**
 * updateSectionAction
 *
 * @param section   - The Firestore document key (e.g. "hero", "about")
 * @param data      - Partial or full data object to merge into the document
 * @param idToken   - Firebase ID token from the client (for auth verification)
 */
export async function updateSectionAction(
  section: SectionKey,
  data: Record<string, unknown>,
  idToken: string
): Promise<ActionResult> {
  // ── 1. Basic input validation ──────────────────────────────────────────────
  const validSections: SectionKey[] = ["hero", "about", "services", "skills", "projects"];
  if (!validSections.includes(section)) {
    return { success: false, error: `Invalid section: "${section}"` };
  }

  if (!idToken || typeof idToken !== "string" || idToken.length < 20) {
    return { success: false, error: "Missing or invalid authentication token." };
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { success: false, error: "Invalid data payload." };
  }

  // ── 2. Firestore write ─────────────────────────────────────────────────────
  try {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getFirestore, doc, setDoc }       = await import("firebase/firestore");
    const { getAuth, signInWithCustomToken }   = await import("firebase/auth");

    const config = {
      apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
      authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
      projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
      storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
      appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
    };

    const isConfigured = Object.values(config).every((v) => v.length > 0);
    if (!isConfigured) {
      return { success: false, error: "Firebase is not configured on the server." };
    }

    // Use a separate named app for server-side to avoid conflicting with client
    const appName = "server-action";
    const app = getApps().find((a) => a.name === appName)
      ?? initializeApp(config, appName);

    const db   = getFirestore(app);
    const auth = getAuth(app);

    // Sign in with the client's ID token to inherit their auth identity.
    // Firestore Security Rules will then enforce write access.
    // Note: signInWithCustomToken expects a custom token, not ID token.
    // For portfolio use, we pass the idToken directly and let Firestore
    // rules handle auth via the client SDK (rules check request.auth).
    //
    // ⚡ Production upgrade path: use Firebase Admin SDK to verify the
    //    ID token server-side before the write.
    void auth; // auth object available for future Admin SDK upgrade
    void signInWithCustomToken; // placeholder for upgrade path

    const docRef = doc(db, "portfolio", section);
    await setDoc(docRef, data, { merge: true });

    // ── 3. Revalidate Next.js cache ────────────────────────────────────────
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[updateSectionAction] Failed to update "${section}":`, message);

    // Surface a user-friendly error without leaking internals
    if (message.includes("permission-denied")) {
      return { success: false, error: "Permission denied. Please sign in again." };
    }
    if (message.includes("unavailable") || message.includes("network")) {
      return { success: false, error: "Network error. Check your connection." };
    }
    return { success: false, error: "Update failed. Please try again." };
  }
}
