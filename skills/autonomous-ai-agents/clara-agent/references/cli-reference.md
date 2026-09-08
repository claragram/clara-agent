# Clara CLI Reference

Live sources when anything looks stale: `clara --help`, `clara <command> --help`,
https://agent.claraship.com/docs/reference/cli-commands

### Global Flags

```
clara [flags] [command]        (no subcommand = interactive chat)

  --version, -V             Show version
  -z, --oneshot PROMPT      One-shot: print ONLY the final response (for scripts/pipes)
  -m MODEL  --provider P    Model/provider override for this invocation
  -t, --toolsets LIST       Comma-separated toolsets for this invocation
  --resume, -r SESSION      Resume session by ID or title
  --continue, -c [NAME]     Resume by name, or most recent session
  --worktree, -w            Isolated git worktree mode (parallel agents)
  --skills, -s SKILL        Preload skills (comma-separate or repeat)
  --profile, -p NAME        Use a named profile
  --yolo                    Skip dangerous command approval
  --tui / --cli             Force the Ink TUI / classic REPL
  --ignore-rules            Skip AGENTS.md/SOUL.md/memory/skill injection
  --safe-mode               Disable ALL customizations (troubleshooting)
  --pass-session-id         Include session ID in system prompt
```

### Chat

```
clara chat [flags]
  -q, --query TEXT          Single query, non-interactive
  --image PATH              Attach a local image to a single query
  -Q, --quiet               Suppress banner, spinner, tool previews
  --checkpoints             Enable filesystem checkpoints (/rollback)
  --max-turns N             Cap tool-calling iterations
  --source TAG              Session source tag (default: cli)
```
(plus the global flags above)

### Configuration

```
clara setup [section]      Wizard (model|tts|terminal|gateway|tools|agent)
clara model                Interactive model/provider picker
clara fallback [add|remove|list]  Fallback provider chain
clara config [show|edit|get|set|unset|path|env-path|check|migrate]
clara login / logout       OAuth sign-in / clear stored auth
clara doctor [--fix]       Check dependencies and config
clara status [--all]       Component status
```

### Tools & Skills

```
clara tools [list|enable NAME|disable NAME]   Per-platform toolsets (curses UI with no args)

clara skills list|browse|search QUERY|inspect ID
clara skills install ID    Hub identifier OR a direct https://…/SKILL.md URL
clara skills config        Enable/disable skills per platform
clara skills check|update|uninstall|publish PATH
clara skills tap add REPO  Add a GitHub repo as a skill source
clara bundles              Skill bundles (one /<name> alias loads several skills)
```

### MCP Servers

```
clara mcp add NAME (--url or --command) | remove | list | test NAME
clara mcp catalog | install NAME     Curated catalog install
clara mcp configure NAME             Toggle tool selection
clara mcp serve                      Run Clara as an MCP server
```
Details (transport, tool discovery, catalog): `references/native-mcp.md`.

### Gateway (Messaging Platforms)

```
clara gateway run|install|start|stop|restart|status|setup
```

20+ platforms: Telegram, Discord, Slack, WhatsApp (Baileys + Business Cloud API), iMessage (Photon — `clara photon setup`), Signal, Email, SMS, Matrix, Mattermost, Teams, LINE, SimpleX, ntfy, Google Chat, Home Assistant, DingTalk, Feishu, WeCom, Weixin, API Server, Webhooks. Open WebUI connects via the API Server adapter. Most adapters ship under `plugins/platforms/`.
Docs: https://agent.claraship.com/docs/user-guide/messaging/

### Sessions

```
clara sessions list|browse|rename ID TITLE|delete ID|export OUT|prune|stats
```

### Cron / Webhooks

```
clara cron list|create SCHED|edit ID|pause|resume|run ID|remove|status
    Schedules: '30m', 'every 2h', '0 9 * * *', ISO timestamp
clara webhook subscribe NAME|list|remove NAME|test NAME
```
Webhook payloads/routes: `references/webhooks.md`.

### Profiles

```
clara profile list|create NAME (--clone|--clone-all|--clone-from)|use|show|delete
clara profile rename A B | alias NAME | export NAME | import FILE
```

### Credentials & Pools

```
clara auth                 Interactive credential manager
clara auth add [PROVIDER]  Add OAuth or API-key credential (clara, openai-codex, qwen-oauth, …)
clara auth list|remove P IDX|reset PROVIDER|status
```
Multiple credentials per provider form a pool that rotates automatically and skips exhausted keys.

### Other

```
clara desktop / gui        Native desktop app
clara dashboard            Web admin panel + embedded chat (--stop / --status)
clara proxy                OpenAI-compatible local proxy backed by an OAuth provider
clara portal               Quick setup / sign in via Clara Portal
clara kanban <verb>        Multi-agent work-queue board
clara project              Named multi-folder workspaces
clara skin list|use|set    Switch/tweak skins (see references/themes.md)
clara pets <verb>          Pet mascots (see references/petdex.md)
clara memory setup|status|off|reset   Memory provider
clara secrets bitwarden|onepassword   External secret stores
clara moa                  Mixture-of-Agents slots
clara hooks / security / backup / import / checkpoints / console
clara logs [-f] [errors]   View agent/error logs
clara send                 One-off message through a gateway platform
clara pairing / plugins / insights / journey / computer-use
clara acp                  ACP server (IDE integration)
clara completion bash|zsh|fish
clara update / uninstall / claw migrate
```

Plugin- and provider-supplied subcommands (e.g. `clara photon setup`) only appear once their plugin is installed/active.

### Where to Find Things

| Looking for... | Location |
|---|---|
| Config options | `clara config edit` · [Configuration docs](https://agent.claraship.com/docs/user-guide/configuration) |
| Tools / toolsets | `clara tools list` · [Tools reference](https://agent.claraship.com/docs/reference/tools-reference) |
| Skills catalog | `clara skills browse` · [Skills catalog](https://agent.claraship.com/docs/reference/skills-catalog) |
| Provider setup | `clara model` · [Providers guide](https://agent.claraship.com/docs/integrations/providers) |
| Env variables | `clara config env-path` · [Env vars reference](https://agent.claraship.com/docs/reference/environment-variables) |
| Gateway logs | `~/.clara/logs/gateway.log` (or `clara logs`) |
| Sessions | `clara sessions browse` (reads state.db) |
