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
    { href: '/borrower', label: 'My Dashboard' },
    { href: '/borrower/history', label: 'Payment History' },
  ];

  const links = userType === 'admin' ? adminLinks : borrowerLinks;

  return (
    <nav className="sticky top-0 z-50 bg-navy shadow-lg">
      {/* Kente accent line */}
      <div className="h-1 bg-gradient-to-r from-gold via-emerald to-gold" />
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-foreground">
            <div className="p-2 bg-emerald rounded-lg">
              <Plane className="w-5 h-5 text-secondary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:block">Crepusculum Loan Manager</span>
            <span className="font-bold text-lg sm:hidden">CLM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-emerald',
                  location.pathname === link.href
                    ? 'text-emerald'
                    : 'text-primary-foreground/80'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary-foreground">
              <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald" />
              </div>
              <span className="text-sm font-medium">{userName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/10 animate-fade-in">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === link.href
                      ? 'bg-emerald/20 text-emerald'
                      : 'text-primary-foreground/80 hover:bg-primary-foreground/10'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 text-left flex items-center gap-2"
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
