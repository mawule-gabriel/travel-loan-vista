export type LoanStatus = 'On Track' | 'Delayed' | 'Completed';

export interface Borrower {
  id: number;
  fullName: string;
  phoneNumber: string;
  ghanaCardNumber: string;
  profilePicturePath?: string;
  homeAddressGhana: string;
  destinationAddress: string;
  createdAt: string;
  role: 'ADMIN' | 'BORROWER';
  loan?: Loan;
  guarantor?: Guarantor;
}

export interface Loan {
  id: number;
  amount: number;
  monthlyPayment: number;
  totalPaid: number;
  balance: number;
  startDate?: string;
  endDate?: string;
  monthsDuration: number;
}

export interface Guarantor {
  id: number;
  fullName: string;
  phoneNumber: string;
  relationship: string;
}

export interface Payment {
  id: number;
  amountPaid: number;
  paymentDate: string;
  recordedBy: string;
}

export interface DashboardStats {
  totalBorrowers: number;
  activeLoans: number;
  totalDisbursed: number;
  overdueToday: number;
}

