export type LoanStatus = 'On Track' | 'Delayed' | 'Completed';

export interface LoginRequest {
    phoneNumber: string;
    password: string;
}

export interface JwtResponse {
    accessToken: string;
    refreshToken: string;
    role: string;
    name: string;
    expiresIn: number;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface BorrowerSummaryResponse {
    id: number;
    fullName: string;
    phoneNumber: string;
    ghanaCardNumber: string;
    profilePictureUrl: string | null;
    loanAmount: number;
    monthlyPayment: number;
    totalPaid: number;
    balance: number;
    startDate: string | null;
    endDate: string | null;
    monthsPaid: number;
    totalMonths: number;
    status: LoanStatus;
}

export interface BorrowerDashboardResponse {
    fullName: string;
    phoneNumber: string;
    profilePictureUrl: string | null;
    homeAddressGhana: string;
    destinationAddress: string;
    loanAmount: number;
    monthlyPayment: number;
    totalPaid: number;
    balance: number;
    startDate: string | null;
    nextDueDate: string | null;
    endDate: string | null;
    totalMonths: number;
    monthsPaid: number;
    monthsRemaining: number;
    status: LoanStatus;
    guarantorName: string;
    guarantorPhone: string;
    paymentHistory: PaymentHistory[];
}

export interface PaymentHistory {
    amount: number;
    date: string;
    recordedBy: string;
}

export interface BorrowerDetailResponse {
    borrowerId: number;
    fullName: string;
    phoneNumber: string;
    ghanaCardNumber: string;
    homeAddressGhana: string;
    destinationAddress: string;
    profilePictureUrl: string | null;
    loanAmount: number;
    monthlyPayment: number;
    totalPaid: number;
    balance: number;
    startDate: string | null;
    endDate: string | null;
    monthsDuration: number;
    guarantorName: string;
    guarantorPhone: string;
    guarantorRelationship: string;
    payments: PaymentResponse[];
    status: LoanStatus;
}

export interface PaymentResponse {
    amount: number;
    date: string;
    recordedBy: string;
    note: string | null;
}

export interface RecordPaymentRequest {
    borrowerId: number;
    amountPaid: number;
    note?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}