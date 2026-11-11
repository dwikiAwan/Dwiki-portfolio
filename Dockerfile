# Multi-stage build for optimized production deployment

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production server (nginx with compression)
FROM nginx:alpine AS production

# Install brotli for better compression
RUN apk add --no-cache brotli

# Copy the build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config with gzip/brotli
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

# Labels for container metadata
LABEL org.opencontainers.image.title="Dwekfolio Portfolio"
LABEL org.opencontainers.image.description="Personal portfolio website"
LABEL org.opencontainers.image.version="latest"