import { EmployeeNormalized } from '../../types';

/**
 * Filter state interface for managing active filters
 */
export interface FilterState {
  textSearch: string;
  startDateFrom: Date | null;
  startDateTo: Date | null;
}

export type EmployeeFilters = FilterState;

/**
 * Filter employees by text search query (case-insensitive)
 * Searches through: employeeName and project fields
 * @param data - Array of normalized employees
 * @param query - Search query string
 * @returns Filtered array matching the query
 */
export function textSearchFilter(data: EmployeeNormalized[], query: string): EmployeeNormalized[] {
  if (!query || query.trim() === '') {
    return data;
  }

  const lowerQuery = query.toLowerCase().trim();
  return data.filter((employee) => {
    const nameMatch = employee.employeeName.toLowerCase().includes(lowerQuery);
    const projectMatch = employee.project.toLowerCase().includes(lowerQuery);
    return nameMatch || projectMatch;
  });
}

/**
 * Filter employees by start date range
 * @param data - Array of normalized employees
 * @param fromDate - Start of date range (inclusive), null to ignore
 * @param toDate - End of date range (inclusive), null to ignore
 * @returns Filtered array within the date range
 */
export function dateRangeFilter(
  data: EmployeeNormalized[],
  fromDate: Date | null,
  toDate: Date | null
): EmployeeNormalized[] {
  // If no filters set, return all data (including records with null dates)
  if (!fromDate && !toDate) {
    return data;
  }

  return data.filter((employee) => {
    // If a date filter is active and employee has no start date, exclude them
    if (!employee.startDate) {
      return false;
    }

    const startTime = employee.startDate.getTime();
    const fromTime = fromDate ? fromDate.getTime() : null;
    const toTime = toDate ? toDate.getTime() : null;

    // Check lower bound
    if (fromTime !== null && startTime < fromTime) {
      return false;
    }

    // Check upper bound
    if (toTime !== null && startTime > toTime) {
      return false;
    }

    return true;
  });
}

/**
 * Apply all active filters to employee data
 * Order: text search → date range filter
 * @param data - Array of normalized employees
 * @param filterState - Current filter state
 * @returns Filtered array with all filters applied
 */
export function filterEmployees(
  data: EmployeeNormalized[],
  filters: EmployeeFilters
): EmployeeNormalized[] {
  let filtered = data;

  // Apply text search filter
  filtered = textSearchFilter(filtered, filters.textSearch);

  // Apply date range filter
  filtered = dateRangeFilter(filtered, filters.startDateFrom, filters.startDateTo);

  return filtered;
}

export function applyFilters(data: EmployeeNormalized[], filterState: FilterState): EmployeeNormalized[] {
  return filterEmployees(data, filterState);
}

/**
 * Create default filter state with all filters cleared
 */
export function createDefaultFilterState(): FilterState {
  return {
    textSearch: '',
    startDateFrom: null,
    startDateTo: null,
  };
}
