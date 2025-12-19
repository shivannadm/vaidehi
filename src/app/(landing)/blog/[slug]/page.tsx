// ====================
// FILE: src/app/(landing)/blog/[slug]/page.tsx
// ====================
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NewsletterSubscription from "../../components/NewsletterSubscription";
import { Calendar, Clock, ArrowLeft, Tag, User } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getRelatedPosts, blogPosts } from "../../../../data/blogData";

// Generate static params for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Define the props interface - params is now a Promise in Next.js 15
interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Main component - MUST BE ASYNC in Next.js 15
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Await the params (Next.js 15 requirement)
  const { slug } = await params;
  
  // Get the blog post by slug
  const post = getBlogPostBySlug(slug);

  // If post not found, show 404
  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = getRelatedPosts(slug);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Gradient */}
        <div className={`bg-gradient-to-br ${post.gradient} py-20`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            
            <div className="flex items-center gap-4 text-white/90 text-sm mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full font-medium">
                {post.category}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-white/90 mb-6">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-3 text-white/80">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-white">{post.author.name}</div>
                <div className="text-sm">{post.author.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-slate-700 leading-relaxed font-light">
              {post.content.introduction}
            </p>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-12">
            {post.content.sections.map((section, index) => (
              <section key={index} className="scroll-mt-20">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 border-b-4 border-indigo-500 pb-3 inline-block">
                  {section.heading}
                </h2>
                
                <p className="text-lg text-slate-700 leading-relaxed mb-8">
                  {section.content}
                </p>

                {/* Subsections */}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="space-y-8 ml-4 border-l-2 border-slate-200 pl-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                          {subsection.subheading}
                        </h3>
                        <p className="text-slate-700 leading-relaxed">
                          {subsection.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Conclusion */}
          <div className="mt-16 p-8 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Conclusion</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="mt-12 p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">💡</span> Key Takeaways
            </h2>
            <ul className="space-y-3">
              {post.content.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-yellow-300 font-bold mt-1">✓</span>
                  <span className="text-white/95 leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Tag className="w-5 h-5 text-slate-400" />
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-slate-50 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">
                Related Articles
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all group"
                  >
                    <div className={`h-40 bg-gradient-to-br ${relatedPost.gradient}`}></div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                          {relatedPost.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {relatedPost.readTime}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-slate-600 text-sm line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Newsletter CTA - Now with working functionality */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsletterSubscription variant="gradient" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}