@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

## Stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript**
- **Tailwind CSS v4** via `@tailwindcss/postcss` — no `tailwind.config.js`; configuration is in CSS using `@theme` directives
- Fonts: Geist Sans and Geist Mono loaded via `next/font/google` with CSS variables `--font-geist-sans` / `--font-geist-mono`

## Architecture

This is a fresh Next.js App Router project. All routes live under `src/app/`. The root layout (`src/app/layout.tsx`) sets up fonts and the flex column body; pages compose inside that shell.

- `src/app/layout.tsx` — root layout, font setup, global metadata
- `src/app/page.tsx` — home route (`/`)
- `src/app/globals.css` — global styles and Tailwind imports

Because this uses **Next.js 16** (a pre-release version with breaking changes), read `node_modules/next/dist/docs/` before writing any Next.js-specific code. The `LayoutProps` type used in `layout.tsx` is one such API difference from stable Next.js.
