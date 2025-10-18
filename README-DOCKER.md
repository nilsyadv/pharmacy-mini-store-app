# Docker Setup for PharmaCare - Local Testing

This guide explains how to run PharmaCare locally using Docker and Docker Compose.

## Prerequisites

- Docker Desktop (Windows, Mac, or Linux)
- Docker Compose (included with Docker Desktop)

## Quick Start

1. **Clone the repository and navigate to the project directory**

2. **Copy the environment file and configure it:**
   ```bash
   cp .env.example .env
   ```

3. **Edit the `.env` file with your settings:**
   - Change `POSTGRES_PASSWORD` to a secure password
   - Generate a secure `SESSION_SECRET` (minimum 32 characters)
   - Adjust other settings as needed

4. **Start the application:**
   ```bash
   docker-compose up -d
   ```

5. **Access the application:**
   - Open your browser and go to `http://localhost:5000`

## Commands

### Start the application
```bash
docker-compose up -d
```

### Stop the application
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f app
```

### Restart the application
```bash
docker-compose restart app
```

### Stop and remove all data (including database)
```bash
docker-compose down -v
```

### Rebuild the application after code changes
```bash
docker-compose up -d --build
```

## Default Admin Credentials

After first startup, an admin user will be created:
- **Username:** admin
- **Password:** admin123

**Important:** Change the admin password immediately after first login!

## Database Access

To access the PostgreSQL database directly:
```bash
docker-compose exec postgres psql -U postgres -d pharmacare
```

## Backup Location

Backups are stored in the `./backups` directory on your host machine.

## Troubleshooting

### Port already in use
If port 5000 or 5432 is already in use, change the port in the `.env` file:
```
PORT=3000
POSTGRES_PORT=5433
```

### Database connection issues
Make sure the PostgreSQL container is healthy:
```bash
docker-compose ps
```

View database logs:
```bash
docker-compose logs postgres
```

### Reset everything
To completely reset the application and database:
```bash
docker-compose down -v
docker-compose up -d
```

## Development vs Production

This Docker setup is configured for local testing. For production deployment:
- Use stronger passwords
- Enable SSL/TLS
- Configure proper backup strategies
- Use environment-specific configurations
- Consider using Docker Swarm or Kubernetes for orchestration
