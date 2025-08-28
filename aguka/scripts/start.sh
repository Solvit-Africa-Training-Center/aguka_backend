#!/bin/sh
set -e

echo "Starting Ecommerce Application..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Check current directory and files
echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

echo "Checking Sequelize config:"
if [ -f ".sequelizerc" ]; then
  echo ".sequelizerc found"
  cat .sequelizerc
else
  echo ".sequelizerc not found"
fi

if [ -f "src/config/config.js" ]; then
  echo "config.js found"
else
  echo "config.js not found"
  echo "Contents of src/config/:"
  ls -la src/config/ || echo "src/config directory not found"
fi

echo "Running database migrations..."
npx sequelize-cli db:migrate --config src/config/config.js

echo "Seeding database..."
npx sequelize-cli db:seed:all --config src/config/config.js

echo "Starting the server..."
npm start
