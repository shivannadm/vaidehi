"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthCodeErrorPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
        {/* Error Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-slate-600">
            There was a problem signing you in
          </p>
        </div>

        {/* Error Details */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              <span className="font-semibold">Error:</span> {error}
            </p>
          </div>
        )}

        {/* Troubleshooting Steps */}
        <div className="mb-6 space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Common solutions:</h2>
          <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
            <li>The authentication link may have expired</li>
            <li>You may have already used this link</li>
            <li>Try clearing your browser cache and cookies</li>
            <li>Make sure pop-ups are enabled for this site</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/signup"
            className="w-full block px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold text-center hover:from-indigo-700 hover:to-blue-700 transition-all hover:scale-[1.02] shadow-lg"
          >
            Try Signing Up Again
          </Link>
          
          <Link
            href="/login"
            className="w-full block px-4 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-semibold text-center hover:bg-slate-50 hover:border-slate-300 transition-all hover:scale-[1.02]"
          >
            Go to Login
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-6 text-xs text-center text-slate-500">
          Still having trouble?{" "}
          <a href="mailto:support@example.com" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}