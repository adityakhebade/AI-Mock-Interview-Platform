import Link from "next/link";
import { MessageSquare, BarChart3, FileText, LayoutDashboard, Settings } from "lucide-react";
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
  const dims = { sm: 28, md: 32, lg: 40 };
  const iconSize = dims[size];

  return (
    <Link href="/" className="flex items-center gap-2.5 focus-ring rounded-btn">
      {/* Custom SVG Icon - Speech bubble with code brackets */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="33%" stopColor="#5B5CEB" />
            <stop offset="66%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        {/* Speech bubble shape */}
        <path
          d="M24 4H8C5.79 4 4 5.79 4 8V18C4 20.21 5.79 22 8 22H12L16 28L20 22H24C26.21 22 28 20.21 28 18V8C28 5.79 26.21 4 24 4Z"
          fill="url(#logoGradient)"
          fillOpacity="0.9"
        />
        {/* Code brackets */}
        <path
          d="M12 10L9 13L12 16M20 10L23 13L20 16"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* X mark in center */}
        <path
          d="M14 11L18 15M18 11L14 15"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`font-semibold tracking-tight text-text-primary ${
          size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base"
        }`}
      >
        Intervue<span className="bg-gradient-to-r from-[#7C3AED] via-[#5B5CEB] to-[#22D3EE] bg-clip-text text-transparent">X</span>
      </span>
    </Link>
  );
}
