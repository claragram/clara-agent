#!/usr/bin/env bash
VPS_HOST="root@187.77.95.117"
TARGET_DIR="/opt/clara-agent"

echo "📦 Syncing Clara Agent & Claragram to $VPS_HOST:$TARGET_DIR..."
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.venv' \
  --exclude '.git' \
  --exclude 'build' \
  --exclude 'dist' \
  --exclude '.docusaurus' \
  --exclude '.cache' \
  --exclude '__pycache__' \
  "$(pwd)/" "$VPS_HOST:$TARGET_DIR/"

echo "✅ Sync complete!"
echo "👉 Next, SSH into your VPS: ssh $VPS_HOST"
echo "👉 Then run: cd $TARGET_DIR && sudo bash deployment/deploy-claragram-vps.sh"
