import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Progress({
  value,
  className,
  indicatorClassName,
  showLabel = false,
  size = 'md',
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-2.5' };
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('relative w-full overflow-hidden rounded-full bg-muted', heights[size])}>
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r from-primary to-violet-500', indicatorClassName)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <div className="mt-1.5 text-right text-xs text-muted-foreground">{Math.round(value)}%</div>
      )}
    </div>
  );
}

export function CircularProgress({
  value,
  size = 64,
  stroke = 6,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(239 84% 67%)" />
            <stop offset="100%" stopColor="hsl(280 85% 65%)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-sm font-semibold">{Math.round(value)}%</span>
        {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}
