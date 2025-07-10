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
