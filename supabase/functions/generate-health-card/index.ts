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
    const authHeader = req.headers.get('Authorization')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get user from auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating health card for user:', user.id);

    const { profileData } = await req.json();

    // Check if user already has a health card
    const { data: existingCard } = await supabase
      .from('health_cards')
      .select('hcid')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingCard) {
      console.log('User already has health card:', existingCard.hcid);
      return new Response(
        JSON.stringify({ 
          success: true,
          hcid: existingCard.hcid,
          message: 'Health card already exists'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique HCID: HC-{COUNTRYCODE}-{YYMMDD}-{6 alphanumeric}
    const countryCode = profileData?.locale?.split('-')[1]?.toUpperCase() || 'IN';
    const now = new Date();
    const dateStr = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    
    // Generate random 6 character alphanumeric
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomStr = '';
    for (let i = 0; i < 6; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const hcid = `HC-${countryCode}-${dateStr}-${randomStr}`;
    console.log('Generated HCID:', hcid);

    // Create consent record
    const { error: consentError } = await supabase
      .from('consent_records')
      .insert({
        user_id: user.id,
        consent_type: 'health_data_storage',
        consent_given: true,
        consent_text: 'User consented to store health events and profile data',
        locale: profileData?.locale || 'en-IN',
      });

    if (consentError) {
      console.error('Consent error:', consentError);
      throw consentError;
    }

    // Create health card
    const { data: healthCard, error: cardError } = await supabase
      .from('health_cards')
      .insert({
        user_id: user.id,
        hcid: hcid,
        status: 'provisional',
      })
      .select()
      .single();

    if (cardError) {
      console.error('Card creation error:', cardError);
      throw cardError;
    }

    // Update profile with additional data
    if (profileData) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          mobile: profileData.mobile,
          name: profileData.name,
          age: profileData.age,
          sex: profileData.sex,
          locale: profileData.locale,
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }
    }

    console.log('Health card created successfully');

    return new Response(
      JSON.stringify({
        success: true,
        hcid: healthCard.hcid,
        status: healthCard.status,
        issued_at: healthCard.issued_at,
        message: 'Health card generated successfully',
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