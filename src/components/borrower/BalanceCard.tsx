import type { BorrowerDashboardResponse } from '@/types/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Calendar, TrendingDown } from 'lucide-react';

interface BalanceCardProps {
  dashboardData: BorrowerDashboardResponse;
}

export function BalanceCard({ dashboardData }: BalanceCardProps) {
  const progressPercent = dashboardData.totalMonths > 0 
    ? (dashboardData.monthsPaid / dashboardData.totalMonths) * 100 
    : 0;
  
  const daysUntilDue = dashboardData.nextDueDate 
    ? Math.ceil((new Date(dashboardData.nextDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="bg-navy rounded-3xl p-6 text-primary-foreground overflow-hidden relative">
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-emerald/10" />
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gold/10" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src={dashboardData.profilePictureUrl || '/placeholder.svg'}
              alt={dashboardData.fullName}
              className="w-14 h-14 rounded-full border-2 border-emerald object-cover"
            />
            <div>
              <h2 className="font-bold text-lg">{dashboardData.fullName}</h2>
              <p className="text-sm opacity-70">{dashboardData.phoneNumber}</p>
            </div>
          </div>
          <StatusBadge status={dashboardData.status} size="lg" />
        </div>

        <div className="mb-6">
          <p className="text-sm opacity-70 mb-1">Amount Remaining</p>
          <p className="text-4xl font-bold">
            GHS {dashboardData.balance.toLocaleString()}
          </p>
          <p className="text-sm opacity-70 mt-1">
            of GHS {dashboardData.loanAmount.toLocaleString()} total
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Payment Progress</span>
            <span className="font-semibold">{dashboardData.monthsPaid} of {dashboardData.totalMonths} months</span>
          </div>
          <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-foreground/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium">Monthly Payment</span>
            </div>
            <p className="text-xl font-bold">GHS {dashboardData.monthlyPayment.toLocaleString()}</p>
          </div>
          
          {dashboardData.nextDueDate && (
            <div className="bg-primary-foreground/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gold mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Next Due</span>
              </div>
              <p className="text-xl font-bold">{daysUntilDue} days</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
