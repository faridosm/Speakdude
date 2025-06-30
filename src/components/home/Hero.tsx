import React from 'react';
import { 
  MessageCircle
} from 'lucide-react';

interface HeroProps {
  user: any;
  onNavigate: (page: string) => void;
}

export function Hero({ user, onNavigate }: HeroProps) {
  const languageCards = [
    // Top arc - spaced further from image
    { name: 'English', flag: '🇺🇸', position: 'top-4 left-1/2 transform -translate-x-1/2 -translate-y-8', delay: '0s', rotation: 'rotate-2' },
    { name: 'Spanish', flag: '🇪🇸', position: 'top-8 left-1/4 transform -translate-x-12', delay: '0.5s', rotation: '-rotate-1' },
    
    // Upper sides - moved further out
    { name: 'Hindi', flag: '🇮🇳', position: 'top-1/4 -left-4', delay: '1s', rotation: 'rotate-3' },
    { name: 'Greek', flag: '🇬🇷', position: 'top-1/4 -right-4', delay: '1.5s', rotation: '-rotate-2' },
    
    // Mid sides - pushed further from center
    { name: 'Turkish', flag: '🇹🇷', position: 'top-1/2 -left-8', delay: '2s', rotation: 'rotate-1' },
    { name: 'German', flag: '🇩🇪', position: 'top-1/2 -right-8', delay: '2.5s', rotation: '-rotate-3' },
    
    // Bottom arc - more space from image base
    { name: 'Italian', flag: '🇮🇹', position: 'bottom-12 left-1/4 transform -translate-x-8', delay: '3s', rotation: 'rotate-2' },
    { name: 'Russian', flag: '🇷🇺', position: 'bottom-12 right-1/4 transform translate-x-8', delay: '3.5s', rotation: '-rotate-1' },
  ];

  const handleSignUpClick = () => {
    onNavigate('signup');
  };

  const handleSignInClick = () => {
    onNavigate('login');
  };

  const handleFeatureClick = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSupportClick = () => {
    onNavigate('support');
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #f5f7a8 0%, #e8d5ff 50%, #d4a5ff 100%)'
    }}>
      {/* Grid Pattern Background - Only in Hero Section */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.25) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-lg">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-base sm:text-lg">SpeakDude</span>
            </div>
            
            {/* Navigation Items - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-1">
              <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                <span>Home</span>
              </button>
              <button 
                onClick={handleFeatureClick}
                className="text-gray-300 hover:text-white px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors rounded-full hover:bg-gray-800"
              >
                Feature
              </button>
              <button 
                onClick={handleSupportClick}
                className="text-gray-300 hover:text-white px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors rounded-full hover:bg-gray-800"
              >
                Support
              </button>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {user ? (
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-500 rounded-full"></div>
                  </div>
                  <button 
                    onClick={handleSignInClick}
                    className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium transition-colors hidden sm:block"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleSignUpClick}
                    className="bg-white text-gray-900 hover:bg-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Main Hero Text */}
        <div className="text-center mb-8 sm:mb-12 pt-4 sm:pt-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight tracking-tight px-2">
            <span className="text-gray-900 block">You Learned A Language</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 block mt-2">But Can't Speak It?</span>
          </h1>
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
              We Help You Become Fluent—Practice Real Conversations with Virtual AI Human. Build genuine fluency through natural conversations, not endless grammar drills and vocabulary lists.
            </p>
          </div>
        </div>

        {/* Image Section with Floating Language Cards */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8 relative flex justify-center px-4">
          {/* Main Image Container */}
          <div className="relative">
            <img 
              src="/Firefly 20250628154149.png"
              alt="AI Language Learning Conversation"
              className="w-full h-auto max-w-sm sm:max-w-md md:max-w-2xl"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />

            {/* Floating Language Cards - Only show on larger screens */}
            {languageCards.map((card, index) => (
              <div
                key={card.name}
                className={`absolute ${card.position} z-20 animate-bounce ${card.rotation} hidden lg:block`}
                style={{
                  animationDelay: card.delay,
                  animationDuration: '3s',
                  animationIterationCount: 'infinite'
                }}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/30 hover:scale-110 hover:rotate-0 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{card.flag}</span>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-red-500 transition-colors whitespace-nowrap">
                      {card.name}
                    </span>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  
                  {/* Subtle connector line to center */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-px h-4 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent absolute top-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            ))}

            {/* Enhanced floating elements for more dynamic effect */}
            <div className="absolute top-16 left-6 z-15 animate-pulse">
              <div className="w-3 h-3 bg-yellow-400/70 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute bottom-20 right-6 z-15 animate-pulse" style={{ animationDelay: '1s' }}>
              <div className="w-2 h-2 bg-blue-400/70 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute top-28 right-10 z-15 animate-pulse" style={{ animationDelay: '2s' }}>
              <div className="w-4 h-4 bg-green-400/70 rounded-full shadow-lg"></div>
            </div>
            <div className="absolute bottom-12 left-10 z-15 animate-pulse" style={{ animationDelay: '0.5s' }}>
              <div className="w-2 h-2 bg-purple-400/70 rounded-full shadow-lg"></div>
            </div>
            
            {/* Additional decorative elements */}
            <div className="absolute top-1/4 left-4 z-15 animate-bounce hidden lg:block" style={{ animationDelay: '1.5s', animationDuration: '4s' }}>
              <div className="w-1 h-1 bg-orange-400/60 rounded-full"></div>
            </div>
            <div className="absolute bottom-1/4 right-4 z-15 animate-bounce hidden lg:block" style={{ animationDelay: '2.5s', animationDuration: '4s' }}>
              <div className="w-1 h-1 bg-red-400/60 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Mobile Language Cards - Simple grid layout */}
        <div className="lg:hidden flex flex-wrap justify-center gap-2 mb-6 px-4">
          {languageCards.slice(0, 6).map((card, index) => (
            <div
              key={card.name}
              className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-white/40 flex items-center space-x-2"
            >
              <span className="text-base">{card.flag}</span>
              <span className="text-xs font-semibold text-gray-800">{card.name}</span>
            </div>
          ))}
        </div>

        {/* Get Started Button - Mobile optimized */}
        <div className="text-center px-4">
          <button 
            onClick={handleSignUpClick}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full max-w-xs sm:min-w-[280px]"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}