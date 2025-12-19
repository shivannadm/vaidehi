// ====================
// FILE: src/app/(landing)/components/NewsletterSubscription.tsx
// ====================
"use client";

import { useState } from "react";

interface NewsletterSubscriptionProps {
  variant?: "default" | "gradient";
}

export default function NewsletterSubscription({ variant = "default" }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      // Here you would integrate with your email service
      // Examples: SendGrid, Mailchimp, ConvertKit, etc.
      
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace this with your actual API endpoint
      // const response = await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      
      // if (!response.ok) throw new Error('Subscription failed');
      
      // Simulate success
      console.log("Email subscribed:", email);
      
      setStatus("success");
      setMessage("Successfully subscribed! You're now on our list.");
      setEmail("");
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
      
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      console.error("Subscription error:", error);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    }
  };

  if (variant === "gradient") {
    return (
      <div className="bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Enjoyed This Article?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Subscribe to our newsletter for more trading insights and strategies
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            disabled={status === "loading"}
            className="flex-1 px-4 py-3 bg-white rounded-lg text-slate-700 focus:ring-2 focus:ring-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
          <button 
            type="submit"
            disabled={status === "loading"}
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-slate-100 transition-all font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        
        {/* Status Messages */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
            status === "success" 
              ? "bg-green-500/20 text-white border border-green-400/30" 
              : "bg-red-500/20 text-white border border-red-400/30"
          }`}>
            {message}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-slate-600 mb-6">
          Get the latest trading tips and insights delivered to your inbox
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            disabled={status === "loading"}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
          <button 
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        
        {/* Status Messages */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg max-w-md mx-auto ${
            status === "success" 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}