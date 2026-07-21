
Read AGENTS.md before starting.

# IntervueX — Complete UI Source Code Reference

> This file contains ALL the UI code I built for IntervueX (AI Mock Interview Platform).
> Feed this entire file to your AI to recreate the UI in Next.js.
>
> **Instructions for your AI:** Convert this Vite + React code to Next.js App Router.
> - Move `src/pages/*` to `app/*/page.tsx` (e.g., `app/dashboard/page.tsx`)
> - Move `src/components/*` to `components/*`
> - Move `src/lib/*` to `lib/*`
> - Replace `onNavigate` callbacks with Next.js `useRouter().push()` or `<Link>`
> - Add `'use client'` to pages using hooks (useState, useEffect, framer-motion)
> - Keep `tailwind.config.js` and `src/index.css` (rename to `app/globals.css`)
> - Wrap the app in `ThemeProvider` via `app/layout.tsx`
> - Install: `framer-motion` and `lucide-react`

---

## FILE: tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          active: '#3730A3',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          foreground: '#FFFFFF',
        },
        ai: {
          primary: '#8B5CF6',
          secondary: '#A855F7',
          highlight: '#22D3EE',
          'gradient-start': '#4F46E5',
          'gradient-middle': '#8B5CF6',
          'gradient-end': '#22D3EE',
        },
        success: { DEFAULT: '#22C55E', light: '#DCFCE7' },
        warning: { DEFAULT: '#F59E0B', light: '#FEF3C7' },
        danger: { DEFAULT: '#EF4444', light: '#FEE2E2' },
        info: { DEFAULT: '#0EA5E9', light: '#E0F2FE' },
        accent: {
          interviews: '#4F46E5',
          coding: '#2563EB',
          analytics: '#22D3EE',
          reports: '#8B5CF6',
          performance: '#10B981',
          upcoming: '#F59E0B',
          failed: '#EF4444',
        },
      },
      borderRadius: {
        badge: '999px',
        input: '10px',
        btn: '12px',
        card: '18px',
        dialog: '24px',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.06)',
        'soft-md': '0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 6px -2px rgba(0,0,0,0.05)',
        'soft-lg': '0 12px 32px -8px rgba(0,0,0,0.12), 0 4px 12px -4px rgba(0,0,0,0.06)',
        glow: '0 0 0 1px rgba(79,70,229,0.12), 0 8px 32px -8px rgba(79,70,229,0.25)',
        'ai-glow': '0 0 0 1px rgba(139,92,246,0.18), 0 12px 40px -8px rgba(139,92,246,0.28)',
      },
      backgroundImage: {
        'ai-gradient': 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 50%, #22D3EE 100%)',
        'ai-gradient-soft': 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(139,92,246,0.12) 50%, rgba(34,211,238,0.12) 100%)',
        'indigo-glow': 'radial-gradient(circle at center, rgba(79,70,229,0.18) 0%, transparent 70%)',
        'cyan-glow': 'radial-gradient(circle at center, rgba(34,211,238,0.14) 0%, transparent 70%)',
        'purple-glow': 'radial-gradient(circle at center, rgba(139,92,246,0.16) 0%, transparent 70%)',
        'grid-texture': "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      },
      backgroundSize: { grid: '48px 48px' },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'pulse-soft': { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up 200ms ease-out',
        'fade-in': 'fade-in 200ms ease-out',
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
        shimmer: 'shimmer 1.8s infinite',
      },
      transitionTimingFunction: { 'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)' },
    },
  },
  plugins: [],
};
```

---

## FILE: src/index.css (→ app/globals.css in Next.js)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root { color-scheme: dark; }
  * { border-color: rgba(255, 255, 255, 0.08); }
  html {
    font-family: 'Geist', 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  body {
    @apply bg-background text-text-primary antialiased;
    font-feature-settings: 'cv11', 'ss01', 'ss03';
    letter-spacing: -0.011em;
  }
  ::selection { background: rgba(79, 70, 229, 0.3); color: #fff; }
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 999px; border: 2px solid transparent; background-clip: padding-box; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.14); background-clip: padding-box; }
}

@layer components {
  .bg-background { background-color: #09090B; }
  .bg-background-secondary { background-color: #111118; }
  .bg-surface { background-color: #18181B; }
  .bg-surface-hover:hover { background-color: #202026; }
  .bg-elevated { background-color: #27272A; }
  .border-token { border-color: rgba(255, 255, 255, 0.08); }
  .border-divider { border-color: rgba(255, 255, 255, 0.06); }
  .text-text-primary { color: #FAFAFA; }
  .text-text-secondary { color: #D4D4D8; }
  .text-text-muted { color: #A1A1AA; }
  .text-disabled { color: #71717A; }

  .light .bg-background { background-color: #FFFFFF; }
  .light .bg-background-secondary { background-color: #F8FAFC; }
  .light .bg-surface { background-color: #F8FAFC; }
  .light .bg-surface-hover:hover { background-color: #F1F5F9; }
  .light .bg-elevated { background-color: #FFFFFF; }
  .light .border-token { border-color: #E2E8F0; }
  .light .border-divider { border-color: #CBD5E1; }
  .light .text-text-primary { color: #0F172A; }
  .light .text-text-secondary { color: #475569; }
  .light .text-text-muted { color: #64748B; }
  .light .text-disabled { color: #94A3B8; }
  .light * { border-color: #E2E8F0; }

  .glass {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
  .light .glass { background: rgba(255, 255, 255, 0.7); border: 1px solid rgba(15, 23, 42, 0.06); }

  .card-base {
    @apply bg-surface border border-token rounded-card shadow-soft;
    transition: transform 200ms cubic-bezier(0.22,1,0.36,1), box-shadow 200ms cubic-bezier(0.22,1,0.36,1), border-color 200ms;
  }
  .card-base:hover { @apply shadow-soft-md; transform: translateY(-2px); }

  .btn-base { @apply inline-flex items-center justify-center gap-2 font-medium rounded-btn transition-all; transition-duration: 180ms; }
  .btn-base:active { transform: scale(0.98); }
  .btn-primary { @apply btn-base bg-primary text-primary-foreground px-4 py-2.5; }
  .btn-primary:hover { @apply bg-primary-hover; }
  .btn-primary:active { @apply bg-primary-active; }
  .btn-secondary { @apply btn-base bg-transparent border border-token text-text-primary px-4 py-2.5; }
  .btn-secondary:hover { @apply bg-surface-hover border-white/15; }
  .btn-ghost { @apply btn-base bg-transparent text-text-secondary px-3 py-2; }
  .btn-ghost:hover { @apply text-text-primary bg-surface-hover; }
  .btn-danger { @apply btn-base bg-danger text-white px-4 py-2.5; }
  .btn-danger:hover { filter: brightness(0.92); }
  .btn-ai {
    @apply btn-base text-white px-4 py-2.5;
    background-image: linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%);
    background-size: 200% 200%; background-position: 0% 50%;
  }
  .btn-ai:hover { background-position: 100% 50%; box-shadow: 0 8px 24px -8px rgba(139, 92, 246, 0.5); }

  .input-base {
    @apply bg-background-secondary border border-token rounded-input px-3.5 py-2.5 text-text-primary placeholder:text-text-muted;
    transition: border-color 180ms, box-shadow 180ms;
  }
  .input-base:focus { outline: none; border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18); }

  .badge-base { @apply inline-flex items-center gap-1.5 rounded-badge px-2.5 py-1 text-xs font-medium; }

  .text-ai-gradient {
    background: linear-gradient(135deg, #4F46E5 0%, #8B5CF6 50%, #22D3EE 100%);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent; color: transparent;
  }

  .shimmer { position: relative; overflow: hidden; }
  .shimmer::after {
    content: ''; position: absolute; inset: 0; transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    animation: shimmer 1.8s infinite;
  }
}

@layer utilities {
  .focus-ring { @apply outline-none focus-visible:ring-2 focus-visible:ring-primary/60; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
}
```

---

