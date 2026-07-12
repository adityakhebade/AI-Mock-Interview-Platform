"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { navItems, Logo, type Page } from "./nav";
import { Sun, Moon, Bell, Search, Sparkles } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function AppShell({
  current,
  onNavigate,
  children,
}: {
  current: Page;
  onNavigate: (p: Page) => void;
  children: ReactNode;
}) {
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-token bg-background-secondary md:flex">
        <div className="px-5 py-5">
          <Link href="/" className="focus-ring rounded-btn">
            <Logo />
          </Link>
        </div>
        <nav className="flex-1 px-3 py-2">
          <p className="px-3 pb-2 pt-3 text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Workspace
          </p>
          {navItems.map((item) => {
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group mb-0.5 flex w-full items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium transition-all focus-ring ${
                  active
                    ? "bg-white/[0.06] text-text-primary shadow-soft"
                    : "text-text-muted hover:bg-surface-hover hover:text-text-secondary"
                }`}
              >
                <span
                  className={
                    active ? "text-primary" : "text-text-muted group-hover:text-text-secondary"
                  }
                >
                  {item.icon}
                </span>
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-token p-3">
          <div className="flex items-center gap-3 rounded-card bg-white/[0.03] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ai-gradient text-sm font-semibold text-white">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">Alex Morgan</p>
              <p className="truncate text-xs text-text-muted">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-token bg-background/80 px-4 backdrop-blur-xl md:px-6">
          <div className="md:hidden">
            <Logo size="sm" />
          </div>
          <div className="relative ml-auto hidden max-w-xs flex-1 sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              placeholder="Search interviews, reports..."
              className="input-base w-full !py-2 pl-9 text-sm"
            />
          </div>
          <div className="ml-auto flex items-center gap-2 sm:ml-3">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-btn text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary focus-ring"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-btn text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary focus-ring"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <button
              onClick={() => onNavigate("interviews")}
              className="btn-primary ml-1 hidden text-sm sm:inline-flex"
            >
              <Sparkles size={16} />
              New Interview
            </button>
          </div>
        </header>
        <nav className="flex items-center gap-1 overflow-x-auto border-b border-token bg-background-secondary px-3 py-2 no-scrollbar md:hidden">
          {navItems.map((item) => {
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-btn px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-white/[0.06] text-text-primary" : "text-text-muted"
                }`}
              >
                {item.icon}
                {item.label}
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
