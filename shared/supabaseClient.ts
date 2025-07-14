// shared/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL       = process.env.SUPABASE_URL!
const SUPABASE_ANON_KEY  = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// opcional: cliente administrador para funções privilegiadas
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE
export const supabaseAdmin = SUPABASE_SERVICE_ROLE
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
    : supabase