## FILE: src/lib/theme.tsx

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';
interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') { root.classList.remove('dark'); root.classList.add('light'); }
    else { root.classList.remove('light'); root.classList.add('dark'); }
  }, [theme]);

  return (
    <Ctx.Provider value={{ theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
```

---

## FILE: src/lib/data.ts

```ts
export type InterviewType = 'Behavioral' | 'Technical' | 'System Design' | 'Case Study';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type InterviewStatus = 'completed' | 'in-progress' | 'upcoming' | 'failed';

export interface InterviewSession {
  id: string; type: InterviewType; difficulty: Difficulty; duration: number;
  score: number; status: InterviewStatus; date: string; role: string;
  questionsAnswered: number; totalQuestions: number;
}
export interface Resume { id: string; name: string; uploadedAt: string; size: string; isPrimary: boolean; }
export interface Question {
  id: string; prompt: string; type: InterviewType; difficulty: Difficulty;
  answer: string; score?: number; feedback?: string; strengths?: string[]; improvements?: string[];
}

export const interviews: InterviewSession[] = [
  { id: 'iv_01', type: 'Behavioral', difficulty: 'Medium', duration: 30, score: 82, status: 'completed', date: '2026-07-09T10:00:00Z', role: 'Senior Product Manager', questionsAnswered: 8, totalQuestions: 8 },
  { id: 'iv_02', type: 'Technical', difficulty: 'Hard', duration: 45, score: 74, status: 'completed', date: '2026-07-07T14:00:00Z', role: 'Backend Engineer', questionsAnswered: 6, totalQuestions: 6 },
  { id: 'iv_03', type: 'System Design', difficulty: 'Hard', duration: 60, score: 0, status: 'in-progress', date: '2026-07-11T09:00:00Z', role: 'Staff Engineer', questionsAnswered: 3, totalQuestions: 7 },
  { id: 'iv_04', type: 'Behavioral', difficulty: 'Easy', duration: 30, score: 91, status: 'completed', date: '2026-07-05T11:00:00Z', role: 'Product Manager', questionsAnswered: 8, totalQuestions: 8 },
  { id: 'iv_05', type: 'Case Study', difficulty: 'Medium', duration: 45, score: 58, status: 'failed', date: '2026-07-02T16:00:00Z', role: 'Strategy Consultant', questionsAnswered: 5, totalQuestions: 6 },
  { id: 'iv_06', type: 'Technical', difficulty: 'Medium', duration: 45, score: 0, status: 'upcoming', date: '2026-07-14T13:00:00Z', role: 'Full Stack Engineer', questionsAnswered: 0, totalQuestions: 7 },
];

export const resumes: Resume[] = [
  { id: 'r1', name: 'Resume_Senior_PM.pdf', uploadedAt: '2026-06-28', size: '248 KB', isPrimary: true },
  { id: 'r2', name: 'Resume_Engineering.pdf', uploadedAt: '2026-06-15', size: '312 KB', isPrimary: false },
];

export const questions: Question[] = [
  {
    id: 'q1', prompt: 'Tell me about a time you had to influence a team decision without having direct authority. What was the situation and outcome?',
    type: 'Behavioral', difficulty: 'Medium',
    answer: 'In my previous role, I noticed our onboarding flow had a 40% drop-off rate. I gathered data, built a proposal, and presented it to the product and engineering leads. By framing it around revenue impact and user research, I got alignment to prioritize a redesign, which reduced drop-off to 18%.',
    score: 88, feedback: 'Strong STAR structure. You clearly articulated the situation, your specific actions, and a measurable outcome. Consider leading with the quantified impact to hook the interviewer faster.',
    strengths: ['Clear measurable outcome', 'Proactive data gathering', 'Cross-functional alignment'],
    improvements: ['Lead with the impact metric', 'Tighten the situation narrative'],
  },
  {
    id: 'q2', prompt: 'Describe a conflict you had with a coworker and how you resolved it.',
    type: 'Behavioral', difficulty: 'Easy',
    answer: 'A coworker and I disagreed on the architecture for a new service. I scheduled a 1:1 to understand their concerns, shared my reasoning, and we agreed on a hybrid approach that addressed both scalability and time-to-market.',
    score: 76, feedback: 'Good resolution, but the stakes and trade-offs could be sharper. Quantify the impact of the chosen architecture to strengthen the answer.',
    strengths: ['Collaborative approach', 'Concrete resolution'],
    improvements: ['Quantify the trade-off', 'Show the long-term result'],
  },
  {
    id: 'q3', prompt: 'Walk me through how you would design a URL shortener like bit.ly.',
    type: 'System Design', difficulty: 'Hard',
    answer: 'I would start with requirements: read-heavy workload, 100M URLs, 10x reads. Use base62 encoding, a counter service for ID generation, and a cache layer for hot URLs. Sharding by ID prefix for write scaling.',
    score: 71, feedback: 'Solid foundation and good mention of caching. You jumped to the solution quickly — spend more time clarifying constraints and capacity estimates before diving into components.',
    strengths: ['Considered read/write ratio', 'Mentioned caching and sharding'],
    improvements: ['Clarify capacity estimates first', 'Discuss failure modes and monitoring'],
  },
];

export const performanceTrend = [
  { label: 'Jun 28', value: 62 }, { label: 'Jul 02', value: 58 },
  { label: 'Jul 05', value: 91 }, { label: 'Jul 07', value: 74 }, { label: 'Jul 09', value: 82 },
];

export const skillBreakdown = [
  { skill: 'Communication', value: 88 }, { skill: 'Problem Solving', value: 76 },
  { skill: 'Technical Depth', value: 71 }, { skill: 'Leadership', value: 84 }, { skill: 'Structure', value: 79 },
];
```

---

## FILE: src/components/ui.tsx

```tsx
import { type ReactNode } from 'react';

export function Badge({ children, variant = 'neutral', className = '' }: {
  children: ReactNode; variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'ai' | 'primary'; className?: string;
}) {
  const variants: Record<string, string> = {
    neutral: 'bg-white/5 text-text-secondary border border-token',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-danger/10 text-danger border border-danger/20',
    info: 'bg-info/10 text-info border border-info/20',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    ai: 'bg-ai-primary/10 text-ai-primary border border-ai-primary/20',
  };
  return <span className={`badge-base ${variants[variant]} ${className}`}>{children}</span>;
}

export function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const stroke = 8, r = (size - stroke) / 2, c = 2 * Math.PI * r, offset = c - (score / 100) * c;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-text-primary">{score}</span>
        <span className="text-[10px] text-text-muted uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

export function ProgressBar({ value, color = '#4F46E5' }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: {
  icon: ReactNode; title: string; description: string; action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-card bg-white/5 text-text-muted">{icon}</div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
```

---

## FILE: src/components/nav.tsx

```tsx
import { MessageSquare, BarChart3, FileText, LayoutDashboard, Sparkles, Settings } from 'lucide-react';
import { type ReactNode } from 'react';

export type Page = 'landing' | 'dashboard' | 'interviews' | 'resumes' | 'reports' | 'settings';

interface NavItem { id: Page; label: string; icon: ReactNode; }

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'interviews', label: 'Interviews', icon: <MessageSquare size={20} /> },
  { id: 'resumes', label: 'Resumes', icon: <FileText size={20} /> },
  { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: 'h-7 w-7', md: 'h-8 w-8', lg: 'h-10 w-10' };
  const iconSize = { sm: 16, md: 18, lg: 22 };
  const text = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dims[size]} relative flex items-center justify-center rounded-btn bg-ai-gradient shadow-glow`}>
        <Sparkles size={iconSize[size]} className="text-white" />
      </div>
      <span className={`${text[size]} font-semibold tracking-tight text-text-primary`}>
        Intervue<span className="text-ai-gradient">X</span>
      </span>
    </div>
  );
}
```

---

## FILE: src/components/AppShell.tsx

```tsx
import { type ReactNode } from 'react';
import { navItems, Logo, type Page } from './nav';
import { Sun, Moon, Bell, Search, Sparkles } from 'lucide-react';
import { useTheme } from '../lib/theme';

export function AppShell({ current, onNavigate, children }: {
  current: Page; onNavigate: (p: Page) => void; children: ReactNode;
}) {
  const { theme, toggle } = useTheme();
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-token bg-background-secondary md:flex">
        <div className="px-5 py-5">
          <button onClick={() => onNavigate('landing')} className="focus-ring rounded-btn"><Logo /></button>
        </div>
        <nav className="flex-1 px-3 py-2">
          <p className="px-3 pb-2 pt-3 text-[11px] font-medium uppercase tracking-wider text-text-muted">Workspace</p>
          {navItems.map((item) => {
            const active = current === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                className={`group mb-0.5 flex w-full items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium transition-all focus-ring ${
                  active ? 'bg-white/[0.06] text-text-primary shadow-soft' : 'text-text-muted hover:bg-surface-hover hover:text-text-secondary'}`}>
                <span className={active ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary'}>{item.icon}</span>
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-token p-3">
          <div className="flex items-center gap-3 rounded-card bg-white/[0.03] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ai-gradient text-sm font-semibold text-white">A</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">Alex Morgan</p>
              <p className="truncate text-xs text-text-muted">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-token bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <div className="md:hidden"><Logo size="sm" /></div>
          <div className="relative ml-auto hidden max-w-xs flex-1 sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input placeholder="Search interviews, reports..." className="input-base w-full !py-2 pl-9 text-sm" />
          </div>
          <div className="ml-auto flex items-center gap-2 sm:ml-3">
            <button onClick={toggle} aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-btn text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary focus-ring">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-btn text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary focus-ring">
              <Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <button className="btn-primary ml-1 hidden text-sm sm:inline-flex"><Sparkles size={16} />New Interview</button>
          </div>
        </header>
        <nav className="flex items-center gap-1 overflow-x-auto border-b border-token bg-background-secondary px-3 py-2 no-scrollbar md:hidden">
          {navItems.map((item) => {
            const active = current === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-btn px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-white/[0.06] text-text-primary' : 'text-text-muted'}`}>
                {item.icon}{item.label}
              </button>
            );
          })}
        </nav>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
