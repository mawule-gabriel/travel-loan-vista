import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { logout, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'all'>('all');
  const [page, setPage] = useState(0);
  const [selectedBorrower, setSelectedBorrower] = useState<BorrowerSummaryResponse | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Added background ref for potential parallax effect or similar interacting
  // using a simple full-page background wrapper primarily

  const { data, isLoading, error } = useBorrowers({
    search: searchQuery,
    status: statusFilter === 'all' ? 'On Track,Delayed,Completed' : statusFilter,
    page,
    size: 10,
    sortBy: 'id',
    sortDir: 'desc',
  });

  // Update selectedBorrower when data refreshes to show latest payment information
  const updatedSelectedBorrower = useMemo(() => {
    if (!selectedBorrower || !data?.content) return selectedBorrower;
    const freshBorrower = data.content.find(b => b.id === selectedBorrower.id);
    return freshBorrower || selectedBorrower;
  }, [selectedBorrower, data]);

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

  useEffect(() => {
    if (location.pathname === '/admin/borrowers') {
      const element = document.getElementById('borrowers-list');
      if (element) {
        const offset = 100; // Increased offset for better visibility
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [location.pathname]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar userType="admin" userName={user?.fullName || 'Admin'} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="glass-panel border-destructive/20 rounded-2xl p-8 text-center max-w-md mx-auto mt-20">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-destructive font-bold text-lg">Error loading borrowers</p>
            <p className="text-sm text-muted-foreground mt-2">{getErrorMessage(error)}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-6">Retry</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative selection:bg-indigo-500/30 overflow-x-hidden animate-fade-in">
      {/* Sophisticated Background Layers */}
      <div className="fixed inset-0 bg-[radial-gradient(at_top_right,rgba(99,102,241,0.08),transparent_50%),radial-gradient(at_bottom_left,rgba(20,184,166,0.05),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />

      <Navbar userType="admin" userName={user?.fullName || 'Admin'} onLogout={handleLogout} />

      <main className="container mx-auto px-6 py-10 lg:py-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground/80 mt-3 text-lg font-bold tracking-tight">
              Manage your travel loan portfolio with precision
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/register')}
            className="rounded-[22px] px-8 py-8 h-12 text-base font-black shadow-elevated bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white border-0 hover:scale-[1.03] hover:-translate-y-1 active:scale-95 transition-all duration-500 group animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="p-1.5 bg-white/20 rounded-xl mr-3 group-hover:rotate-90 transition-transform duration-500">
              <Plus className="w-5 h-5" />
            </div>
            New Borrower
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
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

        <div id="borrowers-list" className="scroll-mt-24">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground animate-pulse">Loading dashboard data...</p>
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
            borrowerId={updatedSelectedBorrower.id}
            borrowerName={updatedSelectedBorrower.fullName}
            monthlyPayment={updatedSelectedBorrower.monthlyPayment}
          />
          <BorrowerDetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            borrower={updatedSelectedBorrower}
          />
        </>
      )}
    </div>
  );
}
