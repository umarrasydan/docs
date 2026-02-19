# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mintlify documentation site for Xendit's In-Person Payment Terminal system. Three main products:
- **Terminal API (H2H)**: Server-side payment session management
- **Terminal H2H SDK**: Desktop/mobile apps connecting physical terminals to the API
- **Terminal C2C SDK**: Android/iOS SDKs for direct terminal communication

Target markets: Indonesia, Thailand, Vietnam, Malaysia, Philippines.

## Development Commands

```bash
npm i -g mint          # Install Mintlify CLI (one-time)
mint dev               # Local preview at http://localhost:3000
mint update            # Fix CLI issues by updating to latest version
```

Deployment is automatic — commits to `main` deploy via the Mintlify GitHub app. No build/test/lint commands exist.

## Architecture

### Content Structure (3-tier)
- `guides/` — Step-by-step tutorials and migration guides
- `api-reference/` — API docs; OpenAPI specs auto-generate endpoint pages
- `sdk/` — SDK documentation for H2H, C2C, and Gateway App
- `snippets/` — Reusable MDX fragments, imported via `import Name from '/snippets/file.mdx'`
- `components/` — Interactive JSX components (e.g., provider code generators)

### Navigation
All pages must be registered in `docs.json` to appear in the site. Tabs: Guides, Wizard, API Reference, SDK & Libraries.

OpenAPI endpoints are referenced by operation in `docs.json` (e.g., `"POST /v1/terminal/sessions"`), backed by:
- `openapi-spec.yaml` — Terminal API (H2H)
- `openapi-spec-c2c.yaml` — Terminal API (C2C)

### Integration Tracks
- **Gateway App only**: Desktop companion for browser-based merchant apps
- **Terminal SDKs (H2H or C2C)**: Embedded in mobile apps — never combine with Gateway App
- BRI and NTT terminals require Gateway App even on the C2C track

### Authentication
- Terminal API (H2H): HTTP Basic Auth with `API_KEY:` (trailing colon, empty password)
- Gateway SDK uses `CLIENT_KEY` (different credential)
- Dev: `https://terminal-dev.xendit.co` / Prod: `https://terminal.xendit.co`

### Simulation Testing
Special test amounts: `400508` (decline), `400509` (unavailable), `400711` (cancel). Use any `terminal_id` for simulation.

## MDX Conventions

Every `.mdx` file must start with YAML frontmatter:
```yaml
---
title: 'Clear, keyword-rich title'
description: 'One-sentence summary for SEO'
---
```

Key Mintlify components used in this repo:
- `<Tabs>` / `<Tab>` — Multi-path instructions (e.g., platform selection)
- `<Steps>` / `<Step>` — Sequential procedures
- `<CodeGroup>` — Multi-language code examples
- `<Info>`, `<Tip>`, `<Warning>`, `<Check>` — Contextual alerts
- `<Frame>` — Always wrap images
- `<RequestExample>` / `<ResponseExample>` — API code samples
- `<ParamField>` / `<ResponseField>` — API parameter docs
- `<AccordionGroup>` — Troubleshooting sections
- `<Update>` — Version changelog entries

## File Conventions

- Filenames: kebab-case (e.g., `xen-bri-to-h2h.mdx`)
- Platform-specific docs in subdirectories: `android-sdk/`, `ios-sdk/`
- Images in `/images/` organized by context: `/images/app/`, `/images/bri/`, etc.
- Use relative paths for cross-references, not external URLs

## Key Rules

- Always add new pages to `docs.json` navigation
- Never hardcode base URLs — document both dev/prod with variable patterns
- Use realistic data matching existing examples, not generic placeholders
- Full component reference and writing standards are in `.cursor/rules/mintlify.mdc`
- Project-specific patterns and architecture details are in `.github/copilot-instructions.md`
