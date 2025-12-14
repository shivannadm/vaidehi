// ====================
// FILE: src/app/(landing)/pnl-report/page.tsx
// ====================
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PnLReportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">P&L Report Dashboard</h1>
            <p className="text-lg text-slate-600">
              Track your profit and loss with detailed analytics and insights
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="text-sm text-slate-600 mb-2">Total P&L</div>
              <div className="text-3xl font-bold text-green-600">+$12,450</div>
              <div className="text-xs text-slate-500 mt-2">+15.3% this month</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="text-sm text-slate-600 mb-2">Win Rate</div>
              <div className="text-3xl font-bold text-indigo-600">68.5%</div>
              <div className="text-xs text-slate-500 mt-2">Above average</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="text-sm text-slate-600 mb-2">Total Trades</div>
              <div className="text-3xl font-bold text-slate-900">247</div>
              <div className="text-xs text-slate-500 mt-2">This month</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="text-sm text-slate-600 mb-2">Avg Win</div>
              <div className="text-3xl font-bold text-blue-600">$285</div>
              <div className="text-xs text-slate-500 mt-2">Per winning trade</div>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Equity Curve</h2>
            <div className="h-64 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg flex items-center justify-center">
              <p className="text-slate-500">Interactive chart will be displayed here</p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Want to see your own P&L reports?</h2>
            <p className="mb-6 text-indigo-100">Sign up now and start tracking your trading performance</p>
            <a 
              href="/signup" 
              className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-slate-100 transition-all font-semibold"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
