# ☤ Clara Agent & Workprise: Complete Architectural Blueprint & Ecosystem Index

This document provides an exhaustive, production-grade architectural specification and technical index of the **Clara Agent** platform built by **Workprise**. It covers the agent runtime, API servers, web dashboards, desktop applications, multi-platform gateways, tool execution environments, memory systems, and plugin infrastructure.

---

## 📑 Table of Contents

1. [High-Level Architecture & System Topology](#1-high-level-architecture--system-topology)
2. [Core Agent Runtime (`run_agent.py`, `agent/`, `clara_state.py`)](#2-core-agent-runtime)
3. [API Server & Control IPC (`gateway/platforms/api_server.py`, `gateway/control_socket.py`)](#3-api-server--control-ipc)
4. [Multi-Platform Messaging Gateway (`gateway/`, `gateway/platforms/`)](#4-multi-platform-messaging-gateway)
5. [Web Dashboard & Developer Portal (`web/`, `website/`)](#5-web-dashboard--developer-portal)
6. [Desktop Applications (`apps/desktop/`, `apps/shared/`)](#6-desktop-applications)
7. [Tools Runtime & Execution Sandboxes (`tools/`, `tools/environments/`)](#7-tools-runtime--execution-sandboxes)
8. [Memory & Continuous Learning Subsystem (`plugins/memory/`, `clara_state.py`)](#8-memory--continuous-learning-subsystem)
9. [Plugins, Integrations & Clara Portal (`plugins/`, `providers/`)](#9-plugins-integrations--clara-portal)
10. [Directory Structure & Codebase Inventory](#10-directory-structure--codebase-inventory)
11. [Developer & Reverse-Engineering Reference](#11-developer--reverse-engineering-reference)
12. [Downloadable Dependencies & Weights Catalog](#12-downloadable-dependencies--weights-catalog)

---

## 1. High-Level Architecture & System Topology

```
                                  ┌────────────────────────────────────────┐
                                  │       WORKPRISE PORTAL / API       │
                                  │   (Inference, Models, Data Synthesis)   │
                                  └───────────────────┬────────────────────┘
                                                      │ HTTPS / OAuth2
                                                      ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           CLARA GATEWAY DAEMON                                        │
│                                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                       SUPERVISOR / S6-RC                                       │   │
│   └───────────────────────┬────────────────────────────────────────────────┬───────────────────────┘   │
│                           │                                                │                           │
│   ┌───────────────────────▼────────────────────────┐      ┌────────────────▼───────────────────────┐   │
│   │          OpenAI-Compatible API Server          │      │         Multi-Platform Chat Gateway    │   │
│   │               (Port 8642)                      │      │   • Telegram     • Discord   • Slack   │   │
│   │   • /health             • /v1/models           │      │   • WhatsApp     • Signal    • Weixin  │   │
│   │   • /v1/chat/completions • /v1/runs            │      │   • Teams        • QQBot     • Webhook │   │
│   │   • /v1/rooms/*         • /v1/cron             │      │                                        │   │
│   └───────────────────────┬────────────────────────┘      └────────────────┬───────────────────────┘   │
│                           │                                                │                           │
│   ┌───────────────────────┴────────────────────────────────────────────────┴───────────────────────┐   │
│   │                                    CONTROL & SESSION ENGINE                                    │   │
│   │                     (Session Locking, Multi-Profile Router, State SQLite FTS5)                 │   │
│   └───────────────────────────────────────────────┬────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────┼────────────────────────────────────────────────────┘
                                                    │
         ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
         │                                          │                                          │
┌────────▼──────────────┐                ┌──────────▼────────────┐                  ┌──────────▼────────────┐
│      WEB CLIENT       │                │    DESKTOP CLIENT     │                  │     CLI / TUI REPL    │
│   (React 19 + Vite)   │                │ (Electron + Tray App) │                  │ (prompt_toolkit TUI)  │
│      (Port 9119)      │                │  (Remote Switcher)    │                  │   (Terminal Backend)  │
└───────────────────────┘                └───────────────────────┘                  └───────────────────────┘
                                                    │
                                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        CLARA CORE AGENT RUNTIME                                       │
│                                                                                                        │
│   ┌─────────────────────┐      ┌──────────────────────┐      ┌──────────────────┐      ┌───────────┐   │
│   │   Prompt Builder    │ ───► │  Context Compressor  │ ───► │   AIAgent Loop   │ ───► │ Trajectory│   │
│   │  (SOUL.md, Skills)  │      │ (Token Sliding/Prune)│      │  (Tool Dispatch) │      │  Logging  │   │
│   └─────────────────────┘      └──────────────────────┘      └────────┬─────────┘      └───────────┘   │
│                                                                       │                                │
│   ┌───────────────────────────────────────────────────────────────────┴────────────────────────────┐   │
│   │                               TOOL REGISTRY & RPC CONTROLLER                                   │   │
│   │                          (@register_tool, Approval Guardrails, AST)                            │   │
│   └───────────────────────────────────────────┬────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────┼────────────────────────────────────────────────────────┘
                                                │
         ┌──────────────────────────────────────┴──────────────────────────────────────┐
         ▼                                                                             ▼
┌─────────────────────────────────┐                                           ┌─────────────────────────────────┐
│     LOCAL / SANDBOX ENVS        │                                           │       CLOUD / REMOTE ENVS       │
│  • Local Host (AST Protected)   │                                           │  • Modal Labs Serverless        │
│  • Docker Container             │                                           │  • Daytona Remote Dev           │
│  • Singularity / Apptainer      │                                           │  • Vercel Sandboxes             │
│  • SSH Host Bridge              │                                           │  • Bubblewrap Fake-Net Mock     │
└─────────────────────────────────┘                                           └─────────────────────────────────┘
```

---

## 2. Core Agent Runtime

### 2.1 The Agent State Machine (`run_agent.py`)
The `AIAgent` class drives conversation turns, execution lifecycle, token tracking, and safety barriers:

1. **Turn Ingestion**: Receives input from CLI, API server, or Gateway message queues.
2. **Context Resolution**: Computes token usage across system prompt, active tools, memories, and message history.
3. **Dynamic Prompt Assembly (`agent/prompt_builder.py`)**:
   - Compiles persona instructions from `SOUL.md`.
   - Injects user profile memories and Honcho context.
   - Generates JSON schemas for all registered tools.
4. **Context Truncation & Compression (`agent/context_compressor.py`)**:
   - Triggers LLM-assisted summarization when approaching model context thresholds.
   - Retains system prompt and recent turns while collapsing older tool results.
5. **Tool Dispatch & RPC Socket Bridge**:
   - Calls self-registered tools (`tools/registry.py`).
   - For complex operations, `execute_code` spins up a sandboxed Python child process that communicates back to the host via Unix Domain Socket RPCs (`clara_tools.py` stubs).
6. **Session & Trajectory Persistence (`clara_state.py`)**:
   - Commits turns, tokens, tool outputs, and LLM states to SQLite with FTS5 indexing.

---

## 3. API Server & Control IPC

### 3.1 OpenAI-Compatible HTTP Server (`gateway/platforms/api_server.py`)
Clara exposes an OpenAI-compliant REST and Server-Sent Events (SSE) server for external clients, dashboards, and integrations.

* **Default Port**: `8642`
* **Auth**: Mandatory `Bearer <API_SERVER_KEY>` when bound to non-loopback interfaces.

#### Complete Endpoint Reference:
| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Gateway readiness probe, supervisor status, and version |
| `GET` | `/v1/models` | List configured models, context windows, and active profiles |
| `POST` | `/v1/chat/completions` | Standard streaming and non-streaming LLM turn endpoint |
| `POST` | `/v1/runs` | Submit asynchronous background agent tasks with idempotency keys |
| `GET` | `/v1/runs/{run_id}` | Poll background task progress, status, and outputs |
| `POST` | `/v1/rooms/create` | Instantiate multi-agent hosted rooms for autonomous collaboration |
| `POST` | `/v1/rooms/{id}/dispatch`| Route messages to specific agent peers inside a hosted room |
| `GET` | `/v1/cron` | View scheduled cron tasks, active triggers, and next runtimes |

---

## 4. Multi-Platform Messaging Gateway

### 4.1 Unified Platform Dispatcher (`gateway/run.py` & `gateway/platforms/`)
Clara runs a single supervised gateway daemon capable of concurrently handling live incoming streams across 10+ platforms:

```
                  ┌──────────────────────────────────────────────┐
                  │          CLARA PLATFORM DISPATCHER          │
                  └──────────────────────┬───────────────────────┘
                                         │
    ┌──────────────┬──────────────┬──────┴───────┬──────────────┬──────────────┐
    ▼              ▼              ▼              ▼              ▼              ▼
┌────────┐    ┌────────┐    ┌────────┐     ┌───────────┐   ┌─────────┐   ┌───────────┐
│Telegram│    │Discord │    │ Slack  │     │ WhatsApp  │   │ Signal  │   │ Microsoft │
│ (Bot)  │    │ (Bot)  │    │(Socket)│     │  (Cloud)  │   │(Daemon) │   │   Teams   │
└────────┘    └────────┘    └────────┘     └───────────┘   └─────────┘   └───────────┘
```

* **Session Continuity**: Conversations preserve state across platforms via `gateway/session.py`.
* **Voice & Media Support**: Inbound voice notes are automatically transcribed with local Whisper/ffmpeg (`gateway/media_repair.py`).
* **Interactive Approvals**: Dangerous commands trigger interactive buttons on Telegram/Discord/Slack before execution.

---

## 5. Web Dashboard & Developer Portal

### 5.1 Clara Dashboard (`web/`)
A modern single-page application built with React 19, Vite, Tailwind CSS, and Lucide:

* **Location**: `web/` (Served locally on port `9119` or embedded in Electron).
* **Key Modules**:
  * `src/components/chat/`: Live session chat, streaming tool call bubbles, markdown & KaTeX renderer.
  * `src/components/kanban/`: Visual Kanban task board connected to autonomous agent worker lanes.
  * `src/components/memory/`: Interactive memory explorer and fact modifier.
  * `src/components/skills/`: Skills hub browser and editor.
* **Authentication Plugins (`plugins/dashboard_auth/`)**:
  * Basic Auth (`CLARA_DASHBOARD_BASIC_AUTH_USERNAME` / `_PASSWORD`)
  * Clara Portal OAuth (`CLARA_DASHBOARD_OAUTH_CLIENT_ID`)
  * Enterprise OIDC (`CLARA_DASHBOARD_OIDC_ISSUER` / `_CLIENT_ID`)

### 5.2 Developer Documentation (`website/`)
* Built with Docusaurus 3 + MDX.
* Comprehensive guides for architecture, APIs, skill development, and platform deployment.

---

## 6. Desktop Applications

### 6.1 Electron Desktop Client (`apps/desktop/`)
* **Framework**: Electron + TypeScript + React.
* **Key Features**:
  * **System Tray Daemon**: Quick-access global hotkey (`Alt+Space` / `Cmd+Space`) for invoking Clara.
  * **Remote Gateway Switcher**: Connect to multiple remote Clara servers (e.g. VPS, home GPU box) without local port binding conflicts.
  * **Local Fallback Engine**: Manages local Node/Python runtime shims and Windows sandbox safety handlers.
* **Shared Code (`apps/shared/`)**: Common serialization models, type contracts, and RPC schemas shared between Web and Desktop.

---

## 7. Tools Runtime & Execution Sandboxes

### 7.1 Tool Registration & Approval Layer (`tools/registry.py`, `tools/approval.py`)
* Tools are declared via `@register_tool` decorators.
* **Safety Floor**: Unrecoverable commands (`rm -rf /`, fork bombs, block device writes) are blocked unconditionally before any execution or user prompt.
* **Approval Modes**:
  * `smart`: Auxiliary LLM assesses command safety.
  * `manual`: Always prompts the user.
  * `off` / `yolo`: Auto-approves commands in trusted CI/CD environments.

### 7.2 Modular Execution Sandboxes (`tools/environments/`)

```
                         ┌─────────────────────────────┐
                         │   EXECUTION ENVIRONMENT     │
                         │      ABSTRACT BASE CLASS    │
                         │    (tools/environments/     │
                         │          base.py)           │
                         └──────────────┬──────────────┘
                                        │
     ┌──────────────────────┬───────────┴──────────┬──────────────────────┐
     ▼                      ▼                      ▼                      ▼
┌──────────────┐     ┌──────────────┐      ┌───────────────┐      ┌──────────────┐
│   LocalHost  │     │    Docker    │      │  Modal Labs   │      │    Daytona   │
│  (local.py)  │     │ (docker.py)  │      │  (modal.py)   │      │ (daytona.py) │
└──────────────┘     └──────────────┘      └───────────────┘      └──────────────┘
     ▼                      ▼                      ▼                      ▼
┌──────────────┐     ┌──────────────┐      ┌───────────────┐      ┌──────────────┐
│  Singularity │     │Vercel Sandbox│      │   SSH Remote  │      │  Bubblewrap  │
│(singularity) │     │ (vercel.py)  │      │   (ssh.py)    │      │(dev-sandbox) │
└──────────────┘     └──────────────┘      └───────────────┘      └──────────────┘
```

---

## 8. Memory & Continuous Learning Subsystem

Clara features a multi-tiered memory architecture:

1. **Working Context**: Active prompt tokens managed by `agent/context_compressor.py`.
2. **Episodic & Fact Memory (`plugins/memory/`)**:
   - `Honcho`: Dialectic user modeling and belief graphs.
   - `Mem0`, `Supermemory`, `ByteRover`, `Hindsight`, `Holographic`, `OpenViking`, `RetainDB`.
3. **Session Trajectories (`clara_state.py`)**:
   - SQLite DB with full-text search (FTS5) enables cross-session search and historical recall.
4. **Autonomous Skill Evolution**:
   - After completing complex workflows, the agent automatically creates and refines reusable Markdown skills under `~/.clara/skills/`.

---

## 9. Plugins, Integrations & Clara Portal

### 9.1 Plugin Architecture (`plugins/`)
* **Discovery Paths**: Loaded from `~/.clara/plugins/`, project `.clara/plugins/`, or pip entry points.
* **Lifecycle Hooks**:
  * `pre_llm_call` / `post_llm_call`
  * `pre_tool_call` / `post_tool_call`
  * `on_session_start` / `on_session_end`

### 9.2 Workprise Portal (`docs/integrations/clara-portal.md`)
* Integrated OAuth2 provider with token refresh.
* Direct access to fine-tuned Clara models, dataset synthesis pipelines, and hosted inference clusters.

---

## 10. Directory Structure & Codebase Inventory

| Directory / File | Category | Description |
|---|---|---|
| `run_agent.py` | Core Runtime | `AIAgent` conversation engine and execution loop |
| `cli.py` | CLI & REPL | Terminal UI, prompt_toolkit interface, interactive commands |
| `clara_state.py` | Database | SQLite session persistence with FTS5 search |
| `model_tools.py` | Orchestration | High-level tool routing and schema generator |
| `toolsets.py` | Presets | Toolset bundles (CLI, Telegram, Discord, Minimal, Full) |
| `agent/` | Agent Modules | System prompt builders, context compressors, trajectory managers |
| `clara_cli/` | CLI Subcommands | Setup wizard, auth providers, skin engines, doctor diagnostics |
| `tools/` | Tools & Safety | Built-in tools, dangerous command approvals, AST checks |
| `tools/environments/` | Sandboxes | Execution backends (Local, Docker, Modal, Daytona, Singularity, Vercel, SSH) |
| `gateway/` | Gateways | Multi-platform gateway daemon, control sockets, session router |
| `gateway/platforms/` | Platform Adapters| OpenAI API server, Telegram, Discord, Slack, WhatsApp, Signal, WeChat |
| `web/` | Web Dashboard | React 19 + Vite dashboard (Kanban, Sessions, Skills, Memory) |
| `website/` | Documentation | Docusaurus 3 documentation portal and user guides |
| `apps/desktop/` | Desktop App | Cross-platform Electron client with system tray and remote switcher |
| `apps/shared/` | Shared Contracts | Shared TypeScript schemas, contracts, and IPC protocols |
| `plugins/` | Plugins | Memory providers, dashboard auth, media generation, observability |
| `providers/` | Model Providers | LLM provider integrations (Clara Portal, OpenRouter, OpenAI, Anthropic) |
| `scripts/` | Tooling & CI | Test runners, Docker scripts, dev sandboxes, release helpers |
| `tests/` | Test Suites | Comprehensive unit, integration, and RPC test suites |

---

## 11. Developer & Reverse-Engineering Reference

### 11.1 Key Debugging Commands

```bash
# Activate isolated development environment
source ~/.clara/venvs/clara-dev/bin/activate

# Launch single-turn query with detailed debug logs
CLARA_LOG_LEVEL=DEBUG clara chat -q "Inspect system state"

# Inspect SQLite database directly
sqlite3 ~/.clara/clara.db "SELECT id, title, updated_at FROM sessions ORDER BY updated_at DESC LIMIT 5;"

# Run test suites with full stdout output
pytest tests/tools/test_sandbox_failure_hints.py -s -v
```

### 11.2 Breakpoint Debugging in VS Code / Cursor
Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Clara CLI",
      "type": "debugpy",
      "request": "launch",
      "program": "${workspaceFolder}/cli.py",
      "args": ["chat"],
      "console": "integratedTerminal",
      "justMyCode": false,
      "env": {
        "CLARA_LOG_LEVEL": "DEBUG",
        "PYTHONPATH": "${workspaceFolder}"
      }
    }
  ]
}
```

---

## 12. Downloadable Dependencies & Weights Catalog

The Clara Agent ecosystem relies on specific downloadable packages, system binaries, browser engines, and optional pre-trained model weights.

### 12.1 Python Dependencies (`pyproject.toml` & `uv.lock`)

* **Core Runtime** (Installed via `uv pip install -e .`):
  * `openai==2.24.0`, `pydantic==2.13.4`, `prompt_toolkit==3.0.52`, `httpx[socks]==0.28.1`, `rich==14.3.3`, `tenacity==9.1.4`, `pyyaml==6.0.3`, `ruamel.yaml==0.18.17`, `requests==2.33.0`, `jinja2==3.1.6`, `croniter==6.0.0`, `snowballstemmer==3.1.1`, `firecrawl-anydoc==0.2.4`.
* **Optional Feature Extras** (Installed via `uv pip install -e ".[<extra>]"`):
  * `all`: Installs all extras combined.
  * `dev`: `pytest`, `black`, `ruff`, `mypy`, `debugpy`, `pytest-asyncio`.
  * `messaging`: `python-telegram-bot`, `discord.py`, `slack-bolt`, `pydantic-settings`.
  * `voice` / `tts`: `edge-tts`, `faster-whisper`, `openai-whisper`, `pydub`.
  * `vision`: `Pillow`, `torchvision`.
  * `browser`: `playwright`, `browserbase`.

### 12.2 Node.js & Web Packages (`package.json`)

* **Root Workspace / Web Dashboard (`web/package.json`)**:
  * `react@^19.0.0`, `react-dom@^19.0.0`, `vite@^6.0.0`, `tailwindcss@^3.4.0`, `lucide-react@^0.468.0`, `axios@^1.7.9`, `katex@^0.16.11`.
* **Desktop Application (`apps/desktop/package.json`)**:
  * `electron@^33.0.0`, `electron-builder@^25.0.0`, `@electron/remote`.

### 12.3 System Binaries & Hardware Dependencies

| Binary | Purpose | Installation Command |
|---|---|---|
| **ripgrep (`rg`)** | Rapid codebase indexing & tool search | `brew install ripgrep` / `sudo apt-get install ripgrep` |
| **ffmpeg** | Voice memo transcription & audio parsing | `brew install ffmpeg` / `sudo apt-get install ffmpeg` |
| **Playwright Browsers** | Headless browser tool execution | `npx playwright install chromium` |
| **MinGit / Git** | Autonomous self-updating and skill fetching | Handled automatically or `brew install git` |

### 12.4 Pre-Trained Model Weights (Optional Local / Offline Inference)

Clara works with cloud APIs (Clara Portal, OpenRouter) or local weights downloadable from Hugging Face / Ollama:

* **Ollama (One-Line Download)**:
  ```bash
  ollama run clara3:8b
  ollama run clara3:70b
  ```
* **Hugging Face Open Weights (vLLM / SGLang / llama.cpp)**:
  * [`Workprise/Clara-3-Llama-3.1-8B`](https://huggingface.co/Workprise/Clara-3-Llama-3.1-8B)
  * [`Workprise/Clara-3-Llama-3.1-70B`](https://huggingface.co/Workprise/Clara-3-Llama-3.1-70B)
  * [`Workprise/Clara-Clara-2-Mistral-7B-DPO`](https://huggingface.co/Workprise/Clara-Clara-2-Mistral-7B-DPO)
