import { db, users } from "../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

async function initAdmin() {
  try {
    console.log("Checking for admin user...");
    
    // Check if admin already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin')).limit(1);
    
    if (existingAdmin.length > 0) {
      console.log("Admin user already exists");
      return;
    }
    
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      id: randomUUID(),
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });
    
    console.log("Admin user created successfully");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("IMPORTANT: Please change this password after first login!");
  } catch (error) {
    console.error("Error initializing admin user:", error);
    throw error;
  }
}

initAdmin()
  .then(() => {
    console.log("Initialization complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Initialization failed:", error);
    process.exit(1);
  });
