// server/routes.ts
import express, { Express } from 'express'
import { createServer, Server } from 'http'
import { supabase, signIn, signUp, signOut, requireAuth, optionalAuth } from './auth'
import { z } from 'zod'

// Schemas de validação (exemplo, adapte conforme @shared/schema)
const userSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})
const reviewSchema = z.object({
  reviewee_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json())

  // ─── AUTH ───────────────────────────────────────────

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password } = userSchema.parse(req.body)
      const user = await signUp(email, password)
      res.status(201).json({ user })
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  })

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = userSchema.pick({ email: true, password: true }).parse(req.body)
      const session = await signIn(email, password)
      res.cookie('session_token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: session.expires_in * 1000,
      })
      res.json({ user: session.user })
    } catch (e: any) {
      res.status(401).json({ error: e.message })
    }
  })

  app.post('/api/auth/logout', requireAuth, async (req, res) => {
    await signOut(req)
    res.clearCookie('session_token')
    res.json({ message: 'Logout realizado' })
  })

  app.get('/api/auth/me', requireAuth, (req, res) => {
    res.json({ user: (req as any).user })
  })

  // ─── USERS ──────────────────────────────────────────

  app.get('/api/users', requireAuth, async (req, res) => {
    const { data, error } = await supabase.from('users').select('*')
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  })

  app.post('/api/users', requireAuth, async (req, res) => {
    try {
      const payload = userSchema.partial({ first_name: false, last_name: false }).parse(req.body)
      const { data, error } = await supabase.from('users').insert(payload).select().single()
      if (error) throw error
      res.status(201).json(data)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  })

  app.put('/api/users/:id', requireAuth, async (req, res) => {
    const { id } = req.params
    const payload = req.body
    const { data, error } = await supabase
        .from('users')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  })

  app.delete('/api/users/:id', requireAuth, async (req, res) => {
    const { id } = req.params
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ message: 'Usuário removido' })
  })

  // ─── REVIEWS ───────────────────────────────────────

  app.post('/api/reviews', requireAuth, async (req, res) => {
    try {
      const payload = reviewSchema.parse(req.body)
      const { data, error } = await supabase.from('reviews').insert(payload).select().single()
      if (error) throw error
      res.status(201).json(data)
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  })

  app.get('/api/reviews', requireAuth, async (req, res) => {
    const reviewee_id = String(req.query.reviewee_id)
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewee_id', reviewee_id)
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  })

  app.delete('/api/reviews/:id', requireAuth, async (req, res) => {
    const { id } = req.params
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) return res.status(400).json({ error: error.message })
    res.json({ message: 'Review eliminada' })
  })

  // ─── FEEDBACK ──────────────────────────────────────

  app.post('/api/feedback', requireAuth, async (req, res) => {
    const payload = req.body
    const { data, error } = await supabase.from('feedback').insert(payload).select().single()
    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json(data)
  })

  app.get('/api/admin/feedback', requireAuth, async (req, res) => {
    const { data, error } = await supabase.from('feedback').select('*')
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
  })

  // ─── UPLOADS ───────────────────────────────────────

  // Supondo multer configurado antes deste handler
  app.post('/api/upload-file', requireAuth, async (req, res) => {
    const file = (req as any).file
    const { data, error } = await supabase.storage
        .from('uploads')
        .upload(file.originalname, file.buffer, { contentType: file.mimetype })
    if (error) return res.status(500).json({ error: error.message })
    const publicURL = supabase.storage.from('uploads').getPublicUrl(data.path).publicURL
    res.json({ url: publicURL })
  })

  const httpServer = createServer(app)
  return httpServer
}
