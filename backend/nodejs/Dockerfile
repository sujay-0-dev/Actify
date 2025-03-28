# Use official Node.js image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose the port
EXPOSE 3000

# Start the Node.js server
CMD ["node", "server.js"]
