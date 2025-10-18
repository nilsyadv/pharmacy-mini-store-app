# PharmaCare Deployment Guide

## Current Status

✅ **Completed Features:**
1. **MySQL Database Integration**
   - Full database schema for users, medicines, customers, sales, and backups
   - Parameterized SQL queries for security
   - Automatic table creation on first run
   - Connection pooling for performance

2. **Authentication & Authorization**
   - Secure session-based authentication
   - Role-based access control (Admin & Employee)
   - Password hashing with bcrypt
   - Protected API endpoints
   - Login/logout functionality
   - Session persistence with MySQL (with memory fallback)

3. **Beautiful UI**
   - Modern, responsive design
   - Dark mode support
   - Mobile-friendly interface
   - Professional pharmacy theme

🚧 **Remaining Features to Implement:**
- Customer management UI (backend ready, needs frontend)
- PDF generation for invoices and reports
- Google Drive backup integration
- Electron desktop app packaging

## Why MySQL is Required

This application uses MySQL for:
1. **Persistent Data Storage** - All medicines, customers, and sales records
2. **User Management** - Storing user accounts with hashed passwords
3. **Session Storage** - Secure, server-side session management

## Local Development Setup

### Prerequisites
```bash
# Install MySQL (Ubuntu/Debian)
sudo apt-get install mysql-server

# Install MySQL (macOS)
brew install mysql

# Install MySQL (Windows)
# Download from https://dev.mysql.com/downloads/installer/
```

### Database Setup

1. **Start MySQL Service**
```bash
# Ubuntu/Debian
sudo service mysql start

# macOS
brew services start mysql

# Windows
# Start MySQL service from Services app
```

2. **Create Database**
```bash
mysql -u root -p
```

```sql
CREATE DATABASE pharmacy_db;
CREATE USER 'pharmacy_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON pharmacy_db.* TO 'pharmacy_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

3. **Configure Application**

Update `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=pharmacy_user
DB_PASSWORD=secure_password_here
DB_NAME=pharmacy_db
SESSION_SECRET=generate_with_openssl_rand_hex_32
```

4. **Initialize Admin User**
```bash
npm run init-admin
```

This creates the default admin account:
- Username: `admin`
- Password: `admin123`

⚠️ **Change this password immediately after first login!**

## Building for Desktop (Electron)

### Step 1: Install Electron

```bash
npm install --save-dev electron electron-builder
```

### Step 2: Create Electron Main Process

Create `electron/main.js`:
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let serverProcess;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL('http://localhost:5000');
  
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startServer() {
  serverProcess = spawn('node', ['dist/server/index.js'], {
    stdio: 'inherit',
  });
}

app.on('ready', () => {
  startServer();
  setTimeout(createWindow, 3000); // Wait for server to start
});

app.on('window-all-closed', function () {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
```

### Step 3: Update package.json

```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron": "electron .",
    "electron:build": "electron-builder",
    "pack": "npm run build && electron-builder --dir",
    "dist": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.pharmacare.app",
    "productName": "PharmaCare",
    "files": [
      "dist/**/*",
      "electron/**/*",
      "package.json"
    ],
    "directories": {
      "buildResources": "assets"
    },
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "assets/icon.png"
    }
  }
}
```

### Step 4: Build Desktop App

```bash
# Development mode
npm run electron

# Package for current platform
npm run pack

# Build installers for all platforms
npm run dist
```

## MySQL on Desktop App

For the desktop application to work, users must have MySQL installed locally. You have two options:

### Option 1: Bundled MySQL (Recommended)
Package MySQL with the Electron app:
- Use `mysql-server` npm package
- Or bundle MySQL binaries
- Auto-start MySQL when app launches

### Option 2: External MySQL
Require users to install MySQL separately:
- Provide installation instructions
- Include database setup wizard in the app
- Check MySQL connection on startup

## Security Checklist

- [ ] Change default admin password
- [ ] Generate strong SESSION_SECRET
- [ ] Use HTTPS in production
- [ ] Enable firewall on production server
- [ ] Regular database backups
- [ ] Keep dependencies updated
- [ ] Secure MySQL with strong passwords
- [ ] Limit MySQL remote access
- [ ] Use SSL for MySQL connections in production

## Next Steps

1. **Connect to MySQL Database** - Set up local MySQL instance
2. **Test Authentication** - Login with admin credentials
3. **Complete Remaining Features**:
   - Build customer management UI
   - Implement PDF generation
   - Add Google Drive backups
4. **Package as Desktop App** - Follow Electron build steps
5. **Deploy to Target Systems** - Install on pharmacy computers

## Troubleshooting

### "SESSION_SECRET is required" Error
Generate a secret:
```bash
openssl rand -hex 32
```
Add to `.env` file.

### "connect ECONNREFUSED" Error
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database exists
- Test connection: `mysql -u pharmacy_user -p pharmacy_db`

### Session Not Persisting
- Check SESSION_SECRET is set
- Verify MySQL session table exists
- Clear browser cookies
- Check server logs for errors

### Permission Denied Errors
Employee users cannot:
- Delete medicines
- Update medicine details
- Manage customers
- Access settings

Only admins have full access.

## Support

For technical issues or questions, please refer to:
- README.md for basic setup
- This document for deployment
- Server logs for debugging
- MySQL error logs for database issues
