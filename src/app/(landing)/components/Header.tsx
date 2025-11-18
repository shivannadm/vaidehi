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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`w-full z-30 top-0 sticky transition-shadow ${scrolled ? "shadow-sm bg-white/80 backdrop-blur" : "bg-transparent"}`}>
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/">
            <span className="font-bold text-lg text-indigo-600 md:text-2xl">V<span className="text-black">aidehi</span></span>
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

        <div className="flex items-center gap-3">
          <button className="hidden md:inline-block px-4 py-2 rounded-md text-sm hover:bg-slate-50 transition">Sign in</button>
          <a href="/signup" className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition">
            Sign up
          </a>
        </div>
      </nav>
    </header>
  );
}