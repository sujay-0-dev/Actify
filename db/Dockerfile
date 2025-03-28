# Use official MongoDB image
FROM mongo:latest

# Set working directory (data persistence)
WORKDIR /data/db

# Expose MongoDB port
EXPOSE 27017

# Copy init scripts for seeding data (if any)
COPY init /docker-entrypoint-initdb.d

# Start MongoDB
CMD ["mongod"]
