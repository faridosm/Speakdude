import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  BookX, 
  UserX, 
  Clock,
  Frown,
  Brain,
  MessageSquare,
  Zap,
  Target,
  TrendingDown,
  Users,
  BookOpen,
  Volume2
} from 'lucide-react';

interface ProblemStatementProps {
  onNavigate?: (page: string) => void;
}

export function ProblemStatement({ onNavigate }: ProblemStatementProps) {
  const languages = ['Spanish', 'French', 'Hindi', 'German', 'Italian', 'Japanese', 'Korean', 'Arabic'];
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentLanguageIndex((prevIndex) => 
          (prevIndex + 1) % languages.length
        );
        setIsVisible(true);
      }, 300);
      
    }, 2500);

    return () => clearInterval(interval);
  }, [languages.length]);

  const handleStartSpeaking = () => {
    if (onNavigate) {
      onNavigate('login');
    }
  };

  const problemStats = [
    { icon: Users, number: "87%", text: "of language learners", subtext: "struggle with speaking confidence" },
    { icon: Clock, number: "5+ years", text: "average study time", subtext: "before first real conversation" },
    { icon: TrendingDown, number: "73%", text: "give up learning", subtext: "due to speaking anxiety" }
  ];

  const painPoints = [
    {
      icon: Brain,
      title: "Years of Grammar Rules",
      description: "Memorized every conjugation, but freeze when someone says 'Hello'",
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 to-pink-50",
      iconBg: "bg-gradient-to-br from-red-500 to-pink-500"
    },
    {
      icon: BookOpen,
      title: "Thousands of Words",
      description: "Know vocabulary perfectly on paper, but can't recall in conversation",
      gradient: "from-orange-500 to-yellow-500",
      bgGradient: "from-orange-50 to-yellow-50",
      iconBg: "bg-gradient-to-br from-orange-500 to-yellow-500"
    },
    {
      icon: Volume2,
      title: "Silent Understanding",
      description: "Understand everything you hear, but can't speak a single sentence",
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
      iconBg: "bg-gradient-to-br from-purple-500 to-indigo-500"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/5 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Hero Section with Dynamic Language */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold text-sm">The Hidden Problem</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              You Learned{' '}
              <span 
                className={`inline-block transition-all duration-300 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{
                  background: 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
                  backgroundSize: '300% 300%',
                  animation: 'gradientShift 3s ease infinite',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {languages[currentLanguageIndex]}
              </span>
              <br />
              But Can You Actually{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Speak It?
              </span>
            </h2>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Millions of language learners face the same frustrating reality: they know the language in their head, 
              but can't speak it with their mouth.
            </p>
          </div>

          {/* Problem Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {problemStats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white">{stat.number}</div>
                  <div className="text-white/90 font-semibold">{stat.text}</div>
                  <div className="text-white/70 text-sm">{stat.subtext}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pain Points Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sound Familiar?
            </h3>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              These are the most common struggles that keep language learners stuck in the "study forever, never speak" cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {painPoints.map((point, index) => (
              <div 
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className={`bg-gradient-to-br ${point.bgGradient} rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div 
                      style={{
                        backgroundImage: `radial-gradient(circle at 20px 20px, currentColor 2px, transparent 0)`,
                        backgroundSize: '40px 40px'
                      }}
                      className="w-full h-full"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`w-16 h-16 ${point.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <point.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                      {point.title}
                    </h4>
                    
                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-600 transition-colors">
                      {point.description}
                    </p>
                    
                    {/* Animated underline */}
                    <div className={`w-0 h-1 bg-gradient-to-r ${point.gradient} rounded-full mt-4 group-hover:w-full transition-all duration-500`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solution Teaser */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full px-4 py-2 mb-4">
                <Zap className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">The Solution</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Traditional Learning Teaches{' '}
                <span className="text-red-300">Knowledge</span>
                <br />
                Not{' '}
                <span className="text-green-300">Fluency</span>
              </h3>
              
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                Real speaking fluency only comes through <strong className="text-yellow-300">real practice</strong> — 
                the kind where you actually open your mouth, make mistakes, and build the muscle memory 
                that turns thinking into natural speech.
              </p>
              
              <div className="bg-white/10 rounded-2xl p-6 mb-6">
                <p className="text-2xl font-bold text-white">
                  Your brain knows the language;
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                    now your mouth needs to learn it too.
                  </span>
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={handleStartSpeaking}
              className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl overflow-hidden"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <MessageSquare className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Start Speaking Today</span>
              <Target className="w-6 h-6 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}