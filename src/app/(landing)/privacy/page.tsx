// ====================
// FILE: src/app/(landing)/privacy/page.tsx
// ====================
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600 mb-8">Last updated: December 14, 2024</p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-600">
                At Vaidehi, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our trading journal and 
                routine optimization platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
              <p className="text-slate-600 mb-4">We collect information that you provide directly to us:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Account information (name, email, password)</li>
                <li>Trading data (trades, strategies, analytics)</li>
                <li>Routine and habit tracking data</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Communications with our support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns to improve user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
              <p className="text-slate-600">
                We implement industry-standard security measures including 256-bit SSL encryption, 
                secure data centers, and regular security audits to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Sharing</h2>
              <p className="text-slate-600">
                We do not sell your personal information. We only share your data with:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Service providers who assist in operating our platform</li>
                <li>Law enforcement when required by law</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
              <p className="text-slate-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies</h2>
              <p className="text-slate-600">
                We use cookies and similar technologies to enhance your experience, analyze usage, 
                and assist in our marketing efforts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact Us</h2>
              <p className="text-slate-600">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-slate-600 mt-2">
                Email: privacy@vaidehi.app<br />
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