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
  - Created `components/home/CompaniesMarquee.tsx` — infinite horizontal marquee using Framer Motion `useAnimationFrame`.
  - Fixed marquee animation (CSS keyframe approach failed twice due to Tailwind v4 purging — switched to Framer Motion).
  - 6 companies (Google, Microsoft, Amazon, Meta, Apple, Netflix) in 180×140px premium glassmorphism cards with hover scale/glow.
  - Logo container 64×64px with `object-contain`, centered, loads from `/public/logos/*.png`.
  - Marquee scrolls right-to-left, pauses on hover via `useRef(paused)`, seamless loop with duplicated list.
  - `app/page.tsx`: removed large browser mockup block, replaced with `<CompaniesMarquee />`.
- **Reorganized landing page layout:**
  - New section order: Navbar, Hero (full viewport), Statistics, Companies Marquee, Features, How It Works, Testimonials, Final CTA, Footer.
  - Hero no longer contains the marquee — marquee moved to dedicated section below stats.
  - Added inter-section spacing: Hero→Stats (stripe flush), Stats→Companies (120px), Companies→Features (140px), Features→How It Works (140px), How It Works→Testimonials (140px), Testimonials→CTA (140px), CTA→Footer (100px).
  - Redesigned final CTA: gradient background, box-shadow glow, `rounded-[32px]`, badge, larger headline, two CTAs, social proof line.
- **Refactored layout with global container and 8px spacing system:**
  - Created single global layout container `C = "mx-auto w-full max-w-[1280px] px-6 sm:px-8 md:px-12"` applied to every section's inner wrapper.
  - Created `SectionHeading` component encoding the identical badge → 24px → title → 24px → subtitle → 64px → content rhythm.
  - All spacing uses 8px units. All arbitrary margin/padding values replaced with consistent scale.
  - Cards: all use `gap-8` (32px), `flex flex-col p-8`, icon `mb-5`, title direct, desc `mt-3`.
  - Testimonial cards: `flex flex-col`, quote has `flex-1` so avatar pinned to bottom, stars always `mb-5` at top.
  - Footer: logo left, copyright center, nav right, all inside `C` with `py-8`.
  - `CompaniesMarquee`: heading removed from component (page owns heading), fade masks widened to `w-56` desktop.
- **Logo updates and navigation improvements:**
  - Removed "Go to dashboard" button from navbar signed-in state — only `UserButton` remains.
  - Replaced generated logo (gradient square + Sparkles icon) with Next.js `<Image>` loading `/public/logo.png`.
  - Wrapped entire `<Logo>` in a Next.js `<Link href="/">` so clicking/hovering redirects to home page. Works in navbar, app shell sidebar, footer (all use same component).
- **Git branch management:**
  - Created and pushed branch `feat/landing-page-redesign` based on `clerk-auth-pr`.
  - Two commits:
    - `4d14524`: All changes for tasks 1-5 (Tailwind fixes, mock data removal, marquee, layout, spacing).
    - `707ff38`: Logo updates and navbar cleanup (task 6).
  - Total: 22 files changed across both commits.
  - PR link: `https://github.com/adityakhebade/AI-Mock-Interview-Platform/pull/new/feat/landing-page-redesign`.

## In Progress

- None.

## Recently Completed

- **Fixed nested anchor tag hydration error:**
  - Removed redundant `Link` wrapper around `<Logo />` in `AppShell.tsx`
  - The Logo component already handles its own navigation internally
  - Removed unused `Link` import from AppShell component
  - Fixed React hydration error: "cannot be a descendant of <a>"
- **Replaced PNG logo with custom SVG logo:**
  - Created a premium custom SVG logo combining speech bubble, code brackets, and X
  - Uses the IntervueX brand gradient (Purple → Blue → Cyan)
  - Logo scales properly at all sizes (sm, md, lg)
  - Removed dependency on external logo.png file
  - The "X" in "IntervueX" now has the same gradient as the icon

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
