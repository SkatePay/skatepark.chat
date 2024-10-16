# Step 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Step 2: Serve the application with a minimal image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8080

CMD ["npm", "start"]