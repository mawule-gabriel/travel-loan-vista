import type { PaymentHistory } from '@/types/api';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/formatters';

interface PaymentTimelineProps {
  payments: PaymentHistory[];
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

function getPaymentStatus(payment: PaymentHistory): 'paid' | 'pending' | 'overdue' {
  const paymentDate = new Date(payment.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (paymentDate <= today) {
    return 'paid';
  }
  
  const daysUntilDue = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) {
    return 'overdue';
  }
  
  return 'pending';
}

export function PaymentTimeline({ payments }: PaymentTimelineProps) {
  const sortedPayments = [...payments].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (sortedPayments.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-6">Payment History</h3>
        <p className="text-muted-foreground text-center py-8">No payment history available</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold mb-6">Payment History</h3>
      
      <div className="space-y-4">
        {sortedPayments.map((payment, index) => {
          const status = getPaymentStatus(payment);
          const config = statusConfig[status];
          const Icon = config.icon;
          const isLast = index === sortedPayments.length - 1;

          return (
            <div key={`${payment.date}-${payment.amount}`} className="flex gap-4">
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

              <div className={cn(
                'flex-1 pb-6',
                isLast && 'pb-0'
              )}>
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{formatDate(payment.date)}</span>
                    <span className={cn(
                      'text-xs font-medium px-2 py-1 rounded-full',
                      status === 'paid' && 'bg-emerald/10 text-emerald',
                      status === 'pending' && 'bg-gold/10 text-gold',
                      status === 'overdue' && 'bg-destructive/10 text-destructive'
                    )}>
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Recorded by {payment.recordedBy}
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
