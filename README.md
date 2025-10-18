# PharmaCare - Pharmacy Management System

A comprehensive pharmacy management desktop application built with React, Express, and MySQL.

## Features

✅ **Completed:**
- MySQL database integration for persistent data
- Role-based authentication (Admin & Employee)
- Session-based secure login/logout
- Modern, mobile-friendly UI with dark mode support
- Responsive design with Shadcn UI components

🚧 **In Progress:**
- Customer management system
- PDF invoice and report generation
- Google Drive automated backups
- Electron desktop application packaging

## Prerequisites

- Node.js 18+ 
- MySQL 5.7+ or MariaDB 10.3+
- For desktop deployment: Electron

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pharmacy-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up MySQL Database**

Create a MySQL database:
```sql
CREATE DATABASE pharmacy_db;
```

4. **Configure Environment Variables**

Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pharmacy_db
SESSION_SECRET=your_random_secret_here_change_this
```

**Important:** Generate a strong SESSION_SECRET:
```bash
openssl rand -hex 32
```

5. **Initialize Database Tables**

The application will automatically create required tables on first run:
- users
- customers
- medicines
- sales
- backups
- sessions (for session storage)

6. **Create Admin User**

Run the initialization script:
```bash
npm run init-admin
```

This creates an admin user with:
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT: Change this password after first login!**

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

- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Express.js, Node.js
- **Database:** MySQL
- **Session Store:** MySQL (express-mysql-session)
- **Authentication:** bcrypt, express-session

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

If you see `ECONNREFUSED 127.0.0.1:3306`:
1. Make sure MySQL is running: `mysql -u root -p`
2. Check your `.env` credentials
3. Verify the database exists: `SHOW DATABASES;`

### Session Issues

If authentication doesn't persist:
1. Verify SESSION_SECRET is set in `.env`
2. Check MySQL session table exists
3. Clear browser cookies and retry

### Port Already in Use

If port 5000 is busy:
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

Or change the PORT in your environment.

## Upcoming Features

- **Customer Management:** Complete CRUD for customer records
- **PDF Generation:** Invoices, daily & monthly sales reports
- **Google Drive Backup:** Automated database backups
- **Electron Desktop App:** Standalone desktop application
- **Barcode Scanning:** Quick product lookup
- **Prescription Management:** Track prescriptions and refills

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
