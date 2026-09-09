# Claraship Production Deployment Guide (Cloud VM)

This guide provides step-by-step instructions for deploying the **Claraship Autonomous AI Agent Platform** (`claraship.com`, `portal.claraship.com`, `api.claraship.com`) on a production Cloud Virtual Machine (Ubuntu 22.04 or 24.04 LTS).

---

## 1. Architecture Overview

Claraship runs as a unified, containerized stack supervised by Docker Compose and reverse-proxied by Caddy 2:

- **Edge Reverse Proxy (`caddy`)**: Manages TLS termination with automatic Let's Encrypt / ZeroSSL renewal, HTTP/3 (QUIC), Zstd compression, and routes requests to the internal services.
- **Agent Core (`claraship-core`)**: FastAPI / Python 3.12 backend managing agent orchestration, persistent SQLite WAL databases, webhooks, multi-channel bots (Telegram, Slack, Discord), and the React 19 web dashboard.
- **Documentation & Vitrine (`claraship-docs`)**: High-performance static web server delivering the multi-locale documentation and marketing portal.
- **Persistent Volume (`claraship_data`)**: Stores all conversation history, checkpoints, skills, and configuration files outside container lifecycles.

---

## 2. Server Sizing Recommendations

Claraship delegates deep neural inference to external LLM providers (e.g. OpenRouter, DeepSeek, Anthropic), so no expensive dedicated GPU is required on the server.

| Tier | vCPU | RAM | Disk (NVMe) | Recommended Providers | Est. Cost |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Starter / Small** | 2 vCPU | 4 GB | 40 GB | Hetzner CX22, OVH VPS-1, Scaleway DEV1-L | ~4 - 7 € / mo |
| **Standard / Growth** | 4 vCPU | 8 GB | 80 GB | Hetzner CPX31, OVH VPS-2, AWS t4g.xlarge | ~12 - 18 € / mo |
| **High Concurrency** | 8 vCPU | 16 GB | 160 GB | Hetzner CPX41, OVH VPS-3, GCP c3-standard-4 | ~25 - 40 € / mo |

---

## 3. DNS Configuration

Before starting the server, configure the following DNS records at your domain registrar or Cloudflare:

| Type | Hostname / Subdomain | Target / Value | TTL | Note |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `claraship.com` | `<SERVER_IP>` | Auto (or 300) | Apex domain (Documentation & Landing) |
| **A** | `www.claraship.com` | `<SERVER_IP>` | Auto (or 300) | Redirects to apex domain |
| **A** | `portal.claraship.com`| `<SERVER_IP>` | Auto (or 300) | Web Dashboard & Interactive Chat |
| **A** | `api.claraship.com` | `<SERVER_IP>` | Auto (or 300) | REST / WebSocket / SSE API Gateway |

> [!NOTE]
> If you are using Cloudflare, you can set the proxy status to **DNS only (Grey cloud)** during initial SSL issuance, or ensure your SSL mode in Cloudflare is set to **Full (strict)**.

---

## 4. Initial Server Setup (One-Click)

1. Connect to your freshly provisioned Ubuntu VM via SSH as root:
   ```bash
   ssh root@<SERVER_IP>
   ```

2. Download and run the automated host setup script:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/claraship/clara-agent/main/deploy/setup-host.sh | bash
   ```
   *What this script does automatically:*
   - Updates all Ubuntu packages.
   - Sets up 4 GB of swap space if RAM is less than 8 GB.
   - Applies network and kernel tuning (`sysctl`).
   - Installs official Docker Engine and Docker Compose.
   - Configures the UFW firewall (allows only SSH, HTTP, and HTTPS).
   - Enables `fail2ban` against brute-force attacks.
   - Prepares the `/opt/claraship` workspace.

---

## 5. Deployment & Launch

1. Clone your production repository into `/opt/claraship`:
   ```bash
   git clone https://github.com/claraship/clara-agent.git /opt/claraship
   cd /opt/claraship
   ```

2. Configure your production environment:
   ```bash
   cp .env.production.example .env.production
   nano .env.production
   ```
   Ensure you set:
   - `DOMAIN=claraship.com`
   - `ACME_EMAIL=your-email@claraship.com`
   - `OPENROUTER_API_KEY=sk-or-v1-...`
   - `CLARA_DEFAULT_MODEL=deepseek/deepseek-v4-flash`

3. Trigger the production build and deployment:
   ```bash
   bash deploy/deploy.sh
   ```

4. Check the running status:
   ```bash
   docker compose -f docker-compose.prod.yml ps
   ```

---

## 6. Hosting Desktop App Binaries

To allow users to download the macOS desktop app (`Claraship-mac-arm64.dmg` and `.zip`):
- Upload or copy the compiled releases into `./website/static/downloads/`:
  ```bash
  mkdir -p /opt/claraship/website/static/downloads/
  cp Claraship-mac-arm64.dmg /opt/claraship/website/static/downloads/
  cp Claraship-mac-arm64.zip /opt/claraship/website/static/downloads/
  ```
- These will immediately be accessible at:
  - `https://claraship.com/downloads/Claraship-mac-arm64.dmg`
  - `https://claraship.com/downloads/Claraship-mac-arm64.zip`

---

## 7. Automated Backups & Maintenance

1. Test manual backup:
   ```bash
   bash deploy/backup.sh
   ```
   Backups are saved to `/var/backups/claraship/` with automatic 14-day rotation.

2. Schedule daily automated backups with cron:
   ```bash
   crontab -e
   ```
   Add the following line to run every night at 3:00 AM:
   ```cron
   0 3 * * * /opt/claraship/deploy/backup.sh >> /var/log/claraship-backup.log 2>&1
   ```

---

## 8. Useful Operational Commands

- **View Live Logs**:
  ```bash
  docker compose -f docker-compose.prod.yml logs -f claraship-core
  docker compose -f docker-compose.prod.yml logs -f caddy
  ```
- **Update to Latest Version**:
  ```bash
  cd /opt/claraship
  bash deploy/deploy.sh --pull
  ```
- **Restart Services**:
  ```bash
  docker compose -f docker-compose.prod.yml restart
  ```
