# Pharmacy Management System

## Overview
A full-stack pharmacy management system with inventory tracking, sales, customer management, reporting, and data import/export capabilities.

## Recent Changes
- **2024-01-18**: Migrated from MySQL to PostgreSQL (Neon) with Drizzle ORM
- **2024-01-18**: Added invoice generation and sales reporting (daily/monthly/custom)
- **2024-01-18**: Added customer search by phone/name and purchase history tracking
- **2024-01-18**: Added PDF stock import with field mapping
- **2024-01-18**: Added database backup (SQL and JSON export)

## Architecture

### Database
- PostgreSQL (Neon) with Drizzle ORM
- Tables: users, customers, medicines, sales, backups
- Session storage using connect-pg-simple

### Authentication
- Session-based authentication with bcrypt password hashing
- Role-based access control (admin/employee)
- Default admin credentials: username: `admin`, password: `admin123`

### API Features
1. **Customer Management**
   - Search by name, phone, or email
   - View purchase history
   - CRUD operations

2. **Inventory Management**
   - Medicine CRUD operations
   - PDF import with customizable field mapping
   - Stock tracking

3. **Sales & Reporting**
   - Point of sale
   - Invoice generation (PDF)
   - Daily/monthly/custom sales reports (PDF)

4. **Database Backup**
   - SQL export
   - JSON export
   - *Note: Google Drive integration available but not configured. To enable, set up the Google Drive connector in Replit integrations or provide API credentials.*

## Tech Stack
- **Backend**: Express.js, TypeScript, Drizzle ORM
- **Frontend**: React, Wouter, TanStack Query, Radix UI, Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **PDF**: PDFKit (generation), pdf-parse (import)

## Default Login
- Username: `admin`
- Password: `admin123`
- **IMPORTANT**: Change this password after first login!

## User Preferences
- None specified yet

## Project Structure
- `/client` - React frontend application
- `/server` - Express backend API
- `/shared` - Shared types and schemas (Zod validation + Drizzle ORM)
- `/db` - Database configuration and exports
- `/scripts` - Utility scripts (e.g., admin initialization)
