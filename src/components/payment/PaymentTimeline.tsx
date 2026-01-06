import { useMemo } from 'react';
import { format, addMonths, isSameMonth, parseISO, isAfter, isBefore, startOfMonth } from 'date-fns';
import { CheckCircle2, Circle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaymentResponse } from '@/types/api';
import { formatCurrency } from '@/utils/formatters';

interface PaymentTimelineProps {
    payments: PaymentResponse[];
    startDate: string | null;
    totalMonths?: number;
    monthlyPayment: number;
    showMetadata?: boolean;
    className?: string;
}

interface TimelineItem {
    id: string;
    stepNumber: number;
    date: Date;
    amount?: number;
    status: 'Completed' | 'Pending' | 'Overdue' | 'Failed';
    type: 'Actual' | 'Scheduled';
    recordedBy?: string;
    note?: string;
}

export function PaymentTimeline({
    payments,
    startDate,
    totalMonths = 12,
    monthlyPayment,
    showMetadata = false,
    className,
}: PaymentTimelineProps) {
    const timelineData = useMemo(() => {
        if (!startDate) return [];

        const start = parseISO(startDate);
        const today = new Date();
        const items: TimelineItem[] = [];
        let stepCounter = 1;

        // Create a map of actual payments by month key (YYYY-MM)
        const paymentsByMonth = new Map<string, PaymentResponse[]>();

        // Sort payments by date
        const sortedPayments = [...payments].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        sortedPayments.forEach((p) => {
            const pDate = parseISO(p.date);
            const key = format(pDate, 'yyyy-MM');
            const monthPayments = paymentsByMonth.get(key) || [];
            monthPayments.push(p);
            paymentsByMonth.set(key, monthPayments);
        });

        const lastPaymentDate = sortedPayments.length > 0 ? parseISO(sortedPayments[sortedPayments.length - 1].date) : start;
        const monthsToCover = Math.max(totalMonths,
            sortedPayments.length > 0 ?
                (lastPaymentDate.getFullYear() - start.getFullYear()) * 12 + (lastPaymentDate.getMonth() - start.getMonth()) + 1
                : totalMonths
        );

        for (let i = 0; i < monthsToCover; i++) {
            const currentMonthDate = addMonths(start, i);
            const monthKey = format(currentMonthDate, 'yyyy-MM');
            const actualPayments = paymentsByMonth.get(monthKey);

            if (actualPayments && actualPayments.length > 0) {
                // Add actual payments
                actualPayments.forEach(p => {
                    items.push({
                        id: `payment-${p.date}-${p.amount}`,
                        stepNumber: stepCounter++,
                        date: parseISO(p.date),
                        amount: p.amount,
                        status: 'Completed',
                        type: 'Actual',
                        recordedBy: p.recordedBy,
                        note: p.note || undefined
                    });
                });
            } else {
                // No payment for this scheduled month
                let status: TimelineItem['status'] = 'Pending';
                if (isBefore(startOfMonth(currentMonthDate), startOfMonth(today))) {
                    status = 'Overdue';
                }

                items.push({
                    id: `scheduled-${monthKey}`,
                    stepNumber: stepCounter++,
                    date: currentMonthDate,
                    amount: monthlyPayment,
                    status: status,
                    type: 'Scheduled'
                });
            }
        }

        return items;
    }, [payments, startDate, totalMonths, monthlyPayment]);

    if (!startDate) return null;

    return (
        <div className={cn("flex flex-col space-y-0 text-sm", className)}>
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Payment Timeline</h3>
            </div>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3.5 space-y-8 pb-4">
                {timelineData.map((item, index) => {
                    const showMonthHeader = index === 0 || !isSameMonth(item.date, timelineData[index - 1].date);
                    const isLatestCompleted = item.status === 'Completed' && (
                        index === timelineData.length - 1 || timelineData[index + 1].status !== 'Completed'
                    );

                    return (
                        <div key={item.id} className="relative pl-8 pr-2 group">
                            {/* Month Label */}
                            {showMonthHeader && (
                                <div className="mb-4 mt-2 first:mt-0 flex items-center gap-2">
                                    <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                        {format(item.date, 'MMMM yyyy')}
                                    </span>
                                </div>
                            )}

                            {/* Timeline Node */}
                            <div className={cn(
                                "absolute -left-[9px] top-6 w-5 h-5 rounded-full border-4 transition-all duration-300 z-10",
                                item.status === 'Completed' ? "border-emerald-500 bg-white dark:bg-slate-900" :
                                    item.status === 'Overdue' ? "border-red-500 bg-white dark:bg-slate-900" :
                                        "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900",
                                isLatestCompleted && "ring-4 ring-emerald-500/20 scale-110"
                            )}>
                                {item.status === 'Completed' && <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-emerald-500" />}
                            </div>

                            {/* Content Card */}
                            <div className={cn(
                                "p-4 rounded-2xl border transition-all duration-300",
                                item.status === 'Completed' ? "bg-emerald-50/50 border-emerald-100 hover:shadow-md hover:border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-500/20" :
                                    item.status === 'Overdue' ? "bg-red-50/50 border-red-100 hover:shadow-md hover:border-red-200 dark:bg-red-900/10 dark:border-red-500/20" :
                                        "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200 dark:bg-slate-800/30 dark:border-slate-700/50",
                                isLatestCompleted && "shadow-lg shadow-emerald-500/10 border-emerald-200 bg-emerald-50"
                            )}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide",
                                                item.status === 'Completed' ? "bg-emerald-500 text-white" :
                                                    item.status === 'Overdue' ? "bg-red-500 text-white" :
                                                        "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                            )}>
                                                Step {item.stepNumber}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-medium">
                                                {format(item.date, 'PPP')}
                                            </span>
                                        </div>

                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold tracking-tight text-foreground">
                                                {formatCurrency(item.amount || 0)}
                                            </span>
                                        </div>

                                        {showMetadata && item.recordedBy && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 bg-black/5 dark:bg-white/5 w-fit px-2 py-1 rounded-md">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                                Rec. by {item.recordedBy}
                                            </div>
                                        )}
                                    </div>

                                    {item.status === 'Completed' ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1" />
                                    ) : item.status === 'Overdue' ? (
                                        <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-slate-300 mt-1" />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
