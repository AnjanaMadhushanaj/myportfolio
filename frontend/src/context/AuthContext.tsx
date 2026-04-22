"use client";

/**
 * AuthContext.tsx
 *
 * Responsibilities (Client-only):
 *  1. Subscribe to Firebase onAuthStateChanged once the component mounts.
 *  2. Expose `isAdmin` (boolean) and `adminUser` (Firebase User | null)
 *     via the `useAdmin()` hook so any Client Component in the tree can
 *     consume it without prop-drilling.
 *  3. Keep the provider as light as possible — NO data-fetching lives here.
 *     Data fetching remains in Server Components.
 *
 * Architecture note:
 *  This provider is intentionally placed INSIDE <body> in layout.tsx.
 *  That means the layout (Server Component) itself is never "use client",
 *  preserving full RSC benefits for the shell.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AdminContextValue {
  /** True when a Firebase user is signed-in (admin mode active). */
  isAdmin: boolean;
  /** The raw Firebase User object, or null when signed-out. */
  adminUser: User | null;
  /** True during the initial auth state resolution (avoids flash of admin UI). */
  isAuthLoading: boolean;
  /** Programmatically sign-out the admin user. */
  signOut: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  adminUser: null,
  isAuthLoading: true,
  signOut: async () => {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AdminOverlayProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // getFirebaseAuth() returns null during SSR or when env vars are missing.
    // This guard keeps the provider safe in both environments.
    const auth = getFirebaseAuth();
    if (!auth) {
      setIsAuthLoading(false);
      return;
    }

    // Subscribe — Firebase calls this immediately with the cached token,
    // so the loading state resolves on the very first render cycle.
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAdminUser(user);
      setIsAuthLoading(false);
    });

    return unsubscribe; // Clean-up on unmount.
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    try {
      const { signOut: firebaseSignOut } = await import("firebase/auth");
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("[AdminOverlayProvider] Sign-out failed:", err);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAdmin: adminUser !== null,
        adminUser,
        isAuthLoading,
        signOut,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useAdmin()
 *
 * Consume this hook inside any "use client" component to access admin state.
 *
 * @example
 * const { isAdmin, signOut } = useAdmin();
 */
export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (ctx === undefined) {
    throw new Error(
      "[useAdmin] must be used within an <AdminOverlayProvider>. " +
        "Make sure AdminOverlayProvider wraps your app in layout.tsx."
    );
  }
  return ctx;
}
