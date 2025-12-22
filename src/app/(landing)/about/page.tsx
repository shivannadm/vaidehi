// ====================
// FILE: src/app/(landing)/about/page.tsx
// ====================
"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Target, Users, Zap, Heart, CheckCircle2, TrendingUp, Calendar, Code2, Palette, BarChart3 } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Consistency First",
      description: "We believe consistency is the foundation of success. Whether you're trading, studying, or building habits, Vaidehi helps you stay on track every single day."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Built for Everyone",
      description: "From students managing assignments to traders analyzing markets and professionals building routines - Vaidehi adapts to your unique journey."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Simple & Powerful",
      description: "Complex doesn't mean complicated. We've crafted an intuitive platform that puts powerful analytics and tracking tools at your fingertips."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Data-Driven Growth",
      description: "Every feature is designed to provide actionable insights. Track your progress, identify patterns, and optimize your path to success."
    }
  ];

  const features = [
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "ToDo & Task Management",
      description: "Organize your tasks, set priorities, track time, and build productivity streaks"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Routine Journaling",
      description: "Build consistent habits with morning, evening, and health routines that stick"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Trading Analytics",
      description: "Upload trades and get 15+ advanced metrics including Sharpe ratio, win rate, and drawdown analysis"
    }
  ];

  const stats = [
    { value: "3+", label: "Core Features" },
    { value: "24/7", label: "Progress Tracking" },
    { value: "15+", label: "Trading Metrics" },
    { value: "2025", label: "Founded" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-indigo-50 to-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              About Vaidehi
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Your all-in-one platform for building consistency across every area of life. 
              Track tasks, optimize routines, and analyze performance - all in one place.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 mb-4">
              Vaidehi was created with a simple yet powerful vision: to help people achieve consistency 
              in everything they do. Whether you're a student striving for academic excellence, a professional 
              building productive habits, or a trader optimizing your strategy - consistency is the key to success.
            </p>
            <p className="text-lg text-slate-600 mb-4">
              We understand that different goals require different tools. That's why Vaidehi brings together 
              three powerful modules: <strong>Task Management</strong> for daily productivity, <strong>Routine 
              Journaling</strong> for habit building, and <strong>Trading Analytics</strong> for data-driven 
              performance optimization.
            </p>
            <p className="text-lg text-slate-600">
              Every feature is designed to provide actionable insights, help you identify patterns, and keep 
              you accountable on your journey to achieving your goals. With Vaidehi, consistency isn't just 
              a habit - it's a lifestyle.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">What We Offer</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Three powerful tools working together to help you build consistency across all areas of your life
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all"
              >
                <div className="text-indigo-600 mb-4 bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Our Core Values</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all"
                >
                  <div className="text-indigo-600 mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="bg-gradient-to-b from-white to-slate-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Meet the Creator</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Built by someone who understands the struggles and triumphs of building consistency
            </p>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-slate-200">
                  <Image
                    src="/assets/dev3.png"
                    alt="Shivanna - Developer"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover grayscale"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-indigo-500', 'via-purple-500', 'to-pink-500');
                    }}
                  />
                  <div className="hidden absolute inset-0 items-center justify-center">
                    <Code2 className="w-20 h-20 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Shivanna</h3>
              <p className="text-indigo-600 font-semibold mb-4">Founder & Full Stack Developer</p>
              
              <div className="text-center text-slate-600 max-w-2xl mb-6 space-y-3">
                <p>
                  With 3 years of hands-on trading experience, I understand firsthand the importance of 
                  consistency, discipline, and data-driven decision making. As a trader, I faced the same 
                  challenges you do - staying organized, building habits, and analyzing performance.
                </p>
                <p>
                  As a Full Stack Developer and UI/UX Designer, I combined my trading insights with technical 
                  expertise to build Vaidehi - a platform that solves real problems for real people. Every 
                  feature is crafted with attention to detail, optimized performance, and a user-first approach.
                </p>
                <p>
                  My goal is simple: create tools that help you become the best version of yourself, whether 
                  you're in the markets, the classroom, or pursuing personal growth.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Full Stack Development
                </span>
                <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  UI/UX Design
                </span>
                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  3+ Years Trading
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Your Consistency Journey Today
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands who are building better habits, tracking their progress, and achieving their goals
            </p>
            <a 
              href="/signup" 
              className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-slate-100 transition-all hover:scale-105 font-semibold text-lg shadow-lg"
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