import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  BookOpen, 
  Mic, 
  Globe, 
  Zap, 
  Star, 
  CheckCircle, 
  Bell, 
  Plus, 
  Heart, 
  ArrowRight, 
  Search,
  Target,
  Brain,
  Calendar,
  Shield,
  BarChart3,
  Clock,
  Award,
  Gamepad2,
  Bot,
  Volume2,
  Eye,
  Headphones,
  TrendingUp,
  Users2,
  Mail,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  X,
  Play
} from 'lucide-react';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { Hero } from './components/home/Hero';
import { Features } from './components/home/Features';
import { ProblemStatement } from './components/home/ProblemStatement';
import { ProblemSolution } from './components/home/ProblemSolution';
import { LunaFeature } from './components/home/LunaFeature';
import { SupportPage } from './components/SupportPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'login', 'signup', 'support', 'dashboard'
  const { user, loading } = useAuth();

  // Auto-redirect authenticated users to dashboard
  React.useEffect(() => {
    if (user && currentPage === 'home') {
      setCurrentPage('dashboard');
    }
  }, [user, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'login') {
    return <LoginPage onNavigate={setCurrentPage} isSignUp={false} />;
  }

  if (currentPage === 'signup') {
    return <LoginPage onNavigate={setCurrentPage} isSignUp={true} />;
  }

  if (currentPage === 'support') {
    return <SupportPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'dashboard') {
    return (
      <ProtectedRoute fallback={<LoginPage onNavigate={setCurrentPage} isSignUp={false} />}>
        <Dashboard onNavigate={setCurrentPage} />
      </ProtectedRoute>
    );
  }

  const handleCTAClick = () => {
    if (user) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('signup');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Bolt.new Badge - Bottom Right - Increased Size */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://bolt.new/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:scale-110 transition-transform duration-300"
        >
          <img 
            src="/black_circle_360x360.png" 
            alt="Built with Bolt.new" 
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
          />
        </a>
      </div>

      {/* Hero Section with Grid Lines */}
      <Hero user={user} onNavigate={setCurrentPage} />

      {/* Features Section - Added right after Hero */}
      <Features />

      {/* Luna Feature Section - NEW */}
      <LunaFeature onNavigate={setCurrentPage} />

      {/* Problem Statement Section */}
      <ProblemStatement onNavigate={setCurrentPage} />

      {/* Problem-Solution Section */}
      <ProblemSolution onNavigate={setCurrentPage} />

      {/* No Judgment. Just Progress - Updated Background */}
      <section className="py-16" style={{
        background: 'linear-gradient(135deg, #f5f7a8 0%, #e8d5ff 50%, #d4a5ff 100%)'
      }}>
        {/* Grid Pattern Background - Matching Problem Statement */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.25) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.25) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              No Judgment. <span className="text-green-600">Just Progress.</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in a world where everyone deserves to learn without fear. SpeakFlow provides a completely private, encouraging environment — no teachers watching, no peers judging.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: X, title: "No cameras or peer review", color: "bg-red-100 text-red-600" },
              { icon: Heart, title: "Practice on your own terms", color: "bg-pink-100 text-pink-600" },
              { icon: Target, title: "Focused on building confidence", color: "bg-blue-100 text-blue-600" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Real Progress */}
      <section className="py-16" style={{
        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">
                See How Far <span className="text-green-600">You've Come</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Progress tracking designed for speakers, not silent learners.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Calendar, text: "Calendar heatmap of speaking days" },
                  { icon: BarChart3, text: "Track words spoken, mistakes corrected" },
                  { icon: Award, text: "Milestones and badges to keep you moving" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-7 gap-2 mb-6">
                {Array.from({ length: 35 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded ${
                      Math.random() > 0.7 ? 'bg-green-500' : 
                      Math.random() > 0.5 ? 'bg-green-300' : 
                      Math.random() > 0.3 ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  ></div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">23 days active</div>
                <div className="text-gray-600">This month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SpeakFlow */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Why Learners <span className="text-orange-500">Love SpeakDude</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Support Mulitple languages",
                description: "Built for learners of all backgrounds and accents.",
                image: "https://images.pexels.com/photos/92331/pexels-photo-92331.jpeg",
                color: "bg-pink-500"
              },
              {
                icon: Target,
                title: "Practice by Doing",
                description: "Forget passive learning—SpeakFlow focuses on real conversation.",
                image: "https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg",
                color: "bg-blue-500"
              },
              {
                icon: TrendingUp,
                title: "Transparent Progress",
                description: "Weekly summaries, word counts, and usage time clearly displayed.",
                image: "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg",
                color: "bg-green-500"
              },
              {
                icon: Eye,
                title: "Jugdement Free",
                description: " Speak freely, make mistakes beacuse AI don't judge.",
                image: "https://images.pexels.com/photos/6517287/pexels-photo-6517287.jpeg",
                color: "bg-purple-500"
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-48">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 left-4 w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
      }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Start Speaking the Language You've Been Trying to Learn
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            No more memorizing. No more fear. Just real, confident practice — every day.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleCTAClick}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Start Speaking Now</span>
            </button>
            <button 
              onClick={handleCTAClick}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>No Credit Card Required</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SpeakDude</span>
              </div>
              <p className="text-gray-400 mb-4">The AI-Powered Speaking Platform</p>
              <p className="text-gray-400 text-sm">
                123 AI Lane<br />
                San Francisco, CA
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <div className="space-y-3">
                {['Courses', 'Practice Sessions', 'Progress Tracker', 'Support'].map((link, index) => (
                  <a key={index} href="#" className="block text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Social Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Social</h3>
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Youtube, href: "#" }
                ].map((social, index) => (
                  <a 
                    key={index} 
                    href={social.href} 
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-6">Newsletter Signup</h3>
              <p className="text-gray-400 text-sm mb-4">
                Stay updated with the latest features and speaking tips.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-red-500 text-white"
                />
                <button className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-r-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 SpeakFlow. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;