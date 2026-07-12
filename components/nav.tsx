import { MessageSquare, BarChart3, FileText, LayoutDashboard, Sparkles, Settings } from "lucide-react";
import { type ReactNode } from "react";

export type Page = "landing" | "dashboard" | "interviews" | "resumes" | "reports" | "settings";

interface NavItem {
  id: Page;
  label: string;
  icon: ReactNode;
}

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { id: "interviews", label: "Interviews", icon: <MessageSquare size={20} /> },
  { id: "resumes", label: "Resumes", icon: <FileText size={20} /> },
  { id: "reports", label: "Reports", icon: <BarChart3 size={20} /> },
  { id: "settings", label: "Settings", icon: <Settings size={20} /> },
];

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "h-7 w-7", md: "h-8 w-8", lg: "h-10 w-10" };
  const iconSize = { sm: 16, md: 18, lg: 22 };
  const text = { sm: "text-sm", md: "text-base", lg: "text-xl" };

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dims[size]} relative flex items-center justify-center rounded-btn bg-ai-gradient shadow-glow`}
      >
        <Sparkles size={iconSize[size]} className="text-white" />
      </div>
      <span className={`${text[size]} font-semibold tracking-tight text-text-primary`}>
        Intervue<span className="text-ai-gradient">X</span>
      </span>
    </div>
  );
}
