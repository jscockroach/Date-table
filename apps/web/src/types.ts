export interface Employee {
  id: number;
  employeeName: string;
  project: string;
  allocation: number | null;
  startDate: string;
  endDate: string | null;
  status: string;
}

export interface EmployeeNormalized extends Omit<Employee, 'startDate' | 'endDate'> {
  startDate: Date;
  endDate: Date | null;
}

/**
 * Parses date string in DD-MM-YYYY format to Date object.
 * Returns null if string is null/empty/invalid.
 */
export function parseDate(dateString: string | null): Date | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  const trimmed = dateString.trim();

  // Handle ISO date/date-time strings from API
  const isoDate = new Date(trimmed);
  if (!Number.isNaN(isoDate.getTime()) && (trimmed.includes('T') || /^\d{4}-\d{2}-\d{2}/.test(trimmed))) {
    return isoDate;
  }

  // Fallback for DD-MM-YYYY format
  const parts = trimmed.split('-');
  if (parts.length !== 3) {
    return null;
  }

  const [dayStr, monthStr, yearStr] = parts;
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    return null;
  }

  // Month is 0-indexed in Date constructor
  const date = new Date(year, month - 1, day);

  // Validate that the date is valid (e.g., reject Feb 30)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

/**
 * Converts an Employee to EmployeeNormalized by parsing date strings to Date objects.
 * Throws error if startDate is invalid (required field).
 */
export function normalizeEmployee(employee: Employee): EmployeeNormalized {
  const startDate = parseDate(employee.startDate);
  if (!startDate) {
    throw new Error(`Invalid startDate for employee ${employee.id}: "${employee.startDate}"`);
  }

  const endDate = parseDate(employee.endDate);

  return {
    ...employee,
    startDate,
    endDate,
  };
}

/**
 * Batch normalize array of employees. Filters out invalid records.
 */
export function normalizeEmployees(employees: Employee[]): EmployeeNormalized[] {
  return employees
    .map((emp) => {
      try {
        return normalizeEmployee(emp);
      } catch {
        console.warn(`Skipping invalid employee record: ${emp.id}`);
        return null;
      }
    })
    .filter((emp): emp is EmployeeNormalized => emp !== null);
}
