# PharmaCare - Pharmacy Management System

A comprehensive pharmacy management system built with React, Express, and PostgreSQL (Neon serverless).

## Features

✅ **Completed:**
- PostgreSQL (Neon) database with Drizzle ORM
- Role-based authentication (Admin & Employee)
- Session-based secure login/logout
- Inventory management with CRUD operations
- Point of sale (POS) system
- Customer management with purchase history
- Sales reporting (daily/monthly/custom)
- PDF invoice generation
- PDF stock import with field mapping
- Database backup (SQL and JSON export)
- Docker support for local testing
- PWA (Progressive Web App) for Windows desktop installation
- Modern, mobile-friendly UI with dark mode support
- Responsive design with Shadcn UI components

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ (or use Neon serverless)
- Docker & Docker Compose (for local testing - optional)

## Quick Start Options

### Option 1: Docker (Recommended for Local Testing)

See [Docker Setup Guide](README-DOCKER.md) for detailed instructions.

```bash
cp .env.example .env
# Edit .env with your configuration
docker-compose up -d
```

Access at `http://localhost:5000`

### Option 2: Manual Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pharmacare
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL Database**

Create a PostgreSQL database or use [Neon](https://neon.tech) for serverless PostgreSQL.

4. **Configure Environment Variables**

Copy `.env.example` to `.env` and update:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pharmacare
SESSION_SECRET=your_random_secret_min_32_characters
PORT=5000
NODE_ENV=development
```

**Important:** Generate a strong SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. **Push Database Schema**

```bash
npm run db:push
```

6. **Create Admin User**

The admin user is created automatically on first run:
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT: Change this password after first login!**

### Option 3: Install as Windows Desktop App

See [PWA Installation Guide](README-PWA.md) for installing PharmaCare as a desktop application on Windows.

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5000`

### Production Mode

```bash
npm run build
npm start
```

## User Roles & Permissions

### Admin
- Full access to all features
- Can manage users, customers, medicines
- Can update/delete any records
- Access to settings and configuration

### Employee
- Can view inventory and customers
- Can add new medicines (stock updates)
- Can create sales/invoices
- Limited access to critical operations

## Default Credentials

On first setup, use these credentials to log in:
- **Username:** admin
- **Password:** admin123

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI, Wouter (routing), TanStack Query
- **Backend:** Express.js, Node.js, TypeScript
- **Database:** PostgreSQL (Neon serverless), Drizzle ORM
- **Session Store:** PostgreSQL (connect-pg-simple)
- **Authentication:** Passport.js, bcrypt, express-session
- **PDF:** PDFKit (generation), pdf-parse (import)
- **Deployment:** Docker, Docker Compose
- **PWA:** Service Workers, Web App Manifest

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and auth context
│   │   └── App.tsx        # Main app component
├── server/                # Backend Express server
│   ├── db.ts             # Database connection & initialization
│   ├── storage.ts        # Database operations
│   ├── auth.ts           # Authentication middleware
│   ├── routes.ts         # API endpoints
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Zod validation schemas
└── .env                  # Environment configuration
```

## Troubleshooting

### Database Connection Issues

If you see connection errors:
1. Verify PostgreSQL is running
2. Check your `DATABASE_URL` in `.env`
3. For Docker: ensure postgres container is healthy: `docker-compose ps`

### Session Issues

If authentication doesn't persist:
1. Verify SESSION_SECRET is set in `.env` (minimum 32 characters)
2. Check PostgreSQL session table exists
3. Clear browser cookies and retry
4. For Docker: restart the app container: `docker-compose restart app`

### Port Already in Use

If port 5000 is busy:
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

Or change the PORT in your environment.

## Additional Guides

- 📦 [Docker Setup for Local Testing](README-DOCKER.md)
- 💻 [Install as Windows Desktop App (PWA)](README-PWA.md)
- 📄 [Deployment Guide](DEPLOYMENT.md)

## Upcoming Features

- **Barcode Scanning:** Quick product lookup
- **Prescription Management:** Track prescriptions and refills
- **Advanced Analytics:** Sales trends and inventory forecasting
- **Multi-location Support:** Manage multiple pharmacy branches
- **Supplier Management:** Track suppliers and purchase orders

## Security Notes

1. Always use strong passwords
2. Keep SESSION_SECRET secure and random
3. Never commit `.env` file to version control
4. Use HTTPS in production
5. Regularly backup your database
6. Update dependencies regularly

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please create an issue in the repository.
