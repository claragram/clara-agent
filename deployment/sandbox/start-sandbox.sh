#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "============================================================"
echo "🚢 Claraship Pro Sandbox Initializer (Local Host / VM)"
echo "============================================================"

# 1. Check /etc/hosts
if ! grep -q "claraship.com" /etc/hosts; then
    echo "📝 Adding claraship.com entries to /etc/hosts..."
    sudo sh -c 'echo "
# Claraship Local Sandbox
127.0.0.1 claraship.com www.claraship.com portal.claraship.com agent.claraship.com api.claraship.com" >> /etc/hosts'
    echo "✅ /etc/hosts updated!"
else
    echo "✅ /etc/hosts already configured for claraship.com"
fi

# 2. Ensure Clara Dashboard is running on port 9119
if ! curl -s http://127.0.0.1:9119/api/health >/dev/null 2>&1; then
    echo "⚙️ Starting Clara Dashboard on port 9119..."
    nohup .venv/bin/python -m clara_cli.main dashboard --skip-build --no-open --port 9119 > /tmp/clara-dashboard.log 2>&1 < /dev/null &
    sleep 2
fi
echo "✅ Clara Dashboard active on http://127.0.0.1:9119"

# 3. Ensure Documentation Website is running on port 3010
if ! curl -s http://127.0.0.1:3010/docs/ >/dev/null 2>&1; then
    echo "⚙️ Starting Claraship Website on port 3010..."
    (cd website && nohup npx docusaurus serve --port 3010 --host 127.0.0.1 --no-open > /tmp/clara-website.log 2>&1 < /dev/null &)
    sleep 2
fi
echo "✅ Claraship Website active on http://127.0.0.1:3010"

# 4. Start Caddy Reverse Proxy on Port 80 & 443
echo "🚀 Starting Caddy Reverse Proxy for claraship.com..."
sudo "$PROJECT_ROOT/bin/caddy" start --config "$SCRIPT_DIR/Caddyfile"

echo ""
echo "============================================================"
echo "🎉 Claraship Sandbox is LIVE on your Mac Host / VM!"
echo "============================================================"
echo "👉 Dashboard: https://portal.claraship.com (or http://portal.claraship.com)"
echo "👉 API:       https://api.claraship.com (or http://api.claraship.com)"
echo "👉 Website:   https://claraship.com (or http://claraship.com)"
echo "============================================================"

