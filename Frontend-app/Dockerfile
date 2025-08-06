# --- Stage 1: Build the React application ---
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci 

#Copy the rest of the application code
COPY . .

# Build the React application for production
RUN npm run build

# --- Stage 2: Serve the React application with Nginx ---
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a non-root user for better security
RUN addgroup -g 1001 -S appuser
RUN adduser -S appuser -u 1001

# Change ownership of nginx directories
RUN chown -R appuser:appuser /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R appuser:appuser /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose port 80 for web traffic
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]