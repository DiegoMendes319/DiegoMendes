import { users, type User, type InsertUser, type UpdateUser } from "@shared/schema";
import { eq, and, ilike, or, sql } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private usersByEmail: Map<string, User>;
  private usersByAuthId: Map<string, User>;

  constructor() {
    this.users = new Map();
    this.usersByEmail = new Map();
    this.usersByAuthId = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleUsers = [
      {
        id: "1",
        name: "Maria Santos",
        email: "maria.santos@email.com",
        phone: "+244 923 456 789",
        age: 32,
        province: "luanda",
        municipality: "ingombota",
        neighborhood: "maianga",
        contract_type: "mensal",
        services: ["limpeza", "cozinha", "lavanderia"],
        availability: "Segunda a Sexta, 8h às 17h",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        created_at: new Date("2024-01-15"),
        auth_user_id: null
      },
      {
        id: "2",
        name: "Ana Rodrigues",
        email: "ana.rodrigues@email.com",
        phone: "+244 912 345 678",
        age: 28,
        province: "luanda",
        municipality: "maianga",
        neighborhood: "rangel",
        contract_type: "diarista",
        services: ["limpeza", "jardinagem"],
        availability: "Terça e Quinta, 9h às 16h",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
        created_at: new Date("2024-02-20"),
        auth_user_id: null
      },
      {
        id: "3",
        name: "João Silva",
        email: "joao.silva@email.com",
        phone: "+244 934 567 890",
        age: 35,
        province: "benguela",
        municipality: "benguela",
        neighborhood: "centro",
        contract_type: "escrito",
        services: ["jardinagem", "limpeza"],
        availability: "Segunda a Sábado, 7h às 15h",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
        created_at: new Date("2024-01-10"),
        auth_user_id: null
      },
      {
        id: "4",
        name: "Carmen Ferreira",
        email: "carmen.ferreira@email.com",
        phone: "+244 945 678 901",
        age: 29,
        province: "luanda",
        municipality: "kilamba_kiaxi",
        neighborhood: "kilamba",
        contract_type: "mensal",
        services: ["cozinha", "cuidados", "limpeza"],
        availability: "Segunda a Sexta, 8h às 18h",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carmen",
        created_at: new Date("2024-03-05"),
        auth_user_id: null
      },
      {
        id: "5",
        name: "Pedro Costa",
        email: "pedro.costa@email.com",
        phone: "+244 956 789 012",
        age: 31,
        province: "huambo",
        municipality: "huambo",
        neighborhood: "centro",
        contract_type: "verbal",
        services: ["jardinagem", "limpeza"],
        availability: "Disponível fins de semana",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
        created_at: new Date("2024-02-28"),
        auth_user_id: null
      },
      {
        id: "6",
        name: "Lucia Mendes",
        email: "lucia.mendes@email.com",
        phone: "+244 967 890 123",
        age: 26,
        province: "luanda",
        municipality: "samba",
        neighborhood: "sambizanga",
        contract_type: "diarista",
        services: ["lavanderia", "cozinha"],
        availability: "Flexível, contactar por telefone",
        profile_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucia",
        created_at: new Date("2024-01-25"),
        auth_user_id: null
      }
    ];

    sampleUsers.forEach(user => {
      this.users.set(user.id, user as User);
      this.usersByEmail.set(user.email, user as User);
    });
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
    };
    
    this.users.set(id, user);
    this.usersByEmail.set(user.email, user);
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
    if (updateUser.email && updateUser.email !== existingUser.email) {
      this.usersByEmail.delete(existingUser.email);
    }

    const updatedUser: User = {
      ...existingUser,
      ...updateUser,
    };

    this.users.set(id, updatedUser);
    this.usersByEmail.set(updatedUser.email, updatedUser);
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
    this.usersByEmail.delete(user.email);
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
export const storage = new MemStorage();