```

---

## FILE: src/pages/LandingPage.tsx (→ app/page.tsx in Next.js, add 'use client')

```tsx
'use client';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Check, Brain, Target, TrendingUp, FileText, Clock, Shield, Zap, Star } from 'lucide-react';
import { Logo } from '../components/nav';
import { Badge } from '../components/ui';
import type { Page } from '../components/nav';

const features = [
  { icon: <Brain size={22} />, title: 'AI-Powered Interviews', desc: 'Adaptive questions that mirror real interview scenarios across behavioral, technical, and system design rounds.' },
  { icon: <Target size={22} />, title: 'Targeted Practice', desc: 'Personalize sessions by role, difficulty, and duration. Focus on the exact skills you need to land the offer.' },
  { icon: <TrendingUp size={22} />, title: 'Performance Analytics', desc: 'Track progress over time with detailed reports, score trends, and skill-level breakdowns.' },
  { icon: <FileText size={22} />, title: 'Resume-Aware Sessions', desc: 'Upload your resume and let IntervueX tailor questions to your experience and target role.' },
  { icon: <Clock size={22} />, title: 'Auto-Save & Resume', desc: 'Never lose progress. Sessions auto-save and can be resumed from exactly where you left off.' },
  { icon: <Shield size={22} />, title: 'Secure & Private', desc: 'Your data is encrypted at rest and in transit. Resumes are stored securely in the cloud.' },
];
const steps = [
  { num: '01', title: 'Upload your resume', desc: 'Securely upload your resume to personalize the interview experience.' },
  { num: '02', title: 'Configure your session', desc: 'Choose interview type, difficulty, duration, and target role.' },
  { num: '03', title: 'Practice with AI', desc: 'Answer adaptive questions one by one with auto-save throughout.' },
  { num: '04', title: 'Review your report', desc: 'Get scores, strengths, weaknesses, and a full performance breakdown.' },
];
const stats = [
  { value: '12K+', label: 'Mock interviews completed' }, { value: '94%', label: 'Felt more confident' },
  { value: '3.2x', label: 'More likely to pass' }, { value: '4.9/5', label: 'Average user rating' },
];
const testimonials = [
  { quote: 'IntervueX felt like a real interview. The AI feedback caught things I never noticed about my answers — I landed my dream role at Stripe.', name: 'Priya Sharma', role: 'Senior PM at Stripe' },
  { quote: 'The performance analytics are unreal. I could see exactly which skills were weak and practiced until they were sharp. Game changer.', name: 'Marcus Chen', role: 'Backend Engineer at Linear' },
  { quote: 'I went from failing system design rounds to getting offers at two FAANG companies. The structured practice made all the difference.', name: 'Elena Vasquez', role: 'Staff Engineer at Meta' },
];
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } };

export function LandingPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] bg-indigo-glow opacity-60" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] bg-cyan-glow opacity-40" />
        <div className="absolute left-1/2 top-2/3 h-[450px] w-[450px] -translate-x-1/2 bg-purple-glow opacity-30" />
        <div className="absolute inset-0 bg-grid-texture bg-grid opacity-[0.4]" />
      </div>
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
        <Logo size="lg" />
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-text-secondary hover:text-text-primary">Features</a>
          <a href="#how" className="text-sm font-medium text-text-secondary hover:text-text-primary">How it works</a>
          <a href="#testimonials" className="text-sm font-medium text-text-secondary hover:text-text-primary">Testimonials</a>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('dashboard')} className="btn-ghost text-sm">Sign in</button>
          <button onClick={() => onNavigate('dashboard')} className="btn-primary text-sm">Get started<ArrowRight size={16} /></button>
        </div>
      </header>
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-16 md:px-8 md:pt-24">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex"><Badge variant="ai" className="glass"><Sparkles size={14} />AI-powered interview preparation</Badge></div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-text-primary md:text-6xl">Master every interview.<br /><span className="text-ai-gradient">Powered by AI.</span></h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">Practice with adaptive mock interviews that feel like the real thing. Get instant feedback, detailed reports, and track your progress to land your dream role.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => onNavigate('dashboard')} className="btn-ai w-full sm:w-auto"><Sparkles size={18} />Start a mock interview</button>
            <button onClick={() => onNavigate('dashboard')} className="btn-secondary w-full sm:w-auto">View dashboard<ArrowRight size={16} /></button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-text-muted">
            <span className="flex items-center gap-1.5"><Check size={14} className="text-success" />No credit card</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-success" />Free to start</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-success" />Cancel anytime</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="mx-auto mt-16 max-w-4xl">
          <div className="glass rounded-dialog shadow-soft-lg">
            <div className="flex items-center gap-2 border-b border-token px-5 py-3.5">
              <div className="flex gap-1.5"><div className="h-3 w-3 rounded-full bg-danger/60" /><div className="h-3 w-3 rounded-full bg-warning/60" /><div className="h-3 w-3 rounded-full bg-success/60" /></div>
              <span className="ml-2 text-xs text-text-muted">intervuex.ai/session/behavioral</span>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-[1.4fr_1fr] md:p-6">
              <div className="rounded-card border border-token bg-surface p-5">
                <div className="mb-3 flex items-center gap-2"><Badge variant="ai">Question 3 of 8</Badge><Badge variant="neutral">Behavioral</Badge></div>
                <p className="text-sm font-medium leading-relaxed text-text-primary">Tell me about a time you had to influence a team decision without direct authority. What was the situation and outcome?</p>
                <div className="mt-4 space-y-2"><div className="h-2 w-full rounded-full bg-white/5" /><div className="h-2 w-full rounded-full bg-white/5" /><div className="h-2 w-3/4 rounded-full bg-white/5" /></div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-text-muted"><Clock size={14} />18:42 remaining</span>
                  <span className="flex items-center gap-1.5 text-xs text-success"><Check size={14} />Auto-saved</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="rounded-card border border-token bg-surface p-4">
                  <div className="flex items-center gap-2 text-xs text-text-muted"><Zap size={14} className="text-ai-primary" />AI Insight</div>
                  <p className="mt-2 text-sm text-text-secondary">Lead with the quantified impact to hook the interviewer faster. Strong STAR structure detected.</p>
                </div>
                <div className="rounded-card border border-token bg-surface p-4">
                  <p className="text-xs text-text-muted">Current score</p>
                  <div className="mt-2 flex items-end gap-2"><span className="text-3xl font-bold text-text-primary">82</span><span className="mb-1 text-xs text-success">+6 from last</span></div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/5"><div className="h-full w-[82%] rounded-full bg-ai-gradient" /></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="relative z-10 border-y border-token bg-background-secondary/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 md:grid-cols-4 md:px-8">
          {stats.map((s) => (<div key={s.label} className="px-4 py-8 text-center"><p className="text-3xl font-bold text-text-primary md:text-4xl">{s.value}</p><p className="mt-1 text-sm text-text-muted">{s.label}</p></div>))}
        </div>
      </section>
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="primary">Features</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">Everything you need to ace the interview</h2>
          <p className="mt-4 text-lg text-text-secondary">A complete preparation platform built for serious candidates who want to perform at their best.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4, delay: i * 0.05 }} className="card-base group p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-btn bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">{f.icon}</div>
              <h3 className="text-base font-semibold text-text-primary">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section id="how" className="relative z-10 border-y border-token bg-background-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="ai">How it works</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">Four steps to interview readiness</h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="relative">
                <div className="card-base h-full p-6"><span className="text-ai-gradient text-sm font-bold">{s.num}</span><h3 className="mt-3 text-base font-semibold text-text-primary">{s.title}</h3><p className="mt-2 text-sm leading-relaxed text-text-muted">{s.desc}</p></div>
                {i < steps.length - 1 && <ArrowRight size={18} className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-text-disabled lg:block" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="testimonials" className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-warning text-warning" />)}</div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">Loved by ambitious candidates</h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="card-base p-6">
              <p className="text-sm leading-relaxed text-text-secondary">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-ai-gradient text-sm font-semibold text-white">{t.name[0]}</div><div><p className="text-sm font-medium text-text-primary">{t.name}</p><p className="text-xs text-text-muted">{t.role}</p></div></div>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="relative overflow-hidden rounded-dialog border border-token bg-background-secondary p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0"><div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 bg-indigo-glow opacity-50" /></div>
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">Ready to land your next offer?</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">Start your first mock interview in minutes. No credit card required.</p>
            <button onClick={() => onNavigate('dashboard')} className="btn-ai mt-8"><Sparkles size={18} />Get started free<ArrowRight size={16} /></button>
          </div>
        </div>
      </section>
      <footer className="relative z-10 border-t border-token">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-8">
          <Logo /><p className="text-sm text-text-muted">© 2026 IntervueX. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-text-muted"><a href="#" className="hover:text-text-primary">Privacy</a><a href="#" className="hover:text-text-primary">Terms</a><a href="#" className="hover:text-text-primary">Contact</a></div>
        </div>
      </footer>
    </div>
  );
}
```

---

## FILE: src/pages/DashboardPage.tsx (→ app/dashboard/page.tsx, add 'use client')

```tsx
'use client';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, TrendingUp, Sparkles, ArrowRight, Clock, Play, Plus, Trophy, Target, ChevronRight } from 'lucide-react';
import { Badge, ProgressBar } from '../components/ui';
import { interviews, resumes, performanceTrend, skillBreakdown, type InterviewSession } from '../lib/data';
import type { Page } from '../components/nav';

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as const } }) };

