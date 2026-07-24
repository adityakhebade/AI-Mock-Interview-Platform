import { type ReactNode } from "react";

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: {
  children: ReactNode;
  variant?: "neutral" | "success" | "warning" | "danger" | "info" | "ai" | "primary";
  className?: string;
}) {
  const variants: Record<string, string> = {
    neutral: "bg-white/5 text-text-secondary border border-token",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
    danger: "bg-danger/10 text-danger border border-danger/20",
    info: "bg-info/10 text-info border border-info/20",
    primary: "bg-primary/10 text-primary border border-primary/20",
    ai: "bg-ai-primary/10 text-ai-primary border border-ai-primary/20",
  };
  return <span className={`badge-base ${variants[variant]} ${className}`}>{children}</span>;
}

export function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-text-primary">{score}</span>
        <span className="text-[10px] text-text-muted uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

export function ProgressBar({ value, color = "#4F46E5" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-card bg-white/5 text-text-muted">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
