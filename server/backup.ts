import { db } from "../db";
import { sql } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";

export interface BackupResult {
  filename: string;
  size: number;
  timestamp: Date;
}

export async function createDatabaseBackup(): Promise<{ sql: string; filename: string }> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `pharmacy-backup-${timestamp}.sql`;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  const client = neon(process.env.DATABASE_URL);

  let backupSQL = `-- Pharmacy Database Backup
-- Generated: ${new Date().toISOString()}
-- 
\n\n`;

  // Get all tables
  const tablesResult = await client(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  for (const tableRow of tablesResult) {
    const tableName = tableRow.table_name;
    
    // Skip session table
    if (tableName === 'session') continue;

    // Get table schema
    const schemaResult = await client(`
      SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);

    backupSQL += `-- Table: ${tableName}\n`;
    backupSQL += `DROP TABLE IF EXISTS "${tableName}" CASCADE;\n`;
    
    // Create table statement
    let createTable = `CREATE TABLE "${tableName}" (\n`;
    const columns = schemaResult.map((col: any) => {
      let colDef = `  "${col.column_name}" ${col.data_type}`;
      if (col.character_maximum_length) {
        colDef += `(${col.character_maximum_length})`;
      }
      if (col.is_nullable === 'NO') {
        colDef += ' NOT NULL';
      }
      if (col.column_default) {
        colDef += ` DEFAULT ${col.column_default}`;
      }
      return colDef;
    });
    createTable += columns.join(',\n');
    createTable += '\n);\n\n';
    backupSQL += createTable;

    // Get data
    const dataResult = await client(`SELECT * FROM "${tableName}"`);
    
    if (dataResult.length > 0) {
      for (const row of dataResult) {
        const columns = Object.keys(row);
        const values = columns.map(col => {
          const val = row[col];
          if (val === null) return 'NULL';
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
          if (val instanceof Date) return `'${val.toISOString()}'`;
          if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
          return val;
        });
        
        backupSQL += `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${values.join(', ')});\n`;
      }
      backupSQL += '\n';
    }
  }

  return { sql: backupSQL, filename };
}

export async function exportBackupAsJSON(): Promise<{ data: any; filename: string }> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `pharmacy-backup-${timestamp}.json`;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  const client = neon(process.env.DATABASE_URL);

  const backup: any = {
    timestamp: new Date().toISOString(),
    tables: {},
  };

  // Get all tables
  const tablesResult = await client(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  for (const tableRow of tablesResult) {
    const tableName = tableRow.table_name;
    
    // Skip session table
    if (tableName === 'session') continue;

    const dataResult = await client(`SELECT * FROM "${tableName}"`);
    backup.tables[tableName] = dataResult;
  }

  return { data: backup, filename };
}
