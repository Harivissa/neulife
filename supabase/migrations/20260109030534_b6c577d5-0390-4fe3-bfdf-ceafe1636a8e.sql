-- Create table for storing user pain points and medical history
CREATE TABLE public.medical_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hcid TEXT,
  event_type TEXT NOT NULL, -- 'pain_point', 'symptom', 'vital', 'triage', 'assessment'
  body_coordinates JSONB, -- {x, y, anatomicalZone, severity, view, gender}
  symptoms TEXT,
  vitals JSONB, -- {temperature, bp_systolic, bp_diastolic, heartRate, oxygenLevel, bloodSugar}
  triage_result JSONB, -- {level, confidence, summary}
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_medical_history_user_id ON public.medical_history(user_id);
CREATE INDEX idx_medical_history_hcid ON public.medical_history(hcid);
CREATE INDEX idx_medical_history_created_at ON public.medical_history(created_at DESC);

-- Enable RLS
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own medical history
CREATE POLICY "Users can view own medical history"
ON public.medical_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own medical history
CREATE POLICY "Users can insert own medical history"
ON public.medical_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow public read access for QR-based medical summary (read-only by hcid)
CREATE POLICY "Public can view medical history by hcid"
ON public.medical_history
FOR SELECT
USING (hcid IS NOT NULL);

-- Create a medical_qr_access table to track QR generation and access
CREATE TABLE public.medical_qr_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hcid TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE
);

-- Index for token lookup
CREATE INDEX idx_medical_qr_tokens_token ON public.medical_qr_tokens(token);
CREATE INDEX idx_medical_qr_tokens_hcid ON public.medical_qr_tokens(hcid);

-- Enable RLS
ALTER TABLE public.medical_qr_tokens ENABLE ROW LEVEL SECURITY;

-- Users can manage their own QR tokens
CREATE POLICY "Users can view own QR tokens"
ON public.medical_qr_tokens
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own QR tokens"
ON public.medical_qr_tokens
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own QR tokens"
ON public.medical_qr_tokens
FOR UPDATE
USING (auth.uid() = user_id);

-- Public can verify token validity (for QR scanning)
CREATE POLICY "Public can verify QR tokens"
ON public.medical_qr_tokens
FOR SELECT
USING (is_active = true);