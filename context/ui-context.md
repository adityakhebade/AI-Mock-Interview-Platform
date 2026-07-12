# UI Context

> This document defines the visual language and design system for IntervueX.
>
> Every page, component, animation, and interaction should follow these
> guidelines to maintain a consistent experience across the application.

---

# Design Philosophy

IntervueX is a premium AI-powered interview preparation platform.

The interface should feel modern, intelligent, trustworthy, and highly
professional.

Users should immediately feel they are using a polished SaaS product rather
than a student project.

The experience should resemble products like:

- Linear
- Vercel
- Stripe Dashboard
- Clerk
- Notion AI
- Raycast

The design should prioritize:

- Simplicity
- Clarity
- Focus
- Accessibility
- Consistency
- Performance

Color should communicate hierarchy rather than decoration.

Whitespace should be generous.

Animations should be subtle.

---

# Theme

Dark Mode is the primary experience.

Light Mode is fully supported.

Dark mode should not use pure black.

Instead, use layered neutral surfaces to create depth.

---

# Brand Identity

IntervueX is primarily identified through **Indigo**.

Blue is reserved for technical workflows.

Purple and Cyan represent AI-powered functionality.

The application should never become visually overwhelming.

The interface should feel calm and premium.

---

# Brand Colors

| Token | Value | Usage |
|--------|-------|------|
| primary | #4F46E5 | Primary Brand |
| primary-hover | #4338CA | Hover |
| primary-active | #3730A3 | Active |
| primary-foreground | #FFFFFF | Button Text |

---

# Secondary Colors

| Token | Value |
|--------|-------|
| secondary | #8B5CF6 |
| secondary-hover | #7C3AED |
| secondary-foreground | #FFFFFF |

---

# AI Color Palette

These colors are **ONLY** used for AI-powered experiences.

Examples

- AI Interview
- AI Report
- AI Feedback
- AI Insights
- AI Assistant
- AI Evaluation

Never use AI colors for standard CRUD pages.

| Token | Value |
|--------|-------|
| ai-primary | #8B5CF6 |
| ai-secondary | #A855F7 |
| ai-highlight | #22D3EE |
| ai-gradient-start | #4F46E5 |
| ai-gradient-middle | #8B5CF6 |
| ai-gradient-end | #22D3EE |

Preferred Gradient

```
Indigo

↓

Purple

↓

Cyan
```

---

# Semantic Colors

## Success

| Token | Value |
|--------|-------|
| success | #22C55E |
| success-light | #DCFCE7 |

---

## Warning

| Token | Value |
|--------|-------|
| warning | #F59E0B |
| warning-light | #FEF3C7 |

---

## Danger

| Token | Value |
|--------|-------|
| danger | #EF4444 |
| danger-light | #FEE2E2 |

---

## Information

| Token | Value |
|--------|-------|
| info | #0EA5E9 |
| info-light | #E0F2FE |

---

# Dark Theme

| Token | Value |
|--------|-------|
| background | #09090B |
| background-secondary | #111118 |
| surface | #18181B |
| surface-hover | #202026 |
| elevated | #27272A |
| border | rgba(255,255,255,.08) |
| divider | rgba(255,255,255,.06) |
| text-primary | #FAFAFA |
| text-secondary | #D4D4D8 |
| text-muted | #A1A1AA |
| disabled | #71717A |

---

# Light Theme

| Token | Value |
|--------|-------|
| background | #FFFFFF |
| surface | #F8FAFC |
| surface-hover | #F1F5F9 |
| border | #E2E8F0 |
| divider | #CBD5E1 |
| text-primary | #0F172A |
| text-secondary | #475569 |
| text-muted | #64748B |
| disabled | #94A3B8 |

---

# Dashboard Colors

Each dashboard widget should have its own accent.

| Widget | Color |
|---------|-------|
| Interviews | #4F46E5 |
| Coding | #2563EB |
| Analytics | #22D3EE |
| AI Reports | #8B5CF6 |
| Performance | #10B981 |
| Upcoming | #F59E0B |
| Failed | #EF4444 |

---

# Charts

| Metric | Color |
|--------|-------|
| Indigo | #4F46E5 |
| Blue | #2563EB |
| Purple | #8B5CF6 |
| Cyan | #22D3EE |
| Green | #10B981 |
| Amber | #F59E0B |
| Red | #EF4444 |

---

# Typography

Primary Font

Geist

Fallback

Inter

system-ui

sans-serif

| Style | Size | Weight |
|--------|------|--------|
| Display | 56 | 700 |
| H1 | 40 | 700 |
| H2 | 32 | 600 |
| H3 | 24 | 600 |
| H4 | 20 | 600 |
| Body Large | 18 | 400 |
| Body | 16 | 400 |
| Small | 14 | 400 |
| Caption | 12 | 400 |

---

# Border Radius

| Component | Radius |
|------------|--------|
| Badge | 999px |
| Input | 10px |
| Button | 12px |
| Card | 18px |
| Dialog | 24px |

---

# Shadows

Use subtle shadows only.

```
shadow-sm

shadow-md

shadow-lg

shadow-xl
```

Never use large dark shadows.

Depth should come from surfaces rather than shadows.

---

# Glassmorphism

Allowed only for

- Hero dashboard
- AI widgets
- Dialogs

Example

```
background:

rgba(255,255,255,.03)

backdrop-filter:

blur(20px)

border:

1px solid rgba(255,255,255,.06)
```

---

# Background Effects

Allowed

Large Indigo Glow

Large Cyan Glow

Purple Radial Glow

Very subtle grid texture

Very subtle noise texture

Never use animated backgrounds.

---

# Buttons

Primary

Solid Indigo

Hover

Darker Indigo

Secondary

Outline

Ghost

Transparent

Danger

Red

AI

Indigo → Purple Gradient

Buttons should have

- Smooth hover
- Soft shadow
- Active scale 0.98
- Transition under 200ms

---

# Cards

Cards are the primary organizational unit.

Cards should have

- Neutral surface
- Thin border
- 18px radius
- Soft shadow
- Hover elevation
- Smooth transition

Cards should never feel flat.

---

# Icons

Library

Lucide React

Rules

- Always 20px or 24px
- Use currentColor
- Keep icon usage consistent

---

# Motion

Library

Framer Motion

Animation Duration

180–250ms

Hover

translateY(-2px)

Scale

1.02 maximum

Entrance

Fade + slight upward motion

Avoid

- Bounce
- Elastic
- Long animations

Motion should reinforce usability rather than attract attention.

---

# Accessibility

Maintain WCAG AA contrast.

Keyboard navigation required.

Visible focus states.

Touch targets

44 × 44 minimum.

Never communicate status using color alone.

---

# Component Philosophy

Every component should be

- Reusable
- Accessible
- Responsive
- Theme-aware
- Typed
- Minimal

Every component should support

- Loading
- Disabled
- Empty
- Error

States.

---

# Visual Language

IntervueX should feel like an intelligent workspace.

The interface should emphasize depth through layering rather than bright colors.

Most of the application should remain neutral.

Accent colors should guide attention.

AI features should stand out naturally through gradients and subtle glows rather than excessive color usage.

Users should feel focused and calm while preparing for interviews.

---

# Inspiration

Design inspiration

- Linear
- Vercel
- Clerk
- Stripe
- Notion AI
- Raycast
- GitHub Dashboard

Do not imitate any one product directly.

Combine the best ideas into a unique IntervueX identity.

---

# Overall Feel

The product should communicate

Professional.

Minimal.

Fast.

Modern.

Premium.

Intelligent.

Confident.

Every screen should look polished enough to be mistaken for a production SaaS application.