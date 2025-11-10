-- Create profiles table for user data
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  mobile text,
  email text,
  name text,
  age integer,
  sex text,
  locale text DEFAULT 'en-IN',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create health_cards table
CREATE TABLE public.health_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hcid text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'provisional' CHECK (status IN ('provisional', 'verified', 'revoked')),
  issued_at timestamptz DEFAULT now(),
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.health_cards ENABLE ROW LEVEL SECURITY;

-- Health cards policies
CREATE POLICY "Users can view own health cards"
  ON public.health_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health cards"
  ON public.health_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create consent_records table
CREATE TABLE public.consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  consent_given boolean NOT NULL DEFAULT false,
  consent_text text,
  locale text DEFAULT 'en-IN',
  created_at timestamptz DEFAULT now(),
  revoked_at timestamptz
);

-- Enable RLS
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Consent records policies
CREATE POLICY "Users can view own consent records"
  ON public.consent_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consent records"
  ON public.consent_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create health_events table
CREATE TABLE public.health_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hcid text NOT NULL REFERENCES public.health_cards(hcid) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('symptom', 'lab', 'visit', 'iot', 'triage')),
  event_timestamp timestamptz DEFAULT now(),
  summary text,
  payload jsonb,
  source text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.health_events ENABLE ROW LEVEL SECURITY;

-- Health events policies
CREATE POLICY "Users can view own health events"
  ON public.health_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.health_cards
      WHERE health_cards.hcid = health_events.hcid
      AND health_cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own health events"
  ON public.health_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.health_cards
      WHERE health_cards.hcid = health_events.hcid
      AND health_cards.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_cards_updated_at
  BEFORE UPDATE ON public.health_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();