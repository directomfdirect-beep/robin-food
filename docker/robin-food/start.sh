#!/bin/bash
# Robin Food - Supabase Local Development
# =========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🍃 Robin Food - Starting Supabase..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start containers
echo "📦 Starting containers..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if all services are healthy
echo "🔍 Checking services..."
docker-compose ps

echo ""
echo "✅ Robin Food Supabase is running!"
echo ""
echo "📊 Access points:"
echo "   • Studio:    http://localhost:4000"
echo "   • API:       http://localhost:9000"
echo "   • Database:  postgresql://postgres:***@localhost:6432/robin_food"
echo ""
echo "🔑 API Keys:"
echo "   • Anon Key:     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
echo "   • Service Key:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
echo ""
echo "📝 Commands:"
echo "   • Stop:   docker-compose down"
echo "   • Logs:   docker-compose logs -f"
echo "   • Reset:  docker-compose down -v && docker-compose up -d"
