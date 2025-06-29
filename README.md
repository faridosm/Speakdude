# SpeakDude - AI-Powered Language Learning Platform

SpeakDude is a modern language learning platform that focuses on conversational practice through AI-powered avatars. Built with React, TypeScript, Supabase, and integrated with Tavus + LiveKit for real-time AI conversations.

## Features

### 🤖 Practice with AI
- **Realistic AI Avatars**: Practice conversations with lifelike AI avatars powered by Tavus
- **Multiple Scenarios**: Choose from various conversation scenarios (casual, business, travel)
- **Real-time Interaction**: Live video/audio conversations using LiveKit
- **Natural Conversations**: AI avatars can see, hear, and respond naturally

### 📊 Progress Tracking
- **Learning Analytics**: Track words learned, speaking time, and streak days
- **Session History**: View detailed history of all practice sessions
- **Achievement System**: Unlock achievements as you progress

### 🎯 Personalized Learning
- **Multiple Languages**: Support for English, Spanish, Italian, Japanese, Korean, and more
- **Difficulty Levels**: Beginner to advanced conversation scenarios
- **Adaptive Learning**: AI adjusts to your skill level

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI Integration**: Tavus (AI Avatars) + LiveKit (Real-time Communication)
- **UI Components**: Lucide React icons, Framer Motion animations
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Tavus account (for AI avatars)
- LiveKit account (for real-time communication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd speakdude
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your configuration:
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# LiveKit (set these in Supabase Edge Function environment)
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_WS_URL=wss://your-livekit-server.livekit.cloud

# Tavus (set these in Supabase Edge Function environment)
TAVUS_API_KEY=your_tavus_api_key
```

4. Set up the database:
```bash
# The migrations will be automatically applied when you connect to Supabase
```

5. Start the development server:
```bash
npm run dev
```

## AI Integration Setup

### Tavus + LiveKit Integration

The Practice with AI feature uses Tavus for AI avatars and LiveKit for real-time communication. Here's how it works:

#### Integration Flow:

1. **Scenario Selection**: User chooses a conversation scenario (casual, business, travel)
2. **Token Generation**: Backend creates LiveKit access token with room permissions
3. **Avatar Session**: Tavus avatar is configured with specific persona and joins LiveKit room
4. **Real-time Connection**: User connects to LiveKit room for video/audio communication
5. **AI Conversation**: Natural conversation begins between user and AI avatar

#### Key Components:

- **PracticeWithAI.tsx**: Main practice interface with scenario selection and video chat
- **livekit-token Edge Function**: Backend token generation and Tavus integration
- **LiveKit Room**: Real-time video/audio communication infrastructure
- **Tavus Avatars**: AI-powered realistic human avatars with custom personas

### Setting up Tavus + LiveKit

#### 1. LiveKit Setup
1. Sign up at [LiveKit Cloud](https://cloud.livekit.io) or set up self-hosted server
2. Create a new project and get your API credentials
3. Note your WebSocket URL (e.g., `wss://your-project.livekit.cloud`)

#### 2. Tavus Setup
1. Sign up at [Tavus.io](https://tavus.io)
2. Create AI avatar replicas for different scenarios
3. Set up personas with conversation prompts
4. Get your API key and replica/persona IDs

#### 3. Configuration
Update the avatar configurations in `src/components/PracticeWithAI.tsx`:

```typescript
const AI_SCENARIOS = [
  {
    id: 'casual-conversation',
    replica_id: 'your_actual_replica_id', // Replace with real Tavus replica ID
    persona_id: 'your_actual_persona_id', // Replace with real Tavus persona ID
    // ... other config
  },
  // ... more scenarios
];
```

#### 4. Environment Variables
Set these in your Supabase project's Edge Function environment:

```bash
# In Supabase Dashboard > Edge Functions > Environment Variables
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_WS_URL=wss://your-livekit-server.livekit.cloud
TAVUS_API_KEY=your_tavus_api_key
```

#### 5. Backend Implementation
The current implementation in `supabase/functions/livekit-token/index.ts` is a mock. For production:

1. Install LiveKit Server SDK in your edge function
2. Create proper access tokens with room permissions
3. Make API calls to Tavus to start avatar sessions
4. Configure avatars to join LiveKit rooms automatically

### Example Real Implementation

```typescript
// In your edge function
import { AccessToken, VideoGrant } from 'livekit-server-sdk';

// Create LiveKit token
const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
  identity: participantName,
});

at.addGrant({
  room: roomName,
  roomJoin: true,
  canPublish: true,
  canSubscribe: true,
});

const token = at.toJwt();

// Start Tavus avatar session
const tavusResponse = await fetch('https://tavusapi.com/v2/conversations', {
  method: 'POST',
  headers: {
    'x-api-key': TAVUS_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    replica_id: tavusConfig.replica_id,
    persona_id: tavusConfig.persona_id,
    livekit_url: LIVEKIT_WS_URL,
    livekit_token: token,
    room_name: roomName,
  }),
});
```

## Database Schema

The application uses the following main tables:

- **profiles**: User profile information
- **user_progress**: Learning progress tracking
- **learning_sessions**: Individual practice session records

## Features in Development

- **Translation Game**: Interactive translation challenges
- **Social Practice**: Practice with other users
- **Advanced Analytics**: Detailed learning insights
- **Mobile App**: React Native mobile application

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@speakdude.com or join our Discord community.

---

## Tavus + LiveKit Integration Notes

This implementation provides a complete foundation for real-time AI avatar conversations. The key is that Tavus avatars automatically join LiveKit rooms and engage in natural conversations based on their configured personas.

**Next Steps:**
1. Set up actual Tavus and LiveKit accounts
2. Replace mock IDs with real avatar/persona IDs
3. Implement proper backend token generation
4. Test with real AI avatars
5. Fine-tune personas for optimal learning experiences

The system is designed to be production-ready once the external services are properly configured.