import React from 'react';
import { 
  Bot, 
  Gamepad2, 
  Zap,
  MessageCircle,
  Star,
  Sparkles,
  ArrowRight,
  Play
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
    <section id="features-section" className="bg-gray-50 py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
          {/* Left Side - Enhanced Image */}
          <div className="relative order-2 xl:order-1">
            {/* Main image container with enhanced styling */}
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500 group">
              {/* Floating elements around the image */}
              <div className="absolute -top-6 -left-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 shadow-lg animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              
              <div className="absolute -top-4 -right-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full p-3 shadow-lg animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
                <Star className="w-5 h-5 text-white" />
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-4 shadow-lg animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>

              {/* Main image with enhanced styling */}
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg" 
                  alt="AI-powered language learning conversation" 
                  className="w-full h-96 object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <Play className="w-8 h-8 text-gray-800" />
                  </div>
                </div>
              </div>

              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>

            {/* Background decorative circles */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-r from-orange-300 to-pink-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Right Side - Enhanced Content */}
          <div className="space-y-8 order-1 xl:order-2">
            {/* Enhanced Header */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
                <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Our Features</span>
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Features</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                SpeakDude is designed to help you actually speak a new language — naturally, confidently, and fluently — in real-life situations.
              </p>
            </div>

            {/* Enhanced Feature List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`${feature.cardBg} ${feature.borderColor} border-2 rounded-2xl p-6 ${feature.hoverShadow} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Enhanced Icon */}
                    <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    
                    {/* Enhanced Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                          {feature.title}
                        </h3>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
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
            <div className="pt-6">
              <button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 group">
                <span>Explore All Features</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom decorative stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: "12+", label: "Languages Supported", color: "from-blue-500 to-purple-500" },
            { number: "24/7", label: "AI Availability", color: "from-purple-500 to-pink-500" },
            { number: "∞", label: "Practice Sessions", color: "from-orange-500 to-red-500" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.number}
              </div>
              <div className="text-gray-600 font-semibold text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}