const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';
const PASSWORD_RESET_REQUIRED_KEY = 'password_reset_required';

interface StoredUserInfo {
    role: string;
    fullName: string;
    phoneNumber: string;
}

export const tokenStorage = {
    getAccessToken: (): string | null => {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    setAccessToken: (token: string): void => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    getRefreshToken: (): string | null => {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    setRefreshToken: (token: string): void => {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    },

    getUserInfo: (): StoredUserInfo | null => {
        const stored = localStorage.getItem(USER_INFO_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    setUserInfo: (userInfo: StoredUserInfo): void => {
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    },

    getPasswordResetRequired: (): boolean => {
        return localStorage.getItem(PASSWORD_RESET_REQUIRED_KEY) === 'true';
    },

    setPasswordResetRequired: (required: boolean): void => {
        localStorage.setItem(PASSWORD_RESET_REQUIRED_KEY, String(required));
    },

    clearTokens: (): void => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_INFO_KEY);
        localStorage.removeItem(PASSWORD_RESET_REQUIRED_KEY);
    },

    hasTokens: (): boolean => {
        return !!(tokenStorage.getAccessToken() && tokenStorage.getRefreshToken());
    },
};
