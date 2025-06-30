import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Target, 
  Flame, 
  BookOpen, 
  Mic, 
  Bot, 
  Gamepad2,
  Star,
  ChevronLeft,
  ChevronRight,
  Award,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { useUserData } from '../hooks/useUserData';

interface ProgressSectionProps {
  onBack: () => void;
}

interface ActivityDay {
  date: Date;
  hasActivity: boolean;
  sessionCount: number;
  totalScore: number;
  sessionTypes: string[];
}

export function ProgressSection({ onBack }: ProgressSectionProps) {
  const { profile, progress, recentSessions, allSessions, loading } = useUserData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activityCalendar, setActivityCalendar] = useState<ActivityDay[]>([]);

  // Generate activity calendar when allSessions or currentMonth changes
  useEffect(() => {
    if (allSessions && allSessions.length >= 0) {
      generateActivityCalendar(allSessions, currentMonth);
    }
  }, [allSessions, currentMonth]);

  // Generate activity calendar for the current month
  const generateActivityCalendar = (sessions: any[], month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get the day of week for the first day (0 = Sunday)
    const startDayOfWeek = firstDay.getDay();
    
    const calendar: ActivityDay[] = [];
    
    // Add empty days for the start of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      const emptyDate = new Date(year, monthIndex, -(startDayOfWeek - i - 1));
      calendar.push({
        date: emptyDate,
        hasActivity: false,
        sessionCount: 0,
        totalScore: 0,
        sessionTypes: []
      });
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Find sessions for this day
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.completed_at);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });
      
      const sessionTypes = [...new Set(daySessions.map(s => s.session_type))];
      const totalScore = daySessions.reduce((sum, s) => sum + (s.score || 0), 0);
      
      calendar.push({
        date,
        hasActivity: daySessions.length > 0,
        sessionCount: daySessions.length,
        totalScore,
        sessionTypes
      });
    }
    
    setActivityCalendar(calendar);
  };

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

  const formatSessionType = (type: string) => {
    switch (type) {
      case 'ai_conversation': return 'AI Conversation';
      case 'translation_game': return 'Translation Game';
      case 'speaking_practice': return 'Speaking Practice';
      default: return type.replace('_', ' ');
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate statistics using allSessions from useUserData
  const totalSessions = allSessions?.length || 0;
  const averageScore = totalSessions > 0 
    ? Math.round((allSessions?.reduce((sum, s) => sum + (s.score || 0), 0) || 0) / totalSessions)
    : 0;
  const totalMinutes = allSessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0;
  const activeDays = allSessions ? new Set(allSessions.map(s => 
    new Date(s.completed_at).toDateString()
  )).size : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
            <p className="text-gray-600">Track your learning journey and achievements</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Sessions</h3>
            <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Time</h3>
            <p className="text-2xl font-bold text-gray-900">{totalMinutes} min</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Current Streak</h3>
            <p className="text-2xl font-bold text-gray-900">{progress?.streak_days || 0} days</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Average Score</h3>
            <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Activity Calendar */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                      Activity Calendar
                    </h2>
                    <p className="text-gray-600 text-sm">Your daily learning activity</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-sm font-semibold text-gray-900 min-w-[120px] text-center">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {activityCalendar.map((day, index) => {
                    const isCurrentMonth = day.date.getMonth() === currentMonth.getMonth();
                    const isToday = new Date().toDateString() === day.date.toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`
                          aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all duration-200 relative group cursor-pointer
                          ${!isCurrentMonth 
                            ? 'border-transparent text-gray-300 bg-gray-50' 
                            : day.hasActivity 
                              ? 'border-green-200 bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }
                          ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                        `}
                      >
                        {day.date.getDate()}
                        {day.hasActivity && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{day.sessionCount}</span>
                          </div>
                        )}
                        
                        {/* Tooltip */}
                        {isCurrentMonth && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                            <div className="font-semibold">{day.date.toLocaleDateString()}</div>
                            {day.hasActivity ? (
                              <div>
                                <div>{day.sessionCount} session{day.sessionCount > 1 ? 's' : ''}</div>
                                {day.totalScore > 0 && <div>Score: {Math.round(day.totalScore / day.sessionCount)}%</div>}
                              </div>
                            ) : (
                              <div>No activity</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-center space-x-6 mt-6 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <span className="text-gray-600">No activity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                    <span className="text-gray-600">Practice day</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  Quick Stats
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Active Days</span>
                  <span className="font-semibold text-gray-900">{activeDays}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Best Streak</span>
                  <span className="font-semibold text-gray-900">{progress?.streak_days || 0} days</span>
                </div>
              </div>
            </div>

            {/* Session Types Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                  Session Types
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {['ai_conversation', 'translation_game', 'speaking_practice'].map(type => {
                  const count = allSessions?.filter(s => s.session_type === type).length || 0;
                  const percentage = totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0;
                  const Icon = getSessionIcon(type);
                  
                  return (
                    <div key={type} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${getSessionColor(type)} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{formatSessionType(type)}</span>
                          <span className="text-xs text-gray-600">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievements
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Streak Master</div>
                    <div className="text-xs opacity-90">{progress?.streak_days || 0} day streak</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Session Champion</div>
                    <div className="text-xs opacity-90">{totalSessions} sessions completed</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">High Performer</div>
                    <div className="text-xs opacity-90">{averageScore}% average score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Sessions History */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Complete Session History</h2>
              <p className="text-gray-600 text-sm">All your learning sessions</p>
            </div>
            <div className="p-6">
              {allSessions && allSessions.length > 0 ? (
                <div className="space-y-4">
                  {allSessions.map((session, index) => {
                    const SessionIcon = getSessionIcon(session.session_type);
                    return (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className={`w-10 h-10 ${getSessionColor(session.session_type)} rounded-lg flex items-center justify-center`}>
                          <SessionIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{formatSessionType(session.session_type)}</h3>
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
                            <span className="text-gray-400">{new Date(session.completed_at).toLocaleTimeString()}</span>
                          </div>
                        </div>
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
      </div>
    </div>
  );
}