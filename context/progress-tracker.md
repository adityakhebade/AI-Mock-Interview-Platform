# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Production-ready cleanup

## Current Goal

- Remove all mock/demo data and replace with real empty states; connect UI to Clerk user context

## Completed

- Installed shadcn/ui runtime dependencies and lucide-react.
- Added `components.json` and `lib/utils.ts` with `cn()`.
- Configured Tailwind theme tokens for light and dark modes.
- Added the requested UI primitives under `components/ui/`.
- Wired a theme provider into the app shell.
- Refreshed the landing page to exercise the new design system.
- Added Reports, Resumes, and Settings pages at `app/(app)/reports`, `app/(app)/resumes`, and `app/(app)/settings`.
- **Fixed Tailwind v4 CSS compatibility in `app/globals.css`:**
  - Resolved `Cannot apply unknown utility class bg-surface` error.
  - Resolved `Cannot apply unknown utility class btn-base` error.
- Installed and authenticated the Clerk CLI.
- Wired Clerk controls into the landing page and app shell.
- Protected workspace routes via Clerk middleware.
- **Removed all mock/demo data from the application:**
  - Stripped `lib/data.ts` down to type definitions only — all hardcoded `interviews`, `resumes`, `questions`, `performanceTrend`, and `skillBreakdown` arrays deleted.
  - `dashboard/page.tsx`: removed all mock stats, mock interview counts, hardcoded username "Alex Morgan", and mock chart data. Dashboard now shows empty-state cards with `—` values and an onboarding CTA. Real name is pulled from `useUser()` (Clerk).
  - `interviews/page.tsx`: removed all imports from `lib/data`, removed filter tabs (no data to filter), removed mock resume selector. List view renders `EmptyState` for new accounts. Session flow and setup UI retained.
  - `reports/page.tsx`: removed all mock interview/question/chart data. Page now renders `EmptyState` with a CTA to start an interview. Stat cards show `—`.
  - `resumes/page.tsx`: initial state is an empty array instead of mock resumes. `EmptyState` shown on first load.
  - `settings/page.tsx`: replaced hardcoded "Alex Morgan" / "alex.morgan@example.com" with live data from `useUser()` (Clerk). Avatar initial derived from real user name. Security section updated to reflect Clerk-managed auth.
  - `AppShell.tsx`: replaced hardcoded "A" avatar initial with real initial from `useUser()`. Sidebar now shows real display name and email.
- **Replaced hero browser mockup with Companies Marquee (`CompaniesMarquee.tsx`):**
  - Created `components/CompaniesMarquee.tsx` — a fully reusable, self-contained component.
  - 24 companies listed: Google, Microsoft, Amazon, Meta, Apple, Netflix, Adobe, Uber, Airbnb, Stripe, Atlassian, Oracle, Salesforce, Nvidia, Intel, IBM, Samsung, Accenture, TCS, Infosys, Wipro, Cognizant, Deloitte, Capgemini.
  - Each company rendered in a premium glassmorphism card with branded color logo tile, company name, soft border, hover lift animation, and purple glow on hover.
  - Infinite seamless marquee: list duplicated, CSS `translate3d` keyframe animation at 32 s/loop, pauses on hover, no visible jump.
  - Left/right edge fade masks using gradient overlays.
  - Centered heading section with "Top Companies" label, H2, and subtitle.
  - `app/page.tsx`: removed large browser mockup `motion.div` and `Zap` import; replaced with `<CompaniesMarquee />` wrapped in a fade-up `motion.div`.

## In Progress

- None.

## Next Up

- Connect pages to a real database/API (Prisma + PostgreSQL) so data persists per user.
- Build API routes for interview creation, resume upload, and report generation.
- Consider adding real SVG logos to `CompaniesMarquee` via Next.js `<Image>` once a logo CDN or local assets are available.
- Resume the remaining editor spec pages once the data layer is in place.

## Open Questions

- None.

## Architecture Decisions

- Adopted shadcn/ui-style primitives backed by Radix UI and a shared `cn()` helper so future screens can reuse consistent styling and accessibility behavior.
- Added `next-themes`-based theme management so the app can switch between light and dark modes without changing component code.
- Adopted Clerk as the auth provider for the Next.js App Router shell, with protected app routes handled through `proxy.ts` and public auth routes at `/sign-in` and `/sign-up`.
- Kept the root landing page public and enforced auth only on workspace routes so Clerk can preserve the original requested destination after sign-in.
- `lib/data.ts` is now types-only. No hardcoded data exists in the frontend. All pages render empty states until a real database layer is connected.

## Session Notes

- All pages are now production-clean: new users see empty states, not demo data.
- User identity (name, avatar initial, email) is sourced from Clerk `useUser()` throughout the app.
- The next meaningful unit of work is wiring the data layer (Prisma + PostgreSQL API routes).
