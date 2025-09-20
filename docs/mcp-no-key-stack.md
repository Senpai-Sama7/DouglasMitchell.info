# MCP Stack Without API Keys

This repository snapshot includes a ready-to-run configuration that wires six high-impact MCP servers which require no external credentials. Use it as a drop-in for Claude Desktop or any other MCP client that accepts the standard `mcpServers` block.

## Servers Included
- `@modelcontextprotocol/server-everything` – reference tools, prompts, and resources
- `@modelcontextprotocol/server-fetch` – safe web fetch + content conversion
- `@modelcontextprotocol/server-filesystem` – sandboxed access to this repo (`/home/donovan/DouglasMitchell.info`)
- `mcp-server-git` – local Git introspection via `uvx`
- `@modelcontextprotocol/server-memory` – persistent graph memory store
- `@modelcontextprotocol/server-sequentialthinking` – plan/reflect utility tools

## Prerequisites
- Node.js ≥ 18 (ships with `npx`)
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (`pip install uv` or the platform installer) for the `uvx` runner
- Claude Desktop ≥ 1.6 or another MCP-capable client

## Quick Start (Claude Desktop)
1. Copy `configs/mcp-no-key.json` into your Claude Desktop config (macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`, Linux/Windows: see [Anthropic docs](https://docs.anthropic.com/claude/docs/model-context-protocol)). Merge the `mcpServers` entries if the file already exists.
2. Restart Claude Desktop. The client should auto-start the servers and list their tools under the MCP panel.
3. Run `uvx mcp-server-git --help` once to confirm `uv` is on `PATH`. If missing, install uv and retry.

## Verification Steps
- Ask Claude “list MCP tools” and confirm the six servers return tool manifests.
- Use `filesystem.read_file` to inspect repo files; the path is scoped to this workspace.
- Execute `sequentialthinking.begin` followed by `memory.write` to ensure stateful tools respond without auth prompts.

## Maintenance
- `npx` pulls the latest published server versions on every launch; pin by adding `@<version>` if stability is required.
- Adjust the filesystem and git paths if you clone the repo elsewhere.
- When you no longer need the stack, remove the entries from your client config—no tokens to revoke.
