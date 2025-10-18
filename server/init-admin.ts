// Script to create initial admin user
import { storage } from "./storage";
import { initializeDatabase } from "./db";

async function createAdminUser() {
  try {
    await initializeDatabase();
    
    // Check if admin user already exists
    const existingAdmin = await storage.getUserByUsername("admin");
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user with default password
    const admin = await storage.createUser({
      username: "admin",
      password: "admin123", // Change this password after first login!
      role: "admin",
    });

    console.log("Admin user created successfully:");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("IMPORTANT: Change the password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
