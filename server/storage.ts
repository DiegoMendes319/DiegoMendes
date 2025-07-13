import { users, reviews, admin_logs, site_settings, site_analytics, feedback, type User, type InsertUser, type UpdateUser, type Review, type InsertReview, type UpdateReview, type AdminLog, type SiteSetting, type SiteAnalytics, type Feedback, type InsertFeedback, type UpdateFeedback, type InsertAdminLog, type InsertSiteSetting, type UpdateSiteSetting, type InsertAnalytics } from "@shared/schema";
import { eq, and, ilike, or, sql, desc } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByAuthId(authId: string): Promise<User | undefined>;
  createUser(user: InsertUser & { auth_user_id?: string }): Promise<User>;
  updateUser(id: string, user: UpdateUser): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  searchUsers(filters: {
    lat?: number;
    lng?: number;
    province?: string;
    municipality?: string;
    neighborhood?: string;
    service?: string;
    contract_type?: string;
  }): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  
  // Authentication methods
  authenticateUser(email: string, password: string): Promise<{ user: User; sessionToken: string } | null>;
  authenticateUserByName(firstName: string, lastName: string, password: string): Promise<{ user: User; sessionToken: string } | null>;
  createUserWithAuth(userData: InsertUser): Promise<{ user: User; sessionToken: string }>;
  validateSession(sessionToken: string): Promise<User | null>;
  logout(sessionToken: string): Promise<boolean>;
  
  // Password management
  verifyPassword(userId: string, password: string): Promise<boolean>;
  updatePassword(userId: string, newPassword: string): Promise<boolean>;
  
  // Password recovery
  createRecoveryToken(userId: string, method: 'email' | 'sms'): Promise<string>;
  validateRecoveryToken(token: string): Promise<User | null>;
  resetPasswordWithToken(token: string, newPassword: string): Promise<boolean>;
  
  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getReviewsForUser(userId: string): Promise<Review[]>;
  updateUserRating(userId: string): Promise<void>;
  deleteReview(reviewId: string): Promise<boolean>;
  
  // Admin methods
  isAdmin(userId: string): Promise<boolean>;
  logAdminAction(log: InsertAdminLog): Promise<AdminLog>;
  getAdminLogs(limit?: number): Promise<AdminLog[]>;
  getUserStats(): Promise<{
    total: number;
    active: number;
    suspended: number;
    admins: number;
    newToday: number;
  }>;
  updateUserRole(userId: string, role: string): Promise<User | undefined>;
  updateUserStatus(userId: string, status: string): Promise<User | undefined>;
  deleteUser(userId: string): Promise<boolean>;
  
  // Site settings
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  updateSiteSetting(key: string, value: string): Promise<SiteSetting>;
  
  // Analytics
  getAnalytics(days?: number): Promise<SiteAnalytics[]>;
  recordAnalytics(data: InsertAnalytics): Promise<void>;
  
  // Feedback methods
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getAllFeedback(): Promise<Feedback[]>;
  getFeedbackByCategory(category: string): Promise<Feedback[]>;
  markFeedbackAsRead(feedbackId: string): Promise<boolean>;
  deleteFeedback(feedbackId: string): Promise<boolean>;
  getUnreadFeedbackCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private usersByEmail: Map<string, User>;
  private usersByAuthId: Map<string, User>;
  private sessions: Map<string, { userId: string; expiresAt: Date }>;
  private recoveryTokens: Map<string, { userId: string; token: string; expiresAt: Date; method: 'email' | 'sms' }>;
  private reviews: Map<string, Review>;
  private adminLogs: Map<string, AdminLog>;
  private siteSettings: Map<string, SiteSetting>;
  private analytics: Map<string, SiteAnalytics>;
  private feedbackMessages: Map<string, Feedback>;

  constructor() {
    this.users = new Map();
    this.usersByEmail = new Map();
    this.usersByAuthId = new Map();
    this.sessions = new Map();
    this.recoveryTokens = new Map();
    this.reviews = new Map();
    this.adminLogs = new Map();
    this.siteSettings = new Map();
    this.analytics = new Map();
    this.feedbackMessages = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create admin user for testing - using correct hash for "admin123"
    const adminPassword = "$2b$12$nvvxXJiqkgM.FVb7KYgpw.wUlov1jNfUl5tesjr75AKbBdoXw83Si";
    
    const adminUser = {
      id: "admin-test-user",
      auth_user_id: "admin-test-auth",
      email: "admin@jikulumessu.com",
      first_name: "Admin",
      last_name: "Jikulumessu",
      phone: "+244 900 000 000",
      date_of_birth: new Date("1990-01-01"),
      province: "Luanda",
      municipality: "Luanda",
      neighborhood: "Maianga",
      services: ["administração"],
      contract_type: "permanente",
      availability: "24/7",
      bio: "Administrador do sistema Jikulumessu",
      profile_image: null,
      profile_url: null,
      facebook_url: null,
      instagram_url: null,
      tiktok_url: null,
      address_complement: "Sede da Jikulumessu",
      about_me: "Administrador principal da plataforma",
      password: adminPassword,
      rating: 5.0,
      review_count: 0,
      average_rating: 5.0,
      total_reviews: 0,
      role: "super_admin",
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
      name: "Admin Jikulumessu",
      age: 34
    };

    this.users.set(adminUser.id, adminUser);
    this.usersByEmail.set(adminUser.email, adminUser);
    this.usersByAuthId.set(adminUser.auth_user_id, adminUser);
    
    // Initialize default site settings
    this.initializeDefaultSettings();
    
    console.log("MemStorage initialized with admin user: admin@jikulumessu.com / admin123");
  }

  private initializeDefaultSettings() {
    const defaultSettings = [
      {
        key: "site_name",
        value: "Jikulumessu",
        description: "Nome do site",
        type: "text"
      },
      {
        key: "site_description", 
        value: "Portal de prestadores de serviços em Angola",
        description: "Descrição do site",
        type: "text"
      },
      {
        key: "primary_color",
        value: "#dc2626",
        description: "Cor primária do site",
        type: "color"
      },
      {
        key: "secondary_color",
        value: "#facc15",
        description: "Cor secundária do site",
        type: "color"
      },
      {
        key: "contact_email",
        value: "d2413175@gmail.com",
        description: "Email de contacto principal",
        type: "email"
      },
      {
        key: "max_users_per_page",
        value: "20",
        description: "Número máximo de utilizadores por página",
        type: "number"
      },
      {
        key: "enable_registration",
        value: "true",
        description: "Permitir novos registos",
        type: "boolean"
      },
      {
        key: "maintenance_mode",
        value: "false",
        description: "Modo de manutenção",
        type: "boolean"
      }
    ];

    defaultSettings.forEach(setting => {
      const siteSettingId = crypto.randomUUID();
      const siteSetting = {
        id: siteSettingId,
        key: setting.key,
        value: setting.value,
        description: setting.description,
        type: setting.type,
        created_at: new Date(),
        updated_at: new Date(),
        updated_by: "admin-test-user",
      };
      
      this.siteSettings.set(setting.key, siteSetting);
    });
  }

  // Tutorial-specific methods
  addTutorialUser(): User {
    const tutorialUser = {
      id: "tutorial-temp-user",
      auth_user_id: "tutorial-temp-auth",
      email: "tutorial@example.com",
      first_name: "Maria",
      last_name: "Silva",
      phone: "+244 912 345 678",
      date_of_birth: new Date("1985-03-15"),
      province: "Luanda",
      municipality: "Maianga",
      neighborhood: "Alvalade",
      services: ["limpeza", "cozinha"],
      contract_type: "mensal",
      availability: "Seg-Sex: 8h-17h",
      bio: "Experiência de 5 anos em limpeza doméstica e cozinha.",
      profile_image: null,
      profile_url: null,
      facebook_url: "https://facebook.com/maria.silva",
      instagram_url: null,
      tiktok_url: null,
      address_complement: "Rua 15 de Outubro, Casa 34, próximo ao Mercado do Maianga",
      about_me: null,
      password: null,
      rating: 4.5,
      review_count: 8,
      average_rating: 4.5,
      total_reviews: 8,
      created_at: new Date(),
      updated_at: new Date(),
      name: "Maria Silva",
      age: Math.floor((Date.now() - new Date("1985-03-15").getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    };

    this.users.set(tutorialUser.id, tutorialUser);
    this.usersByEmail.set(tutorialUser.email, tutorialUser);
    this.usersByAuthId.set(tutorialUser.auth_user_id, tutorialUser);
    
    return tutorialUser;
  }

  removeTutorialUser(): void {
    const tutorialUser = this.users.get("tutorial-temp-user");
    if (tutorialUser) {
      this.users.delete("tutorial-temp-user");
      this.usersByEmail.delete(tutorialUser.email);
      this.usersByAuthId.delete(tutorialUser.auth_user_id);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.usersByEmail.get(email);
  }

  async getUserByAuthId(authId: string): Promise<User | undefined> {
    return this.usersByAuthId.get(authId);
  }

  async createUser(insertUser: InsertUser & { auth_user_id?: string }): Promise<User> {
    const id = crypto.randomUUID();
    const dateOfBirth = insertUser.date_of_birth ? new Date(insertUser.date_of_birth) : new Date('1990-01-01');
    
    // Hash password if provided
    let hashedPassword: string | null = null;
    if (insertUser.password) {
      hashedPassword = await this.hashPassword(insertUser.password);
    }
    
    const user: User = {
      ...insertUser,
      id,
      created_at: new Date(),
      profile_url: insertUser.profile_url || null,
      auth_user_id: insertUser.auth_user_id || null,
      email: insertUser.email || null,
      date_of_birth: dateOfBirth,
      address_complement: insertUser.address_complement || null,
      about_me: insertUser.about_me || null,
      facebook_url: insertUser.facebook_url || null,
      instagram_url: insertUser.instagram_url || null,
      tiktok_url: insertUser.tiktok_url || null,
      password: hashedPassword,
      average_rating: 0,
      total_reviews: 0,
      // Computed fields
      name: `${insertUser.first_name} ${insertUser.last_name}`,
      age: new Date().getFullYear() - dateOfBirth.getFullYear(),
    };
    
    this.users.set(id, user);
    if (user.email) {
      this.usersByEmail.set(user.email.toLowerCase(), user);
    }
    if (user.auth_user_id) {
      this.usersByAuthId.set(user.auth_user_id, user);
    }
    
    return user;
  }

  async updateUser(id: string, updateUser: UpdateUser): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return undefined;
    }

    // Remove from email index if email is changing
    if (updateUser.email && updateUser.email !== existingUser.email && existingUser.email) {
      this.usersByEmail.delete(existingUser.email);
    }

    // Handle date conversion properly
    let processedUpdate = { ...updateUser };
    if (processedUpdate.date_of_birth && typeof processedUpdate.date_of_birth === 'string') {
      processedUpdate.date_of_birth = new Date(processedUpdate.date_of_birth);
    }

    const updatedUser: User = {
      ...existingUser,
      ...processedUpdate,
      // Update computed fields if names change
      name: updateUser.first_name || updateUser.last_name 
        ? `${updateUser.first_name || existingUser.first_name} ${updateUser.last_name || existingUser.last_name}`
        : existingUser.name,
      age: processedUpdate.date_of_birth 
        ? new Date().getFullYear() - new Date(processedUpdate.date_of_birth).getFullYear()
        : existingUser.age,
    };

    this.users.set(id, updatedUser);
    if (updatedUser.email) {
      this.usersByEmail.set(updatedUser.email, updatedUser);
    }
    if (updatedUser.auth_user_id) {
      this.usersByAuthId.set(updatedUser.auth_user_id, updatedUser);
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) {
      return false;
    }

    this.users.delete(id);
    if (user.email) {
      this.usersByEmail.delete(user.email);
    }
    if (user.auth_user_id) {
      this.usersByAuthId.delete(user.auth_user_id);
    }

    return true;
  }

  async searchUsers(filters: {
    lat?: number;
    lng?: number;
    province?: string;
    municipality?: string;
    neighborhood?: string;
    service?: string;
    contract_type?: string;
  }): Promise<User[]> {
    let filteredUsers = Array.from(this.users.values());

    // Apply filters
    if (filters.province) {
      filteredUsers = filteredUsers.filter(user => 
        user.province.toLowerCase() === filters.province!.toLowerCase()
      );
    }

    if (filters.municipality) {
      filteredUsers = filteredUsers.filter(user => 
        user.municipality.toLowerCase() === filters.municipality!.toLowerCase()
      );
    }

    if (filters.neighborhood) {
      filteredUsers = filteredUsers.filter(user => 
        user.neighborhood.toLowerCase() === filters.neighborhood!.toLowerCase()
      );
    }

    if (filters.service) {
      filteredUsers = filteredUsers.filter(user => 
        user.services.some(service => 
          service.toLowerCase() === filters.service!.toLowerCase()
        )
      );
    }

    if (filters.contract_type) {
      filteredUsers = filteredUsers.filter(user => 
        user.contract_type.toLowerCase() === filters.contract_type!.toLowerCase()
      );
    }

    // TODO: Implement geolocation-based sorting when lat/lng are provided
    // For now, return filtered results
    return filteredUsers;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Hash password helper
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  // Verify password helper
  private async verifyPasswordHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  // Generate session token
  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Authentication methods
  async authenticateUser(email: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
    const user = this.usersByEmail.get(email.toLowerCase());
    
    if (!user) {
      return null;
    }
    
    if (!user.password) {
      return null;
    }

    const isValidPassword = await this.verifyPasswordHash(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    console.log(`Authentication successful for user: ${email}`);
    // Create session
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    this.sessions.set(sessionToken, {
      userId: user.id,
      expiresAt
    });

    // Clean up expired sessions
    this.cleanupExpiredSessions();

    return { user, sessionToken };
  }

  // Simple authentication by name + password
  async authenticateUserByName(firstName: string, lastName: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
    // Find user by first and last name
    const allUsers = Array.from(this.users.values());
    const user = allUsers.find(u => 
      u.first_name?.toLowerCase() === firstName.toLowerCase() && 
      u.last_name?.toLowerCase() === lastName.toLowerCase()
    );
    
    if (!user || !user.password) {
      return null;
    }

    const isValidPassword = await this.verifyPasswordHash(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Create session
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    this.sessions.set(sessionToken, {
      userId: user.id,
      expiresAt
    });

    // Clean up expired sessions
    this.cleanupExpiredSessions();

    return { user, sessionToken };
  }

  async createUserWithAuth(userData: InsertUser): Promise<{ user: User; sessionToken: string }> {
    // Check if email already exists
    if (userData.email && this.usersByEmail.has(userData.email.toLowerCase())) {
      throw new Error('Email já está em uso');
    }

    // Hash password if provided
    let hashedPassword: string | null = null;
    if (userData.password) {
      hashedPassword = await this.hashPassword(userData.password);
    }

    const userId = crypto.randomUUID();
    const now = new Date();

    // Calculate age
    const birthDate = new Date(userData.date_of_birth);
    const age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      // Subtract 1 if birthday hasn't occurred this year
    }

    const user: User = {
      id: userId,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email || null,
      phone: userData.phone,
      date_of_birth: birthDate,
      province: userData.province,
      municipality: userData.municipality,
      neighborhood: userData.neighborhood,
      address_complement: userData.address_complement || null,
      contract_type: userData.contract_type,
      services: userData.services || [],
      availability: userData.availability,
      about_me: userData.about_me || null,
      profile_url: userData.profile_url || null,
      facebook_url: userData.facebook_url || null,
      instagram_url: userData.instagram_url || null,
      tiktok_url: userData.tiktok_url || null,
      password: hashedPassword,
      created_at: now,
      auth_user_id: userData.auth_user_id || null,
      average_rating: 0,
      total_reviews: 0,
      // Computed fields
      name: `${userData.first_name} ${userData.last_name}`,
      age: age
    };

    // Store user
    this.users.set(userId, user);
    if (user.email) {
      this.usersByEmail.set(user.email.toLowerCase(), user);
    }
    if (user.auth_user_id) {
      this.usersByAuthId.set(user.auth_user_id, user);
    }

    // Create session
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    this.sessions.set(sessionToken, {
      userId: user.id,
      expiresAt
    });

    return { user, sessionToken };
  }

  async validateSession(sessionToken: string): Promise<User | null> {
    const session = this.sessions.get(sessionToken);
    
    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      this.sessions.delete(sessionToken);
      return null;
    }

    return this.users.get(session.userId) || null;
  }

  async logout(sessionToken: string): Promise<boolean> {
    return this.sessions.delete(sessionToken);
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user || !user.password) {
      return false;
    }
    return await bcrypt.compare(password, user.password);
  }

  async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) {
      return false;
    }
    
    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;
    this.users.set(userId, user);
    if (user.email) {
      this.usersByEmail.set(user.email.toLowerCase(), user);
    }
    return true;
  }

  // Password recovery methods
  async createRecoveryToken(userId: string, method: 'email' | 'sms'): Promise<string> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('Utilizador não encontrado');
    }

    // Generate a 6-digit token
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store the recovery token
    this.recoveryTokens.set(token, {
      userId,
      token,
      expiresAt,
      method
    });

    // Clean up expired tokens
    this.cleanupExpiredRecoveryTokens();

    return token;
  }

  async validateRecoveryToken(token: string): Promise<User | null> {
    const recoveryData = this.recoveryTokens.get(token);
    if (!recoveryData) {
      return null;
    }

    // Check if token is expired
    if (new Date() > recoveryData.expiresAt) {
      this.recoveryTokens.delete(token);
      return null;
    }

    const user = this.users.get(recoveryData.userId);
    return user || null;
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
    const recoveryData = this.recoveryTokens.get(token);
    if (!recoveryData) {
      return false;
    }

    // Check if token is expired
    if (new Date() > recoveryData.expiresAt) {
      this.recoveryTokens.delete(token);
      return false;
    }

    // Update password
    const success = await this.updatePassword(recoveryData.userId, newPassword);
    
    // Remove the used token
    if (success) {
      this.recoveryTokens.delete(token);
    }

    return success;
  }

  private cleanupExpiredRecoveryTokens(): void {
    const now = new Date();
    for (const [token, data] of this.recoveryTokens.entries()) {
      if (now > data.expiresAt) {
        this.recoveryTokens.delete(token);
      }
    }
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [token, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(token);
      }
    }
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = crypto.randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    this.reviews.set(id, review);
    await this.updateUserRating(insertReview.reviewee_id);
    
    return review;
  }

  async getReviewsForUser(userId: string): Promise<Review[]> {
    const userReviews = Array.from(this.reviews.values())
      .filter(review => review.reviewee_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return userReviews;
  }

  async updateUserRating(userId: string): Promise<void> {
    const userReviews = await this.getReviewsForUser(userId);
    const totalReviews = userReviews.length;
    
    const user = this.users.get(userId);
    if (!user) return;
    
    if (totalReviews === 0) {
      const updatedUser = { ...user, average_rating: 0, total_reviews: 0 };
      this.users.set(userId, updatedUser);
      if (user.email) {
        this.usersByEmail.set(user.email, updatedUser);
      }
      if (user.auth_user_id) {
        this.usersByAuthId.set(user.auth_user_id, updatedUser);
      }
      return;
    }
    
    const averageRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    const updatedUser = { ...user, average_rating: averageRating, total_reviews: totalReviews };
    
    this.users.set(userId, updatedUser);
    if (user.email) {
      this.usersByEmail.set(user.email, updatedUser);
    }
    if (user.auth_user_id) {
      this.usersByAuthId.set(user.auth_user_id, updatedUser);
    }
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    const review = this.reviews.get(reviewId);
    if (!review) {
      return false;
    }
    
    this.reviews.delete(reviewId);
    await this.updateUserRating(review.reviewee_id);
    return true;
  }

  // Admin methods implementation
  async isAdmin(userId: string): Promise<boolean> {
    const user = this.users.get(userId);
    return user?.role === 'admin' || user?.role === 'super_admin';
  }

  async logAdminAction(log: InsertAdminLog): Promise<AdminLog> {
    const id = crypto.randomUUID();
    const adminLog: AdminLog = {
      ...log,
      id,
      created_at: new Date(),
    };
    
    this.adminLogs.set(id, adminLog);
    return adminLog;
  }

  async getAdminLogs(limit: number = 100): Promise<AdminLog[]> {
    return Array.from(this.adminLogs.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  async getUserStats(): Promise<{
    total: number;
    active: number;
    suspended: number;
    admins: number;
    newToday: number;
  }> {
    const users = Array.from(this.users.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      suspended: users.filter(u => u.status === 'suspended').length,
      admins: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
      newToday: users.filter(u => u.created_at >= today).length,
    };
  }

  async updateUserRole(userId: string, role: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser = { ...user, role };
    this.users.set(userId, updatedUser);
    
    if (user.email) {
      this.usersByEmail.set(user.email.toLowerCase(), updatedUser);
    }
    if (user.auth_user_id) {
      this.usersByAuthId.set(user.auth_user_id, updatedUser);
    }
    
    return updatedUser;
  }

  async updateUserStatus(userId: string, status: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser = { ...user, status };
    this.users.set(userId, updatedUser);
    
    if (user.email) {
      this.usersByEmail.set(user.email.toLowerCase(), updatedUser);
    }
    if (user.auth_user_id) {
      this.usersByAuthId.set(user.auth_user_id, updatedUser);
    }
    
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;

    // Remove user from all maps
    this.users.delete(userId);
    
    if (user.email) {
      this.usersByEmail.delete(user.email.toLowerCase());
    }
    
    if (user.auth_user_id) {
      this.usersByAuthId.delete(user.auth_user_id);
    }

    // Remove all reviews by this user
    const reviewsToDelete = Array.from(this.reviews.entries())
      .filter(([_, review]) => review.reviewee_id === userId)
      .map(([id, _]) => id);
    
    for (const reviewId of reviewsToDelete) {
      this.reviews.delete(reviewId);
    }

    // Remove all sessions for this user
    const sessionsToDelete = Array.from(this.sessions.entries())
      .filter(([_, session]) => session.userId === userId)
      .map(([token, _]) => token);
    
    for (const sessionToken of sessionsToDelete) {
      this.sessions.delete(sessionToken);
    }

    // Remove any recovery tokens for this user
    const tokensToDelete = Array.from(this.recoveryTokens.entries())
      .filter(([_, data]) => data.userId === userId)
      .map(([token, _]) => token);
    
    for (const token of tokensToDelete) {
      this.recoveryTokens.delete(token);
    }

    return true;
  }

  // Site settings
  async getSiteSettings(): Promise<SiteSetting[]> {
    return Array.from(this.siteSettings.values());
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    return this.siteSettings.get(key);
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSetting> {
    console.log(`Updating setting ${key} to ${value}`);
    const existing = this.siteSettings.get(key);
    const setting: SiteSetting = {
      id: existing?.id || crypto.randomUUID(),
      key,
      value,
      type: existing?.type || 'text',
      description: existing?.description || null,
      created_at: existing?.created_at || new Date(),
      updated_at: new Date(),
      updated_by: null,
    };
    
    this.siteSettings.set(key, setting);
    console.log(`Setting ${key} updated successfully`);
    return setting;
  }

  // Analytics
  async getAnalytics(days: number = 30): Promise<SiteAnalytics[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return Array.from(this.analytics.values())
      .filter(a => new Date(a.date) >= startDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async recordAnalytics(data: InsertAnalytics): Promise<void> {
    const id = crypto.randomUUID();
    const analytics: SiteAnalytics = {
      ...data,
      id,
      created_at: new Date(),
    };
    
    this.analytics.set(id, analytics);
  }

  // Feedback methods
  async createFeedback(feedback: InsertFeedback): Promise<Feedback> {
    const id = crypto.randomUUID();
    const newFeedback: Feedback = {
      id,
      ...feedback,
      is_read: false,
      created_at: new Date(),
    };

    this.feedbackMessages.set(id, newFeedback);
    return newFeedback;
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedbackMessages.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getFeedbackByCategory(category: string): Promise<Feedback[]> {
    return Array.from(this.feedbackMessages.values())
      .filter(f => f.category === category)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async markFeedbackAsRead(feedbackId: string): Promise<boolean> {
    const feedback = this.feedbackMessages.get(feedbackId);
    if (!feedback) return false;

    const updatedFeedback = { ...feedback, is_read: true };
    this.feedbackMessages.set(feedbackId, updatedFeedback);
    return true;
  }

  async deleteFeedback(feedbackId: string): Promise<boolean> {
    return this.feedbackMessages.delete(feedbackId);
  }

  async getUnreadFeedbackCount(): Promise<number> {
    return Array.from(this.feedbackMessages.values())
      .filter(f => !f.is_read).length;
  }
}

// Database storage implementation
class DatabaseStorage implements IStorage {
  private db: any;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const connection = neon(databaseUrl);
      this.db = drizzle(connection);
    } else {
      console.warn("DATABASE_URL not found, using in-memory storage");
      this.db = null;
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.select().from(users).where(eq(users.email, email));
      return result[0];
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return undefined;
    }
  }

  async getUserByAuthId(authId: string): Promise<User | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db.select().from(users).where(eq(users.auth_user_id, authId));
      return result[0];
    } catch (error) {
      console.error("Error fetching user by auth ID:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser & { auth_user_id?: string }): Promise<User> {
    if (!this.db) {
      throw new Error("Database not available");
    }
    try {
      const result = await this.db.insert(users).values({
        ...insertUser,
        profile_url: insertUser.profile_url || null,
        auth_user_id: insertUser.auth_user_id || null,
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, updateUser: UpdateUser): Promise<User | undefined> {
    if (!this.db) return undefined;
    try {
      const result = await this.db
        .update(users)
        .set(updateUser)
        .where(eq(users.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!this.db) return false;
    try {
      const result = await this.db.delete(users).where(eq(users.id, id));
      return result.count > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // Authentication methods for DatabaseStorage
  async authenticateUser(email: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
    if (!this.db) return null;
    try {
      const user = await this.getUserByEmail(email);
      if (!user || !user.password) return null;
      
      const bcrypt = await import('bcrypt');
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return null;
      
      const sessionToken = crypto.randomUUID();
      return { user, sessionToken };
    } catch (error) {
      console.error("Error authenticating user:", error);
      return null;
    }
  }

  async authenticateUserByName(firstName: string, lastName: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
    if (!this.db) return null;
    try {
      // Find user by first and last name
      const result = await this.db.select().from(users).where(
        and(
          eq(users.first_name, firstName),
          eq(users.last_name, lastName)
        )
      );
      
      const user = result[0];
      if (!user || !user.password) return null;
      
      const bcrypt = await import('bcrypt');
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return null;
      
      const sessionToken = crypto.randomUUID();
      return { user, sessionToken };
    } catch (error) {
      console.error("Error authenticating user by name:", error);
      return null;
    }
  }

  async createUserWithAuth(userData: InsertUser): Promise<{ user: User; sessionToken: string }> {
    if (!this.db) throw new Error('Database not available');
    try {
      // Hash password
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash(userData.password || '', 12);
      
      const userToCreate = {
        ...userData,
        password: hashedPassword,
        id: crypto.randomUUID(),
        created_at: new Date(),
        average_rating: 0,
        total_reviews: 0
      };
      
      const user = await this.createUser(userToCreate);
      const sessionToken = crypto.randomUUID();
      
      return { user, sessionToken };
    } catch (error) {
      console.error("Error creating user with auth:", error);
      throw error;
    }
  }

  async validateSession(sessionToken: string): Promise<User | null> {
    // For DatabaseStorage, we'll need to implement session storage
    // For now, return null to force re-authentication
    return null;
  }

  async logout(sessionToken: string): Promise<boolean> {
    // For DatabaseStorage, we'll need to implement session storage
    return true;
  }

  async searchUsers(filters: {
    lat?: number;
    lng?: number;
    province?: string;
    municipality?: string;
    neighborhood?: string;
    service?: string;
    contract_type?: string;
  }): Promise<User[]> {
    if (!this.db) return [];
    try {
      let query = this.db.select().from(users);
      
      if (filters.province) {
        query = query.where(ilike(users.province, `%${filters.province}%`));
      }
      if (filters.municipality) {
        query = query.where(ilike(users.municipality, `%${filters.municipality}%`));
      }
      if (filters.neighborhood) {
        query = query.where(ilike(users.neighborhood, `%${filters.neighborhood}%`));
      }
      if (filters.contract_type) {
        query = query.where(eq(users.contract_type, filters.contract_type));
      }
      
      const result = await query;
      
      // Filter by service if provided
      if (filters.service) {
        return result.filter((user: User) => 
          user.services.some((service: string) => 
            service.toLowerCase().includes(filters.service!.toLowerCase())
          )
        );
      }
      
      return result;
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.db) return [];
    try {
      const result = await this.db.select().from(users);
      return result;
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  }

  // Review methods for database storage
  async createReview(insertReview: InsertReview): Promise<Review> {
    if (!this.db) {
      throw new Error("Database not available");
    }
    try {
      const result = await this.db.insert(reviews).values(insertReview).returning();
      const review = result[0];
      
      // Update user rating
      await this.updateUserRating(insertReview.reviewee_id);
      
      return review;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  async getReviewsForUser(userId: string): Promise<Review[]> {
    if (!this.db) return [];
    try {
      const result = await this.db
        .select()
        .from(reviews)
        .where(eq(reviews.reviewee_id, userId))
        .orderBy(desc(reviews.created_at));
      return result;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  }

  async updateUserRating(userId: string): Promise<void> {
    if (!this.db) return;
    try {
      const userReviews = await this.getReviewsForUser(userId);
      const totalReviews = userReviews.length;
      
      if (totalReviews === 0) {
        await this.db
          .update(users)
          .set({ average_rating: 0, total_reviews: 0 })
          .where(eq(users.id, userId));
        return;
      }
      
      const averageRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
      
      await this.db
        .update(users)
        .set({ average_rating: averageRating, total_reviews: totalReviews })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error("Error updating user rating:", error);
    }
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    if (!this.db) return false;
    try {
      const reviewToDelete = await this.db
        .select()
        .from(reviews)
        .where(eq(reviews.id, reviewId))
        .limit(1);
      
      if (reviewToDelete.length === 0) {
        return false;
      }
      
      const result = await this.db.delete(reviews).where(eq(reviews.id, reviewId));
      
      // Update user rating after deletion
      await this.updateUserRating(reviewToDelete[0].reviewee_id);
      
      return result.count > 0;
    } catch (error) {
      console.error("Error deleting review:", error);
      return false;
    }
  }

  // Feedback methods for DatabaseStorage
  async createFeedback(feedback: InsertFeedback): Promise<Feedback> {
    if (!this.db) {
      throw new Error("Database not available");
    }
    try {
      const result = await this.db.insert(feedback).values(feedback).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating feedback:", error);
      throw error;
    }
  }

  async getAllFeedback(): Promise<Feedback[]> {
    if (!this.db) return [];
    try {
      const result = await this.db
        .select()
        .from(feedback)
        .orderBy(desc(feedback.created_at));
      return result;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return [];
    }
  }

  async getFeedbackByCategory(category: string): Promise<Feedback[]> {
    if (!this.db) return [];
    try {
      const result = await this.db
        .select()
        .from(feedback)
        .where(eq(feedback.category, category))
        .orderBy(desc(feedback.created_at));
      return result;
    } catch (error) {
      console.error("Error fetching feedback by category:", error);
      return [];
    }
  }

  async markFeedbackAsRead(feedbackId: string): Promise<boolean> {
    if (!this.db) return false;
    try {
      const result = await this.db
        .update(feedback)
        .set({ is_read: true })
        .where(eq(feedback.id, feedbackId));
      return result.count > 0;
    } catch (error) {
      console.error("Error marking feedback as read:", error);
      return false;
    }
  }

  async deleteFeedback(feedbackId: string): Promise<boolean> {
    if (!this.db) return false;
    try {
      const result = await this.db.delete(feedback).where(eq(feedback.id, feedbackId));
      return result.count > 0;
    } catch (error) {
      console.error("Error deleting feedback:", error);
      return false;
    }
  }

  async getUnreadFeedbackCount(): Promise<number> {
    if (!this.db) return 0;
    try {
      const result = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(feedback)
        .where(eq(feedback.is_read, false));
      return result[0]?.count || 0;
    } catch (error) {
      console.error("Error counting unread feedback:", error);
      return 0;
    }
  }
}

// Replit environment has connectivity issues with Supabase - using MemStorage
export const storage = new MemStorage();

console.log('Using MemStorage - ambiente Replit não consegue conectar ao Supabase');
console.log('Solução: Deploy noutra plataforma ou aguardar resolução do problema de conectividade');
