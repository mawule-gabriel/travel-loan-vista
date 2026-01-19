import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { queryKeys } from './queryKeys';
import type {
    RecordPaymentRequest,
    BorrowerSummaryResponse,
    PageResponse,
    BorrowerDetailResponse,
} from '@/types/api';
import { getErrorMessage } from '@/utils/errorHandler';

interface UseBorrowersParams {
    search?: string;
    status?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
}

export const useBorrowers = (
    params: UseBorrowersParams
): UseQueryResult<PageResponse<BorrowerSummaryResponse>, Error> => {
    return useQuery({
        queryKey: queryKeys.admin.borrowers(params),
        queryFn: () => adminService.getBorrowers(params),
        staleTime: 0, // Always consider data stale to allow immediate refetch after mutations
        refetchOnWindowFocus: true,
    });
};

export const useRegisterBorrower = (): UseMutationResult<string, Error, FormData> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminService.registerBorrower,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.borrowers() });
        },
        onError: (error) => {
            console.error('Register borrower error:', getErrorMessage(error));
        },
    });
};

export const useRecordPayment = (): UseMutationResult<string, Error, RecordPaymentRequest> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminService.recordPayment,
        onSuccess: () => {
            // Invalidate and immediately refetch all borrower queries to show updated data
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.borrowers() });
            queryClient.refetchQueries({ queryKey: queryKeys.admin.borrowers() });
        },
        onError: (error) => {
            console.error('Record payment error:', getErrorMessage(error));
        },
    });
};

export const useDownloadSchedule = (): UseMutationResult<Blob, Error, number> => {
    return useMutation({
        mutationFn: adminService.downloadSchedule,
        onError: (error) => {
            console.error('Download schedule error:', getErrorMessage(error));
        },
    });
};

export const useResetBorrowerPassword = (): UseMutationResult<
    import('@/types/api').AdminResetPasswordResponse,
    Error,
    { id: number; data: import('@/types/api').AdminResetPasswordRequest }
> => {
    return useMutation({
        mutationFn: ({ id, data }) => adminService.resetPassword(id, data),
        onError: (error) => {
            console.error('Reset password error:', getErrorMessage(error));
        },
    });
};

export const useBorrowerDetails = (id: number | null): UseQueryResult<BorrowerDetailResponse, Error> => {
    return useQuery({
        queryKey: ['borrower-details', id],
        queryFn: () => adminService.getBorrowerDetails(id!),
        enabled: !!id,
        staleTime: 0,
    });
};
