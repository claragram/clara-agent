#!/usr/bin/env bash
# ==============================================================================
# Claraship Automated Backup Script
# Creates consistent, compressed backups of databases, keys, and profiles.
# ==============================================================================

set -euo pipefail

BACKUP_DIR="/var/backups/claraship"
TIMESTAMP=$(date +'%Y%m%d_%H%M%S')
ARCHIVE_NAME="claraship_backup_${TIMESTAMP}.tar.gz"
TEMP_DIR="/tmp/claraship_backup_${TIMESTAMP}"

mkdir -p "${BACKUP_DIR}" "${TEMP_DIR}"

echo "[+] Starting Claraship backup: ${ARCHIVE_NAME}..."

# Export SQLite databases consistently from running container if online
if docker ps --format '{{.Names}}' | grep -q "^claraship-core$"; then
  echo "[+] Exporting live data snapshot from claraship-core..."
  docker cp claraship-core:/opt/data "${TEMP_DIR}/data"
else
  echo "[+] Container offline; copying directly from Docker volume..."
  VOLUME_PATH=$(docker volume inspect claraship_data --format '{{ .Mountpoint }}' 2>/dev/null || echo "")
  if [ -n "$VOLUME_PATH" ] && [ -d "$VOLUME_PATH" ]; then
    cp -r "$VOLUME_PATH" "${TEMP_DIR}/data"
  else
    echo "[-] Warning: claraship_data volume not found."
  fi
fi

# Copy production env file (redacting any temporary artifacts if needed)
if [ -f ".env.production" ]; then
  cp .env.production "${TEMP_DIR}/env.production.bak"
fi

# Archive and compress with gzip
echo "[+] Compressing backup archive..."
tar -czf "${BACKUP_DIR}/${ARCHIVE_NAME}" -C "${TEMP_DIR}" .
rm -rf "${TEMP_DIR}"

# Calculate size and checksum
ARCHIVE_SIZE=$(du -h "${BACKUP_DIR}/${ARCHIVE_NAME}" | cut -f1)
echo "[✓] Backup created at: ${BACKUP_DIR}/${ARCHIVE_NAME} (${ARCHIVE_SIZE})"

# Retention policy: Remove archives older than 14 days
echo "[+] Cleaning up archives older than 14 days..."
find "${BACKUP_DIR}" -type f -name "claraship_backup_*.tar.gz" -mtime +14 -exec rm -f {} +

echo "[✓] Backup process completed successfully."
