# Multi-stage Docker build for PushFitness
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies needed for Vite build)
RUN npm ci

# Copy source code
COPY . .

# Build Vite frontend into dist/
RUN npm run build

# --- Production Runtime Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built frontend assets from builder
COPY --from=builder /app/dist ./dist

# Copy backend server code and database initializers
COPY --from=builder /app/server ./server

# Expose server port
EXPOSE 5000

# Start server
CMD ["node", "server/index.js"]
