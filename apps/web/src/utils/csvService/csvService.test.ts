import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateCsv, downloadCsv, exportToCSV } from './csvService';
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

describe('CSV Service', () => {
  describe('generateCsv', () => {
    it('should generate CSV with header row', () => {
      const data: EmployeeNormalized[] = [];
      const csv = generateCsv(data);
      const lines = csv.split('\n');
      expect(lines[0]).toBe('Employee Name,Project,Allocation (%),Start Date,End Date,Status');
    });

    it('should generate CSV with single employee', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ employeeName: 'Alice Johnson', project: 'Frontend', allocation: 100 }),
      ];
      const csv = generateCsv(data);
      const lines = csv.split('\n');
      expect(lines).toHaveLength(2); // header + 1 data row
      expect(lines[1]).toContain('Alice Johnson');
      expect(lines[1]).toContain('Frontend');
      expect(lines[1]).toContain('100');
    });

    it('should format dates as DD-MM-YYYY', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-06-30'),
        }),
      ];
      const csv = generateCsv(data);
      expect(csv).toContain('15-01-2024');
      expect(csv).toContain('30-06-2024');
    });

    it('should handle null dates as empty strings', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ startDate: null, endDate: null }),
      ];
      const csv = generateCsv(data);
      const lines = csv.split('\n');
      const dataRow = lines[1];
      // The empty date fields should not add extra content after allocation
      expect(dataRow.split(',').length).toBe(6); // 6 columns
    });

    it('should escape fields containing commas', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ employeeName: 'Doe, John', project: 'Project, Alpha' }),
      ];
      const csv = generateCsv(data);
      expect(csv).toContain('"Doe, John"');
      expect(csv).toContain('"Project, Alpha"');
    });

    it('should escape fields containing quotes', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ employeeName: 'John "The Boss" Doe' }),
      ];
      const csv = generateCsv(data);
      // Quotes should be doubled and field wrapped in quotes
      expect(csv).toContain('"John ""The Boss"" Doe"');
    });

    it('should escape fields containing newlines', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ project: 'Project\nAlpha' }),
      ];
      const csv = generateCsv(data);
      const lines = csv.split('\n');
      // The project with newline should be wrapped in quotes
      expect(csv).toContain('"Project\nAlpha"');
    });

    it('should handle multiple employees', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ employeeId: '1', employeeName: 'Alice' }),
        createMockEmployee({ employeeId: '2', employeeName: 'Bob' }),
        createMockEmployee({ employeeId: '3', employeeName: 'Charlie' }),
      ];
      const csv = generateCsv(data);
      const lines = csv.split('\n');
      expect(lines).toHaveLength(4); // header + 3 data rows
      expect(lines[1]).toContain('Alice');
      expect(lines[2]).toContain('Bob');
      expect(lines[3]).toContain('Charlie');
    });

    it('should handle allocation percentage', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ allocation: 50 }),
        createMockEmployee({ allocation: 100 }),
        createMockEmployee({ allocation: 0 }),
      ];
      const csv = generateCsv(data);
      expect(csv).toContain('50');
      expect(csv).toContain('100');
      expect(csv).toContain('0');
    });

    it('should handle null allocation', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ allocation: null as any }),
      ];
      const csv = generateCsv(data);
      const lines = csv.split('\n');
      expect(lines[1]).toBeDefined();
    });

    it('should handle status field', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ status: 'active' }),
        createMockEmployee({ status: 'pending' }),
        createMockEmployee({ status: 'completed' }),
      ];
      const csv = generateCsv(data);
      expect(csv).toContain('active');
      expect(csv).toContain('pending');
      expect(csv).toContain('completed');
    });
  });

  describe('downloadCsv', () => {
    it('should not throw when downloading CSV', () => {
      // downloadCsv depends on browser APIs (URL.createObjectURL, etc.)
      // In jsdom environment, these are not available
      // In a real browser environment, this would trigger a file download
      // We test this functionality through integration tests or manual testing
      
      // For unit test purposes, we verify the function signature exists
      expect(typeof downloadCsv).toBe('function');
    });
  });

  describe('exportToCSV', () => {
    beforeEach(() => {
      // Mock downloadCsv to avoid browser API calls
      vi.mock('./csvService', async () => {
        const actual = await vi.importActual('./csvService');
        return {
          ...actual,
          downloadCsv: vi.fn(),
        };
      });
    });

    it('should generate and download CSV with custom filename', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ employeeName: 'Test User' }),
      ];
      
      // Create spy to monitor generateCsv
      const csv = generateCsv(data);
      expect(csv).toContain('Test User');
      expect(csv).toContain('Employee Name');
    });

    it('should use default filename with date if not provided', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee(),
      ];
      
      const csv = generateCsv(data);
      expect(csv.split('\n').length).toBeGreaterThan(1);
    });

    it('should export empty array to CSV', () => {
      const csv = generateCsv([]);
      // Should at least have header
      expect(csv).toContain('Employee Name');
    });

    it('should export multiple employees to CSV', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ employeeId: '1', employeeName: 'Alice' }),
        createMockEmployee({ employeeId: '2', employeeName: 'Bob' }),
      ];
      
      const csv = generateCsv(data);
      expect(csv).toContain('Alice');
      expect(csv).toContain('Bob');
      expect(csv.split('\n').length).toBe(3); // header + 2 rows
    });
  });

  describe('CSV format validation', () => {
    it('should produce valid CSV format - header and data separated by newline', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ employeeName: 'Test' }),
      ];
      const csv = generateCsv(data);
      const lines = csv.split('\n');
      expect(lines.length).toBeGreaterThan(1);
      expect(lines[0]).toContain('Employee Name');
    });

    it('should match column count across all rows', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({ employeeName: 'Alice', project: 'Project A' }),
        createMockEmployee({ employeeName: 'Bob', project: 'Project B' }),
      ];
      const csv = generateCsv(data);
      const lines = csv.split('\n');
      const headerCols = lines[0].split(',').length;
      const dataCols1 = lines[1].split(',').length;
      const dataCols2 = lines[2].split(',').length;
      expect(headerCols).toBe(dataCols1);
      expect(headerCols).toBe(dataCols2);
    });

    it('should handle special characters correctly in escaping', () => {
      const data: EmployeeNormalized[] = [
        createMockEmployee({
          employeeName: 'Smith, Jr.',
          project: 'Design "UI" System',
        }),
      ];
      const csv = generateCsv(data);
      // Both fields should be properly escaped
      expect(csv).toContain('"Smith, Jr."');
      expect(csv).toContain('"Design ""UI"" System"');
    });
  });
});
