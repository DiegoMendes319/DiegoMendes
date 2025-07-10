-- Script SQL para configurar o Supabase para o portal Jikulumessu
-- Execute este script no SQL Editor do Supabase

-- Criação da tabela users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para users
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas de segurança para reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = reviewer_id);

-- Função para calcular a média de avaliações
CREATE OR REPLACE FUNCTION calculate_user_rating(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.users 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0.0)
            FROM public.reviews 
            WHERE user_id = user_uuid
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.reviews 
            WHERE user_id = user_uuid
        )
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar automaticamente a avaliação quando uma review é criada/actualizada/eliminada
CREATE OR REPLACE FUNCTION update_user_rating_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM calculate_user_rating(OLD.user_id);
        RETURN OLD;
    ELSE
        PERFORM calculate_user_rating(NEW.user_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers
DROP TRIGGER IF EXISTS update_user_rating_on_review_change ON public.reviews;
CREATE TRIGGER update_user_rating_on_review_change
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rating_trigger();

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_province ON public.users(province);
CREATE INDEX IF NOT EXISTS idx_users_municipality ON public.users(municipality);
CREATE INDEX IF NOT EXISTS idx_users_neighborhood ON public.users(neighborhood);
CREATE INDEX IF NOT EXISTS idx_users_services ON public.users USING GIN(services);
CREATE INDEX IF NOT EXISTS idx_users_contract_type ON public.users(contract_type);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);

-- Inserir dados de exemplo (opcional)
INSERT INTO public.users (
    email,
    first_name,
    last_name,
    phone,
    date_of_birth,
    province,
    municipality,
    neighborhood,
    contract_type,
    services,
    availability,
    hourly_rate,
    about_me
) VALUES 
(
    'exemplo@email.com',
    'Maria',
    'Silva',
    '923456789',
    '1985-03-15',
    'Luanda',
    'Luanda',
    'Maianga',
    'diarista',
    ARRAY['limpeza', 'cozinha'],
    'Segunda a Sexta, 8h-17h',
    2500.00,
    'Profissional experiente em limpeza doméstica com mais de 10 anos de experiência.'
) ON CONFLICT (email) DO NOTHING;

-- Confirmar que as tabelas foram criadas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'reviews');