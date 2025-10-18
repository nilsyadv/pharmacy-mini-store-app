import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase, getConnection } from "./db";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
if (!process.env.SESSION_SECRET) {
  console.error("FATAL: SESSION_SECRET environment variable is required");
  process.exit(1);
}

const MySQLStore = MySQLStoreFactory(session);

async function startServer() {
  const app = express();

  // Trust proxy for production deployments
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Initialize database first
  let sessionStore;
  try {
    await initializeDatabase();
    log("Database initialized successfully");
    
    // Configure MySQL session store with the connection pool
    const pool = await getConnection();
    sessionStore = new MySQLStore({}, pool as any);
  } catch (error) {
    console.error("Error initializing database:", error);
    
    // In production, fail fast - don't run without persistent sessions
    if (process.env.NODE_ENV === "production") {
      console.error("FATAL: Cannot start in production without database");
      process.exit(1);
    }
    
    log("Warning: Database initialization failed. Using memory-based sessions (DEVELOPMENT ONLY).");
    // sessionStore will be undefined, fallback to default memory store
  }

  // Configure session middleware BEFORE any routes
  app.use(
    session({
      name: "pharmacy_session",
      secret: process.env.SESSION_SECRET!,
      store: sessionStore, // undefined means use default MemoryStore
      resave: false,
      saveUninitialized: false,
      proxy: process.env.NODE_ENV === "production",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      },
    })
  );

  // Request logging middleware
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

  // Register API routes
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite in development or serve static files in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start the server
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});
