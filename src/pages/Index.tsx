import { useNavigate } from 'react-router-dom';
import { Plane, Shield, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Kente Pattern Background */}
        <div className="absolute inset-0 kente-pattern opacity-20" />
        
        {/* Ghana Flag Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-[#CE1126]" />
          <div className="flex-1 bg-[#FCD116]" />
          <div className="flex-1 bg-[#006B3F]" />
        </div>

        <div className="relative container mx-auto px-4 pt-20 pb-32">
          {/* Logo & Nav */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center shadow-lg">
                <Plane className="w-6 h-6 text-emerald" />
              </div>
              <span className="text-xl font-bold text-foreground">Crepusculum Loan Manager</span>
            </div>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="rounded-xl"
            >
              Sign In
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/10 text-emerald text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Trusted by 500+ Ghanaians
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Dreams,{' '}
              <span className="text-emerald">Our Support</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Manage loans with ease. Track payments, monitor progress, and achieve your goals with Ghana's most trusted loan management platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="h-14 px-8 bg-navy hover:bg-navy-light text-primary-foreground font-semibold rounded-xl shadow-lg text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-xl text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-card">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose Us?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-emerald" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Secure & Trusted</h3>
              <p className="text-muted-foreground">
                Your data is protected with bank-level security. We're licensed and regulated.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gold/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Easy Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your loan progress in real-time with our beautiful dashboard.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-navy/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-navy" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Dedicated Support</h3>
              <p className="text-muted-foreground">
                Our team is here to help you every step of your travel loan journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Join thousands of Ghanaians who trust us with their travel financing needs.
          </p>
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="h-14 px-8 bg-emerald hover:bg-emerald-light text-secondary-foreground font-semibold rounded-xl shadow-lg text-lg"
          >
            Sign In Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-emerald" />
              <span className="font-semibold text-foreground">Crepusculum Loan Manager</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Crepusculum Loan Manager. Made with ❤️ in Ghana.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
