#!/usr/bin/env bash
# ==============================================================================
# Claraship Zero-Downtime Deployment & Update Script
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

ENV_FILE=".env.production"
COMPOSE_FILE="docker-compose.prod.yml"

if [ ! -f "${ENV_FILE}" ]; then
  if [ -f ".env.production.example" ]; then
    echo "[-] ${ENV_FILE} not found! Creating from .env.production.example..."
    cp .env.production.example "${ENV_FILE}"
    echo "[!] Please edit ${ENV_FILE} with your actual domain and API keys before running again."
    exit 1
  else
    echo "[-] Error: ${ENV_FILE} is missing."
    exit 1
  fi
fi

# Optional git pull if requested with --pull or -p
if [[ "${1:-}" =~ ^(-p|--pull)$ ]]; then
  echo "[+] Pulling latest changes from git origin/main..."
  git fetch origin main
  git reset --hard origin/main
fi

echo "[+] Building Claraship production container images..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" build

echo "[+] Deploying containers with zero-downtime rolling restart..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d --remove-orphans

echo "[+] Waiting for Claraship Core to become healthy..."
MAX_WAIT=60
COUNTER=0
HEALTHY=false

while [ $COUNTER -lt $MAX_WAIT ]; do
  STATUS=$(docker inspect --format='{{json .State.Health.Status}}' claraship-core 2>/dev/null || echo '"unknown"')
  if [ "$STATUS" = '"healthy"' ]; then
    HEALTHY=true
    break
  fi
  COUNTER=$((COUNTER + 3))
  echo "    Waiting for claraship-core ($COUNTER / $MAX_WAIT s, status: $STATUS)..."
  sleep 3
done

if [ "$HEALTHY" = true ]; then
  echo "[✓] Clara Core is healthy!"
else
  echo "[!] Warning: Container did not report healthy within $MAX_WAIT seconds."
  echo "    Showing recent logs:"
  docker logs --tail 30 claraship-core
fi

# Clean up dangling build layers to conserve disk space
echo "[+] Cleaning up dangling Docker images..."
docker image prune -f > /dev/null 2>&1 || true

DOMAIN=$(grep -E '^DOMAIN=' "${ENV_FILE}" | cut -d '=' -f2 | tr -d ' "' || echo "claraship.com")

echo ""
echo "=========================================================================="
echo " [✓] Claraship Production Deployment Complete!"
echo "=========================================================================="
echo " Active Services:"
echo " - Documentation & Landing:  https://${DOMAIN}"
echo " - Agent Web Dashboard:      https://portal.${DOMAIN}"
echo " - REST / SSE API Gateway:   https://api.${DOMAIN}"
echo "=========================================================================="
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" ps
echo "=========================================================================="
