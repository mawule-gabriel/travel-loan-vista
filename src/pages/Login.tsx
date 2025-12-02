import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Eye, EyeOff, Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type UserType = 'admin' | 'borrower';

export default function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('borrower');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Welcome back!',
      description: `Logged in as ${userType}`,
    });

    if (userType === 'admin') {
      navigate('/admin');
    } else {
      navigate('/borrower');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 kente-pattern opacity-30" />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Ghana Flag Accent */}
        <div className="h-2 rounded-t-2xl overflow-hidden flex">
          <div className="flex-1 bg-[#CE1126]" />
          <div className="flex-1 bg-[#FCD116]" />
          <div className="flex-1 bg-[#006B3F]" />
        </div>

        <div className="bg-card rounded-b-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Plane className="w-8 h-8 text-emerald" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Crepusculum Loan Manager</h1>
            <p className="text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          {/* User Type Toggle */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setUserType('borrower')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                userType === 'borrower'
                  ? 'bg-card shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Borrower
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                userType === 'admin'
                  ? 'bg-card shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium border-r border-border pr-2">+233</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="24 123 4567"
                  className="input-field pl-24"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-emerald hover:text-emerald-light transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-navy hover:bg-navy-light text-primary-foreground font-semibold rounded-xl shadow-lg transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                `Sign in as ${userType === 'admin' ? 'Admin' : 'Borrower'}`
              )}
            </Button>
          </form>

          {/* Demo Hint */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Demo: Enter any phone and password to continue
          </p>
        </div>
      </div>
    </div>
  );
}
