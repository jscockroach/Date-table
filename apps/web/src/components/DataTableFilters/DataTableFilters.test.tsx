import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataTableFilters } from './DataTableFilters';
import { createDefaultFilterState } from '../../utils';

const defaultFilters = createDefaultFilterState();

describe('DataTableFilters', () => {
  describe('search input', () => {
    it('renders a search input with placeholder', () => {
      render(
        <DataTableFilters
          filters={defaultFilters}
          setTextSearch={vi.fn()}
          setDateRangeFilter={vi.fn()}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );
      expect(screen.getByPlaceholderText(/search by name or project/i)).toBeTruthy();
    });

    it('shows current textSearch value in the input', () => {
      const filters = { ...defaultFilters, textSearch: 'Alice' };
      render(
        <DataTableFilters
          filters={filters}
          setTextSearch={vi.fn()}
          setDateRangeFilter={vi.fn()}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );
      const input = screen.getByPlaceholderText(/search by name or project/i) as HTMLInputElement;
      expect(input.value).toBe('Alice');
    });

    it('calls setTextSearch with the new value after 300ms debounce', async () => {
      const setTextSearch = vi.fn();
      render(
        <DataTableFilters
          filters={defaultFilters}
          setTextSearch={setTextSearch}
          setDateRangeFilter={vi.fn()}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );

      setTextSearch.mockClear();

      fireEvent.change(screen.getByPlaceholderText(/search by name or project/i), {
        target: { value: 'Bob' },
      });

      await waitFor(() => {
        expect(setTextSearch).toHaveBeenCalledWith('Bob');
      });
    });

    it('calls setTextSearch with empty string when cleared after debounce', async () => {
      const setTextSearch = vi.fn();
      const filters = { ...defaultFilters, textSearch: 'Bob' };
      render(
        <DataTableFilters
          filters={filters}
          setTextSearch={setTextSearch}
          setDateRangeFilter={vi.fn()}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );

      setTextSearch.mockClear();

      fireEvent.change(screen.getByPlaceholderText(/search by name or project/i), {
        target: { value: '' },
      });

      await waitFor(() => {
        expect(setTextSearch).toHaveBeenCalledWith('');
      });
    });

    it('renders debounced hint text', () => {
      render(
        <DataTableFilters
          filters={defaultFilters}
          setTextSearch={vi.fn()}
          setDateRangeFilter={vi.fn()}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );
      expect(screen.getByText('Debounced input, case-insensitive')).toBeTruthy();
    });
  });

  describe('date range inputs', () => {
    it('renders Start Date From label', () => {
      render(
        <DataTableFilters
          filters={defaultFilters}
          setTextSearch={vi.fn()}
          setDateRangeFilter={vi.fn()}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );
      expect(screen.getByText('Start Date From')).toBeTruthy();
    });

    it('renders Start Date To label', () => {
      render(
        <DataTableFilters
          filters={defaultFilters}
          setTextSearch={vi.fn()}
          setDateRangeFilter={vi.fn()}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );
      expect(screen.getByText('Start Date To')).toBeTruthy();
    });

    it('renders two date inputs', () => {
      const { container } = render(
        <DataTableFilters
          filters={defaultFilters}
          setTextSearch={vi.fn()}
          setDateRangeFilter={vi.fn()}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );
      const dateInputs = container.querySelectorAll('input[type="date"]');
      expect(dateInputs).toHaveLength(2);
    });

    it('calls setDateRangeFilter with a Date when from date is set', () => {
      const setDateRangeFilter = vi.fn();
      const { container } = render(
        <DataTableFilters
          filters={defaultFilters}
          setTextSearch={vi.fn()}
          setDateRangeFilter={setDateRangeFilter}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );
      const [fromInput] = container.querySelectorAll('input[type="date"]');
      fireEvent.change(fromInput, { target: { value: '2024-01-15' } });
      expect(setDateRangeFilter).toHaveBeenCalledWith(expect.any(Date), null);
    });

    it('calls setDateRangeFilter with null when from date is cleared', () => {
      const setDateRangeFilter = vi.fn();
      const filters = { ...defaultFilters, startDateFrom: new Date(2024, 0, 15) };
      const { container } = render(
        <DataTableFilters
          filters={filters}
          setTextSearch={vi.fn()}
          setDateRangeFilter={setDateRangeFilter}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );
      const [fromInput] = container.querySelectorAll('input[type="date"]');
      fireEvent.change(fromInput, { target: { value: '' } });
      expect(setDateRangeFilter).toHaveBeenCalledWith(null, null);
    });

    it('calls setDateRangeFilter with a Date when to date is set', () => {
      const setDateRangeFilter = vi.fn();
      const { container } = render(
        <DataTableFilters
          filters={defaultFilters}
          setTextSearch={vi.fn()}
          setDateRangeFilter={setDateRangeFilter}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );
      const dateInputs = container.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[1], { target: { value: '2024-12-31' } });
      expect(setDateRangeFilter).toHaveBeenCalledWith(null, expect.any(Date));
    });

    it('preserves existing from date when only to date changes', () => {
      const setDateRangeFilter = vi.fn();
      const from = new Date(2024, 0, 1);
      const filters = { ...defaultFilters, startDateFrom: from };
      const { container } = render(
        <DataTableFilters
          filters={filters}
          setTextSearch={vi.fn()}
          setDateRangeFilter={setDateRangeFilter}
          onClearFilters={vi.fn()}
          onExportCSV={vi.fn()}
        />
      );
      const dateInputs = container.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[1], { target: { value: '2024-06-30' } });
      expect(setDateRangeFilter).toHaveBeenCalledWith(from, expect.any(Date));
    });
  });
});
