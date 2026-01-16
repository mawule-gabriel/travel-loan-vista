import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { tokenStorage } from '@/utils/tokenStorage';
import type { User, AuthState } from '@/types/auth';
import type { LoginRequest, JwtResponse } from '@/types/api';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    exp: number;
}

interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    clearPasswordResetRequired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

const normalizeRole = (role: string): 'ADMIN' | 'BORROWER' => {
    const normalized = role.replace(/^ROLE_/, '').toUpperCase();
    return normalized === 'ADMIN' ? 'ADMIN' : 'BORROWER';
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        passwordResetRequired: false,
    });

    const getUserFromStorage = (): User | null => {
        const token = tokenStorage.getAccessToken();
        const userInfo = tokenStorage.getUserInfo();

        if (!token || !userInfo) {
            return null;
        }

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const phoneNumber = decoded.sub;

            return {
                id: 0,
                fullName: userInfo.fullName,
                phoneNumber: phoneNumber,
                role: normalizeRole(userInfo.role),
            };
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const user = getUserFromStorage();
        const storedPasswordResetRequired = tokenStorage.getPasswordResetRequired();
        setAuthState({
            user,
            isAuthenticated: !!user,
            isLoading: false,
            passwordResetRequired: storedPasswordResetRequired,
        });
    }, []);

    const login = async (credentials: LoginRequest) => {
        setAuthState((prev) => ({ ...prev, isLoading: true }));
        try {
            const response: JwtResponse = await authService.login(credentials);

            tokenStorage.setUserInfo({
                role: response.role,
                fullName: response.name,
                phoneNumber: credentials.phoneNumber,
            });
            tokenStorage.setPasswordResetRequired(response.passwordResetRequired);

            const user: User = {
                id: 0,
                fullName: response.name,
                phoneNumber: credentials.phoneNumber,
                role: normalizeRole(response.role),
            };

            setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
                passwordResetRequired: response.passwordResetRequired,
            });

            if (response.passwordResetRequired) {
                navigate('/change-password');
            } else if (user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/borrower');
            }
        } catch (error) {
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                passwordResetRequired: false,
            });
            throw error;
        }
    };

    const logout = async () => {
        await authService.logout();
        tokenStorage.setPasswordResetRequired(false);
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            passwordResetRequired: false,
        });
        navigate('/login');
    };

    const clearPasswordResetRequired = () => {
        tokenStorage.setPasswordResetRequired(false);
        setAuthState((prev) => ({ ...prev, passwordResetRequired: false }));
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, clearPasswordResetRequired }}>
            {children}
        </AuthContext.Provider>
    );
};
