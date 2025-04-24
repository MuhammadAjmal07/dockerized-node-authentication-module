#!/bin/bash

# Stop any running containers and remove them
echo "Stopping and removing existing containers..."
docker-compose down

# Remove existing volumes to start fresh
echo "Removing existing volumes..."
docker volume rm $(docker volume ls -q | grep node-crud-app) 2>/dev/null || true

# Build and start the containers
echo "Building and starting containers..."
docker-compose up --build -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker-compose exec postgres pg_isready -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is ready!"

# Show logs
echo "Showing logs..."
docker-compose logs -f