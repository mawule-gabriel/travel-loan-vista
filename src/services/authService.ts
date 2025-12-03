import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { tokenStorage } from '@/utils/tokenStorage';
import type { LoginRequest, JwtResponse, RefreshTokenRequest, RefreshTokenResponse } from '@/types/api';

export const authService = {
    login: async (credentials: LoginRequest): Promise<JwtResponse> => {
        const response = await apiClient.post<JwtResponse>(
            API_ENDPOINTS.auth.login,
            credentials
        );

        const { accessToken, refreshToken } = response.data;
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(refreshToken);

        return response.data;
    },

    logout: async (): Promise<void> => {
        const refreshToken = tokenStorage.getRefreshToken();

        if (refreshToken) {
            try {
                await apiClient.post(API_ENDPOINTS.auth.logout, { refreshToken });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        tokenStorage.clearTokens();
    },

    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post<RefreshTokenResponse>(
            API_ENDPOINTS.auth.refresh,
            { refreshToken } as RefreshTokenRequest
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(newRefreshToken);

        return response.data;
    },

    isAuthenticated: (): boolean => {
        return tokenStorage.hasTokens();
    },
};