function statusBadge(status: InterviewSession['status']) {
  return { completed: { variant: 'success' as const, label: 'Completed' }, 'in-progress': { variant: 'warning' as const, label: 'In progress' }, upcoming: { variant: 'info' as const, label: 'Upcoming' }, failed: { variant: 'danger' as const, label: 'Failed' } }[status];
}

export function DashboardPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const completed = interviews.filter((i) => i.status === 'completed');
  const avgScore = Math.round(completed.reduce((a, b) => a + b.score, 0) / completed.length || 0);
  const inProgress = interviews.filter((i) => i.status === 'in-progress');
  const upcoming = interviews.filter((i) => i.status === 'upcoming');
  const recent = [...interviews].slice(0, 4);
  const primaryResume = resumes.find((r) => r.isPrimary);

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><p className="text-sm text-text-muted">Welcome back,</p><h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Alex Morgan</h1><p className="mt-1 text-sm text-text-muted">You've completed {completed.length} interviews. Keep the momentum going.</p></div>
          <div className="flex gap-2"><button onClick={() => onNavigate('interviews')} className="btn-secondary text-sm"><FileText size={16} />Upload resume</button><button onClick={() => onNavigate('interviews')} className="btn-ai text-sm"><Sparkles size={16} />New interview</button></div>
        </div>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{ label: 'Total interviews', value: interviews.length, icon: <MessageSquare size={18} />, accent: '#4F46E5', change: '+2 this week' }, { label: 'Average score', value: avgScore, icon: <Trophy size={18} />, accent: '#10B981', change: '+6 pts' }, { label: 'In progress', value: inProgress.length, icon: <Clock size={18} />, accent: '#F59E0B', change: 'Resume now' }, { label: 'Upcoming', value: upcoming.length, icon: <Target size={18} />, accent: '#22D3EE', change: 'Scheduled' }].map((s, i) => (
          <motion.div key={s.label} initial="hidden" animate="show" custom={i + 1} variants={fadeUp}>
            <div className="card-base p-5"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-btn" style={{ background: `${s.accent}1a`, color: s.accent }}>{s.icon}</div><span className="text-xs text-text-muted">{s.change}</span></div><p className="mt-4 text-3xl font-bold text-text-primary">{s.value}</p><p className="mt-1 text-sm text-text-muted">{s.label}</p></div>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial="hidden" animate="show" custom={5} variants={fadeUp} className="card-base p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-base font-semibold text-text-primary">Performance overview</h2><p className="text-sm text-text-muted">Score trend across recent interviews</p></div><button onClick={() => onNavigate('reports')} className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover">View reports<ChevronRight size={16} /></button></div>
          <div className="relative h-48">
            <svg viewBox="0 0 400 180" className="h-full w-full" preserveAspectRatio="none">
              <defs><linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" /><stop offset="100%" stopColor="#4F46E5" stopOpacity="0" /></linearGradient><linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4F46E5" /><stop offset="50%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#22D3EE" /></linearGradient></defs>
              {[0, 1, 2, 3].map((g) => <line key={g} x1="0" y1={g * 45 + 10} x2="400" y2={g * 45 + 10} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}
              {(() => { const pts = performanceTrend.map((p, i) => { const x = (i / (performanceTrend.length - 1)) * 380 + 10; const y = 170 - (p.value / 100) * 150; return { x, y, ...p }; }); const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '); const area = `${path} L 390 170 L 10 170 Z`; return (<><path d={area} fill="url(#perfGrad)" /><path d={path} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />{pts.map((p) => (<g key={p.label}><circle cx={p.x} cy={p.y} r="4" fill="#09090B" stroke="#8B5CF6" strokeWidth="2" /><text x={p.x} y={p.y - 12} textAnchor="middle" className="fill-text-secondary" style={{ fontSize: 10 }}>{p.value}</text></g>))}</>); })()}
            </svg>
          </div>
          <div className="mt-2 flex justify-between px-2 text-xs text-text-muted">{performanceTrend.map((p) => <span key={p.label}>{p.label}</span>)}</div>
        </motion.div>
        <motion.div initial="hidden" animate="show" custom={6} variants={fadeUp} className="card-base p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-semibold text-text-primary">Resume</h2><button onClick={() => onNavigate('resumes')} className="text-text-muted hover:text-text-primary"><ChevronRight size={18} /></button></div>
          {primaryResume ? (<><div className="flex items-center gap-3 rounded-card border border-token bg-background-secondary p-4"><div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary/10 text-primary"><FileText size={20} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-text-primary">{primaryResume.name}</p><p className="text-xs text-text-muted">Uploaded {primaryResume.uploadedAt}</p></div><Badge variant="primary">Primary</Badge></div><div className="mt-3 flex items-center justify-between text-xs text-text-muted"><span>{resumes.length} resumes total</span><button onClick={() => onNavigate('resumes')} className="flex items-center gap-1 text-primary hover:text-primary-hover">Manage<ArrowRight size={12} /></button></div></>) : (<div className="flex flex-col items-center py-6 text-center"><FileText size={32} className="text-text-disabled" /><p className="mt-3 text-sm text-text-muted">No resume uploaded</p><button className="btn-secondary mt-4 text-sm"><Plus size={16} />Upload resume</button></div>)}
        </motion.div>
        <motion.div initial="hidden" animate="show" custom={7} variants={fadeUp} className="card-base p-6">
          <h2 className="mb-4 text-base font-semibold text-text-primary">Skill breakdown</h2>
          <div className="space-y-4">{skillBreakdown.map((s) => (<div key={s.skill}><div className="mb-1.5 flex items-center justify-between text-sm"><span className="text-text-secondary">{s.skill}</span><span className="font-medium text-text-primary">{s.value}</span></div><ProgressBar value={s.value} color={s.value >= 80 ? '#10B981' : s.value >= 65 ? '#4F46E5' : '#F59E0B'} /></div>))}</div>
        </motion.div>
        <motion.div initial="hidden" animate="show" custom={8} variants={fadeUp} className="card-base p-6 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-text-primary">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[{ title: 'Start behavioral interview', desc: '30 min · Medium', icon: <MessageSquare size={20} />, action: () => onNavigate('interviews'), ai: true }, { title: 'Practice system design', desc: '45 min · Hard', icon: <Target size={20} />, action: () => onNavigate('interviews') }, { title: 'Review last report', desc: '82 score · Behavioral', icon: <TrendingUp size={20} />, action: () => onNavigate('reports') }, { title: 'Upload new resume', desc: 'Personalize sessions', icon: <FileText size={20} />, action: () => onNavigate('resumes') }].map((a) => (
              <button key={a.title} onClick={a.action} className="group flex items-center gap-3 rounded-card border border-token bg-background-secondary p-4 text-left transition-all hover:border-white/15 hover:bg-surface-hover focus-ring">
                <div className={`flex h-10 w-10 items-center justify-center rounded-btn ${a.ai ? 'bg-ai-gradient text-white' : 'bg-primary/10 text-primary'}`}>{a.icon}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-text-primary">{a.title}</p><p className="truncate text-xs text-text-muted">{a.desc}</p></div>
                <ArrowRight size={16} className="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-text-primary" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div initial="hidden" animate="show" custom={9} variants={fadeUp} className="card-base p-6">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-base font-semibold text-text-primary">Recent interviews</h2><p className="text-sm text-text-muted">Your latest practice sessions</p></div><button onClick={() => onNavigate('interviews')} className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover">View all<ChevronRight size={16} /></button></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px]"><thead><tr className="border-b border-token text-left text-xs uppercase tracking-wider text-text-muted"><th className="pb-3 font-medium">Role</th><th className="pb-3 font-medium">Type</th><th className="pb-3 font-medium">Status</th><th className="pb-3 font-medium">Score</th><th className="pb-3 font-medium">Date</th><th className="pb-3" /></tr></thead>
          <tbody>{recent.map((iv) => { const sb = statusBadge(iv.status); return (<tr key={iv.id} className="border-b border-divider last:border-0 transition-colors hover:bg-white/[0.02]"><td className="py-3.5"><p className="text-sm font-medium text-text-primary">{iv.role}</p><p className="text-xs text-text-muted">{iv.difficulty} · {iv.duration} min</p></td><td className="py-3.5"><Badge variant="neutral">{iv.type}</Badge></td><td className="py-3.5"><Badge variant={sb.variant}>{sb.label}</Badge></td><td className="py-3.5">{iv.status === 'completed' || iv.status === 'failed' ? <div className="flex items-center gap-2"><span className={`text-sm font-semibold ${iv.score >= 80 ? 'text-success' : iv.score >= 60 ? 'text-warning' : 'text-danger'}`}>{iv.score}</span><div className="w-16"><ProgressBar value={iv.score} color={iv.score >= 80 ? '#10B981' : iv.score >= 60 ? '#F59E0B' : '#EF4444'} /></div></div> : <span className="text-sm text-text-muted">—</span>}</td><td className="py-3.5 text-sm text-text-muted">{new Date(iv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td><td className="py-3.5 text-right"><button onClick={() => onNavigate(iv.status === 'in-progress' ? 'interviews' : 'reports')} className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover">{iv.status === 'in-progress' ? <><Play size={14} />Resume</> : iv.status === 'upcoming' ? <>Start</> : <>View</>}</button></td></tr>); })}</tbody>
        </table></div>
      </motion.div>
      <motion.div initial="hidden" animate="show" custom={10} variants={fadeUp}>
        <div className="relative overflow-hidden rounded-card border border-ai-primary/20 bg-ai-gradient-soft p-6">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-purple-glow opacity-40" />
          <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-ai-gradient text-white shadow-ai-glow"><Sparkles size={22} /></div><div><h3 className="text-base font-semibold text-text-primary">AI Insight</h3><p className="mt-1 max-w-xl text-sm text-text-secondary">Your communication scores improved 12% over the last 3 sessions. System design remains your weakest area — schedule a focused practice session to close the gap.</p></div></div>
            <button onClick={() => onNavigate('interviews')} className="btn-ai shrink-0 text-sm"><Sparkles size={16} />Practice system design</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
```

---

## FILE: src/pages/InterviewsPage.tsx (→ app/interviews/page.tsx, add 'use client')

```tsx
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Clock, Check, Play, Pause, Send, Brain, Code, Layers, Briefcase, ChevronRight } from 'lucide-react';
import { Badge, ProgressBar, EmptyState } from '../components/ui';
import { interviews, resumes, type InterviewType, type Difficulty, type InterviewSession } from '../lib/data';
import type { Page } from '../components/nav';

type View = 'list' | 'setup' | 'session';

const typeIcons: Record<InterviewType, React.ReactNode> = { Behavioral: <Brain size={20} />, Technical: <Code size={20} />, 'System Design': <Layers size={20} />, 'Case Study': <Briefcase size={20} /> };

function statusBadge(status: InterviewSession['status']) {
  return { completed: { variant: 'success' as const, label: 'Completed' }, 'in-progress': { variant: 'warning' as const, label: 'In progress' }, upcoming: { variant: 'info' as const, label: 'Upcoming' }, failed: { variant: 'danger' as const, label: 'Failed' } }[status];
}

export function InterviewsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [view, setView] = useState<View>('list');
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'upcoming'>('all');
  const filtered = filter === 'all' ? interviews : interviews.filter((i) => i.status === filter);

  if (view === 'setup') return <SetupView onBack={() => setView('list')} onStart={() => setView('session')} />;
  if (view === 'session') return <SessionView onBack={() => setView('list')} onComplete={() => { setView('list'); onNavigate('reports'); }} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Interviews</h1><p className="mt-1 text-sm text-text-muted">Create, resume, and review your mock interview sessions.</p></div>
        <button onClick={() => setView('setup')} className="btn-ai text-sm"><Sparkles size={16} />New interview</button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(['all', 'completed', 'in-progress', 'upcoming'] as const).map((f) => (<button key={f} onClick={() => setFilter(f)} className={`shrink-0 rounded-badge px-3.5 py-1.5 text-sm font-medium transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary hover:bg-surface-hover'}`}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}</button>))}
      </div>
      {filtered.length === 0 ? (<div className="card-base"><EmptyState icon={<Sparkles size={24} />} title="No interviews yet" description="Start your first mock interview to see it here. It only takes a few minutes to set up." action={<button onClick={() => setView('setup')} className="btn-ai text-sm"><Sparkles size={16} />New interview</button>} /></div>) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((iv, i) => { const sb = statusBadge(iv.status); return (
            <motion.div key={iv.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }} className="card-base group p-5">
              <div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary/10 text-primary">{typeIcons[iv.type]}</div><Badge variant={sb.variant}>{sb.label}</Badge></div>
              <h3 className="mt-4 text-base font-semibold text-text-primary">{iv.role}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted"><span>{iv.type}</span><span className="text-text-disabled">·</span><span>{iv.difficulty}</span><span className="text-text-disabled">·</span><span className="flex items-center gap-1"><Clock size={12} />{iv.duration} min</span></div>
              {(iv.status === 'completed' || iv.status === 'failed') && <div className="mt-4"><div className="mb-1.5 flex items-center justify-between text-sm"><span className="text-text-muted">Score</span><span className={`font-semibold ${iv.score >= 80 ? 'text-success' : iv.score >= 60 ? 'text-warning' : 'text-danger'}`}>{iv.score}/100</span></div><ProgressBar value={iv.score} color={iv.score >= 80 ? '#10B981' : iv.score >= 60 ? '#F59E0B' : '#EF4444'} /></div>}
              {iv.status === 'in-progress' && <div className="mt-4"><div className="mb-1.5 flex items-center justify-between text-sm"><span className="text-text-muted">Progress</span><span className="text-text-secondary">{iv.questionsAnswered}/{iv.totalQuestions}</span></div><ProgressBar value={(iv.questionsAnswered / iv.totalQuestions) * 100} color="#F59E0B" /></div>}
              <button onClick={() => onNavigate(iv.status === 'completed' || iv.status === 'failed' ? 'reports' : 'interviews')} className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-btn border border-token bg-background-secondary py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary">{iv.status === 'in-progress' ? <><Play size={14} />Resume</> : iv.status === 'upcoming' ? <>Start now</> : <>View report</>}<ChevronRight size={14} /></button>
            </motion.div>); })}
        </div>
      )}
    </div>
  );
}

function SetupView({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const [type, setType] = useState<InterviewType>('Behavioral');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [duration, setDuration] = useState(30);
  const [role, setRole] = useState('Senior Product Manager');
  const [resumeId, setResumeId] = useState(resumes[0]?.id || '');
  const types: { label: InterviewType; icon: React.ReactNode; desc: string }[] = [
    { label: 'Behavioral', icon: <Brain size={20} />, desc: 'STAR-based questions about past experiences' },
    { label: 'Technical', icon: <Code size={20} />, desc: 'Domain-specific technical questions' },
    { label: 'System Design', icon: <Layers size={20} />, desc: 'Scalable architecture design problems' },
    { label: 'Case Study', icon: <Briefcase size={20} />, desc: 'Business strategy and analytical cases' },
  ];
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary"><ArrowLeft size={16} />Back to interviews</button>
      <div><div className="mb-2 inline-flex"><Badge variant="ai"><Sparkles size={14} />New interview</Badge></div><h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Configure your session</h1><p className="mt-1 text-sm text-text-muted">Tailor the interview to your target role and skill level.</p></div>
      <div className="card-base p-6"><h2 className="mb-4 text-sm font-semibold text-text-primary">Interview type</h2>
        <div className="grid gap-3 sm:grid-cols-2">{types.map((t) => (<button key={t.label} onClick={() => setType(t.label)} className={`flex items-start gap-3 rounded-card border p-4 text-left transition-all ${type === t.label ? 'border-primary bg-primary/5 shadow-glow' : 'border-token bg-background-secondary hover:border-white/15 hover:bg-surface-hover'}`}><div className={`flex h-10 w-10 items-center justify-center rounded-btn ${type === t.label ? 'bg-ai-gradient text-white' : 'bg-white/5 text-text-muted'}`}>{t.icon}</div><div><p className="text-sm font-medium text-text-primary">{t.label}</p><p className="mt-0.5 text-xs text-text-muted">{t.desc}</p></div></button>))}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-base p-6"><label className="mb-2 block text-sm font-semibold text-text-primary">Target role</label><input value={role} onChange={(e) => setRole(e.target.value)} className="input-base w-full" placeholder="e.g. Senior Product Manager" /><p className="mt-2 text-xs text-text-muted">Questions will be tailored to this role.</p></div>
        <div className="card-base p-6"><label className="mb-2 block text-sm font-semibold text-text-primary">Resume</label><select value={resumeId} onChange={(e) => setResumeId(e.target.value)} className="input-base w-full">{resumes.map((r) => <option key={r.id} value={r.id}>{r.name}{r.isPrimary ? ' (Primary)' : ''}</option>)}<option value="">No resume</option></select><p className="mt-2 text-xs text-text-muted">Personalize questions based on your resume.</p></div>
      </div>
      <div className="card-base p-6"><h2 className="mb-4 text-sm font-semibold text-text-primary">Difficulty</h2><div className="grid grid-cols-3 gap-3">{(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (<button key={d} onClick={() => setDifficulty(d)} className={`rounded-card border py-3 text-sm font-medium transition-all ${difficulty === d ? d === 'Easy' ? 'border-success bg-success/5 text-success' : d === 'Medium' ? 'border-warning bg-warning/5 text-warning' : 'border-danger bg-danger/5 text-danger' : 'border-token bg-background-secondary text-text-secondary hover:bg-surface-hover'}`}>{d}</button>))}</div></div>
      <div className="card-base p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold text-text-primary">Duration</h2><span className="flex items-center gap-1.5 text-sm font-medium text-primary"><Clock size={16} />{duration} min</span></div><input type="range" min={15} max={60} step={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-primary" /><div className="mt-2 flex justify-between text-xs text-text-muted"><span>15 min</span><span>30 min</span><span>45 min</span><span>60 min</span></div></div>
      <div className="card-base p-6"><h2 className="mb-4 text-sm font-semibold text-text-primary">Session summary</h2><div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4"><div className="rounded-card bg-background-secondary p-3"><p className="text-xs text-text-muted">Type</p><p className="mt-1 font-medium text-text-primary">{type}</p></div><div className="rounded-card bg-background-secondary p-3"><p className="text-xs text-text-muted">Difficulty</p><p className="mt-1 font-medium text-text-primary">{difficulty}</p></div><div className="rounded-card bg-background-secondary p-3"><p className="text-xs text-text-muted">Duration</p><p className="mt-1 font-medium text-text-primary">{duration} min</p></div><div className="rounded-card bg-background-secondary p-3"><p className="text-xs text-text-muted">Questions</p><p className="mt-1 font-medium text-text-primary">{Math.round(duration / 5)}</p></div></div><button onClick={onStart} className="btn-ai mt-5 w-full"><Sparkles size={18} />Start interview</button></div>
    </div>
  );
}

function SessionView({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const sessionQuestions = ['Tell me about a time you had to influence a team decision without direct authority. What was the situation and outcome?', 'Describe a project where you had to balance competing priorities. How did you decide what to focus on?', 'Walk me through a situation where you received critical feedback. How did you respond and what changed?', 'Tell me about a time you failed at something important. What did you learn?', 'Describe a moment when you had to make a decision with incomplete information.', 'How do you handle working with a difficult stakeholder or teammate?'];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(sessionQuestions.length).fill(''));
  const [saved, setSaved] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const [paused, setPaused] = useState(false);

  useEffect(() => { const t = setInterval(() => { if (!paused) setSecondsLeft((s) => Math.max(0, s - 1)); }, 1000); return () => clearInterval(t); }, [paused]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const isLast = current === sessionQuestions.length - 1;
  const progress = ((current + 1) / sessionQuestions.length) * 100;

  const updateAnswer = (val: string) => { setAnswers((a) => a.map((ans, i) => (i === current ? val : ans))); setSaved(false); setTimeout(() => setSaved(true), 800); };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary"><ArrowLeft size={16} />Exit</button>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 text-xs ${saved ? 'text-success' : 'text-text-muted'}`}><Check size={14} className={saved ? '' : 'opacity-40'} />{saved ? 'Auto-saved' : 'Saving...'}</span>
          <button onClick={() => setPaused((p) => !p)} className="flex items-center gap-1.5 rounded-btn border border-token bg-background-secondary px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-hover">{paused ? <><Play size={14} />Resume</> : <><Pause size={14} />Pause</>}</button>
          <span className={`flex items-center gap-1.5 rounded-btn px-3 py-1.5 text-sm font-medium ${secondsLeft < 60 ? 'bg-danger/10 text-danger' : 'bg-white/5 text-text-secondary'}`}><Clock size={14} />{mm}:{ss}</span>
        </div>
      </div>
      <div><div className="mb-2 flex items-center justify-between text-sm"><span className="text-text-muted">Question {current + 1} of {sessionQuestions.length}</span><span className="text-text-muted">{Math.round(progress)}%</span></div><ProgressBar value={progress} color="#8B5CF6" /></div>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="card-base p-6">
          <div className="mb-4 flex items-center gap-2"><Badge variant="ai"><Sparkles size={14} />Behavioral</Badge><Badge variant="neutral">Medium</Badge></div>
          <p className="text-lg font-medium leading-relaxed text-text-primary">{sessionQuestions[current]}</p>
          <textarea value={answers[current]} onChange={(e) => updateAnswer(e.target.value)} placeholder="Type your answer here... Use the STAR method for behavioral questions." className="input-base mt-5 min-h-[200px] w-full resize-y leading-relaxed" />
          <div className="mt-2 flex items-center justify-between text-xs text-text-muted"><span>{answers[current].split(/\s+/).filter(Boolean).length} words</span><span>Aim for 150-300 words</span></div>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} className="btn-secondary text-sm disabled:opacity-40"><ArrowLeft size={16} />Previous</button>
        {isLast ? <button onClick={onComplete} className="btn-ai text-sm"><Send size={16} />Submit interview</button> : <button onClick={() => setCurrent((c) => Math.min(sessionQuestions.length - 1, c + 1))} className="btn-primary text-sm">Next<ArrowRight size={16} /></button>}
      </div>
      <div className="card-base p-4"><p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Question navigator</p><div className="flex flex-wrap gap-2">{sessionQuestions.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`flex h-8 w-8 items-center justify-center rounded-btn text-xs font-medium transition-all ${i === current ? 'bg-ai-gradient text-white' : answers[i]?.length > 0 ? 'bg-success/10 text-success border border-success/20' : 'bg-white/5 text-text-muted hover:bg-surface-hover'}`}>{i + 1}</button>))}</div></div>
    </div>
  );
}
```

---

## FILE: src/pages/ReportsPage.tsx (→ app/reports/page.tsx, add 'use client')

```tsx
'use client';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Check, AlertTriangle, Trophy, Target, Brain, ChevronRight } from 'lucide-react';
import { Badge, ScoreRing, ProgressBar } from '../components/ui';
import { interviews, questions, skillBreakdown, performanceTrend } from '../lib/data';
import type { Page } from '../components/nav';

export function ReportsPage(_: { onNavigate: (p: Page) => void }) {
  const completedInterviews = interviews.filter((i) => i.status === 'completed' || i.status === 'failed');
  const selected = completedInterviews[0];
  const avgScore = Math.round(completedInterviews.reduce((a, b) => a + b.score, 0) / completedInterviews.length || 0);
  const bestScore = Math.max(...completedInterviews.map((i) => i.score));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Reports & Analytics</h1><p className="mt-1 text-sm text-text-muted">Review your interview performance and track progress over time.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{ label: 'Interviews completed', value: completedInterviews.length, icon: <Brain size={18} />, accent: '#4F46E5' }, { label: 'Average score', value: avgScore, icon: <TrendingUp size={18} />, accent: '#10B981' }, { label: 'Best score', value: bestScore, icon: <Trophy size={18} />, accent: '#F59E0B' }, { label: 'Improvement', value: '+24%', icon: <Target size={18} />, accent: '#22D3EE' }].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="card-base p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-btn" style={{ background: `${s.accent}1a`, color: s.accent }}>{s.icon}</div><div><p className="text-2xl font-bold text-text-primary">{s.value}</p><p className="text-xs text-text-muted">{s.label}</p></div></div></div>
          </motion.div>
        ))}
      </div>
      {selected && (<div className="space-y-4">
        <div className="flex items-center gap-2"><Badge variant="ai"><Sparkles size={14} />Latest report</Badge><span className="text-sm text-text-muted">{selected.role} · {selected.type}</span></div>
        <div className="grid gap-4 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-base flex flex-col items-center p-6">
            <p className="mb-4 text-sm font-medium text-text-muted">Overall score</p><ScoreRing score={selected.score} size={140} />
            <div className="mt-4 flex items-center gap-2"><Badge variant={selected.score >= 80 ? 'success' : selected.score >= 60 ? 'warning' : 'danger'}>{selected.score >= 80 ? 'Excellent' : selected.score >= 60 ? 'Good' : 'Needs work'}</Badge></div>
            <p className="mt-3 text-xs text-text-muted">{new Date(selected.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-base p-6 lg:col-span-2">
            <h3 className="text-base font-semibold text-text-primary">Strengths & weaknesses</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-success"><Check size={16} />Strengths</p><ul className="space-y-2">{questions[0].strengths?.map((s) => <li key={s} className="flex items-start gap-2 rounded-card bg-success/5 border border-success/15 p-2.5 text-sm text-text-secondary"><Check size={14} className="mt-0.5 shrink-0 text-success" />{s}</li>)}</ul></div>
              <div><p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-warning"><AlertTriangle size={16} />Areas to improve</p><ul className="space-y-2">{questions[0].improvements?.map((s) => <li key={s} className="flex items-start gap-2 rounded-card bg-warning/5 border border-warning/15 p-2.5 text-sm text-text-secondary"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-warning" />{s}</li>)}</ul></div>
            </div>
          </motion.div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6">
            <h3 className="mb-4 text-base font-semibold text-text-primary">Skill breakdown</h3>
            <div className="space-y-4">{skillBreakdown.map((s) => <div key={s.skill}><div className="mb-1.5 flex items-center justify-between text-sm"><span className="text-text-secondary">{s.skill}</span><span className="font-medium text-text-primary">{s.value}</span></div><ProgressBar value={s.value} color={s.value >= 80 ? '#10B981' : s.value >= 65 ? '#4F46E5' : '#F59E0B'} /></div>)}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-base p-6">
            <h3 className="mb-4 text-base font-semibold text-text-primary">Score trend</h3>
            <div className="relative h-48">
              <svg viewBox="0 0 400 180" className="h-full w-full" preserveAspectRatio="none">
                <defs><linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" /><stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" /></linearGradient></defs>
                {[0, 1, 2, 3].map((g) => <line key={g} x1="0" y1={g * 45 + 10} x2="400" y2={g * 45 + 10} stroke="rgba(255,255,255,0.04)" />)}
                {(() => { const pts = performanceTrend.map((p, i) => ({ x: (i / (performanceTrend.length - 1)) * 380 + 10, y: 170 - (p.value / 100) * 150, ...p })); const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '); return (<><path d={`${path} L 390 170 L 10 170 Z`} fill="url(#reportGrad)" /><path d={path} fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />{pts.map((p) => <circle key={p.label} cx={p.x} cy={p.y} r="4" fill="#09090B" stroke="#8B5CF6" strokeWidth="2" />)}</>); })()}
              </svg>
            </div>
            <div className="mt-2 flex justify-between px-2 text-xs text-text-muted">{performanceTrend.map((p) => <span key={p.label}>{p.label}</span>)}</div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6">
          <h3 className="mb-4 text-base font-semibold text-text-primary">Question-wise review</h3>
          <div className="space-y-4">{questions.map((q, i) => (
            <div key={q.id} className="rounded-card border border-token bg-background-secondary p-5">
              <div className="flex items-start justify-between gap-4"><div className="flex-1"><div className="mb-2 flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-btn bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span><Badge variant="neutral">{q.difficulty}</Badge></div><p className="text-sm font-medium leading-relaxed text-text-primary">{q.prompt}</p></div><div className="shrink-0 text-right"><p className={`text-2xl font-bold ${(q.score || 0) >= 80 ? 'text-success' : (q.score || 0) >= 60 ? 'text-warning' : 'text-danger'}`}>{q.score}</p><p className="text-xs text-text-muted">/ 100</p></div></div>
              <div className="mt-4 border-t border-divider pt-4"><p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">Your answer</p><p className="text-sm leading-relaxed text-text-secondary">{q.answer}</p></div>
              <div className="mt-4 flex items-start gap-2 rounded-btn bg-ai-gradient-soft p-3"><Sparkles size={16} className="mt-0.5 shrink-0 text-ai-primary" /><p className="text-sm leading-relaxed text-text-secondary">{q.feedback}</p></div>
            </div>))}
          </div>
        </motion.div>
      </div>)}
      <div className="card-base p-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">Interview history</h3>
        <div className="space-y-2">{interviews.filter((i) => i.status === 'completed' || i.status === 'failed').map((iv) => (
          <button key={iv.id} className="flex w-full items-center gap-4 rounded-card border border-transparent p-3 text-left transition-colors hover:border-token hover:bg-background-secondary">
            <div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary/10 text-primary"><Brain size={18} /></div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-text-primary">{iv.role}</p><p className="text-xs text-text-muted">{iv.type} · {iv.difficulty} · {new Date(iv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p></div>
            <div className="flex items-center gap-3"><div className="w-24"><ProgressBar value={iv.score} color={iv.score >= 80 ? '#10B981' : iv.score >= 60 ? '#F59E0B' : '#EF4444'} /></div><span className={`w-10 text-right text-sm font-semibold ${iv.score >= 80 ? 'text-success' : iv.score >= 60 ? 'text-warning' : 'text-danger'}`}>{iv.score}</span><ChevronRight size={16} className="text-text-muted" /></div>
          </button>))}
        </div>
      </div>
    </div>
  );
}
```

---

## FILE: src/pages/ResumesPage.tsx (→ app/resumes/page.tsx, add 'use client')

```tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Trash2, Star, Plus, X, Cloud, Shield, Clock } from 'lucide-react';
import { Badge, EmptyState } from '../components/ui';
import { resumes as initialResumes, type Resume } from '../lib/data';

export function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const setPrimary = (id: string) => setResumes((rs) => rs.map((r) => ({ ...r, isPrimary: r.id === id })));
  const remove = (id: string) => setResumes((rs) => rs.filter((r) => r.id !== id));
  const addResume = () => { const id = `r${Date.now()}`; setResumes((rs) => [...rs, { id, name: 'Resume_New_Upload.pdf', uploadedAt: new Date().toISOString().slice(0, 10), size: '256 KB', isPrimary: rs.length === 0 }]); setShowUpload(false); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Resumes</h1><p className="mt-1 text-sm text-text-muted">Upload and manage resumes to personalize your interview sessions.</p></div>
        <button onClick={() => setShowUpload(true)} className="btn-primary text-sm"><Plus size={16} />Upload resume</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[{ icon: <Cloud size={18} />, label: 'Storage', value: '1.2 MB / 50 MB', accent: '#4F46E5' }, { icon: <Shield size={18} />, label: 'Encryption', value: 'AES-256', accent: '#10B981' }, { icon: <FileText size={18} />, label: 'Resumes', value: `${resumes.length} uploaded`, accent: '#22D3EE' }].map((s) => (
          <div key={s.label} className="card-base flex items-center gap-3 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-btn" style={{ background: `${s.accent}1a`, color: s.accent }}>{s.icon}</div><div><p className="text-sm font-medium text-text-primary">{s.value}</p><p className="text-xs text-text-muted">{s.label}</p></div></div>
        ))}
      </div>
      {resumes.length === 0 ? (<div className="card-base"><EmptyState icon={<FileText size={24} />} title="No resumes uploaded" description="Upload your first resume to personalize interview questions based on your experience." action={<button onClick={() => setShowUpload(true)} className="btn-primary text-sm"><Upload size={16} />Upload resume</button>} /></div>) : (
        <div className="grid gap-4 md:grid-cols-2">{resumes.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-base p-5">
            <div className="flex items-start gap-4"><div className="relative flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary"><FileText size={24} />{r.isPrimary && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ai-gradient text-white shadow-glow"><Star size={11} className="fill-white" /></span>}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-text-primary">{r.name}</p><div className="mt-1 flex items-center gap-2 text-xs text-text-muted"><span className="flex items-center gap-1"><Clock size={12} />{r.uploadedAt}</span><span className="text-text-disabled">·</span><span>{r.size}</span></div></div>{r.isPrimary && <Badge variant="primary">Primary</Badge>}</div>
            <div className="mt-4 flex items-center gap-2 border-t border-divider pt-4">{!r.isPrimary && <button onClick={() => setPrimary(r.id)} className="flex items-center gap-1.5 rounded-btn bg-white/5 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"><Star size={14} />Set as primary</button>}<button className="flex items-center gap-1.5 rounded-btn bg-white/5 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"><FileText size={14} />Preview</button><button onClick={() => remove(r.id)} className="ml-auto flex items-center gap-1.5 rounded-btn bg-danger/5 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10"><Trash2 size={14} />Delete</button></div>
          </motion.div>))}
        </div>
      )}
      <AnimatePresence>{showUpload && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowUpload(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()} className="glass w-full max-w-md rounded-dialog shadow-soft-lg">
            <div className="flex items-center justify-between border-b border-token px-6 py-4"><h2 className="text-base font-semibold text-text-primary">Upload resume</h2><button onClick={() => setShowUpload(false)} className="text-text-muted hover:text-text-primary"><X size={20} /></button></div>
            <div className="p-6"><div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); }} className={`flex flex-col items-center justify-center rounded-card border-2 border-dashed py-12 transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-token bg-background-secondary'}`}><div className="flex h-12 w-12 items-center justify-center rounded-btn bg-primary/10 text-primary"><Upload size={24} /></div><p className="mt-4 text-sm font-medium text-text-primary">Drag & drop your resume here</p><p className="mt-1 text-xs text-text-muted">PDF, DOCX up to 10MB</p><button onClick={addResume} className="btn-primary mt-5 text-sm"><FileText size={16} />Browse files</button></div><div className="mt-4 flex items-center gap-2 rounded-btn bg-info/5 border border-info/15 p-3"><Shield size={16} className="shrink-0 text-info" /><p className="text-xs text-text-secondary">Files are encrypted and securely stored in the cloud.</p></div></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
