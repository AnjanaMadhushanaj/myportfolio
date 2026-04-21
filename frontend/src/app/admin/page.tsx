"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

export default function AdminLogin() {
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]       = useState("");
    const [loading, setLoading]   = useState(false);
    const router                  = useRouter();

    const getErrorMessage = (code: string): string => {
        switch (code) {
            case "auth/user-not-found":        return "No account found with this email address.";
            case "auth/wrong-password":        return "Incorrect password. Please try again.";
            case "auth/invalid-credential":    return "Invalid credentials. Check your email and password.";
            case "auth/invalid-email":         return "The email address format is invalid.";
            case "auth/too-many-requests":     return "Too many failed attempts. Account temporarily locked.";
            case "auth/user-disabled":         return "This account has been disabled.";
            case "auth/network-request-failed":return "Network error. Check your internet connection.";
            case "auth/api-key-not-valid":     return "Firebase API key is invalid. Check your .env.local file.";
            default:                           return "Login failed. Please try again.";
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const auth = getFirebaseAuth();
            if (!auth) {
                setError("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.");
                setLoading(false);
                return;
            }

            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to portfolio homepage — admin mode activates automatically via Firebase auth
            router.push("/");
        } catch (err: any) {
            setError(getErrorMessage(err.code));
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0514] p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500">
                        AJ Admin Portal
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">Authorized Access Only</p>
                </div>

                {/* Login form */}
                <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-slate-300 text-sm mb-2">Email Address</label>
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                placeholder="admin@example.com" required
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm mb-2">Password</label>
                            <input
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                                placeholder="••••••••" required
                            />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-linear-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center"
                        >
                            {loading
                                ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : "Secure Login"
                            }
                        </button>
                </form>
            </div>
        </div>
    );
}