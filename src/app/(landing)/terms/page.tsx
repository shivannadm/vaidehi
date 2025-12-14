// ====================
// FILE: src/app/(landing)/terms/page.tsx
// ====================
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-600 mb-8">Last updated: December 14, 2024</p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600">
                By accessing and using Vaidehi, you accept and agree to be bound by the terms and 
                provisions of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
              <p className="text-slate-600">
                Vaidehi provides a trading journal and routine optimization platform. We reserve the 
                right to modify, suspend, or discontinue any aspect of the service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>You must be at least 18 years old to create an account</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must provide accurate and complete information</li>
                <li>One person or legal entity may maintain only one account</li>
                <li>You are responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Acceptable Use</h2>
              <p className="text-slate-600 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit malicious code or viruses</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Use the service for any illegal purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Payment Terms</h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Subscription fees are billed in advance</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We offer a 14-day money-back guarantee for new subscriptions</li>
                <li>Prices are subject to change with 30 days notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Intellectual Property</h2>
              <p className="text-slate-600">
                All content, features, and functionality are owned by Vaidehi and protected by 
                international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Termination</h2>
              <p className="text-slate-600">
                We may terminate or suspend your account immediately, without prior notice, for any 
                breach of these Terms. You may cancel your account at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-slate-600">
                Vaidehi shall not be liable for any indirect, incidental, special, consequential, or 
                punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Disclaimer</h2>
              <p className="text-slate-600">
                Trading involves risk. Vaidehi is a journaling and analytics tool and does not provide 
                financial advice. Past performance is not indicative of future results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Contact Information</h2>
              <p className="text-slate-600">
                For questions about these Terms, please contact us at:
              </p>
              <p className="text-slate-600 mt-2">
                Email: legal@vaidehi.app<br />
                Address: 123 Trading Street, New York, NY 10001
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}