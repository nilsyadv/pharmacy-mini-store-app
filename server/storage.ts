import {
  type User,
  type InsertUser,
  type Customer,
  type InsertCustomer,
  type Medicine,
  type InsertMedicine,
  type Sale,
  type InsertSale,
} from "@shared/schema";
import { db, users, customers, medicines, sales } from "../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Customer methods
  getCustomer(id: string): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;
  
  // Medicine methods
  getMedicine(id: string): Promise<Medicine | undefined>;
  getAllMedicines(): Promise<Medicine[]>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  updateMedicine(id: string, medicine: Partial<InsertMedicine>): Promise<Medicine | undefined>;
  deleteMedicine(id: string): Promise<boolean>;
  
  // Sale methods
  getSale(id: string): Promise<Sale | undefined>;
  getAllSales(): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
}

export class PostgresStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0] as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const result = await db.insert(users).values({
      username: insertUser.username,
      password: hashedPassword,
      role: insertUser.role,
    }).returning();
    
    if (!result[0]) throw new Error('Failed to create user');
    return result[0] as User;
  }

  async getAllUsers(): Promise<User[]> {
    const result = await db.select().from(users);
    return result as User[];
  }

  // Customer methods
  async getCustomer(id: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
    return result[0] as Customer | undefined;
  }

  async getAllCustomers(): Promise<Customer[]> {
    const result = await db.select().from(customers).orderBy(customers.created_at);
    return result as Customer[];
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const result = await db.insert(customers).values({
      name: insertCustomer.name,
      phone: insertCustomer.phone || null,
      email: insertCustomer.email || null,
      address: insertCustomer.address || null,
    }).returning();
    
    if (!result[0]) throw new Error('Failed to create customer');
    return result[0] as Customer;
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.address !== undefined) updateData.address = updates.address;

    if (Object.keys(updateData).length === 0) return this.getCustomer(id);

    const result = await db.update(customers)
      .set(updateData)
      .where(eq(customers.id, id))
      .returning();

    return result[0] as Customer | undefined;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const result = await db.delete(customers).where(eq(customers.id, id)).returning();
    return result.length > 0;
  }

  // Medicine methods
  async getMedicine(id: string): Promise<Medicine | undefined> {
    const result = await db.select().from(medicines).where(eq(medicines.id, id)).limit(1);
    if (result[0]) {
      return {
        id: result[0].id,
        name: result[0].name,
        category: result[0].category,
        quantity: result[0].quantity,
        price: parseFloat(result[0].price),
        expiryDate: result[0].expiry_date,
        manufacturer: result[0].manufacturer,
        sku: result[0].sku,
      } as Medicine;
    }
    return undefined;
  }

  async getAllMedicines(): Promise<Medicine[]> {
    const result = await db.select().from(medicines).orderBy(medicines.name);
    return result.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      quantity: row.quantity,
      price: parseFloat(row.price),
      expiryDate: row.expiry_date,
      manufacturer: row.manufacturer,
      sku: row.sku,
    })) as Medicine[];
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const result = await db.insert(medicines).values({
      name: insertMedicine.name,
      category: insertMedicine.category,
      quantity: insertMedicine.quantity,
      price: insertMedicine.price.toString(),
      expiry_date: insertMedicine.expiryDate,
      manufacturer: insertMedicine.manufacturer,
      sku: insertMedicine.sku,
    }).returning();
    
    if (!result[0]) throw new Error('Failed to create medicine');
    return {
      id: result[0].id,
      name: result[0].name,
      category: result[0].category,
      quantity: result[0].quantity,
      price: parseFloat(result[0].price),
      expiryDate: result[0].expiry_date,
      manufacturer: result[0].manufacturer,
      sku: result[0].sku,
    } as Medicine;
  }

  async updateMedicine(id: string, updates: Partial<InsertMedicine>): Promise<Medicine | undefined> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.price !== undefined) updateData.price = updates.price.toString();
    if (updates.expiryDate !== undefined) updateData.expiry_date = updates.expiryDate;
    if (updates.manufacturer !== undefined) updateData.manufacturer = updates.manufacturer;
    if (updates.sku !== undefined) updateData.sku = updates.sku;

    if (Object.keys(updateData).length === 0) return this.getMedicine(id);

    const result = await db.update(medicines)
      .set(updateData)
      .where(eq(medicines.id, id))
      .returning();

    if (result[0]) {
      return {
        id: result[0].id,
        name: result[0].name,
        category: result[0].category,
        quantity: result[0].quantity,
        price: parseFloat(result[0].price),
        expiryDate: result[0].expiry_date,
        manufacturer: result[0].manufacturer,
        sku: result[0].sku,
      } as Medicine;
    }
    return undefined;
  }

  async deleteMedicine(id: string): Promise<boolean> {
    const result = await db.delete(medicines).where(eq(medicines.id, id)).returning();
    return result.length > 0;
  }

  // Sale methods
  async getSale(id: string): Promise<Sale | undefined> {
    const result = await db.select().from(sales).where(eq(sales.id, id)).limit(1);
    if (result[0]) {
      return {
        id: result[0].id,
        customer_id: result[0].customer_id,
        customer_name: result[0].customer_name,
        items: JSON.parse(result[0].items),
        total_amount: parseFloat(result[0].total_amount),
        user_id: result[0].user_id,
        created_at: result[0].created_at,
      } as Sale;
    }
    return undefined;
  }

  async getAllSales(): Promise<Sale[]> {
    const result = await db.select().from(sales).orderBy(sales.created_at);
    return result.map(row => ({
      id: row.id,
      customer_id: row.customer_id,
      customer_name: row.customer_name,
      items: JSON.parse(row.items),
      total_amount: parseFloat(row.total_amount),
      user_id: row.user_id,
      created_at: row.created_at,
    })) as Sale[];
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const result = await db.insert(sales).values({
      customer_id: insertSale.customer_id || null,
      customer_name: insertSale.customer_name || null,
      items: JSON.stringify(insertSale.items),
      total_amount: insertSale.total_amount.toString(),
      user_id: insertSale.user_id || null,
    }).returning();
    
    if (!result[0]) throw new Error('Failed to create sale');
    return {
      id: result[0].id,
      customer_id: result[0].customer_id,
      customer_name: result[0].customer_name,
      items: JSON.parse(result[0].items),
      total_amount: parseFloat(result[0].total_amount),
      user_id: result[0].user_id,
      created_at: result[0].created_at,
    } as Sale;
  }
}

export const storage = new PostgresStorage();
