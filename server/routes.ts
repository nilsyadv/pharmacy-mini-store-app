import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { login, requireAuth, requireAdmin, requireAdminOrEmployee } from "./auth";
import { generateInvoicePDF, generateSalesReportPDF } from "./reports";
import { parsePDF, importMedicinesFromPDF, type PDFFieldMapping } from "./pdf-import";
import { createDatabaseBackup, exportBackupAsJSON } from "./backup";
import { 
  loginSchema,
  insertUserSchema, 
  insertMedicineSchema, 
  insertSaleSchema, 
  insertCustomerSchema 
} from "@shared/schema";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await login(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.role = user.role;
      
      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      // Don't expose internal errors to client
      console.error("Login error:", error);
      res.status(500).json({ message: "An error occurred during login. Please try again later." });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User management routes (Admin only)
  app.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({
        id: u.id,
        username: u.username,
        role: u.role,
        created_at: u.created_at,
      })));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Customer routes (Admin and Employee can view, only Admin can create/update/delete)
  app.get("/api/customers", requireAdminOrEmployee, async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/customers/search/:query", requireAdminOrEmployee, async (req, res) => {
    try {
      const customers = await storage.searchCustomers(req.params.query);
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/customers/:id", requireAdminOrEmployee, async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/customers/:id/purchases", requireAdminOrEmployee, async (req, res) => {
    try {
      const purchases = await storage.getCustomerPurchaseHistory(req.params.id);
      res.json(purchases);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/customers", requireAdmin, async (req, res) => {
    try {
      const data = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(data);
      res.json(customer);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/customers/:id", requireAdmin, async (req, res) => {
    try {
      const updates = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, updates);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/customers/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteCustomer(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ message: "Customer deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Medicine routes (Admin and Employee can view and create, only Admin can update/delete)
  app.get("/api/medicines", requireAdminOrEmployee, async (req, res) => {
    try {
      const medicines = await storage.getAllMedicines();
      res.json(medicines);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/medicines/:id", requireAdminOrEmployee, async (req, res) => {
    try {
      const medicine = await storage.getMedicine(req.params.id);
      if (!medicine) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      res.json(medicine);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/medicines", requireAdminOrEmployee, async (req, res) => {
    try {
      const data = insertMedicineSchema.parse(req.body);
      const medicine = await storage.createMedicine(data);
      res.json(medicine);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/medicines/:id", requireAdmin, async (req, res) => {
    try {
      const updates = insertMedicineSchema.partial().parse(req.body);
      const medicine = await storage.updateMedicine(req.params.id, updates);
      if (!medicine) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      res.json(medicine);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/medicines/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteMedicine(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      res.json({ message: "Medicine deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Sale routes (Admin and Employee can view and create)
  app.get("/api/sales", requireAdminOrEmployee, async (req, res) => {
    try {
      const sales = await storage.getAllSales();
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/sales/:id", requireAdminOrEmployee, async (req, res) => {
    try {
      const sale = await storage.getSale(req.params.id);
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
      res.json(sale);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/sales", requireAdminOrEmployee, async (req, res) => {
    try {
      const data = insertSaleSchema.parse(req.body);
      
      // Ensure user_id is set from session
      if (!req.session.userId) {
        return res.status(401).json({ message: "User session required" });
      }
      
      const saleWithUser = {
        ...data,
        user_id: req.session.userId,
      };
      const sale = await storage.createSale(saleWithUser);
      res.json(sale);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Invoice and Reports routes
  app.get("/api/sales/:id/invoice", requireAdminOrEmployee, async (req, res) => {
    try {
      const pdfBuffer = await generateInvoicePDF(req.params.id);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=invoice-${req.params.id}.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/reports/sales/daily", requireAdminOrEmployee, async (req, res) => {
    try {
      const { date } = req.query;
      const targetDate = date ? new Date(date as string) : new Date();
      const startDate = new Date(targetDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(targetDate);
      endDate.setHours(23, 59, 59, 999);

      const pdfBuffer = await generateSalesReportPDF(startDate, endDate, 'daily');
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=daily-report-${targetDate.toISOString().split('T')[0]}.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/reports/sales/monthly", requireAdminOrEmployee, async (req, res) => {
    try {
      const { year, month } = req.query;
      const targetYear = year ? parseInt(year as string) : new Date().getFullYear();
      const targetMonth = month ? parseInt(month as string) - 1 : new Date().getMonth();
      
      const startDate = new Date(targetYear, targetMonth, 1);
      const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

      const pdfBuffer = await generateSalesReportPDF(startDate, endDate, 'monthly');
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=monthly-report-${targetYear}-${String(targetMonth + 1).padStart(2, '0')}.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/reports/sales/custom", requireAdminOrEmployee, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);

      const pdfBuffer = await generateSalesReportPDF(start, end, 'custom');
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=sales-report-${startDate}-to-${endDate}.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PDF Import routes
  app.post("/api/import/pdf/parse", requireAdmin, upload.single('pdf'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No PDF file uploaded" });
      }

      const parsedData = await parsePDF(req.file.buffer);
      res.json({
        lineCount: parsedData.lines.length,
        lines: parsedData.lines.slice(0, 20),
        allLines: parsedData.lines,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/import/pdf/medicines", requireAdmin, upload.single('pdf'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No PDF file uploaded" });
      }

      const fieldMapping: PDFFieldMapping = JSON.parse(req.body.fieldMapping || '{}');
      const startLine = parseInt(req.body.startLine || '0');
      const endLine = req.body.endLine ? parseInt(req.body.endLine) : undefined;

      const result = await importMedicinesFromPDF(
        req.file.buffer,
        fieldMapping,
        startLine,
        endLine
      );

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Database Backup routes
  app.get("/api/backup/sql", requireAdmin, async (req, res) => {
    try {
      const { sql, filename } = await createDatabaseBackup();
      res.setHeader("Content-Type", "application/sql");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(sql);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/backup/json", requireAdmin, async (req, res) => {
    try {
      const { data, filename } = await exportBackupAsJSON();
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
