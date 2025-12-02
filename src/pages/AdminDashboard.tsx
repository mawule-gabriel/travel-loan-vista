import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Wallet, Banknote, AlertTriangle, Plus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { StatsCard } from '@/components/ui/StatsCard';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { BorrowerTable } from '@/components/admin/BorrowerTable';
import { Button } from '@/components/ui/button';
import { mockBorrowers, mockStats } from '@/data/mockData';
import { LoanStatus, Borrower } from '@/types/loan';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'all'>('all');

  const filteredBorrowers = useMemo(() => {
    return mockBorrowers.filter((borrower) => {
      const matchesSearch =
        borrower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrower.phone.includes(searchQuery) ||
        borrower.ghanaCard.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || borrower.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const handleLogout = () => {
    toast({ title: 'Logged out successfully' });
    navigate('/');
  };

  const handleViewBorrower = (borrower: Borrower) => {
    toast({
      title: 'View Borrower',
      description: `Opening ${borrower.name}'s profile...`,
    });
  };

  const handleRecordPayment = (borrower: Borrower) => {
    toast({
      title: 'Payment Recorded',
      description: `GHS ${borrower.monthlyPayment.toLocaleString()} recorded for ${borrower.name}`,
    });
  };

  const handleDownloadPdf = (borrower: Borrower) => {
    toast({
      title: 'Downloading PDF',
      description: `Generating repayment schedule for ${borrower.name}...`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="admin" userName="Admin" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header */}
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Borrowers"
            value={mockStats.totalBorrowers}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Active Loans"
            value={mockStats.activeLoans}
            icon={Wallet}
            variant="primary"
          />
          <StatsCard
            title="Total Disbursed"
            value={`GHS ${(mockStats.totalDisbursed / 1000000).toFixed(2)}M`}
            icon={Banknote}
            variant="success"
          />
          <StatsCard
            title="Overdue Today"
            value={mockStats.overdueToday}
            icon={AlertTriangle}
            variant="warning"
          />
        </div>

        {/* Search and Filter */}
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Borrowers Table */}
        <BorrowerTable
          borrowers={filteredBorrowers}
          onView={handleViewBorrower}
          onRecordPayment={handleRecordPayment}
          onDownloadPdf={handleDownloadPdf}
        />
      </main>
    </div>
  );
}
