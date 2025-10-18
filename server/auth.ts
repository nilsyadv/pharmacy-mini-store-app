import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { User } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    role?: 'admin' | 'employee';
  }
}

export async function login(username: string, password: string): Promise<User | null> {
  const user = await storage.getUserByUsername(username);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Verify user still exists and is active
  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      // User was deleted, invalidate session
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.error("Error validating user session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Verify user still exists and has admin role
  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
  } catch (error) {
    console.error("Error validating admin session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function requireAdminOrEmployee(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Verify user still exists and has appropriate role
  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.role !== 'admin' && user.role !== 'employee') {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (error) {
    console.error("Error validating user session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
