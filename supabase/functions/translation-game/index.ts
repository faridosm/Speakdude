import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TranslationRequest {
  action: 'generate_sentence' | 'evaluate_translation' | 'text_to_speech';
  nativeLanguage?: string;
  targetLanguage?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  userTranslation?: string;
  correctTranslation?: string;
  textToSpeak?: string;
  questionHistory?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData: TranslationRequest = await req.json()
    const { action } = requestData

    // Get environment variables
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable not found')
    }

    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY environment variable not found')
    }

    console.log(`🎮 Translation Game API - Action: ${action}`)

    switch (action) {
      case 'generate_sentence': {
        const { nativeLanguage, targetLanguage, difficulty, questionHistory } = requestData

        if (!nativeLanguage || !targetLanguage || !difficulty) {
          throw new Error('Missing required parameters: nativeLanguage, targetLanguage, difficulty')
        }

        console.log(`📝 Generating ${difficulty} sentence: ${nativeLanguage} → ${targetLanguage}`)

        // Build history context for avoiding repetition
        const historyContext = questionHistory && questionHistory.length > 0 
          ? `\n\nAVOID REPEATING THESE TOPICS/PATTERNS (already asked in this session):\n${questionHistory.map(q => `- "${q}"`).join('\n')}\n\nGenerate something COMPLETELY DIFFERENT with different topics, verbs, and sentence structures.`
          : '';

        const prompt = `Generate a ${difficulty} level sentence for language learning.

REQUIREMENTS:
- Generate in ${nativeLanguage}
- Should be translated to ${targetLanguage}
- Difficulty: ${difficulty}
- Must be DIVERSE and VARIED in topic/content${historyContext}

DIFFICULTY GUIDELINES:
- Beginner: Simple everyday phrases (5-8 words), basic vocabulary (food, family, colors, numbers, greetings, time)
- Intermediate: Common conversational sentences (8-12 words), moderate complexity (travel, work, hobbies, feelings, weather)
- Advanced: Complex sentences with nuanced meaning (12+ words), advanced vocabulary (abstract concepts, business, culture, technology)

TOPIC VARIETY (choose different topics each time):
- Daily activities, food & cooking, family & relationships, travel & transportation
- Work & education, hobbies & entertainment, health & body, shopping & money
- Weather & nature, emotions & feelings, technology & communication, culture & traditions

RESPONSE FORMAT (JSON only):
        {
          "nativeSentence": "sentence in ${nativeLanguage}",
  "targetTranslation": "correct translation in ${targetLanguage}",
          "difficulty": "${difficulty}"
        }`

        const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are a language learning assistant. Generate DIVERSE, VARIED sentences for translation practice. NEVER repeat similar topics, sentence patterns, or vocabulary in the same session. Focus on creating completely different content each time. Respond only with valid JSON.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 200
          })
        })

        if (!chatResponse.ok) {
          const errorText = await chatResponse.text()
          throw new Error(`ChatGPT API error (${chatResponse.status}): ${errorText}`)
        }

        const chatData = await chatResponse.json()
        const generatedContent = JSON.parse(chatData.choices[0].message.content)

        console.log(`✅ Generated sentence: "${generatedContent.nativeSentence}"`)

        return new Response(
          JSON.stringify({
            success: true,
            data: generatedContent,
            timestamp: new Date().toISOString()
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'evaluate_translation': {
        const { userTranslation, correctTranslation, nativeLanguage, targetLanguage } = requestData

        if (!userTranslation || !correctTranslation || !nativeLanguage || !targetLanguage) {
          throw new Error('Missing required parameters: userTranslation, correctTranslation, nativeLanguage, targetLanguage')
        }

        console.log(`🔍 Evaluating translation: "${userTranslation}" vs "${correctTranslation}"`)

        const prompt = `Evaluate this translation accuracy:

USER'S ANSWER: "${userTranslation}"
CORRECT ANSWER: "${correctTranslation}"
LANGUAGES: ${nativeLanguage} → ${targetLanguage}

EVALUATION CRITERIA:
- Score 70-100 points = isCorrect: true (good translation with minor differences)
- Score 0-69 points = isCorrect: false (significant errors or wrong meaning)

SCORING GUIDELINES:
- 90-100: Perfect or nearly perfect translation
- 70-89: Good translation with minor grammar/spelling differences
- 40-69: Partially correct but missing key elements
- 0-39: Wrong or completely missing translation

RESPONSE FORMAT (JSON only):
        {
          "isCorrect": boolean,
          "score": number (0-100),
  "feedback": "brief encouraging message"
}`

        const evalResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'You are a language learning evaluator. Provide fair, encouraging feedback on translations. Respond only with valid JSON.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 300
          })
        })

        if (!evalResponse.ok) {
          const errorText = await evalResponse.text()
          throw new Error(`ChatGPT evaluation error (${evalResponse.status}): ${errorText}`)
        }

        const evalData = await evalResponse.json()
        const evaluation = JSON.parse(evalData.choices[0].message.content)

        console.log(`✅ Evaluation complete: ${evaluation.isCorrect ? 'CORRECT' : 'INCORRECT'} (${evaluation.score}/100)`)

        return new Response(
          JSON.stringify({
            success: true,
            data: evaluation,
            timestamp: new Date().toISOString()
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'text_to_speech': {
        const { textToSpeak, nativeLanguage } = requestData

        if (!textToSpeak || !nativeLanguage) {
          throw new Error('Missing required parameters: textToSpeak, nativeLanguage')
        }

        console.log(`🔊 Converting to speech: "${textToSpeak}" in ${nativeLanguage}`)

        // ElevenLabs voice mapping for different languages
        const voiceMap: { [key: string]: string } = {
          'en': 'EXAVITQu4vr4xnSDxMaL', // Bella - English
          'es': 'VR6AewLTigWG4xSOukaG', // Arnold - Spanish  
          'fr': 'ErXwobaYiN019PkySvjV', // Antoni - French
          'de': 'VR6AewLTigWG4xSOukaG', // Arnold - German
          'it': 'ErXwobaYiN019PkySvjV', // Antoni - Italian
          'pt': 'VR6AewLTigWG4xSOukaG', // Arnold - Portuguese
          'hi': 'pNInz6obpgDQGcFmaJgB', // Adam - Hindi
          'ja': 'EXAVITQu4vr4xnSDxMaL', // Bella - Japanese
          'ko': 'VR6AewLTigWG4xSOukaG', // Arnold - Korean
          'zh': 'ErXwobaYiN019PkySvjV', // Antoni - Chinese
          'ar': 'pNInz6obpgDQGcFmaJgB', // Adam - Arabic
        }

        const voiceId = voiceMap[nativeLanguage] || voiceMap['en']

        const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text: textToSpeak,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
              style: 0.0,
              use_speaker_boost: true
            }
          })
        })

        if (!ttsResponse.ok) {
          const errorText = await ttsResponse.text()
          throw new Error(`ElevenLabs API error (${ttsResponse.status}): ${errorText}`)
        }

        const audioBuffer = await ttsResponse.arrayBuffer()
        const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))

        console.log(`✅ Audio generated: ${audioBuffer.byteLength} bytes`)

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              audioBase64: audioBase64,
              mimeType: 'audio/mpeg'
            },
            timestamp: new Date().toISOString()
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      default:
        throw new Error(`Unknown action: ${action}`)
    }

  } catch (error) {
    console.error('❌ Translation Game API error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: 'Translation Game API request failed',
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
🎮 RAPID TRANSLATION GAME API

This Edge Function powers the gamified translation learning experience:

FEATURES:
✅ Sentence Generation (ChatGPT)
✅ Translation Evaluation (ChatGPT)  
✅ Text-to-Speech (ElevenLabs)
✅ Multi-language Support
✅ Difficulty Levels
✅ Real-time Feedback

GAME FLOW:
1. Frontend requests sentence generation
2. ChatGPT creates appropriate difficulty sentence
3. ElevenLabs converts to speech audio
4. User hears sentence and speaks translation
5. Whisper transcribes user speech (separate function)
6. ChatGPT evaluates translation accuracy
7. Instant feedback and scoring

ENVIRONMENT VARIABLES REQUIRED:
- OPENAI_API_KEY: For ChatGPT and Whisper APIs
- ELEVENLABS_API_KEY: For text-to-speech conversion

This creates an engaging, AI-powered language learning game!
*/