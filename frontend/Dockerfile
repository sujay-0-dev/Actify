# Use official Node.js image for building the frontend
FROM node:20 as build

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./  
RUN npm install                      

# Copy the source code
COPY . .

# Build the React app
RUN npm run build

# Serve the frontend using NGINX
FROM nginx:1.23
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose the port
EXPOSE 5173

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
