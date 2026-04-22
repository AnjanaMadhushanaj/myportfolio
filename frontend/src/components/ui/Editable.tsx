"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/context/AuthContext';
import { useCMSStore, CMSState } from '@/store/useCMSStore';
import { updateCMSSection } from '@/app/actions/cms';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditableProps {
  /** Path to the field in the store, e.g., 'hero.title' */
  path: string;
  /** The data type: 'text' (default), 'textarea', 'image', or 'array' */
  type?: 'text' | 'textarea' | 'image' | 'array';
  /** Original content to render */
  children: React.ReactNode;
  /** Optional custom class for the wrapper */
  className?: string;
  /** Force admin state (optional) */
  isAdmin?: boolean;
}

export default function Editable({ path, type = 'text', children, className = "" }: EditableProps) {
  const { isAdmin } = useAdmin();
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
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(storeValue);
  }, [storeValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    // 1. Instant Optimistic Update
    updateField(path, value);
    setIsEditing(false); // Close UI immediately!

    // 2. Background Sync with Firestore
    try {
      const sectionData = useCMSStore.getState()[sectionKey as keyof CMSState];
      await updateCMSSection(sectionKey, sectionData);
    } catch (error) {
      console.error("Background sync failed:", error);
      // Optional: Revert store value or show toast here if sync fails
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
            className="cursor-pointer relative rounded-sm transition-all duration-300"
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
            className="relative z-[100] w-full"
          >
            <div className="bg-[#1a1425]/90 backdrop-blur-xl border border-fuchsia-500/50 rounded-xl p-4 shadow-[0_0_30px_rgba(217,70,239,0.2)]">
              {type === 'textarea' ? (
                <textarea
                  ref={inputRef as any}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 min-h-[120px] transition-colors"
                />
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
                  disabled={isSaving}
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
