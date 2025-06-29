// Translation Game API integration utilities
// Handles communication with ChatGPT, Whisper, and ElevenLabs through Supabase Edge Functions

export interface GeneratedSentence {
  nativeSentence: string;
  targetTranslation: string;
  difficulty: string;
}

export interface TranslationEvaluation {
  isCorrect: boolean;
  score: number;
  feedback: string;
  corrections: string;
}

export interface AudioData {
  audioBase64: string;
  mimeType: string;
}

export class TranslationGameAPI {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translation-game`;
    this.headers = {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  // Generate a new sentence using ChatGPT
  async generateSentence(
    nativeLanguage: string,
    targetLanguage: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<GeneratedSentence> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          action: 'generate_sentence',
          nativeLanguage,
          targetLanguage,
          difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate sentence: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error generating sentence:', error);
      throw error;
    }
  }

  // Convert text to speech using ElevenLabs
  async textToSpeech(text: string, language: string): Promise<AudioData> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          action: 'text_to_speech',
          textToSpeak: text,
          nativeLanguage: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate speech: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  // Transcribe audio using OpenAI Whisper
  async transcribeAudio(audioBlob: Blob, targetLanguage: string): Promise<string> {
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whisper-transcribe`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          audioData: base64Audio,
          language: targetLanguage,
          mimeType: audioBlob.type,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to transcribe audio: ${response.status}`);
      }

      const result = await response.json();
      return result.data.transcription;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  // Evaluate translation using ChatGPT
  async evaluateTranslation(
    userTranslation: string,
    correctTranslation: string,
    nativeLanguage: string,
    targetLanguage: string
  ): Promise<TranslationEvaluation> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          action: 'evaluate_translation',
          userTranslation,
          correctTranslation,
          nativeLanguage,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to evaluate translation: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error evaluating translation:', error);
      throw error;
    }
  }

  // Play audio from base64 data
  playAudio(audioBase64: string, mimeType: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const audioData = `data:${mimeType};base64,${audioBase64}`;
        const audio = new Audio(audioData);
        
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Failed to play audio'));
        
        audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Audio recording utilities for Whisper integration
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

// Language code mappings for APIs
export const LANGUAGE_CODES = {
  'en': { name: 'English', whisper: 'en', elevenlabs: 'en' },
  'es': { name: 'Spanish', whisper: 'es', elevenlabs: 'es' },
  'fr': { name: 'French', whisper: 'fr', elevenlabs: 'fr' },
  'de': { name: 'German', whisper: 'de', elevenlabs: 'de' },
  'it': { name: 'Italian', whisper: 'it', elevenlabs: 'it' },
  'pt': { name: 'Portuguese', whisper: 'pt', elevenlabs: 'pt' },
  'hi': { name: 'Hindi', whisper: 'hi', elevenlabs: 'hi' },
  'ja': { name: 'Japanese', whisper: 'ja', elevenlabs: 'ja' },
  'ko': { name: 'Korean', whisper: 'ko', elevenlabs: 'ko' },
  'zh': { name: 'Chinese', whisper: 'zh', elevenlabs: 'zh' },
  'ar': { name: 'Arabic', whisper: 'ar', elevenlabs: 'ar' },
};