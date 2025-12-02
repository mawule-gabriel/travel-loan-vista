import { useState } from 'react';
import { Borrower } from '@/types/loan';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Eye, CreditCard, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BorrowerTableProps {
  borrowers: Borrower[];
  onView: (borrower: Borrower) => void;
  onRecordPayment: (borrower: Borrower) => void;
  onDownloadPdf: (borrower: Borrower) => void;
}

const ITEMS_PER_PAGE = 5;

export function BorrowerTable({ 
  borrowers, 
  onView, 
  onRecordPayment, 
  onDownloadPdf 
}: BorrowerTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(borrowers.length / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBorrowers = borrowers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Borrower
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ghana Card
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Loan Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Monthly
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedBorrowers.map((borrower) => (
              <tr key={borrower.id} className="table-row-hover">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={borrower.profilePhoto}
                      alt={borrower.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{borrower.name}</p>
                      <p className="text-sm text-muted-foreground">{borrower.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground font-mono">
                  {borrower.ghanaCard}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">
                  GHS {borrower.loanAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  GHS {borrower.monthlyPayment.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">
                  GHS {borrower.balance.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={borrower.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(borrower)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRecordPayment(borrower)}
                      className="text-emerald hover:text-emerald hover:bg-emerald/10"
                      disabled={borrower.status === 'completed'}
                    >
                      <CreditCard className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadPdf(borrower)}
                      className="text-gold hover:text-gold hover:bg-gold/10"
                    >
                      <FileDown className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {paginatedBorrowers.map((borrower) => (
          <div key={borrower.id} className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={borrower.profilePhoto}
                  alt={borrower.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{borrower.name}</p>
                  <p className="text-sm text-muted-foreground">{borrower.phone}</p>
                </div>
              </div>
              <StatusBadge status={borrower.status} size="sm" />
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Loan Amount</p>
                <p className="font-semibold">GHS {borrower.loanAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Balance</p>
                <p className="font-semibold">GHS {borrower.balance.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(borrower)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRecordPayment(borrower)}
                className="flex-1 text-emerald border-emerald/30 hover:bg-emerald/10"
                disabled={borrower.status === 'completed'}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownloadPdf(borrower)}
                className="text-gold border-gold/30 hover:bg-gold/10"
              >
                <FileDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, borrowers.length)} of {borrowers.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'w-8 h-8 p-0',
                  currentPage === page && 'bg-navy hover:bg-navy-light'
                )}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
