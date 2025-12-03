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
        downloadSchedule: (id: number) => `/admin/borrowers/${id}/schedule`,
    },
    borrower: {
        getDashboard: '/borrower/me',
        downloadSchedule: '/borrower/me/schedule',
    },
} as const;
