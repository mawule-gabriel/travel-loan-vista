export const queryKeys = {
    auth: {
        all: ['auth'] as const,
        user: () => [...queryKeys.auth.all, 'user'] as const,
    },
    admin: {
        all: ['admin'] as const,
        borrowers: (params?: Record<string, unknown>) =>
            [...queryKeys.admin.all, 'borrowers', params] as const,
        borrower: (id: number) => [...queryKeys.admin.all, 'borrower', id] as const,
    },
    borrower: {
        all: ['borrower'] as const,
        dashboard: () => [...queryKeys.borrower.all, 'dashboard'] as const,
    },
} as const;