```

---

## FILE: src/pages/SettingsPage.tsx (→ app/settings/page.tsx, add 'use client')

```tsx
'use client';
import { useState } from 'react';
import { User, Bell, Shield, Palette, Check } from 'lucide-react';
import { Badge } from '../components/ui';
import { useTheme } from '../lib/theme';

export function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [notifications, setNotifications] = useState({ email: true, practice: true, reports: false });
  const [name] = useState('Alex Morgan');
  const [email] = useState('alex.morgan@example.com');

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-white/10'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Settings</h1><p className="mt-1 text-sm text-text-muted">Manage your account and application preferences.</p></div>
      <div className="card-base p-6">
        <div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-btn bg-primary/10 text-primary"><User size={20} /></div><h2 className="text-base font-semibold text-text-primary">Profile</h2></div>
        <div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-ai-gradient text-2xl font-bold text-white shadow-glow">A</div><div><p className="text-base font-medium text-text-primary">{name}</p><p className="text-sm text-text-muted">{email}</p><button className="btn-secondary mt-3 text-xs">Change avatar</button></div></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><label className="mb-1.5 block text-sm font-medium text-text-secondary">Full name</label><input defaultValue={name} className="input-base w-full" /></div><div><label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label><input defaultValue={email} className="input-base w-full" /></div></div>
        <button className="btn-primary mt-5 text-sm">Save changes</button>
      </div>
      <div className="card-base p-6">
        <div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-btn bg-ai-primary/10 text-ai-primary"><Palette size={20} /></div><h2 className="text-base font-semibold text-text-primary">Appearance</h2></div>
        <div className="flex items-center justify-between rounded-card bg-background-secondary p-4"><div><p className="text-sm font-medium text-text-primary">Theme</p><p className="text-xs text-text-muted">Toggle between dark and light mode</p></div><div className="flex items-center gap-3"><Badge variant={theme === 'dark' ? 'primary' : 'neutral'}>{theme === 'dark' ? 'Dark' : 'Light'}</Badge><Toggle on={theme === 'dark'} onClick={toggle} /></div></div>
      </div>
      <div className="card-base p-6">
        <div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-btn bg-warning/10 text-warning"><Bell size={20} /></div><h2 className="text-base font-semibold text-text-primary">Notifications</h2></div>
        <div className="space-y-1">{[{ key: 'email' as const, label: 'Email notifications', desc: 'Receive emails about your account' }, { key: 'practice' as const, label: 'Practice reminders', desc: 'Get reminded to practice regularly' }, { key: 'reports' as const, label: 'New report alerts', desc: 'Notify when a report is ready' }].map((n) => (<div key={n.key} className="flex items-center justify-between rounded-card p-3 hover:bg-white/[0.02]"><div><p className="text-sm font-medium text-text-primary">{n.label}</p><p className="text-xs text-text-muted">{n.desc}</p></div><Toggle on={notifications[n.key]} onClick={() => setNotifications((s) => ({ ...s, [n.key]: !s[n.key] }))} /></div>))}</div>
      </div>
      <div className="card-base p-6">
        <div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-btn bg-success/10 text-success"><Shield size={20} /></div><h2 className="text-base font-semibold text-text-primary">Security</h2></div>
        <div className="space-y-3"><div className="flex items-center justify-between rounded-card bg-background-secondary p-4"><div><p className="text-sm font-medium text-text-primary">Password</p><p className="text-xs text-text-muted">Last changed 3 months ago</p></div><button className="btn-secondary text-sm">Change password</button></div><div className="flex items-center justify-between rounded-card bg-background-secondary p-4"><div><p className="text-sm font-medium text-text-primary">Two-factor authentication</p><p className="text-xs text-text-muted flex items-center gap-1"><Check size={12} className="text-success" />Enabled</p></div><button className="btn-secondary text-sm">Manage</button></div></div>
      </div>
      <div className="card-base border-danger/20 p-6"><h2 className="mb-1 text-base font-semibold text-danger">Danger zone</h2><p className="mb-4 text-sm text-text-muted">Permanently delete your account and all associated data.</p><button className="btn-danger text-sm">Delete account</button></div>
    </div>
  );
}
```

---

## FILE: src/App.tsx (→ app/layout.tsx + routing in Next.js)

For Next.js, replace this with App Router structure:

```
app/
  layout.tsx          ← ThemeProvider wrapper + globals.css import
  page.tsx            ← LandingPage (add 'use client')
  dashboard/
    page.tsx          ← DashboardPage (add 'use client')
  interviews/
    page.tsx          ← InterviewsPage (add 'use client')
  resumes/
    page.tsx          ← ResumesPage (add 'use client')
  reports/
    page.tsx          ← ReportsPage (add 'use client')
  settings/
    page.tsx          ← SettingsPage (add 'use client')
