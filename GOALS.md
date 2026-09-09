# Claraship - Objectifs & Roadmap Active

## 🎯 Objectif Principal : Déploiement en Production Publique (Cloud VM)
**Statut** : Stack prête et versionnée (`origin/main`), en attente du serveur Cloud VPS.

### Spécifications & Livrables :
- [x] Résolution du crash d'hydratation React 19 sur `portal.claraship.com`.
- [x] Conteneurisation de production multi-services : `docker-compose.prod.yml`.
- [x] Configuration Caddy 2 avec certificats automatiques Let's Encrypt : `deploy/Caddyfile.prod`.
- [x] Script d'initialisation Ubuntu automatisé : `deploy/setup-host.sh`.
- [x] Script de déploiement et mise à jour sans coupure : `deploy/deploy.sh`.
- [x] Script de sauvegarde à chaud avec rétention : `deploy/backup.sh`.
- [x] Manuel de production et guide de dimensionnement : `docs/PRODUCTION_DEPLOYMENT.md`.

### Déploiement sur le serveur cible (dès obtention de la VM) :
1. Exécution de `curl -fsSL .../setup-host.sh | bash`.
2. Configuration de `.env.production` avec la clé API OpenRouter et le domaine `claraship.com`.
3. Lancement via `bash deploy/deploy.sh`.
4. Pointage des DNS A records (`@`, `www`, `portal`, `api`) vers l'IP publique de la VM.
