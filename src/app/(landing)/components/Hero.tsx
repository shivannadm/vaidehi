"use client";

const TypeRotator = dynamic(() => import("./TypeRotator"), { ssr: false });
import HeroMockup from "./HeroMockup";
import dynamic from "next/dynamic";

// lazy-load heavy background
const AnimatedBackground = dynamic(() => import("./AnimatedBackground"), { ssr: false });

export default function Hero() {
  const words = ["Routine", "Trades", "Strategies", "Backtests"];

  return (
    <section id="hero" className="relative">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto px-7 py-24 md:py-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Finally you got here
            </h1>

            <p className="mt-5 text-3xl font-semibold text-slate-700 max-w-xl">
              It's time to optimize your{" "}
              <span className="font-semibold text-indigo-600">
                <TypeRotator words={words} interval={1200} />
              </span>
            </p>

            <blockquote className="border-l-2 border-cyan-400/50 pl-6 py-6 italic text-slate-500 text-sm md:text-base max-w-lg">
              "All I wanted was my art and the chance to be the creator of my own world, my own reality.
              I wanted the open road and new beginnings every day."
              <footer className="mt-2 not-italic text-slate-500">
                - Charlotte Eriksson
              </footer>
            </blockquote>

            <div className="mt-8 flex gap-4">
              <a
                href="/signup"
                className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-all hover:scale-105"
              >
                Get started
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-4 py-3 border rounded-md text-sm hover:bg-slate-50 transition-all"
              >
                Learn more
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-500"
                    />
                  ))}
                </div>
                <span className="font-medium">1,200+ traders</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★★★★★</span>
                <span className="font-medium">4.9/5</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}