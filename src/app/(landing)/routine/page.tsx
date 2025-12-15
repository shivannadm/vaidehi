// ====================
// FILE: src/app/(landing)/routine/page.tsx
// ====================
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Coffee, Moon, Heart, Target } from "lucide-react";

export default function RoutinePage() {
  const routineFeatures = [
    {
      icon: <Coffee className="w-10 h-10" />,
      title: "Morning Routine",
      description: "Start your day right with a structured pre-market routine that sets you up for success.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Moon className="w-10 h-10" />,
      title: "Evening Routine",
      description: "Wind down with post-market analysis and reflection to continuously improve.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Health Tracking",
      description: "Monitor sleep, exercise, and wellness metrics that impact your performance.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Target className="w-10 h-10" />,
      title: "Habit Building",
      description: "Build consistent habits with tracking, streaks, and insights into your progress.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Build Winning Routines
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Consistency is the key to any success. Create powerful daily routines that keep you disciplined and focused.
            </p>
            <a 
              href="/signup" 
              className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Start Building Habits
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {routineFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-xl transition-all group"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Demo */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Your Day, Optimized
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
              {/* Morning */}
              <div className="p-8 border-b border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <Coffee className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-semibold text-slate-900">Morning (6:00 AM - 9:00 AM)</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                    <span className="text-slate-700">Wake up & hydrate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                    <span className="text-slate-700">Review market news & economic calendar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                    <span className="text-slate-700">Set trading goals for the day</span>
                  </div>
                </div>
              </div>

              {/* Evening */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Moon className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl font-semibold text-slate-900">Evening (6:00 PM - 9:00 PM)</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-300"></div>
                    <span className="text-slate-500">Journal today's trades</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-300"></div>
                    <span className="text-slate-500">Review performance metrics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-300"></div>
                    <span className="text-slate-500">Plan tomorrow's strategy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}