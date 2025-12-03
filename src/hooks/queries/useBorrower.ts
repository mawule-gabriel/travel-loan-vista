import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { borrowerService } from '@/services/borrowerService';
import { queryKeys } from './queryKeys';
import type { BorrowerDashboardResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/errorHandler';

export const useBorrowerDashboard = (): UseQueryResult<BorrowerDashboardResponse, Error> => {
    return useQuery({
        queryKey: queryKeys.borrower.dashboard(),
        queryFn: borrowerService.getDashboard,
        staleTime: 60000,
    });
};

export const useDownloadMySchedule = (): UseMutationResult<Blob, Error, void> => {
    return useMutation({
        mutationFn: borrowerService.downloadSchedule,
        onError: (error) => {
            console.error('Download schedule error:', getErrorMessage(error));
        },
    });
};
