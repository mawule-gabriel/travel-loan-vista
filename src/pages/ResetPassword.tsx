import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plane, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { passwordService } from '@/services/passwordService';
import { getErrorMessage } from '@/utils/errorHandler';
import { cn } from '@/lib/utils';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            toast({
                title: 'Invalid Link',
                description: 'This password reset link is invalid or has expired.',
                variant: 'destructive',
            });
            navigate('/login');
        }
    }, [token, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: 'Password Mismatch',
                description: 'Passwords do not match. Please try again.',
                variant: 'destructive',
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                title: 'Password Too Short',
                description: 'Password must be at least 6 characters.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            await passwordService.resetPassword({ token: token!, newPassword });
            toast({
                title: 'Password Reset Successful',
                description: 'Your password has been updated. Please log in.',
            });
            navigate('/login');
        } catch (error) {
            toast({
                title: 'Reset Failed',
                description: getErrorMessage(error),
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F3F5] p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                            <Plane className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 mb-2">Reset Your Password</h1>
                        <p className="text-slate-500 text-sm">Enter your new password below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className={cn(
                                    "w-full h-14 pl-12 pr-12 bg-slate-100/80 border-0 rounded-2xl",
                                    "text-slate-800 placeholder:text-slate-400 font-medium",
                                    "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white",
                                    "transition-all duration-300"
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className={cn(
                                    "w-full h-14 pl-12 pr-4 bg-slate-100/80 border-0 rounded-2xl",
                                    "text-slate-800 placeholder:text-slate-400 font-medium",
                                    "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:bg-white",
                                    "transition-all duration-300"
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || !newPassword || !confirmPassword}
                            className="w-full h-14 bg-[#1E293B] hover:bg-[#2d3a4f] text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="uppercase tracking-widest text-sm">Reset Password</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
