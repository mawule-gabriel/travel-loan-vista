import { useNavigate } from 'react-router-dom';
import { FileDown, Phone, MapPin } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { BalanceCard } from '@/components/borrower/BalanceCard';
import { PaymentTimeline } from '@/components/borrower/PaymentTimeline';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useBorrowerDashboard, useDownloadMySchedule } from '@/hooks/queries/useBorrower';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import { downloadPdfFromResponse } from '@/utils/downloadFile';
import { formatPhoneNumber } from '@/utils/formatters';

export default function BorrowerDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { data: dashboardData, isLoading, error } = useBorrowerDashboard();
  const downloadSchedule = useDownloadMySchedule();

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Logged out successfully' });
    navigate('/');
  };

  const handleDownloadSchedule = async () => {
    try {
      const blob = await downloadSchedule.mutateAsync();
      downloadPdfFromResponse(blob, 'My-Repayment-Schedule.pdf');
      toast({
        title: 'PDF Downloaded',
        description: 'Your repayment schedule has been downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar userType="borrower" userName={user?.fullName || 'Borrower'} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar userType="borrower" userName={user?.fullName || 'Borrower'} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl">
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
            <p className="text-destructive font-semibold">Error loading dashboard</p>
            <p className="text-sm text-muted-foreground mt-2">{getErrorMessage(error)}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="borrower" userName={dashboardData.fullName} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl">
        <div className="mb-6 animate-fade-in">
          <BalanceCard dashboardData={dashboardData} />
        </div>

        <div className="mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Button
            onClick={handleDownloadSchedule}
            disabled={downloadSchedule.isPending}
            className="w-full h-14 bg-gold hover:bg-gold-light text-accent-foreground font-semibold rounded-2xl shadow-lg"
          >
            <FileDown className="w-5 h-5 mr-3" />
            {downloadSchedule.isPending ? 'Downloading...' : 'Download Repayment Schedule (PDF)'}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div
            className="bg-card rounded-2xl p-5 shadow-lg animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            <h3 className="font-semibold text-foreground mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald" />
                </div>
                <span className="text-muted-foreground">{formatPhoneNumber(dashboardData.phoneNumber)}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-gold" />
                </div>
                <span className="text-muted-foreground">{dashboardData.homeAddressGhana}</span>
              </div>
            </div>
          </div>

          <div
            className="bg-card rounded-2xl p-5 shadow-lg animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            <h3 className="font-semibold text-foreground mb-3">Guarantor Details</h3>
            <div className="space-y-2 text-sm">
              <p className="text-foreground font-medium">{dashboardData.guarantorName}</p>
              <p className="text-muted-foreground">{formatPhoneNumber(dashboardData.guarantorPhone)}</p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <PaymentTimeline
            payments={dashboardData.paymentHistory.map(p => ({
              ...p,
              note: null
            }))}
            startDate={dashboardData.startDate}
            totalMonths={dashboardData.totalMonths}
            monthlyPayment={dashboardData.monthlyPayment}
          />
        </div>
      </main>
    </div>
  );
}
