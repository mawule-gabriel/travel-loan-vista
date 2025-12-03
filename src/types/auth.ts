export type Role = 'ADMIN' | 'BORROWER';

export interface User {
    id: number;
    fullName: string;
    phoneNumber: string;
    role: Role;
    profilePicturePath?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
