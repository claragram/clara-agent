#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Check npm authentication once
CURRENT_USER=$(npm whoami 2>/dev/null || true)
if [ -z "$CURRENT_USER" ]; then
  echo "============================================================"
  echo "🔑 Authentication Required"
  echo "👉 Please log in to npm using your account (claraportal):"
  echo "============================================================"
  npm login
  CURRENT_USER=$(npm whoami)
fi

echo "============================================================"
echo "👤 Authenticated as npm user: ${CURRENT_USER}"
echo "🏢 Target Organization: @claragram"
echo "============================================================"

publish_pkg() {
  local dir="$1"
  if [ ! -d "$SCRIPT_DIR/$dir" ]; then
    echo "❌ Error: Directory $SCRIPT_DIR/$dir not found."
    return 1
  fi

  cd "$SCRIPT_DIR/$dir"
  local name=$(node -p "require('./package.json').name")
  local version=$(node -p "require('./package.json').version")

  echo ""
  echo "------------------------------------------------------------"
  echo "📦 Packaging & Publishing: ${name}@${version}"
  echo "------------------------------------------------------------"
  npm publish --access public --ignore-scripts
  echo "✅ Live at: https://www.npmjs.com/package/${name}"
}

TARGET="${1:-all}"

case "$TARGET" in
  image-size|@claragram/image-size)
    publish_pkg "image-size"
    ;;
  ui|@claragram/ui)
    publish_pkg "ui"
    ;;
  clara|@claragram/clara)
    publish_pkg "clara"
    ;;
  all|--all)
    echo "🚀 Publishing all Claragram packages..."
    publish_pkg "image-size"
    publish_pkg "ui"
    publish_pkg "clara"
    ;;
  *)
    echo "Usage: $0 [image-size | ui | clara | all]"
    exit 1
    ;;
esac

echo ""
echo "============================================================"
echo "🎉 All requested packages published to @claragram successfully!"
echo "🏢 View organization: https://www.npmjs.com/org/claragram"
echo "============================================================"
