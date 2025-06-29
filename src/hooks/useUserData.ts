import { useState, useEffect } from 'react';
import { supabase, Profile, UserProgress, LearningSession } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useUserData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [recentSessions, setRecentSessions] = useState<LearningSession[]>([]);
  const [allSessions, setAllSessions] = useState<LearningSession[]>([]);
  const [sessionCounts, setSessionCounts] = useState({
    totalVideoSessions: 0,
    totalTranslationSessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setProfile(null);
      setProgress(null);
      setRecentSessions([]);
      setAllSessions([]);
      setSessionCounts({ totalVideoSessions: 0, totalTranslationSessions: 0 });
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressError) throw progressError;
      setProgress(progressData);

      // Fetch recent sessions (last 5 for display)
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(5);

      if (sessionsError) throw sessionsError;
      setRecentSessions(sessionsData || []);

      // Fetch ALL sessions for progress section
      const { data: allSessionsData, error: allSessionsError } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (allSessionsError) throw allSessionsError;
      setAllSessions(allSessionsData || []);

      // Fetch session counts for all sessions (for dashboard stats)
      const { data: videoSessionsData, error: videoError } = await supabase
        .from('learning_sessions')
        .select('id')
        .eq('user_id', user.id)
        .eq('session_type', 'ai_conversation');

      const { data: translationSessionsData, error: translationError } = await supabase
        .from('learning_sessions')
        .select('id')
        .eq('user_id', user.id)
        .eq('session_type', 'translation_game');

      if (videoError) throw videoError;
      if (translationError) throw translationError;

      setSessionCounts({
        totalVideoSessions: videoSessionsData?.length || 0,
        totalTranslationSessions: translationSessionsData?.length || 0
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if two dates are the same day (ignoring time)
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Helper function to check if date1 is exactly one day before date2
  const isConsecutiveDay = (lastActivityDate: Date, currentDate: Date): boolean => {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const timeDiff = currentDate.getTime() - lastActivityDate.getTime();
    const daysDiff = Math.floor(timeDiff / oneDayInMs);
    return daysDiff === 1;
  };

  // Function to update streak based on session completion
  const updateStreak = async (sessionCompletedAt: string) => {
    if (!user || !progress) return;

    try {
      const sessionDate = new Date(sessionCompletedAt);
      const lastActivityDate = new Date(progress.last_activity);
      
      let newStreakDays = progress.streak_days;
      
      // Check if this is the first activity of a new day
      if (isSameDay(lastActivityDate, sessionDate)) {
        // Same day - no streak update needed, just update last_activity time
        console.log('📅 Same day activity - streak unchanged');
      } else if (isConsecutiveDay(lastActivityDate, sessionDate)) {
        // Consecutive day - increment streak
        newStreakDays = progress.streak_days + 1;
        console.log(`🔥 Consecutive day! Streak increased to ${newStreakDays}`);
      } else {
        // Gap in activity - reset streak to 1
        newStreakDays = 1;
        console.log(`🔄 Activity gap detected - streak reset to 1`);
      }

      // Update user progress with new streak and last activity
      const { data, error } = await supabase
        .from('user_progress')
        .update({
          streak_days: newStreakDays,
          last_activity: sessionCompletedAt,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setProgress(data);
      
      console.log(`✅ Streak updated successfully: ${newStreakDays} days`);
      return { data, error: null };
    } catch (error) {
      console.error('❌ Error updating streak:', error);
      return { data: null, error };
    }
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!user || !progress) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProgress(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating progress:', error);
      return { data: null, error };
    }
  };

  const updateUserProfile = async (fullName: string, email: string) => {
    if (!user) return { data: null, error: new Error('User not authenticated') };

    try {
      // Update profile in database
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          email: email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (profileError) throw profileError;

      // Update email in Supabase Auth if it's different from current
      if (email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: email
        });

        if (authError) {
          // If auth update fails, we should revert the profile update
          console.error('Auth email update failed:', authError);
          throw new Error('Failed to update email in authentication system. Please try again.');
        }
      }

      // Update local state
      setProfile(profileData);
      
      console.log('✅ Profile updated successfully');
      return { data: profileData, error: null };
    } catch (error: any) {
      console.error('❌ Error updating profile:', error);
      return { data: null, error };
    }
  };

  const addLearningSession = async (session: Omit<LearningSession, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .insert({
          ...session,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update streak based on session completion
      await updateStreak(session.completed_at);
      
      // Refresh all user data to update session counts
      fetchUserData();
      
      return { data, error: null };
    } catch (error) {
      console.error('Error adding learning session:', error);
      return { data: null, error };
    }
  };

  const updateLearningSession = async (sessionId: string, updates: Partial<LearningSession>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('learning_sessions')
        .update(updates)
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      // Update streak if completed_at is being updated
      if (updates.completed_at) {
        await updateStreak(updates.completed_at);
      }
      
      // Refresh all user data to update session counts
      fetchUserData();
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating learning session:', error);
      return { data: null, error };
    }
  };

  return {
    profile,
    progress,
    recentSessions,
    allSessions,
    sessionCounts,
    loading,
    updateProgress,
    updateUserProfile,
    addLearningSession,
    updateLearningSession,
    refetch: fetchUserData,
  };
}