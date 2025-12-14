// ====================
// FILE: src/app/(landing)/support/page.tsx
// ====================
"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Mail, MessageCircle, Book, Send, Clock, CheckCircle } from "lucide-react";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    priority: "normal",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Support ticket submitted! We'll get back to you within 24 hours.");
    setFormData({ 
      name: "", 
      email: "", 
      category: "", 
      priority: "normal",
      subject: "", 
      message: "" 
    });
  };

  const supportOptions = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support",
      description: "Get help via email. We typically respond within 24 hours.",
      action: "Send Email",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time during business hours.",
      action: "Start Chat",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Book className="w-8 h-8" />,
      title: "Documentation",
      description: "Browse our comprehensive guides and tutorials.",
      action: "View Docs",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const responseTime = [
    { plan: "Free", time: "24-48 hours", icon: <Clock className="w-5 h-5" /> },
    { plan: "Pro", time: "12-24 hours", icon: <Clock className="w-5 h-5" /> },
    { plan: "Team", time: "4-8 hours", icon: <CheckCircle className="w-5 h-5 text-green-600" /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-indigo-50 to-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              How Can We Help?
            </h1>
            <p className="text-xl text-slate-600">
              Our support team is here to assist you with any questions or issues
            </p>
          </div>
        </div>

        {/* Support Options */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {supportOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-all text-center"
              >
                <div className={`inline-flex p-4 rounded-lg bg-gradient-to-br ${option.color} text-white mb-4`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {option.title}
                </h3>
                <p className="text-slate-600 mb-6">
                  {option.description}
                </p>
                <button className="text-indigo-600 hover:text-indigo-700 font-semibold">
                  {option.action} →
                </button>
              </div>
            ))}
          </div>

          {/* Response Time Table */}
          <div className="bg-slate-50 rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Response Times by Plan
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {responseTime.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center border border-slate-200">
                  <div className="flex justify-center mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.plan}</h3>
                  <p className="text-slate-600">{item.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Support Form */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Submit a Support Ticket
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="account">Account Help</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                    placeholder="Please provide as much detail as possible..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold"
                >
                  <Send className="w-5 h-5" />
                  Submit Ticket
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-slate-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">
              Quick Links
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="/faq"
                className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-slate-900 mb-2">FAQ</h3>
                <p className="text-sm text-slate-600">
                  Find answers to frequently asked questions
                </p>
              </a>
              <a
                href="/docs"
                className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-slate-900 mb-2">Documentation</h3>
                <p className="text-sm text-slate-600">
                  Browse our comprehensive guides and tutorials
                </p>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}