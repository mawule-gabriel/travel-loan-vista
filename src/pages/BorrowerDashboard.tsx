import { useNavigate } from 'react-router-dom';
import { FileDown, Phone, MapPin } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { BalanceCard } from '@/components/borrower/BalanceCard';
import { PaymentTimeline } from '@/components/borrower/PaymentTimeline';
import { Button } from '@/components/ui/button';
import { mockBorrowers, getBorrowerPayments } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

export default function BorrowerDashboard() {
  const navigate = useNavigate();
  // For demo, use the first borrower
  const borrower = mockBorrowers[0];
  const payments = getBorrowerPayments(borrower.id);

  const handleLogout = () => {
    toast({ title: 'Logged out successfully' });
    navigate('/');
  };

  const handleDownloadSchedule = () => {
    toast({
      title: 'Downloading Schedule',
      description: 'Your repayment schedule PDF is being generated...',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="borrower" userName={borrower.name} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6 lg:py-8 max-w-4xl">
        {/* Balance Card */}
        <div className="mb-6 animate-fade-in">
          <BalanceCard borrower={borrower} />
        </div>

        {/* Quick Actions */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Button
            onClick={handleDownloadSchedule}
            className="w-full h-14 bg-gold hover:bg-gold-light text-accent-foreground font-semibold rounded-2xl shadow-lg"
          >
            <FileDown className="w-5 h-5 mr-3" />
            Download Repayment Schedule (PDF)
          </Button>
        </div>

        {/* Info Cards */}
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
                <span className="text-muted-foreground">{borrower.phone}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-gold" />
                </div>
                <span className="text-muted-foreground">{borrower.currentAddress}</span>
              </div>
            </div>
          </div>

          <div 
            className="bg-card rounded-2xl p-5 shadow-lg animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            <h3 className="font-semibold text-foreground mb-3">Guarantor Details</h3>
            <div className="space-y-2 text-sm">
              <p className="text-foreground font-medium">{borrower.guarantorName}</p>
              <p className="text-muted-foreground">{borrower.guarantorPhone}</p>
              <p className="text-muted-foreground">{borrower.guarantorAddress}</p>
            </div>
          </div>
        </div>

        {/* Payment Timeline */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <PaymentTimeline payments={payments} />
        </div>
      </main>
    </div>
  );
}
