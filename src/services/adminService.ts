import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type {
    RecordPaymentRequest,
    BorrowerSummaryResponse,
    PageResponse,
    BorrowerDetailResponse,
    AdminResetPasswordRequest,
    AdminResetPasswordResponse,
} from '@/types/api';

export const adminService = {
    registerBorrower: async (data: FormData): Promise<string> => {
        const response = await apiClient.post<string>(
            API_ENDPOINTS.admin.registerBorrower,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    recordPayment: async (data: RecordPaymentRequest): Promise<string> => {
        const response = await apiClient.post<string>(
            API_ENDPOINTS.admin.recordPayment,
            data
        );
        return response.data;
    },

    getBorrowers: async (params: {
        search?: string;
        status?: string;
        page?: number;
        size?: number;
        sortBy?: string;
        sortDir?: string;
    }): Promise<PageResponse<BorrowerSummaryResponse>> => {
        const response = await apiClient.get<PageResponse<BorrowerSummaryResponse>>(
            API_ENDPOINTS.admin.getBorrowers,
            { params }
        );
        return response.data;
    },

    downloadSchedule: async (borrowerId: number): Promise<Blob> => {
        const response = await apiClient.get(
            API_ENDPOINTS.admin.downloadSchedule(borrowerId),
            {
                responseType: 'blob',
            }
        );
        return response.data;
    },

    getBorrowerDetails: async (id: number): Promise<BorrowerDetailResponse> => {
        const response = await apiClient.get<BorrowerDetailResponse>(
            API_ENDPOINTS.admin.getBorrowerDetails(id)
        );
        return response.data;
    },

    resetPassword: async (id: number, data: AdminResetPasswordRequest): Promise<AdminResetPasswordResponse> => {
        const response = await apiClient.post<AdminResetPasswordResponse>(
            API_ENDPOINTS.admin.resetPassword(id),
            data
        );
        return response.data;
    },
};
