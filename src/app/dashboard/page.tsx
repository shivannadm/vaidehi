import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const handleSignOut = async () => {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <a href="/" className="font-bold text-2xl text-indigo-600">
                            V<span className="text-black">aidehi</span>
                        </a>
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="/dashboard" className="text-sm font-medium text-indigo-600">
                                Dashboard
                            </a>
                            <a href="/trades" className="text-sm text-slate-600 hover:text-slate-900 transition">
                                Trades
                            </a>
                            <a href="/routines" className="text-sm text-slate-600 hover:text-slate-900 transition">
                                Routines
                            </a>
                            <a href="/analytics" className="text-sm text-slate-600 hover:text-slate-900 transition">
                                Analytics
                            </a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-slate-900">
                                {profile?.full_name || user.email}
                            </p>
                            <p className="text-xs text-slate-500">{profile?.subscription_tier || "Starter"}</p>
                        </div>
                        <form action={handleSignOut}>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Welcome back, {profile?.full_name?.split(" ")[0] || "Trader"}! 👋
                    </h1>
                    <p className="text-slate-600">
                        Here's what's happening with your trading today.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+12.5%</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">$0.00</h3>
                        <p className="text-sm text-slate-600">Total P&L</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">0</h3>
                        <p className="text-sm text-slate-600">Total Trades</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">0%</h3>
                        <p className="text-sm text-slate-600">Win Rate</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">0</h3>
                        <p className="text-sm text-slate-600">Days Active</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-slate-900">Log a Trade</h3>
                                <p className="text-xs text-slate-600">Add your latest trade</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-slate-900">Check Routine</h3>
                                <p className="text-xs text-slate-600">Review your checklist</p>
                            </div>
                        </button>

                        <button className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-slate-900">View Analytics</h3>
                                <p className="text-xs text-slate-600">See your performance</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Getting Started */}
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-2">🚀 Getting Started</h2>
                    <p className="text-indigo-100 mb-6">
                        You're all set! Start logging your trades and building your routine to unlock powerful insights.
                    </p>
                    <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg">
                        Log your first trade
                    </button>
                </div>
            </main>
        </div>
    );
}