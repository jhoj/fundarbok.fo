# Fundarbok Deployment Guide

## Architecture Overview

Fundarbok uses a Docker-based multi-instance architecture where each customer gets:
- Isolated PostgreSQL database
- Own Docker container stack
- Unique subdomain (e.g., `customer.fundarbokin.hoj.fo`)

## Quick Start (Self-Hosting)

1. Copy `docker-compose.template.yml` to `docker-compose.yml`
2. Copy `.env.example` to `.env` and configure
3. Run `docker-compose up -d`

## VPS Deployment (hoj.fo)

### Initial VPS Setup

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Create directory structure
sudo mkdir -p /opt/fundarbok/{customers,scripts}
sudo chown -R $USER:$USER /opt/fundarbok

# Copy deployment files
cp docker-compose.prod.yml /opt/fundarbok/
cp scripts/*.sh /opt/fundarbok/scripts/
chmod +x /opt/fundarbok/scripts/*.sh

# Install nginx
sudo apt install nginx certbot python3-certbot-nginx
```

### Deploy New Customer

```bash
cd /opt/fundarbok
./scripts/deploy-customer.sh <customer-name> [port]

# Example:
./scripts/deploy-customer.sh test 8001
```

This creates:
- `/opt/fundarbok/customers/test/` with docker-compose.yml and .env
- Nginx config at `/etc/nginx/sites-available/test.fundarbokin.hoj.fo.conf`
- Docker stack running on port 8001

### SSL Setup

```bash
# For individual customer
sudo certbot --nginx -d test.fundarbokin.hoj.fo

# Or wildcard certificate (requires DNS provider plugin)
sudo certbot certonly --dns-cloudflare -d '*.fundarbokin.hoj.fo'
```

### Update All Customers

After CI/CD builds new images:

```bash
cd /opt/fundarbok
./scripts/update-all.sh
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. Builds Docker images on push to `master`
2. Pushes to GitHub Container Registry
3. SSHs to VPS and runs update script

### Required Secrets

Configure in GitHub repository settings:
- `VPS_HOST`: VPS IP address or hostname
- `VPS_USER`: SSH username
- `VPS_SSH_KEY`: SSH private key

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_PASSWORD` | PostgreSQL password | Yes |
| `JWT_SECRET` | JWT signing key (min 32 chars) | Yes |
| `CUSTOMER_DOMAIN` | Customer subdomain | Yes |
| `FRONTEND_PORT` | Host port for frontend | Yes |
| `VAPID_PUBLIC_KEY` | Push notification key | No |
| `VAPID_PRIVATE_KEY` | Push notification key | No |

## Backup

```bash
./scripts/backup-customer.sh <customer-name> [backup-dir]
```

Backs up:
- PostgreSQL database (gzipped SQL dump)
- Uploaded files
- Configuration

## File Structure

```
/opt/fundarbok/
├── docker-compose.prod.yml    # Base compose file
├── scripts/
│   ├── deploy-customer.sh     # Create new customer
│   ├── update-all.sh          # Update all customers
│   └── backup-customer.sh     # Backup customer data
└── customers/
    ├── test/
    │   ├── docker-compose.yml
    │   └── .env
    └── customer2/
        ├── docker-compose.yml
        └── .env
```

## Troubleshooting

### View logs
```bash
cd /opt/fundarbok/customers/<name>
docker-compose logs -f
```

### Restart customer
```bash
docker-compose restart
```

### Check container status
```bash
docker ps --filter "name=fundarbok_"
```

### Database access
```bash
docker exec -it fundarbok_<name>_db_1 psql -U fundarbok -d fundarbok_<name>
```
