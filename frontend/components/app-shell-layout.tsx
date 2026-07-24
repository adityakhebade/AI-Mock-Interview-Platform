"use client";

import { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "./AppShell";
import type { Page } from "./nav";

const pathToPage: Record<string, Page> = {
  "/dashboard": "dashboard",
  "/interviews": "interviews",
  "/resumes": "resumes",
  "/reports": "reports",
  "/settings": "settings",
};

export function AppShellLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const current = pathToPage[pathname] || "dashboard";

  const navigate = (p: Page) => {
    const path = p === "landing" ? "/" : `/${p}`;
    router.push(path);
  };

  return (
    <AppShell current={current} onNavigate={navigate}>
      {children}
    </AppShell>
  );
}
