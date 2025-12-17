// ====================
// FILE: src/app/(landing)/faq/page.tsx
// ====================
"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ChevronDown } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I get started with Vaidehi?",
          a: "Simply sign up for a free account, complete your profile, and start logging your trades. Our intuitive interface makes it easy to get started in minutes. You can also check our documentation for detailed guides."
        },
        {
          q: "Is there a free trial?",
          a: "Yes! We offer a 7-day free trial of our Pro plan with no credit card required."
        },
        {
          q: "Do I need to install any software?",
          a: "No, Vaidehi is completely web-based. Access it from any browser on desktop, tablet, or mobile. We also have mobile apps for iOS and Android for on-the-go tracking."
        }
      ]
    },
    {
      category: "Trading Journal",
      questions: [
        {
          q: "What information can I log for each trade?",
          a: "You can log entry/exit prices, position size, strategy used, market conditions, emotions, screenshots, notes, and much more. Our flexible system adapts to your trading style."
        },
        {
          q: "Can I import trades from my broker?",
          a: "No! Currently we working with brokers to enable direct import. Meanwhile, you can easily import trades using CSV files from most brokers."
        },
        {
          q: "How secure is my trading data?",
          a: "Firstly, we are not collecting any high valued data for transperency. Your data is stored in secure data centers. We never share your trading data with third parties. You can also enable two-factor authentication for extra security."
        }
      ]
    },
    {
      category: "Analytics & Reporting",
      questions: [
        {
          q: "What analytics does Vaidehi provide?",
          a: "We provide comprehensive analytics including win rate, profit factor, average win/loss, drawdown analysis, equity curves, performance by strategy, time of day analysis, and much more."
        },
        {
          q: "Can I export my data?",
          a: "Yes, Users can export their data in CSV and PDF formats for tax reporting, external analysis, or backup purposes."
        },
        {
          q: "How often are analytics updated?",
          a: "Analytics are updated in real-time as you log trades. You'll always have access to the latest insights about your performance."
        }
      ]
    },
    {
      category: "Pricing & Billing",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, Mastercard) through our secure payment processor Stripe. We also offer annual billing for a 20% discount."
        },
        {
          q: "Can I cancel anytime?",
          a: "Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees or penalties."
        },
        {
          q: "Do you offer refunds?",
          a: "Yes, we offer a 7-day money-back guarantee for new subscriptions. If you're not satisfied, contact us for a full refund."
        }
      ]
    },
    {
      category: "Features & Support",
      questions: [
        {
          q: "Can I use Vaidehi for multiple accounts?",
          a: "Yes, It will act as a combined journal."
        },
        {
          q: "Do you offer customer support?",
          a: "Yes!  We typically respond within 24 hours on weekdays."
        },
        {
          q: "Can I use Vaidehi for different markets?",
          a: "Absolutely! Vaidehi works for stocks, forex, crypto, options, futures, and any other tradeable instrument. Our system is flexible enough to handle any trading style."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-indigo-50 to-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-600">
              Find answers to common questions about Vaidehi
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div
                      key={faqIndex}
                      className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? -1 : globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-slate-900 pr-8">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4 text-slate-600">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions Section */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-slate-600 mb-8">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold"
              >
                Contact Support
              </a>
              <a
                href="/docs"
                className="inline-block px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}