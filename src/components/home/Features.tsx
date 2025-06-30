import React from 'react';
import { 
  Bot, 
  Gamepad2, 
  Zap,
  ArrowRight
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Bot,
      title: "AI Conversation Partner",
      description: "Practice speaking with lifelike AI avatar that look, sound, and respond like native speakers. Get real conversation experience without judgment.",
      iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
      iconColor: "text-white",
      cardBg: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      hoverShadow: "hover:shadow-blue-200/50"
    },
    {
      icon: Gamepad2,
      title: "Rapid Translation Game", 
      description: "Build quick-thinking fluency through our gamified translation challenges. Speak translations under time pressure to develop natural reflexes.",
      iconBg: "bg-gradient-to-br from-purple-400 to-purple-600",
      iconColor: "text-white",
      cardBg: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      hoverShadow: "hover:shadow-purple-200/50"
    },
    {
      icon: Zap,
      title: "Track Progress",
      description: "See which days you practiced, with missed days highlighted for motivation. Monitor your improvement with detailed analytics and achievements.",
      iconBg: "bg-gradient-to-br from-orange-400 to-orange-600",
      iconColor: "text-white",
      cardBg: "bg-gradient-to-br from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      hoverShadow: "hover:shadow-orange-200/50"
    }
  ];

  return (
    <section id="features-section" className="bg-gray-100 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* Enhanced Header */}
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
            <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Our Features</span>
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Features</span>
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
            SpeakDude is designed to help you actually speak a new language — naturally, confidently, and fluently — in real-life situations.
          </p>
        </div>

        {/* Enhanced Feature List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${feature.cardBg} ${feature.borderColor} border-2 rounded-2xl p-6 ${feature.hoverShadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Enhanced Icon */}
                <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                
                {/* Enhanced Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                  
                  {/* Progress indicator */}
                  <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                    <div 
                      className={`h-full ${feature.iconBg} rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="pt-6 text-center">
          <button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 group">
            <span>Explore All Features</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}