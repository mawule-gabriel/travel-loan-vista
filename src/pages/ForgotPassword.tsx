import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Phone, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { passwordService } from '@/services/passwordService';
import { getErrorMessage } from '@/utils/errorHandler';
import { normalizePhoneNumber } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

            await passwordService.forgotPassword({ phoneNumber: normalizedPhone });
            setSubmitted(true);
        } catch (error) {
            toast({
                title: 'Error',
                description: getErrorMessage(error),
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F1F3F5] p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Plane className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-4">Check Your Email</h2>
                        <p className="text-slate-600 mb-8">
                            If an email is associated with this account, you will receive password reset instructions shortly.
                        </p>
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full h-14 bg-[#1E293B] hover:bg-[#2d3a4f] text-white font-black rounded-2xl"
                        >
                            Back to Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F3F5] p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-10">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-semibold">Back to Login</span>
                    </button>

                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                            <Plane className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-800 mb-2">Forgot Password</h1>
                        <p className="text-slate-500 text-sm">Enter your phone number to receive reset instructions</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                            <input
                                type="tel"
                                placeholder="Phone Number (e.g., 0551234567)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
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
                            disabled={isLoading || !phone}
                            className="w-full h-14 bg-[#1E293B] hover:bg-[#2d3a4f] text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="uppercase tracking-widest text-sm">Send Reset Link</span>
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
