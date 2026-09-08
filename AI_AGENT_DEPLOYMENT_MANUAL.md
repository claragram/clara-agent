# ☤ AI Agent Operating Manual: Autonomous Deployment, Orchestration & Reverse-Engineering

> **Document Purpose**: This operational runbook is designed for autonomous AI coding agents (Antigravity, Codex, Cursor, Claude Code, etc.) to reliably inspect, bootstrap, deploy, build, debug, and reverse-engineer the **Clara Agent & Claraship** ecosystem without human intervention.

---

## 📑 Table of Contents

1. [Agent Pre-Flight Checklist & System Invariants](#1-agent-pre-flight-checklist--system-invariants)
2. [Environment Architecture & Path Layout](#2-environment-architecture--path-layout)
3. [Autonomous Setup & Bootstrap Sequence](#3-autonomous-setup--bootstrap-sequence)
4. [Deployment Scenarios & Target Runbooks](#4-deployment-scenarios--target-runbooks)
   - [Scenario A: Local Development & Reverse Engineering](#scenario-a-local-development--reverse-engineering)
   - [Scenario B: Production Headless Gateway on VPS / Server](#scenario-b-production-headless-gateway-on-vps--server)
   - [Scenario C: OpenAI-Compatible API Server](#scenario-c-openai-compatible-api-server)
   - [Scenario D: Web Dashboard & Documentation Portal](#scenario-d-web-dashboard--documentation-portal)
   - [Scenario E: Electron Desktop Application](#scenario-e-electron-desktop-application)
5. [Database Operations & Self-Healing Protocol](#5-database-operations--self-healing-protocol)
6. [Master Orchestrator Script Reference (`./dev-control.sh`)](#6-master-orchestrator-script-reference-dev-controlsh)
7. [Verification & Health Diagnostic Battery](#7-verification--health-diagnostic-battery)
8. [Automated Troubleshooting & Error Recovery Matrix](#8-automated-troubleshooting--error-recovery-matrix)

---

## 1. Agent Pre-Flight Checklist & System Invariants

When an AI agent initializes inside this repository, it MUST verify the following invariants before executing commands:

### Critical Invariants:
1. **Virtualenv Placement Rule**:
   - **NEVER** create the Python virtual environment inside the repository root (e.g. `./venv` or `.venv`).
   - An active agent running shell commands during turns may execute relative directory wipes (`rm -rf venv` or `uv venv`), which silently destroys the active runtime.
   - **MANDATORY PATH**: Store virtualenvs in `~/.clara/venvs/clara-dev`.

2. **Node.js Architecture Matching (macOS vs Linux)**:
   - On macOS Darwin (ARM64 `arm64`), verify that `node` and `npm` are Mach-O binaries (`/opt/homebrew/bin/node`), **NOT** Linux ELF binaries (`ELF 64-bit LSB executable, ARM aarch64`).
   - If symlinks in `~/.local/bin/node` point to an ELF binary, re-link to `/opt/homebrew/bin/node`.

3. **Data Persistence Boundary**:
   - User credentials, sessions, memories, and SQLite stores live in `~/.clara/` (or `/opt/data` inside Docker).
   - Core application code lives in the repository root (or `/opt/clara` inside Docker).
   - Never overwrite `~/.clara/config.yaml` or `~/.clara/.env` without preserving existing keys.

---

## 2. Environment Architecture & Path Layout

```
/Users/<user>/.../clara-agent-main/          # Repository Source Root (Immutable in Production)
├── run_agent.py                            # AIAgent Conversation Loop & State Machine
├── cli.py                                  # CLI / REPL / TUI Entrypoint
├── clara_state.py                         # SQLite Session Engine with FTS5 Search
├── dev-control.sh                          # Unified Master Orchestrator Script
├── CLARA_ARCHITECTURE_INDEX.md            # Complete Architectural Specification
│
├── agent/                                  # Prompt Builders, Context Compression, Display
├── gateway/                                # Supervised Platform Gateway Daemon & Control Sockets
│   └── platforms/                          # API Server, Telegram, Discord, Slack, WhatsApp, Signal
├── tools/                                  # Self-Registering Tools (@register_tool) & Guardrails
│   └── environments/                       # Sandboxes: Local, Docker, Modal, Daytona, Singularity
├── plugins/                                # Memory Backends (Honcho, Mem0), Auth, Media
├── web/                                    # React 19 + Vite Web Dashboard (Port 9119 / 5173)
├── website/                                # Docusaurus 3 Documentation Portal (Port 3000)
└── apps/desktop/                           # Cross-Platform Electron Desktop Application

~/.clara/                                  # Mutable User State & Configuration Volume
├── .env                                    # API Keys (OpenAI, OpenRouter, Clara Portal, etc.)
├── config.yaml                             # Global Clara Configuration & Guardrails
├── clara.db / state.db                    # SQLite Session Trajectories & FTS5 Index
├── sessions/                               # Raw Conversation Logs
├── memories/                               # Fact Stores & Semantic Vectors
├── skills/                                 # Autonomous & User Skills
└── venvs/clara-dev/                       # Dedicated Python 3.11+ Virtual Environment
```

---

## 3. Autonomous Setup & Bootstrap Sequence

To prepare a completely clean environment from scratch, the AI agent must execute this deterministic sequence:

### Step 1: Detect OS & Prepare Node.js
```bash
# Check OS and Architecture
uname -sm

# On macOS, ensure native Homebrew Node/npm is prioritized
if [[ "$OSTYPE" == "darwin"* ]]; then
  ln -sf /opt/homebrew/bin/node ~/.local/bin/node 2>/dev/null || true
  ln -sf /opt/homebrew/bin/npm ~/.local/bin/npm 2>/dev/null || true
  ln -sf /opt/homebrew/bin/npx ~/.local/bin/npx 2>/dev/null || true
fi

node -v && npm -v
```

### Step 2: Initialize Git Metadata (If missing)
```bash
if [ ! -d ".git" ]; then
  git init
  git remote add origin https://github.com/claraship/clara-agent.git
  git fetch origin main --tags
  git reset --hard origin/main
fi
```

### Step 3: Provision Isolated Python Virtual Environment
```bash
mkdir -p ~/.clara/venvs

# Create venv using uv (Python 3.11 to 3.13)
uv venv ~/.clara/venvs/clara-dev --python 3.11
source ~/.clara/venvs/clara-dev/bin/activate

# Install editable package with all development and messaging extras
uv pip install -e ".[all,dev]"
```

### Step 4: Install JS Workspaces & Build Frontends
```bash
# Root and Workspace dependencies
npm install

# Build Web Dashboard into clara_cli/web_dist/
cd web && npm run build && cd ..

# Build Website Documentation
cd website && npm install && npm run build && cd ..
```

---

## 4. Deployment Scenarios & Target Runbooks

### Scenario A: Local Development & Reverse Engineering
Use this mode when modifying agent logic, debugging tool dispatch, or inspecting prompt construction.

1. **Activate Virtualenv**:
   ```bash
   source ~/.clara/venvs/clara-dev/bin/activate
   ```
2. **Launch Interactive CLI REPL**:
   ```bash
   ./dev-control.sh cli
   ```
3. **Execute Single-Turn Query with Trace Logs**:
   ```bash
   CLARA_LOG_LEVEL=DEBUG python cli.py chat -q "List active tools"
   ```
4. **Launch Live-Reload Web Dashboard**:
   ```bash
   ./dev-control.sh web
   # Accessible at http://localhost:5173 (proxies to agent backend)
   ```

---

### Scenario B: Production Headless Gateway on VPS / Server
Use this mode to deploy a persistent 24/7 background agent connected to Telegram, Discord, Slack, and Webhooks.

1. **Create Data Directory & Initial Config**:
   ```bash
   mkdir -p ~/.clara
   cp cli-config.yaml.example ~/.clara/config.yaml
   touch ~/.clara/.env
   ```
2. **Configure Production Guardrails (`~/.clara/config.yaml`)**:
   ```yaml
   approvals:
     mode: smart                     # 'smart' assesses risk via LLM; 'manual' prompts
     timeout: 300
     cron_mode: deny                 # Block unapproved dangerous commands in cron
     unattended_mode: deny           # Block dangerous commands on webhooks/API server

   tool_loop_guardrails:
     hard_stop_enabled: true
     hard_stop_after:
       exact_failure: 5
       idempotent_no_progress: 5
   ```
3. **Start Container Stack via Docker Compose**:
   ```bash
   CLARA_UID=$(id -u) CLARA_GID=$(id -g) docker compose up -d
   ```
4. **Monitor Supervisor Logs**:
   ```bash
   docker logs -f clara
   ```

---

### Scenario C: OpenAI-Compatible API Server
Use this mode to expose Clara as an OpenAI drop-in endpoint for Open WebUI, LobeChat, or external LLM pipelines.

1. **Start Server on Port 8642**:
   ```bash
   source ~/.clara/venvs/clara-dev/bin/activate
   API_SERVER_ENABLED=true \
   API_SERVER_HOST=0.0.0.0 \
   API_SERVER_PORT=8642 \
   API_SERVER_KEY="your-secret-key-min-8-chars" \
   python cli.py gateway run --no-supervise
   ```
2. **Verify Health Endpoint**:
   ```bash
   curl -f http://127.0.0.1:8642/health
   ```
3. **Test Completion via cURL**:
   ```bash
   curl http://127.0.0.1:8642/v1/chat/completions \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-secret-key-min-8-chars" \
     -d '{
       "model": "clara",
       "messages": [{"role": "user", "content": "Explain quantum entanglement in one sentence."}],
       "stream": false
     }'
   ```

---

### Scenario D: Web Dashboard & Documentation Portal

1. **Serve Static Web Dashboard (Production Mode)**:
   ```bash
   # Built into clara_cli/web_dist/ and served by the Gateway
   python cli.py dashboard --host 127.0.0.1 --port 9119 --no-open
   ```
2. **Serve Documentation Portal (Docusaurus)**:
   ```bash
   cd website && npm start
   # Accessible at http://localhost:3000
   ```

---

### Scenario E: Electron Desktop Application

1. **Launch Desktop App in Dev Mode**:
   ```bash
   cd apps/desktop && npm run dev
   ```
2. **Package Standalone Desktop Installer**:
   ```bash
   cd apps/desktop
   npm run dist:mac    # macOS (.dmg / .zip)
   npm run dist:linux  # Linux (.AppImage / .deb)
   npm run dist:win    # Windows (.nsis / .msi)
   ```

---

## 5. Database Operations & Self-Healing Protocol

Clara stores session trees, trajectories, and full-text search indexes in `~/.clara/state.db` (SQLite + WAL + FTS5).

### Diagnostic & Repair Commands:

```bash
# 1. Check Integrity
sqlite3 ~/.clara/state.db "PRAGMA integrity_check;"

# 2. Automated Recovery Procedure for Corrupted Disk Image (Error 11)
cp ~/.clara/state.db ~/.clara/state.db.bak
sqlite3 ~/.clara/state.db ".recover" | sqlite3 ~/.clara/state.db.recovered
mv ~/.clara/state.db.recovered ~/.clara/state.db

# 3. Clean Stale WAL Locks & Vacuum
rm -f ~/.clara/state.db-wal ~/.clara/state.db-shm
sqlite3 ~/.clara/state.db "VACUUM;"

# 4. Verify Final State
sqlite3 ~/.clara/state.db "PRAGMA integrity_check;"
# MUST RETURN: ok
```

---

## 6. Master Orchestrator Script Reference (`./dev-control.sh`)

The root [`dev-control.sh`](file:///Users/elhamaida-marouan/AI-Projects/claraship/clara-agent-main/dev-control.sh) script provides standard execution entry points for agents:

| Command | Action Executed |
|---|---|
| `./dev-control.sh cli` | Launches interactive terminal REPL with active virtualenv |
| `./dev-control.sh api` | Starts OpenAI API server on `0.0.0.0:8642` |
| `./dev-control.sh gateway` | Starts multi-platform supervised messaging daemon |
| `./dev-control.sh web` | Starts Vite dev server for Web Dashboard on port 5173 |
| `./dev-control.sh web:build` | Compiles Web Dashboard static production assets |
| `./dev-control.sh docs` | Starts Docusaurus documentation portal on port 3000 |
| `./dev-control.sh docs:build` | Compiles documentation static website |
| `./dev-control.sh desktop` | Starts Electron Desktop application in dev mode |
| `./dev-control.sh desktop:pkg` | Packages standalone Electron distribution |
| `./dev-control.sh docker:up` | Starts Docker Compose container stack |
| `./dev-control.sh docker:dev` | Drops into an interactive container dev sandbox |
| `./dev-control.sh test` | Executes Pytest test suites |
| `./dev-control.sh doctor` | Runs diagnostics on Python, SQLite, and providers |
| `./dev-control.sh build-all` | Compiles all Web, Docs, and Python targets |

---

## 7. Verification & Health Diagnostic Battery

To autonomously verify that a deployed Clara instance is 100% healthy:

```bash
# 1. Activate Environment
source ~/.clara/venvs/clara-dev/bin/activate

# 2. Run Diagnostics
python cli.py doctor

# 3. Execute Smoke Test Query
python cli.py chat -q "Return the word 'SYNCHRONIZED' and nothing else."

# 4. Run Core Pytest Battery
pytest tests/agent/test_prompt_builder.py -v
pytest tests/tools/test_sandbox_failure_hints.py -v
```

---

## 8. Automated Troubleshooting & Error Recovery Matrix

| Symptom / Error | Root Cause | Automated Recovery Action |
|---|---|---|
| `cannot execute binary file: node` | Linux ELF node binary invoked on macOS Darwin | Re-link: `ln -sf /opt/homebrew/bin/node ~/.local/bin/node` |
| `database disk image is malformed (11)` | Corrupted SQLite pages in `state.db` | Run recovery: `sqlite3 ~/.clara/state.db ".recover" \| sqlite3 recovered.db && mv recovered.db ~/.clara/state.db` |
| `fatal: not a git repository` | Cloned folder lacks `.git` metadata | Run `git init && git remote add origin https://github.com/claraship/clara-agent.git && git fetch` |
| `dev-sandbox.sh: unshare/bwrap not found` | Attempting to run Linux namespace sandbox on macOS | Use Docker dev container instead: `./dev-control.sh docker:dev` |
| `Address already in use: 8642` | Port collision on API server | Find & kill process: `lsof -ti:8642 \| xargs kill -9` |
| `Missing API key for provider` | `.env` has no active LLM key | Run `python cli.py setup` or append `OPENROUTER_API_KEY=...` to `~/.clara/.env` |
| `ModuleNotFoundError: clara_...` | Incomplete editable install | Run `uv pip install -e ".[all,dev]"` inside `~/.clara/venvs/clara-dev` |
