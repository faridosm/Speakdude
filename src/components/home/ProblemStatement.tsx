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
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center">
          {/* Dynamic Headline - Reduced Size */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight">
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
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BookX className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Spent years memorizing grammar rules?
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <UserX className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Know thousands of vocabulary words?
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Frown className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    Still freeze up in real conversations?
                  </p>
                </div>
              </div>
              
              {/* "You're Not Alone" Message - Compact */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <h3 className="text-lg font-bold text-gray-900">You're Not Alone</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Main Description Content - Condensed */}
          <div className="max-w-3xl mx-auto">
            <div className="text-sm md:text-base text-gray-700 leading-relaxed space-y-3">
              <p className="font-semibold text-base md:text-lg text-gray-900 mb-3">
                Traditional learning teaches <span className="text-red-500">knowledge</span> — not <span className="text-green-500">fluency</span>.
              </p>
              
              <p className="text-xs md:text-sm">
                You can memorize every grammar rule, master thousands of vocabulary words, and ace every written test — but the moment someone starts a real conversation, you freeze.
              </p>
              
              <p className="text-xs md:text-sm">
                That's because <span className="font-bold text-purple-600">textbooks teach your brain, not your mouth</span>.
              </p>
              
              <p className="text-xs md:text-sm">
                Real speaking fluency only comes through <span className="font-bold text-blue-600">real practice</span> — the kind where you actually open your mouth, stumble through sentences, make mistakes, and gradually build the muscle memory that turns thinking into natural speech.
              </p>
              
              <p className="text-base md:text-lg font-bold text-gray-900 pt-1">
                Your brain knows the language; now your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">mouth needs to learn it too</span>.
              </p>
            </div>

            {/* Call to Action - Compact */}
            <div className="pt-6">
              <button 
                onClick={handleStartSpeaking}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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