#!/bin/bash
set -euo pipefail

# Backup a Fundarbok customer's data
#
# Usage: ./backup-customer.sh <customer-name> [backup-dir]
# Example: ./backup-customer.sh test /backup/fundarbok

CUSTOMER_NAME="${1:-}"
BACKUP_DIR="${2:-/backup/fundarbok}"

if [[ -z "$CUSTOMER_NAME" ]]; then
    echo "Usage: $0 <customer-name> [backup-dir]"
    exit 1
fi

CUSTOMERS_DIR="/opt/fundarbok/customers"
CUSTOMER_DIR="$CUSTOMERS_DIR/$CUSTOMER_NAME"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/$CUSTOMER_NAME/$TIMESTAMP"

if [[ ! -d "$CUSTOMER_DIR" ]]; then
    echo "Error: Customer '$CUSTOMER_NAME' not found"
    exit 1
fi

echo "=== Backing up: $CUSTOMER_NAME ==="
echo "Backup path: $BACKUP_PATH"

# Create backup directory
mkdir -p "$BACKUP_PATH"

# Load customer environment
source "$CUSTOMER_DIR/.env"

# Backup PostgreSQL database
echo "Backing up database..."
docker exec "fundarbok_${CUSTOMER_NAME}_db_1" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_PATH/database.sql.gz"

# Backup uploads volume
echo "Backing up uploads..."
docker cp "fundarbok_${CUSTOMER_NAME}_backend_1:/app/uploads" "$BACKUP_PATH/uploads" 2>/dev/null || echo "No uploads to backup"

# Backup configuration
echo "Backing up configuration..."
cp "$CUSTOMER_DIR/.env" "$BACKUP_PATH/env.backup"

echo ""
echo "=== Backup Complete ==="
echo "Location: $BACKUP_PATH"
echo "Files:"
ls -la "$BACKUP_PATH"
