#!/bin/bash
set -euo pipefail

# =============================================================================
# Fundarbok VPS Setup Script
# Run this ONCE on a fresh VPS to install dependencies and configure services.
# Usage: sudo bash setup-vps.sh
# =============================================================================

DEPLOY_DIR="/opt/fundarbok"
DOMAIN="fundarbok.fo"

echo "==> Installing system dependencies..."
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx postgresql rsync

# .NET 8 runtime
echo "==> Installing .NET 8 runtime..."
apt-get install -y dotnet-runtime-8.0 || {
    # Fallback: add Microsoft repo if not available
    wget https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb -O /tmp/packages-microsoft-prod.deb
    dpkg -i /tmp/packages-microsoft-prod.deb
    apt-get update
    apt-get install -y dotnet-runtime-8.0
}

# Create deploy directory
echo "==> Creating deploy directory..."
mkdir -p "$DEPLOY_DIR/backend" "$DEPLOY_DIR/frontend"
chown -R www-data:www-data "$DEPLOY_DIR"

# Setup PostgreSQL
echo "==> Setting up PostgreSQL..."
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw fundarbok; then
    sudo -u postgres createuser -S fundarbok 2>/dev/null || true
    sudo -u postgres createdb -O fundarbok fundarbok 2>/dev/null || true
    sudo -u postgres psql -c "ALTER USER fundarbok WITH PASSWORD 'CHANGE_ME';"
    echo "    WARNING: Change the database password in appsettings.Production.json and PostgreSQL!"
else
    echo "    Database 'fundarbok' already exists, skipping."
fi

# Install systemd service
echo "==> Installing systemd service..."
cp "$DEPLOY_DIR/deploy/fundarbok-api.service" /etc/systemd/system/fundarbok-api.service
systemctl daemon-reload
systemctl enable fundarbok-api

# Install nginx config
echo "==> Installing nginx config..."
cp "$DEPLOY_DIR/deploy/nginx-fundarbok.conf" /etc/nginx/sites-available/fundarbok
ln -sf /etc/nginx/sites-available/fundarbok /etc/nginx/sites-enabled/fundarbok
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Copy production appsettings if not already present
if [ ! -f "$DEPLOY_DIR/backend/appsettings.Production.json" ]; then
    echo "==> Copying production appsettings template..."
    cp "$DEPLOY_DIR/deploy/appsettings.Production.json" "$DEPLOY_DIR/backend/appsettings.Production.json"
    echo "    IMPORTANT: Edit $DEPLOY_DIR/backend/appsettings.Production.json with real credentials!"
fi

# SSL certificate
echo "==> Setting up SSL certificate..."
echo "    Run the following after DNS is pointed to this server:"
echo "    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"

echo ""
echo "==> Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit $DEPLOY_DIR/backend/appsettings.Production.json with real DB password and JWT secret"
echo "  2. Point DNS for $DOMAIN to this server"
echo "  3. Run: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "  4. Add GitHub repo secrets (VPS_SSH_KEY, VPS_HOST, VPS_USER)"
echo "  5. Merge a PR into master to trigger deployment"
