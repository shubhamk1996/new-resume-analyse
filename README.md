# Web App — Project Reference

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. This file is the
inventory of what already exists in the project — so you don't reinstall packages,
recreate components, or miss what's there. Everything imports via the `@/` alias
(`@/` → `src/`).

> `src/app/page.tsx` is placeholder content — **replace it.** Theme the app in
> `src/app/theme.css`; add fonts via `next/font/google` in `src/app/layout.tsx`.

## Routes
- `/` — `src/app/page.tsx` (placeholder loader — **replace this**)
- `GET|POST /api/hello` — `src/app/api/hello/route.ts` (example API route)

## Installed packages (already available — do not reinstall)
See `package.json` for exact versions.
- **Framework:** `next` 16, `react` / `react-dom` 19, `typescript`
- **Styling:** `tailwindcss` v4, `tailwind-merge`, `clsx`, `class-variance-authority`, `tailwindcss-animate`
- **UI primitives:** `@radix-ui/react-*` — accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, label, popover, progress, radio-group, scroll-area, select, separator, slider, slot, switch, tabs, toast, tooltip
- **Components / icons / theming:** `shadcn` (CLI), `lucide-react`, `sonner` (toaster), `next-themes`
- **Animation:** `motion` (Framer Motion)
- **Forms & validation:** `react-hook-form`, `@hookform/resolvers`, `zod`
- **State management:** `zustand`
- **Charts / data viz:** `recharts`
- **Misc:** `color-bits`

Need a package not listed? Install it with the restart cycle (kill dev server →
`cd /workspace/web && npm install <pkg>` → restart). Always `cd /workspace/web` first —
installing from any other directory creates a stray lockfile that breaks module
resolution and every subsequent build. For more UI components: `cd /workspace/web && npx shadcn add <name> -y`.

## Pre-installed shadcn components — `src/components/ui/`
`alert`, `avatar`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`,
`label`, `select`, `separator`, `skeleton`, `sonner`, `tabs`, `textarea`
— only `npx shadcn add` the ones **not** in this list.

Other components: `@/components/theme-switcher` (light/dark toggle),
`@/components/site-header` + `@/components/site-footer` (shared chrome driven by
`siteConfig` — reuse/customize these instead of building new header/footer components).

## Hooks — `@/hooks` (barrel export)
`useDebounce`, `useLocalStorage`, `useMediaQuery` / `useIsMobile` / `useIsTablet` / `useIsDesktop`, `useMounted`, `useCopyToClipboard`, `useTheme`
```ts
import { useDebounce, useIsMobile } from '@/hooks';
```

## Utilities — `@/lib`
- `cn(...)` — merge Tailwind classes, clsx + tailwind-merge (`@/lib/utils`)
- `api.get<T>() / post / put / patch / delete` and `fetcher<T>()` — typed fetch wrapper (`@/lib/api`)
- `paymentsMode` — `'test' | 'live'`, read from `flags.json` (`@/lib/flags`)

## Config & theme
- `@/config/site` — `siteConfig` (name, description, url, links)
- `src/app/theme.css` — design tokens (oklch) for `:root` and `.dark`. **Customize the theme here.**
- `src/app/layout.tsx` — root layout: Google fonts via `next/font`, `ThemeProvider` (next-themes), sonner `<Toaster />`.

## Conventions
- Import alias `@/*` → `src/*`.
- App Router; Server Components by default, `'use client'` only when needed.

Integrations (cloud database/auth/storage, payments) are scaffolded on top of this
when connected — the files, routes, and env vars they add are reported separately
at setup time.
