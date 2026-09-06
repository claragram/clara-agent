#!/usr/bin/env bash
set -e

PACKAGE_DIR="$(cd "$(dirname "$0")/image-size" && pwd)"
cd "$PACKAGE_DIR"

PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")

echo "============================================================"
echo "🚀 Publishing ${PACKAGE_NAME}@${PACKAGE_VERSION} to npm"
echo "   Organization Scope: @claragram"
echo "============================================================"

# Check npm authentication
CURRENT_USER=$(npm whoami 2>/dev/null || true)
if [ -z "$CURRENT_USER" ]; then
  echo ""
  echo "🔑 You are not currently logged in to npm."
  echo "👉 Please log in using your npm account (claraportal):"
  npm login
  CURRENT_USER=$(npm whoami)
fi

echo "👤 Authenticated as npm user: ${CURRENT_USER}"
echo ""

# Publish the package with public access (required for scoped open-source packages)
echo "📦 Publishing ${PACKAGE_NAME}@${PACKAGE_VERSION}..."
npm publish --access public --ignore-scripts

echo ""
echo "🎉 SUCCESS!"
echo "✅ Package is live on npm: https://www.npmjs.com/package/${PACKAGE_NAME}"
echo "============================================================"
