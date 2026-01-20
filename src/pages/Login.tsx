import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Eye, EyeOff, Phone, Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/utils/errorHandler';
import { normalizePhoneNumber } from '@/utils/formatters';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';



export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/borrower', { replace: true });
      }
    }
  }, [isAuthenticated, authLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let normalizedPhone: string;
      try {
        normalizedPhone = normalizePhoneNumber(phone);
      } catch (error) {
        toast({
          title: 'Invalid Phone Number',
          description: error instanceof Error ? error.message : 'Please check phone number format',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      await login({
        phoneNumber: normalizedPhone,
        password,
      });

      toast({
        title: 'Welcome back!',
        description: `Logged in successfully`,
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F3F5]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Removed early return for isAuthenticated to prevent blank screen before navigation

  const inputClasses = "w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-[#F8F9FB] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 outline-none text-slate-900 font-medium placeholder:text-slate-400";
  const labelClasses = "block text-sm font-bold text-slate-700 mb-2";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F1F3F5] relative overflow-hidden selection:bg-indigo-500/10">
      {/* Background patterns for texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Ghana Flag Accent Stripe */}
        <div className="h-2.5 rounded-t-[24px] overflow-hidden flex shadow-sm">
          <div className="flex-1 bg-[#CE1126]" />
          <div className="flex-1 bg-[#FCD116]" />
          <div className="flex-1 bg-[#006B3F]" />
        </div>

        <div className="bg-white rounded-b-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-10 border border-white">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-[#1E293B] rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-900/10 relative group">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Plane className="w-10 h-10 text-emerald-400 animate-float relative z-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center">Crepusculum Loan Manager</h1>
            <p className="text-slate-400 mt-2 font-bold text-base">Sign in to your account</p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClasses}>Phone Number</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm font-bold border-r border-slate-200 pr-3">+233</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="24 123 4567"
                  className={cn(inputClasses, "pl-28")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={cn(inputClasses, "pl-14 pr-14")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#1E293B] hover:bg-[#2d3a4f] text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden relative"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="relative z-10 uppercase tracking-widest text-sm">
                    Sign in
                  </span>
                  <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/5 to-indigo-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </>
              )}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          </form>

          <footer className="mt-10 text-center">
            <p className="text-sm font-bold text-slate-400">
              Trusted by 10,000+ travel enthusiasts
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
