import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  BookX, 
  UserX, 
  Clock,
  Frown
} from 'lucide-react';

interface ProblemStatementProps {
  onNavigate?: (page: string) => void;
}

export function ProblemStatement({ onNavigate }: ProblemStatementProps) {
  const languages = ['Spanish', 'French', 'Hindi', 'German', 'English', 'Hindi'];
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
      }, 200); // Brief fade out duration
      
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [languages.length]);

  const handleStartSpeaking = () => {
    if (onNavigate) {
      onNavigate('login');
    }
  };

  return (
    <section className="py-16" style={{
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
      
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center">
          {/* Dynamic Headline - Reduced Size */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
              You Learned{' '}
              <span 
                className={`text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 transition-opacity duration-200 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {languages[currentLanguageIndex]}
              </span>
              ...
              <br />
              But Can You Actually <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Speak It?</span>
            </h2>
          </div>

          {/* Boxed Questions - Compact Version */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookX className="w-6 h-6" />
                  </div>
                  <p className="text-base font-semibold text-gray-800">
                    Spent years memorizing grammar rules?
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserX className="w-6 h-6" />
                  </div>
                  <p className="text-base font-semibold text-gray-800">
                    Know thousands of vocabulary words?
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Frown className="w-6 h-6" />
                  </div>
                  <p className="text-base font-semibold text-gray-800">
                    Still freeze up in real conversations?
                  </p>
                </div>
              </div>
              
              {/* "You're Not Alone" Message - Compact */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-bold text-gray-900">You're Not Alone</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Main Description Content - Condensed */}
          <div className="max-w-4xl mx-auto">
            <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-4">
              <p className="font-semibold text-lg md:text-xl text-gray-900 mb-4">
                Traditional learning teaches <span className="text-red-500">knowledge</span> — not <span className="text-green-500">fluency</span>.
              </p>
              
              <p className="text-sm md:text-base">
                You can memorize every grammar rule, master thousands of vocabulary words, and ace every written test — but the moment someone starts a real conversation, you freeze.
              </p>
              
              <p className="text-sm md:text-base">
                That's because <span className="font-bold text-purple-600">textbooks teach your brain, not your mouth</span>.
              </p>
              
              <p className="text-sm md:text-base">
                Real speaking fluency only comes through <span className="font-bold text-blue-600">real practice</span> — the kind where you actually open your mouth, stumble through sentences, make mistakes, and gradually build the muscle memory that turns thinking into natural speech.
              </p>
              
              <p className="text-lg md:text-xl font-bold text-gray-900 pt-2">
                Your brain knows the language; now your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">mouth needs to learn it too</span>.
              </p>
            </div>

            {/* Call to Action - Compact */}
            <div className="pt-8">
              <button 
                onClick={handleStartSpeaking}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-full text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Speaking Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}