#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🛑 Stopping Claraship Sandbox Services..."
sudo "$PROJECT_ROOT/bin/caddy" stop 2>/dev/null || true
echo "✅ Caddy proxy stopped."

# Kill any process listening on 3010 (Docusaurus)
DOC_PID=$(lsof -ti :3010 2>/dev/null || true)
if [ -n "$DOC_PID" ]; then
    kill -9 $DOC_PID 2>/dev/null || true
    echo "✅ Website server (port 3010) stopped."
fi

echo "🎉 All Claraship sandbox services stopped."

