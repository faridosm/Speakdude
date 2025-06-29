import React from 'react';
import { 
  Bot, 
  Gamepad2, 
  Shield,
  ArrowRight
} from 'lucide-react';

interface ProblemSolutionProps {
  onNavigate?: (page: string) => void;
}

export function ProblemSolution({ onNavigate }: ProblemSolutionProps) {
  const handleStartPractice = () => {
    if (onNavigate) {
      onNavigate('login');
    }
  };

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
            Finally, Language Learning That Helps You<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Actually Speak
            </span>
          </h2>
          
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              What if you could practice conversations without the fear of judgment? What if you had a patient, native-speaking partner available 24/7? That's exactly what SpeakDude delivers. Our AI-powered avatars look, sound, and respond like real humans, giving you unlimited conversation practice in a safe, pressure-free environment. No more silent studying - just real speaking practice that builds the fluency you've been chasing.
            </p>
          </div>
        </div>

        {/* Three Key Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Solution 1 - Realistic Conversation Partners */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Realistic Conversation Partners
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              Practice with lifelike avatars that respond naturally. Experience real conversations with AI partners who understand context, emotions, and cultural nuances - available whenever you need them.
            </p>
          </div>

          {/* Solution 2 - Gamified Speaking Challenges */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Gamified Speaking Challenges
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              Build speed and confidence through fun, timed exercises. Our rapid translation games train your brain to think directly in your target language, eliminating the mental translation step.
            </p>
          </div>

          {/* Solution 3 - Safe Practice Environment */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Safe Practice Environment
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              Make mistakes without embarrassment. Our private, judgment-free space lets you practice freely, stumble through sentences, and build confidence at your own pace.
            </p>
          </div>
        </div>

        {/* Call to Action Button - Moved Below and Made Compact */}
        <div className="text-center">
          <button 
            onClick={handleStartPractice}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2 mx-auto"
          >
            <span>Start Speaking Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}