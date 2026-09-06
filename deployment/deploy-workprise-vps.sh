#!/usr/bin/env bash
# ==============================================================================
# Legacy redirect script -> delegates to deploy-claragram-vps.sh
# ==============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Redirecting to deploy-claragram-vps.sh..."
exec bash "${SCRIPT_DIR}/deploy-claragram-vps.sh" "$@"
