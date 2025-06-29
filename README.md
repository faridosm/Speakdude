# SpeakDude - AI-Powered Language Learning Platform

SpeakDude is a modern language learning platform that focuses on conversational practice through AI-powered avatars and interactive games. Practice speaking naturally with realistic AI tutors and improve your translation skills through gamified challenges.

## 🚀 Features

### 🤖 Practice with LUNA AI Avatar
- **Realistic AI Conversations**: Practice with Luna, a lifelike AI language tutor powered by Tavus
- **12+ Languages Supported**: English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese, Arabic, Hindi, and more
- **Multilingual Mode**: Switch languages on the spot for ultimate flexibility
- **Real-time Video Chat**: High-quality video conversations using Tavus + Daily.co integration
- **Natural Interactions**: AI avatar can see, hear, and respond naturally in real-time
- **Adaptive Teaching**: AI adjusts conversation complexity based on your proficiency level
- **Immediate Session Tracking**: Every conversation is automatically recorded for progress tracking

### ⚡ Rapid Translation Game
- **Quick Translation Challenges**: AI speaks sentences in your native language, you translate to your target language
- **Multiple Difficulty Levels**: Beginner, Intermediate, and Advanced challenges
- **Time-Based Gameplay**: Configurable time limits (10-40 seconds per question)
- **Real-time Scoring**: Instant AI evaluation and feedback using ChatGPT
- **Speech Recognition**: Uses OpenAI Whisper for accurate speech-to-text transcription
- **Text-to-Speech**: ElevenLabs provides natural audio pronunciation
- **Varied Content**: AI generates diverse topics to prevent repetition
- **Session Recording**: Automatic progress tracking with scores and duration

### 📊 Comprehensive Progress Tracking
- **Activity Calendar**: Visual monthly calendar showing daily learning activity
- **Session History**: Complete history of all AI conversations and translation games
- **Performance Analytics**: 
  - Total sessions completed
  - Average scores across different activities
  - Time spent learning
  - Current learning streak
- **Achievement System**: Track milestones and celebrate learning progress
- **Session Type Breakdown**: Analyze your preferred learning methods



## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom gradients and animations
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI Services**: 
  - **Tavus**: AI avatar generation and management
  - **Daily.co**: Real-time video/audio communication
  - **OpenAI**: ChatGPT for conversations & Whisper for speech recognition
  - **ElevenLabs**: Text-to-speech for natural audio
- **State Management**: React hooks with custom data management
- **UI Components**: Lucide React icons, custom components

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18 or higher
- Supabase account
- Tavus account (for AI avatars)
- OpenAI account (for ChatGPT & Whisper)
- ElevenLabs account (for text-to-speech)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd speakflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Edge Functions Environment Variables

In your Supabase Dashboard, go to **Edge Functions** and set these environment variables:

```env
# Tavus Configuration (for AI Avatars)
TAVUS_API_KEY=your_tavus_api_key
TAVUS_REPLICA=your_tavus_replica_id
TAVUS_PERSONA=your_tavus_persona_id

# OpenAI Configuration (for ChatGPT & Whisper)
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs Configuration (for Text-to-Speech)
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 5. Database Setup

The database schema is automatically created through Supabase migrations. The main tables include:
- `profiles` - User profile information
- `user_progress` - Learning progress and streaks
- `learning_sessions` - Individual session records

### 6. Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Deploy edge functions
supabase functions deploy livekit-token
supabase functions deploy translation-game
supabase functions deploy whisper-transcribe
```

### 7. Start Development Server
```bash
npm run dev
```

## 🔧 Service Configuration

### Tavus Setup (AI Avatars)
1. Sign up at [Tavus.io](https://tavus.io)
2. Create an AI avatar replica
3. Set up a persona with language teaching prompts
4. Get your API key, replica ID, and persona ID

### OpenAI Setup (AI Intelligence)
1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Ensure access to:
   - GPT-4 (for conversations and evaluations)
   - Whisper (for speech transcription)

### ElevenLabs Setup (Voice Synthesis)
1. Sign up at [ElevenLabs.io](https://elevenlabs.io)
2. Get your API key
3. The app uses pre-configured multilingual voices

## 🏗️ Architecture Overview

### AI Avatar Conversations Flow
1. User selects a language and scenario
2. Frontend calls `livekit-token` edge function
3. Tavus creates a conversation with Daily.co room
4. User joins Daily.co room for real-time video chat
5. AI avatar joins automatically and starts conversation
6. Session data is recorded in real-time to database

### Translation Game Flow
1. User configures language pair and difficulty
2. `translation-game` edge function generates sentence using ChatGPT
3. ElevenLabs converts text to speech for audio playback
4. User speaks translation, captured by browser microphone
5. `whisper-transcribe` edge function processes speech to text
6. ChatGPT evaluates translation accuracy and provides feedback
7. Results are scored and saved to user progress

## 📁 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── PracticeWithAI.tsx       # AI avatar conversation interface
│   │   ├── TranslationGame.tsx      # Rapid translation game
│   │   ├── ProgressSection.tsx      # Progress tracking dashboard
│   │   └── ProtectedRoute.tsx       # Authentication wrapper
│   ├── hooks/
│   │   ├── useAuth.ts               # Authentication logic
│   │   └── useUserData.ts           # User data management
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client & types
│   │   └── translationGameAPI.ts    # Translation game utilities
│   ├── App.tsx                      # Main application component
│   ├── Dashboard.tsx                # User dashboard
│   └── LoginPage.tsx                # Authentication page
├── supabase/
│   ├── functions/
│   │   ├── livekit-token/           # Tavus + Daily.co integration
│   │   ├── translation-game/        # Game logic & AI evaluation
│   │   └── whisper-transcribe/      # Speech recognition
│   └── migrations/                  # Database schema
└── public/                          # Static assets including Luna avatar image
```

## 🎮 How to Use

### AI Conversation Practice
1. Click "Practice with AI" from the dashboard
2. Choose your target language or select "Multilingual Practice"
3. Wait for Luna (AI avatar) to connect via video
4. Start speaking naturally - Luna will respond and help you learn
5. Use voice controls to mute/unmute, adjust video quality
6. Sessions are automatically tracked for progress analysis

### Rapid Translation Game
1. Click "Translation Game" from the dashboard
2. Select your native language and target practice language
3. Choose difficulty level (Beginner/Intermediate/Advanced)
4. Set time limit per question (10-40 seconds)
5. Listen to AI-generated sentences and translate them
6. Speak your translation within the time limit
7. Get instant AI feedback and scoring
8. Complete multiple rounds to improve your skills

### Progress Tracking
1. Click "Progress" to view your learning analytics
2. See activity calendar with daily practice history
3. Review session history with detailed breakdowns
4. Track achievements and learning streaks
5. Analyze performance across different activity types

## 🔒 Security & Privacy

- All API keys are securely stored in Supabase environment variables
- Frontend never handles sensitive credentials directly
- User authentication managed by Supabase Auth
- Session data is associated with authenticated users only
- AI conversations are not stored permanently for privacy

## 🚀 Deployment

### Frontend Deployment
The React app can be deployed to any static hosting service:
- Netlify(recommended)


### Backend Services
- Supabase handles all backend infrastructure
- Edge Functions are deployed through Supabase CLI
- Database and auth are managed by Supabase

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the documentation above
2. Review the code comments for implementation details
3. Ensure all environment variables are correctly configured
4. Verify that all external services (Tavus, OpenAI, ElevenLabs) are properly set up

