import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, updateUserSchema } from "@shared/schema";
import { z } from "zod";

const searchFiltersSchema = z.object({
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  province: z.string().optional(),
  municipality: z.string().optional(),
  neighborhood: z.string().optional(),
  service: z.string().optional(),
  contract_type: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email e palavra-passe são obrigatórios" });
      }

      const result = await storage.authenticateUser(email, password);
      
      if (!result) {
        return res.status(401).json({ error: "Email ou palavra-passe inválidos" });
      }

      // Set session cookie
      res.cookie('session_token', result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        message: "Login realizado com sucesso",
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          first_name: result.user.first_name,
          last_name: result.user.last_name
        },
        sessionToken: result.sessionToken
      });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Erro interno do servidor" 
      });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = req.body;
      
      // Validate required fields
      const requiredFields = ['first_name', 'last_name', 'phone', 'date_of_birth', 'province', 'municipality', 'neighborhood', 'contract_type', 'services', 'availability'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: "Campos obrigatórios em falta", 
          missing: missingFields 
        });
      }

      // Check age requirement
      const birthDate = new Date(userData.date_of_birth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        return res.status(400).json({ error: "Deve ter pelo menos 18 anos" });
      }

      const result = await storage.createUserWithAuth(userData);

      // Set session cookie
      res.cookie('session_token', result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(201).json({
        message: "Registo realizado com sucesso",
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          first_name: result.user.first_name,
          last_name: result.user.last_name
        },
        sessionToken: result.sessionToken
      });
    } catch (error) {
      if (error.message === 'Email já está em uso') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Erro interno do servidor" 
      });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionToken = req.cookies?.session_token;
      
      if (sessionToken) {
        await storage.logout(sessionToken);
      }

      res.clearCookie('session_token');
      res.json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Erro interno do servidor" 
      });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const sessionToken = req.cookies?.session_token;
      
      if (!sessionToken) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const user = await storage.validateSession(sessionToken);
      
      if (!user) {
        res.clearCookie('session_token');
        return res.status(401).json({ error: "Sessão inválida" });
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        first_name: user.first_name,
        last_name: user.last_name
      });
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Erro interno do servidor" 
      });
    }
  });

  // Get all users or search with filters
  app.get("/api/users", async (req, res) => {
    try {
      const filters = searchFiltersSchema.parse(req.query);
      
      if (Object.keys(filters).length === 0) {
        const users = await storage.getAllUsers();
        res.json(users);
      } else {
        const users = await storage.searchUsers(filters);
        res.json(users);
      }
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid search parameters",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Create new user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid user data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Update user
  app.put("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userData = updateUserSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid user data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete user
  app.delete("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get user by email
  app.get("/api/users/by-email/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Upload profile photo endpoint (mock implementation)
  app.post("/api/upload-photo", async (req, res) => {
    try {
      // TODO: Implement actual file upload to Supabase Storage
      // For now, return a mock URL
      const mockUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
      res.json({ url: mockUrl });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to upload photo",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
