#!/usr/bin/env bash
# ==============================================================================
# Claraship VM Host Initial Setup Script
# Targets: Ubuntu 22.04 / 24.04 LTS (x86_64 or aarch64)
# ==============================================================================

set -euo pipefail

# Ensure running as root
if [ "$EUID" -ne 0 ]; then
  echo "[-] This script must be run as root (use: sudo bash deploy/setup-host.sh)"
  exit 1
fi

echo "[+] Starting Claraship Host Setup..."

# 1. System updates & essential utilities
echo "[+] Updating apt repositories and packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git \
  ufw \
  fail2ban \
  tar \
  gzip \
  jq \
  htop \
  net-tools

# 2. Configure Swap (4GB) if physical RAM < 8GB
TOTAL_RAM_MB=$(free -m | awk '/^Mem:/{print $2}')
if [ "$TOTAL_RAM_MB" -lt 7500 ] && [ ! -f /swapfile ]; then
  echo "[+] RAM is under 8GB ($TOTAL_RAM_MB MB). Creating 4GB swapfile..."
  fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "[+] Swapfile created successfully."
fi

# 3. Kernel and Network Tuning
echo "[+] Applying sysctl performance optimizations..."
cat << 'SYSCTL_CONF' > /etc/sysctl.d/99-claraship.conf
# Claraship kernel & network optimizations
vm.swappiness=10
vm.max_map_count=262144
fs.file-max=2097152
net.core.somaxconn=65535
net.ipv4.tcp_max_syn_backlog=8192
net.ipv4.ip_local_port_range=1024 65535
SYSCTL_CONF
sysctl --system > /dev/null

# 4. Install Official Docker Engine & Compose Plugin
if ! command -v docker &> /dev/null; then
  echo "[+] Installing official Docker Engine..."
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable docker
  systemctl start docker
  echo "[+] Docker installed: $(docker --version)"
else
  echo "[+] Docker is already installed: $(docker --version)"
fi

# 5. Configure Firewall (UFW)
echo "[+] Configuring UFW firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 443/udp comment 'HTTP3 QUIC'
# Enable without prompting
echo "y" | ufw enable
ufw status verbose

# 6. Configure Fail2Ban for SSH protection
echo "[+] Enabling Fail2ban for SSH..."
systemctl enable fail2ban
systemctl restart fail2ban

# 7. Create App Directory
echo "[+] Creating /opt/claraship directory..."
mkdir -p /opt/claraship
chmod 755 /opt/claraship

echo ""
echo "=========================================================================="
echo " [✓] Claraship Host Setup Complete!"
echo "=========================================================================="
echo " Next steps:"
echo " 1. Clone the repository into /opt/claraship:"
echo "    git clone https://github.com/claraship/clara-agent.git /opt/claraship"
echo "    cd /opt/claraship"
echo ""
echo " 2. Configure production environment:"
echo "    cp .env.production.example .env.production"
echo "    nano .env.production  # (Set your DOMAIN, ACME_EMAIL, OPENROUTER_API_KEY)"
echo ""
echo " 3. Launch deployment:"
echo "    bash deploy/deploy.sh"
echo "=========================================================================="
