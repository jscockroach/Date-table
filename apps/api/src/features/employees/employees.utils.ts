import type { Employee, EmployeeRaw, EmployeesQuery, SortableField } from './employees.types.js';

const sortableFields: SortableField[] = [
  'id',
  'employeeName',
  'project',
  'allocation',
  'startDate',
  'endDate',
  'status',
];

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const readQueryString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0];
  }

  return '';
};

export const isSortableField = (value: string): value is SortableField => {
  return sortableFields.includes(value as SortableField);
};

export function parseDdMmYyyyToIso(dateValue: string | null): string | null {
  if (!dateValue) {
    return null;
  }

  const parts = dateValue.split('-');
  if (parts.length !== 3) {
    return null;
  }

  const [dayRaw, monthRaw, yearRaw] = parts;
  const day = Number(dayRaw);
  const month = Number(monthRaw);
  const year = Number(yearRaw);

  if ([day, month, year].some(Number.isNaN)) {
    return null;
  }

  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed.toISOString();
}

export function normalizeEmployeeDates(employee: EmployeeRaw): Employee {
  const startDateIso = parseDdMmYyyyToIso(employee.startDate);
  if (!startDateIso) {
    throw new Error(`Invalid startDate for employee ${employee.id}`);
  }

  return {
    ...employee,
    startDate: startDateIso,
    endDate: parseDdMmYyyyToIso(employee.endDate),
  };
}

export function parseQueryDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? new Date(`${trimmed}T00:00:00Z`)
    : new Date(trimmed);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function parseEmployeesQuery(query: Record<string, unknown>): EmployeesQuery {
  const page = Math.max(1, Number.parseInt(readQueryString(query.page) || '1', 10) || 1);
  const pageSizeRaw = Number.parseInt(readQueryString(query.pageSize) || '25', 10) || 25;
  const pageSize = Math.min(100, Math.max(1, pageSizeRaw));
  const search = readQueryString(query.search).trim().toLowerCase();
  const startDateFrom = parseQueryDate(readQueryString(query.startDateFrom));
  const startDateTo = parseQueryDate(readQueryString(query.startDateTo));
  const sortByQuery = readQueryString(query.sortBy).trim();
  const sortOrderQuery = readQueryString(query.sortOrder).trim().toLowerCase();

  return {
    page,
    pageSize,
    search,
    startDateFrom,
    startDateTo,
    sortBy: isSortableField(sortByQuery) ? sortByQuery : null,
    sortOrder: sortOrderQuery === 'desc' ? 'desc' : 'asc',
  };
}

export function isEmployeeRaw(value: unknown): value is EmployeeRaw {
  if (!isRecord(value)) {
    return false;
  }

  const { id, employeeName, project, allocation, startDate, endDate, status } = value;

  return (
    typeof id === 'number' &&
    typeof employeeName === 'string' &&
    typeof project === 'string' &&
    (typeof allocation === 'number' || allocation === null) &&
    typeof startDate === 'string' &&
    (typeof endDate === 'string' || endDate === null) &&
    typeof status === 'string'
  );
}