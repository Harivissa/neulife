import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MedicalHistoryItem {
  id: string;
  event_type: string;
  body_coordinates: unknown;
  symptoms: string | null;
  vitals: unknown;
  triage_result: unknown;
  created_at: string;
}

interface PatientProfile {
  name: string | null;
  age: number | null;
  sex: string | null;
}

interface MedicalSummaryResponse {
  profile: PatientProfile;
  history: MedicalHistoryItem[];
  hcid: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();

    if (!token || typeof token !== 'string') {
      console.error('Invalid token provided');
      return new Response(
        JSON.stringify({ error: 'Invalid or missing token' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create a Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Verifying token...');

    // Verify the token exists and is active
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('medical_qr_tokens')
      .select('id, hcid, user_id, is_active')
      .eq('token', token)
      .eq('is_active', true)
      .maybeSingle();

    if (tokenError) {
      console.error('Token verification error:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Token verification failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!tokenData) {
      console.log('Token not found or inactive');
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Token verified, fetching medical data for HCID:', tokenData.hcid);

    // Update last accessed timestamp
    await supabaseAdmin
      .from('medical_qr_tokens')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', tokenData.id);

    // Fetch patient profile using user_id from token
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('name, age, sex')
      .eq('id', tokenData.user_id)
      .maybeSingle();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    // Fetch medical history using hcid from token
    const { data: history, error: historyError } = await supabaseAdmin
      .from('medical_history')
      .select('id, event_type, body_coordinates, symptoms, vitals, triage_result, created_at')
      .eq('hcid', tokenData.hcid)
      .order('created_at', { ascending: false })
      .limit(100);

    if (historyError) {
      console.error('Medical history fetch error:', historyError);
    }

    const response: MedicalSummaryResponse = {
      profile: profile || { name: null, age: null, sex: null },
      history: (history || []) as MedicalHistoryItem[],
      hcid: tokenData.hcid
    };

    console.log('Successfully retrieved medical summary');

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});