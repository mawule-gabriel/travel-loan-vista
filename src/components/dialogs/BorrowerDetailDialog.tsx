import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, User, Calendar, Wallet, ShieldCheck, Mail, Key, Copy, AlertTriangle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BorrowerSummaryResponse } from '@/types/api';
import { formatCurrency, formatDate, formatPhoneNumber } from '@/utils/formatters';
import { useBorrowerDetails, useResetBorrowerPassword } from '@/hooks/queries/useAdmin';
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
    const resetPasswordMutation = useResetBorrowerPassword();
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [tempPassword, setTempPassword] = useState<string | null>(null);

    const handleResetPassword = async () => {
        if (!summaryBorrower?.id) return;
        try {
            const result = await resetPasswordMutation.mutateAsync({
                id: summaryBorrower.id,
                data: {} // No password provided, backend generates it
            });
            setTempPassword(result.temporaryPassword || "Password reset, check logs.");
            setIsResetConfirmOpen(false);
        } catch (e) {
            // Error managed by hook
        }
    };

    // Copy to clipboard helper
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could show toast here but sticking to simple interactions
    };

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
                        <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white gap-2"
                            onClick={() => setIsResetConfirmOpen(true)}
                        >
                            <Key className="w-4 h-4" />
                            Reset Password
                        </Button>
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
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span>
                                            {'email' in displayBorrower && displayBorrower.email ? (
                                                <span className="text-foreground">{displayBorrower.email}</span>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">No email provided</span>
                                            )}
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

            {/* Confirmation Alert */}
            <AlertDialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Confirm Password Reset
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reset the password for <b>{displayBorrower.fullName}</b>?
                            <br /><br />
                            Since this borrower may not have an email, the system will generate a <b>Temporary Password</b> which you must share with them manually.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => { e.preventDefault(); handleResetPassword(); }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={resetPasswordMutation.isPending}
                        >
                            {resetPasswordMutation.isPending ? 'Resetting...' : 'Yes, Reset Password'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Success Result Dialog */}
            <Dialog open={!!tempPassword} onOpenChange={(open) => !open && setTempPassword(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-emerald-600">
                            <Key className="w-5 h-5" />
                            Password Reset Successful
                        </DialogTitle>
                        <DialogDescription>
                            Please copy the temporary password below and share it with the borrower. They will be asked to change it upon login.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 bg-slate-100 rounded-xl border border-slate-200 text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Temporary Password</p>
                        <div className="flex items-center justify-center gap-3">
                            <code className="text-2xl font-black text-slate-900 tracking-wider bg-white px-4 py-2 rounded-lg border border-slate-200">
                                {tempPassword}
                            </code>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => tempPassword && copyToClipboard(tempPassword)}
                                className="h-12 w-12 rounded-lg"
                                title="Copy to clipboard"
                            >
                                <Copy className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
};
