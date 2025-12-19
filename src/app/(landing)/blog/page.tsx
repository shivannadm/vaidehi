// ====================
// FILE: src/app/(landing)/blog/page.tsx
// ====================
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsletterSubscription from "../components/NewsletterSubscription";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "../../../data/blogData";

export default function BlogPage() {
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
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
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
                  
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                    <span className="text-indigo-600 group-hover:text-indigo-700 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter CTA - Now with working functionality */}
        <NewsletterSubscription />
      </main>

      <Footer />
    </div>
  );
}