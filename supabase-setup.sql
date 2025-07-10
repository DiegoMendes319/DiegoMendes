-- Casa Rápida - Complete Database Setup for Supabase
-- Execute this script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (careful in production!)
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table for authentication
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create profiles table for user details
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    province TEXT NOT NULL,
    municipality TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    address_complement TEXT,
    contract_type TEXT NOT NULL CHECK (contract_type IN ('tempo-parcial', 'tempo-integral', 'freelancer', 'diario')),
    services TEXT[] NOT NULL DEFAULT '{}',
    availability TEXT NOT NULL,
    about_me TEXT,
    profile_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    tiktok_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_age CHECK (date_part('year', age(date_of_birth)) >= 18)
);

-- Create user sessions table for authentication
CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_location ON public.profiles(province, municipality, neighborhood);
CREATE INDEX idx_profiles_services ON public.profiles USING GIN(services);
CREATE INDEX idx_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_sessions_expires ON public.user_sessions(expires_at);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own record" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own record" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for profiles table
CREATE POLICY "Anyone can view profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own profile" ON public.profiles
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- RLS Policies for sessions table
CREATE POLICY "Users can view own sessions" ON public.user_sessions
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own sessions" ON public.user_sessions
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Function to automatically create profile when user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- This trigger would be called when a user signs up via Supabase Auth
    -- For now, we'll handle profile creation manually in the application
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.user_sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to hash passwords (using pgcrypto)
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf', 12));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN crypt(password, hash) = hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a new session
CREATE OR REPLACE FUNCTION public.create_user_session(
    p_user_id UUID,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
    session_token TEXT;
BEGIN
    -- Generate a secure session token
    session_token := encode(gen_random_bytes(32), 'hex');
    
    -- Insert the session
    INSERT INTO public.user_sessions (user_id, session_token, expires_at, user_agent, ip_address)
    VALUES (p_user_id, session_token, NOW() + INTERVAL '30 days', p_user_agent, p_ip_address);
    
    RETURN session_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate session and return user info
CREATE OR REPLACE FUNCTION public.validate_session(p_session_token TEXT)
RETURNS TABLE(
    user_id UUID,
    email TEXT,
    profile_id UUID,
    first_name TEXT,
    last_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        p.id,
        p.first_name,
        p.last_name
    FROM public.user_sessions s
    JOIN public.users u ON s.user_id = u.id
    LEFT JOIN public.profiles p ON u.id = p.user_id
    WHERE s.session_token = p_session_token
    AND s.expires_at > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for easy profile queries with computed fields
CREATE OR REPLACE VIEW public.profile_view AS
SELECT 
    p.id,
    p.user_id,
    u.email,
    p.first_name,
    p.last_name,
    (p.first_name || ' ' || p.last_name) AS name,
    p.phone,
    p.date_of_birth,
    EXTRACT(YEAR FROM AGE(p.date_of_birth))::INTEGER AS age,
    p.province,
    p.municipality,
    p.neighborhood,
    p.address_complement,
    p.contract_type,
    p.services,
    p.availability,
    p.about_me,
    p.profile_url,
    p.facebook_url,
    p.instagram_url,
    p.tiktok_url,
    p.created_at,
    p.updated_at
FROM public.profiles p
JOIN public.users u ON p.user_id = u.id;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profile_view TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_sessions TO authenticated;

-- Allow anon to read profiles for public browsing
GRANT SELECT ON public.profiles TO anon;

COMMENT ON TABLE public.users IS 'Authentication table for user accounts';
COMMENT ON TABLE public.profiles IS 'Detailed profile information for domestic workers';
COMMENT ON TABLE public.user_sessions IS 'User session management for authentication';
COMMENT ON VIEW public.profile_view IS 'Convenient view combining user and profile data with computed fields';