#!/usr/bin/env bash
# ==============================================================================
# Claraship Dedicated Host Configuration: MacBook Pro 2019 Intel Core i9 (Ubuntu)
# Transforms the MacBook Pro 2019 i9 into a silent, cool, 24/7 dedicated server.
# ==============================================================================

set -euo pipefail

if [ "$EUID" -ne 0 ]; then
  echo "[-] Ce script doit être exécuté en root : sudo bash deploy/setup-macbook-ubuntu-server.sh"
  exit 1
fi

echo "=========================================================================="
echo " [1/6] Configuration du Clamshell Mode (Tourner avec écran fermé)"
echo "=========================================================================="

mkdir -p /etc/systemd/logind.conf.d/
cat << 'LOGIND_CONF' > /etc/systemd/logind.conf.d/macbook-server.conf
[Login]
# Ne jamais se mettre en veille lorsque l'écran est rabattu
HandleLidSwitch=ignore
HandleLidSwitchExternalPower=ignore
HandleLidSwitchDocked=ignore
IdleAction=ignore
LidSwitchIgnoreInhibited=no
LOGIND_CONF

# Désactiver complètement la veille au niveau systemd
systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
systemctl restart systemd-logind || true
echo "[✓] Mode écran fermé configuré (aucun passage en veille)."

echo "=========================================================================="
echo " [2/6] Gestion Thermique & Silence pour Intel Core i9"
echo "=========================================================================="

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y --no-install-recommends \
  tlp \
  tlp-rdw \
  thermald \
  linux-tools-common \
  linux-tools-generic \
  cpufrequtils \
  curl \
  git \
  ufw \
  fail2ban \
  jq \
  htop

# Activer thermald pour réguler les ventilateurs de la puce Apple
systemctl enable thermald
systemctl start thermald || true

# Configurer TLP pour limiter la surchauffe CPU sur secteur et batterie
cat << 'TLP_CONF' > /etc/tlp.d/99-macbook-i9.conf
# Profil d'économie d'énergie serveur (silencieux et froid)
CPU_SCALING_GOVERNOR_ON_AC=powersave
CPU_SCALING_GOVERNOR_ON_BAT=powersave
CPU_ENERGY_PERF_POLICY_ON_AC=balance_power
CPU_ENERGY_PERF_POLICY_ON_BAT=power
# Éviter le turbo boost permanent qui fait rugir les ventilateurs
CPU_BOOST_ON_AC=0
CPU_BOOST_ON_BAT=0
TLP_CONF

systemctl enable tlp
systemctl restart tlp || true
echo "[✓] Optimisation thermique appliquée (Core i9 bridé pour rester silencieux et froid)."

echo "=========================================================================="
echo " [3/6] Optimisation Noyau & Swap"
echo "=========================================================================="

cat << 'SYSCTL_CONF' > /etc/sysctl.d/99-claraship.conf
vm.swappiness=10
vm.max_map_count=262144
fs.file-max=2097152
net.core.somaxconn=65535
net.ipv4.tcp_max_syn_backlog=8192
net.ipv4.ip_local_port_range=1024 65535
SYSCTL_CONF
sysctl --system > /dev/null

# Swapfile de 4 Go si besoin
if [ ! -f /swapfile ]; then
  fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
echo "[✓] Optimisations système et Swap activées."

echo "=========================================================================="
echo " [4/6] Installation de Docker & Docker Compose"
echo "=========================================================================="

if ! command -v docker &> /dev/null; then
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
  echo "[✓] Docker Engine installé."
else
  echo "[✓] Docker déjà présent."
fi

echo "=========================================================================="
echo " [5/6] Installation de Cloudflare Tunnel (cloudflared)"
echo "=========================================================================="

if ! command -v cloudflared &> /dev/null; then
  mkdir -p --mode=0755 /etc/apt/keyrings
  curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | tee /etc/apt/keyrings/cloudflare-main.gpg >/dev/null
  echo 'deb [signed-by=/etc/apt/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' | tee /etc/apt/sources.list.d/cloudflared.list
  apt-get update -y
  apt-get install -y cloudflared
  echo "[✓] cloudflared installé : $(cloudflared --version)"
else
  echo "[✓] cloudflared déjà présent."
fi

echo "=========================================================================="
echo " [6/6] Configuration Pare-feu UFW"
echo "=========================================================================="

ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
# Note : avec Cloudflare Tunnel, les ports 80/443 n'ont même pas besoin d'être ouverts sur votre box !
ufw allow 80/tcp comment 'HTTP Local'
ufw allow 443/tcp comment 'HTTPS Local'
echo "y" | ufw enable

# Dossier d'application
mkdir -p /opt/claraship
chmod 755 /opt/claraship

echo ""
echo "=========================================================================="
echo " [✓] CONFIGURATION DU MACBOOK PRO 2019 i9 TERMINÉE !"
echo "=========================================================================="
echo " Ce Mac est désormais configuré en SERVEUR DÉDIÉ :"
echo " - Vous pouvez fermer l'écran sans qu'il ne dorme jamais."
echo " - Le processeur i9 est configuré pour rester silencieux et tiède."
echo " - Docker, Compose et cloudflared sont installés."
echo ""
echo " PROCHAINES ÉTAPES SUR CE MAC :"
echo " 1. Cloner le projet :"
echo "    git clone https://github.com/claraship/clara-agent.git /opt/claraship"
echo "    cd /opt/claraship"
echo ""
echo " 2. Déployer Claraship :"
echo "    cp .env.production.example .env.production"
echo "    nano .env.production  # (Ajoutez votre clé OpenRouter)"
echo "    bash deploy/deploy.sh"
echo ""
echo " 3. Activer votre Cloudflare Tunnel :"
echo "    cloudflared tunnel login"
echo "    cloudflared tunnel create claraship-prod"
echo "    cloudflared tunnel run claraship-prod"
echo "=========================================================================="
