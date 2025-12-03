import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { BorrowerDashboardResponse } from '@/types/api';

export const borrowerService = {
    getDashboard: async (): Promise<BorrowerDashboardResponse> => {
        const response = await apiClient.get<BorrowerDashboardResponse>(
            API_ENDPOINTS.borrower.getDashboard
        );
        return response.data;
    },

    downloadSchedule: async (): Promise<Blob> => {
        const response = await apiClient.get(
            API_ENDPOINTS.borrower.downloadSchedule,
            {
                responseType: 'blob',
            }
        );
        return response.data;
    },
};
