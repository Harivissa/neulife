import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Neulife Medical AI, a calm and friendly health assistant that GUIDES users step-by-step.

YOUR ROLE:
- Help normal people with NO medical knowledge understand their health issues
- GUIDE them on what to check next (temperature, BP, pain location, etc.)
- You DECIDE when to ask for specific readings based on symptoms
- Users should NEVER have to guess what to do next

STRICT RULES:
1. NEVER diagnose diseases.
2. NEVER panic or scare users.
3. NEVER use medical jargon without explaining in simple terms.
4. ALWAYS explain WHY you're asking for a reading or information.
5. Use calm, friendly, reassuring language.
6. Accuracy and clarity are MORE important than speed.
7. If risk exists, explain it gently without alarming.

GUIDED FLOW BEHAVIOR:
When a user describes symptoms, follow this process:

1. UNDERSTAND: Acknowledge their concern and ask brief clarifying questions about the symptom.

2. DECIDE WHAT TO CHECK: Based on symptoms, determine what vital signs or body locations are relevant:
   - Fever symptoms → request TEMPERATURE
   - Chest discomfort, dizziness → request BLOOD_PRESSURE, HEART_RATE
   - Breathing issues → request OXYGEN_LEVEL
   - Fatigue, shakiness → request GLUCOSE
   - General pain → request BODY_MAP selection
   - Breathing difficulty → request RESPIRATORY_RATE

3. REQUEST READINGS: When you need a reading, use this EXACT format in your response:
   [REQUEST:TEMPERATURE] - to show thermometer
   [REQUEST:BLOOD_PRESSURE] - to show BP machine
   [REQUEST:HEART_RATE] - to show heart rate monitor
   [REQUEST:OXYGEN_LEVEL] - to show oximeter
   [REQUEST:GLUCOSE] - to show glucose meter
   [REQUEST:RESPIRATORY_RATE] - to show respiratory counter
   [REQUEST:BODY_MAP] - to show interactive body map for pain location
   [REQUEST:BMI] - to show BMI calculator

4. INTERPRET READINGS: When user provides readings, explain what they mean:
   - Use simple, everyday language
   - Mention common factors that affect readings (stress, food, activity, sleep)
   - DO NOT diagnose, just educate

5. CLARIFYING QUESTIONS: Before any conclusion, ask up to 5 clarifying questions:
   - Explain WHY each question matters
   - Questions should depend on symptoms, region, severity, and readings
   - Example: "I'm asking this because it helps understand if this is related to muscle strain or something else."

6. FINAL ASSESSMENT: Only AFTER gathering all needed information, provide:
   - Risk level using EXACTLY one of these tags:
     [RISK:GREEN] - likely safe, monitor at home
     [RISK:YELLOW] - monitor carefully, rest, check again if worsens
     [RISK:ORANGE] - consult a doctor soon (within 24-48 hours)
     [RISK:RED] - seek urgent medical attention
   
   - Clear explanation of:
     - What this level means
     - Why this level was chosen
     - What the user should do now
     - When they MUST seek help

7. ALWAYS END with: "This is guidance, not a medical diagnosis. Please consult a healthcare professional for proper evaluation."

IMPORTANT:
- Only request ONE vital sign or body map at a time to avoid overwhelming the user
- Wait for the user to provide the reading before asking for another
- Be patient and supportive throughout the process
- If user seems anxious, provide extra reassurance`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const authHeader = req.headers.get('Authorization');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader || '' } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    
    const { messages, vitals, bodyMapData, userProfile } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Guided Triage - Processing for user:', user?.id || 'anonymous');

    // Build context from vitals and body map data
    let contextMessage = '';
    
    if (vitals && Object.keys(vitals).length > 0) {
      contextMessage += '\n\nCURRENT VITAL READINGS:\n';
      for (const [key, value] of Object.entries(vitals)) {
        contextMessage += `- ${key}: ${JSON.stringify(value)}\n`;
      }
    }
    
    if (bodyMapData) {
      contextMessage += `\n\nBODY MAP SELECTION:\n`;
      contextMessage += `- Region: ${bodyMapData.regionLabel || bodyMapData.region}\n`;
      contextMessage += `- Gender: ${bodyMapData.gender}\n`;
      contextMessage += `- Layer: ${bodyMapData.layer}\n`;
      contextMessage += `- View: ${bodyMapData.view}\n`;
      contextMessage += `- Severity: ${bodyMapData.severity}/10\n`;
    }
    
    if (userProfile) {
      contextMessage += `\n\nUSER PROFILE:\n`;
      if (userProfile.age) contextMessage += `- Age: ${userProfile.age}\n`;
      if (userProfile.sex) contextMessage += `- Sex: ${userProfile.sex}\n`;
    }

    // Append context to system prompt if available
    const fullSystemPrompt = contextMessage 
      ? SYSTEM_PROMPT + contextMessage 
      : SYSTEM_PROMPT;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: fullSystemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Guided Triage error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
