import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Wallet, Banknote, AlertTriangle, Plus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { StatsCard } from '@/components/ui/StatsCard';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { BorrowerTable } from '@/components/admin/BorrowerTable';
import { Button } from '@/components/ui/button';
import { RecordPaymentDialog } from '@/components/dialogs/RecordPaymentDialog';
import { BorrowerDetailDialog } from '@/components/dialogs/BorrowerDetailDialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useBorrowers, useDownloadSchedule } from '@/hooks/queries/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import type { BorrowerSummaryResponse, LoanStatus } from '@/types/api';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import { downloadPdfFromResponse } from '@/utils/downloadFile';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'all'>('all');
  const [page, setPage] = useState(0);
  const [selectedBorrower, setSelectedBorrower] = useState<BorrowerSummaryResponse | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data, isLoading, error } = useBorrowers({
    search: searchQuery,
    status: statusFilter === 'all' ? 'On Track,Delayed,Completed' : statusFilter,
    page,
    size: 10,
    sortBy: 'id',
    sortDir: 'desc',
  });

  const downloadSchedule = useDownloadSchedule();

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Logged out successfully' });
  };

  const handleViewBorrower = (borrower: BorrowerSummaryResponse) => {
    setSelectedBorrower(borrower);
    setDetailDialogOpen(true);
  };

  const handleRecordPayment = (borrower: BorrowerSummaryResponse) => {
    setSelectedBorrower(borrower);
    setPaymentDialogOpen(true);
  };

  const handleDownloadPdf = async (borrower: BorrowerSummaryResponse) => {
    try {
      const blob = await downloadSchedule.mutateAsync(borrower.id);
      downloadPdfFromResponse(blob, `Repayment-Schedule-${borrower.phoneNumber}.pdf`);
      toast({
        title: 'PDF Downloaded',
        description: `Repayment schedule for ${borrower.fullName}`,
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const stats = useMemo(() => {
    if (!data) return { totalBorrowers: 0, activeLoans: 0, totalDisbursed: 0, overdueToday: 0 };

    const totalBorrowers = data.totalElements;
    const activeLoans = data.content.filter(b => b.status !== 'Completed').length;
    const totalDisbursed = data.content.reduce((sum, b) => sum + b.loanAmount, 0);
    const overdueToday = data.content.filter(b => b.status === 'Delayed').length;

    return { totalBorrowers, activeLoans, totalDisbursed, overdueToday };
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar userType="admin" userName={user?.fullName || 'Admin'} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
            <p className="text-destructive font-semibold">Error loading borrowers</p>
            <p className="text-sm text-muted-foreground mt-2">{getErrorMessage(error)}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="admin" userName={user?.fullName || 'Admin'} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your travel loan portfolio
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/register')}
            className="bg-emerald hover:bg-emerald-light text-secondary-foreground font-semibold rounded-xl shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Borrower
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Borrowers"
            value={stats.totalBorrowers}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Active Loans"
            value={stats.activeLoans}
            icon={Wallet}
            variant="primary"
          />
          <StatsCard
            title="Total Disbursed"
            value={`GHS ${(stats.totalDisbursed / 1000000).toFixed(2)}M`}
            icon={Banknote}
            variant="success"
          />
          <StatsCard
            title="Overdue Today"
            value={stats.overdueToday}
            icon={AlertTriangle}
            variant="warning"
          />
        </div>

        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <BorrowerTable
            borrowers={data?.content || []}
            onView={handleViewBorrower}
            onRecordPayment={handleRecordPayment}
            onDownloadPdf={handleDownloadPdf}
          />
        )}
      </main>

      {selectedBorrower && (
        <>
          <RecordPaymentDialog
            open={paymentDialogOpen}
            onOpenChange={setPaymentDialogOpen}
            borrowerId={selectedBorrower.id}
            borrowerName={selectedBorrower.fullName}
            monthlyPayment={selectedBorrower.monthlyPayment}
          />
          <BorrowerDetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            borrower={selectedBorrower}
          />
        </>
      )}
    </div>
  );
}
