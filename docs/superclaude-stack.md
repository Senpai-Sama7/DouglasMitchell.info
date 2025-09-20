# SuperClaude 4.1.0 Stack

This repository now captures the SuperClaude 4.1.0 manifest so you can reproduce the framework locally. Two MCP configuration presets are available:

- `configs/mcp-no-key.json` – baseline credential-free reference servers shipped with the MCP org.
- `configs/mcp-superclaude.json` – expanded no-key stack adding Playwright and Serena alongside the core servers.

## Agents Catalog

SuperClaude ships with 15 persona prompts. The canonical filenames match the manifest:

- backend-architect.md
- business-panel-experts.md
- devops-architect.md
- frontend-architect.md
- learning-guide.md
- performance-engineer.md
- python-expert.md
- quality-engineer.md
- refactoring-expert.md
- requirements-analyst.md
- root-cause-analyst.md
- security-engineer.md
- socratic-mentor.md
- system-architect.md
- technical-writer.md

Store bespoke prompt content under `.claude/agents/` (Claude Code) or your client’s equivalent folder. The manifest does not prescribe the copy; adapt each file to match your workflow.

## MCP Servers (No API Keys Required)

| Server | Command | Notes |
| --- | --- | --- |
| `everything` | `npx -y @modelcontextprotocol/server-everything` | Demo toolbox |
| `fetch` | `npx -y @modelcontextprotocol/server-fetch` | Web fetch/conversion |
| `filesystem` | `npx -y @modelcontextprotocol/server-filesystem /home/donovan/DouglasMitchell.info` | Scope to repo |
| `git` | `uvx mcp-server-git --repository /home/donovan/DouglasMitchell.info` | Local repo introspection |
| `memory` | `npx -y @modelcontextprotocol/server-memory` | Persistent memory graph |
| `sequentialthinking` | `npx -y @modelcontextprotocol/server-sequentialthinking` | Structured reasoning tools |
| `playwright` | `npx @playwright/mcp@latest` | Browser automation |
| `serena` | `uvx --from git+https://github.com/oraios/serena serena start-mcp-server --transport stdio` | IDE-grade code search/edit |

> **Context7, Magic, MorphLLM** – intentionally excluded. Each currently requires API credentials or lacks a public MCP entry point. Add them back only if you have the necessary keys and runners.

## Installation Flow

1. Ensure Node ≥ 18 and `uv` are installed and on `PATH`.
2. Merge the desired JSON preset into your client configuration (Claude Desktop: `~/Library/Application Support/Claude/claude_desktop_config.json`).
3. Restart the client and verify that the tools register (Claude: Developer Tools → MCP Servers → Connected).

## Verification Checklist

- `filesystem.read_file` returns repo content without permission prompts.
- `playwright.list_browsers` (or equivalent) responds once Playwright downloads its drivers.
- `serena.list_tools` returns the semantic retrieval tool set after the initial language server bootstrap.

## Maintenance

- Run `npm cache verify` and keep `uv` up to date to ensure fresh builds.
- Pin versions in `configs/mcp-superclaude.json` if reproducibility trumps latest features.
- Watch upstream release notes (Serena, Playwright MCP) for breaking CLI flags and adjust the args accordingly.
