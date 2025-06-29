# Setting Up API Secrets in Supabase

This guide explains how to securely store and access your LiveKit and Tavus API credentials in Supabase.

## Overview

For the Tavus + LiveKit integration to work, you need to store sensitive API keys securely. Supabase provides several ways to manage secrets:

1. **Edge Function Environment Variables** (Recommended for API keys)
2. **Supabase Vault** (For highly sensitive data)
3. **Database with RLS** (For user-specific configurations)

## Method 1: Edge Function Environment Variables (Recommended)

This is the best approach for API keys that your Edge Functions need to access.

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** in the sidebar

### Step 2: Set Environment Variables

1. Click on **Settings** in the Edge Functions section
2. Go to **Environment Variables** tab
3. Add the following variables:

```bash
# LiveKit Configuration
LIVEKIT_API_KEY=lk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LIVEKIT_WS_URL=wss://your-project.livekit.cloud

# Tavus Configuration  
TAVUS_API_KEY=tvs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Deploy Edge Functions

After setting environment variables, redeploy your edge functions:

```bash
supabase functions deploy livekit-token
```

## Method 2: Using Supabase Vault (For Extra Security)

For highly sensitive data, you can use Supabase Vault:

### Step 1: Store Secrets in Vault

```sql
-- Store LiveKit API key
SELECT vault.create_secret('livekit_api_key', 'your_actual_api_key');

-- Store LiveKit API secret
SELECT vault.create_secret('livekit_api_secret', 'your_actual_api_secret');

-- Store Tavus API key
SELECT vault.create_secret('tavus_api_key', 'your_actual_api_key');
```

### Step 2: Access Secrets in Edge Functions

```typescript
// In your edge function
const { data: livekitKey } = await supabase
  .from('vault.decrypted_secrets')
  .select('decrypted_secret')
  .eq('name', 'livekit_api_key')
  .single();

const LIVEKIT_API_KEY = livekitKey?.decrypted_secret;
```

## Method 3: Database Configuration Table

For avatar and persona configurations that might change:

### Step 1: Create Configuration Table

```sql
-- Create avatar configurations table
CREATE TABLE IF NOT EXISTS avatar_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id text UNIQUE NOT NULL,
  replica_id text NOT NULL,
  persona_id text NOT NULL,
  language text NOT NULL,
  prompt text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE avatar_configs ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access to avatar configs"
  ON avatar_configs
  FOR SELECT
  TO authenticated
  USING (true);
```

### Step 2: Insert Avatar Configurations

```sql
-- Insert avatar configurations
INSERT INTO avatar_configs (scenario_id, replica_id, persona_id, language, prompt) VALUES
('casual-conversation', 'r785c4b9e8', 'p123abc456', 'English', 
 'You are a friendly, casual conversation partner helping someone practice English...'),
('business-meeting', 'r785c4b9e9', 'p123abc457', 'English',
 'You are a professional business colleague in a meeting setting...'),
('travel-guide', 'r785c4b9e7', 'p123abc458', 'Spanish',
 'You are a friendly local travel guide helping someone practice Spanish...');
```

## Security Best Practices

### 1. Environment Separation
- Use different API keys for development and production
- Never commit API keys to version control
- Use `.env.example` for documentation only

### 2. Access Control
- Limit API key permissions to minimum required
- Regularly rotate API keys
- Monitor API usage for unusual activity

### 3. Error Handling
- Don't expose API keys in error messages
- Log security events for monitoring
- Implement rate limiting

## Getting Your API Keys

### LiveKit Setup
1. Sign up at [LiveKit Cloud](https://cloud.livekit.io)
2. Create a new project
3. Go to **Settings** → **Keys**
4. Copy your API Key and Secret
5. Note your WebSocket URL from the project dashboard

### Tavus Setup
1. Sign up at [Tavus.io](https://tavus.io)
2. Go to **API Keys** in your dashboard
3. Generate a new API key
4. Create avatar replicas in the **Replicas** section
5. Set up personas in the **Personas** section
6. Note the IDs for each replica and persona

## Testing Your Setup

### 1. Test Edge Function Access

Create a test edge function to verify environment variables:

```typescript
// Test function
serve(async (req) => {
  const LIVEKIT_API_KEY = Deno.env.get('LIVEKIT_API_KEY');
  const TAVUS_API_KEY = Deno.env.get('TAVUS_API_KEY');
  
  return new Response(JSON.stringify({
    livekit_configured: !!LIVEKIT_API_KEY,
    tavus_configured: !!TAVUS_API_KEY,
    // Don't return actual keys!
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### 2. Test API Connectivity

```typescript
// Test LiveKit connection
const testLiveKit = async () => {
  try {
    const response = await fetch(`${LIVEKIT_WS_URL}/twirp/livekit.RoomService/ListRooms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Test Tavus connection
const testTavus = async () => {
  try {
    const response = await fetch('https://tavusapi.com/v2/replicas', {
      headers: {
        'x-api-key': TAVUS_API_KEY
      }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};
```

## Troubleshooting

### Common Issues

1. **Environment variables not accessible**
   - Ensure variables are set in the correct Supabase project
   - Redeploy edge functions after setting variables
   - Check variable names for typos

2. **API authentication failures**
   - Verify API keys are correct and active
   - Check API key permissions and quotas
   - Ensure URLs are correct (especially LiveKit WebSocket URL)

3. **CORS issues**
   - Ensure proper CORS headers in edge functions
   - Check Supabase project settings for allowed origins

### Debug Logging

Add logging to your edge functions:

```typescript
console.log('Environment check:', {
  hasLivekitKey: !!Deno.env.get('LIVEKIT_API_KEY'),
  hasTavusKey: !!Deno.env.get('TAVUS_API_KEY'),
  livekitUrl: Deno.env.get('LIVEKIT_WS_URL')
});
```

## Next Steps

1. Set up your LiveKit and Tavus accounts
2. Configure environment variables in Supabase
3. Update avatar configurations with real IDs
4. Test the integration with a simple conversation
5. Monitor usage and performance

Remember: Never expose API keys in client-side code or commit them to version control!