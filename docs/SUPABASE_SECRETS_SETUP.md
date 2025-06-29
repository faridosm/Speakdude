# Supabase Environment Variables Setup for LiveKit + Tavus Integration

This guide shows how to properly configure all required environment variables in Supabase for the LiveKit + Tavus integration.

## Required Environment Variables

You need to set these 6 environment variables in your Supabase Edge Function settings:

### LiveKit Configuration
```bash
LIVEKIT_API_KEY=lk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LIVEKIT_URL=wss://your-project.livekit.cloud
```

### Tavus Configuration
```bash
TAVUS_API_KEY=tvs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TAVUS_REPLICA=your_replica_id_here
TAVUS_PERSONA=your_persona_id_here
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

1. **LIVEKIT_API_KEY**
   - Name: `LIVEKIT_API_KEY`
   - Value: Your LiveKit API key (starts with `lk_live_`)

2. **LIVEKIT_API_SECRET**
   - Name: `LIVEKIT_API_SECRET`
   - Value: Your LiveKit API secret

3. **LIVEKIT_URL**
   - Name: `LIVEKIT_URL`
   - Value: Your LiveKit WebSocket URL (e.g., `wss://your-project.livekit.cloud`)

4. **TAVUS_API_KEY**
   - Name: `TAVUS_API_KEY`
   - Value: Your Tavus API key (starts with `tvs_`)

5. **TAVUS_REPLICA**
   - Name: `TAVUS_REPLICA`
   - Value: Your Tavus replica ID

6. **TAVUS_PERSONA**
   - Name: `TAVUS_PERSONA`
   - Value: Your Tavus persona ID

### 3. Deploy Edge Function
After setting all environment variables, you MUST redeploy the edge function:

```bash
supabase functions deploy livekit-token
```

**Important**: Environment variables are only loaded when the function is deployed. Setting them without redeploying will not work.

## Getting Your API Keys and IDs

### LiveKit Setup
1. Sign up at [LiveKit Cloud](https://cloud.livekit.io)
2. Create a new project
3. Go to **Settings** → **Keys**
4. Copy your API Key and Secret
5. Note your WebSocket URL from the project dashboard (format: `wss://your-project.livekit.cloud`)

### Tavus Setup
1. Sign up at [Tavus.io](https://app.tavus.io)
2. Go to **API Keys** in your dashboard
3. Generate a new API key
4. Go to **Replicas** section:
   - Create or select an avatar replica
   - Copy the replica ID
5. Go to **Personas** section:
   - Create or select a persona for your avatar
   - Copy the persona ID

## Verification Steps

### 1. Check Environment Variables
After setting all variables and redeploying, you can test if they're accessible by checking the Edge Function logs when you try to start a practice session.

### 2. Test the Integration
1. Go to your app
2. Navigate to "Practice with AI"
3. Select any conversation scenario
4. Click "Start Practice"
5. Check the browser console and Supabase Edge Function logs for any errors

### 3. Common Issues and Solutions

**Issue**: "Missing environment variables" error
- **Solution**: Ensure all 6 variables are set exactly as shown above
- **Solution**: Redeploy the edge function after setting variables
- **Solution**: Check for typos in variable names

**Issue**: "Failed to create Tavus conversation" error
- **Solution**: Verify your Tavus API key is valid and active
- **Solution**: Check that your replica and persona IDs exist in your Tavus account
- **Solution**: Ensure your Tavus account has sufficient credits

**Issue**: LiveKit connection fails
- **Solution**: Verify your LiveKit WebSocket URL is correct
- **Solution**: Check that your LiveKit API key and secret are valid
- **Solution**: Ensure your LiveKit project is active

## Environment Variable Names (Important!)

Make sure you use these exact names:
- ✅ `LIVEKIT_API_KEY` (not `LIVEKIT_KEY`)
- ✅ `LIVEKIT_API_SECRET` (not `LIVEKIT_SECRET`)
- ✅ `LIVEKIT_URL` (not `LIVEKIT_WS_URL`)
- ✅ `TAVUS_API_KEY` (not `TAVUS_KEY`)
- ✅ `TAVUS_REPLICA` (not `TAVUS_REPLICA_ID`)
- ✅ `TAVUS_PERSONA` (not `TAVUS_PERSONA_ID`)

## Security Notes

- Never commit these values to version control
- Only set them in Supabase Edge Function environment variables
- Rotate your API keys regularly
- Monitor your usage on both LiveKit and Tavus dashboards

## Troubleshooting

If you're still getting environment variable errors after following this guide:

1. **Double-check variable names**: They must match exactly
2. **Redeploy the function**: `supabase functions deploy livekit-token`
3. **Check Supabase logs**: Go to Edge Functions → livekit-token → Logs
4. **Verify API keys**: Test them directly in LiveKit and Tavus dashboards
5. **Contact support**: If issues persist, check LiveKit and Tavus documentation

Remember: The environment variables are only available to Edge Functions, not to your frontend code. This is the correct and secure approach.