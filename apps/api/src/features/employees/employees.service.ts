import { EmployeesRepository } from './employees.repository.js';
import type { Employee, EmployeesListResponse, EmployeesQuery, SortableField } from './employees.types.js';

const compareNullable = <T extends string | number>(a: T | null, b: T | null): number => {
  if (a === null && b === null) {
    return 0;
  }
  if (a === null) {
    return 1;
  }
  if (b === null) {
    return -1;
  }
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const matchesSearch = (employee: Employee, search: string): boolean => {
  if (!search) {
    return true;
  }

  return (
    employee.employeeName.toLowerCase().includes(search) ||
    employee.project.toLowerCase().includes(search)
  );
};

const isWithinStartDateRange = (
  employee: Employee,
  startDateFrom: Date | null,
  startDateTo: Date | null,
): boolean => {
  if (!startDateFrom && !startDateTo) {
    return true;
  }

  const startDate = new Date(employee.startDate);
  if (Number.isNaN(startDate.getTime())) {
    return false;
  }

  if (startDateFrom && startDate < startDateFrom) {
    return false;
  }

  if (startDateTo && startDate > startDateTo) {
    return false;
  }

  return true;
};

const compareEmployees = (left: Employee, right: Employee, sortBy: SortableField): number => {
  switch (sortBy) {
    case 'id':
      return compareNullable(left.id, right.id);
    case 'allocation':
      return compareNullable(left.allocation, right.allocation);
    case 'startDate':
      return compareNullable(
        left.startDate ? new Date(left.startDate).getTime() : null,
        right.startDate ? new Date(right.startDate).getTime() : null,
      );
    case 'endDate':
      return compareNullable(
        left.endDate ? new Date(left.endDate).getTime() : null,
        right.endDate ? new Date(right.endDate).getTime() : null,
      );
    case 'employeeName':
    case 'project':
    case 'status':
      return compareNullable(left[sortBy].toLowerCase(), right[sortBy].toLowerCase());
    default:
      return 0;
  }
};

export class EmployeesService {
  constructor(private readonly repository: EmployeesRepository) {}

  async listEmployees(query: EmployeesQuery): Promise<EmployeesListResponse> {
    const employees = await this.repository.getAll();

    const filteredEmployees = employees.filter((employee) => {
      return matchesSearch(employee, query.search) &&
        isWithinStartDateRange(employee, query.startDateFrom, query.startDateTo);
    });

    const sortedEmployees = query.sortBy
      ? [...filteredEmployees].sort((left, right) => {
          const comparison = compareEmployees(left, right, query.sortBy as SortableField);
          return query.sortOrder === 'desc' ? -comparison : comparison;
        })
      : filteredEmployees;

    const total = sortedEmployees.length;
    const startIndex = (query.page - 1) * query.pageSize;
    const data = sortedEmployees.slice(startIndex, startIndex + query.pageSize);

    return {
      total,
      page: query.page,
      pageSize: query.pageSize,
      data,
    };
  }
}