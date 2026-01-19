export const API_ENDPOINTS = {
    auth: {
        login: '/auth/login',
        refresh: '/auth/refresh',
        logout: '/auth/logout',
    },
    admin: {
        registerBorrower: '/admin/borrowers',
        recordPayment: '/admin/payments',
        getBorrowers: '/admin/borrowers',
        getBorrowerDetails: (id: number) => `/admin/borrowers/${id}`,
        downloadSchedule: (id: number) => `/admin/borrowers/${id}/schedule`,
        resetPassword: (id: number) => `/admin/borrowers/${id}/reset-password`,
    },
    borrower: {
        getDashboard: '/borrower/me',
        downloadSchedule: '/borrower/me/schedule',
    },
} as const;
