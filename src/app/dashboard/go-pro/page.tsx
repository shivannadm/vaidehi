"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import {
  Heart,
  Coffee,
  Sparkles,
  Database,
  CheckCircle,
  Gift,
  Rocket,
  Star,
  TrendingUp,
  IndianRupee,
  Edit3,
  X,
  Trophy,
  Award,
  Users,
  Zap
} from "lucide-react";
import { getUserContributions, getUserBadge, formatIndianRupees } from "@/lib/supabase/contribution-helpers";

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function GoProPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(299);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Contribution modal
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [contributorName, setContributorName] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");
  const [contributorMessage, setContributorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // User data
  const [userId, setUserId] = useState<string | null>(null);
  const [userTotalContributed, setUserTotalContributed] = useState(0);
  const [userBadge, setUserBadge] = useState<any>(null);

  // Success state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAmount, setSuccessAmount] = useState(0);

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

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setContributorEmail(user.email || "");

        // Get user's name from profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile?.full_name) {
          setContributorName(profile.full_name);
        }

        // Get user's total contributions
        const { data: contributions } = await getUserContributions(user.id);
        if (contributions) {
          const total = contributions.reduce((sum, c) => sum + c.amount, 0);
          setUserTotalContributed(total);

          const badge = getUserBadge(total);
          setUserBadge(badge);
        }
      }
    };

    if (mounted) {
      loadUserData();
    }
  }, [mounted]);

  const handleCustomContribute = () => {
    const amount = parseInt(customAmount);
    if (amount && amount > 0) {
      setSelectedAmount(amount);
      setShowCustomInput(false);
    } else {
      alert("Please enter a valid amount");
    }
  };

  const openContributionModal = () => {
    setShowContributionModal(true);
  };

  const closeContributionModal = () => {
    setShowContributionModal(false);
    setContributorMessage("");
  };

  const handleContribute = async () => {
    if (!contributorName.trim() || !contributorEmail.trim()) {
      alert("Please enter your name and email");
      return;
    }

    const finalAmount = showCustomInput ? parseInt(customAmount) : selectedAmount;

    if (!finalAmount || finalAmount < 1) {
      alert("Please select or enter a valid amount");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create Razorpay order
      const orderResponse = await fetch("/api/contributions/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          currency: "INR",
          name: contributorName,
          email: contributorEmail
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Vaidehi",
        description: "Support Vaidehi Development",
        order_id: orderData.order_id,
        prefill: {
          name: contributorName,
          email: contributorEmail
        },
        theme: {
          color: isDark ? "#EC4899" : "#F97316"
        },
        handler: async function (response: any) {
          // Step 3: Verify payment
          try {
            const verifyResponse = await fetch("/api/contributions/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: finalAmount,
                user_id: userId,
                user_name: contributorName,
                user_email: contributorEmail,
                message: contributorMessage
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setSuccessAmount(finalAmount);
              setShowSuccess(true);
              closeContributionModal();

              // Refresh user contributions
              if (userId) {
                const { data: contributions } = await getUserContributions(userId);
                if (contributions) {
                  const total = contributions.reduce((sum, c) => sum + c.amount, 0);
                  setUserTotalContributed(total);
                  setUserBadge(getUserBadge(total));
                }
              }
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      setIsProcessing(false);

    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLight = !isDark;

  const currentLimits = [
    { label: "Tasks", limit: "Unlimited", icon: CheckCircle },
    { label: "Projects", limit: "Unlimited", icon: CheckCircle },
    { label: "Notes", limit: "Unlimited", icon: CheckCircle },
    { label: "Trading Logs", limit: "Unlimited", icon: CheckCircle },
    { label: "Storage", limit: "100MB", icon: Database },
    { label: "File Uploads", limit: "10MB per file", icon: Database }
  ];

  const futureProFeatures = [
    "Unlimited cloud storage",
    "Advanced analytics & insights",
    "AI-powered suggestions",
    "Export data in multiple formats",
    "Custom themes & personalization",
    "Collaborative workspaces",
    "API access for integrations"
  ];

  const contributionAmounts = [99, 199, 299, 499, 999];

  return (
    <>
      {/* Load Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className={`min-h-screen relative overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-slate-900'}`}>
        {/* Gradient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${isLight ? 'bg-gradient-to-br from-indigo-400 to-purple-500' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`}
            style={{ transform: 'translate(-30%, -30%)' }} />
          <div className={`absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 ${isLight ? 'bg-gradient-to-br from-pink-400 to-orange-500' : 'bg-gradient-to-br from-pink-600 to-orange-700'}`}
            style={{ transform: 'translate(30%, -20%)' }} />
          <div className={`absolute bottom-0 left-1/3 w-[550px] h-[550px] rounded-full blur-3xl opacity-20 ${isLight ? 'bg-gradient-to-br from-cyan-400 to-blue-500' : 'bg-gradient-to-br from-cyan-600 to-blue-700'}`}
            style={{ transform: 'translate(-20%, 30%)' }} />
        </div>

        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">

            {/* User Badge (if exists) */}
            {userBadge && (
              <div className={`mb-8 p-6 rounded-2xl border-2 ${isLight ? 'bg-white/80 backdrop-blur-sm border-orange-200' : 'bg-slate-800/50 backdrop-blur-sm border-orange-500/30'} shadow-2xl`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${userBadge.color} flex items-center justify-center text-3xl shadow-lg`}>
                      {userBadge.icon}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {userBadge.name}
                      </h3>
                      <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {userBadge.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>
                      {formatIndianRupees(userTotalContributed)}
                    </p>
                    <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Total Contributed
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl shadow-purple-500/30 animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 ${isLight ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent' : 'text-white'}`}>
                Your Journey with Vaidehi
              </h1>
              <p className={`text-lg sm:text-xl ${isLight ? 'text-slate-700' : 'text-slate-300'} max-w-3xl mx-auto leading-relaxed`}>
                We believe in building mindfully. As we grow together, we're committed to keeping Vaidehi accessible, sustainable, and always improving.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">

              {/* Current Features */}
              <div className={`${isLight ? 'bg-white/80 backdrop-blur-sm border-slate-200' : 'bg-slate-800/50 backdrop-blur-sm border-slate-700'} border rounded-3xl p-8 shadow-2xl`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-2xl ${isLight ? 'bg-green-100' : 'bg-green-900/30'}`}>
                    <CheckCircle className={`w-6 h-6 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      What You Have Now
                    </h2>
                    <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Free tier features
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {currentLimits.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-xl ${isLight ? 'bg-slate-50' : 'bg-slate-700/30'} border ${isLight ? 'border-slate-200' : 'border-slate-600/30'}`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
                        <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          {item.label}
                        </span>
                      </div>
                      <span className={`text-sm font-semibold ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>
                        {item.limit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={`mt-6 p-4 rounded-xl ${isLight ? 'bg-green-50 border-green-200' : 'bg-green-900/20 border-green-500/30'} border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className={`w-5 h-5 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
                    <span className={`font-semibold ${isLight ? 'text-green-800' : 'text-green-200'}`}>
                      You have full access!
                    </span>
                  </div>
                  <p className={`text-sm ${isLight ? 'text-green-700' : 'text-green-200'} leading-relaxed`}>
                    You're currently enjoying our free tier with generous limits!, don't worry about limits for now. You got everything you need to start building.
                  </p>
                </div>
              </div>

              {/* Future Pro Features */}
              <div className={`${isLight ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200' : 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/30'} border rounded-3xl p-8 shadow-2xl`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-2xl ${isLight ? 'bg-indigo-100' : 'bg-indigo-900/50'}`}>
                    <Rocket className={`w-6 h-6 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Coming Soon: Pro Plans
                    </h2>
                    <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Future premium features
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {futureProFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-xl ${isLight ? 'bg-white/60' : 'bg-slate-800/30'}`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full ${isLight ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-indigo-400 to-purple-400'} flex items-center justify-center`}>
                        <Star className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={`p-5 rounded-xl ${isLight ? 'bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-300' : 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/40'} border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`w-5 h-5 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
                    <span className={`font-semibold ${isLight ? 'text-indigo-900' : 'text-indigo-300'}`}>
                      When Will This Launch?
                    </span>
                  </div>
                  <p className={`text-sm ${isLight ? 'text-indigo-700' : 'text-indigo-300'} leading-relaxed`}>
                    We're building thoughtfully and listening to your feedback. Pro plans will launch when database limits become necessary—ensuring sustainability while keeping the core free for everyone.
                  </p>
                </div>
              </div>
            </div>

            {/* Contribution Section */}
            <div className={`${isLight ? 'bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200' : 'bg-gradient-to-br from-orange-900/20 to-pink-900/20 border-orange-500/30'} border rounded-3xl p-8 sm:p-10 shadow-2xl`}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-orange-500/30">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Support Vaidehi's Journey
                </h2>
                <p className={`text-lg ${isLight ? 'text-slate-700' : 'text-slate-300'} max-w-2xl mx-auto`}>
                  Love what we're building? Your contribution helps us maintain servers, develop new features, and keep Vaidehi free for everyone. Every bit counts!
                </p>
              </div>

              {/* Contribution Amounts */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {contributionAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setShowCustomInput(false);
                    }}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 ${selectedAmount === amount && !showCustomInput
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white scale-105 shadow-orange-500/20'
                        : isLight
                          ? 'bg-white text-slate-700 hover:bg-orange-50 border-2 border-orange-200'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-slate-600'
                      }`}
                  >
                    <IndianRupee className="w-4 h-4" />
                    <span>{amount}</span>
                  </button>
                ))}

                {/* Custom Amount Button */}
                <button
                  onClick={() => {
                    setShowCustomInput(!showCustomInput);
                    if (!showCustomInput) {
                      setSelectedAmount(0);
                    }
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 ${showCustomInput
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white scale-105 shadow-orange-500/20'
                      : isLight
                        ? 'bg-white text-slate-700 hover:bg-orange-50 border-2 border-orange-200'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-slate-600'
                    }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Custom</span>
                </button>
              </div>

              {/* Custom Amount Input */}
              {showCustomInput && (
                <div className={`max-w-md mx-auto mb-6 p-4 rounded-xl ${isLight ? 'bg-white border-2 border-orange-200' : 'bg-slate-700 border-2 border-slate-600'} shadow-lg`}>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Enter Custom Amount
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <IndianRupee className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${isLight
                            ? 'bg-slate-50 border-slate-200 text-slate-900'
                            : 'bg-slate-800 border-slate-600 text-white'
                          }`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCustomContribute();
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={handleCustomContribute}
                      disabled={!customAmount || parseInt(customAmount) <= 0}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Set
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={openContributionModal}
                  disabled={showCustomInput && (!customAmount || parseInt(customAmount) <= 0)}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-lg font-semibold rounded-xl transition shadow-xl shadow-orange-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Coffee className="w-5 h-5" />
                  <IndianRupee className="w-5 h-5" />
                  <span>Contribute {showCustomInput ? (customAmount || '...') : `₹${selectedAmount}`}</span>
                </button>
              </div>

              <div className={`p-4 rounded-xl ${isLight ? 'bg-orange-100/50' : 'bg-orange-900/20'} text-center`}>
                <p className={`text-sm ${isLight ? 'text-orange-700' : 'text-orange-300'} flex items-center justify-center gap-2 flex-wrap`}>
                  <Gift className="w-4 h-4" />
                  <span>Contributions are optional and help us grow sustainably. Thank you for being part of our journey!</span>
                </p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center mt-12">
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-3xl mx-auto leading-relaxed`}>
                💜 Vaidehi is built with intention—for creators, entrepreneurs, and dreamers. We're committed to transparency, sustainability, and creating value that lasts. Your trust and support mean everything to us.
              </p>
            </div>
          </div>
        </div>

        {/* Contribution Modal */}
        {showContributionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'
              }`}>
              <div className={`flex items-center justify-between p-6 border-b ${isLight ? 'border-slate-200' : 'border-slate-700'
                }`}>
                <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Complete Your Contribution
                </h3>
                <button
                  onClick={closeContributionModal}
                  className={`p-2 rounded-lg transition ${isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-700'
                    }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${isLight
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-slate-700 border-slate-600 text-white'
                      }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={contributorEmail}
                    onChange={(e) => setContributorEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${isLight
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-slate-700 border-slate-600 text-white'
                      }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                    Message (Optional)
                  </label>
                  <textarea
                    value={contributorMessage}
                    onChange={(e) => setContributorMessage(e.target.value)}
                    placeholder="Share your thoughts with us..."
                    rows={3}
                    maxLength={200}
                    className={`w-full px-4 py-3 rounded-lg border-2 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 ${isLight
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-slate-700 border-slate-600 text-white'
                      }`}
                  />
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {contributorMessage.length}/200 characters
                  </p>
                </div>

                <div className={`p-4 rounded-lg ${isLight ? 'bg-orange-50' : 'bg-orange-900/20'
                  }`}>
                  <p className={`text-sm ${isLight ? 'text-orange-700' : 'text-orange-300'}`}>
                    <strong>Amount:</strong> ₹{showCustomInput ? customAmount : selectedAmount}
                  </p>
                </div>

                <button
                  onClick={handleContribute}
                  disabled={isProcessing || !contributorName.trim() || !contributorEmail.trim()}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>

                <p className={`text-xs text-center ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'
              }`}>
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>

                <h3 className={`text-2xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Thank You! 🙏
                </h3>

                <p className={`text-lg mb-6 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Your contribution of <strong className="text-orange-500">₹{successAmount}</strong> has been received successfully!
                </p>

                {userBadge && (
                  <div className={`p-4 rounded-xl mb-6 ${isLight ? 'bg-gradient-to-r from-orange-50 to-pink-50' : 'bg-gradient-to-r from-orange-900/20 to-pink-900/20'
                    }`}>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-3xl">{userBadge.icon}</span>
                      <span className={`font-bold text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {userBadge.name}
                      </span>
                    </div>
                    <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      You've unlocked a supporter badge!
                    </p>
                  </div>
                )}

                <p className={`text-sm mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Your support helps us maintain servers, develop new features, and keep Vaidehi free for everyone. We're incredibly grateful! 💜
                </p>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl transition"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}