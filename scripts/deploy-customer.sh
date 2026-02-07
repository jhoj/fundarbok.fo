#!/bin/bash
set -euo pipefail

# Deploy a new Fundarbok customer instance
#
# Usage: ./deploy-customer.sh <customer-name> [port]
# Example: ./deploy-customer.sh test 8001
#
# This script will:
# 1. Create customer directory with docker-compose.yml
# 2. Generate unique secrets (JWT, DB password)
# 3. Create nginx configuration for the subdomain
# 4. Start the Docker stack

CUSTOMER_NAME="${1:-}"
PORT="${2:-}"

if [[ -z "$CUSTOMER_NAME" ]]; then
    echo "Usage: $0 <customer-name> [port]"
    echo "Example: $0 test 8001"
    exit 1
fi

# Configuration
BASE_DIR="/opt/fundarbok"
CUSTOMERS_DIR="$BASE_DIR/customers"
CUSTOMER_DIR="$CUSTOMERS_DIR/$CUSTOMER_NAME"
NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
DOMAIN_SUFFIX="fundarbokin.hoj.fo"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-ghcr.io/jhoj}"

# Generate random port if not specified
if [[ -z "$PORT" ]]; then
    # Find next available port starting from 8001
    PORT=8001
    while [[ -d "$CUSTOMERS_DIR/"*"" ]] && grep -rq "FRONTEND_PORT=$PORT" "$CUSTOMERS_DIR/"*"/.env" 2>/dev/null; do
        ((PORT++))
    done
fi

echo "=== Deploying Fundarbok for customer: $CUSTOMER_NAME ==="
echo "Domain: $CUSTOMER_NAME.$DOMAIN_SUFFIX"
echo "Port: $PORT"

# Check if customer already exists
if [[ -d "$CUSTOMER_DIR" ]]; then
    echo "Error: Customer '$CUSTOMER_NAME' already exists at $CUSTOMER_DIR"
    exit 1
fi

# Create customer directory
echo "Creating customer directory..."
mkdir -p "$CUSTOMER_DIR"

# Generate secrets
echo "Generating secrets..."
JWT_SECRET=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 64)
DB_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)

# Create .env file
echo "Creating .env file..."
cat > "$CUSTOMER_DIR/.env" << EOF
# Fundarbok Configuration for $CUSTOMER_NAME
# Generated: $(date -Iseconds)

# Customer identification
CUSTOMER_NAME=$CUSTOMER_NAME
CUSTOMER_DOMAIN=$CUSTOMER_NAME.$DOMAIN_SUFFIX

# Docker settings
COMPOSE_PROJECT_NAME=fundarbok_$CUSTOMER_NAME
DOCKER_REGISTRY=$DOCKER_REGISTRY
IMAGE_TAG=latest
FRONTEND_PORT=$PORT

# Database
DB_USER=fundarbok
DB_PASSWORD=$DB_PASSWORD
DB_NAME=fundarbok_$CUSTOMER_NAME

# JWT Authentication
JWT_SECRET=$JWT_SECRET
JWT_ISSUER=Fundarbok.API
JWT_AUDIENCE=Fundarbok.Web
JWT_EXPIRATION_HOURS=24

# Push Notifications (optional - generate with web-push generate-vapid-keys)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# CORS (auto-configured based on CUSTOMER_DOMAIN)
CORS_ORIGIN=https://$CUSTOMER_NAME.$DOMAIN_SUFFIX
EOF

# Copy docker-compose.yml
echo "Creating docker-compose.yml..."
cp "$BASE_DIR/docker-compose.prod.yml" "$CUSTOMER_DIR/docker-compose.yml"

# Create nginx configuration
echo "Creating nginx configuration..."
cat > "$NGINX_CONF_DIR/$CUSTOMER_NAME.$DOMAIN_SUFFIX.conf" << EOF
server {
    listen 80;
    server_name $CUSTOMER_NAME.$DOMAIN_SUFFIX;

    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $CUSTOMER_NAME.$DOMAIN_SUFFIX;

    # SSL certificates (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/$CUSTOMER_NAME.$DOMAIN_SUFFIX/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$CUSTOMER_NAME.$DOMAIN_SUFFIX/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to frontend container
    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # File upload size
        client_max_body_size 50M;
    }
}
EOF

# Enable nginx site
echo "Enabling nginx site..."
ln -sf "$NGINX_CONF_DIR/$CUSTOMER_NAME.$DOMAIN_SUFFIX.conf" "$NGINX_ENABLED_DIR/"

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

# Note about SSL
echo ""
echo "=== SSL Certificate Setup ==="
echo "Before reloading nginx, obtain SSL certificate:"
echo "  sudo certbot certonly --nginx -d $CUSTOMER_NAME.$DOMAIN_SUFFIX"
echo ""
echo "Or use wildcard certificate:"
echo "  sudo certbot certonly --dns-cloudflare -d '*.$DOMAIN_SUFFIX'"
echo ""

# Start Docker stack
echo "Starting Docker stack..."
cd "$CUSTOMER_DIR"
docker-compose pull
docker-compose up -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# Check status
echo ""
echo "=== Deployment Complete ==="
echo "Customer: $CUSTOMER_NAME"
echo "Domain: https://$CUSTOMER_NAME.$DOMAIN_SUFFIX"
echo "Local port: $PORT"
echo "Directory: $CUSTOMER_DIR"
echo ""
echo "Next steps:"
echo "1. Ensure DNS record exists: $CUSTOMER_NAME.$DOMAIN_SUFFIX -> VPS IP"
echo "2. Obtain SSL certificate: certbot certonly --nginx -d $CUSTOMER_NAME.$DOMAIN_SUFFIX"
echo "3. Reload nginx: sudo systemctl reload nginx"
echo "4. Check status: docker-compose -f $CUSTOMER_DIR/docker-compose.yml ps"
