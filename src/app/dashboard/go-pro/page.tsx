"use client";
import { useEffect, useState } from "react";
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
  Edit3
} from "lucide-react";

export default function GoProPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(299);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

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

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLight = !isDark;

  // Current limits (you can adjust these)
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

  const handleContribute = async (amount: number) => {
    alert(`Thank you for considering a ₹${amount} contribution! Stripe integration coming soon. 🙏`);
    // TODO: Implement Stripe payment
  };

  const handleCustomContribute = () => {
    const amount = parseInt(customAmount);
    if (amount && amount > 0) {
      handleContribute(amount);
      setCustomAmount("");
      setShowCustomInput(false);
    } else {
      alert("Please enter a valid amount");
    }
  };

  return (
    <div className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50' : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto">
        
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
          
          {/* Current Features & Limits */}
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
                className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 ${
                  selectedAmount === amount && !showCustomInput
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white scale-105 shadow-orange-500/50'
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
              className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 ${
                showCustomInput
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white scale-105 shadow-orange-500/50'
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
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      isLight 
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
              onClick={() => handleContribute(showCustomInput ? parseInt(customAmount) : selectedAmount)}
              disabled={showCustomInput && (!customAmount || parseInt(customAmount) <= 0)}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-lg font-semibold rounded-xl transition shadow-xl shadow-orange-500/10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coffee className="w-5 h-5" />
              <IndianRupee className="w-5 h-5" />
              <span>{showCustomInput ? (customAmount || '...') : selectedAmount} Contribute</span>
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
  );
}