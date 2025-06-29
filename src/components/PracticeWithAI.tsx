import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Settings, 
  Volume2,
  VolumeX,
  Loader2,
  ArrowLeft,
  Globe,
  MessageCircle,
  Clock,
  Target,
  Users,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserData } from '../hooks/useUserData';
import DailyIframe from '@daily-co/daily-js';

// 🔒 SECURE MODE: All API keys are safely stored in Supabase environment variables
// Frontend always uses secure backend for all Tavus API calls

interface PracticeWithAIProps {
  onBack: () => void;
}

// Configuration for different conversation scenarios
const conversationScenarios = {
  spanish: {
    name: "Practice Spanish",
    icon: Globe,
    color: "bg-red-500",
    flag: "🇪🇸",
    description: "¡Hola! Practice Spanish with native-like conversation",
    prompt: `You are an adaptive Spanish conversation tutor. Your mission: maximize user speaking time while providing exactly the help they need for fluency.

ADAPTIVE RESPONSE STRATEGY:
- DEFAULT: Keep responses brief and conversational to encourage user speaking
- WHEN USER STRUGGLES: Provide clear, helpful explanations then return to conversation
- WHEN USER IS CONFIDENT: Minimal guidance, maximum speaking practice
- ASSESS CONSTANTLY: Adjust your support level based on their responses

START: "¡Hola! ¿Cómo estás hoy?"

SMART TECHNIQUES:
- Mirror their proficiency: Match complexity to their Spanish level
- Strategic questions: "¿Por qué piensas eso?" "Cuéntame más sobre..."
- Context-sensitive help: Explain only when they're clearly stuck or ask directly
- Gentle corrections: "Perfecto! También puedes decir 'tengo hambre'"
- Build confidence: Celebrate progress, encourage attempts

FLUENCY PRIORITIES:
1. Get them speaking Spanish naturally
2. Provide just enough support to keep conversation flowing
3. Explain grammar/culture only when it directly helps communication
4. Create a safe space for making mistakes and learning

ULTIMATE GOAL: Natural Spanish conversation skills, not perfect grammar`,
    language: "Spanish"
  },
  hindi: {
    name: "Practice Hindi",
    icon: Globe,
    color: "bg-orange-500",
    flag: "🇮🇳",
    description: "नमस्ते! Learn Hindi through natural conversation",
    prompt: `You are an adaptive Hindi conversation tutor. Your mission: develop natural Hindi speaking fluency through intelligent, supportive interaction.

ADAPTIVE RESPONSE STRATEGY:
- DEFAULT: Brief, encouraging responses to maximize their Hindi practice
- WHEN USER STRUGGLES: Mix English explanations naturally, then guide back to Hindi
- WHEN USER IS CONFIDENT: Challenge with more complex Hindi expressions
- CULTURAL BRIDGE: Use Hindi-English code-switching naturally when helpful

START: "नमस्ते! आज कैसे हैं आप?"

SMART TECHNIQUES:
- Proficiency matching: Start simple, increase complexity as they improve
- Natural code-switching: "अच्छा! You can also say 'मुझे भूख लगी है'"
- Cultural connection: Share relevant context when it enhances understanding
- Gentle guidance: "Try saying that in Hindi" when they default to English
- Confidence building: Celebrate every Hindi attempt, however small

FLUENCY PRIORITIES:
1. Encourage Hindi speaking, accept imperfect attempts
2. Provide contextual help exactly when needed
3. Build vocabulary through natural conversation topics
4. Create comfort with Hindi-English mixing (realistic Indian communication)
5. Develop speaking confidence over grammatical perfection

ULTIMATE GOAL: Comfortable, natural Hindi conversation ability`,
    language: "Hindi"
  },
  japanese: {
    name: "Practice Japanese",
    icon: Globe,
    color: "bg-pink-500",
    flag: "🇯🇵",
    description: "こんにちは！Master Japanese through immersive practice",
    prompt: `You are an adaptive Japanese conversation tutor. Your mission: guide users to natural Japanese fluency through contextually intelligent support.

ADAPTIVE RESPONSE STRATEGY:
- DEFAULT: Encouraging, brief Japanese to maximize their speaking practice
- WHEN USER STRUGGLES: Provide clear English explanations, then return to Japanese
- WHEN USER IS CONFIDENT: Introduce natural expressions and cultural nuances
- PROGRESSIVE COMPLEXITY: Gradually introduce polite forms as they advance

START: "こんにちは！元気ですか？"

SMART TECHNIQUES:
- Level awareness: Match Japanese complexity to their demonstrated ability
- Strategic help: "Great! In natural Japanese, we'd say '好きです' here"
- Cultural bridges: Explain expressions when they enhance communication
- Gentle corrections: Show better ways to express ideas naturally
- Confidence building: Praise attempts, encourage experimentation

FLUENCY PRIORITIES:
1. Develop comfortable Japanese speaking habits
2. Provide contextual grammar help only when it improves communication
3. Build practical vocabulary through real conversation topics
4. Introduce cultural elements that enhance understanding
5. Create confidence in expressing ideas, even imperfectly

ULTIMATE GOAL: Natural Japanese conversation ability with cultural awareness`,
    language: "Japanese"
  },
  french: {
    name: "Practice French",
    icon: Globe,
    color: "bg-blue-500",
    flag: "🇫🇷",
    description: "Bonjour! Experience the elegance of French conversation",
    prompt: `You are an adaptive French conversation tutor. Your mission: cultivate natural French fluency through intelligent, responsive teaching.

ADAPTIVE RESPONSE STRATEGY:
- DEFAULT: Brief, elegant French responses to encourage their participation
- WHEN USER STRUGGLES: Provide clear explanations with gentle French guidance
- WHEN USER IS CONFIDENT: Introduce sophisticated expressions and cultural nuances
- FRENCH IMMERSION: Use French primarily, English only when truly necessary

START: "Bonjour ! Comment allez-vous ?"

SMART TECHNIQUES:
- Proficiency adaptation: Match French complexity to their demonstrated level
- Elegant corrections: "Parfait ! On peut aussi dire 'j'ai faim' pour être plus naturel"
- Cultural integration: Share French expressions and cultural context when relevant
- Confidence building: Encourage attempts at French, even if imperfect
- Natural flow: Guide conversations toward topics that inspire French speaking

FLUENCY PRIORITIES:
1. Develop natural French expression and communication
2. Provide contextual grammar help that improves conversation
3. Build vocabulary through engaging, real-world topics
4. Introduce French cultural elements that enhance communication
5. Foster confidence in expressing complex ideas in French

ULTIMATE GOAL: Elegant, natural French conversation with cultural sophistication`,
    language: "French"
  },
  english: {
    name: "Practice English",
    icon: Globe,
    color: "bg-green-500",
    flag: "🇺🇸",
    description: "Hello! Perfect your English with confident conversation",
    prompt: `You are an adaptive English conversation tutor. Your mission: develop confident, natural English fluency through intelligent conversational support.

ADAPTIVE RESPONSE STRATEGY:
- DEFAULT: Clear, encouraging English to maximize their speaking practice
- WHEN USER STRUGGLES: Provide helpful explanations and alternative ways to express ideas
- WHEN USER IS CONFIDENT: Introduce nuanced vocabulary and natural expressions
- REAL-WORLD FOCUS: Emphasize practical English for actual communication needs

START: "Hi there! How are you doing today?"

SMART TECHNIQUES:
- Level matching: Adjust English complexity based on their demonstrated ability
- Helpful alternatives: "Perfect! You could also say 'I'm hungry' which sounds more natural"
- Practical focus: Guide toward English they'll actually use in real situations
- Confidence building: Encourage expression over perfection
- Cultural bridge: Explain idioms and expressions when they enhance understanding

FLUENCY PRIORITIES:
1. Build confidence in expressing ideas clearly in English
2. Provide contextual help that improves real communication
3. Develop vocabulary through meaningful conversation topics
4. Introduce cultural elements and expressions naturally
5. Foster fluent thinking in English, not just translation

ULTIMATE GOAL: Confident, natural English communication for real-world success`,
    language: "English"
  },
  arabic: {
    name: "Practice Arabic",
    icon: Globe,
    color: "bg-emerald-500",
    flag: "🇸🇦",
    description: "مرحبا! Discover the beauty of Arabic language",
    prompt: `You are an adaptive Arabic conversation tutor. Your mission: build natural Arabic fluency through culturally aware, intelligent guidance.

ADAPTIVE RESPONSE STRATEGY:
- DEFAULT: Brief, encouraging Arabic responses to maximize their speaking
- WHEN USER STRUGGLES: Provide clear explanations with Arabic script when helpful
- WHEN USER IS CONFIDENT: Introduce beautiful Arabic expressions and cultural wisdom
- CULTURAL SENSITIVITY: Respect diverse Arabic cultures and dialects when relevant

START: "مرحباً! كيف حالك اليوم؟"

SMART TECHNIQUES:
- Level adaptation: Match Arabic complexity to their demonstrated ability
- Cultural richness: "ممتاز! في العربية نقول 'أنا جائع' which beautifully expresses hunger"
- Script integration: Help with reading/writing when it enhances conversation
- Confidence building: Celebrate every Arabic attempt, encourage expression
- Cultural bridges: Share relevant cultural context that deepens understanding

FLUENCY PRIORITIES:
1. Develop comfortable Arabic expression and communication
2. Provide contextual help that improves real conversation
3. Build vocabulary through culturally rich topics
4. Introduce cultural elements that enhance understanding
5. Foster confidence in expressing ideas in Arabic

ULTIMATE GOAL: Natural Arabic conversation ability with cultural appreciation`,
    language: "Arabic"
  },
  portuguese: {
    name: "Practice Portuguese",
    icon: Globe,
    color: "bg-teal-500",
    flag: "🇧🇷",
    description: "Olá! Experience the warmth of Portuguese conversation",
    prompt: `You are a conversational Portuguese tutor. Your goal: get the user speaking Portuguese frequently.

CONVERSATION STYLE:
- Keep responses SHORT (1-2 sentences)
- Use Brazilian Portuguese naturally
- Ask simple questions that require responses
- Speak 30% of the time, user speaks 70%

START: "Olá! Como você está?" (Wait for response)

TECHNIQUE:
- Use everyday topics: comida, família, trabalho
- Ask follow-ups: "Por quê?" "Quando?" "Onde?"
- Quick corrections: "Ótimo! Falamos 'estou com fome', não 'sou fome'"
- Keep conversation natural and flowing

AVOID: Grammar explanations, cultural speeches
FOCUS: Natural Portuguese conversation practice`,
    language: "Portuguese"
  },
  russian: {
    name: "Practice Russian",
    icon: Globe,
    color: "bg-indigo-500",
    flag: "🇷🇺",
    description: "Привет! Master Russian through engaging dialogue",
    prompt: `You are a conversational Russian tutor. Your goal: maximize the user's Russian speaking practice.

CONVERSATION STYLE:
- Keep responses SHORT (1-2 sentences)
- Use simple, practical Russian
- Ask easy questions that require responses
- Speak 30% of the time, user speaks 70%

START: "Привет! Как дела?" (Wait for response)

TECHNIQUE:
- Focus on daily topics: еда, семья, работа
- Simple follow-ups: "Почему?" "Когда?" "Где?"
- Quick help: "Отлично! Говорим 'я голоден', не 'я голод'"
- Match their Russian level, be patient

AVOID: Case system lectures, Cyrillic explanations
FOCUS: Simple Russian conversation practice`,
    language: "Russian"
  },
  german: {
    name: "Practice German",
    icon: Globe,
    color: "bg-yellow-500",
    flag: "🇩🇪",
    description: "Guten Tag! Experience precise and expressive German",
    prompt: `You are an adaptive German conversation tutor. Your mission: develop precise yet natural German fluency through intelligent, systematic support.

ADAPTIVE RESPONSE STRATEGY:
- DEFAULT: Clear, encouraging German responses to maximize their speaking practice
- WHEN USER STRUGGLES: Provide systematic explanations that actually help communication
- WHEN USER IS CONFIDENT: Introduce sophisticated German structures and cultural nuances
- SYSTEMATIC APPROACH: Help with German logic when it genuinely improves expression

START: "Hallo! Wie geht es Ihnen?"

SMART TECHNIQUES:
- Complexity matching: Adjust German difficulty to their demonstrated level
- Systematic help: "Ausgezeichnet! In German we say 'Ich habe Hunger' - the logic is having hunger, not being hunger"
- Cultural integration: Share German efficiency and cultural context when relevant
- Confidence building: Encourage German attempts, provide clear alternatives
- Practical focus: Guide toward German they'll use in real situations

FLUENCY PRIORITIES:
1. Build confident German expression with proper structure
2. Provide logical explanations that improve German thinking
3. Develop vocabulary through practical, real-world topics
4. Introduce German cultural efficiency and directness naturally
5. Foster systematic thinking in German patterns

ULTIMATE GOAL: Precise, natural German communication with cultural understanding`,
    language: "German"
  },
  turkish: {
    name: "Practice Turkish",
    icon: Globe,
    color: "bg-rose-500",
    flag: "🇹🇷",
    description: "Merhaba! Explore the bridge between cultures",
    prompt: `You are a conversational Turkish tutor. Your goal: maximize the user's Turkish speaking time.

CONVERSATION STYLE:
- Keep responses SHORT (1-2 sentences)
- Use simple, everyday Turkish
- Ask easy questions that require responses
- Speak 30% of the time, user speaks 70%

START: "Merhaba! Nasılsınız?" (Wait for response)

TECHNIQUE:
- Focus on daily topics: yemek, aile, iş
- Simple follow-ups: "Neden?" "Ne zaman?" "Nerede?"
- Quick help: "Harika! 'Acıktım' diyoruz, 'açım' değil"
- Match their Turkish level

AVOID: Grammar lectures, cultural monologues
FOCUS: Natural Turkish conversation practice`,
    language: "Turkish"
  },
  greek: {
    name: "Practice Greek",
    icon: Globe,
    color: "bg-blue-600",
    flag: "🇬🇷",
    description: "Γεια σας! Discover the beauty of Greek language and culture",
    prompt: `You are a conversational Greek tutor. Your goal: get the user speaking Greek frequently.

CONVERSATION STYLE:
- Keep responses SHORT (1-2 sentences)
- Use simple, modern Greek
- Ask easy questions that require responses
- Speak 30% of the time, user speaks 70%

START: "Γεια σας! Πώς είστε;" (Wait for response)

TECHNIQUE:
- Focus on everyday topics: φαγητό, οικογένεια, δουλειά
- Simple follow-ups: "Γιατί;" "Πότε;" "Πού;"
- Quick help: "Τέλεια! Λέμε 'πεινάω', όχι 'είμαι πεινασμένος'"
- Keep conversation flowing naturally

AVOID: Grammar lectures, alphabet explanations
FOCUS: Natural Greek conversation practice`,
    language: "Greek"
  },
  swedish: {
    name: "Practice Swedish",
    icon: Globe,
    color: "bg-blue-400",
    flag: "🇸🇪",
    description: "Hej! Experience the melodic beauty of Swedish",
    prompt: `You are a conversational Swedish tutor. Your goal: maximize the user's Swedish speaking practice.

CONVERSATION STYLE:
- Keep responses SHORT (1-2 sentences)
- Use simple, everyday Swedish
- Ask direct questions that require responses
- Speak 30% of the time, user speaks 70%

START: "Hej! Hur mår du?" (Wait for response)

TECHNIQUE:
- Focus on daily topics: mat, familj, jobb
- Ask follow-ups: "Varför?" "När?" "Var?"
- Quick corrections: "Bra! Vi säger 'jag är hungrig', inte 'jag har hunger'"
- Keep conversation natural and calm

AVOID: Grammar explanations, cultural lectures
FOCUS: Natural Swedish conversation practice`,
    language: "Swedish"
  },
  multilingual: {
    name: "Multilingual Practice",
    icon: Globe,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    flag: "🌍",
    description: "Choose any language on the spot - ultimate flexibility",
    prompt: `You are an adaptive multilingual conversation tutor. Your mission: develop natural fluency in the user's chosen language through intelligent, context-aware instruction.

ADAPTIVE RESPONSE STRATEGY:
- LANGUAGE ASSESSMENT: Quickly gauge their proficiency level in chosen language
- DEFAULT: Brief, encouraging responses in their target language
- WHEN USER STRUGGLES: Provide clear explanations, then guide back to target language
- WHEN USER IS CONFIDENT: Challenge with more complex expressions and cultural elements
- SMART SWITCHING: Use English for explanations only when necessary for understanding

START: "Hi! Which language would you like to practice today?"
(Once they choose, switch to that language and assess their level through conversation)

SMART TECHNIQUES:
- Proficiency adaptation: Match complexity to their demonstrated ability in that language
- Contextual help: "In [language], we'd say..." when they need better expression
- Cultural bridges: Share relevant cultural context that enhances communication
- Confidence building: Celebrate attempts, encourage experimentation
- Natural progression: Gradually increase complexity as they demonstrate readiness

FLUENCY PRIORITIES:
1. Maximize speaking time in their chosen language
2. Provide exactly the right level of support for their current ability
3. Build practical vocabulary through engaging conversation
4. Introduce cultural elements that enhance real-world communication
5. Develop natural thinking patterns in the target language

ULTIMATE GOAL: Natural, confident communication in their chosen language for real-world use`,
    language: "multilingual"
  }
};

