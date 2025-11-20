// src/app/dashboard/components/modals/ProfileModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import { getProfile, updateProfile, uploadAvatar } from "@/lib/supabase/helpers";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const loadProfile = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await getProfile(user.id);

      if (error) {
        console.error("Error loading profile:", error);
        return;
      }

      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url || "");
      }
    } catch (error) {
      console.error("Error in loadProfile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      let newAvatarUrl = avatarUrl;

      // Upload avatar if changed
      if (avatarFile) {
        const { url, error } = await uploadAvatar(user.id, avatarFile);
        if (error) {
          console.error("Error uploading avatar:", error);
          alert("Failed to upload avatar");
          return;
        }
        if (url) {
          newAvatarUrl = url;
        }
      }

      // Update profile
      const { data, error } = await updateProfile(user.id, {
        full_name: fullName,
        avatar_url: newAvatarUrl
      });

      if (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile");
        return;
      }

      // Success!
      alert("Profile updated successfully!");
      onClose();
      
      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            disabled={saving}
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Avatar Upload */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {avatarPreview || avatarUrl ? (
                    <img
                      src={avatarPreview || avatarUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {getInitials(fullName)}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Click camera icon to upload (max 2MB)
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.id || ""}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-slate-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}