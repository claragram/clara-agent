#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

OTP=""
TARGET="all"

# Parse arguments: target (all, image-size, ui, clara) and --otp=XXXXXX or 6-digit code
for arg in "$@"; do
  case "$arg" in
    --otp=*)
      OTP="${arg#*=}"
      ;;
    image-size|ui|clara|all)
      TARGET="$arg"
      ;;
    [0-9][0-9][0-9][0-9][0-9][0-9])
      OTP="$arg"
      ;;
  esac
done

# Check npm authentication
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

# If no OTP was provided via argument and stdin is a terminal, prompt for it
if [ -z "$OTP" ] && [ -t 0 ]; then
  echo "🔐 If your npm account has 2FA enabled, enter your 6-digit authenticator code."
  read -p "2FA / OTP Code (press enter to skip if 2FA not enabled): " input_otp
  OTP="$input_otp"
fi

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
  
  if [ -n "$OTP" ]; then
    npm publish --access public --ignore-scripts --otp="$OTP"
  else
    npm publish --access public --ignore-scripts
  fi
  echo "✅ Live at: https://www.npmjs.com/package/${name}"
}

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
    echo "Usage: $0 [image-size | ui | clara | all] [--otp=123456]"
    exit 1
    ;;
esac

echo ""
echo "============================================================"
echo "🎉 All requested packages published to @claragram successfully!"
echo "🏢 View organization: https://www.npmjs.com/org/claragram"
echo "============================================================"
