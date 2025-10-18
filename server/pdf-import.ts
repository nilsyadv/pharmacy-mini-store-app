import * as pdfParse from "pdf-parse";
import type { InsertMedicine } from "@shared/schema";
import { storage } from "./storage";

export interface PDFFieldMapping {
  name: string;
  category: string;
  quantity: string;
  price: string;
  expiryDate: string;
  manufacturer: string;
  sku: string;
}

export interface ParsedPDFData {
  text: string;
  lines: string[];
}

export async function parsePDF(buffer: Buffer): Promise<ParsedPDFData> {
  const data = await pdfParse(buffer);
  const lines = data.text.split('\n').filter((line: string) => line.trim().length > 0);
  
  return {
    text: data.text,
    lines,
  };
}

export function extractFieldsFromLine(
  line: string,
  fieldMapping: PDFFieldMapping
): Partial<InsertMedicine> | null {
  try {
    const parts = line.split(/\s+/);
    if (parts.length < 7) return null;

    const medicine: Partial<InsertMedicine> = {};

    Object.entries(fieldMapping).forEach(([field, index]) => {
      const idx = parseInt(index);
      if (idx >= 0 && idx < parts.length) {
        const value = parts[idx];
        
        switch (field) {
          case 'name':
          case 'category':
          case 'manufacturer':
          case 'sku':
            medicine[field as keyof InsertMedicine] = value as any;
            break;
          case 'quantity':
            medicine.quantity = parseInt(value) || 0;
            break;
          case 'price':
            medicine.price = parseFloat(value.replace('$', '').replace(',', '')) || 0;
            break;
          case 'expiryDate':
            medicine.expiryDate = value;
            break;
        }
      }
    });

    if (
      medicine.name &&
      medicine.category &&
      medicine.manufacturer &&
      medicine.sku &&
      medicine.expiryDate !== undefined &&
      medicine.quantity !== undefined &&
      medicine.price !== undefined
    ) {
      return medicine as InsertMedicine;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function importMedicinesFromPDF(
  buffer: Buffer,
  fieldMapping: PDFFieldMapping,
  startLine: number = 0,
  endLine?: number
): Promise<{ imported: number; errors: string[] }> {
  const parsedData = await parsePDF(buffer);
  const lines = parsedData.lines.slice(startLine, endLine);
  
  let imported = 0;
  const errors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = startLine + i + 1;
    try {
      const medicineData = extractFieldsFromLine(lines[i], fieldMapping);
      
      if (medicineData) {
        await storage.createMedicine(medicineData as InsertMedicine);
        imported++;
      }
    } catch (error: any) {
      errors.push(`Line ${lineNumber}: ${error.message}`);
    }
  }

  return { imported, errors };
}
