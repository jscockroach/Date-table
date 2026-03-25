import type { Row } from '@tanstack/react-table';
import type { EmployeeNormalized } from '../../types';

/**
 * Custom sorting function for Date objects.
 * Handles null values (treats as end of list).
 */
export function sortDateAsc(
  rowA: Row<EmployeeNormalized>,
  rowB: Row<EmployeeNormalized>,
  columnId: string
): number {
  const dateA = rowA.getValue<Date | null>(columnId);
  const dateB = rowB.getValue<Date | null>(columnId);

  // Nulls go to the end
  if (!dateA && !dateB) return 0;
  if (!dateA) return 1;
  if (!dateB) return -1;

  return dateA.getTime() - dateB.getTime();
}

export function sortDateDesc(
  rowA: Row<EmployeeNormalized>,
  rowB: Row<EmployeeNormalized>,
  columnId: string
): number {
  const dateA = rowA.getValue<Date | null>(columnId);
  const dateB = rowB.getValue<Date | null>(columnId);

  // Nulls go to the end
  if (!dateA && !dateB) return 0;
  if (!dateA) return 1;
  if (!dateB) return -1;

  return dateB.getTime() - dateA.getTime();
}

/**
 * Custom sorting function for numeric values.
 * Handles null/undefined values (treats as end of list).
 */
export function sortNumericAsc(
  rowA: Row<EmployeeNormalized>,
  rowB: Row<EmployeeNormalized>,
  columnId: string
): number {
  const numA = rowA.getValue<number | null>(columnId);
  const numB = rowB.getValue<number | null>(columnId);

  // Nulls go to the end
  if (numA === null && numB === null) return 0;
  if (numA === null) return 1;
  if (numB === null) return -1;

  return numA - numB;
}

export function sortNumericDesc(
  rowA: Row<EmployeeNormalized>,
  rowB: Row<EmployeeNormalized>,
  columnId: string
): number {
  const numA = rowA.getValue<number | null>(columnId);
  const numB = rowB.getValue<number | null>(columnId);

  // Nulls go to the end
  if (numA === null && numB === null) return 0;
  if (numA === null) return 1;
  if (numB === null) return -1;

  return numB - numA;
}

/**
 * Comparator factory for date columns.
 * Returns a comparator function that handles both asc/desc sorting.
 */
export function createDateComparator(columnId: string) {
  return (rowA: Row<EmployeeNormalized>, rowB: Row<EmployeeNormalized>) => {
    return sortDateAsc(rowA, rowB, columnId);
  };
}

/**
 * Comparator factory for numeric columns.
 */
export function createNumericComparator(columnId: string) {
  return (rowA: Row<EmployeeNormalized>, rowB: Row<EmployeeNormalized>) => {
    return sortNumericAsc(rowA, rowB, columnId);
  };
}
