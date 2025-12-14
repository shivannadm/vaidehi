// ====================
// FILE: src/app/(landing)/docs/page.tsx
// ====================
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Documentation</h1>
          
          <div className="prose prose-slate max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Getting Started</h2>
              <p className="text-slate-600 mb-4">
                Welcome to Vaidehi! This documentation will help you get started with our trading journal and routine optimization platform.
              </p>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 my-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">Quick Start</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>Sign up for an account</li>
                  <li>Complete your profile setup</li>
                  <li>Start logging your trades</li>
                  <li>Build your daily routines</li>
                  <li>Track your progress</li>
                </ol>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Features Overview</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">📊 Trading Journal</h3>
                  <p className="text-slate-600 text-sm">
                    Log every trade with detailed entries including entry/exit prices, strategies, emotions, and outcomes.
                  </p>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">📈 Analytics</h3>
                  <p className="text-slate-600 text-sm">
                    Visualize your performance with comprehensive charts, win rates, profit factors, and more.
                  </p>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">✅ TODO System</h3>
                  <p className="text-slate-600 text-sm">
                    Manage tasks, projects, and daily highlights to stay organized and focused.
                  </p>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">🌅 Routine Builder</h3>
                  <p className="text-slate-600 text-sm">
                    Create morning and evening routines, track habits, and monitor your health.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Need Help?</h2>
              <p className="text-slate-600 mb-4">
                If you have any questions or need assistance, please don't hesitate to reach out to our support team.
              </p>
              <a 
                href="/signup" 
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                Get Started Now
              </a>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}