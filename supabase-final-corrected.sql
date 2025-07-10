-- Script SQL FINAL CORRIGIDO para configurar o Supabase (Janeiro 2025)
-- Execute este script completo no SQL Editor do Supabase

-- 1. Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar tabela users (compatível com o schema atual do projeto)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT NOT NULL,
    date_of_birth TIMESTAMP WITH TIME ZONE,
    province TEXT NOT NULL,
    municipality TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    address_complement TEXT,
    contract_type TEXT NOT NULL DEFAULT 'diarista',
    services TEXT[] NOT NULL DEFAULT ARRAY['limpeza'],
    availability TEXT NOT NULL DEFAULT 'Segunda a Sexta, 8h-17h',
    about_me TEXT,
    profile_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    tiktok_url TEXT,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    auth_user_id UUID UNIQUE,
    average_rating REAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0
);

-- 3. Criar tabela reviews (compatível com o schema atual)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    service_type TEXT NOT NULL,
    work_quality INTEGER NOT NULL CHECK (work_quality >= 1 AND work_quality <= 5),
    punctuality INTEGER NOT NULL CHECK (punctuality >= 1 AND punctuality <= 5),
    communication INTEGER NOT NULL CHECK (communication >= 1 AND communication <= 5),
    value_for_money INTEGER NOT NULL CHECK (value_for_money >= 1 AND value_for_money <= 5),
    would_recommend BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Habilitar Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de segurança para users (permissivas para desenvolvimento)
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (true);

-- 6. Políticas de segurança para reviews (permissivas para desenvolvimento)
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (true);

-- 7. Função para calcular rating automaticamente
CREATE OR REPLACE FUNCTION calculate_user_rating(user_uuid UUID)
RETURNS VOID 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.users 
    SET 
        average_rating = COALESCE((
            SELECT AVG(rating)::REAL
            FROM public.reviews 
            WHERE reviewee_id = user_uuid
        ), 0.0),
        total_reviews = (
            SELECT COUNT(*)::INTEGER
            FROM public.reviews 
            WHERE reviewee_id = user_uuid
        )
    WHERE id = user_uuid;
END;
$$;

-- 8. Trigger para atualizar rating automaticamente
CREATE OR REPLACE FUNCTION update_user_rating_trigger()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM calculate_user_rating(OLD.reviewee_id);
        RETURN OLD;
    ELSE
        PERFORM calculate_user_rating(NEW.reviewee_id);
        RETURN NEW;
    END IF;
END;
$$;

-- 9. Criar trigger
DROP TRIGGER IF EXISTS update_user_rating_on_review_change ON public.reviews;
CREATE TRIGGER update_user_rating_on_review_change
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rating_trigger();

-- 10. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 11. Trigger para atualizar updated_at na tabela reviews
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON public.reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 12. Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_province ON public.users(province);
CREATE INDEX IF NOT EXISTS idx_users_municipality ON public.users(municipality);
CREATE INDEX IF NOT EXISTS idx_users_neighborhood ON public.users(neighborhood);
CREATE INDEX IF NOT EXISTS idx_users_services ON public.users USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_users_contract_type ON public.users(contract_type);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);

-- 13. Verificar se tudo foi criado
SELECT 
    'Tables created successfully:' as info,
    array_agg(table_name) as tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'reviews');

-- 14. Mostrar estrutura das tabelas criadas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name IN ('users', 'reviews')
ORDER BY table_name, ordinal_position;