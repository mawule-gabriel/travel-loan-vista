export type LoanStatus = 'on-track' | 'delayed' | 'completed';

export interface Borrower {
  id: string;
  name: string;
  phone: string;
  ghanaCard: string;
  profilePhoto: string;
  currentAddress: string;
  permanentAddress: string;
  loanAmount: number;
  monthlyPayment: number;
  balance: number;
  duration: number;
  paidMonths: number;
  status: LoanStatus;
  nextDueDate: string;
  guarantorName: string;
  guarantorPhone: string;
  guarantorAddress: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  borrowerId: string;
  amount: number;
  date: string;
  month: number;
  status: 'paid' | 'pending' | 'overdue';
}

export interface DashboardStats {
  totalBorrowers: number;
  activeLoans: number;
  totalDisbursed: number;
  overdueToday: number;
}
