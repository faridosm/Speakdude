import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  BookX, 
  UserX, 
  Clock,
  Frown,
  Brain,
  MessageSquare,
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
    <section className="py-12" style={{
      background: 'linear-gradient(135deg, #f5f7a8 0%, #e8d5ff 50%, #d4a5ff 100%)'
    }}>
      {/* Grid Pattern Background - Matching Hero */}
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
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Hero Section with Dynamic Language - Reduced sizes */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4 border border-white/30">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-gray-800 font-semibold text-xs">The Hidden Problem</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
              You Learned{' '}
              <span 
                className={`text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 transition-opacity duration-300 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {languages[currentLanguageIndex]}
              </span>
              <br />
              But Can You Actually{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Speak It?
              </span>
            </h2>
            
            <p className="text-base text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
              Millions of language learners face the same frustrating reality: they know the language in their head, 
              but can't speak it with their mouth.
            </p>
          </div>
        </div>

        {/* Pain Points Section - Reduced spacing and sizes */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Sound Familiar?
            </h3>
            <p className="text-gray-700 text-sm max-w-xl mx-auto font-medium">
              These are the most common struggles that keep language learners stuck in the "study forever, never speak" cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {painPoints.map((point, index) => (
              <div 
                key={index}
                className="group relative"
              >
                {/* Card - Reduced padding */}
                <div className={`bg-gradient-to-br ${point.bgGradient} rounded-2xl p-4 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden`}>
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
                  
                  {/* Content - Reduced sizes */}
                  <div className="relative z-10">
                    <div className={`w-10 h-10 ${point.iconBg} rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <point.icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <h4 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                      {point.title}
                    </h4>
                    
                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-600 transition-colors text-xs">
                      {point.description}
                    </p>
                    
                    {/* Animated underline */}
                    <div className={`w-0 h-0.5 bg-gradient-to-r ${point.gradient} rounded-full mt-3 group-hover:w-full transition-all duration-500`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solution Teaser - Without The Solution Button */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 max-w-3xl mx-auto shadow-lg">
            <div className="mb-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Traditional Learning Teaches{' '}
                <span className="text-orange-500">Knowledge</span>
                <br />
                Not{' '}
                <span className="text-orange-500">Fluency</span>
              </h3>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-4 font-medium">
                Real speaking fluency only comes through <strong className="text-orange-500">real practice</strong> — 
                the kind where you actually open your mouth, make mistakes, and build the muscle memory 
                that turns thinking into natural speech.
              </p>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <p className="text-lg font-bold text-gray-900">
                  Your brain knows the language;
                  <br />
                  <span className="text-orange-500">
                    now your mouth needs to learn it too.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}