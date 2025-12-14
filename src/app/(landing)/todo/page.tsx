// ====================
// FILE: src/app/(landing)/todo/page.tsx
// ====================
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CheckSquare, Calendar, Lightbulb, FolderOpen } from "lucide-react";

export default function TodoPage() {
  const features = [
    {
      icon: <CheckSquare className="w-8 h-8" />,
      title: "Task Management",
      description: "Create, organize, and track all your tasks in one place with tags, priorities, and due dates."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Scheduling",
      description: "Plan your day with an intelligent calendar that helps you stay on track and meet deadlines."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Daily Highlights",
      description: "Set your most important goals each day and reflect on your achievements."
    },
    {
      icon: <FolderOpen className="w-8 h-8" />,
      title: "Project Organization",
      description: "Group related tasks into projects with milestones and progress tracking."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-indigo-50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Stay Organized, Stay Productive
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              A powerful TODO system designed for people who want to maximize their productivity
            </p>
            <a 
              href="/signup" 
              className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Start Organizing Now
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all"
              >
                <div className="text-indigo-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Everything You Need in One Place
            </h2>
            
            <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-white text-sm">3</div>
                  <span className="text-slate-700">Update trading journal</span>
                  <span className="ml-auto text-xs text-slate-500">Tomorrow, 10:00 AM</span>
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