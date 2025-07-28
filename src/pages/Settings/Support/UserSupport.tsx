import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  HelpCircle, 
  Book, 
  Settings, 
  Heart, 
  Activity, 
  Zap, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  User,
  Shield,
  CreditCard,
  Smartphone,
  Globe,
  Clock
} from 'lucide-react';
import Header from '../../../components/Header';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How do I reset my password?",
    answer: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a reset link.",
    category: "Account"
  },
  {
    id: 2,
    question: "How does the AI nutrition analysis work?",
    answer: "Our AI analyzes your food photos using advanced computer vision and nutritional databases to provide accurate calorie counts and nutritional information.",
    category: "Features"
  },
  {
    id: 3,
    question: "Can I sync my fitness tracker data?",
    answer: "Yes! NutriAI supports integration with popular fitness trackers including Fitbit, Apple Health, and Google Fit.",
    category: "Integration"
  },
  {
    id: 4,
    question: "Is my personal data secure?",
    answer: "Absolutely. We use bank-level encryption and follow strict privacy protocols. Your data is never shared with third parties without your consent.",
    category: "Privacy"
  },
  {
    id: 5,
    question: "How accurate is the calorie counting?",
    answer: "Our AI achieves 95%+ accuracy in calorie estimation. For best results, ensure good lighting and clear photos of your meals.",
    category: "Features"
  },
  {
    id: 6,
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period.",
    category: "Billing"
  }
];

const helpCategories = [
  {
    icon: User,
    title: "Account Management",
    description: "Profile settings, password reset, account deletion",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: Smartphone,
    title: "App Features",
    description: "AI scanning, meal planning, progress tracking",
    color: "from-cyan-400 to-blue-500"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Data protection, privacy settings, security features",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: CreditCard,
    title: "Billing & Subscriptions",
    description: "Payment methods, subscription plans, billing issues",
    color: "from-indigo-400 to-blue-500"
  },
  {
    icon: Globe,
    title: "Integrations",
    description: "Fitness trackers, health apps, third-party connections",
    color: "from-cyan-400 to-sky-400"
  },
  {
    icon: Settings,
    title: "Technical Support",
    description: "Bug reports, app crashes, performance issues",
    color: "from-blue-400 to-cyan-500"
  }
];

export default function UserSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Account', 'Features', 'Integration', 'Privacy', 'Billing'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-sans">
      {/* Enhanced Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Aurora Waves */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-blue-600/30 transform rotate-12 scale-150 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-300/25 via-blue-400/35 to-indigo-500/25 transform -rotate-12 scale-150 animate-pulse delay-1000"></div>
        </div>

        {/* Floating Aurora Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/60 via-cyan-300/70 to-blue-500/60 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/50 via-blue-300/60 to-indigo-400/50 rounded-full blur-3xl animate-bounce delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-sky-400/55 via-blue-400/65 to-cyan-500/55 rounded-full blur-3xl animate-bounce delay-2000"></div>
        </div>
        
        {/* Animated Light Rays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-cyan-400/60 via-transparent to-blue-500/60 transform rotate-12 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-2 h-full bg-gradient-to-b from-blue-400/50 via-transparent to-cyan-500/50 transform -rotate-12 animate-pulse delay-1000"></div>
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-300 rounded-full opacity-70 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Enhanced Floating Health Icons */}
      <div className="absolute w-full h-full pointer-events-none z-10 select-none">
        <div className="absolute top-[15%] left-[10%] text-4xl animate-bounce">
          <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full p-3 shadow-lg">
            <HelpCircle className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="absolute top-[45%] left-[85%] text-4xl animate-bounce delay-500">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-3 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="absolute top-[25%] left-[75%] text-4xl animate-bounce delay-1000">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-3 shadow-lg">
            <Book className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <div className="absolute top-[70%] left-[15%] text-3xl animate-bounce delay-1500">
          <div className="bg-gradient-to-r from-sky-400 to-blue-400 rounded-full p-2 shadow-lg">
            <Sparkles className="w-6 h-6 text-white animate-spin" />
          </div>
        </div>
      </div>

      <Header />

      {/* Main Content */}
      <div className="relative z-20 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="relative inline-block">
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
              <h1 className="relative text-5xl sm:text-6xl font-extrabold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent flex items-center justify-center gap-4">
                  <HelpCircle className="w-16 h-16 text-cyan-400 animate-bounce" />
                  User Support
                </span>
              </h1>
            </div>
            <p className="text-blue-200 text-xl max-w-2xl mx-auto">
              We're here to help! Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-16">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
            <div className="relative bg-white/90 backdrop-blur-3xl border-2 border-blue-200/60 rounded-2xl p-6 shadow-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-500" />
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-blue-50/50 border-2 border-blue-200/50 rounded-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Help Categories */}
          <div className="mb-16">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
              <div className="relative bg-white/90 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Help Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {helpCategories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                      <div key={index} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                          <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-blue-800 mb-2">{category.title}</h3>
                          <p className="text-blue-600 text-sm">{category.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-xl opacity-40 animate-pulse"></div>
              <div className="relative bg-white/90 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </h2>
                
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-blue-50/50 backdrop-blur-sm border border-blue-200/50 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-blue-100/50 transition-all duration-300"
                        >
                          <span className="text-blue-800 font-medium">{faq.question}</span>
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-blue-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-blue-600" />
                          )}
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="px-6 pb-4 text-blue-700 animate-in slide-in-from-top-2 duration-300">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
            <div className="relative bg-white/90 backdrop-blur-3xl border-2 border-blue-200/60 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Contact Support
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Live Chat */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border border-green-200/50 rounded-2xl p-6 text-center hover:bg-white/90 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Live Chat</h3>
                    <p className="text-green-600 text-sm mb-4">Get instant help from our support team</p>
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Available 24/7</span>
                    </div>
                  </div>
                </div>

                {/* Email Support */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6 text-center hover:bg-white/90 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Email Support</h3>
                    <p className="text-blue-600 text-sm mb-4">Send us your questions via email</p>
                    <div className="flex items-center justify-center gap-2 text-blue-700">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Response within 2 hours</span>
                    </div>
                  </div>
                </div>

                {/* Phone Support */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl p-6 text-center hover:bg-white/90 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Phone Support</h3>
                    <p className="text-purple-600 text-sm mb-4">Speak directly with our support team</p>
                    <div className="flex items-center justify-center gap-2 text-purple-700">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Mon-Fri 9AM-6PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-cyan-400/35 to-blue-500/35 rounded-full blur-2xl animate-bounce delay-1000"></div>
    </div>
  );
}