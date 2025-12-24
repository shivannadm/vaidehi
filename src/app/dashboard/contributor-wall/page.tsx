"use client";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Sparkles, Clock } from "lucide-react";
import { getAllContributions, formatIndianRupees } from "@/lib/supabase/contribution-helpers";
import type { Contribution } from "@/types/database";

export default function ContributorWallPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const loadContributions = async () => {
      setLoading(true);

      const { data } = await getAllContributions();

      if (data) {
        // Only show successful contributions with messages
        const withMessages = (data as Contribution[])
          .filter(c => c.status === 'success' && c.message)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setContributions(withMessages);
      }

      setLoading(false);
    };

    if (mounted) {
      loadContributions();
    }
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLight = !isDark;

  const getRandomGradient = (index: number) => {
    const gradients = [
      'from-pink-400 to-rose-500',
      'from-purple-400 to-indigo-500',
      'from-blue-400 to-cyan-500',
      'from-green-400 to-emerald-500',
      'from-yellow-400 to-orange-500',
      'from-red-400 to-pink-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-slate-900'}`}>
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${isLight ? 'bg-gradient-to-br from-pink-400 to-rose-500' : 'bg-gradient-to-br from-pink-600 to-rose-700'}`}
          style={{ transform: 'translate(-30%, -30%)' }} />
        <div className={`absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 ${isLight ? 'bg-gradient-to-br from-purple-400 to-indigo-500' : 'bg-gradient-to-br from-purple-600 to-indigo-700'}`}
          style={{ transform: 'translate(30%, -20%)' }} />
        <div className={`absolute bottom-0 left-1/3 w-[550px] h-[550px] rounded-full blur-3xl opacity-20 ${isLight ? 'bg-gradient-to-br from-blue-400 to-cyan-500' : 'bg-gradient-to-br from-blue-600 to-cyan-700'}`}
          style={{ transform: 'translate(-20%, 30%)' }} />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 rounded-3xl mb-6 shadow-2xl shadow-pink-500/30 animate-pulse">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 ${isLight ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent' : 'text-white'}`}>
              Wall of Gratitude
            </h1>
            <p className={`text-lg sm:text-xl ${isLight ? 'text-slate-700' : 'text-slate-300'} max-w-3xl mx-auto leading-relaxed`}>
              Heartfelt messages from our amazing community. Your words inspire us to build better every day! 💜
            </p>
          </div>

          {/* Messages Grid */}
          {contributions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contributions.map((contribution, index) => (
                <div
                  key={contribution.id}
                  className={`${isLight ? 'bg-white/80 backdrop-blur-sm border-slate-200' : 'bg-slate-800/50 backdrop-blur-sm border-slate-700'} border-2 rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 hover:shadow-2xl`}
                >
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRandomGradient(index)} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {contribution.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {contribution.user_name}
                      </h3>
                      <p className={`text-sm ${isLight ? 'text-green-600' : 'text-green-400'} font-semibold`}>
                        {formatIndianRupees(contribution.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className={`p-4 rounded-xl ${isLight ? 'bg-slate-50' : 'bg-slate-700/50'} mb-4 min-h-[100px]`}>
                    <div className="flex items-start gap-2 mb-2">
                      <MessageCircle className={`w-4 h-4 flex-shrink-0 mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                      <p className={`text-sm italic leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        "{contribution.message}"
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {new Date(contribution.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <Sparkles className={`w-5 h-5 ${isLight ? 'text-yellow-500' : 'text-yellow-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className={`${isLight ? 'bg-white/80 backdrop-blur-sm' : 'bg-slate-800/50 backdrop-blur-sm'} rounded-3xl p-16 text-center shadow-2xl`}>
              <Heart className={`w-20 h-20 mx-auto mb-6 ${isLight ? 'text-slate-300' : 'text-slate-600'}`} />
              <h3 className={`text-2xl font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                No Messages Yet
              </h3>
              <p className={`text-lg ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-md mx-auto mb-8`}>
                Be the first to contribute and share your message with the community!
              </p>
              <a
                href="/dashboard/go-pro"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl transition shadow-xl shadow-pink-500/40"
              >
                <Heart className="w-5 h-5" />
                <span>Contribute & Leave a Message</span>
              </a>
            </div>
          )}

          {/* CTA Section */}
          {contributions.length > 0 && (
            <div className={`mt-16 ${isLight ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200' : 'bg-gradient-to-r from-pink-900/20 to-rose-900/20 border-pink-700'} border-2 rounded-3xl p-8 text-center shadow-2xl`}>
              <h3 className={`text-2xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Want to share your message?
              </h3>
              <p className={`text-lg mb-6 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Join our community of supporters and let us know what Vaidehi means to you!
              </p>
              <a
                href="/dashboard/go-pro"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-xl transition shadow-xl shadow-pink-500/40"
              >
                <Heart className="w-5 h-5" />
                <span>Contribute Now</span>
              </a>
            </div>
          )}

          {/* Thank You Section */}
          <div className="mt-12 text-center">
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-3xl mx-auto leading-relaxed`}>
              💜 Every contribution, big or small, helps us maintain servers, develop new features, and keep Vaidehi free for everyone. We read every message and they truly inspire us. Thank you for being part of our journey!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}