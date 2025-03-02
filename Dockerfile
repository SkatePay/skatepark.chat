# Step 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Step 2: Serve the application with a minimal image
FROM node:18-alpine

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app ./

EXPOSE 3002

# Start the server
CMD ["npm", "start"]