import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  profile?: {
    id: string;
    first_name: string;
    last_name: string;
    name: string;
  };
}

export interface AuthSession {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: Date;
  created_at: Date;
}

// In-memory storage for sessions (in production, use Redis or database)
const activeSessions = new Map<string, AuthSession>();

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate secure session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Create user session
export function createSession(userId: string): { token: string; expiresAt: Date } {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  const session: AuthSession = {
    id: crypto.randomUUID(),
    user_id: userId,
    session_token: token,
    expires_at: expiresAt,
    created_at: new Date()
  };
  
  activeSessions.set(token, session);
  
  // Clean up expired sessions
  cleanupExpiredSessions();
  
  return { token, expiresAt };
}

// Validate session token
export function validateSession(token: string): AuthSession | null {
  const session = activeSessions.get(token);
  
  if (!session) return null;
  
  if (session.expires_at < new Date()) {
    activeSessions.delete(token);
    return null;
  }
  
  return session;
}

// Delete session (logout)
export function deleteSession(token: string): boolean {
  return activeSessions.delete(token);
}

// Clean up expired sessions
export function cleanupExpiredSessions(): void {
  const now = new Date();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expires_at < now) {
      activeSessions.delete(token);
    }
  }
}

// Middleware to authenticate requests
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.cookies?.session_token;
  
  if (!token) {
    res.status(401).json({ error: 'Token de sessão necessário' });
    return;
  }
  
  const session = validateSession(token);
  if (!session) {
    res.status(401).json({ error: 'Sessão inválida ou expirada' });
    return;
  }
  
  // Attach user info to request
  (req as any).userId = session.user_id;
  (req as any).sessionToken = token;
  
  next();
}

// Optional auth middleware (doesn't block request if no auth)
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.cookies?.session_token;
  
  if (token) {
    const session = validateSession(token);
    if (session) {
      (req as any).userId = session.user_id;
      (req as any).sessionToken = token;
    }
  }
  
  next();
}