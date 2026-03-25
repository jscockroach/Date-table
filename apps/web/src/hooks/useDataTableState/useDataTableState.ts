import { useCallback, useState } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { type FilterState, createDefaultFilterState } from '../../utils';

interface DataTableState {
  sorting: SortingState;
  pageIndex: number;
  pageSize: number;
  filters: FilterState;
}

interface UseDataTableStateReturn extends DataTableState {
  setSorting: (sorting: SortingState) => void;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: FilterState) => void;
  setTextSearch: (query: string) => void;
  setDateRangeFilter: (fromDate: Date | null, toDate: Date | null) => void;
  resetFilters: () => void;
}

/**
 * Custom hook for managing DataTable state: sorting, pagination, filtering.
 * Resets pageIndex to 0 when sorting or filters change.
 * Resets sorting when filters change (new filter results may have different sort relevance).
 */
export function useDataTableState(): UseDataTableStateReturn {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState<FilterState>(createDefaultFilterState());

  const handleSetSorting = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
    setPageIndex(0); // Reset to first page on sort change
  }, []);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setPageIndex(0); // Reset to first page on page size change
  }, []);

  const handleSetFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPageIndex(0); // Reset to first page when filters change
    setSorting([]); // Clear sorting when filters change
  }, []);

  const handleSetTextSearch = useCallback((query: string) => {
    if (filters.textSearch === query) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      textSearch: query,
    }));
    setPageIndex(0);
  }, [filters.textSearch]);

  const handleSetDateRangeFilter = useCallback((fromDate: Date | null, toDate: Date | null) => {
    const fromUnchanged =
      filters.startDateFrom?.getTime() === fromDate?.getTime();
    const toUnchanged =
      filters.startDateTo?.getTime() === toDate?.getTime();

    if (fromUnchanged && toUnchanged) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      startDateFrom: fromDate,
      startDateTo: toDate,
    }));
    setPageIndex(0);
  }, [filters.startDateFrom, filters.startDateTo]);

  const resetFilters = useCallback(() => {
    setSorting([]);
    setPageIndex(0);
    setPageSize(25);
    setFilters(createDefaultFilterState());
  }, []);

  return {
    sorting,
    pageIndex,
    pageSize,
    filters,
    setSorting: handleSetSorting,
    setPageIndex,
    setPageSize: handleSetPageSize,
    setFilters: handleSetFilters,
    setTextSearch: handleSetTextSearch,
    setDateRangeFilter: handleSetDateRangeFilter,
    resetFilters,
  };
}
