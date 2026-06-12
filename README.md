# design-init

CLI tool to bootstrap design systems with shadcn/ui, impeccable.style skills, and DESIGN.md from getdesign.md.

## Quick Start

```bash
npx design-init init
```

Skip prompts:
```bash
npx design-init init --agent opencode --design vercel --components button,card,dialog
```

## Commands

### `design-init init`

Runs 4 steps in sequence:

| Step | What it does | Backend |
|---|---|---|
| **1. Select Agent** | Choose your AI coding agent, installs impeccable.style design skills | `npx skills add pbakaus/impeccable -a <agent>` |
| **2. Init shadcn/ui** | Sets up shadcn/ui in the project | `npx shadcn@latest init -d -y` |
| **3. Add Components** | Pick shadcn components to install | `npx shadcn@latest add <components>` |
| **4. Add Design System** | Generates DESIGN.md with brand design guidelines | `npx getdesign@latest add <slug>` |

### `design-init list-designs`

Lists all available design systems from getdesign.md organized by category.

## Options

| Flag | Description |
|---|---|
| `-a, --agent <agent>` | AI coding agent (see 12 supported agents below) |
| `-c, --components <components>` | Comma-separated shadcn components (e.g. `button,card,modal`) |
| `-d, --design <design>` | Design system slug (e.g. `vercel`, `stripe`, `linear`) |
| `-f, --force` | Force reinit shadcn even if components.json exists |

## Supported AI Coding Agents (12)

| Agent | `-a` slug |
|---|---|
| OpenCode | `opencode` |
| Claude Code | `claude-code` |
| Codex CLI | `codex` |
| Gemini CLI | `gemini-cli` |
| Cursor | `cursor` |
| Pi | `pi` |
| GitHub Copilot | `github-copilot` |
| Kiro CLI | `kiro-cli` |
| Trae | `trae` |
| Trae CN | `trae-cn` |
| Rovo Dev | `rovodev` |
| Qoder | `qoder` |

## Available Design Systems (70+)

**AI & LLM Platforms:** claude, cohere, elevenlabs, lovable, minimax, mistral.ai, together.ai, x.ai, composio, ollama

**Developer Tools & IDEs:** cursor, expo, opencode.ai, replicate, resend, vercel, warp, posthog, slack

**Backend, Database & DevOps:** clickhouse, hashicorp, ibm, mongodb, nvidia, supabase, sentry

**Productivity & SaaS:** airtable, cal, intercom, linear.app, mintlify, miro, notion, raycast, superhuman, zapier, uber

**Design & Creative Tools:** clay, figma, framer, pinterest, runwayml, sanity, webflow

**Fintech & Crypto:** binance, coinbase, kraken, mastercard, revolut, stripe, wise

**E-commerce & Retail:** airbnb, shopify, starbucks, hp

**Media & Consumer Tech:** apple, meta, nike, playstation, spotify, theverge, wired, voltagent

**Automotive:** bmw, bmw-m, bugatti, dell-1996, ferrari, lamborghini, nintendo-2001, renault, spacex, tesla, vodafone

## Architecture

Built with:
- **commander** — CLI framework
- **@clack/prompts** — Interactive terminal prompts
- **execa** — Shells out to `npx` commands
- **picocolors** — Terminal text coloring

Flow: `bin/design-init.js` → `src/index.js` (CLI commands) → `src/commands/init.js` (orchestrator) → 4 step modules under `src/steps/`

## Use Cases

- **New project setup** — One command to get shadcn + design system + AI design skills
- **AI design training** — impeccable.style teaches agents 23 design commands and 41 anti-pattern rules
- **Brand design language** — Pick from 70+ real company design systems to generate DESIGN.md

## Links

- GitHub: `github.com/ibrahim8ismael/design-init`
- npm: `design-init`

## License

MIT
