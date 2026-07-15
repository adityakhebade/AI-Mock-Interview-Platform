import Image from "next/image";
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

  return (
    <Link href="/" className="flex items-center gap-2.5 focus-ring rounded-btn">
      <Image
        src="/logo.png"
        alt="IntervueX logo"
        width={dims[size]}
        height={dims[size]}
        className="object-contain"
        priority
      />
      <span
        className={`font-semibold tracking-tight text-text-primary ${
          size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base"
        }`}
      >
        Intervue<span className="text-ai-gradient">X</span>
      </span>
    </Link>
  );
}
