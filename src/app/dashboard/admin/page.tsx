// FILE: src/app/dashboard/admin/page.tsx

"use client";
import { useState, useEffect } from "react";
import {
  MessageCircle, HelpCircle, User, Mail, Clock,
  AlertCircle, CheckCircle, Filter, Lock, Eye, EyeOff,
  RefreshCw, Shield, PhoneCall, Bell, Send, X, IndianRupee,
  Trophy
} from "lucide-react";

import { Download, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";
import {
  getAllContributions,
  getContributionStats,
  getContributionLeaderboard,
  exportContributionsToCSV,
  formatIndianRupees
} from "@/lib/supabase/contribution-helpers";

import {
  getAllFeedback,
  getAllHelpRequests,
  updateFeedbackStatus,
  updateHelpRequestStatus,
  isUserAdmin,
  getAllContactMessages,
  updateContactMessageStatus,
  sendNotificationToAllUsers
} from "@/lib/supabase/support-helpers";
import type { Feedback, HelpRequest, ContactMessage, Contribution, ContributionStats, LeaderboardEntry } from "@/types/database";

export default function AdminDashboard() {

  const [contributionsData, setContributionsData] = useState<Contribution[]>([]);
  const [contributionStats, setContributionStats] = useState<ContributionStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [contributionsFilter, setContributionsFilter] = useState<"all" | "success" | "pending" | "failed">("all");
  const [exportingCSV, setExportingCSV] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isActualAdmin, setIsActualAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginAttempting, setLoginAttempting] = useState(false);

  const [activeTab, setActiveTab] = useState<"feedback" | "help" | "contact" | "notify" | "contributions">("feedback");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "resolved">("all");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [helpData, setHelpData] = useState<HelpRequest[]>([]);
  const [contactData, setContactData] = useState<ContactMessage[]>([]);

  // Notify state
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationPreview, setNotificationPreview] = useState("");
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const [sentCount, setSentCount] = useState(0);

  // Hardcoded admin credentials
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "vaidehi@admin2025";

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

  // Check authentication on mount
  useEffect(() => {
    if (!mounted) return;

    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
      checkAdminStatusAndLoadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const checkAdminStatusAndLoadData = async () => {
    setCheckingAdmin(true);

    // ✅ REAL admin check, not mock
    const isAdmin = await isUserAdmin();
    setIsActualAdmin(isAdmin);

    if (isAdmin) {
      await fetchAllData();
    }

    setCheckingAdmin(false);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // ✅ REAL Supabase calls, not mocks
      const [feedbackResult, helpResult, contactResult, contributionsResult, statsResult, leaderboardResult] = await Promise.all([
        getAllFeedback(),
        getAllHelpRequests(),
        getAllContactMessages(),
        getAllContributions(),
        getContributionStats(),
        getContributionLeaderboard(10)
      ]);

      if (feedbackResult.data) setFeedbackData(feedbackResult.data as Feedback[]);
      if (helpResult.data) setHelpData(helpResult.data as HelpRequest[]);
      if (contactResult.data) setContactData(contactResult.data as ContactMessage[]);
      if (contributionsResult.data) setContributionsData(contributionsResult.data as Contribution[]);
      if (statsResult.data) setContributionStats(statsResult.data);
      if (leaderboardResult.data) setLeaderboard(leaderboardResult.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const handleExportCSV = async () => {
    setExportingCSV(true);

    try {
      const { data: csvContent, error } = await exportContributionsToCSV();

      if (error || !csvContent) {
        alert("Failed to export CSV");
        return;
      }

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vaidehi-contributions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("✅ CSV exported successfully");
    } catch (error) {
      console.error("CSV export error:", error);
      alert("Failed to export CSV");
    } finally {
      setExportingCSV(false);
    }
  };

  // ADD THIS HELPER FUNCTION:
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // FILTERED CONTRIBUTIONS:
  const filteredContributions = contributionsFilter === 'all'
    ? contributionsData
    : contributionsData.filter(c => c.status === contributionsFilter);



  const handleLogin = async () => {
    setLoginError("");
    setLoginAttempting(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      await checkAdminStatusAndLoadData();
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
    setLoginAttempting(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsActualAdmin(false);
    sessionStorage.removeItem('admin_authenticated');
    setUsername("");
    setPassword("");
    setFeedbackData([]);
    setHelpData([]);
    setContactData([]);
  };

  const markAsResolved = async (type: 'feedback' | 'help' | 'contact', id: string) => {
    try {
      if (type === 'feedback') {
        const { error } = await updateFeedbackStatus(id, 'resolved');
        if (!error) {
          setFeedbackData(prev =>
            prev.map(item => item.id === id ? { ...item, status: 'resolved' } : item)
          );
        }
      } else if (type === 'help') {
        const { error } = await updateHelpRequestStatus(id, 'resolved');
        if (!error) {
          setHelpData(prev =>
            prev.map(item => item.id === id ? { ...item, status: 'resolved' } : item)
          );
        }
      } else if (type === 'contact') {
        const { error } = await updateContactMessageStatus(id, 'resolved');
        if (!error) {
          setContactData(prev =>
            prev.map(item => item.id === id ? { ...item, status: 'resolved' } : item)
          );
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // ✅ REAL notification sending function
  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      setNotificationError("Please enter a notification message");
      return;
    }

    setSendingNotification(true);
    setNotificationError("");
    setNotificationSuccess(false);

    try {
      // ✅ REAL Supabase call
      const { data, error } = await sendNotificationToAllUsers(notificationMessage);

      if (error) {
        setNotificationError("Failed to send notification. Please try again.");
        setSendingNotification(false);
        return;
      }

      setSentCount(data?.count || 0);
      setNotificationSuccess(true);
      setNotificationMessage("");
      setNotificationPreview("");

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setNotificationSuccess(false);
      }, 3000);
    } catch (error) {
      setNotificationError("An error occurred while sending notification");
    } finally {
      setSendingNotification(false);
    }
  };

  const handleNotificationChange = (value: string) => {
    setNotificationMessage(value);
    setNotificationPreview(value);
    setNotificationError("");
  };

  const clearNotification = () => {
    setNotificationMessage("");
    setNotificationPreview("");
    setNotificationError("");
    setNotificationSuccess(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'pending' ? 'text-yellow-500' : 'text-green-500';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'text-red-500';
    if (priority === 'medium') return 'text-orange-500';
    return 'text-blue-500';
  };

  const filteredFeedback = filterStatus === 'all'
    ? feedbackData
    : feedbackData.filter(f => f.status === filterStatus);

  const filteredHelp = filterStatus === 'all'
    ? helpData
    : helpData.filter(h => h.status === filterStatus);

  const filteredContact = filterStatus === 'all'
    ? contactData
    : contactData.filter(c => c.status === filterStatus);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLight = !isDark;

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-slate-50 to-slate-100' : 'bg-gradient-to-br from-slate-900 to-slate-800'} flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full ${isLight ? 'bg-white' : 'bg-slate-800'} rounded-2xl shadow-2xl p-8`}>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Admin Access
            </h1>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Enter your credentials to continue
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm font-semibold">{loginError}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className={`w-full px-4 py-3 rounded-lg border-2 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-red-500`}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 pr-12 rounded-lg border-2 ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-white'
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className={`w-5 h-5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                  ) : (
                    <Eye className={`w-5 h-5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loginAttempting || !username || !password}
            className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loginAttempting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Checking admin status
  if (checkingAdmin) {
    return (
      <div className={`min-h-screen ${isLight ? 'bg-slate-50' : 'bg-slate-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Verifying admin permissions...
          </p>
        </div>
      </div>
    );
  }

  // Not an actual admin
  if (!isActualAdmin) {
    return (
      <div className={`min-h-screen ${isLight ? 'bg-slate-50' : 'bg-slate-900'} flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full ${isLight ? 'bg-white' : 'bg-slate-800'} rounded-2xl shadow-2xl p-8 text-center`}>
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Access Denied
          </h1>
          <p className={`text-sm mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Your account does not have admin privileges. Please contact the system administrator to grant you admin access.
          </p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg font-semibold transition-all"
          >
            Back to Login
          </button>

          <div className={`mt-6 p-4 rounded-lg ${isLight ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
            <p className={`text-xs ${isLight ? 'text-blue-800' : 'text-blue-300'}`}>
              <strong>Note:</strong> To grant admin access, <a href="/dashboard/support?tab=help" className="text-red-400"> click here to reach us</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // Admin Dashboard (user is verified admin)
  // ============================================
  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-50' : 'bg-slate-900'} p-4 sm:p-6 lg:p-8`}>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Admin Dashboard
              </h1>
              <p className={`${isLight ? 'text-slate-600' : 'text-slate-400'} flex items-center gap-2`}>
                <Shield className="w-4 h-4 text-green-500" />
                Viewing all users&apos; feedback and help requests
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isLight ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                } transition disabled:opacity-50`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg ${isLight ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'} transition`}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-xl p-4`}>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Total Feedback</p>
            <p className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{feedbackData.length}</p>
          </div>
          <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-xl p-4`}>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Pending Feedback</p>
            <p className="text-2xl font-bold text-yellow-500">{feedbackData.filter(f => f.status === 'pending').length}</p>
          </div>
          <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-xl p-4`}>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Total Help</p>
            <p className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{helpData.length}</p>
          </div>
          <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-xl p-4`}>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Pending Help</p>
            <p className="text-2xl font-bold text-yellow-500">{helpData.filter(h => h.status === 'pending').length}</p>
          </div>
          <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-xl p-4`}>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Total Contact</p>
            <p className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{contactData.length}</p>
          </div>
          <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-xl p-4`}>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Pending Contact</p>
            <p className="text-2xl font-bold text-yellow-500">{contactData.filter(c => c.status === 'pending').length}</p>
          </div>
        </div>

        {/* Tabs - NOW WITH NOTIFY BUTTON */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === "feedback"
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
              : isLight ? 'bg-white text-slate-700 hover:bg-slate-100' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <MessageCircle className="w-5 h-5" />
            Feedback ({feedbackData.length})
          </button>
          <button
            onClick={() => setActiveTab("help")}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === "help"
              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
              : isLight ? 'bg-white text-slate-700 hover:bg-slate-100' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <HelpCircle className="w-5 h-5" />
            Help ({helpData.length})
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === "contact"
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
              : isLight ? 'bg-white text-slate-700 hover:bg-slate-100' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <PhoneCall className="w-5 h-5" />
            Contact ({contactData.length})
          </button>
          {/* ✅ NEW NOTIFY BUTTON */}
          <button
            onClick={() => setActiveTab("notify")}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === "notify"
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
              : isLight ? 'bg-white text-slate-700 hover:bg-slate-100' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <Bell className="w-5 h-5" />
            Notify
          </button>
          <button
            onClick={() => setActiveTab("contributions")}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap ${activeTab === "contributions"
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
              : isLight ? 'bg-white text-slate-700 hover:bg-slate-100' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
          >
            <IndianRupee className="w-5 h-5" />
            Contributions ({contributionsData.length})
          </button>
        </div>

        {/* Filter */}
        {activeTab !== "notify" && (
          <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-lg p-4 flex items-center gap-4`}>
            <Filter className={`w-5 h-5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "all" | "pending" | "resolved")}
              className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-white'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === "notify" ? (
          /* ============================================ */
          /* NOTIFY TAB ✅ NEW */
          /* ============================================ */
          <div className="space-y-6">
            <div className={`${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'} border rounded-xl p-8`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Send Notification to All Users
                  </h2>
                  <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Broadcast an important message to all Vaidehi app users
                  </p>
                </div>
              </div>

              {/* Success Message */}
              {notificationSuccess && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-semibold">Notification Sent Successfully!</p>
                    <p className="text-green-700 text-sm mt-1">
                      Your message has been delivered to {sentCount} users.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {notificationError && (
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-semibold">Error</p>
                    <p className="text-red-700 text-sm mt-1">{notificationError}</p>
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="mb-6">
                <label className={`block text-sm font-semibold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Notification Message
                </label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => handleNotificationChange(e.target.value)}
                  placeholder="Enter your notification message here..."
                  rows={5}
                  maxLength={500}
                  className={`w-full px-4 py-3 rounded-lg border-2 resize-none ${isLight
                    ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                    : 'bg-slate-700 border-slate-600 text-white placeholder-slate-500'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {notificationMessage.length}/500 characters
                  </p>
                  {notificationMessage && (
                    <button
                      onClick={clearNotification}
                      className={`text-xs flex items-center gap-1 ${isLight ? 'text-slate-600 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Preview */}
              {notificationPreview && (
                <div className="mb-6">
                  <label className={`block text-sm font-semibold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Preview
                  </label>
                  <div className={`p-4 rounded-lg border-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
                    <div className="flex items-start gap-3">
                      <Bell className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLight ? 'text-orange-600' : 'text-orange-400'}`} />
                      <p className={`text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {notificationPreview}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Send Button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSendNotification}
                  disabled={sendingNotification || !notificationMessage.trim()}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {sendingNotification ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending to all users...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send to All Users</span>
                    </>
                  )}
                </button>
              </div>

              {/* Info Box */}
              <div className={`mt-6 p-4 rounded-lg ${isLight ? 'bg-blue-50 border-2 border-blue-200' : 'bg-blue-900/20 border-2 border-blue-800'}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                  <div>
                    <p className={`text-sm font-semibold mb-1 ${isLight ? 'text-blue-900' : 'text-blue-300'}`}>
                      Important Notes:
                    </p>
                    <ul className={`text-xs space-y-1 ${isLight ? 'text-blue-800' : 'text-blue-400'}`}>
                      <li>• This will send a notification to ALL registered users</li>
                      <li>• Users will see it in their notification bell icon</li>
                      <li>• Keep messages clear, concise, and professional</li>
                      <li>• Maximum message length is 500 characters</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "feedback" ? (
          /* ============================================ */
          /* FEEDBACK TAB */
          /* ============================================ */
          <div className="space-y-4">
            {filteredFeedback.length === 0 ? (
              <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-xl p-8 text-center`}>
                <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>No feedback found</p>
              </div>
            ) : (
              filteredFeedback.map(item => (
                <div
                  key={item.id}
                  className={`${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'} border rounded-xl p-6 hover:shadow-lg transition`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {item.user_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>{item.user_email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.category === 'bug' ? 'bg-red-100 text-red-600' :
                        item.category === 'feature' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                        {item.category}
                      </span>
                      <span className={`flex items-center gap-1 text-sm font-semibold ${getStatusColor(item.status)}`}>
                        {item.status === 'pending' ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <p className={`mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {formatDate(item.created_at)}
                    </span>
                    {item.status === 'pending' && (
                      <button
                        onClick={() => markAsResolved('feedback', item.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === "help" ? (
          /* ============================================ */
          /* HELP TAB */
          /* ============================================ */
          <div className="space-y-4">
            {filteredHelp.length === 0 ? (
              <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-xl p-8 text-center`}>
                <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>No help requests found</p>
              </div>
            ) : (
              filteredHelp.map(item => (
                <div
                  key={item.id}
                  className={`${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'} border rounded-xl p-6 hover:shadow-lg transition`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {item.user_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>{item.user_email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                        {item.priority} priority
                      </span>
                      <span className={`flex items-center gap-1 text-sm font-semibold ${getStatusColor(item.status)}`}>
                        {item.status === 'pending' ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <h4 className={`font-semibold mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    {item.subject}
                  </h4>
                  <p className={`mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {formatDate(item.created_at)}
                    </span>
                    {item.status === 'pending' && (
                      <button
                        onClick={() => markAsResolved('help', item.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === "contributions" ? (
          <div className="space-y-6">

            {/* ============================================ */}
            {/* STATS DASHBOARD */}
            {/* ============================================ */}
            {contributionStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Total Raised */}
                <div className={`${isLight ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700'} border-2 rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isLight ? 'bg-green-100' : 'bg-green-800'}`}>
                      <TrendingUp className={`w-5 h-5 ${isLight ? 'text-green-600' : 'text-green-300'}`} />
                    </div>
                    <p className={`text-sm font-medium ${isLight ? 'text-green-700' : 'text-green-300'}`}>
                      Total Raised
                    </p>
                  </div>
                  <p className={`text-3xl font-bold ${isLight ? 'text-green-900' : 'text-green-100'}`}>
                    {formatIndianRupees(contributionStats.totalRaised)}
                  </p>
                </div>

                {/* Total Contributors */}
                <div className={`${isLight ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200' : 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-700'} border-2 rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isLight ? 'bg-blue-100' : 'bg-blue-800'}`}>
                      <Users className={`w-5 h-5 ${isLight ? 'text-blue-600' : 'text-blue-300'}`} />
                    </div>
                    <p className={`text-sm font-medium ${isLight ? 'text-blue-700' : 'text-blue-300'}`}>
                      Contributors
                    </p>
                  </div>
                  <p className={`text-3xl font-bold ${isLight ? 'text-blue-900' : 'text-blue-100'}`}>
                    {contributionStats.totalContributors}
                  </p>
                </div>

                {/* This Month */}
                <div className={`${isLight ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200' : 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-700'} border-2 rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isLight ? 'bg-purple-100' : 'bg-purple-800'}`}>
                      <Calendar className={`w-5 h-5 ${isLight ? 'text-purple-600' : 'text-purple-300'}`} />
                    </div>
                    <p className={`text-sm font-medium ${isLight ? 'text-purple-700' : 'text-purple-300'}`}>
                      This Month
                    </p>
                  </div>
                  <p className={`text-3xl font-bold ${isLight ? 'text-purple-900' : 'text-purple-100'}`}>
                    {formatIndianRupees(contributionStats.thisMonth)}
                  </p>
                  <p className={`text-xs mt-1 ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>
                    {contributionStats.thisMonthCount} contributions
                  </p>
                </div>

                {/* Average */}
                <div className={`${isLight ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200' : 'bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-700'} border-2 rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isLight ? 'bg-orange-100' : 'bg-orange-800'}`}>
                      <IndianRupee className={`w-5 h-5 ${isLight ? 'text-orange-600' : 'text-orange-300'}`} />
                    </div>
                    <p className={`text-sm font-medium ${isLight ? 'text-orange-700' : 'text-orange-300'}`}>
                      Average
                    </p>
                  </div>
                  <p className={`text-3xl font-bold ${isLight ? 'text-orange-900' : 'text-orange-100'}`}>
                    {formatIndianRupees(contributionStats.average)}
                  </p>
                </div>

                {/* Export Button */}
                <div className={`${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'} border-2 rounded-xl p-6 flex items-center justify-center`}>
                  <button
                    onClick={handleExportCSV}
                    disabled={exportingCSV || contributionsData.length === 0}
                    className={`px-4 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${isLight
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {exportingCSV ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* LEADERBOARD */}
            {/* ============================================ */}
            {leaderboard.length > 0 && (
              <div className={`${isLight ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-700'} border-2 rounded-xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl ${isLight ? 'bg-yellow-100' : 'bg-yellow-800'}`}>
                    <Trophy className={`w-6 h-6 ${isLight ? 'text-yellow-600' : 'text-yellow-300'}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      🏆 Top Contributors Leaderboard
                    </h3>
                    <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Our amazing supporters who make Vaidehi possible
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.user_email}
                      className={`flex items-center gap-4 p-4 rounded-xl transition ${index === 0
                          ? isLight ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300' : 'bg-gradient-to-r from-yellow-900/40 to-orange-900/40 border-2 border-yellow-700'
                          : isLight ? 'bg-white/60' : 'bg-slate-800/30'
                        }`}
                    >
                      {/* Rank */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                          index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white' :
                              isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-700 text-slate-300'
                        }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <h4 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {entry.user_name}
                        </h4>
                        <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {entry.contribution_count} contribution{entry.contribution_count > 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className={`text-xl font-bold ${index === 0 ? 'text-orange-600' :
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}>
                          {formatIndianRupees(entry.total_amount)}
                        </p>
                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {new Date(entry.last_contribution).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* FILTER */}
            {/* ============================================ */}
            <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-lg p-4 flex items-center gap-4`}>
              <Filter className={`w-5 h-5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`} />
              <select
                value={contributionsFilter}
                onChange={(e) => setContributionsFilter(e.target.value as any)}
                className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-700 border-slate-600 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <option value="all">All Contributions</option>
                <option value="success">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <span className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Showing {filteredContributions.length} of {contributionsData.length} contributions
              </span>
            </div>

            {/* ============================================ */}
            {/* CONTRIBUTIONS LIST */}
            {/* ============================================ */}
            <div className="space-y-4">
              {filteredContributions.length === 0 ? (
                <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-xl p-8 text-center`}>
                  <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                    No contributions found
                  </p>
                </div>
              ) : (
                filteredContributions.map(contribution => (
                  <div
                    key={contribution.id}
                    className={`${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'} border rounded-xl p-6 hover:shadow-lg transition`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                          {contribution.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className={`font-semibold text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {contribution.user_name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                              {contribution.user_email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-2xl font-bold ${isLight ? 'text-green-600' : 'text-green-400'}`}>
                          {formatIndianRupees(contribution.amount)}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 border ${getStatusBadgeColor(contribution.status)
                          }`}>
                          {contribution.status}
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    {contribution.message && (
                      <div className={`p-4 rounded-lg mb-4 ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-700/50 border border-slate-600'
                        }`}>
                        <p className={`text-sm italic ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          "{contribution.message}"
                        </p>
                      </div>
                    )}

                    {/* Payment Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          Payment ID:
                        </p>
                        <p className={`font-mono text-xs ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                          {contribution.razorpay_payment_id}
                        </p>
                      </div>
                      <div>
                        <p className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          Date:
                        </p>
                        <p className={isLight ? 'text-slate-800' : 'text-slate-200'}>
                          {new Date(contribution.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* ============================================ */
          /* CONTACT TAB */
          /* ============================================ */
          <div className="space-y-4">
            {filteredContact.length === 0 ? (
              <div className={`${isLight ? 'bg-white' : 'bg-slate-800'} rounded-xl p-8 text-center`}>
                <p className={isLight ? 'text-slate-600' : 'text-slate-400'}>No contact messages found</p>
              </div>
            ) : (
              filteredContact.map(item => (
                <div
                  key={item.id}
                  className={`${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'} border rounded-xl p-6 hover:shadow-lg transition`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className={`w-4 h-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>{item.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1 text-sm font-semibold ${getStatusColor(item.status)}`}>
                        {item.status === 'pending' ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <h4 className={`font-semibold mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    {item.subject}
                  </h4>
                  <p className={`mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {formatDate(item.created_at)}
                    </span>
                    {item.status === 'pending' && (
                      <button
                        onClick={() => markAsResolved('contact', item.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        )
        }
      </div>
    </div>
  );
}

// ============================================
// END OF FILE - COMPLETE & WORKING ✅
// ============================================