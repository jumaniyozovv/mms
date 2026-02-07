#!/bin/sh
set -e
echo "Waiting for database..."
sleep 5
echo "Running database migrations..."
echo "DATABASE_URL: $DATABASE_URL"
prisma db push --schema=./prisma/schema.prisma --url="$DATABASE_URL" --accept-data-loss 2>&1 || echo "Migration failed!"
echo "Starting app..."
exec node custom-server.js
