// ====================
// FILE: src/app/(landing)/about/page.tsx
// ====================
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Target, Users, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Focus on Results",
      description: "We're obsessed with helping traders achieve consistent profitability through data-driven insights."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Trader-First Design",
      description: "Built by traders, for traders. Every feature is designed with real trading workflows in mind."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Simple & Powerful",
      description: "We believe powerful tools don't need to be complicated. Vaidehi is intuitive yet comprehensive."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community Driven",
      description: "Your feedback shapes our product. We're constantly improving based on what traders actually need."
    }
  ];

  const stats = [
    { value: "1,200+", label: "Active Traders" },
    { value: "50,000+", label: "Trades Logged" },
    { value: "65%", label: "Avg Win Rate" },
    { value: "2024", label: "Founded" }
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
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're on a mission to help traders achieve consistent profitability through better journaling, 
              analytics, and routine optimization.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p className="text-lg text-slate-600 mb-4">
              Vaidehi was born from a simple frustration: existing trading journals were either too complex 
              or too simplistic. As active traders ourselves, we knew there had to be a better way.
            </p>
            <p className="text-lg text-slate-600 mb-4">
              We spent months researching what actually helps traders improve. The answer was clear: 
              consistent journaling, data-driven analytics, and structured routines. But these needed to 
              be seamlessly integrated into a single, intuitive platform.
            </p>
            <p className="text-lg text-slate-600">
              Today, Vaidehi helps over 1,200 traders around the world track their performance, identify 
              patterns, and build the discipline needed for long-term success. We're just getting started.
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

        {/* Values Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Our Values</h2>
          
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

        {/* Team Section */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Meet the Team</h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              We're a small but passionate team of traders, developers, and designers working to build 
              the best trading journal in the world.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Alex Chen", role: "Founder & CEO", image: "from-blue-500 to-indigo-500" },
                { name: "Sarah Johnson", role: "Head of Product", image: "from-purple-500 to-pink-500" },
                { name: "Michael Rodriguez", role: "Lead Developer", image: "from-green-500 to-emerald-500" }
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${member.image} mx-auto mb-4`}></div>
                  <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                  <p className="text-sm text-slate-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Start your journey to becoming a consistently profitable trader today
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