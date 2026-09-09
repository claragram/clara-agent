# 📌 RÉSUMÉ DE PRODUCTION CLARASHIP (Mémoire Permanente)

Ce document résume l'architecture, la configuration et les commandes clés pour déployer et administrer Claraship en production publique.

---

## 1. Identité & Domaines Publics
- **Plateforme** : Claraship (Agent IA Autonome multi-modèles)
- **Contact & Support** : hey@claraship.com
- **Communauté Discord** : https://discord.gg/j9vzaxnsg
- **Sous-domaines et Routage Réseau** :
  - `claraship.com` & `www.claraship.com` ➔ Site vitrine & Documentation statique Docusaurus (EN, FR, ZH) + Téléchargements desktop (`/downloads/`).
  - `portal.claraship.com` ➔ Dashboard de contrôle & Chat interactif React 19 (`clara-core:9119`).
  - `api.claraship.com` ➔ Passerelle API REST, WebSockets (`/api/pty`) et Streaming SSE (`/api/chat`).

---

## 2. Spécifications du Serveur Cloud Recommandé
- **OS** : Ubuntu 24.04 LTS (x86_64 ou ARM64).
- **Dimensionnement idéal** : 4 vCPU, 8 Go RAM, 80 Go NVMe (ex: Hetzner CPX31 à ~12-14 €/mois, OVH VPS-2, ou Scaleway).
- **Pourquoi pas de GPU coûteux ?** : L'inférence neuronale lourde est déléguée aux APIs externes (OpenRouter / DeepSeek-V4 Flash / Anthropic). La VM gère l'orchestration, les outils, le backend FastAPI et la persistance.

---

## 3. Stack Technique de Production
- **Reverse Proxy** : Caddy 2 (`deploy/Caddyfile.prod`)
  - Certificats SSL Let's Encrypt / ZeroSSL 100% automatiques.
  - HTTP/3 (QUIC), compression Zstd/Gzip, en-têtes de sécurité HSTS.
- **Backend & Agent Core** : Dockerfile Debian 13.4 + SQLite 3.53.4 sécurisé WAL + s6-overlay.
- **Persistance des données** : Volume Docker `claraship_data` pointant sur `/opt/data` (`~/.clara` : bases SQLite, sessions, compétences, clés, logs).
- **Sauvegarde automatique** : Script `deploy/backup.sh` (snapshot à chaud SQLite, rétention 14 jours).

---

## 4. Procédure de Déploiement en 2 Étapes

### Étape 1 : Initialisation de la VM vierge (en root)
```bash
curl -fsSL https://raw.githubusercontent.com/claraship/clara-agent/main/deploy/setup-host.sh | bash
```
*(Installe Docker, Docker Compose, UFW Firewall 22/80/443, Fail2ban, 4 Go swap et tuning sysctl)*

### Étape 2 : Déploiement de l'application
```bash
git clone https://github.com/claraship/clara-agent.git /opt/claraship
cd /opt/claraship
cp .env.production.example .env.production
nano .env.production   # Configurer DOMAIN=claraship.com et OPENROUTER_API_KEY
bash deploy/deploy.sh
```

---

## 5. Commandes d'Exploitation & Maintenance
- **Logs en direct** : `docker compose -f docker-compose.prod.yml logs -f`
- **Mise à jour sans coupure** : `bash deploy/deploy.sh --pull`
- **Lancer une sauvegarde manuelle** : `bash deploy/backup.sh`
- **Automatisation cron (sauvegarde nocturne)** :
  ```cron
  0 3 * * * /opt/claraship/deploy/backup.sh >> /var/log/claraship-backup.log 2>&1
  ```
