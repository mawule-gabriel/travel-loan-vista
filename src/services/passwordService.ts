import { apiClient } from '@/api/client';
import type {
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    MessageResponse
} from '@/types/api';

export const passwordService = {
    forgotPassword: async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/auth/forgot-password', data);
        return response.data;
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/auth/reset-password', data);
        return response.data;
    },

    changePassword: async (data: ChangePasswordRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/auth/change-password', data);
        return response.data;
    },
};
