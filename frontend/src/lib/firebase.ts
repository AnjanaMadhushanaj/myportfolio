import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => value.length > 0);

// Helper to get or initialize the app
const getFirebaseApp = () => {
    if (typeof window === "undefined") return null;
    if (!hasFirebaseConfig) return null;
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
};

// Client-only lazy init to avoid build-time Firebase evaluation during prerender.
export const getFirebaseAuth = () => {
    const app = getFirebaseApp();
    return app ? getAuth(app) : null;
};

export const getFirebaseStorage = () => {
    const app = getFirebaseApp();
    return app ? getStorage(app) : null;
};

export const getFirebaseFirestore = () => {
    const app = getFirebaseApp();
    return app ? getFirestore(app) : null;
};
