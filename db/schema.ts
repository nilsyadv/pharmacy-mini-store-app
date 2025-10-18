import { pgTable, text, timestamp, integer, decimal, varchar, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
