import { z } from "zod";
import { pgTable, text, timestamp, integer, decimal, varchar, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof loginSchema>;

// User schema
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  role: z.enum(['admin', 'employee']),
  created_at: z.date().optional(),
});

export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['admin', 'employee']).default('employee'),
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Customer schema
export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  created_at: z.date().optional(),
});

export const insertCustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
});

export type Customer = z.infer<typeof customerSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

// Medicine schema
export const medicineSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  quantity: z.number(),
  price: z.number(),
  expiryDate: z.string(),
  manufacturer: z.string(),
  sku: z.string(),
  created_at: z.date().optional(),
});

export const insertMedicineSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  quantity: z.number().int().min(0).default(0),
  price: z.number().min(0),
  expiryDate: z.string(),
  manufacturer: z.string().min(1),
  sku: z.string().min(1),
});

export type Medicine = z.infer<typeof medicineSchema>;
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;

// Sale schema
export const saleItemSchema = z.object({
  medicineId: z.string(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const saleSchema = z.object({
  id: z.string(),
  customer_id: z.string().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  items: z.array(saleItemSchema),
  total_amount: z.number(),
  user_id: z.string().nullable().optional(),
  created_at: z.date().optional(),
});

export const insertSaleSchema = z.object({
  customer_id: z.string().optional(),
  customer_name: z.string().optional(),
  items: z.array(saleItemSchema),
  total_amount: z.number().min(0),
  user_id: z.string().optional(),
});

export type SaleItem = z.infer<typeof saleItemSchema>;
export type Sale = z.infer<typeof saleSchema>;
export type InsertSale = z.infer<typeof insertSaleSchema>;

// Backup schema
export const backupSchema = z.object({
  id: z.string(),
  file_path: z.string(),
  drive_file_id: z.string().nullable().optional(),
  backup_date: z.date(),
  status: z.enum(['success', 'failed']),
});

export type Backup = z.infer<typeof backupSchema>;

// Drizzle ORM Database Schema
// Enums
export const roleEnum = pgEnum('role', ['admin', 'employee']);
export const backupStatusEnum = pgEnum('backup_status', ['success', 'failed']);

// Users table
export const users = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('employee'),
  created_at: timestamp('created_at').defaultNow(),
});

// Customers table
export const customers = pgTable('customers', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  address: text('address'),
  created_at: timestamp('created_at').defaultNow(),
});

// Medicines table
export const medicines = pgTable('medicines', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  quantity: integer('quantity').notNull().default(0),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  expiry_date: varchar('expiry_date', { length: 10 }).notNull(),
  manufacturer: varchar('manufacturer', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow(),
});

// Sales table
export const sales = pgTable('sales', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  customer_id: varchar('customer_id', { length: 36 }).references(() => customers.id, { onDelete: 'set null' }),
  customer_name: varchar('customer_name', { length: 255 }),
  items: text('items').notNull(),
  total_amount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  user_id: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'set null' }),
  created_at: timestamp('created_at').defaultNow(),
});

// Backups table
export const backups = pgTable('backups', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  file_path: varchar('file_path', { length: 500 }).notNull(),
  drive_file_id: varchar('drive_file_id', { length: 255 }),
  backup_date: timestamp('backup_date').defaultNow(),
  status: backupStatusEnum('status').notNull(),
});
