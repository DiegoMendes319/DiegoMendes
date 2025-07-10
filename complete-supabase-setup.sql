-- Script SQL completo para configurar o Supabase (versão corrigida)
-- Execute este script no SQL Editor do Supabase

-- 1. Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar tabela users (compatível com auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    province TEXT,
    municipality TEXT,
    neighborhood TEXT,
    address_complement TEXT,
    contract_type TEXT DEFAULT 'diarista',
    services TEXT[] DEFAULT ARRAY['limpeza'],
    availability TEXT DEFAULT 'Segunda a Sexta, 8h-17h',
    hourly_rate DECIMAL(10,2),
    about_me TEXT,
    profile_image TEXT,
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    facebook_url TEXT,
    instagram_url TEXT,
    tiktok_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

-- 5. Políticas de segurança para users
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 6. Políticas de segurança para reviews
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = reviewer_id);

-- 7. Função para calcular rating automaticamente
CREATE OR REPLACE FUNCTION calculate_user_rating(user_uuid UUID)
RETURNS VOID 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.users 
    SET 
        rating = COALESCE((
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM public.reviews 
            WHERE user_id = user_uuid
        ), 0.0),
        review_count = (
            SELECT COUNT(*)::INTEGER
            FROM public.reviews 
            WHERE user_id = user_uuid
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
        PERFORM calculate_user_rating(OLD.user_id);
        RETURN OLD;
    ELSE
        PERFORM calculate_user_rating(NEW.user_id);
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

-- 10. Função para criar perfil automaticamente quando user se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', 'Nome'),
        COALESCE(NEW.raw_user_meta_data->>'last_name', 'Sobrenome')
    );
    RETURN NEW;
END;
$$;

-- 11. Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 12. Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_province ON public.users(province);
CREATE INDEX IF NOT EXISTS idx_users_municipality ON public.users(municipality);
CREATE INDEX IF NOT EXISTS idx_users_neighborhood ON public.users(neighborhood);
CREATE INDEX IF NOT EXISTS idx_users_services ON public.users USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_users_contract_type ON public.users(contract_type);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);

-- 13. Verificar se tudo foi criado
SELECT 
    'Tables created:' as info,
    array_agg(table_name) as tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'reviews');

-- 14. Inserir dados de exemplo (opcional - comentado para não conflitar)
/*
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'exemplo@email.com',
    crypt('123456', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;
*/