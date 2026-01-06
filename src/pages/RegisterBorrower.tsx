import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, User, Calculator, Loader2, Plus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useRegisterBorrower } from '@/hooks/queries/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import { normalizePhoneNumber } from '@/utils/formatters';
import { cn } from '@/lib/utils';

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

  const inputClasses = "w-full px-5 py-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F8F9FB] dark:bg-black/20 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400";
  const labelClasses = "block text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 mb-2.5";

  return (
    <div className="min-h-screen bg-background selection:bg-indigo-500/10 animate-fade-in">
      <Navbar userType="admin" userName={user?.fullName || 'Admin'} onLogout={handleLogout} />

      <main className="container mx-auto px-6 py-10 lg:py-16 max-w-3xl relative z-10">
        <div className="flex items-center gap-6 mb-12 animate-slide-up">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
            className="rounded-full w-12 h-12 hover:bg-white hover:shadow-md transition-all duration-500 hover:scale-110 active:scale-95 text-slate-600 border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Register New Borrower</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-bold tracking-tight">Add a new travel loan application to your portfolio</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Profile Photo Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[28px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-white dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-600">
                <User className="w-5 h-5" />
              </div>
              Profile Photo
            </h2>
            <div className="flex items-center gap-8 relative z-10">
              <div className="relative group/avatar">
                <div className="w-28 h-28 rounded-[24px] bg-slate-50 dark:bg-black/20 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-800 transition-all duration-500 group-hover/avatar:border-indigo-400 shadow-inner">
                  {profilePreview ? (
                    <img src={profilePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-7 h-7 text-slate-400 group-hover/avatar:text-indigo-400 transition-colors" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/40 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 translate-y-2 group-hover/avatar:translate-y-0">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight leading-tight">Identity Photo</p>
                <p className="text-sm font-bold text-slate-400 mt-1">High resolution JPG or PNG</p>
                <div className="flex gap-2 mt-3">
                  <div className="h-1.5 w-8 bg-indigo-500 rounded-full" />
                  <div className="h-1.5 w-4 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  <div className="h-1.5 w-4 bg-slate-100 dark:bg-slate-800 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[28px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-white dark:border-slate-800 group">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-600">
                <User className="w-5 h-5" />
              </div>
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
              <div>
                <label className={labelClasses}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Ghana Card Number</label>
                <input
                  type="text"
                  name="ghanaCardNumber"
                  value={formData.ghanaCardNumber}
                  onChange={handleInputChange}
                  placeholder="GHA-7XXXXXXXX-X"
                  className={inputClasses}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="233 XX XXX XXXX or 0XX XXX XXXX"
                  className={inputClasses}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Home Address (Ghana)</label>
                <textarea
                  name="homeAddressGhana"
                  value={formData.homeAddressGhana}
                  onChange={handleInputChange}
                  placeholder="Enter home address in Ghana"
                  className={cn(inputClasses, "min-h-[110px] resize-none")}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Destination Address</label>
                <textarea
                  name="destinationAddress"
                  value={formData.destinationAddress}
                  onChange={handleInputChange}
                  placeholder="Enter destination address"
                  className={cn(inputClasses, "min-h-[110px] resize-none")}
                  required
                />
              </div>
            </div>
          </div>

          {/* Loan Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[28px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-white dark:border-slate-800 group">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-600">
                <Calculator className="w-5 h-5" />
              </div>
              Loan Details
            </h2>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-8 mb-8">
              <div>
                <label className={labelClasses}>Loan Amount (GHS)</label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  placeholder="e.g. 25000"
                  className={inputClasses}
                  required
                  min="1000"
                  max="200000"
                />
              </div>
              <div>
                <label className={labelClasses}>Duration (Months)</label>
                <select
                  name="monthsDuration"
                  value={formData.monthsDuration}
                  onChange={handleInputChange}
                  className={cn(inputClasses, "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat")}
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
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border-0 rounded-[20px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center gap-6 animate-slide-up">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-800/50">
                  <Calculator className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600/70 mb-1">Estimated Monthly Payment</p>
                  <p className="text-4xl font-black text-emerald-600 tracking-tight leading-none">
                    GHS {monthlyPayment.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Guarantor Information Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[28px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-white dark:border-slate-800 group">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-600">
                <User className="w-5 h-5" />
              </div>
              Guarantor Information
            </h2>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
              <div>
                <label className={labelClasses}>Guarantor Name</label>
                <input
                  type="text"
                  name="guarantorName"
                  value={formData.guarantorName}
                  onChange={handleInputChange}
                  placeholder="Enter guarantor's full name"
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Guarantor Phone</label>
                <input
                  type="tel"
                  name="guarantorPhone"
                  value={formData.guarantorPhone}
                  onChange={handleInputChange}
                  placeholder="233 XX XXX XXXX or 0XX XXX XXXX"
                  className={inputClasses}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Relationship to Borrower</label>
                <input
                  type="text"
                  name="guarantorRelationship"
                  value={formData.guarantorRelationship}
                  onChange={handleInputChange}
                  placeholder="e.g., Parent, Sibling, Spouse"
                  className={inputClasses}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="flex-1 h-14 rounded-2xl font-bold bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
              disabled={registerBorrower.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
              disabled={registerBorrower.isPending}
            >
              {registerBorrower.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <div className="flex items-center">
                  <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                  <span>Register Borrower</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
