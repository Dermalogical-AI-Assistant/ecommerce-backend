# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 4005

# Start application
RUN npm run prisma:g
RUN npm run build

CMD [ "node", "dist/main.js" ]
