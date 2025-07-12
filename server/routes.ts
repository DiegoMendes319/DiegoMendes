import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, updateUserSchema, insertReviewSchema } from "@shared/schema";
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

  // Simple login endpoint (name + password)
  app.post("/api/auth/simple-login", async (req, res) => {
    try {
      const { first_name, last_name, password } = req.body;
      
      if (!first_name || !last_name || !password) {
        return res.status(400).json({ error: "Nome e palavra-passe são obrigatórios" });
      }

      // Use the new direct authentication method
      const result = await storage.authenticateUserByName(first_name, last_name, password);
      
      if (!result) {
        return res.status(401).json({ error: "Nome ou palavra-passe incorrectos" });
      }

      // Set session cookie
      res.cookie('session_token', result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        message: "Login simples realizado com sucesso",
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

  // Simple register endpoint (name + password + basic info)
  app.post("/api/auth/simple-register", async (req, res) => {
    try {
      const { first_name, last_name, password } = req.body;
      
      if (!first_name || !last_name || !password) {
        return res.status(400).json({ error: "Nome e palavra-passe são obrigatórios" });
      }

      // Create temporary email for simple registration
      const tempEmail = `${first_name.toLowerCase()}.${last_name.toLowerCase()}@temp.com`;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(tempEmail);
      if (existingUser) {
        return res.status(409).json({ error: "Utilizador já existe" });
      }

      // Create user with minimal required data
      const userData = {
        first_name,
        last_name,
        email: tempEmail,
        password,
        phone: "900000000", // Default phone
        date_of_birth: "1990-01-01", // Default birth date
        province: "Luanda", // Default province
        municipality: "Luanda", // Default municipality
        neighborhood: "Centro", // Default neighborhood
        contract_type: "diarista", // Default contract type
        services: ["limpeza"], // Default service
        availability: "Disponível" // Default availability
      };

      const result = await storage.createUserWithAuth(userData);

      // Set session cookie
      res.cookie('session_token', result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(201).json({
        message: "Registo simples realizado com sucesso",
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

  // Supabase configuration endpoint
  app.get("/api/config/supabase", (req, res) => {
    res.json({
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_ANON_KEY
    });
  });

  // Get all users or search with filters
  app.get("/api/users", async (req, res) => {
    try {
      const filters = searchFiltersSchema.parse(req.query);
      
      let users;
      if (Object.keys(filters).length === 0) {
        users = await storage.getAllUsers();
      } else {
        users = await storage.searchUsers(filters);
      }
      
      // Remove passwords from response for security
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid search parameters",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Tutorial endpoints
  app.post("/api/tutorial/start", async (req, res) => {
    try {
      const user = storage.addTutorialUser();
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error starting tutorial:", error);
      res.status(500).json({ error: "Erro ao iniciar tutorial" });
    }
  });

  app.post("/api/tutorial/end", async (req, res) => {
    try {
      storage.removeTutorialUser();
      res.json({ success: true });
    } catch (error) {
      console.error("Error ending tutorial:", error);
      res.status(500).json({ error: "Erro ao terminar tutorial" });
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
      
      // Remove password from response for security
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
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
      let userData = req.body;
      
      // Convert date_of_birth from YYYY-MM-DD to Date if provided
      if (userData.date_of_birth && typeof userData.date_of_birth === 'string') {
        try {
          userData.date_of_birth = new Date(userData.date_of_birth);
        } catch (error) {
          return res.status(400).json({ 
            error: "Formato de data inválido. Use YYYY-MM-DD" 
          });
        }
      }
      
      // Remove empty string URLs
      ['facebook_url', 'instagram_url', 'tiktok_url'].forEach(field => {
        if (userData[field] === '') {
          userData[field] = null;
        }
      });
      
      // Validate with schema (skip strict parsing for flexibility)
      const updatedUser = await storage.updateUser(id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({ 
        error: "Erro ao actualizar perfil",
        details: error.message
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

  // Review endpoints
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid review data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/reviews", async (req, res) => {
    try {
      const { reviewee_id } = req.query;
      
      if (!reviewee_id || typeof reviewee_id !== 'string') {
        return res.status(400).json({ message: "reviewee_id is required" });
      }
      
      const reviews = await storage.getReviewsForUser(reviewee_id);
      
      // Add reviewer info to each review
      const reviewsWithReviewers = await Promise.all(
        reviews.map(async (review) => {
          const reviewer = await storage.getUser(review.reviewer_id);
          
          // If reviewer not found but has temp ID, extract name from ID
          if (!reviewer && review.reviewer_id.startsWith('temp_')) {
            const idParts = review.reviewer_id.split('_');
            if (idParts.length >= 3) {
              const firstName = idParts[1];
              const lastName = idParts[2];
              return {
                ...review,
                reviewer: {
                  id: review.reviewer_id,
                  name: `${firstName} ${lastName}`,
                  first_name: firstName,
                  last_name: lastName,
                  profile_url: null
                }
              };
            }
          }
          
          return {
            ...review,
            reviewer: reviewer ? {
              id: reviewer.id,
              name: reviewer.name,
              first_name: reviewer.first_name,
              last_name: reviewer.last_name,
              profile_url: reviewer.profile_url
            } : {
              id: review.reviewer_id,
              name: 'Utilizador',
              first_name: 'Utilizador',
              last_name: '',
              profile_url: null
            }
          };
        })
      );
      
      res.json(reviewsWithReviewers);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch reviews",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteReview(id);
      
      if (!success) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to delete review",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const sessionToken = req.cookies?.session_token;
      if (!sessionToken) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const user = await storage.validateSession(sessionToken);
      if (!user) {
        return res.status(401).json({ error: "Sessão inválida" });
      }

      const isAdmin = await storage.isAdmin(user.id);
      if (!isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      const sessionToken = req.cookies?.session_token;
      if (!sessionToken) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const user = await storage.validateSession(sessionToken);
      if (!user) {
        return res.status(401).json({ error: "Sessão inválida" });
      }

      const isAdmin = await storage.isAdmin(user.id);
      if (!isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.patch("/api/admin/users/:id/role", async (req, res) => {
    try {
      const sessionToken = req.cookies?.session_token;
      if (!sessionToken) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const user = await storage.validateSession(sessionToken);
      if (!user) {
        return res.status(401).json({ error: "Sessão inválida" });
      }

      const isAdmin = await storage.isAdmin(user.id);
      if (!isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const { id } = req.params;
      const { role } = req.body;

      if (!role || !['user', 'admin', 'super_admin'].includes(role)) {
        return res.status(400).json({ error: "Papel inválido" });
      }

      const updatedUser = await storage.updateUserRole(id, role);
      if (!updatedUser) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      // Log admin action
      await storage.logAdminAction({
        admin_id: user.id,
        action: 'update_user_role',
        target_type: 'user',
        target_id: id,
        details: JSON.stringify({ from: updatedUser.role, to: role }),
        ip_address: req.ip,
        user_agent: req.headers['user-agent'] || null,
      });

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.patch("/api/admin/users/:id/status", async (req, res) => {
    try {
      const sessionToken = req.cookies?.session_token;
      if (!sessionToken) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const user = await storage.validateSession(sessionToken);
      if (!user) {
        return res.status(401).json({ error: "Sessão inválida" });
      }

      const isAdmin = await storage.isAdmin(user.id);
      if (!isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'suspended', 'inactive'].includes(status)) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const updatedUser = await storage.updateUserStatus(id, status);
      if (!updatedUser) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
      }

      // Log admin action
      await storage.logAdminAction({
        admin_id: user.id,
        action: 'update_user_status',
        target_type: 'user',
        target_id: id,
        details: JSON.stringify({ from: updatedUser.status, to: status }),
        ip_address: req.ip,
        user_agent: req.headers['user-agent'] || null,
      });

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.get("/api/admin/logs", async (req, res) => {
    try {
      const sessionToken = req.cookies?.session_token;
      if (!sessionToken) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const user = await storage.validateSession(sessionToken);
      if (!user) {
        return res.status(401).json({ error: "Sessão inválida" });
      }

      const isAdmin = await storage.isAdmin(user.id);
      if (!isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const logs = await storage.getAdminLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.get("/api/admin/settings", async (req, res) => {
    try {
      const sessionToken = req.cookies?.session_token;
      if (!sessionToken) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const user = await storage.validateSession(sessionToken);
      if (!user) {
        return res.status(401).json({ error: "Sessão inválida" });
      }

      const isAdmin = await storage.isAdmin(user.id);
      if (!isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.patch("/api/admin/settings/:key", async (req, res) => {
    try {
      const sessionToken = req.cookies?.session_token;
      if (!sessionToken) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const user = await storage.validateSession(sessionToken);
      if (!user) {
        return res.status(401).json({ error: "Sessão inválida" });
      }

      const isAdmin = await storage.isAdmin(user.id);
      if (!isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const { key } = req.params;
      const { value } = req.body;

      if (!value) {
        return res.status(400).json({ error: "Valor é obrigatório" });
      }

      const setting = await storage.updateSiteSetting(key, value);
      
      // Log admin action
      await storage.logAdminAction({
        admin_id: user.id,
        action: 'update_site_setting',
        target_type: 'system',
        target_id: key,
        details: JSON.stringify({ key, value }),
        ip_address: req.ip,
        user_agent: req.headers['user-agent'] || null,
      });

      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const sessionToken = req.cookies?.session_token;
      if (!sessionToken) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const user = await storage.validateSession(sessionToken);
      if (!user) {
        return res.status(401).json({ error: "Sessão inválida" });
      }

      const isAdmin = await storage.isAdmin(user.id);
      if (!isAdmin) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const analytics = await storage.getAnalytics(days);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Maintenance mode check endpoint
  app.get("/api/maintenance-mode", async (req, res) => {
    try {
      const maintenanceSetting = await storage.getSiteSetting('maintenance_mode');
      const isEnabled = maintenanceSetting?.value === 'true';
      res.json({ enabled: isEnabled });
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
      res.json({ enabled: false });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
