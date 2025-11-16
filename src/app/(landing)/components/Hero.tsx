"use client";

import TypeRotator from "./TypeRotator";
import dynamic from "next/dynamic";

// lazy-load heavy background (placeholder component below is lightweight)
const AnimatedBackground = dynamic(() => import("./AnimatedBackground"), { ssr: false });

export default function Hero() {
  const words = ["Routine", "Trades", "Strategies", "Backtests"];

  return (
    <section id="hero" className="relative overflow-hidden">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Finally you got here
            </h1>

            <p className="mt-4 text-lg text-slate-700 max-w-xl">
              Let’s optimise our{" "}
              <span className="font-semibold text-indigo-600">
                <TypeRotator words={words} interval={1200} />
              </span>
              <span className="sr-only"> — Routine, Trades, Strategies, Backtests</span>
            </p>

            <div className="mt-8 flex gap-4">
              <a href="/signup" className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700">
                Get started
              </a>
              <a href="#features" className="inline-flex items-center px-4 py-3 border rounded-md text-sm hover:bg-slate-50">
                Learn more
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {/* Hero illustration placeholder */}
            <div className="w-full max-w-md aspect-[4/3] bg-gradient-to-tr from-slate-50 to-white rounded-2xl shadow-lg flex items-center justify-center">
              <img src="/images/image.png" alt="App preview" className="w-3/4 h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
