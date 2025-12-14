// ====================
// FILE: src/app/(landing)/blog/page.tsx
// ====================
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Calendar, Clock } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "5 Daily Habits of Consistently Profitable Traders",
      excerpt: "Discover the routines and habits that separate successful traders from the rest.",
      category: "Trading Psychology",
      date: "Dec 10, 2024",
      readTime: "8 min read",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "How to Analyze Your Trading Performance Like a Pro",
      excerpt: "Master the key metrics that matter for improving your trading.",
      category: "Analytics",
      date: "Dec 8, 2024",
      readTime: "6 min read",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "The Ultimate Guide to Trading Journal Best Practices",
      excerpt: "Everything you need to know about keeping an effective trading journal.",
      category: "Education",
      date: "Dec 5, 2024",
      readTime: "10 min read",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Risk Management: Your First Line of Defense",
      excerpt: "Learn fundamental risk management strategies that protect your capital.",
      category: "Risk Management",
      date: "Dec 3, 2024",
      readTime: "7 min read",
      gradient: "from-red-500 to-rose-500"
    },
    {
      title: "Building a Pre-Market Routine That Works",
      excerpt: "Create a morning routine that sets you up for trading success.",
      category: "Routine",
      date: "Nov 30, 2024",
      readTime: "5 min read",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Common Trading Mistakes and How to Avoid Them",
      excerpt: "Learn from the mistakes of others and improve your trading.",
      category: "Education",
      date: "Nov 28, 2024",
      readTime: "9 min read",
      gradient: "from-cyan-500 to-blue-500"
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
              Vaidehi Blog
            </h1>
            <p className="text-xl text-slate-600">
              Trading insights, tips, and strategies to help you succeed
            </p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article 
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className={`h-48 bg-gradient-to-br ${post.gradient}`}></div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-slate-600 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-slate-600 mb-6">
              Get the latest trading tips and insights delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}