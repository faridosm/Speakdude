import React, { useState } from 'react';
import { 
  Home, 
  Bot, 
  Gamepad2, 
  TrendingUp, 
  User, 
  MessageCircle,
  Calendar,
  Clock,
  Target,
  Award,
  BookOpen,
  Mic,
  Globe,
  ChevronRight,
  Play,
  Star,
  Trophy,
  Flame,
  Menu,
  X,
  LogOut,
  Video
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useUserData } from './hooks/useUserData';
import { PracticeWithAI } from './components/PracticeWithAI';
import { TranslationGame } from './components/TranslationGame';
import { ProgressSection } from './components/ProgressSection';
import { ProfileSection } from './components/ProfileSection';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

function Dashboard({ onNavigate }: DashboardProps) {
  const { user, signOut } = useAuth();
  const { profile, progress, recentSessions, sessionCounts, loading } = useUserData();
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    if (onNavigate) {
      onNavigate('home');
    }
  };

  const navigationItems = [
    { name: 'Dashboard', icon: Home, active: true },
    { name: 'Practice with Luna', icon: Bot },
    { name: 'Translation Game', icon: Gamepad2 },
    { name: 'Progress', icon: TrendingUp },
    { name: 'Profile', icon: User },
  ];

  const stats = [
    {
      title: 'Total Video Sessions',
      value: sessionCounts.totalVideoSessions.toString(),
      change: '+12%',
      color: 'from-blue-500 to-blue-600',
      icon: Video
    },
    {
      title: 'Total Rapid Translation Sessions',
      value: sessionCounts.totalTranslationSessions.toString(),
      change: '+8%',
      color: 'from-green-500 to-green-600',
      icon: Gamepad2
    },
    {
      title: 'Streak Days',
      value: progress?.streak_days?.toString() || '0',
      change: '+3',
      color: 'from-orange-500 to-orange-600',
      icon: Flame
    }
  ];

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'ai_conversation': return Bot;
      case 'translation_game': return Gamepad2;
      case 'speaking_practice': return Mic;
      default: return BookOpen;
    }
  };

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'ai_conversation': return 'bg-blue-100 text-blue-600';
      case 'translation_game': return 'bg-purple-100 text-purple-600';
      case 'speaking_practice': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const achievements = [
    { name: 'First Conversation', icon: MessageCircle, earned: true },
    { name: '7-Day Streak', icon: Flame, earned: (progress?.streak_days || 0) >= 7 },
    { name: 'Grammar Master', icon: BookOpen, earned: sessionCounts.totalTranslationSessions >= 10 },
    { name: '30-Day Streak', icon: Trophy, earned: (progress?.streak_days || 0) >= 30 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Render Practice with Luna component
  if (activeSection === 'Practice with Luna') {
    return <PracticeWithAI onBack={() => setActiveSection('Dashboard')} />;
  }

  // Render Translation Game component
  if (activeSection === 'Translation Game') {
    return <TranslationGame onBack={() => setActiveSection('Dashboard')} />;
  }

  // Render Progress component
  if (activeSection === 'Progress') {
    return <ProgressSection onBack={() => setActiveSection('Dashboard')} />;
  }

  // Render Profile component
  if (activeSection === 'Profile') {
    return <ProfileSection onBack={() => setActiveSection('Dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">SpeakDude</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveSection(item.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 mb-1 ${
                    activeSection === item.name
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 mb-1 text-red-600 hover:bg-red-50 mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">SpeakDude</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.name)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                  activeSection === item.name
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {profile?.full_name || user?.email}! Ready to continue learning?</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-gray-700">{progress?.streak_days || 0} day streak!</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Sessions */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Recent Sessions</h2>
                  <p className="text-gray-600 text-sm">Your latest learning activities</p>
                </div>
                <div className="p-6">
                  {recentSessions.length > 0 ? (
                    <div className="space-y-4">
                      {recentSessions.map((session, index) => {
                        const SessionIcon = getSessionIcon(session.session_type);
                        return (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className={`w-10 h-10 ${getSessionColor(session.session_type)} rounded-lg flex items-center justify-center`}>
                              <SessionIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-900 capitalize">{session.session_type.replace('_', ' ')}</h3>
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                  {session.language}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{session.duration_minutes} min</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span>{session.score}%</span>
                                </span>
                                <span>{new Date(session.completed_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No learning sessions yet</p>
                      <p className="text-gray-400 text-sm">Start your first practice session to see your progress here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Ready to Practice? - Moved from bottom */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white">
                <h2 className="text-lg font-bold mb-2">Ready to Practice?</h2>
                <p className="text-red-100 text-sm mb-4">Start a new session and keep your streak going!</p>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveSection('Practice with Luna')}
                    className="w-full bg-white text-red-500 font-semibold py-2 px-4 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Bot className="w-4 h-4" />
                    <span>AI Practice</span>
                  </button>
                  <button 
                    onClick={() => setActiveSection('Translation Game')}
                    className="w-full bg-white bg-opacity-20 text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-30 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Translation Game</span>
                  </button>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Achievements</h2>
                  <p className="text-gray-600 text-sm">Your learning milestones</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-2 border-dashed text-center transition-all ${
                          achievement.earned
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <achievement.icon
                          className={`w-6 h-6 mx-auto mb-2 ${
                            achievement.earned ? 'text-green-600' : 'text-gray-400'
                          }`}
                        />
                        <p className={`text-xs font-medium ${
                          achievement.earned ? 'text-green-700' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;