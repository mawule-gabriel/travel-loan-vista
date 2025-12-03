import { z } from 'zod';

export const loginSchema = z.object({
    phoneNumber: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .regex(/^(\+233|0|233)?[2-5]\d{8,9}$/, 'Invalid Ghana phone number format'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters'),
});

export const recordPaymentSchema = z.object({
    borrowerId: z
        .number()
        .positive('Invalid borrower ID'),
    amountPaid: z
        .number()
        .positive('Amount must be positive')
        .max(1000000, 'Amount is too large'),
    note: z
        .string()
        .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RecordPaymentFormData = z.infer<typeof recordPaymentSchema>;
