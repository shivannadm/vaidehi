"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: annual ? 0 : 0,
      period: "Forever free",
      description: "Perfect for new traders getting started",
      features: [
        "Up to 50 trades/month",
        "Basic analytics dashboard",
        "Daily routine tracker",
        "7-day trade history",
        "Mobile app access"
      ],
      cta: "Start free",
      popular: false
    },
    {
      name: "Pro",
      price: annual ? 12 : 15,
      period: annual ? "/month (billed annually)" : "/month",
      description: "For serious traders committed to growth",
      features: [
        "Unlimited trades",
        "Advanced analytics & insights",
        "Unlimited routine templates",
        "Lifetime trade history",
        "Strategy backtesting",
        "Export data (CSV, PDF)",
        "Priority support",
        "Custom tags & filters"
      ],
      cta: "Start 14-day trial",
      popular: true,
      savings: annual ? "Save $36/year" : null
    },
    {
      name: "Team",
      price: annual ? 35 : 40,
      period: annual ? "/month (billed annually)" : "/month",
      description: "For trading groups and prop firms",
      features: [
        "Everything in Pro",
        "Up to 5 team members",
        "Shared trade reviews",
        "Team performance metrics",
        "Admin controls & permissions",
        "Dedicated account manager",
        "Custom integrations",
        "API access"
      ],
      cta: "Contact sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            Simple, transparent <span className="text-indigo-600">pricing</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 px-4">
            Start free, upgrade when you're ready. No hidden fees, cancel anytime.
          </p>

          <div className="inline-flex items-center gap-2 sm:gap-3 bg-slate-100 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                !annual ? "bg-white shadow-sm text-slate-900" : "text-slate-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                annual ? "bg-white shadow-sm text-slate-900" : "text-slate-600"
              }`}
            >
              Annual
              <span className="ml-1 sm:ml-2 text-xs text-green-600 font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 sm:p-8 relative ${
                plan.popular
                  ? "bg-gradient-to-b from-indigo-50 to-white border-2 border-indigo-600 shadow-xl md:scale-105"
                  : "bg-white border border-slate-200 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                  Most popular
                </div>
              )}

              <div className="mb-5 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-sm sm:text-base text-slate-600">{plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="mt-2 text-xs sm:text-sm text-green-600 font-medium">{plan.savings}</div>
                )}
              </div>

              <a
                href="/signup"
                className={`block w-full text-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all mb-5 sm:mb-6 text-sm sm:text-base ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:scale-105"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {plan.cta}
              </a>

              <ul className="space-y-2.5 sm:space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center px-4">
          <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">All plans include a 14-day money-back guarantee</p>
          <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium text-xs sm:text-sm">
            Compare all features →
          </a>
        </div>
      </div>
    </section>
  );
}