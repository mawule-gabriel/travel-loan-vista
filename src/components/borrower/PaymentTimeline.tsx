import { Payment } from '@/types/loan';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentTimelineProps {
  payments: Payment[];
}

const statusConfig = {
  paid: {
    icon: Check,
    className: 'bg-emerald text-secondary-foreground',
    label: 'Paid',
  },
  pending: {
    icon: Clock,
    className: 'bg-gold text-accent-foreground',
    label: 'Pending',
  },
  overdue: {
    icon: AlertCircle,
    className: 'bg-destructive text-destructive-foreground',
    label: 'Overdue',
  },
};

export function PaymentTimeline({ payments }: PaymentTimelineProps) {
  const sortedPayments = [...payments].sort((a, b) => b.month - a.month);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold mb-6">Payment History</h3>
      
      <div className="space-y-4">
        {sortedPayments.map((payment, index) => {
          const config = statusConfig[payment.status];
          const Icon = config.icon;
          const isLast = index === sortedPayments.length - 1;

          return (
            <div key={payment.id} className="flex gap-4">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  config.className
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                {!isLast && (
                  <div className="w-0.5 h-full bg-border flex-1 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className={cn(
                'flex-1 pb-6',
                isLast && 'pb-0'
              )}>
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Month {payment.month}</span>
                    <span className={cn(
                      'text-xs font-medium px-2 py-1 rounded-full',
                      payment.status === 'paid' && 'bg-emerald/10 text-emerald',
                      payment.status === 'pending' && 'bg-gold/10 text-gold',
                      payment.status === 'overdue' && 'bg-destructive/10 text-destructive'
                    )}>
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="font-bold text-foreground">
                      GHS {payment.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
