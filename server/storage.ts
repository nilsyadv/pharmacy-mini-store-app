import {
  type Medicine,
  type InsertMedicine,
  type Sale,
  type InsertSale,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getMedicine(id: string): Promise<Medicine | undefined>;
  getAllMedicines(): Promise<Medicine[]>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  updateMedicine(id: string, medicine: Partial<InsertMedicine>): Promise<Medicine | undefined>;
  deleteMedicine(id: string): Promise<boolean>;
  
  getSale(id: string): Promise<Sale | undefined>;
  getAllSales(): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
}

export class MemStorage implements IStorage {
  private medicines: Map<string, Medicine>;
  private sales: Map<string, Sale>;

  constructor() {
    this.medicines = new Map();
    this.sales = new Map();
  }

  async getMedicine(id: string): Promise<Medicine | undefined> {
    return this.medicines.get(id);
  }

  async getAllMedicines(): Promise<Medicine[]> {
    return Array.from(this.medicines.values());
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const id = randomUUID();
    const medicine: Medicine = {
      ...insertMedicine,
      id,
      quantity: insertMedicine.quantity ?? 0,
    };
    this.medicines.set(id, medicine);
    return medicine;
  }

  async updateMedicine(id: string, updates: Partial<InsertMedicine>): Promise<Medicine | undefined> {
    const medicine = this.medicines.get(id);
    if (!medicine) return undefined;
    
    const updated = { ...medicine, ...updates };
    this.medicines.set(id, updated);
    return updated;
  }

  async deleteMedicine(id: string): Promise<boolean> {
    return this.medicines.delete(id);
  }

  async getSale(id: string): Promise<Sale | undefined> {
    return this.sales.get(id);
  }

  async getAllSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = randomUUID();
    const sale: Sale = {
      ...insertSale,
      id,
      customerName: insertSale.customerName ?? null,
      createdAt: new Date(),
    };
    this.sales.set(id, sale);
    return sale;
  }
}

export const storage = new MemStorage();
