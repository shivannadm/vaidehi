"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to transform your trading?
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Join 1,200+ traders who've already taken control of their performance. Start your free 14-day trial today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/signup"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 font-semibold text-lg"
          >
            Start free trial
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center px-8 py-4 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition-all font-semibold text-lg"
          >
            Watch demo
          </a>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          No credit card required • Cancel anytime • 14-day money-back guarantee
        </p>
      </div>
    </section>
  );
}