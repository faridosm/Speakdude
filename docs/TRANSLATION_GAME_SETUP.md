# Translation Game Environment Variables Setup

This guide shows how to configure the required environment variables for the Translation Game feature.

## Required Environment Variables

You need to set these 2 environment variables in your Supabase Edge Function settings:

### OpenAI Configuration
```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### ElevenLabs Configuration (Optional - for text-to-speech)
```bash
ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step-by-Step Setup

### 1. Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** in the sidebar
4. Click **Settings** tab
5. Click **Environment Variables** tab

### 2. Add Each Environment Variable
Add each variable one by one using the "Add new variable" button:

1. **OPENAI_API_KEY** (Required)
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key (starts with `sk-`)

2. **ELEVENLABS_API_KEY** (Optional)
   - Name: `ELEVENLABS_API_KEY`
   - Value: Your ElevenLabs API key

### 3. Deploy Edge Function
After setting the environment variables, you MUST redeploy the edge function:

```bash
supabase functions deploy translation-game
```

**Important**: Environment variables are only loaded when the function is deployed. Setting them without redeploying will not work.

## Getting Your API Keys

### OpenAI Setup (Required)
1. Sign up at [OpenAI Platform](https://platform.openai.com)
2. Go to **API Keys** section
3. Create a new API key
4. Copy the key (starts with `sk-`)
5. Ensure you have credits/billing set up

### ElevenLabs Setup (Optional)
1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Go to your **Profile** → **API Key**
3. Copy your API key
4. Ensure you have credits for text-to-speech

## Verification Steps

### 1. Test the Translation Game
1. Go to your app
2. Navigate to "Translation Game"
3. Select your languages and difficulty
4. Click "Start Game"
5. Check if a sentence is generated successfully

### 2. Check Edge Function Logs
If you encounter errors:
1. Go to Supabase Dashboard → Edge Functions → translation-game
2. Click on **Logs** tab
3. Look for any error messages about missing environment variables

### 3. Common Issues and Solutions

**Issue**: "OPENAI_API_KEY environment variable not found"
- **Solution**: Ensure the variable is set exactly as `OPENAI_API_KEY`
- **Solution**: Redeploy the edge function after setting the variable
- **Solution**: Check that your OpenAI API key is valid and active

**Issue**: "ELEVENLABS_API_KEY environment variable not found"
- **Solution**: This is optional - the game will work without text-to-speech
- **Solution**: If you want audio, add the ElevenLabs API key and redeploy

**Issue**: "ChatGPT API error: 401"
- **Solution**: Your OpenAI API key is invalid or expired
- **Solution**: Check your OpenAI account billing and usage limits

**Issue**: "ChatGPT API error: 429"
- **Solution**: You've hit OpenAI rate limits
- **Solution**: Wait a few minutes or upgrade your OpenAI plan

## Environment Variable Names (Important!)

Make sure you use these exact names:
- ✅ `OPENAI_API_KEY` (not `OPENAI_KEY` or `OPEN_AI_KEY`)
- ✅ `ELEVENLABS_API_KEY` (not `ELEVEN_LABS_KEY`)

## Security Notes

- Never commit these values to version control
- Only set them in Supabase Edge Function environment variables
- Rotate your API keys regularly
- Monitor your usage on OpenAI and ElevenLabs dashboards

## Troubleshooting

If you're still getting 400 errors after following this guide:

1. **Double-check variable names**: They must match exactly
2. **Redeploy the function**: `supabase functions deploy translation-game`
3. **Check Supabase logs**: Go to Edge Functions → translation-game → Logs
4. **Verify API keys**: Test them directly in OpenAI platform
5. **Check billing**: Ensure your OpenAI account has available credits

Remember: At minimum, you need `OPENAI_API_KEY` for the Translation Game to work. ElevenLabs is optional for text-to-speech features.