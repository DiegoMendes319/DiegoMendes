-- Copy and paste this ENTIRE code into your Supabase SQL Editor
-- Execute it all at once to set up the complete database

-- Create users table for the platform
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  province TEXT NOT NULL,
  municipality TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  address_complement TEXT,
  contract_type TEXT NOT NULL CHECK (contract_type IN ('diarista', 'mensalista', 'ambos')),
  services TEXT[] NOT NULL,
  availability TEXT NOT NULL,
  about_me TEXT,
  profile_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  password_hash TEXT,
  auth_user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table for authentication
CREATE TABLE public.auth_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX users_email_idx ON public.users (email);
CREATE INDEX users_province_idx ON public.users (province);
CREATE INDEX users_municipality_idx ON public.users (municipality);
CREATE INDEX users_neighborhood_idx ON public.users (neighborhood);
CREATE INDEX users_contract_type_idx ON public.users (contract_type);
CREATE INDEX users_services_idx ON public.users USING gin (services);
CREATE INDEX auth_sessions_token_idx ON public.auth_sessions (session_token);
CREATE INDEX auth_sessions_user_id_idx ON public.auth_sessions (user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id OR auth_user_id IS NULL);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can delete their own profile" ON public.users
  FOR DELETE USING (auth.uid() = auth_user_id);

-- RLS Policies for sessions table
CREATE POLICY "Users can view their own sessions" ON public.auth_sessions
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own sessions" ON public.auth_sessions
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete their own sessions" ON public.auth_sessions
  FOR DELETE USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for updating timestamps
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Function to handle new user registration with Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = NEW.id) AND
     NEW.raw_user_meta_data IS NOT NULL THEN
    INSERT INTO public.users (
      auth_user_id,
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      province,
      municipality,
      neighborhood,
      address_complement,
      contract_type,
      services,
      availability,
      about_me,
      profile_url,
      facebook_url,
      instagram_url,
      tiktok_url
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', 'Utilizador'),
      COALESCE(NEW.raw_user_meta_data->>'last_name', 'Novo'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::DATE, CURRENT_DATE - INTERVAL '18 years'),
      COALESCE(NEW.raw_user_meta_data->>'province', 'Luanda'),
      COALESCE(NEW.raw_user_meta_data->>'municipality', 'Luanda'),
      COALESCE(NEW.raw_user_meta_data->>'neighborhood', 'Centro'),
      NEW.raw_user_meta_data->>'address_complement',
      COALESCE(NEW.raw_user_meta_data->>'contract_type', 'diarista'),
      COALESCE(string_to_array(NEW.raw_user_meta_data->>'services', ','), ARRAY['limpeza']),
      COALESCE(NEW.raw_user_meta_data->>'availability', 'Disponível'),
      NEW.raw_user_meta_data->>'about_me',
      NEW.raw_user_meta_data->>'profile_url',
      NEW.raw_user_meta_data->>'facebook_url',
      NEW.raw_user_meta_data->>'instagram_url',
      NEW.raw_user_meta_data->>'tiktok_url'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;