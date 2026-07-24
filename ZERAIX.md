---
schema: 1
generated: 2026-07-24T03:02:39.304Z
workdir: E:\gs\electron-project\operease-web
---

<!-- zeraix:begin id=title fp=de43fd801923 -->
# Project Memory · Zeraix

> Maintained by Zeraix. Sections between `zeraix:` markers are regenerated when the files
> they depend on change; everything else — including anything you write yourself — is left
> untouched. Add `lock` to a marker to freeze that section too.
<!-- zeraix:end id=title -->

<!-- zeraix:begin id=overview fp=3503e3400cd0 built=2026-07-24 -->
## Overview

Zeraix is an open-source desktop workspace for running private local models, tools, files, and AI agents on your own computer.
<!-- zeraix:end id=overview -->

<!-- zeraix:begin id=basics fp=4a2e32bb5e8e -->
## Basics
- Working directory: `E:\gs\electron-project\operease-web`
- Repository type: Git repository · Monorepo (pnpm workspaces)
- Package manager: pnpm
- Version: 1.4.0
<!-- zeraix:end id=basics -->

<!-- zeraix:begin id=stack fp=8f12c734c4da -->
## Tech Stack
- Node.js
- TypeScript
- Next.js
- Electron
- Tailwind CSS
<!-- zeraix:end id=stack -->

<!-- zeraix:begin id=modules stale=deferred built=2026-07-24 -->
## Module Map
- `electron/` — (not yet summarised)
- `sandbox/` — (not yet summarised)
- `scripts/` — (not yet summarised)
- `src/app/` — (not yet summarised)
- `src/components/` — (not yet summarised)
- `src/constants/` — (not yet summarised)
- `src/lib/` — (not yet summarised)
- `src/store/` — (not yet summarised)
- `src/types/` — (not yet summarised)
- `test/` — (not yet summarised)
<!-- zeraix:end id=modules -->

<!-- zeraix:begin id=tree fp=e314a9f0eb60 -->
## Directory Structure (top level)
```
[dir] .agents/
        skills/
[dir] .claude/
        agents/
        skills/
        settings.local.json
        SKILL copy.md
[dir] .cursor/
        rules/
[dir] .github/
        workflows/
[dir] .zeraix/
        config.json
[dir] assets/
        .gitkeep
        logo.png
        screenshot-main.png
        screenshot-models.png
[dir] docs/
        automation-workflow-design.md
        chat-integrity-frontend-zh.md
        chat.md
        context-compression_CN.md
        context-compression.md
        electron-system-notification-design.md
        generation-capabilities-design.md
        google-signin-frontend.md
        memory-design.md
        Model-Context-Window-Resolution-Spec.md
        notification-t.md
        prompt-cache-optimization.md
        stripe-frontend-integration.md
        THEME_COLORS_CN.md
        THEME_COLORS.md
        vulkan-uma-windows.md
        windows-appcontainer-sandbox.md
        workflow-builder-mockup.html
        workflow-desing-ui.md
        zeraix-md-design.md
[dir] electron/
        adapters/
        agent/
        automation/
        integrity/
        ipc/
        llm/
        services/
        store/
        tools/
        appConfig.mjs
        loadEnv.mjs
        main.mjs
        memoryFiles.mjs
        preload.cjs
        splash.html
        transferBridge.mjs
        versions.json
        ver

… (truncated)
<!-- zeraix:end id=tree -->

<!-- zeraix:begin id=configs fp=e314a9f0eb60 -->
## Key Config Files
- package.json
- tsconfig.json
- next.config.ts
- electron-builder.yml
- pnpm-workspace.yaml
- eslint.config.mjs
- postcss.config.mjs
- .env.example
<!-- zeraix:end id=configs -->

<!-- zeraix:begin id=scripts fp=8f12c734c4da -->
## Common Scripts / Commands
- `pnpm run dev` — next dev
- `pnpm run build` — next build
- `pnpm run start` — next start
- `pnpm run typecheck` — npx tsc --noEmit
- `pnpm run preview` — serve -s operease-zeraix -p 9999
- `pnpm run prod-test` — next build && next start -p 9999
- `pnpm run lint` — eslint
- `pnpm run test` — node --test "test/**/*.test.mjs"
- `pnpm run electron` — electron .
- `pnpm run gen:google` — node scripts/gen-google-defaults.mjs
- `pnpm run preelectron:dev` — node scripts/gen-google-defaults.mjs
- `pnpm run electron:dev` — concurrently -k "next dev" "wait-on tcp:3000 && electron ."
- `pnpm run rebuild:native` — electron-rebuild -f -w node-pty
- `pnpm run bundle:bin:mac` — node scripts/bundle-bin-mac.mjs
- `pnpm run bundle:bin:win` — node scripts/bundle-bin-win.mjs
- `pnpm run publish:llama` — node scripts/publish-llama.mjs
- `pnpm run download:bin:win` — node script

… (truncated)
<!-- zeraix:end id=scripts -->

<!-- zeraix:begin id=checks fp=8f12c734c4da -->
## Checks (build / test)
- typecheck: `pnpm run typecheck`
- lint: `pnpm run lint`
- test: `pnpm run test`
<!-- zeraix:end id=checks -->

<!-- zeraix:begin id=readme fp=cc9ef71474ec -->
## README Summary (README.md)

<div align="center">

<img src="assets/logo.png" alt="Zeraix Logo" width="120" height="120" />

# Zeraix

### Local AI, engineered from workspace to runtime.

Zeraix is an open-source desktop workspace for running private local models, tools, files, and AI agents on your own computer.

Alongside the application, we continuously research how modern AI models can run more efficiently on personal hardware. **ExactFlux** is the runtime technology developed through this work, with a focus on real memory use, sustained generation speed, hardware adaptation, and verified output correctness.

[Download](#-quick-start)
· [Model Systems Research](#-model-systems-research)
· [Current Research](#current

… (truncated; see README.md for the full content)
<!-- zeraix:end id=readme -->

<!-- zeraix:begin id=notes lock -->
## Invariants & Gotchas

_Hand-authored. Zeraix never overwrites this section — record anything here that scanning the repo could not tell you._

- (nothing recorded yet)
<!-- zeraix:end id=notes -->
