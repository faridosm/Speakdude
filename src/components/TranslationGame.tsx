import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Timer,
  Trophy,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  Settings,
  Gamepad2,
  Globe,
  Loader
} from 'lucide-react';
import { useUserData } from '../hooks/useUserData';

interface TranslationGameProps {
  onBack: () => void;
}

interface GameSettings {
  nativeLanguage: string;
  targetLanguage: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit: number;
}

interface GameState {
  phase: 'setup' | 'listening' | 'speaking' | 'evaluating' | 'feedback' | 'complete';
  currentSentence: string;
  correctTranslation: string;
  userTranscription: string;
  score: number;
  streak: number;
  questionNumber: number;
  timeRemaining: number;
  isCorrect: boolean | null;
  feedback: string;
}

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

export function TranslationGame({ onBack }: TranslationGameProps) {
  const { addLearningSession, updateLearningSession } = useUserData();
  
  // Settings State
  const [settings, setSettings] = useState<GameSettings>({
    nativeLanguage: 'en',
    targetLanguage: 'hi',
    difficulty: 'beginner',
    timeLimit: 20,
  });

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    currentSentence: '',
    correctTranslation: '',
    userTranscription: '',
    score: 0,
    streak: 0,
    questionNumber: 0,
    timeRemaining: 0,
    isCorrect: null,
    feedback: '',
  });

  // Add correct answers counter
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // Session tracking
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Refs for cleanup and audio handling
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const correctTranslationRef = useRef<string>('');
  const gameActiveRef = useRef<boolean>(true);
  const questionHistoryRef = useRef<string[]>([]);
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Track auto-advance timeouts
  const isGeneratingRef = useRef<boolean>(false); // Prevent multiple simultaneous question generation
  const currentQuestionIdRef = useRef<number>(0); // Track current question to prevent stale recording processing
  const hasRecordingInProgressRef = useRef<boolean>(false); // Track if recording is being processed
  const gamePhaseRef = useRef<'setup' | 'listening' | 'speaking' | 'evaluating' | 'feedback' | 'complete'>('setup'); // Track current phase

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear timers
      if (timerRef.current) clearInterval(timerRef.current);
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
      
      // Stop audio streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Stop current audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = '';
        currentAudioRef.current = null;
      }
      
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // API Functions
  const callAPI = async (endpoint: string, data: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`❌ ${endpoint} API error:`, error);
      throw error;
    }
  };

  // Comprehensive cleanup function to prevent race conditions
  const clearAllTimersAndTimeouts = () => {
    // Clear countdown timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Clear auto-advance timeout
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    
    // Stop current audio to prevent overlap
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
    }
  };

  // Enhanced phase management to prevent conflicts
  const transitionToPhase = (newPhase: GameState['phase']) => {
    gamePhaseRef.current = newPhase;
    setGameState(prev => ({ ...prev, phase: newPhase }));
  };

  // Smart scheduling that considers current state and user progress
  const scheduleNextQuestion = (delay: number = 3000, reason: string = 'default') => {
    console.log(`📅 Scheduling next question in ${delay}ms (reason: ${reason})`);
    
    // Clear any existing advance timeout first
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    
    // Schedule new question generation
    advanceTimeoutRef.current = setTimeout(() => {
      if (gameActiveRef.current && !isGeneratingRef.current) {
        console.log(`▶️ Auto-advancing to next question (reason: ${reason})`);
        generateNewQuestion();
      }
    }, delay);
  };

  // Immediate progression for correct answers (better UX for rapid translation)
  const handleCorrectAnswer = (evaluationData: any) => {
    const points = 10; // Fixed 10 points for correct answers

    setGameState(prev => ({
      ...prev,
      phase: 'feedback',
      isCorrect: true,
      score: prev.score + points,
      streak: prev.streak + 1,
      feedback: evaluationData.feedback,
    }));

    // Increment correct answers counter
    setCorrectAnswersCount(prev => prev + 1);

    // Quick progression for correct answers (1.5 seconds instead of 3)
    scheduleNextQuestion(1500, 'correct-answer');
  };

  // Standard progression for incorrect answers (show correct answer longer)
  const handleIncorrectAnswer = (evaluationData: any, feedback: string) => {
    setGameState(prev => ({
      ...prev,
      phase: 'feedback',
      isCorrect: false,
      score: prev.score, // No points for incorrect
      streak: 0,
      feedback: feedback,
    }));

    // Longer delay for incorrect answers to show correct answer
    scheduleNextQuestion(3000, 'incorrect-answer');
  };

  // Game Flow Functions
  const startGame = async () => {
    gameActiveRef.current = true;
    isGeneratingRef.current = false;
    hasRecordingInProgressRef.current = false;
    currentQuestionIdRef.current = 0; // Reset question ID counter
    gamePhaseRef.current = 'listening';
    questionHistoryRef.current = []; // Clear question history for new game
    clearAllTimersAndTimeouts(); // Ensure clean state
    setCorrectAnswersCount(0); // Reset correct answers counter
    
    setGameState({
      phase: 'listening',
      currentSentence: '',
      correctTranslation: '',
      userTranscription: '',
      score: 0,
      streak: 0,
      questionNumber: 0,
      timeRemaining: 0,
      isCorrect: null,
      feedback: '',
    });

    // 🆕 IMMEDIATE SESSION RECORDING: Record session as soon as game starts
    console.log('🔄 Recording translation game session start in database...');
    const startTime = new Date();
    setSessionStartTime(startTime);
    
    try {
      const sessionResult = await addLearningSession({
        session_type: 'translation_game',
        language: `${settings.nativeLanguage}-${settings.targetLanguage}`,
        duration_minutes: 0, // Will be updated when game ends
        score: 0, // Will be updated when game ends
        completed_at: startTime.toISOString(), // Will be updated when game ends
      });
      
      if (sessionResult?.data?.id) {
        setCurrentSessionId(sessionResult.data.id);
        console.log('✅ Translation game session recorded immediately:', sessionResult.data.id);
      }
    } catch (sessionError) {
      console.error('⚠️ Failed to record translation game session start:', sessionError);
      // Continue with the game even if recording fails
    }
    
    await generateNewQuestion();
  };

  const generateNewQuestion = async () => {
    // Prevent multiple simultaneous question generation
    if (isGeneratingRef.current || !gameActiveRef.current) {
      console.log('🔄 Question generation already in progress or game ended, skipping...');
      return;
    }
    
    // Prevent starting new question if recording is being processed
    if (hasRecordingInProgressRef.current) {
      console.log('🔄 Recording being processed, postponing question generation...');
      scheduleNextQuestion(500, 'recording-in-progress');
      return;
    }
    
    isGeneratingRef.current = true;
    
    // Clear all existing timers and audio before starting new question
    clearAllTimersAndTimeouts();
    
    // Increment question ID to invalidate any pending recording processing
    currentQuestionIdRef.current += 1;
    
    transitionToPhase('listening');
    setGameState(prev => ({ 
      ...prev, 
      questionNumber: prev.questionNumber + 1,
      userTranscription: '',
      isCorrect: null,
      feedback: '',
    }));

    try {
      // Generate sentence with ChatGPT
      const sentenceData = await callAPI('translation-game', {
        action: 'generate_sentence',
        nativeLanguage: settings.nativeLanguage,
        targetLanguage: settings.targetLanguage,
        difficulty: settings.difficulty,
        questionHistory: questionHistoryRef.current, // Pass history to avoid repetition
      });

      // Check if game is still active before proceeding
      if (!gameActiveRef.current) {
        isGeneratingRef.current = false;
        return;
      }

      // Store correct translation in ref to avoid stale closure issues
      correctTranslationRef.current = sentenceData.targetTranslation;
      
      // Add the new sentence to question history
      questionHistoryRef.current.push(sentenceData.nativeSentence);

      setGameState(prev => ({
        ...prev,
        currentSentence: sentenceData.nativeSentence,
        correctTranslation: sentenceData.targetTranslation,
      }));

      // Try to play audio (TTS is optional - game continues without it)
      playAudioIfAvailable(sentenceData.nativeSentence);

      // Start speaking phase with timer
      startSpeakingPhase();

    } catch (error) {
      console.error('❌ Error generating question:', error);
      handleIncorrectAnswer(null, 'Error generating question. Please try again.');
    } finally {
      isGeneratingRef.current = false;
    }
  };

  const playAudioIfAvailable = async (textToSpeak: string) => {
    try {
      const audioData = await callAPI('translation-game', {
        action: 'text_to_speech',
        textToSpeak: textToSpeak,
        nativeLanguage: settings.nativeLanguage,
      });

      // Stop any existing audio to prevent overlap
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = '';
      }

      // Play new audio
      const audio = new Audio(`data:${audioData.mimeType};base64,${audioData.audioBase64}`);
      currentAudioRef.current = audio;
      
      try {
        await audio.play();
        console.log('✅ Audio playback started successfully');
      } catch (error: any) {
        console.warn('⚠️ Audio autoplay blocked:', error);
      }
    } catch (ttsError) {
      console.warn('⚠️ Text-to-speech failed, continuing without audio:', ttsError);
      // Game continues even if TTS fails - user can read the sentence
    }
  };

  const startSpeakingPhase = () => {
    // Clear any existing timer before starting new one
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    transitionToPhase('speaking');
    setGameState(prev => ({
      ...prev,
      timeRemaining: settings.timeLimit,
    }));

    // Start countdown timer with proper cleanup
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          // Clear timer immediately to prevent multiple timeouts
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          // Only call timeout if still in speaking phase, game is active, and no recording in progress
          if (gamePhaseRef.current === 'speaking' && gameActiveRef.current && !hasRecordingInProgressRef.current) {
            handleTimeOut();
          }
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,        // Whisper's preferred sample rate
          channelCount: 1,          // Mono is better for speech
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,    // Add automatic gain control
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      // Capture the current question ID when recording starts
      const recordingQuestionId = currentQuestionIdRef.current;

      // Try to use WAV format first (better for Whisper accuracy on short clips)
      // Then fallback to WebM/Opus if WAV not supported
      const preferredFormats = [
        'audio/wav',                    // Best for Whisper short clips
        'audio/webm;codecs=opus',       // Good compression, widely supported
        'audio/webm',                   // Fallback
        'audio/mp4',                    // Additional fallback
      ];

      let selectedFormat = 'audio/webm'; // Default fallback
      for (const format of preferredFormats) {
        if (MediaRecorder.isTypeSupported(format)) {
          selectedFormat = format;
          console.log(`🎤 Selected audio format: ${format}`);
          break;
        }
      }

      const recorderOptions: MediaRecorderOptions = {
        mimeType: selectedFormat,
      };

      // Add bitrate only for formats that support it
      if (selectedFormat.includes('webm') || selectedFormat.includes('mp4')) {
        recorderOptions.audioBitsPerSecond = 16000; // Optimized for speech
      }

      mediaRecorderRef.current = new MediaRecorder(stream, recorderOptions);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: selectedFormat });
        await processRecording(audioBlob, recordingQuestionId);
      };

      // Start recording with a small timeslice to capture early audio
      mediaRecorderRef.current.start(100); // 100ms timeslices for better capture
      
      console.log(`🎤 Recording started with format: ${selectedFormat} for optimal Whisper accuracy`);
    } catch (error) {
      console.error('❌ Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const processRecording = async (audioBlob: Blob, recordingQuestionId: number) => {
    // Validate that this recording belongs to the current question
    if (recordingQuestionId !== currentQuestionIdRef.current) {
      console.log(`🚫 Ignoring stale recording from question ${recordingQuestionId}, current question is ${currentQuestionIdRef.current}`);
      return;
    }
    
    // Check if game is still active and in a valid state for processing
    if (!gameActiveRef.current) {
      console.log('🚫 Ignoring recording - game is no longer active');
      return;
    }

    // Check if we're in a valid phase for processing recordings
    if (gamePhaseRef.current !== 'speaking') {
      console.log(`🚫 Ignoring recording - invalid phase: ${gamePhaseRef.current}`);
      return;
    }
    
    // Mark recording as in progress to prevent conflicts
    hasRecordingInProgressRef.current = true;
    
    // Clear timer since user provided an answer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    transitionToPhase('evaluating');

    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Transcribe with Whisper
      const transcriptionData = await callAPI('whisper-transcribe', {
        audioData: base64Audio,
        language: settings.targetLanguage,
        mimeType: audioBlob.type,
      });

      const transcription = transcriptionData.transcription;
      
      // Double-check question ID hasn't changed during API call
      if (recordingQuestionId !== currentQuestionIdRef.current || !gameActiveRef.current) {
        console.log('🚫 Question changed during transcription, ignoring result');
        hasRecordingInProgressRef.current = false;
        return;
      }
      
      setGameState(prev => ({ ...prev, userTranscription: transcription }));

      // Evaluate with ChatGPT - use ref to avoid stale state
      const evaluationData = await callAPI('translation-game', {
        action: 'evaluate_translation',
        userTranslation: transcription,
        correctTranslation: correctTranslationRef.current,
        nativeLanguage: settings.nativeLanguage,
        targetLanguage: settings.targetLanguage,
      });

      // Final check before applying results
      if (recordingQuestionId !== currentQuestionIdRef.current || !gameActiveRef.current) {
        console.log('🚫 Question changed during evaluation, ignoring result');
        hasRecordingInProgressRef.current = false;
        return;
      }

      // Use smart answer handling
      if (evaluationData.isCorrect) {
        handleCorrectAnswer(evaluationData);
      } else {
        handleIncorrectAnswer(evaluationData, evaluationData.feedback);
      }

    } catch (error) {
      console.error('❌ Error processing recording:', error);
      
      // Only show error if this recording is still valid for current question
      if (recordingQuestionId === currentQuestionIdRef.current && gameActiveRef.current) {
        handleIncorrectAnswer(null, 'Error processing your answer. Please try again.');
      }
    } finally {
      hasRecordingInProgressRef.current = false;
    }
  };

  const handleTimeOut = () => {
    // Prevent timeout if recording is being processed
    if (hasRecordingInProgressRef.current) {
      console.log('🚫 Timeout ignored - recording being processed');
      return;
    }

    // Clear timer and stop recording
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    stopRecording();
    
    // Use the standardized incorrect answer handler
    handleIncorrectAnswer(null, "Time's up! Here's the correct answer:");
  };

  const endGame = async () => {
    // Mark game as inactive
    gameActiveRef.current = false;
    isGeneratingRef.current = false;
    
    // Use comprehensive cleanup
    clearAllTimersAndTimeouts();
    
    // Stop recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop audio streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setGameState(prev => ({ ...prev, phase: 'complete' }));

    // 🆕 UPDATE SESSION DURATION: Update the recorded session with actual duration and score
    if (currentSessionId && sessionStartTime) {
      const endTime = new Date();
      const durationMs = endTime.getTime() - sessionStartTime.getTime();
      const durationMinutes = Math.max(1, Math.round(durationMs / 60000)); // Minimum 1 minute
      
      // Calculate final score - handle division by zero
      const finalScore = gameState.questionNumber > 0 
        ? Math.round((gameState.score / (gameState.questionNumber * 10)) * 100) // 10 points per question
        : 0;
      
      console.log('🔄 Updating translation game session:', durationMinutes, 'minutes, score:', finalScore);
      
      try {
        await updateLearningSession(currentSessionId, {
          duration_minutes: durationMinutes,
          score: finalScore,
          completed_at: endTime.toISOString(),
        });
        console.log('✅ Translation game session updated successfully');
      } catch (updateError) {
        console.error('⚠️ Failed to update translation game session:', updateError);
        // Don't throw - session was already recorded at start
      }
    }
  };

  const resetGame = () => {
    gameActiveRef.current = true;
    isGeneratingRef.current = false;
    hasRecordingInProgressRef.current = false;
    currentQuestionIdRef.current = 0; // Reset question ID counter
    gamePhaseRef.current = 'setup';
    questionHistoryRef.current = []; // Clear question history for reset
    clearAllTimersAndTimeouts(); // Comprehensive cleanup
    setCorrectAnswersCount(0); // Reset correct answers counter
    
    // Reset session tracking
    setCurrentSessionId(null);
    setSessionStartTime(null);
    
    setGameState({
      phase: 'setup',
      currentSentence: '',
      correctTranslation: '',
      userTranscription: '',
      score: 0,
      streak: 0,
      questionNumber: 0,
      timeRemaining: 0,
      isCorrect: null,
      feedback: '',
    });
  };

  const getLanguageName = (code: string) => {
    return LANGUAGE_OPTIONS.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return LANGUAGE_OPTIONS.find(lang => lang.code === code)?.flag || '🌐';
  };

  // Render Functions
  if (gameState.phase === 'setup') {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #f5f7a8 0%, #e8d5ff 50%, #d4a5ff 100%)'
      }}>
        {/* Grid Pattern Background - Matching PracticeWithAI */}
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

        {/* Simple Back Arrow - Matching PracticeWithAI */}
        <div className="relative z-10 max-w-5xl mx-auto p-4">
          <div className="mb-6">
              <button
                onClick={onBack}
              className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
              >
              <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </button>
        </div>

          {/* Clean Content Area - No White Background */}
          <div className="max-w-4xl mx-auto">
            {/* Hero Section with Game Description */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Rapid <span className="text-orange-500">Translation</span>
              </h2>
              <div className="max-w-2xl mx-auto mb-6">
                <p className="text-lg text-gray-700 font-medium mb-3">
                  <strong>How it works:</strong> AI speaks sentences in your native language, you translate them into your target language within the time limit!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                    <div className="text-blue-600 font-bold mb-1">🧠 Quick Thinking</div>
                    <div className="text-gray-700">Build instant translation reflexes</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                    <div className="text-green-600 font-bold mb-1">🗣️ Speaking Practice</div>
                    <div className="text-gray-700">Improve pronunciation & fluency</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                    <div className="text-purple-600 font-bold mb-1">⚡ Real-time AI</div>
                    <div className="text-gray-700">Instant feedback & scoring</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Grid Layout - Clean, No Background */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Language Settings */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-500" />
                  Languages
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Your Native Language
                  </label>
                  <select
                    value={settings.nativeLanguage}
                    onChange={(e) => setSettings(prev => ({ ...prev, nativeLanguage: e.target.value }))}
                    className="w-full p-3 border-2 border-white/50 bg-white/80 backdrop-blur-sm rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-sm shadow-sm"
                  >
                    {LANGUAGE_OPTIONS.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Select Language you want to practice
                  </label>
                  <select
                    value={settings.targetLanguage}
                    onChange={(e) => setSettings(prev => ({ ...prev, targetLanguage: e.target.value }))}
                    className="w-full p-3 border-2 border-white/50 bg-white/80 backdrop-blur-sm rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-sm shadow-sm"
                  >
                    {LANGUAGE_OPTIONS.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Game Settings */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-green-500" />
                  Game Settings
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setSettings(prev => ({ ...prev, difficulty: level }))}
                        className={`p-3 rounded-xl border-2 transition-all capitalize font-semibold text-sm shadow-sm ${
                          settings.difficulty === level
                            ? 'border-purple-500 bg-purple-100/80 text-purple-700 backdrop-blur-sm'
                            : 'border-white/50 bg-white/60 hover:bg-white/80 text-gray-700 backdrop-blur-sm'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Time per Question
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 20, 30, 40].map(time => (
                      <button
                        key={time}
                        onClick={() => setSettings(prev => ({ ...prev, timeLimit: time }))}
                        className={`p-3 rounded-xl border-2 transition-all font-semibold text-sm shadow-sm ${
                          settings.timeLimit === time
                            ? 'border-blue-500 bg-blue-100/80 text-blue-700 backdrop-blur-sm'
                            : 'border-white/50 bg-white/60 hover:bg-white/80 text-gray-700 backdrop-blur-sm'
                        }`}
                      >
                        {time}s
                      </button>
                    ))}
                  </div>
                </div>


              </div>
            </div>

            {/* Start Game Button */}
            <div className="mt-8 text-center">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
              >
                <Play className="w-6 h-6" />
                <span>Start Game</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'complete') {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #f5f7a8 0%, #e8d5ff 50%, #d4a5ff 100%)'
      }}>
        {/* Grid Pattern Background - Matching PracticeWithAI */}
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
        
        <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
            <p className="text-gray-600 mb-6">Great job on your translation skills!</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="font-semibold text-blue-700">Final Score</span>
                <span className="text-2xl font-bold text-blue-600">{gameState.score}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span className="font-semibold text-green-700">Questions Answered</span>
                <span className="text-xl font-bold text-green-600">{gameState.questionNumber}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <span className="font-semibold text-purple-700">Correct Answers</span>
                <span className="text-xl font-bold text-purple-600">{correctAnswersCount}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Play Again</span>
              </button>
              
              <button
                onClick={onBack}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Playing Interface
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #f5f7a8 0%, #e8d5ff 50%, #d4a5ff 100%)'
    }}>
      {/* Grid Pattern Background - Matching PracticeWithAI */}
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
      
      {/* Game Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          {/* Top Row with Back Button, Question Counter, Score and End Button */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </button>
              <span className="text-sm font-semibold text-gray-600">
                Question {gameState.questionNumber}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-semibold">{gameState.score} pts</span>
              </div>
              <button
                onClick={endGame}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
              >
                End Game
              </button>
            </div>
          </div>

          {/* Timer */}
          {(gameState.phase === 'speaking') && (
            <div className="text-center mb-4">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-lg font-bold ${
                gameState.timeRemaining <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'
            }`}>
              <Timer className="w-5 h-5" />
              <span>{gameState.timeRemaining}s</span>
            </div>
          </div>
          )}

          {/* Current Sentence */}
          <div className="text-center mb-6">
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-xl">{getLanguageFlag(settings.nativeLanguage)}</span>
                <h3 className="text-base font-semibold text-gray-700">
                  {gameState.phase === 'listening' ? 'Generating question...' : 
                   gameState.phase === 'evaluating' ? 'AI is thinking...' :
                   'Translate this sentence:'}
                </h3>
                {(gameState.phase === 'listening' || gameState.phase === 'evaluating') && 
                  <Loader className="w-4 h-4 text-blue-500 animate-spin" />}
              </div>
              
              {gameState.currentSentence && (
                <p className="text-xl font-bold text-gray-900 mb-2">{gameState.currentSentence}</p>
              )}
            </div>
          </div>

          {/* Speaking Interface */}
          {gameState.phase === 'speaking' && (
            <div className="text-center mb-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <span className="text-xl">{getLanguageFlag(settings.targetLanguage)}</span>
                  <h3 className="text-base font-semibold text-blue-700">Speak your translation:</h3>
              </div>
              
                <div className="mb-3">
                <button
                    onClick={mediaRecorderRef.current?.state === 'recording' ? stopRecording : startRecording}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      mediaRecorderRef.current?.state === 'recording'
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
                      : 'bg-blue-500 hover:bg-blue-600'
                    } text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
                >
                    {mediaRecorderRef.current?.state === 'recording' ? 
                      <MicOff className="w-6 h-6" /> : 
                      <Mic className="w-6 h-6" />}
                </button>
              </div>
              
                <p className="text-gray-600 text-sm">
                  {mediaRecorderRef.current?.state === 'recording' ? 
                    '🔴 Recording... Click to stop' : 
                 'Click the microphone to start speaking'}
              </p>
              </div>
                </div>
              )}

          {/* User Transcription */}
          {gameState.userTranscription && (
            <div className="text-center mb-4">
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <p className="text-xs font-semibold text-yellow-700 mb-1">You said:</p>
                <p className="text-base font-bold text-yellow-900">"{gameState.userTranscription}"</p>
              </div>
            </div>
          )}

          {/* Feedback */}
          {gameState.phase === 'feedback' && (
            <div className="text-center mb-6">
              <div className={`rounded-xl p-4 ${
                gameState.isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {gameState.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <h3 className={`text-lg font-bold ${
                    gameState.isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {gameState.isCorrect ? '🎉 Correct!' : '❌ Not quite right'}
                  </h3>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-gray-200 mb-2">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Correct answer:</p>
                  <p className="text-base font-bold text-gray-900">"{gameState.correctTranslation}"</p>
                </div>

                {gameState.feedback && (
                  <p className={`text-xs font-semibold ${
                    gameState.isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {gameState.feedback}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Loading States */}
          {(gameState.phase === 'listening' || gameState.phase === 'evaluating') && (
          <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <Loader className="w-6 h-6 text-purple-500 animate-spin" />
                <span className="text-gray-600 font-semibold">
                  {gameState.phase === 'listening' ? 'AI is preparing your challenge...' : 
                   'AI is evaluating your answer...'}
              </span>
              </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}