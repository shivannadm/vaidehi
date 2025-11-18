"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const router = useRouter();
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setMessage("Password updated successfully! Redirecting...");
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Reset your password
        </h1>
        <p className="text-slate-600">
          Enter your new password below
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleResetPassword} className="space-y-4">
        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-slate-500">Must be at least 6 characters</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <div className="space-y-2">
            <div className="flex gap-1">
              <div
                className={`h-1 flex-1 rounded-full transition-colors ${
                  password.length >= 6 ? "bg-yellow-400" : "bg-slate-200"
                }`}
              />
              <div
                className={`h-1 flex-1 rounded-full transition-colors ${
                  password.length >= 8 ? "bg-yellow-400" : "bg-slate-200"
                }`}
              />
              <div
                className={`h-1 flex-1 rounded-full transition-colors ${
                  password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)
                    ? "bg-green-500"
                    : "bg-slate-200"
                }`}
              />
            </div>
            <p className="text-xs text-slate-500">
              {password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)
                ? "Strong password"
                : password.length >= 8
                ? "Medium strength"
                : "Weak password"}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{message}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? "Updating password..." : "Reset password"}
        </button>
      </form>
    </div>
  );
}