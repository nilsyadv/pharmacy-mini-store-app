# Multi-stage build for production
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev) for build
RUN npm ci

# Copy source code
COPY . .

# Build the frontend application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install postgresql-client for database checks
RUN apk add --no-cache postgresql-client

# Copy package files
COPY package*.json ./

# Install ALL dependencies (we need drizzle-kit for migrations)
RUN npm ci

# Copy all source files (needed for server runtime)
COPY --from=builder /app/server ./server
COPY --from=builder /app/db ./db
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Copy built frontend from builder
COPY --from=builder /app/dist ./dist

# Create backups directory
RUN mkdir -p /app/backups

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["npm", "start"]
