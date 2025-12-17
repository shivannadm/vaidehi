// ============================================
// FILE: src/app/dashboard/admin/page.tsx
// ✅ FIXED: Complete admin dashboard with all tabs working
// ============================================

"use client";
import { useState, useEffect } from "react";
import {
  MessageCircle, HelpCircle, User, Mail, Clock,
  AlertCircle, CheckCircle, Filter, Lock, Eye, EyeOff, RefreshCw, Shield, PhoneCall
} from "lucide-react";
import {
  getAllFeedback,
  getAllHelpRequests,
  updateFeedbackStatus,
  updateHelpRequestStatus,
  isUserAdmin,
  getAllContactMessages,
  updateContactMessageStatus
} from "@/lib/supabase/support-helpers";
import type { Feedback, HelpRequest, ContactMessage } from "@/types/database";

export default function AdminDashboard() {
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

  const [activeTab, setActiveTab] = useState<"feedback" | "help" | "contact">("feedback");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "resolved">("all");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [helpData, setHelpData] = useState<HelpRequest[]>([]);
  const [contactData, setContactData] = useState<ContactMessage[]>([]);

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
  }, [mounted]);

  const checkAdminStatusAndLoadData = async () => {
    setCheckingAdmin(true);

    // Check if user is actually an admin in the database
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
      const [feedbackResult, helpResult, contactResult] = await Promise.all([
        getAllFeedback(),
        getAllHelpRequests(),
        getAllContactMessages()
      ]);

      if (feedbackResult.data) setFeedbackData(feedbackResult.data as Feedback[]);
      if (helpResult.data) setHelpData(helpResult.data as HelpRequest[]);
      if (contactResult.data) setContactData(contactResult.data as ContactMessage[]);
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
              <strong>Note:</strong> To grant admin access, run this SQL in Supabase:
            </p>
            <code className={`block mt-2 text-xs p-2 rounded ${isLight ? 'bg-slate-100' : 'bg-slate-900'}`}>
              INSERT INTO admin_users (user_id)<br />
              SELECT id FROM auth.users<br />
              WHERE email = &apos;your@email.com&apos;;
            </code>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard (user is verified admin)
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

        {/* Tabs */}
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
        </div>

        {/* Filter */}
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === "feedback" ? (
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
        ) : (
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
        )}
      </div>
    </div>
  );
}