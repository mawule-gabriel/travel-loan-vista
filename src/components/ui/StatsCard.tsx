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

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  className
}: StatsCardProps) {
  // Sophisticated sparkline paths
  const getSparklinePath = () => {
    switch (variant) {
      case 'success': return "M0 25 Q30 25, 40 15 T80 5";
      case 'warning': return "M0 20 Q40 30, 60 10 T100 20";
      case 'primary': return "M0 25 Q25 25, 40 10 T80 5";
      case 'danger': return "M0 10 Q30 5, 50 25 T100 20";
      default: return "M0 20 Q30 20, 50 10 T100 15";
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary': return 'from-indigo-600/15 to-purple-600/10 border-indigo-200/60 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300';
      case 'success': return 'from-emerald-600/15 to-teal-600/10 border-emerald-200/60 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300';
      case 'warning': return 'from-amber-600/15 to-orange-600/10 border-amber-200/60 dark:border-amber-500/40 text-amber-700 dark:text-amber-300';
      case 'danger': return 'from-rose-600/15 to-red-600/10 border-rose-200/60 dark:border-rose-500/40 text-rose-700 dark:text-rose-300';
      default: return 'from-white/95 to-white/70 dark:from-slate-800/90 dark:to-slate-900/80 border-white dark:border-slate-700';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'primary': return 'bg-gradient-primary text-white shadow-glow';
      case 'success': return 'bg-gradient-ocean text-white shadow-glow';
      case 'warning': return 'bg-gradient-sun text-white shadow-glow';
      case 'danger': return 'bg-gradient-danger text-white shadow-glow';
      default: return 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700';
    }
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl border backdrop-blur-3xl transition-all duration-500',
        'hover:-translate-y-2 hover:shadow-float active:scale-[0.98]',
        'shadow-elevated bg-gradient-to-br',
        getVariantStyles(),
        className
      )}
    >
      {/* Interactive Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none" />

      {/* Animated Sparkline Decoration */}
      <div className="absolute -right-2 -bottom-4 opacity-30 pointer-events-none transition-transform duration-700 group-hover:scale-125 group-hover:rotate-3">
        <svg width="140" height="70" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current/40 group-hover:text-current transition-colors">
          <path
            className="animate-draw"
            d={getSparklinePath()}
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="relative p-7 z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 transition-transform duration-500 group-hover:translate-x-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{title}</p>
            <h3 className="text-4xl font-black tracking-tight text-foreground leading-none">{value}</h3>
          </div>
          <div className={cn(
            "p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
            "shadow-sm group-hover:shadow-md",
            getIconStyles()
          )}>
            <Icon className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
          </div>
        </div>

        {trend && (
          <div className="mt-6 flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase inner-glow",
              trend.isPositive ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
            <span className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest whitespace-nowrap">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
