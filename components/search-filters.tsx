'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SearchFilters, RequestStatus, RequestPriority, SLAStatus } from '@/lib/types';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const statusOptions: { value: RequestStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'pending-review', label: 'Pending Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
];

const priorityOptions: { value: RequestPriority; label: string }[] = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Low' },
];

const slaOptions: { value: SLAStatus; label: string }[] = [
  { value: 'breached', label: 'Breached' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'on-track', label: 'On Track' },
];

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleStatus = (status: RequestStatus) => {
    const currentStatuses = filters.statuses || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];
    updateFilters({ statuses: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const togglePriority = (priority: RequestPriority) => {
    const currentPriorities = filters.priorities || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter((p) => p !== priority)
      : [...currentPriorities, priority];
    updateFilters({ priorities: newPriorities.length > 0 ? newPriorities : undefined });
  };

  const toggleSLA = (sla: SLAStatus) => {
    const currentSLAs = filters.slaStatuses || [];
    const newSLAs = currentSLAs.includes(sla)
      ? currentSLAs.filter((s) => s !== sla)
      : [...currentSLAs, sla];
    updateFilters({ slaStatuses: newSLAs.length > 0 ? newSLAs : undefined });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = [
    filters.query,
    filters.statuses?.length,
    filters.priorities?.length,
    filters.slaStatuses?.length,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search requests by title, client, or ID..."
            value={filters.query || ''}
            onChange={(e) => updateFilters({ query: e.target.value || undefined })}
            className="pl-9"
          />
        </div>

        {/* Advanced Filters */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            {statusOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={filters.statuses?.includes(option.value) || false}
                onCheckedChange={() => toggleStatus(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            {priorityOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={filters.priorities?.includes(option.value) || false}
                onCheckedChange={() => togglePriority(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Filter by SLA Status</DropdownMenuLabel>
            {slaOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={filters.slaStatuses?.includes(option.value) || false}
                onCheckedChange={() => toggleSLA(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.statuses?.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              Status: {statusOptions.find((o) => o.value === status)?.label}
              <button onClick={() => toggleStatus(status)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.priorities?.map((priority) => (
            <Badge key={priority} variant="secondary" className="gap-1">
              Priority: {priorityOptions.find((o) => o.value === priority)?.label}
              <button onClick={() => togglePriority(priority)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.slaStatuses?.map((sla) => (
            <Badge key={sla} variant="secondary" className="gap-1">
              SLA: {slaOptions.find((o) => o.value === sla)?.label}
              <button onClick={() => toggleSLA(sla)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
