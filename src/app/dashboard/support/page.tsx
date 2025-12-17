// ============================================
// FILE: src/app/dashboard/support/page.tsx
// âœ… FIXED: Theme support + Supabase integration
// ============================================

"use client";
import { useState, useEffect } from "react";
import { MessageCircle, HelpCircle, Send, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { submitFeedback, submitHelpRequest } from "@/lib/supabase/support-helpers";
import type { FeedbackCategory, HelpPriority } from "@/types/database";

export default function SupportPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState("feedback");
  
  // User info
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  
  // Feedback state
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategory>("general");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  // Help state
  const [helpPriority, setHelpPriority] = useState<HelpPriority>("medium");
  const [helpSubject, setHelpSubject] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [helpSubmitting, setHelpSubmitting] = useState(false);
  const [helpSuccess, setHelpSuccess] = useState(false);
  const [helpError, setHelpError] = useState("");

  // Theme detection
  useEffect(() => {
    setMounted(true);
    
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    return () => observer.disconnect();
  }, []);

  // Get user info
  useEffect(() => {
    if (!mounted) return;

    const fetchUserInfo = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email || "");
        
        // Get user's full name from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        
        setUserName(profile?.full_name || user.email?.split('@')[0] || "User");
      }
    };

    fetchUserInfo();

    // Check URL for tab parameter
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'help') setActiveTab('help');
  }, [mounted]);

  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage.trim() || !userId) return;

    setFeedbackSubmitting(true);
    setFeedbackError("");

    try {
      const { error } = await submitFeedback({
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        category: feedbackCategory,
        message: feedbackMessage,
      });

      if (error) throw error;

      setFeedbackSuccess(true);
      setFeedbackMessage("");
      setFeedbackCategory("general");

      setTimeout(() => setFeedbackSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedbackError("Failed to submit feedback. Please try again.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const handleHelpSubmit = async () => {
    if (!helpSubject.trim() || !helpMessage.trim() || !userId) return;

    setHelpSubmitting(true);
    setHelpError("");

    try {
      const { error } = await submitHelpRequest({
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        priority: helpPriority,
        subject: helpSubject,
        message: helpMessage,
      });

      if (error) throw error;

      setHelpSuccess(true);
      setHelpSubject("");
      setHelpMessage("");
      setHelpPriority("medium");

      setTimeout(() => setHelpSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting help request:", error);
      setHelpError("Failed to submit help request. Please try again.");
    } finally {
      setHelpSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLight = !isDark;

  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-50' : 'bg-slate-900'} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Support Center
          </h1>
          <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            We're here to help. Share your feedback or get assistance.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
              activeTab === 'feedback'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                : isLight 
                  ? 'bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-200' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-2 border-slate-700'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Send Feedback</span>
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
              activeTab === 'help'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105'
                : isLight 
                  ? 'bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-200' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-2 border-slate-700'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span>Get Help</span>
          </button>
        </div>

        {/* Content */}
        <div className={`${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'} border-2 rounded-2xl p-8 shadow-xl`}>
          
          {activeTab === 'feedback' ? (
            // Feedback Form
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Share Your Feedback
                  </h2>
                  <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Help us improve by sharing your thoughts
                  </p>
                </div>
              </div>

              {feedbackSuccess && (
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-green-800 font-semibold">Feedback submitted successfully! Thank you.</p>
                </div>
              )}

              {feedbackError && (
                <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4">
                  <p className="text-red-800 font-semibold">{feedbackError}</p>
                </div>
              )}

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Category
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value as FeedbackCategory)}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                >
                  <option value="general">General Feedback</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="improvement">Improvement Suggestion</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Your Feedback
                </label>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Tell us what you think..."
                  rows={8}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition`}
                />
              </div>

              <div className={`${isLight ? 'bg-indigo-50 border-indigo-200' : 'bg-indigo-900/20 border-indigo-700'} border-2 rounded-lg p-4`}>
                <p className={`text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  💡 Your feedback helps us improve Vaidehi. We read every submission carefully and use it to make the platform better for everyone.
                </p>
              </div>

              <button
                onClick={handleFeedbackSubmit}
                disabled={feedbackSubmitting || !feedbackMessage.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {feedbackSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            // Help Form
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Get Help
                  </h2>
                  <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    We'll respond within 48 hours
                  </p>
                </div>
              </div>

              {helpSuccess && (
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <p className="text-green-800 font-semibold">Help request submitted! We'll get back to you soon.</p>
                </div>
              )}

              {helpError && (
                <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4">
                  <p className="text-red-800 font-semibold">{helpError}</p>
                </div>
              )}

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Priority
                </label>
                <select
                  value={helpPriority}
                  onChange={(e) => setHelpPriority(e.target.value as HelpPriority)}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                >
                  <option value="low">Low - General Question</option>
                  <option value="medium">Medium - Need Assistance</option>
                  <option value="high">High - Urgent Issue</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Subject
                </label>
                <input
                  type="text"
                  value={helpSubject}
                  onChange={(e) => setHelpSubject(e.target.value)}
                  placeholder="What do you need help with?"
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Description
                </label>
                <textarea
                  value={helpMessage}
                  onChange={(e) => setHelpMessage(e.target.value)}
                  placeholder="Describe your issue or question in detail..."
                  rows={8}
                  className={`w-full px-4 py-3 rounded-lg border-2 ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' : 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition`}
                />
              </div>

              <div className={`${isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-700'} border-2 rounded-lg p-4`}>
                <p className={`text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  ⏱️ We typically respond within 24 hours. For urgent issues, we'll prioritize your request.
                </p>
              </div>

              <button
                onClick={handleHelpSubmit}
                disabled={helpSubmitting || !helpSubject.trim() || !helpMessage.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {helpSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Help Request</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}