#!/usr/bin/env bash
# ==============================================================================
# Legacy redirect script -> delegates to deploy-claraship-vps.sh
# ==============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Redirecting to deploy-claraship-vps.sh..."
exec bash "${SCRIPT_DIR}/deploy-claraship-vps.sh" "$@"
