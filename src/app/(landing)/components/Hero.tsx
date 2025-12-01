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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7 py-12 sm:py-16 md:py-20 lg:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight">
              Finally you got here
            </h1>

            <p className="mt-4 sm:mt-5 text-2xl sm:text-2xl md:text-3xl font-semibold text-slate-700 max-w-xl mx-auto lg:mx-0">
              It's time to optimize your{" "}
              <span className="font-semibold text-indigo-600">
                <TypeRotator words={words} interval={1200} />
              </span>
            </p>

            <blockquote className="border-l-2 border-cyan-400/50 pl-4 sm:pl-6 py-4 sm:py-6 italic text-slate-500 text-sm sm:text-base md:text-base max-w-lg mx-auto lg:mx-0 mt-6">
              "All I wanted was my art and the chance to be the creator of my own world, my own reality.
              I wanted the open road and new beginnings every day."
              <footer className="mt-2 not-italic text-slate-500 text-xs sm:text-sm">
                - Charlotte Eriksson
              </footer>
            </blockquote>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-all hover:scale-105 text-sm sm:text-base"
              >
                Get started
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-4 py-3 border rounded-md text-sm hover:bg-slate-50 transition-all"
              >
                Learn more
              </a>
            </div>

            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-500"
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

          <div className="hidden lg:block">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}