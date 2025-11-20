// src/app/dashboard/components/modals/SettingsModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { updatePassword } from "@/lib/supabase/helpers";
import type { Theme } from "@/types/database";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

export default function SettingsModal({ isOpen, onClose, theme }: SettingsModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password must contain at least one special character");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    // Validate new password strength
    if (!validatePassword(newPassword)) {
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await updatePassword(currentPassword, newPassword);

      if (updateError) {
        setError(updateError.message || "Failed to update password");
        return;
      }

      // Success!
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Password update error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`rounded-xl shadow-2xl w-full max-w-md mx-4 ${isLight ? 'bg-white' : 'bg-slate-900'
        }`}>

        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isLight ? 'border-slate-200' : 'border-slate-700'
          }`}>
          <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'
            }`}>Settings</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-700'
              }`}
            disabled={loading}
          >
            <X className={`w-5 h-5 ${isLight ? 'text-slate-500' : 'text-slate-400'
              }`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className={`text-lg font-semibold mb-4 ${isLight ? 'text-slate-900' : 'text-white'
            }`}>Change Password</h3>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                Password updated successfully!
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-4 border rounded-lg ${isLight
                ? 'bg-red-50 border-red-200'
                : 'bg-red-900/20 border-red-800'
              }`}>
              <span className={`text-sm ${isLight ? 'text-red-700' : 'text-red-400'
                }`}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Current Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 ${isLight
                      ? 'border-slate-300 bg-white text-slate-900'
                      : 'border-slate-600 bg-slate-700 text-white'
                    }`}
                  placeholder="Enter current password"
                  required
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  disabled={loading || success}
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 ${isLight
                      ? 'border-slate-300 bg-white text-slate-900'
                      : 'border-slate-600 bg-slate-700 text-white'
                    }`}
                  placeholder="Enter new password"
                  required
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  disabled={loading || success}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 ${isLight
                      ? 'border-slate-300 bg-white text-slate-900'
                      : 'border-slate-600 bg-slate-700 text-white'
                    }`}
                  placeholder="Confirm new password"
                  required
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  disabled={loading || success}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className={`p-4 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-slate-700/50'
              }`}>
              <p className={`text-xs font-semibold mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>Password Requirements:</p>
              <ul className={`text-xs space-y-1 ${isLight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
                  • At least 8 characters
                </li>
                <li className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? "text-green-600" : ""}>
                  • Include uppercase and lowercase letters
                </li>
                <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
                  • Include at least one number
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-600" : ""}>
                  • Include at least one special character
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-2 border rounded-lg transition font-medium ${isLight
                    ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                disabled={loading || success}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}