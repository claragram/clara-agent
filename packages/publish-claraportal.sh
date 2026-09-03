#!/usr/bin/env bash
set -e

echo "🚀 Preparing to publish @claraportal/image-size to npm..."

cd "$(dirname "$0")/image-size"

# Check if logged in
if ! npm whoami &>/dev/null; then
  echo "🔑 Please log in to your npm account (claraportal):"
  npm login
fi

echo "📦 Publishing @claraportal/image-size@2.0.3..."
npm publish --access public --ignore-scripts

echo "✅ Published successfully to https://www.npmjs.com/package/@claraportal/image-size"
