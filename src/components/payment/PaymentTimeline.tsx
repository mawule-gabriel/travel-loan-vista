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

        // Generate timeline for each month of the loan duration
        // If the loan runs longer than totalMonths (e.g. late payments), we might need to extend using actual payments
        // But let's stick to totalMonths or up to the last actual payment, whichever is later.

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
                        id: `payment-${p.date}-${p.amount}`, // simplistic ID
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
                // Check status
                let status: TimelineItem['status'] = 'Pending';
                if (isBefore(startOfMonth(currentMonthDate), startOfMonth(today))) {
                    status = 'Overdue'; // Or 'Failed'/'Missed' implies strict failure. Overdue is safer.
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
            <h3 className="font-semibold text-lg mb-4 text-foreground">Payment Timeline</h3>
            <div className="relative border-l-2 border-muted ml-3.5 space-y-6 pb-2">
                {timelineData.map((item, index) => {
                    // Group by month visually? The requirements say "Group payments visually under month headers"
                    // But we are traversing month by month anyway.
                    // If multiple payments are in the same month, we should show the header only once?
                    // Actually, my loop logic generates items. I can render headers based on date change in the render loop.

                    const showMonthHeader = index === 0 || !isSameMonth(item.date, timelineData[index - 1].date);
                    const isLatestCompleted = item.status === 'Completed' && (
                        index === timelineData.length - 1 || timelineData[index + 1].status !== 'Completed'
                    );

                    return (
                        <div key={item.id} className="relative pl-8 pr-2">
                            {/* Month Header */}
                            {showMonthHeader && (
                                <div className="absolute -left-[21px] -top-1 flex items-center mb-2">
                                    {/* Only show year if it changes? For now just Month Year */}
                                    {/* Actually, user said "Group payments visually under month headers" 
                                 It might be cleaner to have the header separate from the item line 
                                 but the item needs to align with the timeline.
                             */}
                                </div>
                            )}

                            {/* Month Label separate line? */}
                            {showMonthHeader && (
                                <div className="mb-3 mt-1 first:mt-0 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                    {format(item.date, 'MMMM yyyy')}
                                </div>
                            )}

                            {/* Timeline Node */}
                            <div className={cn(
                                "absolute -left-[9px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-background z-10",
                                item.status === 'Completed' ? "border-emerald-500 bg-emerald-500 text-white" :
                                    item.status === 'Overdue' ? "border-destructive bg-background text-destructive" :
                                        "border-muted-foreground bg-background text-muted-foreground"
                            )}>
                                {item.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> :
                                    item.status === 'Overdue' ? <AlertCircle className="w-3 h-3" /> :
                                        <Circle className="w-3 h-3" />}
                            </div>

                            {/* Content */}
                            <div className={cn(
                                "p-3 rounded-lg border transition-all",
                                item.status === 'Completed' ? "bg-emerald-50/50 border-emerald-100" :
                                    item.status === 'Overdue' ? "bg-destructive/5 border-destructive/20" :
                                        "bg-muted/30 border-transparent",
                                isLatestCompleted && "ring-2 ring-emerald-500/20 shadow-sm"
                            )}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "text-xs font-bold px-1.5 py-0.5 rounded",
                                                item.status === 'Completed' ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                                            )}>
                                                #{item.stepNumber}
                                            </span>
                                            <span className={cn("font-medium", item.status === 'Completed' ? "text-foreground" : "text-muted-foreground")}>
                                                {item.status === 'Completed' ? 'Payment Received' :
                                                    item.status === 'Overdue' ? 'Payment Missed/Due' : 'Scheduled Payment'}
                                            </span>
                                        </div>
                                        <div className="text-2xl font-bold tracking-tight">
                                            {formatCurrency(item.amount || 0)}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {format(item.date, 'PPP')}
                                            {item.type === 'Actual' && ` at ${format(item.date, 'p')}`}
                                        </div>

                                        {showMetadata && item.recordedBy && (
                                            <div className="mt-2 text-xs bg-black/5 inline-block px-1.5 py-0.5 rounded text-muted-foreground">
                                                Recorded by: {item.recordedBy}
                                            </div>
                                        )}

                                        {item.note && (
                                            <div className="mt-2 text-xs italic text-muted-foreground/80 border-l-2 border-muted pl-2">
                                                "{item.note}"
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <div className={cn(
                                            "text-xs font-medium px-2 py-1 rounded-full capitalize",
                                            item.status === 'Completed' ? "bg-emerald-100 text-emerald-700" :
                                                item.status === 'Overdue' ? "bg-destructive/10 text-destructive" :
                                                    "bg-muted text-muted-foreground"
                                        )}>
                                            {item.status}
                                        </div>
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
