import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDataTableState } from './useDataTableState';

describe('useDataTableState', () => {
  describe('initial state', () => {
    it('initializes sorting as empty array', () => {
      const { result } = renderHook(() => useDataTableState());
      expect(result.current.sorting).toEqual([]);
    });

    it('initializes pageIndex as 0', () => {
      const { result } = renderHook(() => useDataTableState());
      expect(result.current.pageIndex).toBe(0);
    });

    it('initializes pageSize as 25', () => {
      const { result } = renderHook(() => useDataTableState());
      expect(result.current.pageSize).toBe(25);
    });

    it('initializes filters with empty textSearch', () => {
      const { result } = renderHook(() => useDataTableState());
      expect(result.current.filters.textSearch).toBe('');
    });

    it('initializes filters with null date range', () => {
      const { result } = renderHook(() => useDataTableState());
      expect(result.current.filters.startDateFrom).toBeNull();
      expect(result.current.filters.startDateTo).toBeNull();
    });
  });

  describe('setSorting', () => {
    it('updates the sorting state', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => {
        result.current.setSorting([{ id: 'employeeName', desc: false }]);
      });
      expect(result.current.sorting).toEqual([{ id: 'employeeName', desc: false }]);
    });

    it('resets pageIndex to 0 when sorting changes', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setPageIndex(4); });
      act(() => { result.current.setSorting([{ id: 'project', desc: true }]); });
      expect(result.current.pageIndex).toBe(0);
    });

    it('supports multi-column sorting', () => {
      const { result } = renderHook(() => useDataTableState());
      const multiSort = [
        { id: 'employeeName', desc: false },
        { id: 'startDate', desc: true },
      ];
      act(() => { result.current.setSorting(multiSort); });
      expect(result.current.sorting).toHaveLength(2);
      expect(result.current.sorting[1].id).toBe('startDate');
    });

    it('clears sorting when set to empty array', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setSorting([{ id: 'project', desc: false }]); });
      act(() => { result.current.setSorting([]); });
      expect(result.current.sorting).toEqual([]);
    });
  });

  describe('setPageIndex', () => {
    it('updates pageIndex to given value', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setPageIndex(7); });
      expect(result.current.pageIndex).toBe(7);
    });

    it('does not affect sorting or filters', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setSorting([{ id: 'project', desc: false }]); });
      act(() => { result.current.setTextSearch('Alice'); });
      act(() => { result.current.setPageIndex(3); });
      expect(result.current.sorting).toHaveLength(1);
      expect(result.current.filters.textSearch).toBe('Alice');
    });
  });

  describe('setPageSize', () => {
    it('updates pageSize', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setPageSize(50); });
      expect(result.current.pageSize).toBe(50);
    });

    it('resets pageIndex to 0 when page size changes', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setPageIndex(5); });
      act(() => { result.current.setPageSize(100); });
      expect(result.current.pageIndex).toBe(0);
    });

    it('supports setting pageSize to 100', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setPageSize(100); });
      expect(result.current.pageSize).toBe(100);
    });
  });

  describe('setTextSearch', () => {
    it('updates textSearch in filters', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setTextSearch('Alice'); });
      expect(result.current.filters.textSearch).toBe('Alice');
    });

    it('resets pageIndex to 0 when search changes', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setPageIndex(3); });
      act(() => { result.current.setTextSearch('Bob'); });
      expect(result.current.pageIndex).toBe(0);
    });

    it('does not affect date range filters', () => {
      const { result } = renderHook(() => useDataTableState());
      const from = new Date(2024, 0, 1);
      act(() => { result.current.setDateRangeFilter(from, null); });
      act(() => { result.current.setTextSearch('test'); });
      expect(result.current.filters.startDateFrom).toEqual(from);
    });
  });

  describe('setDateRangeFilter', () => {
    it('updates startDateFrom and startDateTo', () => {
      const { result } = renderHook(() => useDataTableState());
      const from = new Date(2024, 0, 1);
      const to = new Date(2024, 11, 31);
      act(() => { result.current.setDateRangeFilter(from, to); });
      expect(result.current.filters.startDateFrom).toEqual(from);
      expect(result.current.filters.startDateTo).toEqual(to);
    });

    it('resets pageIndex to 0', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setPageIndex(4); });
      act(() => { result.current.setDateRangeFilter(new Date(), null); });
      expect(result.current.pageIndex).toBe(0);
    });

    it('accepts null values to clear date range', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setDateRangeFilter(new Date(), new Date()); });
      act(() => { result.current.setDateRangeFilter(null, null); });
      expect(result.current.filters.startDateFrom).toBeNull();
      expect(result.current.filters.startDateTo).toBeNull();
    });

    it('does not affect textSearch', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setTextSearch('Project X'); });
      act(() => { result.current.setDateRangeFilter(new Date(), null); });
      expect(result.current.filters.textSearch).toBe('Project X');
    });
  });

  describe('setFilters', () => {
    it('replaces the entire filters object', () => {
      const { result } = renderHook(() => useDataTableState());
      const newFilters = {
        textSearch: 'new search',
        startDateFrom: new Date(2024, 0, 1),
        startDateTo: null,
      };
      act(() => { result.current.setFilters(newFilters); });
      expect(result.current.filters.textSearch).toBe('new search');
      expect(result.current.filters.startDateFrom).toEqual(new Date(2024, 0, 1));
    });

    it('resets pageIndex to 0', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setPageIndex(3); });
      act(() => {
        result.current.setFilters({ textSearch: 'x', startDateFrom: null, startDateTo: null });
      });
      expect(result.current.pageIndex).toBe(0);
    });

    it('clears sorting', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setSorting([{ id: 'project', desc: false }]); });
      act(() => {
        result.current.setFilters({ textSearch: '', startDateFrom: null, startDateTo: null });
      });
      expect(result.current.sorting).toEqual([]);
    });
  });

  describe('resetFilters', () => {
    it('resets sorting to empty array', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setSorting([{ id: 'name', desc: true }]); });
      act(() => { result.current.resetFilters(); });
      expect(result.current.sorting).toEqual([]);
    });

    it('resets pageIndex to 0', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setPageIndex(10); });
      act(() => { result.current.resetFilters(); });
      expect(result.current.pageIndex).toBe(0);
    });

    it('resets pageSize to 25', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setPageSize(100); });
      act(() => { result.current.resetFilters(); });
      expect(result.current.pageSize).toBe(25);
    });

    it('resets textSearch to empty string', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setTextSearch('hello world'); });
      act(() => { result.current.resetFilters(); });
      expect(result.current.filters.textSearch).toBe('');
    });

    it('resets date range to null', () => {
      const { result } = renderHook(() => useDataTableState());
      act(() => { result.current.setDateRangeFilter(new Date(), new Date()); });
      act(() => { result.current.resetFilters(); });
      expect(result.current.filters.startDateFrom).toBeNull();
      expect(result.current.filters.startDateTo).toBeNull();
    });
  });
});
