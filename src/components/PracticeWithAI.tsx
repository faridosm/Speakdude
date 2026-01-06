import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bot, 
  MessageCircle, 
  Globe, 
  Users, 
  Briefcase, 
  MapPin, 
  Coffee, 
  GraduationCap,
  Heart,
  Plane,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';

interface PracticeWithAIProps {
  onBack: () => void;
}

export function PracticeWithAI({ onBack }: PracticeWithAIProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languages = [
    { code: 'multilingual', name: 'Multilingual Practice', flag: '🌍', description: 'Switch between languages during conversation' },
    { code: 'en', name: 'English', flag: '🇺🇸', description: 'Practice English conversation' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', description: 'Practica conversación en español' },
    { code: 'fr', name: 'French', flag: '🇫🇷', description: 'Pratiquez la conversation française' },
    { code: 'de', name: 'German', flag: '🇩🇪', description: 'Deutsche Konversation üben' },
    { code: 'it', name: 'Italian', flag: '🇮🇹', description: 'Pratica la conversazione italiana' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹', description: 'Pratique conversação em português' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', description: '日本語の会話を練習する' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', description: '한국어 대화 연습' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', description: '练习中文对话' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', description: 'ممارسة المحادثة العربية' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', description: 'हिंदी बातचीत का अभ्यास करें' },
  ];

  const scenarios = [
    {
      id: 'casual-conversation',
      name: 'Casual Conversation',
      icon: MessageCircle,
      description: 'Friendly, everyday chat about hobbies, weather, and life',
      color: 'bg-blue-500'
    },
    {
      id: 'business-meeting',
      name: 'Business Meeting',
      icon: Briefcase,
      description: 'Professional discussions, presentations, and workplace scenarios',
      color: 'bg-purple-500'
    },
    {
      id: 'travel-guide',
      name: 'Travel & Tourism',
      icon: MapPin,
      description: 'Asking for directions, booking hotels, ordering food while traveling',
      color: 'bg-green-500'
    },
    {
      id: 'coffee-shop',
      name: 'Coffee Shop',
      icon: Coffee,
      description: 'Ordering drinks, small talk with baristas, casual meetups',
      color: 'bg-orange-500'
    },
    {
      id: 'academic',
      name: 'Academic Discussion',
      icon: GraduationCap,
      description: 'University conversations, research topics, study groups',
      color: 'bg-indigo-500'
    },
    {
      id: 'dating',
      name: 'Dating & Relationships',
      icon: Heart,
      description: 'Romantic conversations, getting to know someone, relationship topics',
      color: 'bg-pink-500'
    },
    {
      id: 'airport',
      name: 'Airport & Transportation',
      icon: Plane,
      description: 'Check-in procedures, security, public transportation',
      color: 'bg-cyan-500'
    },
    {
      id: 'shopping',
      name: 'Shopping & Retail',
      icon: ShoppingBag,
      description: 'Buying clothes, asking for sizes, returning items',
      color: 'bg-red-500'
    }
  ];

  const handleStartPractice = async () => {
    if (!selectedLanguage || !selectedScenario) {
      setError('Please select both a language and scenario');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Since we're switching to Bolt database, we'll show a message about the AI practice feature
      setError('AI Practice feature is currently being updated for the new database system. Please check back soon!');
    } catch (error: any) {
      console.error('Error starting AI practice:', error);
      setError('Failed to start AI practice session. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #f5f7a8 0%, #e8d5ff 50%, #d4a5ff 100%)'
    }}>
      {/* Grid Pattern Background */}
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

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto p-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice with Luna AI</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have natural conversations with Luna, your AI language partner. Choose your language and scenario to start practicing!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Language Selection */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              Choose Your Language
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedLanguage === language.code
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{language.flag}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{language.name}</div>
                      <div className="text-sm text-gray-600">{language.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-500" />
              Choose Your Scenario
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedScenario === scenario.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${scenario.color} rounded-lg flex items-center justify-center`}>
                      <scenario.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{scenario.name}</div>
                      <div className="text-sm text-gray-600">{scenario.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Practice Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleStartPractice}
            disabled={!selectedLanguage || !selectedScenario || isConnecting}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connecting to Luna...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                <span>Start Practice Session</span>
              </>
            )}
          </button>
          
          {(!selectedLanguage || !selectedScenario) && (
            <p className="text-gray-500 text-sm mt-3">
              Please select both a language and scenario to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}