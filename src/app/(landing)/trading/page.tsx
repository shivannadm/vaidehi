// ====================
// FILE: src/app/(landing)/trading/page.tsx
// ====================
"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { TrendingUp, BookOpen, TestTube, PieChart, Shield, Layers, BarChart3, Target } from "lucide-react";

export default function TradingPage() {
  const tradingFeatures = [
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Live Dashboard",
      description: "Real-time overview of your trading performance with key metrics and equity curves.",
      color: "bg-gradient-to-br from-green-400 to-emerald-500"
    },
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Trading Journal",
      description: "Log every trade with detailed notes, and emotional state tracking.",
      color: "bg-gradient-to-br from-blue-400 to-indigo-500"
    },
    {
      icon: <TestTube className="w-10 h-10" />,
      title: "Backtesting",
      description: "Test your strategies against historical data to validate your edge before risking capital.",
      color: "bg-gradient-to-br from-purple-400 to-pink-500"
    },
    {
      icon: <PieChart className="w-10 h-10" />,
      title: "Advanced Analytics",
      description: "Deep dive into your performance with win rates, profit factors, drawdowns, and more.",
      color: "bg-gradient-to-br from-amber-400 to-orange-500"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Trading Rules",
      description: "Define and track your trading rules to maintain discipline and avoid costly mistakes.",
      color: "bg-gradient-to-br from-red-400 to-rose-500"
    },
    {
      icon: <Layers className="w-10 h-10" />,
      title: "Strategy Manager",
      description: "Organize and compare multiple trading strategies to find what works best for you.",
      color: "bg-gradient-to-br from-cyan-400 to-blue-500"
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "Performance Metrics",
      description: "Track Sharpe ratio, max drawdown, profit factor, and all metrics that matter.",
      color: "bg-gradient-to-br from-violet-400 to-purple-500"
    },
    {
      icon: <Target className="w-10 h-10" />,
      title: "Goal Tracking",
      description: "Set and monitor your trading goals with progress visualization and insights.",
      color: "bg-gradient-to-br from-lime-400 to-green-500"
    }
  ];

  // const stats = [
  //   { label: "Active Traders", value: "1,200+" },
  //   { label: "Trades Logged", value: "50K+" },
  //   { label: "Avg Win Rate", value: "65%" },
  //   { label: "Success Rate", value: "89%" }
  // ];

  const benefits = [
    "Track unlimited trades with detailed entry/exit data",
    "Visualize your performance with interactive charts",
    "Identify patterns in your winning and losing trades",
    "Test strategies with historical backtesting",
    "Monitor risk metrics and drawdowns",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Master Your Trading Game
            </h1>
            <p className="text-xl sm:text-2xl text-indigo-100 mb-8">
              The complete trading journal and analytics platform. Track, analyze, and improve every aspect of your trading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup" 
                className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-slate-100 transition-all hover:scale-105 font-semibold text-lg shadow-lg"
              >
                Start Free Trial
              </a>
              <a 
                href="/docs" 
                className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-semibold text-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="bg-slate-50 py-12 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            From logging trades to advanced analytics, we've built every feature you need to become a consistently profitable trader.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradingFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl transition-all group hover:border-indigo-200"
              >
                <div className={`inline-flex p-3 rounded-lg ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Why Traders Choose Vaidehi
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mt-0.5">
                        ✓
                      </div>
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="/signup" 
                  className="inline-block mt-8 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all hover:scale-105 font-semibold shadow-md"
                >
                  Start Trading Better
                </a>
              </div>

              {/* Mock Dashboard Preview */}
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h3 className="text-white font-semibold">Trading Dashboard</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="text-xs text-green-700 mb-1">Total P&L</div>
                      <div className="text-2xl font-bold text-green-600">+₹12,450</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-xs text-blue-700 mb-1">Win Rate</div>
                      <div className="text-2xl font-bold text-blue-600">68.5%</div>
                    </div>
                  </div>
                  <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 relative">
                    <svg className="w-full h-full" viewBox="0 0 400 140" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 0.3 }} />
                          <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 0 }} />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 120 L 20 110 L 40 100 L 60 105 L 80 90 L 100 85 L 120 80 L 140 70 L 160 75 L 180 60 L 200 55 L 220 50 L 240 45 L 260 40 L 280 35 L 300 30 L 320 25 L 340 20 L 360 15 L 380 10 L 400 5 L 400 140 L 0 140 Z"
                        fill="url(#curveGradient)"
                      />
                      <path
                        d="M 0 120 L 20 110 L 40 100 L 60 105 L 80 90 L 100 85 L 120 80 L 140 70 L 160 75 L 180 60 L 200 55 L 220 50 L 240 45 L 260 40 L 280 35 L 300 30 L 320 25 L 340 20 L 360 15 L 380 10 L 400 5"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="absolute bottom-2 left-2 text-xs text-slate-500">Jan</div>
                    <div className="absolute bottom-2 right-2 text-xs text-slate-500">Dec</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        {/* <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-12">
              Trusted by Traders Worldwide
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  "Vaidehi completely changed how I approach trading. The analytics are incredible!"
                </p>
                <p className="text-slate-900 font-semibold">Sarah M.</p>
                <p className="text-slate-500 text-xs">Day Trader</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  "Best trading journal I've used. Finally understanding my mistakes and improving."
                </p>
                <p className="text-slate-900 font-semibold">Michael R.</p>
                <p className="text-slate-500 text-xs">Swing Trader</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  "The routine builder keeps me disciplined. My consistency has improved dramatically."
                </p>
                <p className="text-slate-900 font-semibold">James L.</p>
                <p className="text-slate-500 text-xs">Options Trader</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of traders who are already improving their performance with Vaidehi
            </p>
            <a 
              href="/signup" 
              className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-slate-100 transition-all hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Get Started Free
            </a>
            <p className="text-sm text-indigo-200 mt-4">
              • No credit card require  • Cancel anytime
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}