components/
  AppShell.tsx        ← Use in a shared layout, replace onNavigate with useRouter
  nav.tsx
  ui.tsx
lib/
  theme.tsx
  data.ts
```

**Original App.tsx for reference:**

```tsx
import { useState } from 'react';
import { ThemeProvider } from './lib/theme';
import { AppShell } from './components/AppShell';
import type { Page } from './components/nav';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { ResumesPage } from './pages/ResumesPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const [page, setPage] = useState<Page>('landing');
  if (page === 'landing') return <ThemeProvider><LandingPage onNavigate={setPage} /></ThemeProvider>;
  return (
    <ThemeProvider>
      <AppShell current={page} onNavigate={setPage}>
        {page === 'dashboard' && <DashboardPage onNavigate={setPage} />}
        {page === 'interviews' && <InterviewsPage onNavigate={setPage} />}
        {page === 'resumes' && <ResumesPage />}
        {page === 'reports' && <ReportsPage onNavigate={setPage} />}
        {page === 'settings' && <SettingsPage />}
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
```

---

## Next.js layout.tsx example

```tsx
'use client';
import { ThemeProvider } from '@/lib/theme';
import { AppShell } from '@/components/AppShell';
import { usePathname, useRouter } from 'next/navigation';
import type { Page } from '@/components/nav';
import './globals.css';

const pathToPage: Record<string, Page> = {
  '/': 'landing',
  '/dashboard': 'dashboard',
  '/interviews': 'interviews',
  '/resumes': 'resumes',
  '/reports': 'reports',
  '/settings': 'settings',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const current = pathToPage[pathname] || 'landing';

  if (current === 'landing') {
    return (
      <html lang="en" className="dark">
        <body><ThemeProvider>{children}</ThemeProvider></body>
      </html>
    );
  }

  const navigate = (p: Page) => {
    const path = p === 'landing' ? '/' : `/${p}`;
    router.push(path);
  };

  return (
    <html lang="en" className="dark">
      <body>
        <ThemeProvider>
          <AppShell current={current} onNavigate={navigate}>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Packages to install

```bash
npm install framer-motion lucide-react
```

That's everything. All 10 files with complete, working code.
