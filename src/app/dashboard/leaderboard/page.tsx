"use client";
import { useEffect, useState } from "react";
import { Trophy, Medal, Award, Heart, TrendingUp, Users, Sparkles } from "lucide-react";
import { getContributionLeaderboard, getContributionStats, formatIndianRupees } from "@/lib/supabase/contribution-helpers";
import type { LeaderboardEntry, ContributionStats } from "@/types/database";

export default function LeaderboardPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<ContributionStats | null>(null);
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
    const loadData = async () => {
      setLoading(true);

      const [leaderboardResult, statsResult] = await Promise.all([
        getContributionLeaderboard(20),
        getContributionStats()
      ]);

      if (leaderboardResult.data) {
        setLeaderboard(leaderboardResult.data);
      }

      if (statsResult.data) {
        setStats(statsResult.data);
      }

      setLoading(false);
    };

    if (mounted) {
      loadData();
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

  return (
    <div className={`min-h-screen relative overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-slate-900'}`}>
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${isLight ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-yellow-600 to-orange-700'}`}
          style={{ transform: 'translate(-30%, -30%)' }} />
        <div className={`absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 ${isLight ? 'bg-gradient-to-br from-pink-400 to-purple-500' : 'bg-gradient-to-br from-pink-600 to-purple-700'}`}
          style={{ transform: 'translate(30%, -20%)' }} />
        <div className={`absolute bottom-0 left-1/3 w-[550px] h-[550px] rounded-full blur-3xl opacity-20 ${isLight ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-green-600 to-emerald-700'}`}
          style={{ transform: 'translate(-20%, 30%)' }} />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl mb-6 shadow-2xl shadow-orange-500/30 animate-pulse">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 ${isLight ? 'bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent' : 'text-white'}`}>
              Contributors Hall of Fame
            </h1>
            <p className={`text-lg sm:text-xl ${isLight ? 'text-slate-700' : 'text-slate-300'} max-w-3xl mx-auto leading-relaxed`}>
              Celebrating the amazing people who make Vaidehi possible. Every contribution matters! 💜
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className={`${isLight ? 'bg-white/80 backdrop-blur-sm border-green-200' : 'bg-slate-800/50 backdrop-blur-sm border-green-700'} border-2 rounded-2xl p-6 shadow-xl`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-xl ${isLight ? 'bg-green-100' : 'bg-green-900/50'}`}>
                    <TrendingUp className={`w-6 h-6 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
                  </div>
                  <p className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Total Raised
                  </p>
                </div>
                <p className={`text-4xl font-bold ${isLight ? 'text-green-600' : 'text-green-400'}`}>
                  {formatIndianRupees(stats.totalRaised)}
                </p>
              </div>

              <div className={`${isLight ? 'bg-white/80 backdrop-blur-sm border-blue-200' : 'bg-slate-800/50 backdrop-blur-sm border-blue-700'} border-2 rounded-2xl p-6 shadow-xl`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-xl ${isLight ? 'bg-blue-100' : 'bg-blue-900/50'}`}>
                    <Users className={`w-6 h-6 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                  </div>
                  <p className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Contributors
                  </p>
                </div>
                <p className={`text-4xl font-bold ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                  {stats.totalContributors}
                </p>
              </div>

              <div className={`${isLight ? 'bg-white/80 backdrop-blur-sm border-purple-200' : 'bg-slate-800/50 backdrop-blur-sm border-purple-700'} border-2 rounded-2xl p-6 shadow-xl`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-xl ${isLight ? 'bg-purple-100' : 'bg-purple-900/50'}`}>
                    <Heart className={`w-6 h-6 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                  </div>
                  <p className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Average
                  </p>
                </div>
                <p className={`text-4xl font-bold ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>
                  {formatIndianRupees(stats.average)}
                </p>
              </div>
            </div>
          )}

          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className={`${isLight ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-700'} border-2 rounded-3xl p-8 mb-12 shadow-2xl`}>
              <div className="flex items-center justify-center gap-4 mb-8">
                <Sparkles className={`w-8 h-8 ${isLight ? 'text-yellow-600' : 'text-yellow-400'}`} />
                <h2 className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Top 3 Champions
                </h2>
                <Sparkles className={`w-8 h-8 ${isLight ? 'text-yellow-600' : 'text-yellow-400'}`} />
              </div>

              <div className="flex items-end justify-center gap-6">
                {/* 2nd Place */}
                {leaderboard[1] && (
                  <div className="flex flex-col items-center flex-1 max-w-xs">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-4xl mb-4 shadow-xl border-4 border-white">
                      🥈
                    </div>
                    <div className={`w-full p-6 rounded-2xl ${isLight ? 'bg-white' : 'bg-slate-800'} shadow-xl text-center`} style={{ minHeight: '180px' }}>
                      <p className={`font-bold text-xl mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {leaderboard[1].user_name}
                      </p>
                      <p className={`text-3xl font-bold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {formatIndianRupees(leaderboard[1].total_amount)}
                      </p>
                      <p className={`text-sm mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {leaderboard[1].contribution_count} contributions
                      </p>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {leaderboard[0] && (
                  <div className="flex flex-col items-center flex-1 max-w-xs">
                    <div className="relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                        <Trophy className={`w-12 h-12 ${isLight ? 'text-yellow-500' : 'text-yellow-400'} animate-bounce`} />
                      </div>
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 flex items-center justify-center text-5xl mb-4 shadow-2xl shadow-yellow-500/50 border-4 border-white">
                        🥇
                      </div>
                    </div>
                    <div className={`w-full p-8 rounded-2xl bg-gradient-to-br ${isLight ? 'from-yellow-100 to-orange-100' : 'from-yellow-900/40 to-orange-900/40'} shadow-2xl text-center border-4 ${isLight ? 'border-yellow-300' : 'border-yellow-700'}`} style={{ minHeight: '200px' }}>
                      <p className={`font-bold text-2xl mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {leaderboard[0].user_name}
                      </p>
                      <p className={`text-4xl font-bold ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>
                        {formatIndianRupees(leaderboard[0].total_amount)}
                      </p>
                      <p className={`text-sm mt-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {leaderboard[0].contribution_count} contributions
                      </p>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {leaderboard[2] && (
                  <div className="flex flex-col items-center flex-1 max-w-xs">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-300 to-red-400 flex items-center justify-center text-4xl mb-4 shadow-xl border-4 border-white">
                      🥉
                    </div>
                    <div className={`w-full p-6 rounded-2xl ${isLight ? 'bg-white' : 'bg-slate-800'} shadow-xl text-center`} style={{ minHeight: '180px' }}>
                      <p className={`font-bold text-xl mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {leaderboard[2].user_name}
                      </p>
                      <p className={`text-3xl font-bold ${isLight ? 'text-orange-600' : 'text-orange-400'}`}>
                        {formatIndianRupees(leaderboard[2].total_amount)}
                      </p>
                      <p className={`text-sm mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {leaderboard[2].contribution_count} contributions
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rest of Leaderboard */}
          {leaderboard.length > 3 && (
            <div className={`${isLight ? 'bg-white/80 backdrop-blur-sm border-slate-200' : 'bg-slate-800/50 backdrop-blur-sm border-slate-700'} border-2 rounded-3xl p-8 shadow-2xl`}>
              <h3 className={`text-2xl font-bold mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                All Contributors
              </h3>
              <div className="space-y-3">
                {leaderboard.slice(3).map((entry, index) => (
                  <div
                    key={entry.user_email}
                    className={`flex items-center gap-4 p-4 rounded-xl transition hover:scale-[1.02] ${isLight ? 'bg-slate-50 hover:bg-slate-100' : 'bg-slate-700/30 hover:bg-slate-700/50'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-600 text-slate-200'
                      }`}>
                      #{index + 4}
                    </div>

                    <div className="flex-1">
                      <h4 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {entry.user_name}
                      </h4>
                      <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {entry.contribution_count} contribution{entry.contribution_count > 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className={`text-xl font-bold ${isLight ? 'text-green-600' : 'text-green-400'}`}>
                        {formatIndianRupees(entry.total_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {leaderboard.length === 0 && (
            <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-3xl p-12 text-center shadow-2xl`}>
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${isLight ? 'text-slate-300' : 'text-slate-600'}`} />
              <p className={`text-xl ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Be the first to contribute and claim the top spot! 🚀
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-12">
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} mb-4`}>
              Want to join our hall of fame?
            </p>
            <a
              href="/dashboard/go-pro"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl transition shadow-xl shadow-orange-500/40"
            >
              <Heart className="w-5 h-5" />
              <span>Contribute Now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}