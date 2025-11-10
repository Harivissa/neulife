import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const authHeader = req.headers.get('Authorization')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { 
      symptoms, 
      speciesType, 
      speciesSubtype, 
      age, 
      sex, 
      severity, 
      onset,
      hcid 
    } = await req.json();

    console.log('Processing triage for user:', user.id);

    // Build system prompt based on species
    const systemPrompt = `You are MedAI-Guide, an evidence-first medical triage assistant. 
Species: ${speciesType}${speciesSubtype ? ` (${speciesSubtype})` : ''}
Age: ${age} | Sex: ${sex}

Analyze symptoms and provide:
1. Triage Level: Emergency/Urgent/SeeClinician/MonitorAtHome
2. Top Differential Diagnoses (max 3)
3. Action Plan (immediate steps, tests to consider, when to seek emergency care)
4. Justification (clinical reasoning)
5. Confidence Score (0-100%)

CRITICAL: Do NOT provide prescription dosing. For prescriptions, advise consulting qualified clinician.
Flag red flags immediately for emergency care.`;

    const userPrompt = `Symptoms: ${symptoms}
Onset: ${onset || 'not specified'}
Severity (1-10): ${severity || 'not specified'}

Provide evidence-based triage and action plan.`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('AI service error');
    }

    const aiData = await aiResponse.json();
    const triageResponse = aiData.choices[0].message.content;

    console.log('Triage response generated');

    // Store triage event if HCID provided
    if (hcid) {
      const { error: eventError } = await supabase
        .from('health_events')
        .insert({
          hcid: hcid,
          event_type: 'triage',
          summary: symptoms,
          payload: {
            triage_response: triageResponse,
            input: { symptoms, speciesType, age, sex, severity, onset },
          },
          source: 'ai_triage',
        });

      if (eventError) {
        console.error('Event storage error:', eventError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        triage: triageResponse,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});