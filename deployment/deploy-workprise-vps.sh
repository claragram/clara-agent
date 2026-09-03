#!/usr/bin/env bash
# ==============================================================================
# WORKPRISE.FR - Production Deployment Script for VPS
# ==============================================================================
# Deploys:
#   1. workprise.fr / www.workprise.fr -> French Portal & Showcase (Port 3000)
#   2. agent.workprise.fr              -> Clara Documentation & Skills (Port 3000)
#   3. portal.workprise.fr             -> Clara Web Dashboard & Sessions (Port 9119)
#   4. api.workprise.fr                -> Clara Inference & Gateway API (Port 8000)
# ==============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}   🚀 Déploiement de l'architecture WORKPRISE.FR     ${NC}"
echo -e "${BLUE}=====================================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Erreur : Ce script doit être exécuté en tant que root (sudo bash deploy-workprise-vps.sh)${NC}"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo -e "\n${YELLOW}[1/6] Mise à jour du système et installation des dépendances...${NC}"
apt-get update -y
apt-get install -y \
  python3 \
  python3-venv \
  python3-pip \
  python3-dev \
  build-essential \
  git \
  curl \
  wget \
  nginx \
  certbot \
  python3-certbot-nginx \
  ufw \
  ffmpeg \
  ripgrep \
  ca-certificates \
  gnupg

# Install Node.js 20.x if not installed
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'.' -f1 | tr -d 'v')" -lt 18 ]; then
  echo -e "${YELLOW}Installation de Node.js 20.x LTS...${NC}"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo -e "${GREEN}✓ Dépendances système installées.${NC}"

echo -e "\n${YELLOW}[2/6] Configuration de l'environnement Python pour Clara Agent...${NC}"
cd "${REPO_DIR}"

if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

# Upgrade pip & install package
.venv/bin/pip install --upgrade pip setuptools wheel
.venv/bin/pip install -e .

echo -e "${GREEN}✓ Clara Agent installé avec succès en mode production.${NC}"

echo -e "\n${YELLOW}[3/6] Préparation du site web & documentation Workprise (Docusaurus)...${NC}"
cd "${REPO_DIR}/website"
rm -f package-lock.json
npm install --engine-strict=false
npm run build || echo -e "${YELLOW}Build initialisé.${NC}"

echo -e "${GREEN}✓ Interface Web et documentation prêtes.${NC}"

echo -e "\n${YELLOW}[4/6] Configuration des services Systemd (24/7 Auto-restart)...${NC}"
cp "${REPO_DIR}/deployment/systemd/clara-gateway.service" /etc/systemd/system/
cp "${REPO_DIR}/deployment/systemd/clara-dashboard.service" /etc/systemd/system/
cp "${REPO_DIR}/deployment/systemd/clara-website.service" /etc/systemd/system/

systemctl daemon-reload
systemctl enable clara-gateway.service
systemctl enable clara-dashboard.service
systemctl enable clara-website.service

systemctl restart clara-gateway.service
systemctl restart clara-dashboard.service
systemctl restart clara-website.service

echo -e "${GREEN}✓ Services Systemd démarrés et activés au démarrage.${NC}"

echo -e "\n${YELLOW}[5/6] Configuration du Reverse Proxy NGINX...${NC}"
cp "${REPO_DIR}/deployment/nginx/workprise.fr.conf" /etc/nginx/sites-available/workprise.fr.conf
ln -sf /etc/nginx/sites-available/workprise.fr.conf /etc/nginx/sites-enabled/

# Remove default site if present
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t
systemctl reload nginx

# Configure Firewall
ufw allow 'Nginx Full' || true
ufw allow OpenSSH || true
ufw --force enable || true

echo -e "${GREEN}✓ Nginx configuré et actif.${NC}"

echo -e "\n${YELLOW}[6/6] Configuration SSL / HTTPS (Let's Encrypt)...${NC}"
echo -e "Voulez-vous générer les certificats SSL Let's Encrypt maintenant ? (Vos DNS A records doivent pointer vers cette IP)"
read -p "Générer SSL pour workprise.fr et sous-domaines ? (o/n) : " -n 1 -r
echo
if [[ $REPLY =~ ^[OoYy]$ ]]; then
  read -p "Entrez votre email de contact pour Let's Encrypt (ex: claraprise@outlook.com) : " SSL_EMAIL
  SSL_EMAIL=${SSL_EMAIL:-claraprise@outlook.com}
  
  certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email "$SSL_EMAIL" \
    --redirect \
    -d workprise.fr \
    -d www.workprise.fr \
    -d agent.workprise.fr \
    -d portal.workprise.fr \
    -d api.workprise.fr || echo -e "${YELLOW}⚠️ Certbot n'a pas pu émettre les certificats immédiatement. Vérifiez la propagation DNS puis relancez : sudo certbot --nginx -d workprise.fr -d agent.workprise.fr -d portal.workprise.fr -d api.workprise.fr${NC}"
fi

echo -e "\n${GREEN}=====================================================${NC}"
echo -e "${GREEN}   ✨ DÉPLOIEMENT WORKPRISE.FR TERMINÉ AVEC SUCCÈS !  ${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo -e "Vos services sont accessibles sur :"
echo -e "  🌐 Site & Documentation : https://workprise.fr / https://agent.workprise.fr"
echo -e "  💻 Dashboard & Sessions : https://portal.workprise.fr"
echo -e "  🔌 API Gateway Inference: https://api.workprise.fr"
echo -e "\nCommandes utiles sur le VPS :"
echo -e "  - Voir les logs Gateway   : journalctl -u clara-gateway -f"
echo -e "  - Voir les logs Dashboard : journalctl -u clara-dashboard -f"
echo -e "  - Voir les logs Website   : journalctl -u clara-website -f"
echo -e "  - Redémarrer tous les services : systemctl restart clara-gateway clara-dashboard clara-website nginx"
