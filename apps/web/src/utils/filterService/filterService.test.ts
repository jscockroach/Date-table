import { describe, it, expect } from 'vitest';
import { textSearchFilter, dateRangeFilter, applyFilters, filterEmployees, createDefaultFilterState } from './filterService';
import { EmployeeNormalized } from '../../types';

/**
 * Mock helper to create test employee records
 */
function createMockEmployee(overrides: Partial<EmployeeNormalized> = {}): EmployeeNormalized {
  return {
    employeeId: '1',
    employeeName: 'John Doe',
    project: 'Project Alpha',
    allocation: 75,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    status: 'active',
    ...overrides,
  };
}

describe('Filter Service', () => {
  describe('textSearchFilter', () => {
    const testData: EmployeeNormalized[] = [
      createMockEmployee({ employeeId: '1', employeeName: 'Alice Johnson', project: 'Frontend' }),
      createMockEmployee({ employeeId: '2', employeeName: 'Bob Smith', project: 'Backend' }),
      createMockEmployee({ employeeId: '3', employeeName: 'Charlie Davis', project: 'DevOps' }),
      createMockEmployee({ employeeId: '4', employeeName: 'Diana Frontend', project: 'Mobile' }),
    ];

    it('should return all records when query is empty', () => {
      const result = textSearchFilter(testData, '');
      expect(result).toHaveLength(4);
    });

    it('should filter by employee name (case-insensitive)', () => {
      const result = textSearchFilter(testData, 'alice');
      expect(result).toHaveLength(1);
      expect(result[0].employeeName).toBe('Alice Johnson');
    });

    it('should filter by project name (case-insensitive)', () => {
      const result = textSearchFilter(testData, 'frontend');
      expect(result).toHaveLength(2);
      expect(result[0].project).toBe('Frontend');
      expect(result[1].employeeName).toBe('Diana Frontend');
    });

    it('should handle partial matches', () => {
      const result = textSearchFilter(testData, 'son');
      expect(result).toHaveLength(1); // Johnson (Smith does not contain 'son')
      expect(result[0].employeeName).toBe('Alice Johnson');
    });

    it('should trim whitespace from query', () => {
      const result = textSearchFilter(testData, '  bob  ');
      expect(result).toHaveLength(1);
      expect(result[0].employeeName).toBe('Bob Smith');
    });

    it('should return no records for non-matching query', () => {
      const result = textSearchFilter(testData, 'nonexistent');
      expect(result).toHaveLength(0);
    });

    it('should be case-insensitive', () => {
      const result1 = textSearchFilter(testData, 'ALICE');
      const result2 = textSearchFilter(testData, 'alice');
      const result3 = textSearchFilter(testData, 'AlIcE');
      expect(result1).toHaveLength(1);
      expect(result2).toHaveLength(1);
      expect(result3).toHaveLength(1);
    });
  });

  describe('dateRangeFilter', () => {
    const testData: EmployeeNormalized[] = [
      createMockEmployee({
        employeeId: '1',
        employeeName: 'Early Bird',
        startDate: new Date('2024-01-01'),
      }),
      createMockEmployee({
        employeeId: '2',
        employeeName: 'Mid Range',
        startDate: new Date('2024-06-15'),
      }),
      createMockEmployee({
        employeeId: '3',
        employeeName: 'Late Starter',
        startDate: new Date('2024-12-01'),
      }),
      createMockEmployee({
        employeeId: '4',
        employeeName: 'No Date',
        startDate: null,
      }),
    ];

    it('should return all records when no date filters set', () => {
      const result = dateRangeFilter(testData, null, null);
      expect(result).toHaveLength(4); // All records, including null date
    });

    it('should filter by from date (inclusive)', () => {
      const result = dateRangeFilter(testData, new Date('2024-06-01'), null);
      expect(result).toHaveLength(2); // Mid Range, Late Starter
      expect(result[0].employeeName).toBe('Mid Range');
    });

    it('should filter by to date (inclusive)', () => {
      const result = dateRangeFilter(testData, null, new Date('2024-06-30'));
      expect(result).toHaveLength(2); // Early Bird, Mid Range (includes 2024-06-15)
    });

    it('should filter by both from and to dates (inclusive range)', () => {
      const result = dateRangeFilter(
        testData,
        new Date('2024-06-01'),
        new Date('2024-09-30')
      );
      expect(result).toHaveLength(1);
      expect(result[0].employeeName).toBe('Mid Range');
    });

    it('should exclude employees with null start date', () => {
      const result = dateRangeFilter(testData, new Date('2024-01-01'), null);
      expect(result).toHaveLength(3); // All with dates
      expect(result.some((e) => e.employeeName === 'No Date')).toBe(false);
    });

    it('should handle exact date match', () => {
      const result = dateRangeFilter(
        testData,
        new Date('2024-06-15'),
        new Date('2024-06-15')
      );
      expect(result).toHaveLength(1);
      expect(result[0].employeeName).toBe('Mid Range');
    });

    it('should exclude dates outside range', () => {
      const result = dateRangeFilter(
        testData,
        new Date('2024-07-01'),
        new Date('2024-11-30')
      );
      expect(result).toHaveLength(0);
    });
  });

  describe('applyFilters', () => {
    const testData: EmployeeNormalized[] = [
      createMockEmployee({
        employeeId: '1',
        employeeName: 'Alice Johnson',
        project: 'Frontend',
        startDate: new Date('2024-01-15'),
      }),
      createMockEmployee({
        employeeId: '2',
        employeeName: 'Bob Smith',
        project: 'Backend',
        startDate: new Date('2024-06-01'),
      }),
      createMockEmployee({
        employeeId: '3',
        employeeName: 'Charlie Frontend',
        project: 'Mobile',
        startDate: new Date('2024-09-01'),
      }),
    ];

    it('should apply both text and date filters', () => {
      const result = applyFilters(testData, {
        textSearch: 'Frontend',
        startDateFrom: new Date('2024-01-01'),
        startDateTo: new Date('2024-08-31'),
      });
      expect(result).toHaveLength(1);
      expect(result[0].employeeName).toBe('Alice Johnson');
    });

    it('should handle filters with no matches', () => {
      const result = applyFilters(testData, {
        textSearch: 'nonexistent',
        startDateFrom: null,
        startDateTo: null,
      });
      expect(result).toHaveLength(0);
    });

    it('should return all data when all filters cleared', () => {
      const result = applyFilters(testData, {
        textSearch: '',
        startDateFrom: null,
        startDateTo: null,
      });
      expect(result).toHaveLength(3);
    });

    it('should apply text search first, then date filter', () => {
      // Search for "Frontend", then filter by date range
      const result = applyFilters(testData, {
        textSearch: 'Frontend',
        startDateFrom: new Date('2024-09-01'),
        startDateTo: null,
      });
      // Charlie Frontend matches text search, but date is 2024-09-01 (passes filter)
      expect(result).toHaveLength(1);
      expect(result[0].employeeName).toBe('Charlie Frontend');
    });

    it('should return empty array when text matches but date does not', () => {
      const result = applyFilters(testData, {
        textSearch: 'Alice',
        startDateFrom: new Date('2024-06-01'),
        startDateTo: null,
      });
      expect(result).toHaveLength(0); // Alice has date 2024-01-15, before 2024-06-01
    });
  });

  describe('filterEmployees', () => {
    const testData: EmployeeNormalized[] = [
      createMockEmployee({
        employeeId: '1',
        employeeName: 'Alice Johnson',
        project: 'Frontend',
        startDate: new Date('2024-01-15'),
      }),
      createMockEmployee({
        employeeId: '2',
        employeeName: 'Bob Smith',
        project: 'Backend',
        startDate: new Date('2024-06-01'),
      }),
      createMockEmployee({
        employeeId: '3',
        employeeName: 'Charlie Frontend',
        project: 'Mobile',
        startDate: new Date('2024-09-01'),
      }),
    ];

    it('should filter by text and date range', () => {
      const result = filterEmployees(testData, {
        textSearch: 'Frontend',
        startDateFrom: new Date('2024-01-01'),
        startDateTo: new Date('2024-08-31'),
      });
      expect(result).toHaveLength(1);
      expect(result[0].employeeName).toBe('Alice Johnson');
    });

    it('should return all data when filters are empty', () => {
      const result = filterEmployees(testData, {
        textSearch: '',
        startDateFrom: null,
        startDateTo: null,
      });
      expect(result).toHaveLength(3);
    });
  });

  describe('createDefaultFilterState', () => {
    it('should create filter state with all fields cleared', () => {
      const state = createDefaultFilterState();
      expect(state.textSearch).toBe('');
      expect(state.startDateFrom).toBeNull();
      expect(state.startDateTo).toBeNull();
    });

    it('should return a new object each time', () => {
      const state1 = createDefaultFilterState();
      const state2 = createDefaultFilterState();
      expect(state1).not.toBe(state2);
    });
  });
});
