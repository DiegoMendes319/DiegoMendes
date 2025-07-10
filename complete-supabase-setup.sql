-- Complete Supabase SQL Setup for Jikulumessu Platform
-- Execute this entire script in your Supabase SQL Editor

-- First, create the main users table with comprehensive profile information
create table public.users (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  email text unique,
  phone text not null,
  date_of_birth date not null,
  province text not null,
  municipality text not null,
  neighborhood text not null,
  address_complement text,
  contract_type text not null check (contract_type in ('diarista', 'mensalista', 'ambos')),
  services text[] not null,
  availability text not null,
  about_me text,
  profile_url text,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  password_hash text,
  auth_user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create auth_users table to match our authentication system
create table public.auth_users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create sessions table for session management
create table public.auth_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  session_token text unique not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for performance optimization
create index users_email_idx on public.users (email);
create index users_province_idx on public.users (province);
create index users_municipality_idx on public.users (municipality);
create index users_neighborhood_idx on public.users (neighborhood);
create index users_contract_type_idx on public.users (contract_type);
create index users_services_idx on public.users using gin (services);
create index users_auth_user_id_idx on public.users (auth_user_id);

create index auth_users_email_idx on public.auth_users (email);
create index auth_sessions_token_idx on public.auth_sessions (session_token);
create index auth_sessions_user_id_idx on public.auth_sessions (user_id);
create index auth_sessions_expires_at_idx on public.auth_sessions (expires_at);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.auth_users enable row level security;
alter table public.auth_sessions enable row level security;

-- RLS Policies for users table
create policy "Users are viewable by everyone" on public.users
  for select using (true);

create policy "Users can insert their own profile" on public.users
  for insert with check (auth.uid() = auth_user_id or auth_user_id is null);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = auth_user_id);

create policy "Users can delete their own profile" on public.users
  for delete using (auth.uid() = auth_user_id);

-- RLS Policies for auth_users table
create policy "Auth users can view their own data" on public.auth_users
  for select using (auth.uid()::text = id::text);

create policy "Auth users can insert their own data" on public.auth_users
  for insert with check (true);

create policy "Auth users can update their own data" on public.auth_users
  for update using (auth.uid()::text = id::text);

-- RLS Policies for auth_sessions table
create policy "Users can view their own sessions" on public.auth_sessions
  for select using (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy "Users can insert their own sessions" on public.auth_sessions
  for insert with check (user_id in (select id from public.users where auth_user_id = auth.uid()));

create policy "Users can delete their own sessions" on public.auth_sessions
  for delete using (user_id in (select id from public.users where auth_user_id = auth.uid()));

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create triggers for updating timestamps
create trigger handle_users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger handle_auth_users_updated_at
  before update on public.auth_users
  for each row execute procedure public.handle_updated_at();

-- Function to clean up expired sessions
create or replace function public.cleanup_expired_sessions()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.auth_sessions where expires_at < now();
end;
$$;

-- Function to handle user registration with Supabase Auth integration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Only create profile if it doesn't exist and metadata is present
  if not exists (select 1 from public.users where auth_user_id = new.id) and
     new.raw_user_meta_data is not null then
    insert into public.users (
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
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'first_name', 'Utilizador'),
      coalesce(new.raw_user_meta_data->>'last_name', 'Novo'),
      new.email,
      coalesce(new.raw_user_meta_data->>'phone', ''),
      coalesce((new.raw_user_meta_data->>'date_of_birth')::date, current_date - interval '18 years'),
      coalesce(new.raw_user_meta_data->>'province', 'Luanda'),
      coalesce(new.raw_user_meta_data->>'municipality', 'Luanda'),
      coalesce(new.raw_user_meta_data->>'neighborhood', 'Centro'),
      new.raw_user_meta_data->>'address_complement',
      coalesce(new.raw_user_meta_data->>'contract_type', 'diarista'),
      coalesce(
        string_to_array(new.raw_user_meta_data->>'services', ','),
        array['limpeza']
      ),
      coalesce(new.raw_user_meta_data->>'availability', 'Disponível'),
      new.raw_user_meta_data->>'about_me',
      new.raw_user_meta_data->>'profile_url',
      new.raw_user_meta_data->>'facebook_url',
      new.raw_user_meta_data->>'instagram_url',
      new.raw_user_meta_data->>'tiktok_url'
    );
  end if;
  return new;
end;
$$;

-- Create trigger for automatic profile creation on Supabase auth user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to search users with filters
create or replace function public.search_users(
  search_province text default null,
  search_municipality text default null,
  search_neighborhood text default null,
  search_service text default null,
  search_contract_type text default null
)
returns setof public.users
language plpgsql
security definer
as $$
begin
  return query
  select *
  from public.users
  where (search_province is null or province ilike '%' || search_province || '%')
    and (search_municipality is null or municipality ilike '%' || search_municipality || '%')
    and (search_neighborhood is null or neighborhood ilike '%' || search_neighborhood || '%')
    and (search_service is null or search_service = any(services))
    and (search_contract_type is null or contract_type = search_contract_type)
  order by created_at desc;
end;
$$;

-- Sample data insertion (for testing purposes)
insert into public.users (
  first_name, last_name, email, phone, date_of_birth,
  province, municipality, neighborhood,
  contract_type, services, availability, about_me
) values 
(
  'Maria', 'Silva', 'maria.silva@example.com', '+244 912 345 678', '1985-03-15',
  'Luanda', 'Luanda', 'Miramar',
  'ambos', array['limpeza', 'cozinha'], 'Segunda a Sexta, 8h-17h',
  'Profissional experiente com 10 anos de experiência em serviços domésticos.'
),
(
  'Ana', 'Santos', 'ana.santos@example.com', '+244 923 456 789', '1990-07-22',
  'Luanda', 'Viana', 'Zango',
  'diarista', array['limpeza', 'lavanderia'], 'Fins de semana disponível',
  'Especialista em limpeza profunda e organização de espaços.'
),
(
  'João', 'Pereira', 'joao.pereira@example.com', '+244 934 567 890', '1988-11-05',
  'Benguela', 'Benguela', 'Centro',
  'mensalista', array['jardinagem', 'limpeza'], 'Disponível período integral',
  'Experiente em manutenção de jardins e limpeza geral.'
);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all functions in schema public to anon, authenticated;

-- Create periodic cleanup job (runs every hour to clean expired sessions)
-- Note: This requires the pg_cron extension to be enabled in Supabase
-- select cron.schedule('cleanup-expired-sessions', '0 * * * *', 'select public.cleanup_expired_sessions();');