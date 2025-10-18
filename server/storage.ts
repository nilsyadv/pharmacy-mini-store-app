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
import { randomUUID } from "crypto";
import { getConnection } from "./db";
import bcrypt from "bcrypt";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

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

export class MySQLStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const db = await getConnection();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await getConnection();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0] as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getConnection();
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    await db.query(
      'INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)',
      [id, insertUser.username, hashedPassword, insertUser.role]
    );
    
    const user = await this.getUser(id);
    if (!user) throw new Error('Failed to create user');
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const db = await getConnection();
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM users');
    return rows as User[];
  }

  // Customer methods
  async getCustomer(id: string): Promise<Customer | undefined> {
    const db = await getConnection();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );
    return rows[0] as Customer | undefined;
  }

  async getAllCustomers(): Promise<Customer[]> {
    const db = await getConnection();
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM customers ORDER BY created_at DESC');
    return rows as Customer[];
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const db = await getConnection();
    const id = randomUUID();
    
    await db.query(
      'INSERT INTO customers (id, name, phone, email, address) VALUES (?, ?, ?, ?, ?)',
      [id, insertCustomer.name, insertCustomer.phone || null, insertCustomer.email || null, insertCustomer.address || null]
    );
    
    const customer = await this.getCustomer(id);
    if (!customer) throw new Error('Failed to create customer');
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const db = await getConnection();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updates.phone);
    }
    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }
    if (updates.address !== undefined) {
      fields.push('address = ?');
      values.push(updates.address);
    }

    if (fields.length === 0) return this.getCustomer(id);

    values.push(id);
    await db.query(
      `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getCustomer(id);
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const db = await getConnection();
    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM customers WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  // Medicine methods
  async getMedicine(id: string): Promise<Medicine | undefined> {
    const db = await getConnection();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT *, DATE_FORMAT(expiry_date, "%Y-%m-%d") as expiryDate FROM medicines WHERE id = ?',
      [id]
    );
    if (rows[0]) {
      const row = rows[0];
      return {
        id: row.id,
        name: row.name,
        category: row.category,
        quantity: row.quantity,
        price: parseFloat(row.price),
        expiryDate: row.expiryDate,
        manufacturer: row.manufacturer,
        sku: row.sku,
      } as Medicine;
    }
    return undefined;
  }

  async getAllMedicines(): Promise<Medicine[]> {
    const db = await getConnection();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT *, DATE_FORMAT(expiry_date, "%Y-%m-%d") as expiryDate FROM medicines ORDER BY name'
    );
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      quantity: row.quantity,
      price: parseFloat(row.price),
      expiryDate: row.expiryDate,
      manufacturer: row.manufacturer,
      sku: row.sku,
    })) as Medicine[];
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const db = await getConnection();
    const id = randomUUID();
    
    await db.query(
      'INSERT INTO medicines (id, name, category, quantity, price, expiry_date, manufacturer, sku) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, insertMedicine.name, insertMedicine.category, insertMedicine.quantity, insertMedicine.price, insertMedicine.expiryDate, insertMedicine.manufacturer, insertMedicine.sku]
    );
    
    const medicine = await this.getMedicine(id);
    if (!medicine) throw new Error('Failed to create medicine');
    return medicine;
  }

  async updateMedicine(id: string, updates: Partial<InsertMedicine>): Promise<Medicine | undefined> {
    const db = await getConnection();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.category !== undefined) {
      fields.push('category = ?');
      values.push(updates.category);
    }
    if (updates.quantity !== undefined) {
      fields.push('quantity = ?');
      values.push(updates.quantity);
    }
    if (updates.price !== undefined) {
      fields.push('price = ?');
      values.push(updates.price);
    }
    if (updates.expiryDate !== undefined) {
      fields.push('expiry_date = ?');
      values.push(updates.expiryDate);
    }
    if (updates.manufacturer !== undefined) {
      fields.push('manufacturer = ?');
      values.push(updates.manufacturer);
    }
    if (updates.sku !== undefined) {
      fields.push('sku = ?');
      values.push(updates.sku);
    }

    if (fields.length === 0) return this.getMedicine(id);

    values.push(id);
    await db.query(
      `UPDATE medicines SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getMedicine(id);
  }

  async deleteMedicine(id: string): Promise<boolean> {
    const db = await getConnection();
    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM medicines WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  // Sale methods
  async getSale(id: string): Promise<Sale | undefined> {
    const db = await getConnection();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM sales WHERE id = ?',
      [id]
    );
    if (rows[0]) {
      const row = rows[0];
      return {
        id: row.id,
        customer_id: row.customer_id,
        customer_name: row.customer_name,
        items: JSON.parse(row.items),
        total_amount: parseFloat(row.total_amount),
        user_id: row.user_id,
        created_at: row.created_at,
      } as Sale;
    }
    return undefined;
  }

  async getAllSales(): Promise<Sale[]> {
    const db = await getConnection();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM sales ORDER BY created_at DESC'
    );
    return rows.map(row => ({
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
    const db = await getConnection();
    const id = randomUUID();
    
    await db.query(
      'INSERT INTO sales (id, customer_id, customer_name, items, total_amount, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, insertSale.customer_id || null, insertSale.customer_name || null, JSON.stringify(insertSale.items), insertSale.total_amount, insertSale.user_id || null]
    );
    
    const sale = await this.getSale(id);
    if (!sale) throw new Error('Failed to create sale');
    return sale;
  }
}

export const storage = new MySQLStorage();
