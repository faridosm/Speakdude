import React from 'react';
import { 
  Bot, 
  Gamepad2, 
  Zap,
  MessageCircle
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Bot,
      title: "AI Conversation Partner",
      description: "Practice speaking with lifelike AI avatar that look, sound, and respond like native speakers. Get real conversation experience without judgment.",
      iconBg: "bg-lime-400",
      iconColor: "text-gray-800"
    },
    {
      icon: Gamepad2,
      title: "Rapid Translation Game", 
      description: "Build quick-thinking fluency through our gamified translation challenges. Speak translations under time pressure to develop natural reflexes.",
      iconBg: "bg-purple-400",
      iconColor: "text-white"
    },
    {
      icon: Zap,
      title: "Track Progress",
      description: "See which days you practiced, with missed days highlighted for motivation.",
      iconBg: "bg-orange-400",
      iconColor: "text-white"
    }
  ];

  return (
    <section id="features-section" className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <img 
                src="https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg" 
                alt="AI-powered language learning conversation" 
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-black text-gray-900 mb-3">
                Our <span className="text-red-500">Features</span>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                SpeakDude is designed to help you actually speak a new language — naturally, confidently, and fluently — in real-life situations.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 ${feature.iconBg} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}