import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { EmployeeNormalized } from '../../types';
import { AllocationCell, StatusBadge } from '../../components';
import { formatDisplayDate } from '../../utils';

export function useEmployeeTableColumns(): ColumnDef<EmployeeNormalized>[] {
  return useMemo(
    () => [
      {
        accessorKey: 'employeeName',
        header: 'Employee Name',
        enableSorting: true,
      },
      {
        accessorKey: 'project',
        header: 'Project',
        enableSorting: true,
      },
      {
        accessorKey: 'allocation',
        header: 'Allocation',
        enableSorting: true,
        cell: (info) => <AllocationCell value={info.getValue() as number | null} />,
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        enableSorting: true,
        cell: (info) => formatDisplayDate(info.getValue() as Date),
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        enableSorting: true,
        cell: (info) => formatDisplayDate(info.getValue() as Date | null),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        cell: (info) => <StatusBadge status={info.getValue() as string} />,
      },
    ],
    []
  );
}
