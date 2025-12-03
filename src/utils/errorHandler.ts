import { AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError | undefined;

        if (apiError?.message) {
            return apiError.message;
        }

        if (error.response?.status === 401) {
            return 'Authentication failed. Please check your credentials.';
        }

        if (error.response?.status === 403) {
            return 'You do not have permission to perform this action.';
        }

        if (error.response?.status === 404) {
            return 'The requested resource was not found.';
        }

        if (error.response?.status === 500) {
            return 'A server error occurred. Please try again later.';
        }

        if (error.code === 'ECONNABORTED') {
            return 'Request timeout. Please check your connection.';
        }

        if (error.code === 'ERR_NETWORK' || !error.response) {
            return 'Cannot connect to backend server. Please ensure the backend is running on http://localhost:8080';
        }

        return error.message || 'An unexpected error occurred.';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred.';
};

export const handleApiError = (error: unknown): never => {
    const message = getErrorMessage(error);
    throw new Error(message);
};
