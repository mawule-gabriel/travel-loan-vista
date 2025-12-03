import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRecordPayment } from '@/hooks/queries/useAdmin';
import { recordPaymentSchema, type RecordPaymentFormData } from '@/schemas/validation';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import { Loader2 } from 'lucide-react';

interface RecordPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    borrowerId: number;
    borrowerName: string;
    monthlyPayment: number;
}

export const RecordPaymentDialog = ({
    open,
    onOpenChange,
    borrowerId,
    borrowerName,
    monthlyPayment,
}: RecordPaymentDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const recordPayment = useRecordPayment();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RecordPaymentFormData>({
        resolver: zodResolver(recordPaymentSchema),
        defaultValues: {
            borrowerId,
            amountPaid: monthlyPayment,
            note: '',
        },
    });

    const onSubmit = async (data: RecordPaymentFormData) => {
        setIsSubmitting(true);
        try {
            await recordPayment.mutateAsync(data);
            toast({
                title: 'Payment Recorded',
                description: `GHS ${data.amountPaid.toLocaleString()} recorded for ${borrowerName}`,
            });
            reset();
            onOpenChange(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: getErrorMessage(error),
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label>Borrower</Label>
                        <Input value={borrowerName} disabled className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="amountPaid">Amount Paid (GHS)</Label>
                        <Input
                            id="amountPaid"
                            type="number"
                            step="0.01"
                            {...register('amountPaid', { valueAsNumber: true })}
                            className="mt-2"
                        />
                        {errors.amountPaid && (
                            <p className="text-sm text-destructive mt-1">{errors.amountPaid.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Textarea
                            id="note"
                            {...register('note')}
                            className="mt-2"
                            rows={3}
                            placeholder="Add any additional notes..."
                        />
                        {errors.note && (
                            <p className="text-sm text-destructive mt-1">{errors.note.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-emerald hover:bg-emerald-light"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Record Payment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
