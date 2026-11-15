---
name: happy-paws-figma-design-system
description: "Use when implementing, reviewing, or refactoring Happy Paws frontend UI from the Figma design system, including premium visual polish, purposeful motion, typography, atoms, components, dashboard, login, portal, badges, forms, tables, responsive layouts, and AppHeader."
argument-hint: "Describe the Happy Paws screen, component, or visual change to implement from Figma."
user-invocable: true
---

# Happy Paws Figma Design System and Premium UI Craftsmanship

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

Do not load this skill for backend, Supabase schema, API contract, RBAC, or infrastructure-only changes. For cross-layer work, use the existing frontend behavior and API contracts as constraints, and apply this skill only to the frontend visual surface.

## Premium UI direction

Use the Figma system as the visual source of truth, then add premium interaction and motion only where it improves comprehension, hierarchy or feedback. The result should feel intentional and warm for a veterinary care product, not like a generic template or an unrelated award-site concept.

### Establish the visual direction

Before changing layout or styling, identify the page's emotional goal and commit to a coherent direction. Prefer a calm, editorial and organic treatment that complements Happy Paws typography and semantic colors:

- Use strong typographic hierarchy with `clamp()` for display text while preserving the verified Quattrocento, Newsreader and Iosevka Charon Mono roles.
- Build depth with spacing, tonal surfaces, restrained borders, soft gradients or subtle translucent layers only when they remain legible against the Figma tokens.
- Use texture or decorative shapes sparingly; they must not compete with pet records, clinical information, forms or primary actions.
- Do not introduce brutalist, cyberpunk or cinematic styling as a default. Use those directions only when the user explicitly requests them and they remain consistent with the product.

### Motion and interaction

Treat motion as a system rather than decoration:

- Prefer short, purposeful entrance, state-change and feedback transitions using `transform` and `opacity`.
- Add staggered word or item reveals only when the content structure supports them and the markup remains accessible.
- Use hover, focus and pressed states to make controls feel tactile. Magnetic cursors, custom cursors, pinned scroll sections, horizontal scroll journeys and parallax are opt-in enhancements, not baseline requirements.
- A sticky header may react to scroll direction only when it does not hide navigation or interfere with forms, dialogs or mobile use.
- Use existing CSS and React capabilities first. Add Framer Motion, GSAP, Lenis, SplitType, React Three Fiber or other dependencies only when the request requires them and the repository's dependency policy supports them.
- Avoid preloaders for ordinary route transitions. If an asset-heavy experience genuinely needs initialization, show useful progress and preserve a fast, usable fallback.

### Accessibility and performance guardrails

- Respect `prefers-reduced-motion: reduce` by disabling or simplifying non-essential animation.
- Gate pointer-specific effects behind `@media (hover: hover) and (pointer: fine)` and provide equivalent keyboard and touch interactions.
- Keep focus indicators visible and ensure motion never obscures status, error, consent or clinical information.
- Animate composited properties such as `transform` and `opacity`; avoid animating layout properties such as `width`, `height`, `top`, `margin` or `font-size`.
- Use `will-change` only for elements that are actively animated and remove it when the animation completes.
- Keep images, gradients, filters and blur effects bounded so the page remains responsive on mobile and lower-powered devices.

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
11. Run the frontend test, type-check, build, lint, and format checks after implementation.

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
