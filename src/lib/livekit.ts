// LiveKit and Tavus integration utilities
// This file contains the core integration logic for connecting to LiveKit rooms with Tavus AI avatars

import { Room, RoomOptions, VideoPresets } from 'livekit-client';

export interface TavusConfig {
  replica_id: string;
  persona_id: string;
  language: string;
  scenario: string;
  prompt: string;
}

export interface LiveKitConfig {
  wsUrl: string;
  token: string;
}

export interface ConnectionResponse {
  token: string;
  serverUrl: string;
  roomName: string;
  participantName: string;
  tavusSessionId: string;
}

// Create LiveKit room connection
export async function createLiveKitConnection(
  roomName: string, 
  participantName: string,
  tavusConfig: TavusConfig
): Promise<ConnectionResponse> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/livekit-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName,
        participantName,
        tavusConfig,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create LiveKit connection');
    }
    
    const connectionData = await response.json();
    return connectionData;
  } catch (error) {
    console.error('Error creating LiveKit connection:', error);
    throw error;
  }
}

// Avatar configurations for different scenarios
export const AVATAR_CONFIGS: Record<string, TavusConfig> = {
  'casual-conversation': {
    replica_id: 'r785c4b9e8', // Replace with your actual Tavus replica ID
    persona_id: 'p123abc456', // Replace with your actual Tavus persona ID
    language: 'English',
    scenario: 'casual-conversation',
    prompt: `You are a friendly, casual conversation partner helping someone practice English. 
             Start by greeting them warmly and asking what they'd like to talk about today. 
             Keep the conversation natural, encouraging, and at an appropriate pace for language learning.
             Provide gentle corrections when needed and ask follow-up questions to keep the conversation flowing.`
  },
  'business-meeting': {
    replica_id: 'r785c4b9e9', // Replace with your actual Tavus replica ID
    persona_id: 'p123abc457', // Replace with your actual Tavus persona ID
    language: 'English',
    scenario: 'business-meeting',
    prompt: `You are a professional business colleague in a meeting setting. 
             Help the user practice business English through realistic workplace scenarios.
             Start by greeting them professionally and suggesting a business topic to discuss.
             Use appropriate business vocabulary and maintain a professional tone while being encouraging.`
  },
  'travel-guide': {
    replica_id: 'r785c4b9e7', // Replace with your actual Tavus replica ID
    persona_id: 'p123abc458', // Replace with your actual Tavus persona ID
    language: 'Spanish',
    scenario: 'travel-guide',
    prompt: `You are a friendly local travel guide helping someone practice Spanish.
             Start by welcoming them to your city and asking where they'd like to visit.
             Use simple, clear Spanish appropriate for beginners and provide cultural context.
             Be patient and encouraging, and help them with pronunciation when needed.`
  }
};

// Room connection utilities
export class LiveKitManager {
  private room: Room | null = null;
  private isConnected = false;

  async connect(wsUrl: string, token: string): Promise<Room> {
    try {
      const roomOptions: RoomOptions = {
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: VideoPresets.h720.resolution,
        },
      };

      this.room = new Room(roomOptions);
      
      // Set up event listeners
      this.room.on('connected', () => {
        console.log('Connected to LiveKit room');
        this.isConnected = true;
      });

      this.room.on('disconnected', () => {
        console.log('Disconnected from LiveKit room');
        this.isConnected = false;
      });

      this.room.on('participantConnected', (participant) => {
        console.log('Participant connected:', participant.identity);
      });

      this.room.on('trackSubscribed', (track, publication, participant) => {
        console.log('Track subscribed:', track.kind, 'from', participant.identity);
      });

      await this.room.connect(wsUrl, token);
      return this.room;
    } catch (error) {
      console.error('Failed to connect to LiveKit room:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.room) {
      this.room.disconnect();
      this.room = null;
    }
    this.isConnected = false;
  }

  isRoomConnected(): boolean {
    return this.isConnected && this.room?.state === 'connected';
  }

  getRoom(): Room | null {
    return this.room;
  }

  // Media control methods
  async setMicrophoneEnabled(enabled: boolean): Promise<void> {
    if (this.room) {
      await this.room.localParticipant.setMicrophoneEnabled(enabled);
    }
  }

  async setCameraEnabled(enabled: boolean): Promise<void> {
    if (this.room) {
      await this.room.localParticipant.setCameraEnabled(enabled);
    }
  }

  async switchAudioDevice(deviceId: string): Promise<void> {
    if (this.room) {
      await this.room.switchActiveDevice('audiooutput', deviceId);
    }
  }

  // Get available devices
  async getDevices() {
    return {
      audioInputs: await Room.getLocalDevices('audioinput'),
      videoInputs: await Room.getLocalDevices('videoinput'),
      audioOutputs: await Room.getLocalDevices('audiooutput'),
    };
  }
}

// Utility functions for Tavus integration
export const TavusUtils = {
  // Validate Tavus configuration
  validateConfig(config: TavusConfig): boolean {
    return !!(
      config.replica_id &&
      config.persona_id &&
      config.language &&
      config.scenario &&
      config.prompt
    );
  },

  // Generate room name for Tavus session
  generateRoomName(scenario: string, userId: string): string {
    const timestamp = Date.now();
    return `tavus-${scenario}-${userId}-${timestamp}`;
  },

  // Format participant name for LiveKit
  formatParticipantName(email: string): string {
    return email.split('@')[0] || 'user';
  },
};

/* 
INTEGRATION FLOW:

1. User selects a practice scenario
2. Frontend calls createLiveKitConnection() with scenario config
3. Backend (Supabase Edge Function) creates LiveKit token
4. Backend starts Tavus avatar session with the LiveKit room details
5. Frontend connects to LiveKit room using the token
6. Tavus avatar automatically joins the room and starts conversation
7. Real-time video/audio communication begins between user and AI avatar

REQUIRED SETUP:

1. LiveKit Cloud account or self-hosted LiveKit server
2. Tavus account with created replicas and personas
3. Environment variables:
   - LIVEKIT_API_KEY
   - LIVEKIT_API_SECRET
   - LIVEKIT_WS_URL
   - TAVUS_API_KEY

4. Replace placeholder replica_id and persona_id values with actual Tavus IDs
5. Configure Tavus personas with appropriate conversation prompts
6. Test the integration with real avatar sessions
*/