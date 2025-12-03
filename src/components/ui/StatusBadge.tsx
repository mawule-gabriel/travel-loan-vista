import { cn } from '@/lib/utils';
import { LoanStatus } from '@/types/loan';

interface StatusBadgeProps {
  status: LoanStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  'on-track': {
    label: 'On Track',
    className: 'status-on-track',
  },
  'On Track': {
    label: 'On Track',
    className: 'status-on-track',
  },
  'delayed': {
    label: 'Delayed',
    className: 'status-delayed',
  },
  'Delayed': {
    label: 'Delayed',
    className: 'status-delayed',
  },
  'completed': {
    label: 'Completed',
    className: 'status-completed',
  },
  'Completed': {
    label: 'Completed',
    className: 'status-completed',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-2 text-sm',
};

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig['on-track'];
  const normalizedStatus = status.toLowerCase().replace(' ', '-');

  return (
    <span
      className={cn(
        'status-badge',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-2',
        normalizedStatus === 'on-track' && 'bg-emerald',
        normalizedStatus === 'delayed' && 'bg-gold',
        normalizedStatus === 'completed' && 'bg-info'
      )} />
      {config.label}
    </span>
  );
}
