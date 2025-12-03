import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, User, Calendar, Wallet } from 'lucide-react';
import type { BorrowerSummaryResponse } from '@/types/api';
import { formatCurrency, formatDate, formatPhoneNumber } from '@/utils/formatters';

interface BorrowerDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    borrower: BorrowerSummaryResponse | null;
}

export const BorrowerDetailDialog = ({
    open,
    onOpenChange,
    borrower,
}: BorrowerDetailDialogProps) => {
    if (!borrower) return null;

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
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Borrower Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={borrower.profilePictureUrl || '/placeholder.svg'} alt={borrower.fullName} />
                            <AvatarFallback>{borrower.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground">{borrower.fullName}</h3>
                            <p className="text-sm text-muted-foreground font-mono">{borrower.ghanaCardNumber}</p>
                            <Badge className={`mt-2 ${getStatusColor(borrower.status)}`}>
                                {borrower.status}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Contact Information
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span>{formatPhoneNumber(borrower.phoneNumber)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                                <Wallet className="w-4 h-4" />
                                Loan Information
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Loan Amount:</span>
                                    <span className="font-semibold">{formatCurrency(borrower.loanAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Monthly Payment:</span>
                                    <span className="font-semibold">{formatCurrency(borrower.monthlyPayment)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Paid:</span>
                                    <span className="font-semibold text-emerald">{formatCurrency(borrower.totalPaid)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Balance:</span>
                                    <span className="font-semibold text-gold">{formatCurrency(borrower.balance)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Duration:</span>
                                    <span>{borrower.totalMonths} months</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Months Paid:</span>
                                    <span>{borrower.monthsPaid} / {borrower.totalMonths}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {borrower.startDate && borrower.endDate && (
                        <>
                            <Separator />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    Loan period: {formatDate(borrower.startDate)} - {formatDate(borrower.endDate)}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
