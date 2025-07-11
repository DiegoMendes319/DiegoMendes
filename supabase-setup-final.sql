-- Script SQL para configurar o Supabase manualmente
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar tabela users (compatível com o sistema actual)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    province TEXT,
    municipality TEXT,
    neighborhood TEXT,
    address_complement TEXT,
    contract_type TEXT DEFAULT 'mensal',
    services TEXT[] DEFAULT ARRAY['limpeza'],
    availability TEXT DEFAULT 'Segunda a Sexta, 8h-17h',
    hourly_rate DECIMAL(10,2),
    about_me TEXT,
    profile_url TEXT,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Habilitar Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de segurança para users (públicas para permitir acesso)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert profiles" ON public.users;
CREATE POLICY "Users can insert profiles" ON public.users
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update profiles" ON public.users;
CREATE POLICY "Users can update profiles" ON public.users
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete profiles" ON public.users;
CREATE POLICY "Users can delete profiles" ON public.users
    FOR DELETE USING (true);

-- 6. Políticas de segurança para reviews (públicas)
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
CREATE POLICY "Users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update reviews" ON public.reviews;
CREATE POLICY "Users can update reviews" ON public.reviews
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete reviews" ON public.reviews;
CREATE POLICY "Users can delete reviews" ON public.reviews
    FOR DELETE USING (true);

-- 7. Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_province ON public.users(province);
CREATE INDEX IF NOT EXISTS idx_users_municipality ON public.users(municipality);
CREATE INDEX IF NOT EXISTS idx_users_neighborhood ON public.users(neighborhood);
CREATE INDEX IF NOT EXISTS idx_users_services ON public.users USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_users_contract_type ON public.users(contract_type);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);

-- 8. Verificar se tudo foi criado
SELECT 
    'Tables created successfully' as message,
    array_agg(table_name) as tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'reviews');

-- 9. Mostrar estrutura das tabelas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'reviews')
ORDER BY table_name, ordinal_position;