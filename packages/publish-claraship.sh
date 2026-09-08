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
echo "🏢 Target Organization: @claraship"
echo "============================================================"

# If no OTP was provided via argument and stdin is a terminal, prompt for it
if [ -z "$OTP" ] && [ -t 0 ]; then
  echo "🔐 npm account requires Two-Factor Authentication (2FA) to publish packages."
  echo "📲 Open your Authenticator app (Google Authenticator, Authy, 1Password, etc.)"
  read -p "Enter 6-digit 2FA / OTP Code: " input_otp
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

  local attempt=1
  while [ $attempt -le 3 ]; do
    local publish_cmd="npm publish --access public --ignore-scripts"
    if [ -n "$OTP" ]; then
      publish_cmd="$publish_cmd --otp=$OTP"
    fi

    echo "⏳ Running: $publish_cmd"
    if $publish_cmd; then
      echo "✅ Live at: https://www.npmjs.com/package/${name}"
      return 0
    else
      echo ""
      echo "⚠️ Publish failed for ${name} (likely requires 2FA or code expired)."
      if [ -t 0 ]; then
        echo "📲 Please enter a fresh 6-digit code from your Authenticator app:"
        read -p "2FA / OTP Code: " OTP
        attempt=$((attempt + 1))
      else
        echo "❌ Cannot prompt in non-interactive mode. Please pass --otp=XXXXXX."
        return 1
      fi
    fi
  done

  echo "❌ Failed to publish ${name} after 3 attempts."
  return 1
}

case "$TARGET" in
  image-size|@claraship/image-size)
    publish_pkg "image-size"
    ;;
  ui|@claraship/ui)
    publish_pkg "ui"
    ;;
  clara|@claraship/clara)
    publish_pkg "clara"
    ;;
  all|--all)
    echo "🚀 Publishing all Claraship packages..."
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
echo "🎉 All requested packages published to @claraship successfully!"
echo "🏢 View organization: https://www.npmjs.com/org/claraship"
echo "============================================================"
