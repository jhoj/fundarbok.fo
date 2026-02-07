#!/bin/bash
set -euo pipefail

# Update all Fundarbok customer instances
#
# Usage: ./update-all.sh [--pull-only]
#
# This script will:
# 1. Pull latest Docker images
# 2. Restart all customer stacks with new images

CUSTOMERS_DIR="/opt/fundarbok/customers"
PULL_ONLY="${1:-}"

echo "=== Fundarbok Update Script ==="
echo "Started at: $(date -Iseconds)"
echo ""

# Pull latest images
echo "Pulling latest images..."
docker pull ghcr.io/jhoj/fundarbok.fo-backend:latest
docker pull ghcr.io/jhoj/fundarbok.fo-frontend:latest
echo ""

if [[ "$PULL_ONLY" == "--pull-only" ]]; then
    echo "Pull only mode - skipping restart"
    exit 0
fi

# Find and update all customers
echo "Updating customer instances..."
for customer_dir in "$CUSTOMERS_DIR"/*/; do
    if [[ -f "$customer_dir/docker-compose.yml" ]]; then
        customer_name=$(basename "$customer_dir")
        echo ""
        echo "=== Updating: $customer_name ==="

        cd "$customer_dir"

        # Pull and recreate containers with new images
        docker-compose pull
        docker-compose up -d --force-recreate

        echo "✓ $customer_name updated"
    fi
done

echo ""
echo "=== Update Complete ==="
echo "Finished at: $(date -Iseconds)"
echo ""

# Show status of all containers
echo "Container status:"
docker ps --filter "name=fundarbok_" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
