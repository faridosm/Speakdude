import React from 'react';
import { 
  Bot, 
  MessageCircle, 
  Sparkles, 
  Globe, 
  Heart,
  ArrowRight,
  Video,
  Mic,
  Eye
} from 'lucide-react';

interface LunaFeatureProps {
  onNavigate?: (page: string) => void;
}

export function LunaFeature({ onNavigate }: LunaFeatureProps) {
  const handleStartPractice = () => {
    if (onNavigate) {
      onNavigate('login');
    }
  };

  const features = [
    {
      icon: Video,
      title: "Real-time Video Chat",
      description: "Face-to-face conversations with Luna through high-quality video calls",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: Globe,
      title: "30 Languages",
      description: "Practice English, Spanish, French, Hindi, Japanese, and many more",
      iconBg: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      icon: Heart,
      title: "Patient & Encouraging",
      description: "Luna adapts to your pace and provides gentle, supportive feedback",
      iconBg: "bg-gradient-to-br from-pink-500 to-pink-600"
    },
    {
      icon: Eye,
      title: "Natural Interactions",
      description: "Luna can see, hear, and respond just like a real conversation partner",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-red-500" />
                  <span className="text-red-600 font-semibold text-sm uppercase tracking-wide">Meet Luna</span>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                Your Personal AI
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                  Language Tutor
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Luna is your dedicated AI conversation partner who looks, sounds, and responds like a native speaker. 
                Practice real conversations without judgment, available 24/7 whenever you're ready to learn.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-gray-100 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 ${feature.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-xs mb-1">{feature.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button 
                onClick={handleStartPractice}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-full text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 group"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Chatting with Luna</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Right Side - Luna Image with Interactive Elements */}
          <div className="relative">
            {/* Main Luna Image Container */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-100">
              {/* Floating conversation bubbles */}
              <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-md border border-gray-100 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">Hello! Ready to practice?</span>
                </div>
              </div>
              
              <div className="absolute -top-2 -right-6 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl px-3 py-1.5 shadow-md animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
                <span className="text-xs font-medium">¡Hola! ¿Cómo estás?</span>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-md border border-gray-100 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-700">Great pronunciation!</span>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
              </div>

              {/* Luna Image */}
              <div className="relative">
                <img 
                  src="/luna.png" 
                  alt="Luna - Your AI Language Tutor" 
                  className="w-full h-auto max-w-md mx-auto rounded-2xl shadow-lg"
                />
                
                {/* Glowing effect around Luna */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-2xl blur-xl -z-10"></div>
              </div>

              {/* Interactive elements */}
              <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md border border-gray-100 animate-pulse">
                  <Mic className="w-5 h-5 text-gray-700" />
                </div>
              </div>
              
              <div className="absolute top-1/3 -right-8">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-2 shadow-md animate-pulse" style={{ animationDelay: '1s' }}>
                  <Video className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-red-200 to-orange-200 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-orange-200 to-red-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }}></div>
            <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '4s' }}></div>
          </div>
        </div>

        {/* Bottom Stats/Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">24/7</div>
            <div className="text-gray-600 font-medium">Available Anytime</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">30</div>
            <div className="text-gray-600 font-medium">Languages Supported</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">∞</div>
            <div className="text-gray-600 font-medium">Patience & Understanding</div>
          </div>
        </div>
      </div>
    </section>
  );
}