import { describe, it, expect } from 'vitest';
import type { Row } from '@tanstack/react-table';
import type { EmployeeNormalized } from '../../types';
import {
  sortDateAsc,
  sortDateDesc,
  sortNumericAsc,
  sortNumericDesc,
} from './sortingUtils';

// Mock Row factory helper
function createMockRow(data: Record<string, any>): Row<EmployeeNormalized> {
  return {
    getValue: (columnId: string) => data[columnId],
  } as any;
}

describe('Sorting Utilities', () => {
  describe('Date Sorting', () => {
    const date1 = new Date(2024, 0, 15); // Jan 15, 2024
    const date2 = new Date(2024, 5, 20); // Jun 20, 2024
    const date3 = new Date(2025, 0, 1); // Jan 1, 2025

    it('should sort dates ascending correctly', () => {
      const rowA = createMockRow({ testDate: date2 });
      const rowB = createMockRow({ testDate: date1 });
      const result = sortDateAsc(rowA, rowB, 'testDate');
      expect(result).toBeGreaterThan(0); // date2 > date1, so should return positive
    });

    it('should sort dates descending correctly', () => {
      const rowA = createMockRow({ testDate: date1 });
      const rowB = createMockRow({ testDate: date2 });
      const result = sortDateDesc(rowA, rowB, 'testDate');
      expect(result).toBeGreaterThan(0); // date1 < date2, so should return positive (descending)
    });

    it('should handle equal dates', () => {
      const rowA = createMockRow({ testDate: date1 });
      const rowB = createMockRow({ testDate: date1 });
      expect(sortDateAsc(rowA, rowB, 'testDate')).toBe(0);
      expect(sortDateDesc(rowA, rowB, 'testDate')).toBe(0);
    });

    it('should place null dates at the end (ascending)', () => {
      const rowA = createMockRow({ testDate: null });
      const rowB = createMockRow({ testDate: date1 });
      const result = sortDateAsc(rowA, rowB, 'testDate');
      expect(result).toBeGreaterThan(0); // null should be after date
    });

    it('should place null dates at the end (descending)', () => {
      const rowA = createMockRow({ testDate: date1 });
      const rowB = createMockRow({ testDate: null });
      const result = sortDateDesc(rowA, rowB, 'testDate');
      expect(result).toBeLessThan(0); // date should be before null
    });

    it('should handle both nulls', () => {
      const rowA = createMockRow({ testDate: null });
      const rowB = createMockRow({ testDate: null });
      expect(sortDateAsc(rowA, rowB, 'testDate')).toBe(0);
      expect(sortDateDesc(rowA, rowB, 'testDate')).toBe(0);
    });
  });

  describe('Numeric Sorting', () => {
    it('should sort numbers ascending correctly', () => {
      const rowA = createMockRow({ allocation: 75 });
      const rowB = createMockRow({ allocation: 50 });
      const result = sortNumericAsc(rowA, rowB, 'allocation');
      expect(result).toBeGreaterThan(0); // 75 > 50
    });

    it('should sort numbers descending correctly', () => {
      const rowA = createMockRow({ allocation: 50 });
      const rowB = createMockRow({ allocation: 75 });
      const result = sortNumericDesc(rowA, rowB, 'allocation');
      expect(result).toBeGreaterThan(0); // reverse order for desc
    });

    it('should handle equal numbers', () => {
      const rowA = createMockRow({ allocation: 100 });
      const rowB = createMockRow({ allocation: 100 });
      expect(sortNumericAsc(rowA, rowB, 'allocation')).toBe(0);
      expect(sortNumericDesc(rowA, rowB, 'allocation')).toBe(0);
    });

    it('should place null values at the end (ascending)', () => {
      const rowA = createMockRow({ allocation: null });
      const rowB = createMockRow({ allocation: 50 });
      const result = sortNumericAsc(rowA, rowB, 'allocation');
      expect(result).toBeGreaterThan(0); // null should be after number
    });

    it('should place null values at the end (descending)', () => {
      const rowA = createMockRow({ allocation: 50 });
      const rowB = createMockRow({ allocation: null });
      const result = sortNumericDesc(rowA, rowB, 'allocation');
      expect(result).toBeLessThan(0); // number should be before null
    });

    it('should handle both nulls', () => {
      const rowA = createMockRow({ allocation: null });
      const rowB = createMockRow({ allocation: null });
      expect(sortNumericAsc(rowA, rowB, 'allocation')).toBe(0);
      expect(sortNumericDesc(rowA, rowB, 'allocation')).toBe(0);
    });

    it('should handle zero values correctly', () => {
      const rowA = createMockRow({ allocation: 0 });
      const rowB = createMockRow({ allocation: 50 });
      const result = sortNumericAsc(rowA, rowB, 'allocation');
      expect(result).toBeLessThan(0); // 0 < 50
    });

    it('should handle negative values correctly', () => {
      const rowA = createMockRow({ allocation: -10 });
      const rowB = createMockRow({ allocation: 0 });
      const result = sortNumericAsc(rowA, rowB, 'allocation');
      expect(result).toBeLessThan(0); // -10 < 0
    });
  });
});
