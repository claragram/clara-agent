#!/usr/bin/env bash
# ==============================================================================
# ☤ Clara Agent & Claraship: Unified Master Control & Dev Orchestrator
# ==============================================================================
# Usage:
#   ./dev-control.sh <command>
#
# Commands:
#   cli         Launch interactive CLI / REPL session
#   api         Start OpenAI-compatible API Server (port 8642)
#   gateway     Start Multi-Platform Gateway (Telegram, Discord, Slack, etc.)
#   web         Start Web Dashboard in dev mode (Vite, port 5173)
#   web:build   Build production static assets for Web Dashboard
#   docs        Start Documentation Portal (Docusaurus, port 3000)
#   docs:build  Build static Documentation site
#   desktop     Start Desktop App in development mode (Electron)
#   desktop:pkg Package Desktop App (macOS / Linux / Windows)
#   docker:up   Start Docker Compose production/sandbox container
#   docker:down Stop Docker Compose containers
#   docker:dev  Launch interactive container development sandbox
#   test        Run Python and JS test suites
#   doctor      Run environment health checks & diagnostics
#   build-all   Build all frontend, web, and backend targets
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Virtualenv helper
activate_venv() {
  if [ -d "$HOME/.clara/venvs/clara-dev" ]; then
    source "$HOME/.clara/venvs/clara-dev/bin/activate"
  elif [ -d ".venv" ]; then
    source ".venv/bin/activate"
  fi
}

print_header() {
  echo ""
  echo "======================================================================"
  echo " ☤ Clara Agent / Claraship: $1"
  echo "======================================================================"
  echo ""
}

case "${1:-help}" in
  cli)
    print_header "Launching Interactive Terminal REPL"
    activate_venv
    python cli.py "${@:2}"
    ;;

  api)
    print_header "Starting OpenAI-Compatible API Server on port 8642"
    activate_venv
    API_SERVER_ENABLED=true API_SERVER_HOST=0.0.0.0 API_SERVER_PORT=8642 python cli.py gateway run --no-supervise "${@:2}"
    ;;

  gateway)
    print_header "Starting Multi-Platform Gateway Daemon"
    activate_venv
    python cli.py gateway run "${@:2}"
    ;;

  web)
    print_header "Starting Web Dashboard (Vite Dev Server)"
    cd "$SCRIPT_DIR/web"
    npm run dev
    ;;

  web:build)
    print_header "Building Web Dashboard Static Assets"
    cd "$SCRIPT_DIR/web"
    npm run build
    ;;

  docs)
    print_header "Starting Docusaurus Documentation Server on http://localhost:3000"
    cd "$SCRIPT_DIR/website"
    npm start
    ;;

  docs:build)
    print_header "Building Documentation Static Site"
    cd "$SCRIPT_DIR/website"
    npm run build
    ;;

  desktop)
    print_header "Starting Electron Desktop Application"
    cd "$SCRIPT_DIR/apps/desktop"
    npm run dev
    ;;

  desktop:pkg)
    print_header "Packaging Electron Desktop Application"
    cd "$SCRIPT_DIR/apps/desktop"
    npm run dist
    ;;

  docker:up)
    print_header "Starting Containerized Clara Stack via Docker Compose"
    CLARA_UID=$(id -u) CLARA_GID=$(id -g) docker compose up -d
    docker compose ps
    ;;

  docker:down)
    print_header "Stopping Docker Compose Stack"
    docker compose down
    ;;

  docker:dev)
    print_header "Launching Interactive Container Development Sandbox"
    docker run -it --rm \
      --name clara-dev-sandbox \
      -v "$SCRIPT_DIR":/opt/clara-src \
      -v "$HOME/.clara":/opt/data \
      -w /opt/clara-src \
      claraship/clara-agent bash
    ;;

  test)
    print_header "Running Pytest & JS Test Suites"
    activate_venv
    pytest tests/ -v
    ;;

  doctor)
    print_header "Running Clara Diagnostics"
    activate_venv
    python cli.py doctor
    ;;

  build-all)
    print_header "Building All Frontend, Web, and Backend Targets"
    activate_venv
    echo "[1/3] Building Web Dashboard..."
    (cd "$SCRIPT_DIR/web" && npm run build)
    echo "[2/3] Building Documentation Portal..."
    (cd "$SCRIPT_DIR/website" && npm run build)
    echo "[3/3] Verifying Python Package..."
    python -m compileall run_agent.py cli.py gateway/ agent/ tools/ plugins/ -q
    echo "✅ All targets built successfully!"
    ;;

  *)
    echo "☤ Clara Agent / Claraship Orchestration Script"
    echo ""
    echo "Usage: ./dev-control.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  cli          - Open interactive terminal REPL / TUI"
    echo "  api          - Start OpenAI-compatible API server (port 8642)"
    echo "  gateway      - Start multi-platform gateway (Telegram, Discord, Slack, etc.)"
    echo "  web          - Start Web Dashboard dev server (Vite, port 5173)"
    echo "  web:build    - Build Web Dashboard static bundle (into clara_cli/web_dist/)"
    echo "  docs         - Start documentation server (Docusaurus, port 3000)"
    echo "  docs:build   - Build documentation static website"
    echo "  desktop      - Launch Electron Desktop app in dev mode"
    echo "  desktop:pkg  - Package Desktop application installer"
    echo "  docker:up    - Start Docker Compose background service"
    echo "  docker:down  - Stop Docker Compose services"
    echo "  docker:dev   - Drop into an isolated interactive Docker development sandbox"
    echo "  test         - Run unit & integration test suites"
    echo "  doctor       - Run environment diagnostics"
    echo "  build-all    - Build all frontend, web, docs, and backend artifacts"
    echo ""
    exit 0
    ;;
esac
