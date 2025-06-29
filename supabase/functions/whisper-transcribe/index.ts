import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhisperRequest {
  audio: string;      // Use simplified parameter name for compatibility  
  audioData?: string; // Keep backward compatibility
  language?: string;  
  mimeType?: string;  
}

// Process base64 in chunks to prevent memory issues and data corruption
function processBase64Chunks(base64String: string, chunkSize = 32768): Uint8Array {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while(position < base64String.length){
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for(let i = 0; i < binaryChunk.length; i++){
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }
  
  // Reassemble all chunks into single array
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  
  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Get OpenAI API key
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
  
  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({
      success: false,
      error: "OpenAI API key not found",
      details: "OPENAI_API_KEY environment variable not configured"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const requestData: WhisperRequest = await req.json()

    // Support both old format (audioData) and new format (audio) for backward compatibility
    const audioData = requestData.audio || requestData.audioData
    const language = requestData.language || 'en'
    const mimeType = requestData.mimeType || 'audio/webm'

    // Validate required parameters
    if (!audioData) {
      throw new Error('Missing required parameter: audio data')
    }

    console.log(`🎤 Whisper transcription - Language: ${language}, MIME: ${mimeType}`)

    // Process audio using chunked method to prevent memory issues and data corruption
    const binaryAudio = processBase64Chunks(audioData)
    
    // Validate audio data
    if (binaryAudio.length === 0) {
      throw new Error('Empty audio data received')
    }

    console.log(`📊 Audio data size: ${binaryAudio.length} bytes`)

    // Create form data for Whisper API
    const formData = new FormData()
    
    // Create a blob from the audio data with proper file extension
    const audioBlob = new Blob([binaryAudio], { type: mimeType })
    
    // Use appropriate filename extension for better processing
    const fileExtension = mimeType.includes('webm') ? 'webm' : 
                         mimeType.includes('mp3') ? 'mp3' : 
                         mimeType.includes('wav') ? 'wav' : 'webm'
    
    formData.append('file', audioBlob, `audio.${fileExtension}`)
    formData.append('model', 'whisper-1')  // Unfortunately still limited to v2 on OpenAI API
    
    // Add language hint if provided (improves accuracy significantly)
    if (language && language !== 'auto' && language !== 'en') {
      formData.append('language', language)
    }
    
    formData.append('response_format', 'json')
    
    // Add enhanced context prompt to help with short speech segments
    const languagePrompts = {
      'en': "Clear English speech with proper punctuation.",
      'es': "Habla clara en español con puntuación correcta.",
      'fr': "Parole claire en français avec ponctuation correcte.", 
      'de': "Klare deutsche Sprache mit korrekter Zeichensetzung.",
      'it': "Parlato chiaro italiano con punteggiatura corretta.",
      'pt': "Fala clara em português com pontuação correta.",
      'ja': "明確な日本語音声、適切な句読点付き。",
      'ko': "명확한 한국어 음성, 적절한 구두점 포함.",
      'zh': "清晰中文语音，包含正确标点符号。", 
      'ar': "كلام عربي واضح مع علامات ترقيم صحيحة.",
      'hi': "स्पष्ट हिंदी भाषण, उचित विराम चिह्नों के साथ।"
    }
    
    const contextPrompt = languagePrompts[language as keyof typeof languagePrompts] || 
                         `Clear speech in ${language} with proper punctuation.`
    
    formData.append('prompt', contextPrompt)
    
    // Optimal temperature for short speech clips (critical for accuracy)
    formData.append('temperature', '0.1')

    // Call OpenAI Whisper API
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData
    })

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text()
      console.error('❌ Whisper API error:', errorText)
      throw new Error(`Whisper API error (${whisperResponse.status}): ${errorText}`)
    }

    const whisperData = await whisperResponse.json()
    
    // Validate transcription result
    if (!whisperData.text) {
      throw new Error('No transcription text received from Whisper')
    }

    const transcription = whisperData.text.trim()
    
    console.log(`✅ Transcription successful: "${transcription}"`)

    // Return in the expected format for your frontend
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          transcription: transcription,
          language: language,
          confidence: whisperData.confidence || null,
          duration: whisperData.duration || null
        },
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Whisper transcription error:', error)
    
    // Provide helpful error messages
    let errorMessage = error.message
    let errorDetails = 'Whisper transcription failed'

    if (error.message.includes('API key')) {
      errorDetails = 'OpenAI API key issue - check your configuration'
    } else if (error.message.includes('audio data')) {
      errorDetails = 'Audio recording issue - please try recording again'
    } else if (error.message.includes('rate limit')) {
      errorDetails = 'API rate limit exceeded - please wait and try again'
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

/* 
🎤 OPTIMIZED WHISPER TRANSCRIPTION API

KEY IMPROVEMENTS FOR ACCURACY:
✅ Chunked base64 processing prevents data corruption
✅ Enhanced language-specific context prompts  
✅ Optimal temperature (0.1) for unclear speech
✅ Proper file extensions for better Whisper processing
✅ Language hints for better accuracy
✅ XHR import for proper FormData handling

LIMITATION: 
❌ OpenAI API still uses whisper-1 (Large-v2) - older model
   For best accuracy, consider switching to:
   - Hugging Face Transformers with Large-v3-Turbo
   - Third-party services with newer models
   - Self-hosted Whisper implementation

This implementation maximizes accuracy within OpenAI API constraints!
*/