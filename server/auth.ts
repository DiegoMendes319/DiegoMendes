// server/auth.ts
import { createClient } from '@supabase/supabase-js'
import { Request, Response, NextFunction } from 'express'

const SUPABASE_URL       = process.env.SUPABASE_URL!
const SUPABASE_ANON_KEY  = process.env.SUPABASE_ANON_KEY!
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export interface AuthUser {
  id: string
  email: string
  user_metadata: Record<string, any>
}

export interface AuthSession {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
  user: AuthUser
}

// Cadastra novo usuário
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)
  return data.user
}

// Faz login
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return data.session as AuthSession
}

// Faz logout
export async function signOut(req: Request) {
  await supabase.auth.signOut()
}

// Middleware que exige autenticação
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return res.status(401).json({ error: 'Não autenticado' })
  }
  ;(req as any).user = session.user
  next()
}

// Middleware opcional (não bloqueia sem sessão)
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    ;(req as any).user = session.user
  }
  next()
}
