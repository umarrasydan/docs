# Xendit Terminal Documentation - AI Coding Agent Guide

## Project Overview

This is a **Mintlify documentation site** for Xendit's In-Person Payment Terminal system, covering three main products:
- **Terminal API (H2H)**: Server-side payment session management and transaction processing
- **Terminal H2H**: Desktop and mobile apps connecting physical terminals to the API
- **Terminal C2C**: Android/iOS SDKs for custom terminal integrations

Targets Southeast Asian markets (Indonesia, Thailand, Vietnam, Malaysia, Philippines) with country-specific payment methods and configurations.

## Architecture & Key Concepts

### Documentation Structure (3-tier system)
```
guides/               # Step-by-step tutorials and migration guides
api-reference/        # API docs organized by product (terminal-api, h2h, c2c)
snippets/            # Reusable content fragments imported via MDX (e.g., finding-terminal-information.mdx)
```

**Navigation Management**: All doc structure lives in `docs.json` with tab-based navigation. When adding pages:
1. Create the MDX file in the appropriate directory
2. Add the path to `docs.json` under the relevant group
3. OpenAPI specs auto-generate endpoints - reference them by operation like `"POST /v1/terminal/sessions"`

> Current tabs: Guides, Wizard (Quickstart wizard), API Reference, SDK & Libraries. Keep the Quickstart wizard experience inside the Wizard tab and add new SDK landing pages to the SDK & Libraries tab.

### Product Integration Patterns

**Integration Tracks**:
- **Gateway App** only: Run the desktop companion to manage devices when merchant apps are browser-based or built with languages other than Java/Kotlin/Objective-C/Swift.
- **Terminal SDKs (H2H or C2C)**: Embed inside your mobile app for a single-application workflow; never combine with the Gateway App in the same integration.

**Two Connection Modes** (Terminal C2C):
- **Host-to-Host** (default): Centralized fleet management through gateway app
- **Client-to-Client (RESTful API)**: Direct terminal communication using separate OpenAPI spec (`openapi-spec-c2c.yaml`), documented at `api-reference/c2c/restful-api.mdx`

> BRI and NTT terminals require the Gateway App even when you build on the Terminal API (C2C) track.

**Simulation vs Physical Testing**:
- **Simulation**: Use special test amounts (`400508` = decline, `400509` = unavailable, `400711` = cancel) with any `terminal_id`
- **Physical**: Requires registered terminal with Terminal H2H connected and actual device hardware

## Mintlify Component Conventions

### Required Structure
All MDX files **must** begin with YAML frontmatter:
```yaml
---
title: 'Clear, keyword-rich title'
description: 'One-sentence summary for SEO and search'
---
```

### Component Usage Patterns

**Use existing patterns from the codebase** - check [.cursor/rules/mintlify.mdc](.cursor/rules/mintlify.mdc) for full reference:

```mdx
```mdx
{/* Multi-path instructions */}
<Tabs>
  <Tab title="Option 1">Content</Tab>
  <Tab title="Option 2">Content</Tab>
</Tabs>

{/* Sequential procedures */}
<Steps>
  <Step title="Action">Description with code examples</Step>
</Steps>

{/* Multiple languages */}
<CodeGroup>
```bash
curl example
```
```javascript
fetch example
```
</CodeGroup>

{/* Contextual alerts */}
<Info>Neutral information</Info>
<Tip>Best practices</Tip>
<Warning>Critical cautions</Warning>
<Check>Success confirmations</Check>

{/* Always wrap images */}
<Frame>
  <img src="/images/path.png" alt="Descriptive alt text" />
</Frame>
```
```

### API Documentation Pattern
For Terminal API (H2H) endpoints, use the OpenAPI-generated structure. Example from existing docs:

```mdx
<RequestExample>
```bash
curl -X POST 'https://terminal-dev.xendit.co/v1/terminal/sessions' \
  -u 'API_KEY:' \
  -H 'Idempotency-key: unique-key-123'
```
</RequestExample>

<ParamField path="terminal_id" type="string" required>
  Terminal device identifier. Use any value for simulation, actual ID for physical devices.
</ParamField>
```

## Authentication & Environment Patterns

**Terminal API (H2H) Authentication**: HTTP Basic Auth with `API_KEY:` (note trailing colon, empty password)

**Environment-Specific**:
- Development: `https://terminal-dev.xendit.co`
- Production: `https://terminal.xendit.co`
- CLIENT_KEY (Gateway SDK) vs API_KEY (Terminal API (H2H)) - different credentials

## Country-Specific Content

When documenting payment methods or features, reference the country availability table pattern from [index.mdx](index.mdx):
- Indonesia: GPN debit, QRIS, Brizzi e-money
- Thailand: Installments with specific bank support
- Vietnam: NAPAS debit, Viet QR
- Malaysia: MyDebit, DuitNow QR (coming soon)

## Developer Workflow

**Local Preview**:
```bash
mint dev  # Starts at http://localhost:3000
```

**Publishing**: Automatic via GitHub app - changes to `main` branch deploy automatically

**Testing without Hardware**: Document both simulation (using special test amounts) and physical terminal approaches - see [quickstart.mdx](guides/getting-started/quickstart.mdx) for established patterns. Mention that simulation paths live inside the Wizard tab quickstart if relevant.

## Content Quality Standards

1. **Code Examples**: Must be complete, runnable, and tested. Show both success and error scenarios
2. **Troubleshooting**: Use `<AccordionGroup>` with common issues - see [app-configuration.mdx](api-reference/h2h/app-configuration.mdx) for examples
3. **Progressive Disclosure**: Basic concepts before advanced (simulation before physical terminal setup)
4. **Verification Steps**: Include `<Check>` blocks to confirm success at each stage
5. **Cross-references**: Link to related docs using relative paths, not external URLs

## Common Pitfalls to Avoid

- 🚫 Don't create docs without adding them to `docs.json` navigation
- 🚫 Never hardcode base URLs - document both dev/prod with variable patterns
- 🚫 Don't use generic placeholders - match realistic data from existing examples
- 🚫 Avoid creating MDX without YAML frontmatter
- 🚫 Don't document the `mint` CLI installation unless updating README - it's covered there

## File Naming & Organization

- Use kebab-case for files: `xen-bri-to-h2h.mdx`
- Platform-specific docs go in subdirectories: `android-sdk/`, `ios-sdk/`
- Shared visuals in `/images/` organized by context: `/images/app/`, `/images/bri/`, `/images/ghl/`
- Reusable snippets in `/snippets/` and imported via: `import ComponentName from '/snippets/file.mdx';`

## Version & Changelog Patterns

Use `<Update>` components for version history - see [app-configuration.mdx](api-reference/h2h/app-configuration.mdx):
```mdx
<Update label="Version 1.6.0" description="Released 5-Dec-2025">
## New features
- Feature description with links to relevant docs
</Update>
```

## Key Files Reference

- `docs.json` - Navigation structure and Mintlify config
- `openapi-spec.yaml` - Main Terminal API (H2H) specification
- `openapi-spec-c2c.yaml` - Client-to-client mode specification
- `.cursor/rules/mintlify.mdc` - Complete Mintlify component reference and technical writing standards
