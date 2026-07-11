# UI Context

## Design Philosophy

The application should feel like a modern SaaS platform used by professionals preparing for interviews. The interface should emphasize clarity, trust, and focus rather than visual complexity. Colors should be used intentionally to communicate state, hierarchy, and actions. Animations should be subtle, and whitespace should be generous to improve readability.

---

# Color System

## Primary Colors

| Token                | Hex       | Usage                                     |
| -------------------- | --------- | ----------------------------------------- |
| `primary`            | `#2563EB` | Primary buttons, links, active navigation |
| `primary-hover`      | `#1D4ED8` | Hover state                               |
| `primary-active`     | `#1E40AF` | Active state                              |
| `primary-foreground` | `#FFFFFF` | Text on primary buttons                   |

---

## Secondary Colors

| Token                  | Hex       | Usage             |
| ---------------------- | --------- | ----------------- |
| `secondary`            | `#4F46E5` | Secondary actions |
| `secondary-hover`      | `#4338CA` | Hover state       |
| `secondary-foreground` | `#FFFFFF` | Button text       |

---

## AI Accent Colors

These colors are reserved for AI-related features.

| Token               | Hex       | Usage         |
| ------------------- | --------- | ------------- |
| `ai-primary`        | `#7C3AED` | AI branding   |
| `ai-secondary`      | `#A855F7` | AI highlights |
| `ai-gradient-start` | `#7C3AED` | AI gradients  |
| `ai-gradient-end`   | `#2563EB` | AI gradients  |

Use these only for:

* AI-generated reports
* AI insights
* AI feedback
* AI badges

Avoid using AI colors for standard CRUD operations.

---

## Success

| Token           | Hex       | Usage               |
| --------------- | --------- | ------------------- |
| `success`       | `#22C55E` | Success messages    |
| `success-light` | `#DCFCE7` | Success backgrounds |

---

## Warning

| Token           | Hex       | Usage               |
| --------------- | --------- | ------------------- |
| `warning`       | `#F59E0B` | Warnings            |
| `warning-light` | `#FEF3C7` | Warning backgrounds |

---

## Error

| Token          | Hex       | Usage             |
| -------------- | --------- | ----------------- |
| `danger`       | `#EF4444` | Errors            |
| `danger-light` | `#FEE2E2` | Error backgrounds |

---

## Information

| Token        | Hex       | Usage                |
| ------------ | --------- | -------------------- |
| `info`       | `#0EA5E9` | Informational alerts |
| `info-light` | `#E0F2FE` | Info backgrounds     |

---

## Neutral Palette

| Token            | Hex       | Usage                       |
| ---------------- | --------- | --------------------------- |
| `background`     | `#FFFFFF` | Main application background |
| `surface`        | `#F8FAFC` | Cards and containers        |
| `surface-hover`  | `#F1F5F9` | Hovered cards               |
| `border`         | `#E2E8F0` | Borders                     |
| `divider`        | `#CBD5E1` | Dividers                    |
| `text-primary`   | `#0F172A` | Primary text                |
| `text-secondary` | `#475569` | Secondary text              |
| `text-muted`     | `#64748B` | Muted text                  |
| `disabled`       | `#94A3B8` | Disabled elements           |

---

# Dashboard Colors

| Token          | Hex       | Usage           |
| -------------- | --------- | --------------- |
| `chart-blue`   | `#2563EB` | Analytics       |
| `chart-green`  | `#22C55E` | Success metrics |
| `chart-yellow` | `#F59E0B` | Medium metrics  |
| `chart-red`    | `#EF4444` | Low metrics     |
| `chart-purple` | `#8B5CF6` | AI metrics      |

---

# Typography

| Element    | Font  | Size | Weight |
| ---------- | ----- | ---- | ------ |
| Display    | Geist | 48px | 700    |
| H1         | Geist | 36px | 700    |
| H2         | Geist | 30px | 600    |
| H3         | Geist | 24px | 600    |
| H4         | Geist | 20px | 600    |
| Body Large | Geist | 18px | 400    |
| Body       | Geist | 16px | 400    |
| Small      | Geist | 14px | 400    |
| Caption    | Geist | 12px | 400    |

### Font Stack

```css
font-family:
"Geist",
"Inter",
system-ui,
sans-serif;
```

---

# Border Radius

| Token        | Value | Usage       |
| ------------ | ----- | ----------- |
| `radius-xs`  | 4px   | Badges      |
| `radius-sm`  | 6px   | Inputs      |
| `radius-md`  | 8px   | Cards       |
| `radius-lg`  | 12px  | Buttons     |
| `radius-xl`  | 16px  | Large cards |
| `radius-2xl` | 24px  | Dialogs     |

Default radius:

```
12px
```

---

# Shadows

| Token       | Value          |
| ----------- | -------------- |
| `shadow-sm` | Small cards    |
| `shadow-md` | Standard cards |
| `shadow-lg` | Dialogs        |
| `shadow-xl` | Popovers       |

Keep shadows subtle.

---

# Spacing Scale

| Token      | Value |
| ---------- | ----- |
| `space-1`  | 4px   |
| `space-2`  | 8px   |
| `space-3`  | 12px  |
| `space-4`  | 16px  |
| `space-5`  | 20px  |
| `space-6`  | 24px  |
| `space-8`  | 32px  |
| `space-10` | 40px  |
| `space-12` | 48px  |
| `space-16` | 64px  |

Never use arbitrary spacing values.

---

# Iconography

| Category | Library      |
| -------- | ------------ |
| Icons    | Lucide React |

---

# Charts

| Library  | Purpose             |
| -------- | ------------------- |
| Recharts | Analytics & Reports |

---

# Animation

| Library       | Usage                                            |
| ------------- | ------------------------------------------------ |
| Framer Motion | Page transitions, dialogs, dropdowns, onboarding |

Animations should enhance usability, not distract from content.

---

# Accessibility

* Maintain a minimum WCAG AA contrast ratio.
* Do not rely on color alone to communicate status.
* Every interactive element must have visible focus states.
* Buttons and form controls should maintain a minimum touch target of 44×44 pixels.
* Ensure the interface is fully usable with keyboard navigation.

---

# Theme Philosophy

The UI should resemble a modern SaaS product rather than a college project. It should prioritize clarity, consistency, and professionalism, with restrained use of color and motion. AI-specific colors should be reserved for AI-generated content to create a clear visual distinction between standard application features and AI-enhanced experiences.
