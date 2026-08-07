import { cn } from '@/lib/utils';
import type { Priority, RiskLevel, Status, AgentStatus, Confidence } from '@/types';

type Variant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary/15 text-primary border-primary/30',
  success: 'bg-success/15 text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  danger: 'bg-destructive/15 text-destructive border-destructive/30',
  info: 'bg-chart-4/15 text-chart-4 border-chart-4/30',
  neutral: 'bg-muted text-muted-foreground border-border',
};

export function Badge({
  variant = 'neutral',
  children,
  className,
  dot = false,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, Variant> = {
    Critical: 'danger',
    High: 'warning',
    Medium: 'info',
    Low: 'neutral',
  };
  return <Badge variant={map[priority]} dot>{priority}</Badge>;
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const map: Record<RiskLevel, Variant> = {
    Severe: 'danger',
    Elevated: 'warning',
    Moderate: 'info',
    Low: 'success',
  };
  return <Badge variant={map[level]} dot>{level} Risk</Badge>;
}

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, Variant> = {
    Completed: 'success',
    Processing: 'primary',
    Pending: 'warning',
    Failed: 'danger',
  };
  return <Badge variant={map[status]} dot>{status}</Badge>;
}

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  const map: Record<AgentStatus, Variant> = {
    Active: 'success',
    Idle: 'neutral',
    Processing: 'primary',
    Error: 'danger',
  };
  return <Badge variant={map[status]} dot>{status}</Badge>;
}

export function ConfidenceBadge({ value }: { value: number }) {
  let variant: Variant = 'success';
  let label: Confidence = 'High';
  if (value < 70) {
    variant = 'warning';
    label = 'Medium';
  }
  if (value < 50) {
    variant = 'danger';
    label = 'Low';
  }
  if (value === 0) return <Badge variant="neutral">—</Badge>;
  return <Badge variant={variant}>{label} · {value}%</Badge>;
}
