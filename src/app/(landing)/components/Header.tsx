"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mainNavItems = [
    { label: 'Docs', href: '/docs' },
    { label: 'P&L Report', href: '/pnl-report' },
    { label: 'TODO', href: '/todo' },
    { label: 'Routine', href: '/routine' },
    { label: 'Trading', href: '/trading' }
  ];

  return (
    <header 
      className={`w-full z-50 top-0 sticky transition-all duration-300 ${
        scrolled ? "shadow-md bg-white/95 backdrop-blur-sm" : "bg-white"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left Side */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 transition-transform group-hover:scale-110 overflow-hidden rounded-lg">
                <img
                  src="/assets/logo/logo.png"
                  alt="Vaidehi Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-xl">
                <span className="text-indigo-600">V</span>
                <span className="text-slate-900">aidehi</span>
              </span>
            </a>
          </div>

          {/* Main Navigation - Center (Hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <ul className="flex items-center space-x-1">
              {mainNavItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Buttons - Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              Sign up
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg">
            <div className="px-4 py-4 space-y-1">
              {mainNavItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 space-y-2 border-t border-slate-200 mt-4">
                <a
                  href="/login"
                  className="block px-4 py-3 text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </a>
                <a
                  href="/signup"
                  className="block px-4 py-3 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;