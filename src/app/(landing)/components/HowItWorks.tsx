"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

export default function HowItWorks() {
  const features = [
    {
      icon: "📝",
      title: "Log Every Trade",
      description: "Capture trades in seconds with smart templates. Track entry, exit, P&L, emotions, and market conditions all in one place."
    },
    {
      icon: "📊",
      title: "Analyze Performance",
      description: "Real-time analytics reveal your edge. See win rates, profit factors, and identify patterns that make or break your results."
    },
    {
      icon: "🎯",
      title: "Build Your Routine",
      description: "Create pre-market and post-market checklists. Build the discipline that separates consistent winners from emotional traders."
    },
    {
      icon: "🔄",
      title: "Optimize Strategies",
      description: "Test and refine your approach with historical data. Track what works, eliminate what doesn't, and compound your edge."
    },
    {
      icon: "📈",
      title: "Track Growth",
      description: "Watch your progress over time with detailed equity curves, drawdown analysis, and performance metrics that matter."
    },
    {
      icon: "🧠",
      title: "Master Psychology",
      description: "Journal your mindset before and after trades. Identify emotional patterns and develop the mental game of a pro."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 md:py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            Everything you need to <span className="text-indigo-600">trade like a pro</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 px-4">
            Transform scattered notes and gut feelings into a structured system that actually improves your trading.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-indigo-200 group"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <a
            href="/signup"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 text-sm sm:text-base"
          >
            Start your journey
          </a>
        </div>
      </div>
    </section>
  );
}