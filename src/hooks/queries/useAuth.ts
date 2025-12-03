import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import type { LoginRequest, JwtResponse } from '@/types/api';
import { getErrorMessage } from '@/utils/errorHandler';

export const useLogin = (): UseMutationResult<JwtResponse, Error, LoginRequest> => {
    return useMutation({
        mutationFn: authService.login,
        onError: (error) => {
            console.error('Login error:', getErrorMessage(error));
        },
    });
};

export const useLogout = (): UseMutationResult<void, Error, void> => {
    return useMutation({
        mutationFn: authService.logout,
        onError: (error) => {
            console.error('Logout error:', getErrorMessage(error));
        },
    });
};
