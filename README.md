# design-init

CLI tool to bootstrap design systems with shadcn/ui, impeccable.style skills, and DESIGN.md from getdesign.md.

## Install

```bash
npx design-init init
```

## Usage

```bash
design-init init
```

### Options

| Flag | Description |
|------|-------------|
| `-a, --agent <agent>` | AI coding agent (opencode, claude-code, codex, gemini-cli) |
| `-c, --components <components>` | Comma-separated shadcn components to add |
| `-d, --design <design>` | Design system slug from getdesign.md |
| `-f, --force` | Force reinitialize shadcn even if components.json exists |

### List available designs

```bash
design-init list-designs
```

## License

MIT
