import { useState } from 'react';
import type { BorrowerSummaryResponse } from '@/types/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Eye, CreditCard, FileDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BorrowerTableProps {
  borrowers: BorrowerSummaryResponse[];
  onView: (borrower: BorrowerSummaryResponse) => void;
  onRecordPayment: (borrower: BorrowerSummaryResponse) => void;
  onDownloadPdf: (borrower: BorrowerSummaryResponse) => void;
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
    <div className="bg-white/90 dark:bg-slate-900/90 rounded-[32px] overflow-hidden shadow-elevated border-none animate-slide-up backdrop-blur-3xl" style={{ animationDelay: '0.2s' }}>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-black/10">
              <th className="px-10 py-7 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                Borrower
              </th>
              <th className="px-6 py-7 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                ID Number
              </th>
              <th className="px-6 py-7 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                Loan Amount
              </th>
              <th className="px-6 py-7 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                Installment
              </th>
              <th className="px-6 py-7 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                Balance
              </th>
              <th className="px-6 py-7 text-left text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                Status
              </th>
              <th className="px-10 py-7 text-right text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800/30">
            {paginatedBorrowers.map((borrower, index) => (
              <tr
                key={borrower.id}
                className="table-row-hover group"
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <td className="px-10 py-6">
                  <div className="flex items-center gap-5">
                    <div className="relative group/avatar">
                      <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover/avatar:opacity-30 transition-opacity blur-[4px]" />
                      <img
                        src={borrower.profilePictureUrl || '/placeholder.svg'}
                        alt={borrower.fullName}
                        className="relative w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-md group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <p className="font-black text-lg text-foreground group-hover:text-primary transition-colors tracking-tight leading-tight">{borrower.fullName}</p>
                      <p className="text-xs font-bold text-muted-foreground/60 mt-0.5">{borrower.phoneNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm font-mono font-bold text-muted-foreground/80 tracking-tighter">
                  {borrower.ghanaCardNumber}
                </td>
                <td className="px-6 py-6">
                  <span className="text-sm font-black text-foreground bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl shadow-sm border border-white/50 dark:border-slate-700/50">
                    GHS {borrower.loanAmount.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-6 text-sm font-bold text-muted-foreground/70">
                  GHS {borrower.monthlyPayment.toLocaleString()}
                </td>
                <td className="px-6 py-6">
                  <span className={cn(
                    "text-base font-black tracking-tight",
                    borrower.balance > 0 ? "text-foreground" : "text-emerald-500"
                  )}>
                    GHS {borrower.balance.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <StatusBadge status={borrower.status} className="shadow-sm inner-glow border-0 px-4 py-1.5" />
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(borrower)}
                      className="h-10 w-10 rounded-full hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold transition-all shadow-sm"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-all shadow-sm">
                          <MoreHorizontal className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-90 transition-transform" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-panel border-white/20 backdrop-blur-3xl p-2 rounded-2xl shadow-float animate-in fade-in zoom-in duration-300">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 py-2">Quick Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(borrower)} className="cursor-pointer rounded-xl py-2.5 px-3 font-bold group">
                          <Eye className="w-4 h-4 mr-2 text-indigo-500 transition-transform group-hover:scale-110" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownloadPdf(borrower)} className="cursor-pointer rounded-xl py-2.5 px-3 font-bold group">
                          <FileDown className="w-4 h-4 mr-2 text-amber-500 transition-transform group-hover:scale-110" />
                          Download schedule
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-gray-100/50 dark:bg-slate-800/50" />
                        <DropdownMenuItem
                          onClick={() => onRecordPayment(borrower)}
                          disabled={borrower.status === 'Completed'}
                          className="cursor-pointer text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 rounded-xl py-2.5 px-3 font-bold group"
                        >
                          <CreditCard className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                          Record payment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (Truly Premium) */}
      <div className="lg:hidden space-y-4 p-6 bg-slate-50/50 dark:bg-black/10">
        {paginatedBorrowers.map((borrower) => (
          <div key={borrower.id} className="bg-white/95 dark:bg-slate-900/95 p-6 rounded-[28px] relative overflow-hidden group shadow-elevated border border-white dark:border-slate-800 transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="relative flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={borrower.profilePictureUrl || '/placeholder.png'}
                  alt={borrower.fullName}
                  className="w-16 h-16 rounded-[20px] object-cover ring-4 ring-white/50 shadow-lg"
                />
                <div>
                  <h3 className="font-black text-xl text-foreground tracking-tight">{borrower.fullName}</h3>
                  <p className="text-xs font-bold text-muted-foreground/70">{borrower.phoneNumber}</p>
                </div>
              </div>
              <StatusBadge status={borrower.status} size="sm" className="rounded-xl px-3 py-1 font-black shadow-sm inner-glow" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-white dark:border-white/5">
                <p className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-[0.15em] mb-1.5">Original Loan</p>
                <p className="font-black text-lg text-foreground">GHS {borrower.loanAmount.toLocaleString()}</p>
              </div>
              <div className="bg-indigo-50/30 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/20">
                <p className="text-[9px] uppercase font-black text-primary tracking-[0.15em] mb-1.5">Current Balance</p>
                <p className="font-black text-xl text-primary tracking-tighter">GHS {borrower.balance.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-2xl bg-white dark:bg-slate-800 font-bold border-slate-200 dark:border-slate-700 shadow-sm"
                onClick={() => onDownloadPdf(borrower)}
              >
                <FileDown className="w-5 h-5 mr-2 text-amber-600" />
                Schedule
              </Button>
              <Button
                className="flex-1 h-12 btn-primary rounded-2xl font-black shadow-lg shadow-indigo-500/20"
                onClick={() => onRecordPayment(borrower)}
                disabled={borrower.status === 'Completed'}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pay
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Glass Pagination */}
      {totalPages > 1 && (
        <div className="px-10 py-7 border-t border-gray-100 dark:border-slate-800/50 flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-3xl">
          <p className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
            Page <span className="text-foreground font-black">{currentPage}</span> of {totalPages}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl h-11 w-11 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 border-slate-200 dark:border-slate-700 shadow-sm transition-all"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="hidden sm:flex items-center gap-2 bg-slate-100/50 dark:bg-black/30 rounded-[20px] p-1.5 border border-white dark:border-white/5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'h-8 w-10 rounded-xl text-xs font-black transition-all duration-500',
                    currentPage === page
                      ? 'bg-white dark:bg-slate-700 shadow-lg text-primary scale-110 z-10'
                      : 'text-muted-foreground/60 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-foreground'
                  )}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl h-11 w-11 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 border-slate-200 dark:border-slate-700 shadow-sm transition-all"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
