import {
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import type { EmployeeNormalized } from '../../types';
import type { FilterState } from '../../utils';
import { DataTableFilters } from '../DataTableFilters/DataTableFilters';
import { DataTablePagination } from '../DataTablePagination/DataTablePagination';
import { MobileEmployeeCard } from '../MobileEmployeeCard/MobileEmployeeCard';
import styles from './DataTable.module.css';

interface DataTableProps {
  data: EmployeeNormalized[];
  total: number;
  columns: ColumnDef<EmployeeNormalized>[];
  filters: FilterState;
  setTextSearch: (query: string) => void;
  setDateRangeFilter: (fromDate: Date | null, toDate: Date | null) => void;
  onClearFilters: () => void;
  onExportCSV: () => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  pageIndex: number;
  setPageIndex: (index: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
}

/**
 * Reusable DataTable component using TanStack Table v8.
 * Supports multi-column sorting, pagination.
 */
export function DataTable({
  data,
  total,
  columns,
  filters,
  setTextSearch,
  setDateRangeFilter,
  onClearFilters,
  onExportCSV,
  sorting,
  setSorting,
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
}: DataTableProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(next);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount,
  });

  const visibleRows = table.getRowModel().rows;

  return (
    <div className={styles.container}>
      <DataTableFilters
        filters={filters}
        setTextSearch={setTextSearch}
        setDateRangeFilter={setDateRangeFilter}
        onClearFilters={onClearFilters}
        onExportCSV={onExportCSV}
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? () => {
                            header.column.toggleSorting(undefined, false);
                          }
                        : undefined
                    }
                    style={{
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                    className={header.column.getCanSort() ? `${styles.tableHeadCell} ${styles.sortable}` : styles.tableHeadCell}
                  >
                    <div className={styles.thContent}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className={styles.sortIndicator}>
                          {header.column.getIsSorted() === 'asc'
                            ? ' ↑'
                            : header.column.getIsSorted() === 'desc'
                              ? ' ↓'
                              : ' ⇅'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.emptyState}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <section className={styles.mobilePreview}>
        <h2 className={styles.mobilePreviewTitle}>Mobile View (&lt; 768px) - Card Layout</h2>
        {visibleRows.length > 0 ? (
          visibleRows.map((row) => <MobileEmployeeCard key={`mobile-${row.id}`} employee={row.original} />)
        ) : (
          <article className={styles.mobileEmptyCard}>
            <p className={styles.muted}>No data available</p>
          </article>
        )}
      </section>

      <DataTablePagination
        total={total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        currentCount={data.length}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
      />
    </div>
  );
}
