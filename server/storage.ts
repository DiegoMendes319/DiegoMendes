// server/storage.ts
import { createClient } from '@supabase/supabase-js'
import type {
  User, InsertUser, UpdateUser,
  Review, Feedback, Conversation, Message
} from '@shared/schema'

const SUPABASE_URL       = process.env.SUPABASE_URL!
const SUPABASE_ANON_KEY  = process.env.SUPABASE_ANON_KEY!
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export class Storage {
  // ─── USERS ───────────────────────────────────────────
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from<User>('users').select('*')
    if (error) throw error
    return data
  }

  async getUser(id: string): Promise<User | null> {
    const { data, error } = await supabase.from<User>('users').select('*').eq('id', id).single()
    if (error) throw error
    return data
  }

  async createUser(u: InsertUser): Promise<User> {
    const { data, error } = await supabase.from<User>('users').insert(u).select().single()
    if (error) throw error
    return data
  }

  async updateUser(id: string, u: UpdateUser): Promise<User> {
    const { data, error } = await supabase.from<User>('users').update(u).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) throw error
  }

  // ─── REVIEWS ─────────────────────────────────────────
  async createReview(r: Omit<Review,'id'|'created_at'|'updated_at'>): Promise<Review> {
    const { data, error } = await supabase.from<Review>('reviews').insert(r).select().single()
    if (error) throw error
    return data
  }

  async getReviewsForUser(reviewee_id: string): Promise<Review[]> {
    const { data, error } = await supabase
        .from<Review>('reviews')
        .select('*')
        .eq('reviewee_id', reviewee_id)
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) throw error
  }

  // ─── FEEDBACK ────────────────────────────────────────
  async createFeedback(f: Omit<Feedback,'id'|'created_at'|'updated_at'>): Promise<Feedback> {
    const { data, error } = await supabase.from<Feedback>('feedback').insert(f).select().single()
    if (error) throw error
    return data
  }

  async getAllFeedback(): Promise<Feedback[]> {
    const { data, error } = await supabase.from<Feedback>('feedback').select('*')
    if (error) throw error
    return data
  }

  async deleteFeedback(id: string): Promise<void> {
    const { error } = await supabase.from('feedback').delete().eq('id', id)
    if (error) throw error
  }

  // ─── CONVERSATIONS & MESSAGES ───────────────────────
  async getUserConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
        .from<Conversation>('conversations')
        .select('*')
        .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    if (error) throw error
    return data
  }

  async createConversation(c: Omit<Conversation,'id'|'created_at'|'updated_at'>): Promise<Conversation> {
    const { data, error } = await supabase.from<Conversation>('conversations').insert(c).select().single()
    if (error) throw error
    return data
  }

  async getConversationMessages(conversation_id: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from<Message>('messages')
        .select('*')
        .eq('conversation_id', conversation_id)
        .order('created_at', { ascending: true })
    if (error) throw error
    return data
  }

  async createMessage(m: Omit<Message,'id'|'created_at'>): Promise<Message> {
    const { data, error } = await supabase.from<Message>('messages').insert(m).select().single()
    if (error) throw error
    return data
  }

  async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase.from<Message>('messages').delete().eq('id', id)
    if (error) throw error
  }

  // ─── SETTINGS & ANALYTICS ───────────────────────────
  async getSiteSettings(): Promise<Record<string,string>> {
    const { data, error } = await supabase.from('site_settings').select('key,value')
    if (error) throw error
    return data.reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {})
  }

  async updateSiteSetting(key: string, value: string): Promise<void> {
    const { error } = await supabase.from('site_settings').upsert({ key, value })
    if (error) throw error
  }

  async recordAnalytics(entry: { page: string; user_id: string }): Promise<void> {
    const { error } = await supabase.from('site_analytics').insert(entry)
    if (error) throw error
  }

  async getAnalytics(days = 30): Promise<any[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
        .from('site_analytics')
        .select('*')
        .gte('created_at', since)
    if (error) throw error
    return data
  }
}

export const storage = new Storage()