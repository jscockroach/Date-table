import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTablePagination } from './DataTablePagination';
import styles from './DataTablePagination.module.css';

function renderPagination(overrides: Partial<Parameters<typeof DataTablePagination>[0]> = {}) {
  const defaults = {
    total: 100,
    pageIndex: 0,
    pageSize: 25,
    pageCount: 4,
    currentCount: 25,
    setPageIndex: vi.fn(),
    setPageSize: vi.fn(),
  };
  const props = { ...defaults, ...overrides };
  const result = render(<DataTablePagination {...props} />);
  return { ...result, props };
}

describe('DataTablePagination', () => {
  describe('record count display', () => {
    it('shows total record count', () => {
      const { container } = renderPagination({ total: 100 });
      const p = container.querySelector(`.${styles.footerRow} p`);
      expect(p?.textContent).toContain('100');
    });

    it('shows "Showing 1-25" on first page with 25 results', () => {
      const { container } = renderPagination({ pageIndex: 0, pageSize: 25, currentCount: 25, total: 100 });
      const p = container.querySelector(`.${styles.footerRow} p`);
      expect(p?.textContent).toContain('1');
      expect(p?.textContent).toContain('25');
    });

    it('shows correct range on second page', () => {
      const { container } = renderPagination({ pageIndex: 1, pageSize: 25, currentCount: 25, total: 100 });
      const p = container.querySelector(`.${styles.footerRow} p`);
      expect(p?.textContent).toContain('26');
      expect(p?.textContent).toContain('50');
    });

    it('shows 0 when total is 0', () => {
      const { container } = renderPagination({ total: 0, currentCount: 0 });
      const p = container.querySelector(`.${styles.footerRow} p`);
      expect(p?.textContent).toContain('0');
    });

    it('clamps display to total when last page is partial', () => {
      // page 3 (0-indexed), pageSize 25, only 10 records remaining, total 85
      const { container } = renderPagination({
        pageIndex: 3,
        pageSize: 25,
        currentCount: 10,
        total: 85,
      });
      const p = container.querySelector(`.${styles.footerRow} p`);
      expect(p?.textContent).toContain('85');
    });
  });

  describe('page indicator', () => {
    it('shows "Page 1 of 4" on first page', () => {
      renderPagination({ pageIndex: 0, pageCount: 4 });
      expect(screen.getByText(/Page 1 of 4/)).toBeTruthy();
    });

    it('shows "Page 3 of 5" on third page of 5', () => {
      renderPagination({ pageIndex: 2, pageCount: 5 });
      expect(screen.getByText(/Page 3 of 5/)).toBeTruthy();
    });
  });

  describe('Previous button', () => {
    it('is disabled on the first page', () => {
      renderPagination({ pageIndex: 0 });
      const btn = screen.getByText('Previous') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    });

    it('is enabled on pages after the first', () => {
      renderPagination({ pageIndex: 1 });
      const btn = screen.getByText('Previous') as HTMLButtonElement;
      expect(btn.disabled).toBe(false);
    });

    it('calls setPageIndex with pageIndex - 1 when clicked', () => {
      const setPageIndex = vi.fn();
      renderPagination({ pageIndex: 2, setPageIndex });
      fireEvent.click(screen.getByText('Previous'));
      expect(setPageIndex).toHaveBeenCalledWith(1);
    });

    it('does not call setPageIndex when disabled (first page)', () => {
      const setPageIndex = vi.fn();
      renderPagination({ pageIndex: 0, setPageIndex });
      fireEvent.click(screen.getByText('Previous'));
      // Button is disabled so click should not trigger setPageIndex
      expect(setPageIndex).not.toHaveBeenCalled();
    });
  });

  describe('Next button', () => {
    it('is disabled on the last page', () => {
      renderPagination({ pageIndex: 3, pageCount: 4 });
      const btn = screen.getByText('Next') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    });

    it('is disabled when total is 0', () => {
      renderPagination({ total: 0, pageCount: 0 });
      const btn = screen.getByText('Next') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    });

    it('is enabled when not on last page', () => {
      renderPagination({ pageIndex: 1, pageCount: 4 });
      const btn = screen.getByText('Next') as HTMLButtonElement;
      expect(btn.disabled).toBe(false);
    });

    it('calls setPageIndex with pageIndex + 1 when clicked', () => {
      const setPageIndex = vi.fn();
      renderPagination({ pageIndex: 1, pageCount: 4, setPageIndex });
      fireEvent.click(screen.getByText('Next'));
      expect(setPageIndex).toHaveBeenCalledWith(2);
    });
  });

  describe('page size selector', () => {
    it('renders a select element with page size options', () => {
      renderPagination();
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select).toBeTruthy();
    });

    it('shows current pageSize as selected', () => {
      renderPagination({ pageSize: 50 });
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('50');
    });

    it('calls setPageSize with number value on change', () => {
      const setPageSize = vi.fn();
      renderPagination({ setPageSize });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '50' } });
      expect(setPageSize).toHaveBeenCalledWith(50);
    });

    it('supports 25, 50, and 100 options', () => {
      renderPagination();
      const select = screen.getByRole('combobox');
      const options = Array.from((select as HTMLSelectElement).options).map((o) => o.value);
      expect(options).toContain('25');
      expect(options).toContain('50');
      expect(options).toContain('100');
    });
  });
});
