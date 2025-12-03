import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, User, Calculator, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useRegisterBorrower } from '@/hooks/queries/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import { normalizePhoneNumber } from '@/utils/formatters';

export default function RegisterBorrower() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const registerBorrower = useRegisterBorrower();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    ghanaCardNumber: '',
    phoneNumber: '',
    homeAddressGhana: '',
    destinationAddress: '',
    loanAmount: '',
    monthsDuration: '11',
    guarantorName: '',
    guarantorPhone: '',
    guarantorRelationship: '',
  });

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Logged out successfully' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
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
    const months = parseInt(formData.monthsDuration) || 11;
    return amount > 0 ? Math.ceil(amount / months) : 0;
  }, [formData.loanAmount, formData.monthsDuration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let normalizedPhone: string;
    let normalizedGuarantorPhone: string;

    try {
      normalizedPhone = normalizePhoneNumber(formData.phoneNumber);
      normalizedGuarantorPhone = normalizePhoneNumber(formData.guarantorPhone);
    } catch (error) {
      toast({
        title: 'Invalid Phone Number',
        description: error instanceof Error ? error.message : 'Please check phone number format',
        variant: 'destructive',
      });
      return;
    }

    const apiFormData = new FormData();
    apiFormData.append('fullName', formData.fullName);
    apiFormData.append('ghanaCardNumber', formData.ghanaCardNumber);
    apiFormData.append('phoneNumber', normalizedPhone);
    apiFormData.append('homeAddressGhana', formData.homeAddressGhana);
    apiFormData.append('destinationAddress', formData.destinationAddress);
    apiFormData.append('loanAmount', formData.loanAmount);
    apiFormData.append('monthsDuration', formData.monthsDuration);
    apiFormData.append('guarantorName', formData.guarantorName);
    apiFormData.append('guarantorPhone', normalizedGuarantorPhone);
    apiFormData.append('guarantorRelationship', formData.guarantorRelationship);

    if (profileFile) {
      apiFormData.append('profilePicture', profileFile);
    }

    try {
      await registerBorrower.mutateAsync(apiFormData);
      toast({
        title: 'Borrower Registered',
        description: `${formData.fullName} has been successfully registered.`,
      });
      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="admin" userName={user?.fullName || 'Admin'} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6 lg:py-8 max-w-3xl">
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

          <div className="bg-card rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
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
                  name="ghanaCardNumber"
                  value={formData.ghanaCardNumber}
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
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="233 XX XXX XXXX or 0XX XXX XXXX"
                  className="input-field"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Home Address (Ghana)</label>
                <textarea
                  name="homeAddressGhana"
                  value={formData.homeAddressGhana}
                  onChange={handleInputChange}
                  placeholder="Enter home address in Ghana"
                  className="input-field min-h-[80px] resize-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Destination Address</label>
                <textarea
                  name="destinationAddress"
                  value={formData.destinationAddress}
                  onChange={handleInputChange}
                  placeholder="Enter destination address"
                  className="input-field min-h-[80px] resize-none"
                  required
                />
              </div>
            </div>
          </div>

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
                  max="200000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Duration (Months)</label>
                <select
                  name="monthsDuration"
                  value={formData.monthsDuration}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="11">11 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                  <option value="30">30 months</option>
                  <option value="36">36 months</option>
                </select>
              </div>
            </div>

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
                  placeholder="233 XX XXX XXXX or 0XX XXX XXXX"
                  className="input-field"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Relationship</label>
                <input
                  type="text"
                  name="guarantorRelationship"
                  value={formData.guarantorRelationship}
                  onChange={handleInputChange}
                  placeholder="e.g., Father, Sister, Friend"
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
              className="flex-1 h-14 rounded-xl"
              disabled={registerBorrower.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-14 bg-navy hover:bg-navy-light text-primary-foreground font-semibold rounded-xl shadow-lg"
              disabled={registerBorrower.isPending}
            >
              {registerBorrower.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Register Borrower
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
