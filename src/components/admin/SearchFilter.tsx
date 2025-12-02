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
  { value: 'on-track', label: 'On Track' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'completed', label: 'Completed' },
];

export function SearchFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, phone, or Ghana Card..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200',
              statusFilter === filter.value
                ? 'bg-navy text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
