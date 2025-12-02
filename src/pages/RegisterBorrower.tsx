import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, User, Calculator } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function RegisterBorrower() {
  const navigate = useNavigate();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    ghanaCard: '',
    phone: '',
    currentAddress: '',
    permanentAddress: '',
    loanAmount: '',
    duration: '12',
    guarantorName: '',
    guarantorPhone: '',
    guarantorAddress: '',
  });

  const handleLogout = () => {
    toast({ title: 'Logged out successfully' });
    navigate('/');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const monthlyPayment = useMemo(() => {
    const amount = parseFloat(formData.loanAmount) || 0;
    const months = parseInt(formData.duration) || 12;
    return amount > 0 ? Math.ceil(amount / months) : 0;
  }, [formData.loanAmount, formData.duration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Borrower Registered',
      description: `${formData.name} has been successfully registered.`,
    });
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="admin" userName="Admin" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6 lg:py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Register New Borrower</h1>
            <p className="text-muted-foreground mt-1">Add a new travel loan application</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-card rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-4">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
                  {profilePreview ? (
                    <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div>
                <p className="font-medium text-foreground">Upload Photo</p>
                <p className="text-sm text-muted-foreground">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-card rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ghana Card Number</label>
                <input
                  type="text"
                  name="ghanaCard"
                  value={formData.ghanaCard}
                  onChange={handleInputChange}
                  placeholder="GHA-XXXXXXXXX-X"
                  className="input-field"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+233 XX XXX XXXX"
                  className="input-field"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Current Address</label>
                <textarea
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  placeholder="Enter current residential address"
                  className="input-field min-h-[80px] resize-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Permanent Address</label>
                <textarea
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  placeholder="Enter permanent/hometown address"
                  className="input-field min-h-[80px] resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-card rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-4">Loan Details</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Loan Amount (GHS)</label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  placeholder="e.g. 25000"
                  className="input-field"
                  required
                  min="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Duration (Months)</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>
            </div>

            {/* Monthly Payment Calculator */}
            {monthlyPayment > 0 && (
              <div className="bg-emerald/10 border border-emerald/20 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald/20 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-emerald" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-2xl font-bold text-emerald">
                    GHS {monthlyPayment.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Guarantor Information */}
          <div className="bg-card rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-4">Guarantor Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Guarantor Name</label>
                <input
                  type="text"
                  name="guarantorName"
                  value={formData.guarantorName}
                  onChange={handleInputChange}
                  placeholder="Enter guarantor's full name"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Guarantor Phone</label>
                <input
                  type="tel"
                  name="guarantorPhone"
                  value={formData.guarantorPhone}
                  onChange={handleInputChange}
                  placeholder="+233 XX XXX XXXX"
                  className="input-field"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Guarantor Address</label>
                <textarea
                  name="guarantorAddress"
                  value={formData.guarantorAddress}
                  onChange={handleInputChange}
                  placeholder="Enter guarantor's address"
                  className="input-field min-h-[80px] resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
              className="flex-1 h-14 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-14 bg-navy hover:bg-navy-light text-primary-foreground font-semibold rounded-xl shadow-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Register Borrower
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
