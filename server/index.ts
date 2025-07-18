import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Maintenance mode middleware
app.use(async (req, res, next) => {
  // Skip maintenance check for API routes, admin routes, and static assets
  if (req.path.startsWith('/api') || req.path.startsWith('/@') || req.path.startsWith('/src') || req.path.includes('.')) {
    return next();
  }

  try {
    const maintenanceSetting = await storage.getSiteSetting('maintenance_mode');
    const isMaintenanceMode = maintenanceSetting?.value === 'true';
    
    if (isMaintenanceMode) {
      // Allow access to admin login page
      if (req.path === '/admin-login') {
        return next();
      }
      
      // Check if user is admin
      const sessionToken = req.cookies?.session_token;
      if (sessionToken) {
        const user = await storage.validateSession(sessionToken);
        if (user) {
          const isAdmin = await storage.isAdmin(user.id);
          if (isAdmin) {
            return next(); // Allow admin access
          }
        }
      }
      
      // Redirect to maintenance page for non-admin users
      if (req.path !== '/maintenance') {
        return res.redirect('/maintenance');
      }
    }
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
  }
  
  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const PORT = process.env.PORT
      ? Number(process.env.PORT)
      : 5000;

// Não passe o '0.0.0.0' como segundo argumento.
// Apenas deixe o listen usar o host padrão do Node.
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });

})();
