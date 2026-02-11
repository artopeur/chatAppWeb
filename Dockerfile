# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json files from backend
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY backend/ .

# Copy frontend files to public directory if serving from backend
COPY web/ ./public/

# Expose port (adjust to match your backend port)
EXPOSE 3123

# Start the application
CMD ["npm", "start"]
