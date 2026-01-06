import { cn } from '@/lib/utils';
import { LoanStatus } from '@/types/loan';
import { CheckCircle2, Clock, AlertTriangle, AlertOctagon } from 'lucide-react';

interface StatusBadgeProps {
  status: LoanStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
  'on-track': {
    label: 'On Track',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    icon: CheckCircle2
  },
  'On Track': {
    label: 'On Track',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    icon: CheckCircle2
  },
  'delayed': {
    label: 'Delayed',
    className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    icon: Clock
  },
  'Delayed': {
    label: 'Delayed',
    className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    icon: Clock
  },
  'completed': {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    icon: CheckCircle2
  },
  'Completed': {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    icon: CheckCircle2
  },
  'overdue': {
    label: 'Overdue',
    className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    icon: AlertTriangle
  },
  'default': {
    label: 'Unknown',
    className: 'bg-slate-100 text-slate-800 border-slate-200',
    icon: AlertOctagon
  }
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3.5 py-1.5 text-sm gap-2',
};

export function StatusBadge({ status, size = 'md', className, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig[status.toLowerCase()] || statusConfig['default'];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'status-badge border shadow-sm backdrop-blur-sm inner-glow',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={cn(
        size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5',
        'opacity-80'
      )} />}
      <span className="font-semibold tracking-wide">{config.label}</span>
    </span>
  );
}
