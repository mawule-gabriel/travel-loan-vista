import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Shield, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/borrower', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F1F3F5]">
      {/* Ghana Flag Stripe */}
      <div className="fixed top-0 left-0 right-0 h-[6px] flex z-[60]">
        <div className="flex-1 bg-[#CE1126]" />
        <div className="flex-1 bg-[#FCD116]" />
        <div className="flex-1 bg-[#006B3F]" />
      </div>

      {/* Modern Header */}
      <header className="fixed top-[6px] left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-[#10B981] rounded-xl shadow-lg shadow-[#10B981]/20">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#111827] tracking-tight">Crepusculum Loan Manager</span>
          </div>
          <Button
            onClick={() => navigate('/login')}
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6 py-2 rounded-xl font-semibold shadow-sm transition-all duration-200"
          >
            Sign In
          </Button>
        </div>
      </header>

      <div className="pt-26 relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative container mx-auto px-4 pt-40 pb-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 text-[#059669] text-sm font-semibold mb-8 shadow-sm border border-[#10B981]/20">
              <div className="p-1 bg-[#10B981] rounded-full shadow-glow">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              Trusted by 500+ Ghanaians
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
              <span className="text-[#111827]">Your Dreams,</span>
              <br />
              <span className="text-[#10B981]">Our Support</span>
            </h1>

            <p className="text-lg md:text-xl text-[#6B7280] mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of travel financing. Track payments, monitor progress, and achieve your global goals with Ghana's most trusted premium platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="h-14 px-10 bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-lg transition-transform hover:scale-[1.03] group"
              >
                Request Access
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-10 rounded-xl text-[#1E293B] border-2 border-[#1E293B] font-bold text-lg hover:bg-[#1E293B]/5 transition-colors"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-card">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
          </svg>
        </div>
      </div>

      <section className="bg-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-4">
              Why Choose Crepusculum?
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto text-lg">
              We provide the tools and support you need to manage your travel financing with complete confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-20 h-20 mb-6 rounded-2xl bg-[#10B981]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-[#10B981]" />
              </div>
              <h3 className="text-2xl font-bold text-[#111827] mb-4">Secure & Trusted</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Your data is protected with military-grade encryption. We are fully licensed by the Bank of Ghana.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-20 h-20 mb-6 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-[#F59E0B]" />
              </div>
              <h3 className="text-2xl font-bold text-[#111827] mb-4">Real-time Tracking</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Monitor every Cedi. Our intuitive dashboard gives you a clear view of your repayment schedule.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-20 h-20 mb-6 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-[#6366F1]" />
              </div>
              <h3 className="text-2xl font-bold text-[#111827] mb-4">Dedicated Support</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Our local experts are available 24/7 to guide you through your travel loan application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-4">
              Trusted by Ghanaians Everywhere
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto text-lg">
              See how Crepusculum is helping people achieve their dreams across the country.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Kwame Mensah",
                role: "Graduate Student",
                content: "Crepusculum made my dream of studying in the UK a reality. The process was transparent and the dashboard is incredibly easy to use.",
                avatar: "KM"
              },
              {
                name: "Abena Osei",
                role: "Entrepreneur",
                content: "I needed quick travel financing for a business conference in Dubai. They provided the support I needed within days. Highly recommended!",
                avatar: "AO"
              },
              {
                name: "Kofi Appiah",
                role: "Software Engineer",
                content: "As a tech professional, I appreciate the clean UI and real-time tracking. It's the most modern loan platform in Ghana right now.",
                avatar: "KA"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-[#F9FAFB] p-8 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111827]">{testimonial.name}</h4>
                    <p className="text-sm text-[#6B7280]">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[#4B5563] italic leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0F172A] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-xl">
            Contact us to get started with your travel loan needs. Already have an account? Sign in to manage your loans.
          </p>
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="h-16 px-12 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-2xl shadow-[0_8px_24px_rgba(16,185,129,0.3)] text-xl transition-all hover:scale-[1.05] group"
          >
            Sign In
            <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
          </Button>
        </div>
      </section>

      {/* Expanded Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1E293B] rounded-xl flex items-center justify-center shadow-sm">
                  <Plane className="w-5 h-5 text-[#10B981]" />
                </div>
                <span className="text-xl font-bold text-[#111827]">Crepusculum</span>
              </div>
              <p className="text-[#6B7280] max-w-sm leading-relaxed mb-6">
                Ghana's leading premium travel loan management platform. Empowering your global ambitions with smart, transparent, and secure financing solutions.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#111827] mb-6 uppercase text-xs tracking-widest">Product</h4>
              <ul className="space-y-4 text-[#6B7280]">
                <li className="hover:text-[#10B981] cursor-pointer">Features</li>
                <li className="hover:text-[#10B981] cursor-pointer">How it Works</li>
                <li className="hover:text-[#10B981] cursor-pointer">Security</li>
                <li className="hover:text-[#10B981] cursor-pointer">Loan Calculator</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#111827] mb-6 uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-[#6B7280]">
                <li className="hover:text-[#10B981] cursor-pointer">About Us</li>
                <li className="hover:text-[#10B981] cursor-pointer">Contact</li>
                <li className="hover:text-[#10B981] cursor-pointer">Privacy Policy</li>
                <li className="hover:text-[#10B981] cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-gray-50 gap-4">
            <p className="text-sm text-[#9CA3AF]">
              © 2024 Crepusculum Loan Manager. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-tighter">Made with</span>
              <span className="text-red-500 text-lg">❤️</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-tighter text-emerald-600">in Ghana</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
