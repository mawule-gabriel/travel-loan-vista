import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, User, Calendar, Wallet, ShieldCheck } from 'lucide-react';
import type { BorrowerSummaryResponse } from '@/types/api';
import { formatCurrency, formatDate, formatPhoneNumber } from '@/utils/formatters';
import { useBorrowerDetails } from '@/hooks/queries/useAdmin';
import { PaymentTimeline } from '@/components/payment/PaymentTimeline';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface BorrowerDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    borrower: BorrowerSummaryResponse | null;
}

export const BorrowerDetailDialog = ({
    open,
    onOpenChange,
    borrower: summaryBorrower,
}: BorrowerDetailDialogProps) => {
    // We use the summary borrower to immediately show basic info while loading details
    // effectively optimistically showing what we know.
    // However, we need details for the timeline.

    // Safety check
    if (!summaryBorrower && !open) return null; // If closed, doesn't matter much, but good practice.

    // Hook call must be unconditional
    const { data: detailBorrower, isLoading } = useBorrowerDetails(summaryBorrower?.id || null);

    // If we don't have a borrower to show (even summary), render nothing
    if (!summaryBorrower) return null;

    // Use detailed info if available, otherwise summary
    const displayBorrower = detailBorrower || summaryBorrower;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'On Track':
                return 'bg-emerald/10 text-emerald border-emerald/20';
            case 'Delayed':
                return 'bg-gold/10 text-gold border-gold/20';
            case 'Completed':
                return 'bg-info/10 text-info border-info/20';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Borrower Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={displayBorrower.profilePictureUrl || '/placeholder.svg'} alt={displayBorrower.fullName} />
                                <AvatarFallback>{displayBorrower.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">{displayBorrower.fullName}</h3>
                                <p className="text-sm text-muted-foreground font-mono">{displayBorrower.ghanaCardNumber}</p>
                                <Badge className={`mt-2 ${getStatusColor(displayBorrower.status)}`}>
                                    {displayBorrower.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column: Contact & Loan Stats */}
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Contact Information
                                </h4>
                                <div className="space-y-2 text-sm bg-muted/30 p-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span>{formatPhoneNumber(displayBorrower.phoneNumber)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>
                                            {'homeAddressGhana' in displayBorrower
                                                ? displayBorrower.homeAddressGhana
                                                : 'Address not loaded'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Guarantor Information
                                </h4>
                                <div className="space-y-2 text-sm bg-muted/30 p-4 rounded-lg">
                                    {'guarantorName' in displayBorrower && displayBorrower.guarantorName ? (
                                        <>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Full Name</span>
                                                <span className="font-medium text-slate-900">{displayBorrower.guarantorName}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Phone Number</span>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                                        <span className="font-medium text-slate-900">{formatPhoneNumber(displayBorrower.guarantorPhone)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1 text-right">
                                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Relationship</span>
                                                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-black uppercase tracking-widest border border-indigo-100 italic">
                                                        {displayBorrower.guarantorRelationship || 'Not specified'}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-muted-foreground italic text-xs">No guarantor information provided</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                    <Wallet className="w-4 h-4" />
                                    Loan Information
                                </h4>
                                <div className="space-y-3 text-sm bg-muted/30 p-4 rounded-lg">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Loan Amount:</span>
                                        <span className="font-semibold">{formatCurrency(displayBorrower.loanAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Monthly Payment:</span>
                                        <span className="font-semibold">{formatCurrency(displayBorrower.monthlyPayment)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Paid:</span>
                                        <span className="font-semibold text-emerald">{formatCurrency(displayBorrower.totalPaid)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Balance:</span>
                                        <span className="font-semibold text-gold">{formatCurrency(displayBorrower.balance)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Duration:</span>
                                        <span>
                                            {'totalMonths' in displayBorrower
                                                ? displayBorrower.totalMonths
                                                : displayBorrower.monthsDuration} months
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Months Paid:</span>
                                        <span>{displayBorrower.monthsPaid} / {'totalMonths' in displayBorrower
                                            ? displayBorrower.totalMonths
                                            : displayBorrower.monthsDuration}</span>
                                    </div>
                                    {displayBorrower.startDate && displayBorrower.endDate && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                {formatDate(displayBorrower.startDate)} - {formatDate(displayBorrower.endDate)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Payment Timeline */}
                        <div>
                            {isLoading ? (
                                <div className="h-full flex items-center justify-center min-h-[300px]">
                                    <LoadingSpinner size="lg" />
                                </div>
                            ) : detailBorrower ? (
                                <PaymentTimeline
                                    payments={detailBorrower.payments}
                                    startDate={detailBorrower.startDate}
                                    totalMonths={detailBorrower.monthsDuration}
                                    monthlyPayment={detailBorrower.monthlyPayment}
                                    showMetadata={true}
                                />
                            ) : (
                                <div className="text-muted-foreground text-center py-10">
                                    {summaryBorrower ? 'Loading payment details...' : 'Failed to load details.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
