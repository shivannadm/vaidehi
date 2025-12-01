"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

export default function FinalCTA() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-indigo-200 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-200 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
          Ready to transform your trading?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          Join 1,200+ traders who've already taken control of their performance. Start your free 14-day trial today.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4">
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 font-semibold text-base sm:text-lg"
          >
            Start free trial
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-all font-semibold text-base sm:text-lg"
          >
            Watch demo
          </a>
        </div>

        <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-500 px-4">
          No credit card required • Cancel anytime • 14-day money-back guarantee
        </p>
      </div>
    </section>
  );
}