import { describe, it, expect } from 'vitest';
import { parseDate, normalizeEmployee, normalizeEmployees } from './types';

describe('parseDate', () => {
  it('returns null for null input', () => {
    expect(parseDate(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseDate('')).toBeNull();
  });

  it('parses ISO datetime string', () => {
    const result = parseDate('2024-01-15T00:00:00Z');
    expect(result).toBeInstanceOf(Date);
    expect(result!.getUTCFullYear()).toBe(2024);
    expect(result!.getUTCMonth()).toBe(0); // January
    expect(result!.getUTCDate()).toBe(15);
  });

  it('parses ISO date-only string YYYY-MM-DD', () => {
    const result = parseDate('2024-06-20');
    expect(result).toBeInstanceOf(Date);
    expect(result).not.toBeNull();
  });

  it('parses DD-MM-YYYY format', () => {
    const result = parseDate('15-01-2024');
    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2024);
    expect(result!.getMonth()).toBe(0); // January
    expect(result!.getDate()).toBe(15);
  });

  it('parses another valid DD-MM-YYYY date', () => {
    const result = parseDate('31-12-2023');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2023);
    expect(result!.getMonth()).toBe(11); // December
    expect(result!.getDate()).toBe(31);
  });

  it('returns null for completely invalid string', () => {
    expect(parseDate('not-a-date')).toBeNull();
  });

  it('returns null for impossible date Feb 30', () => {
    expect(parseDate('30-02-2024')).toBeNull();
  });

  it('returns null for partial DD-MM string (only 2 parts)', () => {
    expect(parseDate('15-01')).toBeNull();
  });

  it('returns null for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(parseDate(42)).toBeNull();
  });
});

describe('normalizeEmployee', () => {
  const base = {
    id: 1,
    employeeName: 'Alice',
    project: 'Alpha',
    allocation: 80,
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-06-30T00:00:00Z',
    status: 'Active',
  };

  it('converts startDate string to Date object', () => {
    const result = normalizeEmployee(base);
    expect(result.startDate).toBeInstanceOf(Date);
  });

  it('converts endDate string to Date object', () => {
    const result = normalizeEmployee(base);
    expect(result.endDate).toBeInstanceOf(Date);
  });

  it('handles null endDate gracefully', () => {
    const result = normalizeEmployee({ ...base, endDate: null });
    expect(result.endDate).toBeNull();
  });

  it('throws when startDate is an empty string', () => {
    expect(() => normalizeEmployee({ ...base, startDate: '' })).toThrow();
  });

  it('throws when startDate is completely invalid', () => {
    expect(() => normalizeEmployee({ ...base, startDate: 'garbage-date' })).toThrow();
  });

  it('preserves all non-date fields', () => {
    const result = normalizeEmployee(base);
    expect(result.id).toBe(1);
    expect(result.employeeName).toBe('Alice');
    expect(result.project).toBe('Alpha');
    expect(result.allocation).toBe(80);
    expect(result.status).toBe('Active');
  });

  it('works with DD-MM-YYYY format start date', () => {
    const result = normalizeEmployee({ ...base, startDate: '15-01-2024' });
    expect(result.startDate).toBeInstanceOf(Date);
    expect(result.startDate.getFullYear()).toBe(2024);
  });
});

describe('normalizeEmployees', () => {
  it('normalizes an array of valid employees', () => {
    const employees = [
      {
        id: 1,
        employeeName: 'A',
        project: 'P1',
        allocation: 50,
        startDate: '2024-01-01T00:00:00Z',
        endDate: null,
        status: 'Active',
      },
      {
        id: 2,
        employeeName: 'B',
        project: 'P2',
        allocation: 100,
        startDate: '2024-03-01T00:00:00Z',
        endDate: '2024-12-31T00:00:00Z',
        status: 'Active',
      },
    ];
    const result = normalizeEmployees(employees);
    expect(result).toHaveLength(2);
    expect(result[0].startDate).toBeInstanceOf(Date);
    expect(result[1].endDate).toBeInstanceOf(Date);
  });

  it('silently filters out records with invalid startDate', () => {
    const employees = [
      {
        id: 1,
        employeeName: 'Valid',
        project: 'P1',
        allocation: 50,
        startDate: '2024-01-01T00:00:00Z',
        endDate: null,
        status: 'Active',
      },
      {
        id: 2,
        employeeName: 'Invalid',
        project: 'P2',
        allocation: 50,
        startDate: '',
        endDate: null,
        status: 'Active',
      },
    ];
    const result = normalizeEmployees(employees);
    expect(result).toHaveLength(1);
    expect(result[0].employeeName).toBe('Valid');
  });

  it('returns empty array for empty input', () => {
    expect(normalizeEmployees([])).toEqual([]);
  });

  it('handles all-invalid records by returning empty array', () => {
    const employees = [
      { id: 1, employeeName: 'X', project: 'P', allocation: 0, startDate: '', endDate: null, status: 'Active' },
      { id: 2, employeeName: 'Y', project: 'P', allocation: 0, startDate: 'bad', endDate: null, status: 'Active' },
    ];
    expect(normalizeEmployees(employees)).toHaveLength(0);
  });
});