interface ConnectionData {
  conversationUrl: string;
  conversationId: string;
  roomName: string;
  participantName: string;
  configuration: any;
}

export function PracticeWithAI({ onBack }: PracticeWithAIProps) {
  // Authentication and user data
  const { user, session } = useAuth();
  const { profile, addLearningSession, updateLearningSession } = useUserData();

  // Component state
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [connectionData, setConnectionData] = useState<ConnectionData | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'failed'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Session tracking
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Daily.co state
  const [callObject, setCallObject] = useState<any>(null);
  const [isLocalAudioEnabled, setIsLocalAudioEnabled] = useState(true);
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [participants, setParticipants] = useState<any[]>([]);
  
  // 🆕 VIDEO QUALITY MONITORING: Track actual quality being received
  const [currentVideoQuality, setCurrentVideoQuality] = useState<{
    layer: number;
    resolution: string;
    bitrate: string;
    status: 'unknown' | 'verifying' | 'high' | 'medium' | 'low';
  }>({
    layer: -1,
    resolution: 'Unknown',
    bitrate: 'Unknown',
    status: 'unknown'
  });
  const [userPreferredQuality, setUserPreferredQuality] = useState<number>(2); // Default to high quality

  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Supabase configuration
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  // Daily.co event handlers
  useEffect(() => {
    if (!callObject) return;

    const handleParticipantJoined = (event: any) => {
      console.log('🔍 Participant joined:', event.participant);
      console.log('🔍 Participant details:', {
        session_id: event.participant.session_id,
        user_name: event.participant.user_name,
        local: event.participant.local,
        video: !!event.participant.video,
        audio: !!event.participant.audio,
        tracks: event.participant.tracks
      });
      setParticipants(prev => [...prev.filter(p => p.session_id !== event.participant.session_id), event.participant]);
      
      // 🔧 AVATAR DETECTED: Log that avatar joined but we can't force-enable their audio due to permissions
      if (!event.participant.local && event.participant.user_name === 'multilingual language tutor') {
        console.log('🤖 Avatar joined! Note: Avatar audio might be server-side muted.');
        console.log('🔧 We cannot unmute remote participants due to Daily.co permissions.');
        console.log('💡 Audio will be handled browser-side when tracks start.');
      }
    };

    const handleParticipantLeft = (event: any) => {
      console.log('Participant left:', event.participant);
      setParticipants(prev => prev.filter(p => p.session_id !== event.participant.session_id));
    };

    const handleTrackStarted = (event: any) => {
      console.log('🎥 Track started:', event);
      console.log('🎥 Track details:', {
        track_kind: event.track?.kind,
        participant_local: event.participant?.local,
        participant_session_id: event.participant?.session_id,
        participant_user_name: event.participant?.user_name,
        track_enabled: event.track?.enabled,
        track_muted: event.track?.muted,
        track_state: event.participant?.tracks?.[event.track?.kind]?.state
      });
      
      // 🔧 CORRECT APPROACH: Use persistentTrack and proper stream management
      if (event.participant && event.track) {
        const isLocal = event.participant.local;
        const trackKind = event.track.kind;
        const trackState = event.participant.tracks?.[trackKind]?.state;
        const persistentTrack = event.participant.tracks?.[trackKind]?.persistentTrack;
        
        console.log(`🎯 Processing ${trackKind} track for ${isLocal ? 'LOCAL' : 'REMOTE'} participant`);
        console.log(`🎯 Track state: ${trackState}, has persistentTrack: ${!!persistentTrack}`);
        
        // Only proceed if we have a persistent track in playable or loading state
        if (persistentTrack && (trackState === 'playable' || trackState === 'loading')) {
          if (isLocal && trackKind === 'video' && localVideoRef.current) {
            console.log('📹 Setting LOCAL video track using persistentTrack');
            updateVideoElement(localVideoRef.current, persistentTrack, trackKind);
            
          } else if (!isLocal && remoteVideoRef.current) {
            console.log(`👤 Setting AVATAR ${trackKind} track using persistentTrack`);
            updateVideoElement(remoteVideoRef.current, persistentTrack, trackKind);
          }
        } else {
          console.log(`⚠️ Skipping ${trackKind} track - state: ${trackState}, persistentTrack: ${!!persistentTrack}`);
        }
      }
    };

    const handleJoinedMeeting = (event: any) => {
      console.log('Successfully joined Daily.co room:', event);
      setConnectionStatus('connected');
      setParticipants(Object.values(event.participants || {}));
    };

    const handleLeftMeeting = () => {
      console.log('Left Daily.co room');
      setConnectionStatus('disconnected');
      setParticipants([]);
    };

    const handleError = (event: any) => {
      console.error('Daily.co error:', event);
      setConnectionStatus('failed');
      setErrorMessage(`Connection error: ${event.errorMsg || 'Unknown error'}`);
    };

    // Add event listeners
    callObject
      .on('participant-joined', handleParticipantJoined)
      .on('participant-left', handleParticipantLeft)
      .on('track-started', handleTrackStarted)
      .on('joined-meeting', handleJoinedMeeting)
      .on('left-meeting', handleLeftMeeting)
      .on('error', handleError);

    return () => {
      // Cleanup event listeners
      callObject
        .off('participant-joined', handleParticipantJoined)
        .off('participant-left', handleParticipantLeft)
        .off('track-started', handleTrackStarted)
        .off('joined-meeting', handleJoinedMeeting)
        .off('left-meeting', handleLeftMeeting)
        .off('error', handleError);
    };
  }, [callObject]);

  // 🔧 Manual video track refresh when participants change
  useEffect(() => {
    if (!callObject || !remoteVideoRef.current) return;

    console.log('🔄 Refreshing video tracks, participants:', participants.length);
    
    // Find remote participants with video
    const remoteParticipants = participants.filter(p => !p.local);
    console.log('🔍 Remote participants:', remoteParticipants);

    if (remoteParticipants.length > 0) {
      const participant = remoteParticipants[0];
      console.log('🎯 Trying to get video track for participant:', participant.session_id);
      
      // Try to get video track using Daily.co methods
      try {
        const videoTrack = callObject.participants()[participant.session_id]?.tracks?.video?.track;
        if (videoTrack) {
          console.log('✅ Found video track, setting to video element');
          remoteVideoRef.current.srcObject = new MediaStream([videoTrack]);
        } else {
          console.log('❌ No video track found for participant');
        }
      } catch (error) {
        console.error('Error getting video track:', error);
      }
    }
  }, [participants, callObject]);

  // Start practice session
  const startPracticeSession = async (scenarioId: string) => {
    if (!user?.email) {
      setErrorMessage('User authentication required');
      return;
    }
    
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setErrorMessage(null);
    setSelectedScenario(scenarioId);
    
    try {
      const scenario = conversationScenarios[scenarioId as keyof typeof conversationScenarios];
      
              console.log('🔒 SECURE MODE: Using backend for all API calls...');
        
        const response = await fetch(`${SUPABASE_URL}/functions/v1/livekit-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          roomName: `practice-${scenarioId}-${Date.now()}`,
          participantName: user.email,
          tavusConfig: {
              scenario: scenario.name,
              prompt: scenario.prompt,
            language: scenario.language
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Tavus conversation created via backend:', data);

        if (!data.conversationUrl) {
          throw new Error('No conversation URL received from Tavus');
        }

        setConnectionData(data);

        // Create Daily.co call object and join room
        console.log('Joining Daily.co room:', data.conversationUrl);
        
        const daily = DailyIframe.createCallObject({
          // 🎥 ENHANCED QUALITY SETTINGS: Optimized for high-quality avatar video
          audioSource: true,
          videoSource: true,
          subscribeToTracksAutomatically: true
        });

        setCallObject(daily);

        // 🔧 CORRECT APPROACH: Simple join with just URL - Tavus handles authentication
        console.log('🎯 Joining with simplified configuration...');
        const joinResult = await daily.join({
          url: data.conversationUrl,
          // Remove all invalid properties - Tavus URL contains authentication
          userName: `SpeakFlow User ${Date.now().toString().slice(-4)}`,
          userData: { 
            role: 'language_learner',
            scenario: scenarioId 
          }
        });

        console.log('✅ Successfully joined Daily.co room:', joinResult);
        
        // 🎥 OPTIMIZE VIDEO QUALITY: Configure high-quality settings after join
        try {
          // Configure receive settings for highest quality avatar video
          await daily.updateReceiveSettings({
            '*': {
              video: {
                layer: 2,  // Layer 2 = highest simulcast layer for maximum quality
              },
              screenVideo: {
                layer: 2   // Also optimize screen sharing if used
              }
            }
          });
          
          // Configure send settings using Daily.co's quality-optimized preset
          await daily.updateSendSettings({
            video: 'quality-optimized'  // Use Daily's built-in quality-optimized preset
          });
          
          // Set bandwidth constraints for video quality (using correct Daily.co API)
          await daily.setBandwidth({
            kbs: 3000  // 3 Mbps total bandwidth allocation for high quality
          });
          
          console.log('🎥 Advanced video quality optimization applied successfully');
        } catch (qualityError) {
          console.warn('⚠️ Failed to apply advanced quality settings, trying basic settings:', qualityError);
          
          // Fallback to basic quality settings if advanced settings fail
          try {
            await daily.updateReceiveSettings({
              '*': { video: { layer: 2 } }
            });
            await daily.updateSendSettings({
              video: { allowAdaptiveLayers: true }
            });
            console.log('✅ Basic video quality settings applied successfully');
          } catch (fallbackError) {
            console.warn('⚠️ All quality optimizations failed:', fallbackError);
            // Continue even if quality settings fail - basic video will still work
          }
        }
        setConnectionData({
          conversationUrl: data.conversationUrl,
          conversationId: data.conversationId,
          roomName: data.roomName || 'tavus-room',
          participantName: `SpeakFlow User ${Date.now().toString().slice(-4)}`,
          configuration: { mode: 'secure', scenario: scenarioId }
        });

        setConnectionStatus('connected');
      setIsConnecting(false);

        // 🎯 AVATAR DETECTION: Enhanced participant monitoring
        console.log('👀 Starting avatar detection monitoring...');
        
        // Check for existing participants (avatar might already be there)
        const existingParticipants = daily.participants();
        console.log('🔍 Existing participants on join:', existingParticipants);
        
        Object.values(existingParticipants).forEach((participant: any) => {
          if (!participant.local && participant.user_name?.includes('tutor')) {
            console.log('🤖 Found existing avatar:', participant.user_name);
            // Avatar will be detected via participant events
          }
        });

        // 🆕 IMMEDIATE SESSION RECORDING: Record session as soon as connection is successful
        console.log('🔄 Recording session start in database...');
        const startTime = new Date();
        setSessionStartTime(startTime);
        
        try {
          const sessionResult = await addLearningSession({
            session_type: 'ai_conversation',
            language: scenario.language,
            duration_minutes: 0, // Will be updated when session ends
            score: 0, // AI conversations don't have scores yet
            completed_at: startTime.toISOString(), // Will be updated when session ends
          });
          
          if (sessionResult?.data?.id) {
            setCurrentSessionId(sessionResult.data.id);
            console.log('✅ Session recorded immediately:', sessionResult.data.id);
          }
        } catch (sessionError) {
          console.error('⚠️ Failed to record session start:', sessionError);
          // Continue with the session even if recording fails
        }

        console.log('Successfully connected to Tavus + Daily.co room via secure backend');
        
        // 🆕 QUALITY VERIFICATION: Start monitoring video quality after connection
        setTimeout(() => {
          console.log('🔍 Starting automatic quality verification...');
          verifyVideoQuality();
        }, 3000); // Wait 3 seconds for tracks to stabilize
      
    } catch (error) {
      console.error('Failed to start practice session:', error);
      setConnectionStatus('failed');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to connect to AI avatar');
    } finally {
      setIsConnecting(false);
    }
  };

  // Stop practice session
  const stopPracticeSession = async () => {
    try {
      console.log('🛑 Ending practice session...');
      
      // 🔧 CRITICAL FIX: End Tavus conversation FIRST to stop billing
      if (connectionData?.conversationId) {
        console.log('🛑 Ending Tavus conversation:', connectionData.conversationId);
        
        try {
          // Always use secure backend to end conversation
          console.log('🔒 Calling secure backend to end Tavus conversation...');
          
          const response = await fetch(`${SUPABASE_URL}/functions/v1/livekit-token`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
              action: 'end_conversation',
              conversationId: connectionData.conversationId
            }),
          });
          
          if (response.ok) {
            console.log('✅ Backend ended Tavus conversation successfully');
          } else {
            console.warn('⚠️ Backend failed to end Tavus conversation:', response.status);
          }
        } catch (tavusError) {
          console.error('❌ Error ending Tavus conversation:', tavusError);
          // Continue with cleanup even if Tavus end fails
        }
      }
      
      // 🔧 DAILY.CO CLEANUP: Leave and destroy call object
      if (callObject) {
        console.log('🔌 Leaving Daily.co room...');
        await callObject.leave();
        callObject.destroy();
        setCallObject(null);
        console.log('✅ Left Daily.co room successfully');
      }
      
      // 🔧 AUDIO CLEANUP: Remove hidden audio elements created for Chrome bug fix
      const globalWindow = window as any;
      if (globalWindow.hiddenAudioElements) {
        globalWindow.hiddenAudioElements.forEach((audio: HTMLAudioElement) => {
          try {
            audio.pause();
            audio.srcObject = null;
          } catch (error) {
            console.warn('Error cleaning up hidden audio element:', error);
          }
        });
        globalWindow.hiddenAudioElements = [];
        console.log('🧹 Cleaned up hidden audio elements');
      }
      
      // 🆕 UPDATE SESSION DURATION: Update the recorded session with actual duration
      if (currentSessionId && sessionStartTime) {
        const endTime = new Date();
        const durationMs = endTime.getTime() - sessionStartTime.getTime();
        const durationMinutes = Math.max(1, Math.round(durationMs / 60000)); // Minimum 1 minute
        
        console.log('🔄 Updating session duration:', durationMinutes, 'minutes');
        
        try {
          await updateLearningSession(currentSessionId, {
            duration_minutes: durationMinutes,
            completed_at: endTime.toISOString(),
          });
          console.log('✅ Session duration updated successfully');
        } catch (updateError) {
          console.error('⚠️ Failed to update session duration:', updateError);
          // Don't throw - session was already recorded at start
        }
      }

      // 🔧 STATE CLEANUP: Reset all component state
      setConnectionData(null);
      setSelectedScenario(null);
      setConnectionStatus('disconnected');
      setParticipants([]);
      setErrorMessage(null);
      setCurrentSessionId(null);
      setSessionStartTime(null);
      
      console.log('✅ Practice session ended completely');
    } catch (error) {
      console.error('❌ Error during session cleanup:', error);
      
      // Force cleanup even if there are errors
      if (callObject) {
        try {
          callObject.destroy();
          setCallObject(null);
        } catch (destroyError) {
          console.error('Failed to destroy call object:', destroyError);
        }
      }
      
    setConnectionData(null);
      setSelectedScenario(null);
      setConnectionStatus('disconnected');
      setParticipants([]);
      setErrorMessage(null);
    }
  };

  // Toggle local audio
  const toggleAudio = async () => {
    if (callObject) {
      const newState = !isLocalAudioEnabled;
      console.log('🎤 Toggling microphone:', newState ? 'ON' : 'OFF');
      await callObject.setLocalAudio(newState);
      setIsLocalAudioEnabled(newState);
      
      // Debug: Check microphone status
      const participants = callObject.participants();
      const localParticipant = Object.values(participants).find((p: any) => p.local);
      console.log('🎤 Local participant audio status:', (localParticipant as any)?.tracks?.audio);
    }
  };

  // Toggle local video
  const toggleVideo = async () => {
    if (callObject) {
      const newState = !isLocalVideoEnabled;
      await callObject.setLocalVideo(newState);
      setIsLocalVideoEnabled(newState);
    }
  };

  // Toggle speaker
  const toggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
    // Daily.co handles audio output automatically
  };

  // Get avatar participant (remote participant that's not local)
  // Try multiple detection methods for avatar
  const avatarParticipant = participants.find(p => !p.local && p.video) || // Method 1: has video
                           participants.find(p => !p.local && p.tracks?.video) || // Method 2: has video track
                           participants.find(p => !p.local); // Method 3: any remote participant
  
  // 🔍 DEBUG: Log participant info
  console.log('🔍 Current participants:', participants.map(p => ({
    session_id: p.session_id,
    user_name: p.user_name,
    local: p.local,
    video: !!p.video,
    audio: !!p.audio
  })));
  console.log('👤 Avatar participant found:', !!avatarParticipant, avatarParticipant);

  // 🔊 Manual audio check and fix
  const checkAndFixAudio = async () => {
    if (!callObject) return;
    
    console.log('🔊 Manual audio check started...');
    
    // Check browser audio permissions
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone permission granted');
      stream.getTracks().forEach(track => track.stop()); // Clean up test stream
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
    }
    
    // Check Daily.co audio status using correct approach
    const allParticipants = callObject.participants();
    console.log('🔊 All participants audio status:', Object.values(allParticipants).map((p: any) => ({
      session_id: p.session_id,
      local: p.local,
      user_name: p.user_name,
      audio_track_state: p.tracks?.audio?.state,
      audio_track_enabled: p.tracks?.audio?.track?.enabled,
      has_persistent_track: !!p.tracks?.audio?.persistentTrack,
      persistent_track_enabled: p.tracks?.audio?.persistentTrack?.enabled
    })));
    
    // Find remote participants and check their audio
    const remoteParticipants = Object.values(allParticipants).filter((p: any) => !p.local);
    console.log(`🔍 Found ${remoteParticipants.length} remote participants`);
    
    for (const participant of remoteParticipants) {
      const p = participant as any;
      const audioTrack = p.tracks?.audio;
      
      if (audioTrack?.persistentTrack && remoteVideoRef.current) {
        console.log(`🔧 Processing audio for participant: ${p.user_name}`);
        console.log(`🔧 Audio track state: ${audioTrack.state}`);
        console.log(`🔧 Persistent track enabled: ${audioTrack.persistentTrack.enabled}`);
        
        // Use the proper track management function
        if (audioTrack.state === 'playable' || audioTrack.state === 'loading') {
          console.log('🔄 Refreshing audio track using proper method...');
          updateVideoElement(remoteVideoRef.current, audioTrack.persistentTrack, 'audio');
        } else {
          console.log(`⚠️ Audio track not in playable state: ${audioTrack.state}`);
        }
      } else {
        console.log(`❌ No persistent audio track found for: ${p.user_name}`);
      }
    }
    
    console.log('🔊 Audio check completed');
  };

  // Auto-check audio every 5 seconds
  useEffect(() => {
    if (!callObject || connectionStatus !== 'connected') return;
    
    const audioCheckInterval = setInterval(checkAndFixAudio, 5000);
    return () => clearInterval(audioCheckInterval);
  }, [callObject, connectionStatus]);

  // 🆕 AUTO-VERIFY VIDEO QUALITY: Monitor quality every 10 seconds
  useEffect(() => {
    if (!callObject || connectionStatus !== 'connected') return;
    
    const qualityCheckInterval = setInterval(verifyVideoQuality, 10000);
    return () => clearInterval(qualityCheckInterval);
  }, [callObject, connectionStatus]);

  // 🔧 AUTOMATIC SESSION CLEANUP: Handle page navigation and window close
  useEffect(() => {
    if (!connectionData?.conversationId) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log('🚨 Page unload detected - cleaning up session automatically');
      
      // Note: Page unload cleanup for Tavus conversations is handled by server-side timeouts
      console.log('💡 Tavus conversation will be auto-ended by server timeout settings');

      // Clean up Daily.co call object immediately
      if (callObject) {
        try {
          callObject.destroy();
        } catch (error) {
          console.warn('Warning: Call object cleanup during unload failed:', error);
        }
      }
    };

    const handleVisibilityChange = () => {
      // Clean up when tab becomes hidden (user switches tabs or minimizes)
      if (document.visibilityState === 'hidden') {
        console.log('🔄 Tab hidden - triggering cleanup for safety');
        stopPracticeSession();
      }
    };

    const handlePopState = () => {
      // Clean up when user navigates back/forward
      console.log('🔄 Navigation detected - cleaning up session');
      stopPracticeSession();
    };

    // Add event listeners for automatic cleanup
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup event listeners when component unmounts or conversation ends
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connectionData?.conversationId, callObject, stopPracticeSession]);

  // 🔧 COMPONENT UNMOUNT CLEANUP: Ensure cleanup on component unmount
  useEffect(() => {
    // Return cleanup function that runs when component unmounts
    return () => {
      if (connectionData?.conversationId && callObject) {
        console.log('🧹 Component unmounting - cleaning up session');
        stopPracticeSession();
      }
    };
  }, []); // Empty dependency array ensures this only runs on unmount

  // 🔧 CORRECT APPROACH: Proper stream management function
  const updateVideoElement = (videoElement: HTMLVideoElement, track: MediaStreamTrack, trackKind: string) => {
    try {
      let currentStream = videoElement.srcObject as MediaStream;
      
      // Create new stream if none exists
      if (!currentStream) {
        console.log(`🆕 Creating new MediaStream for ${trackKind} track`);
        currentStream = new MediaStream([track]);
        videoElement.srcObject = currentStream;
        
        // Configure video element for audio playback
        if (trackKind === 'audio' || !videoElement.dataset.audioConfigured) {
          videoElement.muted = false;
          videoElement.volume = 1.0;
          videoElement.defaultMuted = false;
          videoElement.dataset.audioConfigured = 'true';
          console.log('🔊 Configured video element for audio playback');
        }
        
        // Start playback
        videoElement.play().then(() => {
          console.log(`✅ ${trackKind} playback started - volume: ${videoElement.volume}`);
        }).catch((error) => {
          console.warn(`⚠️ ${trackKind} autoplay blocked:`, error);
          // For Chrome bug fix - create hidden audio element for WebRTC audio
          if (trackKind === 'audio') {
            createHiddenAudioElement(track);
          }
        });
        
      } else {
        // Update existing stream with new track
        const existingTracks = trackKind === 'video' ? currentStream.getVideoTracks() : currentStream.getAudioTracks();
        
        // Check if track is already added
        const trackExists = existingTracks.some(existingTrack => existingTrack.id === track.id);
        
        if (!trackExists) {
          // Remove old tracks of same type
          existingTracks.forEach(oldTrack => {
            console.log(`🔄 Removing old ${trackKind} track: ${oldTrack.id}`);
            currentStream.removeTrack(oldTrack);
          });
          
          // Add new track
          console.log(`➕ Adding new ${trackKind} track: ${track.id}`);
          currentStream.addTrack(track);
          
          // Ensure audio settings are maintained
          if (trackKind === 'audio') {
            videoElement.muted = false;
            videoElement.volume = 1.0;
            console.log('🔊 Refreshed audio settings on existing stream');
          }
        } else {
          console.log(`✅ ${trackKind} track already exists, no update needed`);
        }
      }
    } catch (error) {
      console.error(`❌ Error updating ${trackKind} track:`, error);
    }
  };

  // 🔧 CHROME BUG FIX: Create hidden audio element for WebRTC audio
  const createHiddenAudioElement = (audioTrack: MediaStreamTrack) => {
    try {
      console.log('🔧 Creating hidden audio element for Chrome WebRTC bug fix');
      const hiddenAudio = new Audio();
      hiddenAudio.srcObject = new MediaStream([audioTrack]);
      hiddenAudio.muted = true; // Hidden element is muted
      hiddenAudio.play().catch(error => {
        console.warn('Hidden audio element play failed:', error);
      });
      
      // Store reference to clean up later (use any to avoid TypeScript errors)
      const globalWindow = window as any;
      if (!globalWindow.hiddenAudioElements) {
        globalWindow.hiddenAudioElements = [];
      }
      globalWindow.hiddenAudioElements.push(hiddenAudio);
      
      console.log('✅ Hidden audio element created for WebRTC audio fix');
    } catch (error) {
      console.error('❌ Failed to create hidden audio element:', error);
    }
  };

  // 🆕 QUALITY VERIFICATION: Monitor actual video quality being received
  const verifyVideoQuality = async () => {
    if (!callObject) return;
    
    console.log('🔍 Verifying actual video quality...');
    setCurrentVideoQuality(prev => ({ ...prev, status: 'verifying' }));
    
    try {
      // Get current receive settings to see what we're actually getting
      const receiveSettings = callObject.getReceiveSettings();
      console.log('📊 Current receive settings:', receiveSettings);
      
      // Get participant video tracks to analyze quality
      const participants = callObject.participants();
      const remoteParticipants = Object.values(participants).filter((p: any) => !p.local);
      
      if (remoteParticipants.length > 0) {
        const participant = remoteParticipants[0] as any;
        const videoTrack = participant.tracks?.video;
        
        if (videoTrack?.track) {
          const settings = videoTrack.track.getSettings();
          const stats = await callObject.getNetworkStats();
          
          console.log('🎥 Video track settings:', settings);
          console.log('📈 Network stats:', stats);
          
          // Determine quality level based on resolution
          let detectedLayer = -1;
          let qualityStatus: 'high' | 'medium' | 'low' = 'low';
          
          const width = settings.width || 0;
          const height = settings.height || 0;
          
          if (width >= 1280 && height >= 720) {
            detectedLayer = 2;
            qualityStatus = 'high';
          } else if (width >= 640 && height >= 360) {
            detectedLayer = 1;
            qualityStatus = 'medium';
          } else {
            detectedLayer = 0;
            qualityStatus = 'low';
          }
          
          // Find bitrate from stats
          let bitrate = 'Unknown';
          if (stats?.video?.recvBitsPerSecond) {
            const kbps = Math.round(stats.video.recvBitsPerSecond / 1000);
            bitrate = `${kbps} kbps`;
          }
          
          setCurrentVideoQuality({
            layer: detectedLayer,
            resolution: `${width}x${height}`,
            bitrate,
            status: qualityStatus
          });
          
          console.log(`✅ Quality verified: Layer ${detectedLayer} (${qualityStatus}) - ${width}x${height}, ${bitrate}`);
          
          // 🚨 ALERT: If quality is lower than expected, notify user
          if (userPreferredQuality === 2 && detectedLayer < 2) {
            console.warn(`⚠️ Quality Alert: Requested Layer 2 (high) but receiving Layer ${detectedLayer} (${qualityStatus})`);
          }
          
        } else {
          console.warn('❌ No video track found for quality verification');
        }
      } else {
        console.warn('❌ No remote participants found for quality verification');
      }
    } catch (error) {
      console.error('❌ Error verifying video quality:', error);
      setCurrentVideoQuality(prev => ({ ...prev, status: 'unknown' }));
    }
  };

  // 🆕 MANUAL QUALITY CONTROL: Allow user to manually set video quality
  const setVideoQuality = async (targetLayer: number) => {
    if (!callObject) return;
    
    console.log(`🎯 User requesting video quality: Layer ${targetLayer}`);
    setUserPreferredQuality(targetLayer);
    
    const qualityNames = { 0: 'Low (320x180)', 1: 'Medium (640x360)', 2: 'High (1280x720)' };
    console.log(`🔄 Setting video quality to: ${qualityNames[targetLayer as keyof typeof qualityNames]}`);
    
    try {
      await callObject.updateReceiveSettings({
        '*': {
          video: {
            layer: targetLayer
          }
        }
      });
      
      console.log(`✅ Video quality setting applied: Layer ${targetLayer}`);
      
      // Verify quality after a short delay
      setTimeout(verifyVideoQuality, 2000);
      
    } catch (error) {
      console.error(`❌ Failed to set video quality to layer ${targetLayer}:`, error);
    }
  };

  // Render scenario selection
  if (!selectedScenario || connectionStatus === 'disconnected') {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #f5f7a8 0%, #e8d5ff 50%, #d4a5ff 100%)'
      }}>
        {/* Grid Pattern Background - Matching Hero Section */}
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

                <div className="relative z-10 max-w-7xl mx-auto p-3">
          {/* Back Arrow */}
          <div className="mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 hover:text-gray-800" />
            </button>
            </div>

                    {/* Hero Section */}
          <div className="text-center mb-8">
            {/* Luna Image */}
            <div className="mb-6">
              <img 
                src="/luna.png" 
                alt="Luna - Your AI Language Tutor"
                className="mx-auto w-80 h-80 object-cover rounded-2xl shadow-lg"
              />
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Meet Luna</span> - Your Personal Language Tutor
            </h1>
                        <div className="max-w-4xl mx-auto mb-6">
              <p className="text-base text-gray-700 font-normal leading-normal mb-4">
                Real human-like avatars that can see, hear, and speak. Become fluent by speaking naturally, not memorizing grammar rules. Choose a language below to start your conversation with Luna.
              </p>
              
              {/* Choose a Language Button */}
              <button
                onClick={() => {
                  const languageSection = document.getElementById('language-selection');
                  if (languageSection) {
                    languageSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-2 rounded-full text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Choose a Language
              </button>
              
              {/* 50px spacing below button */}
              <div className="h-12"></div>
            </div>
        </div>

          {/* Language Cards Grid - Redesigned with Gradients */}
          <div id="language-selection" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {Object.entries(conversationScenarios).map(([key, scenario]) => {
              const isMultilingual = key === 'multilingual';
              
              // Define gradient styles for each language
              const languageGradients = {
                spanish: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', // Amber
                hindi: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)', // Orange
                japanese: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)', // Pink
                french: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', // Blue
                english: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)', // Emerald
                arabic: 'linear-gradient(135deg, #10d9c4 0%, #0891b2 100%)', // Cyan
                portuguese: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)', // Teal
                russian: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)', // Violet
                german: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)', // Yellow
                turkish: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)', // Rose
                greek: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Blue
                swedish: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)', // Sky
                multilingual: 'linear-gradient(135deg, #a855f7 0%, #c084fc 50%, #f472b6 100%)' // Purple to Pink
              };

              return (
                <div
                  key={key}
                  onClick={() => !isConnecting && startPracticeSession(key)}
                  className={`
                    group cursor-pointer transition-all duration-300 hover:scale-105 transform
                    ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
                    ${isMultilingual ? 'md:col-span-2 lg:col-span-4' : ''}
                  `}
                >
                  <div 
                    className="rounded-2xl p-4 shadow-lg border border-white/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                    style={{
                      background: languageGradients[key as keyof typeof languageGradients] || languageGradients.multilingual
                    }}
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md hover:bg-white transition-all duration-300">
                                              <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center text-2xl shadow-md transition-transform duration-300 group-hover:scale-110"
                               style={{
                                 background: languageGradients[key as keyof typeof languageGradients] || languageGradients.multilingual
                               }}>
                            {isMultilingual ? (
                              <span className="text-white">🌍</span>
                            ) : (
                              <span className="filter drop-shadow-sm">{scenario.flag}</span>
                            )}
                </div>
                
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                            {scenario.name}
                          </h3>
                          <p className="text-gray-600 text-xs leading-relaxed mb-3">
                            {scenario.description}
                          </p>
                        
                        <div className="inline-flex items-center text-gray-700 font-bold text-sm group-hover:text-gray-900 transition-colors">
                          Start Practice
                          <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </div>
                  </div>
                  
                      {isMultilingual && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex items-center justify-center">
                            <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                              ✨ Ultimate Flexibility - Any Language, Anytime
                            </span>
                    </div>
                  </div>
                      )}
                </div>
              </div>
                </div>
              );
            })}
          </div>

          {/* Loading State - Enhanced */}
          {isConnecting && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl"
                   style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Connecting to AI Avatar...</h3>
              <p className="text-gray-700 font-medium">Preparing your personalized language session</p>
              </div>
          )}

          {/* Error State - Enhanced */}
          {errorMessage && (
            <div className="max-w-md mx-auto mt-8 rounded-3xl p-6 shadow-xl border border-white/20"
                 style={{ background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)' }}>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
                     style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                  <span className="text-white text-2xl">⚠️</span>
            </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Connection Failed</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{errorMessage}</p>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                >
                  Try Again
                </button>
          </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render video call interface
    return (
    <div className="min-h-screen bg-black flex flex-col">


      {/* Video Container */}
      <div className="flex-1 relative">
        {/* Main Video (Avatar) */}
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          {avatarParticipant ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              muted={false}
              controls={false}
              className="w-full h-full object-cover"
              onPlay={() => console.log('🎬 Avatar video started playing')}
              onLoadedData={() => console.log('🎬 Avatar video data loaded')}
              onVolumeChange={() => console.log('🔊 Avatar video volume changed:', remoteVideoRef.current?.volume)}
            />
          ) : (
        <div className="text-center text-white">
              <Bot className="w-24 h-24 mx-auto mb-4 text-gray-400" />
              <p className="text-xl mb-2">Waiting for AI Avatar...</p>
              <p className="text-gray-400">The avatar will appear shortly</p>
              {connectionStatus === 'connecting' && (
                <Loader2 className="w-8 h-8 animate-spin mx-auto mt-4 text-red-500" />
              )}
          </div>
          )}
        </div>

        {/* Local Video (User) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
          {isLocalVideoEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <VideoOff className="w-8 h-8 text-gray-400" />
      </div>
          )}
      </div>

      {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-full px-6 py-3">
          {/* Microphone */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isLocalAudioEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isLocalAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Video */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isLocalVideoEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isLocalVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Speaker */}
          <button
            onClick={toggleSpeaker}
            className={`p-3 rounded-full transition-colors ${
              isSpeakerEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isSpeakerEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* End Call */}
          <button
            onClick={stopPracticeSession}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <PhoneOff className="w-5 h-5" />
          </button>

          {/* Quality Status & Control */}
          <div className="relative group">
            <button 
              className={`p-3 rounded-full text-white transition-colors ${
                currentVideoQuality.status === 'high' ? 'bg-green-600 hover:bg-green-700' :
                currentVideoQuality.status === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' :
                currentVideoQuality.status === 'low' ? 'bg-red-600 hover:bg-red-700' :
                'bg-gray-600 hover:bg-gray-700'
              }`}
              title={`Video Quality: ${currentVideoQuality.resolution} @ ${currentVideoQuality.bitrate} (Layer ${currentVideoQuality.layer})`}
            >
              {currentVideoQuality.status === 'verifying' ? '🔄' :
               currentVideoQuality.status === 'high' ? '🟢' :
               currentVideoQuality.status === 'medium' ? '🟡' :
               currentVideoQuality.status === 'low' ? '🔴' : '❓'}
            </button>
            
            {/* Quality Control Dropdown */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 rounded-lg p-3 text-white text-sm whitespace-nowrap">
              <div className="mb-2 font-semibold">Video Quality</div>
              <div className="mb-2 text-xs text-gray-300">
                Current: {currentVideoQuality.resolution} @ {currentVideoQuality.bitrate}
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setVideoQuality(2)}
                  className={`block w-full text-left px-2 py-1 rounded text-xs ${
                    userPreferredQuality === 2 ? 'bg-green-600' : 'hover:bg-gray-700'
                  }`}
                >
                  🟢 High (1280x720)
                </button>
                <button
                  onClick={() => setVideoQuality(1)}
                  className={`block w-full text-left px-2 py-1 rounded text-xs ${
                    userPreferredQuality === 1 ? 'bg-yellow-600' : 'hover:bg-gray-700'
                  }`}
                >
                  🟡 Medium (640x360)
                </button>
                <button
                  onClick={() => setVideoQuality(0)}
                  className={`block w-full text-left px-2 py-1 rounded text-xs ${
                    userPreferredQuality === 0 ? 'bg-red-600' : 'hover:bg-gray-700'
                  }`}
                >
                  🔴 Low (320x180)
                </button>
              </div>
            </div>
          </div>

          {/* Audio Fix */}
          <button 
            onClick={() => checkAndFixAudio()}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            title="Fix Audio Issues"
          >
            🔊
          </button>

          {/* Settings */}
          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>


    </div>
  );
}