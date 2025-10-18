import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import pg from "pg";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const databaseUrl = process.env.DATABASE_URL;

// Check if we're using Neon serverless (https://...) or local PostgreSQL (postgresql://...)
const isNeonServerless = databaseUrl.startsWith('https://') || process.env.USE_NEON === 'true';

let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;

if (isNeonServerless) {
  // Use Neon HTTP driver for serverless (Replit, production)
  console.log('Using Neon serverless database driver');
  const sql = neon(databaseUrl);
  db = drizzleNeon(sql, { schema });
} else {
  // Use standard PostgreSQL driver for local/Docker
  console.log('Using PostgreSQL node driver');
  const pool = new pg.Pool({
    connectionString: databaseUrl,
    ssl: false, // Disable SSL for local connections
  });
  db = drizzlePg(pool, { schema });
}

export { db };
export * from "../shared/schema";
