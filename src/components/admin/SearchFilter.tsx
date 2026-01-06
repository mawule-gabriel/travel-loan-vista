import { Search } from 'lucide-react';
import { LoanStatus } from '@/types/loan';
import { cn } from '@/lib/utils';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: LoanStatus | 'all';
  onStatusChange: (status: LoanStatus | 'all') => void;
}

const statusFilters: { value: LoanStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'On Track', label: 'On Track' },
  { value: 'Delayed', label: 'Delayed' },
  { value: 'Completed', label: 'Completed' },
];

export function SearchFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-5 mb-8 items-start md:items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 w-full md:max-w-md group">
        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-indigo-600 group-focus-within:scale-110 transition-all duration-300" />
        <input
          type="text"
          placeholder="Search borrowers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-modern pl-12 pr-4 bg-white/70 focus:bg-white shadow-sm border-gray-100 focus:border-indigo-200"
        />
      </div>

      {/* Status Filter */}
      <div className="flex p-1.5 gap-1 bg-slate-100/80 dark:bg-slate-800/50 rounded-2xl overflow-x-auto w-full md:w-auto shadow-inner">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={cn(
              'px-5 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-500 flex-1 md:flex-none text-center',
              statusFilter === filter.value
                ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-elevated scale-[1.05] z-10'
                : 'text-muted-foreground/60 hover:text-foreground hover:bg-white/40 dark:hover:bg-slate-700/50'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
