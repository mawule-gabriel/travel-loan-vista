import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plane, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  userType: 'admin' | 'borrower';
  userName?: string;
  onLogout: () => void;
}

export function Navbar({ userType, userName = 'User', onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/borrowers', label: 'Borrowers' },
    { href: '/admin/register', label: 'New Loan' },
  ];

  const borrowerLinks = [
    { href: '/borrower', label: 'Dashboard' },
    { href: '#payment-timeline', label: 'Payment History' },
  ];

  const links = userType === 'admin' ? adminLinks : borrowerLinks;

  return (
    <nav className="sticky top-0 z-50 bg-[#1E293B] border-b border-white/5 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-white group">
            <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">Crepusculum Loan Manager</span>
            <span className="font-bold text-xl tracking-tight sm:hidden">CLM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isAnchor = link.href.startsWith('#');
              return isAnchor ? (
                <button
                  key={link.href}
                  onClick={() => {
                    const element = document.getElementById(link.href.substring(1));
                    if (element) {
                      const offset = 80; // Height of the fixed header
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = element.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="text-sm font-bold tracking-wide text-white/70 hover:text-white transition-all duration-300"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'text-sm font-bold tracking-wide transition-all duration-300',
                    location.pathname === link.href
                      ? 'text-emerald-400'
                      : 'text-white/70 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col text-left">
                {userType === 'admin' && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80 leading-none mb-1">
                    Admin
                  </span>
                )}
                <span className="text-sm font-bold leading-none text-white whitespace-nowrap">{userName}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-white/5 animate-fade-in">
            <div className="flex flex-col gap-2">
              {links.map((link) => {
                const isAnchor = link.href.startsWith('#');
                return isAnchor ? (
                  <button
                    key={link.href}
                    onClick={() => {
                      setIsOpen(false);
                      const element = document.getElementById(link.href.substring(1));
                      if (element) {
                        const offset = 80;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = element.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:bg-white/5 hover:text-white text-left transition-all"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-bold transition-all',
                      location.pathname === link.href
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="h-px bg-white/5 my-2" />
              <button
                onClick={onLogout}
                className="px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:bg-white/5 hover:text-white text-left flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
