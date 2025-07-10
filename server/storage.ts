import { users, type User, type InsertUser, type UpdateUser } from "@shared/schema";
import { eq, and, ilike, or, sql } from "drizzle-orm";
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
  createUserWithAuth(userData: InsertUser): Promise<{ user: User; sessionToken: string }>;
  validateSession(sessionToken: string): Promise<User | null>;
  logout(sessionToken: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private usersByEmail: Map<string, User>;
  private usersByAuthId: Map<string, User>;
  private sessions: Map<string, { userId: string; expiresAt: Date }>;

  constructor() {
    this.users = new Map();
    this.usersByEmail = new Map();
    this.usersByAuthId = new Map();
    this.sessions = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Remove sample data - use only real registrations
    const sampleUsers: any[] = [
      {
        id: "1",
        first_name: "Maria",
        last_name: "Santos",
        email: "maria.santos@email.com",
        phone: "+244 923 456 789",
        date_of_birth: new Date("1992-05-15"),
        province: "luanda",
        municipality: "ingombota",
        neighborhood: "maianga",
        address_complement: "Prédio A, Apartamento 3B",
        contract_type: "mensal",
        services: ["limpeza", "cozinha", "lavanderia"],
        availability: "Segunda a Sexta, 8h às 17h",
        about_me: "Profissional dedicada com 10 anos de experiência em serviços domésticos. Especializada em limpeza profunda e organização.",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        facebook_url: "https://facebook.com/maria.santos",
        instagram_url: "https://instagram.com/maria_santos_domestica",
        tiktok_url: null,
        password: null,
        created_at: new Date("2024-01-15"),
        auth_user_id: null,
        // Computed fields
        name: "Maria Santos",
        age: 32
      },
      {
        id: "2",
        first_name: "Ana",
        last_name: "Rodrigues",
        email: "ana.rodrigues@email.com",
        phone: "+244 912 345 678",
        date_of_birth: new Date("1996-08-22"),
        province: "luanda",
        municipality: "maianga",
        neighborhood: "rangel",
        address_complement: "Casa 15, Rua da Paz",
        contract_type: "diarista",
        services: ["limpeza", "jardinagem"],
        availability: "Terça e Quinta, 9h às 16h",
        about_me: "Jovem profissional com experiência em jardinagem e limpeza. Trabalhei em várias casas da região.",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
        facebook_url: null,
        instagram_url: "https://instagram.com/ana_jardins",
        tiktok_url: "https://tiktok.com/@ana_domestica",
        password: null, // OAuth user or email auth
        created_at: new Date("2024-02-20"),
        auth_user_id: null,
        // Computed fields
        name: "Ana Rodrigues",
        age: 28
      },
      {
        id: "3",
        first_name: "João",
        last_name: "Silva",
        email: "joao.silva@email.com",
        phone: "+244 934 567 890",
        date_of_birth: new Date("1989-03-10"),
        province: "benguela",
        municipality: "benguela",
        neighborhood: "centro",
        address_complement: null,
        contract_type: "escrito",
        services: ["jardinagem", "limpeza"],
        availability: "Segunda a Sábado, 7h às 15h",
        about_me: "Especialista em jardinagem e manutenção de espaços verdes. Tenho conhecimento em plantas tropicais.",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
        facebook_url: "https://facebook.com/joao.silva.jardins",
        instagram_url: null,
        tiktok_url: null,
        password: null,
        created_at: new Date("2024-01-10"),
        auth_user_id: null,
        // Computed fields
        name: "João Silva",
        age: 35
      },
      {
        id: "4",
        first_name: "Carmen",
        last_name: "Ferreira",
        email: "carmen.ferreira@email.com",
        phone: "+244 945 678 901",
        date_of_birth: new Date("1995-11-30"),
        province: "luanda",
        municipality: "kilamba_kiaxi",
        neighborhood: "kilamba",
        address_complement: "Condomínio Kilamba, Bloco 15",
        contract_type: "mensal",
        services: ["cozinha", "cuidados", "limpeza"],
        availability: "Segunda a Sexta, 8h às 18h",
        about_me: "Cozinheira experiente que também cuida de idosos. Especializada em culinária angolana e internacional.",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carmen",
        facebook_url: null,
        instagram_url: "https://instagram.com/carmen_cozinha",
        tiktok_url: "https://tiktok.com/@carmen_receitas",
        password: null,
        created_at: new Date("2024-03-05"),
        auth_user_id: null,
        // Computed fields
        name: "Carmen Ferreira",
        age: 29
      },
      {
        id: "5",
        first_name: "Pedro",
        last_name: "Costa",
        email: "pedro.costa@email.com",
        phone: "+244 956 789 012",
        date_of_birth: new Date("1993-07-18"),
        province: "huambo",
        municipality: "huambo",
        neighborhood: "centro",
        address_complement: null,
        contract_type: "verbal",
        services: ["jardinagem", "limpeza"],
        availability: "Disponível fins de semana",
        about_me: "Trabalho principalmente nos fins de semana. Tenho experiência em manutenção de jardins e limpeza geral.",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
        facebook_url: "https://facebook.com/pedro.costa.huambo",
        instagram_url: null,
        tiktok_url: null,
        password: null,
        created_at: new Date("2024-02-28"),
        auth_user_id: null,
        // Computed fields
        name: "Pedro Costa",
        age: 31
      },
      {
        id: "6",
        first_name: "Lucia",
        last_name: "Mendes",
        email: "lucia.mendes@email.com",
        phone: "+244 967 890 123",
        date_of_birth: new Date("1998-09-05"),
        province: "luanda",
        municipality: "sambizanga",
        neighborhood: "sambizanga",
        address_complement: "Rua 20, Casa 8",
        contract_type: "diarista",
        services: ["lavanderia", "cozinha"],
        availability: "Flexível, contactar por telefone",
        about_me: "Jovem e dedicada, especializada em lavanderia e cozinha. Sempre disponível para ajudar as famílias.",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucia",
        facebook_url: null,
        instagram_url: "https://instagram.com/lucia_lavanderia",
        tiktok_url: null,
        password: null,
        created_at: new Date("2024-01-25"),
        auth_user_id: null,
        // Computed fields
        name: "Lucia Mendes",
        age: 26
      }
    ];

    // Comment out sample data initialization - only real users
    // sampleUsers.forEach(user => {
    //   this.users.set(user.id, user as User);
    //   if (user.email) {
    //     this.usersByEmail.set(user.email, user as User);
    //   }
    // });
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
    const user: User = {
      ...insertUser,
      id,
      created_at: new Date(),
      profile_url: insertUser.profile_url || null,
      auth_user_id: insertUser.auth_user_id || null,
      email: insertUser.email || null,
      date_of_birth: new Date(insertUser.date_of_birth),
      address_complement: insertUser.address_complement || null,
      about_me: insertUser.about_me || null,
      facebook_url: insertUser.facebook_url || null,
      instagram_url: insertUser.instagram_url || null,
      tiktok_url: insertUser.tiktok_url || null,
      password: insertUser.password || null,
      // Computed fields
      name: `${insertUser.first_name} ${insertUser.last_name}`,
      age: new Date().getFullYear() - new Date(insertUser.date_of_birth).getFullYear(),
    };
    
    this.users.set(id, user);
    if (user.email) {
      this.usersByEmail.set(user.email, user);
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

    const updatedUser: User = {
      ...existingUser,
      ...updateUser,
      // Update computed fields if names change
      name: updateUser.first_name || updateUser.last_name 
        ? `${updateUser.first_name || existingUser.first_name} ${updateUser.last_name || existingUser.last_name}`
        : existingUser.name,
      age: updateUser.date_of_birth 
        ? new Date().getFullYear() - new Date(updateUser.date_of_birth).getFullYear()
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
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  // Generate session token
  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Authentication methods
  async authenticateUser(email: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
    const user = this.usersByEmail.get(email.toLowerCase());
    
    if (!user || !user.password) {
      return null;
    }

    const isValidPassword = await this.verifyPassword(password, user.password);
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

  private cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [token, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(token);
      }
    }
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
}

// Initialize storage - using in-memory storage with sample data for now
// TODO: Switch to DatabaseStorage when DATABASE_URL is properly configured
// Use in-memory storage for now since database connection is failing
export const storage = new MemStorage();
