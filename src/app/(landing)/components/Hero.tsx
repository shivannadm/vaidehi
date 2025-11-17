"use client";

import TypeRotator from "./TypeRotator";
import HeroMockup from "./HeroMockup";
import dynamic from "next/dynamic";

// lazy-load heavy background
const AnimatedBackground = dynamic(() => import("./AnimatedBackground"), { ssr: false });

export default function Hero() {
  const words = ["Routine", "Trades", "Strategies", "Backtests"];

  return (
    <section id="hero" className="relative overflow-hidden">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left column - Text content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Finally you got here
            </h1>

            <p className="mt-4 text-lg text-slate-700 max-w-xl">
              Let's optimise our{" "}
              <span className="font-semibold text-indigo-600">
                <TypeRotator words={words} interval={1200} />
              </span>
              <span className="sr-only"> — Routine, Trades, Strategies, Backtests</span>
            </p>

            <div className="mt-8 flex gap-4">
              <a 
                href="/signup" 
                className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-all hover:scale-105"
              >
                Get started
              </a>
              <a 
                href="#features" 
                className="inline-flex items-center px-4 py-3 border rounded-md text-sm hover:bg-slate-50 transition-all"
              >
                Learn more
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white" />
                </div>
                <span className="font-medium">1,200+ traders</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★★★★★</span>
                <span className="font-medium">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Right column - Hero mockup */}
          <div className="hidden md:block">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}