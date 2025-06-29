import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Handle DELETE requests for ending conversations
  if (req.method === 'DELETE') {
    try {
      const { action, conversationId } = await req.json()
      
      if (action === 'end_conversation' && conversationId) {
        const TAVUS_API_KEY = Deno.env.get('TAVUS_API_KEY')
        
        if (!TAVUS_API_KEY) {
          throw new Error('TAVUS_API_KEY environment variable not found')
        }
        
        console.log('🛑 Ending Tavus conversation:', conversationId)
        
        // Call Tavus API to end the conversation
        const endResponse = await fetch(`https://tavusapi.com/v2/conversations/${conversationId}/end`, {
          method: 'POST',
          headers: {
            'x-api-key': TAVUS_API_KEY,
            'Content-Type': 'application/json',
          },
        })
        
        if (endResponse.ok) {
          console.log('✅ Tavus conversation ended successfully via backend')
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Conversation ended successfully',
              conversationId: conversationId,
              timestamp: new Date().toISOString()
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          )
        } else {
          const errorText = await endResponse.text()
          console.error('❌ Failed to end Tavus conversation:', endResponse.status, errorText)
          throw new Error(`Failed to end conversation: ${endResponse.status} ${errorText}`)
        }
      } else {
        throw new Error('Invalid DELETE request. Expected action: "end_conversation" and conversationId')
      }
    } catch (error) {
      console.error('Error ending conversation:', error)
      return new Response(
        JSON.stringify({
          error: error.message,
          details: 'Failed to end Tavus conversation',
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
  }

  // Handle POST requests for creating conversations
  try {
    const { roomName, participantName, tavusConfig } = await req.json()

    // Get environment variables for Tavus
    const TAVUS_API_KEY = Deno.env.get('TAVUS_API_KEY')
    const TAVUS_REPLICA = Deno.env.get('TAVUS_REPLICA')
    const TAVUS_PERSONA = Deno.env.get('TAVUS_PERSONA')

    // 🔍 PROFESSIONAL DEBUG: Detailed environment variable analysis
    const envDebug = {
      TAVUS_API_KEY: {
        exists: !!TAVUS_API_KEY,
        length: TAVUS_API_KEY?.length || 0,
        starts_with: TAVUS_API_KEY?.substring(0, 4) || 'null',
        type: typeof TAVUS_API_KEY
      },
      TAVUS_REPLICA: {
        exists: !!TAVUS_REPLICA,
        value: TAVUS_REPLICA, // Safe to log replica ID
        type: typeof TAVUS_REPLICA
      },
      TAVUS_PERSONA: {
        exists: !!TAVUS_PERSONA,
        value: TAVUS_PERSONA, // Safe to log persona ID
        type: typeof TAVUS_PERSONA
      },
      // Check for common naming mistakes
      alternate_keys: {
        TAVUS_KEY: !!Deno.env.get('TAVUS_KEY'),
        TAVUS_API: !!Deno.env.get('TAVUS_API'),
        tavus_api_key: !!Deno.env.get('tavus_api_key'),
        'TAVUS_API_KEY ': !!Deno.env.get('TAVUS_API_KEY '), // With trailing space
        ' TAVUS_API_KEY': !!Deno.env.get(' TAVUS_API_KEY')  // With leading space
      }
    }

    console.log('🔍 PROFESSIONAL ENVIRONMENT DEBUG:', envDebug)

    console.log('Environment variables check:', {
      hasTavusKey: !!TAVUS_API_KEY,
      hasTavusReplica: !!TAVUS_REPLICA,
      hasTavusPersona: !!TAVUS_PERSONA,
      requestData: { roomName, participantName, scenario: tavusConfig?.scenario }
    })

    // Check for missing environment variables
    const missingVars = []
    if (!TAVUS_API_KEY) missingVars.push('TAVUS_API_KEY')
    if (!TAVUS_REPLICA) missingVars.push('TAVUS_REPLICA')
    if (!TAVUS_PERSONA) missingVars.push('TAVUS_PERSONA')

    if (missingVars.length > 0) {
      const errorMessage = `Missing environment variables: ${missingVars.join(', ')}. Please check your Supabase Edge Function environment variables.`
      console.error(errorMessage)
      throw new Error(errorMessage)
    }

    console.log('Creating Tavus conversation with Daily.co...')

    // Create Tavus conversation using the official Conversations API
    // This automatically uses Daily.co transport (no need to specify)
    const conversationConfig = {
      replica_id: TAVUS_REPLICA,
      persona_id: TAVUS_PERSONA,
      conversation_name: `speakflow_${tavusConfig?.scenario || 'practice'}_${Date.now()}`,
      conversational_context: tavusConfig?.prompt || `You are a friendly, multilingual AI language tutor designed to help users improve their speaking skills naturally and confidently.
You can speak and understand English, Spanish, French, Japanese, Hindi, Arabic, Portuguese, and more.

Start the session by warmly greeting the user and asking:

"Hi there! Which language would you like to practice speaking today?"
(Wait for the user to respond. Respond in that language going forward.)

Once the user selects a language, ask:
"Great! What real-life situation would you like to practice? For example — ordering coffee, booking a hotel, or asking for directions. Or do you have something else in mind?"

After they choose, begin a natural, realistic conversation in that scenario and language.
If the user makes mistakes in grammar or pronunciation, gently correct them, offer the correct version, and encourage them to continue.

Stay warm, engaging, and supportive — like a real language coach who helps users build fluency through conversation, not just rules.`,
      custom_greeting: tavusConfig?.language === 'multilingual' 
        ? `Hi there! Which language would you like to practice speaking today?`
        : `Hello! I'm excited to help you practice ${tavusConfig?.language || 'languages'} today. Let's begin!`,
      properties: {
        max_call_duration: 3600, // 1 hour
        participant_left_timeout: 60, // 1 minute
        participant_absent_timeout: 300, // 5 minutes
        enable_recording: false,
        enable_closed_captions: true,
        language: tavusConfig?.language?.toLowerCase() || 'english',
        apply_greenscreen: false
      }
    }

    console.log('Creating Tavus conversation with Daily.co transport:', {
      replica_id: TAVUS_REPLICA,
      persona_id: TAVUS_PERSONA,
      conversation_name: conversationConfig.conversation_name
    })
    
    const tavusResponse = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'x-api-key': TAVUS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conversationConfig),
    })

    if (!tavusResponse.ok) {
      const tavusError = await tavusResponse.text()
      console.error('Tavus API error:', tavusError)
      throw new Error(`Failed to create Tavus conversation: ${tavusResponse.status} ${tavusError}`)
    }

    const tavusData = await tavusResponse.json()
    console.log('Tavus conversation created successfully:', {
      conversation_id: tavusData.conversation_id,
      conversation_url: tavusData.conversation_url,
      status: tavusData.status
    })

    // Return Daily.co connection info for frontend
    const response = {
      // Daily.co room URL from Tavus (e.g., https://tavus.daily.co/c123456)
      conversationUrl: tavusData.conversation_url,
      conversationId: tavusData.conversation_id,
      roomName: roomName,
      participantName: participantName,
      configuration: {
        replica_id: TAVUS_REPLICA,
        persona_id: TAVUS_PERSONA,
        scenario: tavusConfig?.scenario || 'unknown',
        language: tavusConfig?.language || 'English',
        prompt: tavusConfig?.prompt || 'Default conversation prompt'
      },
      message: 'Daily.co room ready - Tavus avatar will join automatically',
      status: 'ready',
      integration: 'tavus-daily-official',
      debug: {
        environmentConfigured: true,
        timestamp: new Date().toISOString(),
        functionVersion: '5.0.0-daily-co-integration'
      }
    }

    console.log('Integration setup complete:', {
      conversationUrl: tavusData.conversation_url,
      tavusConversation: tavusData.conversation_id,
      avatarWillJoin: 'automatically via Daily.co'
    })

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in tavus-conversation function:', error)
    
    const errorResponse = {
      error: error.message,
      details: 'Failed to create Tavus + Daily.co conversation',
      timestamp: new Date().toISOString(),
      troubleshooting: {
        step1: 'Verify TAVUS_API_KEY, TAVUS_REPLICA, TAVUS_PERSONA are set in Supabase Dashboard',
        step2: 'Ensure your Tavus API key has conversation creation permissions',
        step3: 'Check that your Tavus replica and persona exist',
        requiredVars: ['TAVUS_API_KEY', 'TAVUS_REPLICA', 'TAVUS_PERSONA']
      }
    }

    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

/* 
TAVUS + DAILY.CO INTEGRATION:

This is the OFFICIAL integration method for Tavus avatars:

1. USER FLOW:
   - Frontend calls this function to create a Tavus conversation
   - Function creates conversation using Tavus Conversations API
   - Tavus automatically creates a Daily.co room
   - Returns conversation_url (which is a Daily.co room URL)
   - Frontend joins Daily.co room using the URL
   - Tavus avatar automatically joins the same Daily.co room

2. ENVIRONMENT VARIABLES:
   Set these in Supabase Edge Functions:
   - TAVUS_API_KEY: Your Tavus API key
   - TAVUS_REPLICA: Your Tavus replica ID
   - TAVUS_PERSONA: Your Tavus persona ID

3. HOW IT WORKS:
   - No LiveKit needed - Tavus uses Daily.co by default
   - Avatar joins automatically when room is created
   - Real-time video/audio conversation via Daily.co
   - This is the official, supported method

4. DEPLOYMENT:
   After setting environment variables:
   supabase functions deploy livekit-token
*/