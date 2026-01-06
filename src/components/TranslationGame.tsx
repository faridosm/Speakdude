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
  // Note: These would be replaced with actual Bolt API calls
  const callAPI = async (endpoint: string, data: any) => {
    if (endpoint === 'translation-game' && data.action === 'generate_sentence') {
      return await mockGenerateSentence(data.nativeLanguage, data.targetLanguage, data.difficulty);
    } else if (endpoint === 'translation-game' && data.action === 'evaluate_translation') {
      return await mockEvaluateTranslation(data.userTranslation, data.correctTranslation);
    }
    throw new Error('API endpoint not implemented yet');
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
        questionHistory: questionHistoryRef.current,
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
    // Text-to-speech would be implemented with Bolt's audio services
    console.log('🔊 Text-to-speech not yet implemented for Bolt database');
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
      // Mock transcription for now
      const transcription = "Mock transcription - speech recognition not yet implemented";
      
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
    
// Mock API functions for Translation Game (to be implemented with Bolt's services)
    // Reset session tracking
const mockGenerateSentence = async (nativeLanguage: string, targetLanguage: string, difficulty: string) => {
                onClick={onBack}
  // Simulate API delay
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-all duration-300"
  await new Promise(resolve => setTimeout(resolve, 1000));
              >
  
                Back to Dashboard
  const mockSentences = {
              </button>
    beginner: [
            </div>
      { nativeSentence: "Hello, how are you?", targetTranslation: "Hola, ¿cómo estás?" },
          </div>
      { nativeSentence: "I like coffee", targetTranslation: "Me gusta el café" },
        </div>
      { nativeSentence: "What time is it?", targetTranslation: "¿Qué hora es?" }
      </div>
    ],
    );
    intermediate: [
  }
      { nativeSentence: "I would like to book a hotel room", targetTranslation: "Me gustaría reservar una habitación de hotel" },

      { nativeSentence: "Can you help me find the train station?", targetTranslation: "¿Puedes ayudarme a encontrar la estación de tren?" }
  // Game Playing Interface
    ],
  return (
    advanced: [
    <div className="min-h-screen relative overflow-hidden" style={{
      { nativeSentence: "The economic situation has improved significantly", targetTranslation: "La situación económica ha mejorado significativamente" }
      background: 'linear-gradient(135deg, #f5f7a8 0%, #e8d5ff 50%, #d4a5ff 100%)'
    ]
    }}>
  };
      {/* Grid Pattern Background - Matching PracticeWithAI */}
  
      <div 
  const sentences = mockSentences[difficulty as keyof typeof mockSentences] || mockSentences.beginner;
        className="absolute inset-0 opacity-15"
  const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
        style={{
  
          backgroundImage: `
  return {
            linear-gradient(rgba(0,0,0,0.25) 1px, transparent 1px),
    nativeSentence: randomSentence.nativeSentence,
            linear-gradient(90deg, rgba(0,0,0,0.25) 1px, transparent 1px)
    targetTranslation: randomSentence.targetTranslation,
          `,
    difficulty
          backgroundSize: '60px 60px'
  };
        }}
};
      />

      
const mockEvaluateTranslation = async (userTranslation: string, correctTranslation: string) => {
      {/* Game Content */}
  // Simulate API delay
      <div className="relative z-10 max-w-4xl mx-auto p-4">
  await new Promise(resolve => setTimeout(resolve, 800));
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
  
          {/* Top Row with Back Button, Question Counter, Score and End Button */}
  // Simple mock evaluation
          <div className="mb-4 flex items-center justify-between">
  const similarity = userTranslation.toLowerCase().includes(correctTranslation.toLowerCase().split(' ')[0]);
            <div className="flex items-center space-x-4">
  
              <button
  return {
                onClick={onBack}
    isCorrect: similarity,
                className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
    score: similarity ? 85 : 45,
              >
    feedback: similarity ? "Great job! Very close to the correct translation." : "Good attempt! The correct answer is shown above."
                <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-800" />
  };
              </button>
};
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