#!/bin/bash
# Robin Food - Stop Supabase
# ===========================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🛑 Robin Food - Stopping Supabase..."

docker-compose down

echo "✅ Supabase stopped."
