"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/context/AuthContext';
import { useCMSStore, CMSState } from '@/store/useCMSStore';
import { doc, setDoc } from 'firebase/firestore';
import { getFirebaseFirestore, getFirebaseStorage } from '@/lib/firebase';
import { triggerRevalidate } from '@/app/actions/revalidate';
import { SectionKey } from '@/types/cms';
import { Pencil, Check, X, Loader2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface EditableProps {
  /** Path to the field in the store, e.g., 'hero.title' */
  path: string;
  /** The data type: 'text' (default), 'textarea', 'image', 'array', or 'file' */
  type?: 'text' | 'textarea' | 'image' | 'array' | 'file';
  /** Original content to render */
  children: React.ReactNode;
  /** Optional custom class for the wrapper */
  className?: string;
  /** Force admin state (optional) */
  isAdmin?: boolean;
  /** Allowed file types (only for type="file") */
  accept?: string;
}

export default function Editable({ 
  path, 
  type = 'text', 
  children, 
  className = "", 
  isAdmin: forcedAdmin,
  accept = ".pdf,image/*"
}: EditableProps) {
  const { isAdmin: authAdmin, adminUser } = useAdmin();
  const isAdmin = forcedAdmin !== undefined ? forcedAdmin : authAdmin;
  const updateField = useCMSStore((state) => state.updateField);
  const sectionKey = path.split('.')[0];
  
  // Get the current value from the store
  const storeValue = useCMSStore((state) => {
    const keys = path.split('.');
    let current: any = state;
    for (const key of keys) {
      if (current && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
    return current;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(storeValue);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(storeValue);
  }, [storeValue]);

  useEffect(() => {
    if (isEditing && inputRef.current && type !== 'file') {
      inputRef.current.focus();
    }
  }, [isEditing, type]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storage = getFirebaseStorage();
    if (!storage) {
      alert("Firebase Storage not configured.");
      return;
    }

    setIsSaving(true);
    try {
      const storageRef = ref(storage, `portfolio/${sectionKey}/${Date.now()}-${file.name}`);
      const metadata = file.type === 'application/pdf' 
        ? { contentDisposition: `attachment; filename="${file.name}"` } 
        : undefined;
      
      // Force a timeout after 15 seconds so the UI doesn't hang forever
      const uploadPromise = uploadBytes(storageRef, file, metadata);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("TIMEOUT")), 15000);
      });
      
      const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
      const downloadURL = await getDownloadURL(snapshot.ref);
      setValue(downloadURL);
    } catch (error: any) {
      console.error("Upload failed:", error);
      if (error.message === "TIMEOUT") {
        alert("Upload timed out! Please check your Firebase Storage Rules and make sure they allow authenticated uploads, or check your internet connection.");
      } else {
        alert("Upload failed: " + (error.message || "Please check console and Firebase Storage Rules."));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!adminUser) {
      alert("You must be logged in to save changes.");
      return;
    }

    const db = getFirebaseFirestore();
    if (!db) {
      alert("Firestore not initialized.");
      return;
    }

    setIsSaving(true);
    
    try {
      const keys = path.split('.');
      const section = keys[0];
      const docRef = doc(db, "portfolio", section);

      let payload: any = {};

      // Case 1: Simple top-level field in a section (e.g., about.resumeLink)
      if (keys.length === 2) {
        payload[keys[1]] = value;
      } 
      // Case 2: Nested field in an array (e.g., projects.items.0.title)
      else {
        // For nested arrays, we need to get the whole array from the store,
        // update it locally, and send the full array to Firestore.
        const currentStore = useCMSStore.getState();
        // Update the field in a copy of the store state
        updateField(path, value); 
        // Get the updated section data
        const updatedSection = useCMSStore.getState()[section as keyof CMSState];
        payload = updatedSection;
      }

      // 1. Direct Client-side write to Firestore
      await setDoc(docRef, payload, { merge: true });
      
      // 2. If it was a simple update, sync the store now
      if (keys.length === 2) {
        updateField(path, value);
      }
      
      // 3. Revalidate the server-rendered page in the background to not block UI
      triggerRevalidate("/").catch(err => console.error("Revalidation failed:", err));
      
      setIsEditing(false); // Close UI on success
    } catch (error: any) {
      console.error("Save failed:", error);
      alert(error?.message || "Failed to save changes. Check your internet connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(storeValue);
    setIsEditing(false);
  };

  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className={`relative group/editable ${className}`}>
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditing(true)}
            className="cursor-pointer relative h-full w-full rounded-sm transition-all duration-300"
          >
            {/* Hover Indicator */}
            <div className="absolute -inset-2 border-2 border-dashed border-cyan-500/0 group-hover/editable:border-cyan-500/40 rounded-lg transition-all duration-300 pointer-events-none z-10" />
            
            {/* Pencil Icon */}
            <div className="absolute -top-3 -right-3 bg-fuchsia-600 text-white p-1 rounded-full opacity-0 group-hover/editable:opacity-100 transition-opacity duration-300 shadow-lg z-20">
              <Pencil size={12} />
            </div>

            {children}
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-[100] w-full min-w-[200px]"
          >
            <div className="bg-[#1a1425]/95 backdrop-blur-xl border border-fuchsia-500/50 rounded-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              {type === 'textarea' ? (
                <textarea
                  ref={inputRef as any}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 min-h-[120px] transition-colors"
                  disabled={isSaving}
                />
              ) : (type === 'file' || type === 'image') ? (
                <div className="space-y-3">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-cyan-500/50 hover:bg-white/5 transition-all cursor-pointer group/upload"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept={type === 'image' ? "image/*" : accept}
                      onChange={handleFileChange}
                    />
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover/upload:scale-110 transition-transform">
                      {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                    </div>
                    <div className="text-center">
                      <p className="text-white text-sm font-semibold">
                        {isSaving ? "Uploading..." : `Click to upload ${type === 'image' ? 'image' : 'file'}`}
                      </p>
                      <p className="text-slate-400 text-[10px] mt-1">{value ? "Currently: " + value.split('/').pop()?.split('?')[0] : "No file uploaded"}</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Or paste a URL here"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-[10px] focus:outline-none focus:border-cyan-400 transition-colors"
                    disabled={isSaving}
                  />
                </div>
              ) : (
                <input
                  ref={inputRef as any}
                  type="text"
                  value={type === 'array' ? (Array.isArray(value) ? value.join(', ') : value) : value}
                  onChange={(e) => {
                    if (type === 'array') {
                      setValue(e.target.value.split(',').map(s => s.trim()));
                    } else {
                      setValue(e.target.value);
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  disabled={isSaving}
                />
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                  disabled={isSaving}
                >
                  <X size={18} />
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all shadow-lg shadow-cyan-500/20"
                  disabled={isSaving || !value}
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  <span>Save</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

