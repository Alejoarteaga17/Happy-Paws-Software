---
name: happy-paws-figma-design-system
description: "Use when implementing, reviewing, or extending the Happy Paws frontend UI from the Figma design system, including tokens, typography, atoms, components, dashboard, login, badges, forms, and AppHeader."
---

# Happy Paws Figma Design System

## Purpose

Use this skill for frontend-only work that must follow the Happy Paws Figma file. The Figma file is the visual source of truth; the current Next.js implementation is the source of truth for existing behavior, routes, services and component APIs.

Figma file:

- URL: https://www.figma.com/design/KqHYFT8b9p6uMC9cg7jPHw/Happy-Paws?node-id=0-1&m=dev
- File key: `KqHYFT8b9p6uMC9cg7jPHw`
- Root page: `Page 1` (`0:1`)

Read the complete token and screen inventory in [docs/frontend/figma-design-system.md](../../../docs/frontend/figma-design-system.md).

## When to use

Use this skill when the task mentions any of the following:

- Happy Paws frontend styling or visual adaptation.
- Figma design system, atoms, components or example pages.
- Dashboard, login, AppHeader, cards, tabs, tables, alerts, badges or forms.
- Typography, color tokens, borders, radii, spacing or responsive visual behavior.

This skill applies only to `front/`. Do not modify `back/` for a visual task.

## Design system map

Inspect these Figma frames when a screen needs visual reference:

- `Create Atomic Design System` (`37:1615`): tokens and foundations.
- `ATOMS` (`28:263`): buttons, sizes, badges, dividers and states.
- `COMPONENTS` (`28:483`): cards, tabs, data tables, progress and alerts.
- `Example Page` (`34:1232`): operational dashboard.
- `Inicio de Sesion` (`37:2264`): authentication screen.
- `AppHeader` (`36:1564`): reusable application header.

## Verified tokens

### Typography

- Display titles: `Quattrocento`.
- Secondary headings: `Newsreader`.
- Interface text: `Iosevka Charon Mono`.
- Main H1 reference: Quattrocento, 60 px.
- H3 reference: Newsreader, 40 px.
- Small interface text: Iosevka Charon Mono, 12-14 px.

These fonts are loaded in `front/src/app/layout.tsx` and exposed through CSS variables in `front/src/app/globals.css`.

### Color semantics

Prefer semantic CSS variables instead of raw hex values:

- `--primary`: main action and navigation color.
- `--primary-soft` / `--primary-pale`: selected and subtle blue surfaces.
- `--ink`: primary text.
- `--muted`: secondary text.
- `--paper`: card and modal surface.
- `--background`: application background.
- `--line`: borders and dividers.
- `--success` / `--success-soft`: successful or administered state.
- `--warning` / `--warning-soft`: pending or warning state.
- `--danger` / `--danger-soft`: overdue, cancelled or error state.

The extracted Figma source includes these semantic families:

- Neutral: `#FFFFFF`, `#E8E8E8`, `#C6C6C6`, `#A4A4A4`, `#827E7E`, `#605B5B`.
- Acceptance: background `#EBFFF8`, foreground `#00754E`.
- Alerts: background `#FFF6E6`, accent `#B16F00`, high contrast `#6D4500`.
- Error: background `#FFEDED`, accent `#BC2828`, high contrast `#891313` and `#560505`.

### Geometry

- Small border: `1 px`.
- Medium border: `2 px`.
- Medium radius: `4 px`.
- Large radius: `8 px`.

Use `4 px` for inputs and compact controls. Use `8 px` for cards, panels, modals and major surfaces.

## Required reusable components

Reuse existing components before adding markup:

- `front/src/components/ui.tsx`
  - `BrandMark` for the Happy Paws mark.
  - `Icon` for Material Symbols.
  - `StatusBadge` for semantic status labels.
- `front/src/components/app-header.tsx`
  - `AppHeader` for primary navigation and profile access.
- `front/src/components/vaccination-dashboard.tsx`
  - Existing composition for vaccination lists, filters and modal form.

If a new visual pattern repeats across two screens, add or extend a shared component in `front/src/components` instead of duplicating JSX and CSS.

## Implementation workflow

1. Inspect the target route and its current services/types before editing.
2. Inspect the related Figma frame or use the inventory in the documentation.
3. Preserve existing data loading, authentication, API calls and user interactions.
4. Add or extend shared primitives before changing individual pages.
5. Put visual tokens and shared layout rules in `front/src/app/globals.css`.
6. Keep page-specific CSS limited to layout composition and unique behavior.
7. Use semantic classes for statuses, not one-off inline colors.
8. Keep responsive behavior functional at desktop and mobile widths.
9. Do not add Tailwind solely because the historical project prompt mentions it; the current frontend uses global CSS and React components.
10. Do not use temporary Figma asset URLs in production code.

## Component conventions

Use these classes when applicable:

- Actions: `primary-button`, `secondary-button`.
- Labels: `eyebrow`, `stat-label`.
- Statuses: `status status-scheduled`, `status-completed`, `status-cancelled`, `status-administered`, `status-pending`, `status-overdue`.
- Surfaces: `summary-panel`, `appointment-form`, `appointment-list`, `list-panel`.
- Header: `app-header`, `header-brand`, `header-nav`, `header-profile`.

Do not create a second `StatusBadge`, icon wrapper or brand mark implementation.

## Validation checklist

From `front/`, run:

```bash
npm test
npx tsc --noEmit
npm run build
```

For a visual change, also inspect the affected route at desktop and mobile sizes. Confirm that:

- Text remains inside its container.
- Status badges do not overlap list content.
- Cards preserve their dimensions while loading.
- Header navigation remains usable on mobile.
- Figma typography and semantic colors are applied through the shared tokens.

## Out of scope

- Backend, Supabase schema, Express routes or RLS changes.
- New business rules or API contracts during a styling task.
- Payment, SMS, email delivery or unrelated refactors.
