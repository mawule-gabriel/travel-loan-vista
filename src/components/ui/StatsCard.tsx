import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-navy text-primary-foreground',
  success: 'bg-emerald text-secondary-foreground',
  warning: 'bg-gold text-accent-foreground',
  danger: 'bg-destructive text-destructive-foreground',
};

const iconVariantStyles = {
  default: 'bg-muted text-foreground',
  primary: 'bg-primary-foreground/20 text-primary-foreground',
  success: 'bg-secondary-foreground/20 text-secondary-foreground',
  warning: 'bg-accent-foreground/20 text-accent-foreground',
  danger: 'bg-destructive-foreground/20 text-destructive-foreground',
};

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'stat-card',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            'text-sm font-medium',
            variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">
            {value}
          </p>
          {trend && (
            <p className={cn(
              'text-sm font-medium flex items-center gap-1',
              trend.isPositive ? 'text-emerald' : 'text-destructive'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              <span className="opacity-70">vs last month</span>
            </p>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-xl',
          iconVariantStyles[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
