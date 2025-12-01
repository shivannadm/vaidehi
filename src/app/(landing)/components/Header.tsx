"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { id: "how-it-works", title: "How It Works" },
  { id: "pricing", title: "Pricing" },
  { id: "about", title: "About" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`w-full z-30 top-0 sticky transition-shadow ${scrolled ? "shadow-sm bg-white/80 backdrop-blur" : "bg-transparent"}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="/">
            <span className="font-bold text-lg sm:text-xl md:text-2xl text-indigo-600">V<span className="text-black">aidehi</span></span>
          </a>
          <ul className="hidden md:flex items-center gap-6 ml-8">
            <li>
              <a href="#how-it-works" className="text-sm hover:text-indigo-600 transition">
                How it works
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-sm hover:text-indigo-600 transition">
                Pricing
              </a>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href="/login" className="hidden sm:inline-block px-3 sm:px-4 py-2 rounded-md text-sm hover:bg-slate-50 transition">
            Sign in
          </a>
          <a href="/signup" className="px-3 sm:px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition">
            Sign up
          </a>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <a 
              href="#how-it-works" 
              className="block py-2 text-sm hover:text-indigo-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it works
            </a>
            <a 
              href="#pricing" 
              className="block py-2 text-sm hover:text-indigo-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="/login" 
              className="block py-2 text-sm hover:text-indigo-600 transition sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}