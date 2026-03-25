import { useCallback } from 'react';
import { DataTable } from './components';
import { useDataTableState, useEmployeeTableColumns, useEmployees } from './hooks';
import { exportToCSV } from './utils';
import styles from './App.module.css';

export default function App() {
  const tableState = useDataTableState();
  const columns = useEmployeeTableColumns();
  const { loading, error, data, total } = useEmployees({
    page: tableState.pageIndex + 1,
    pageSize: tableState.pageSize,
    filters: tableState.filters,
    sorting: tableState.sorting,
  });

  // Handle CSV export
  const handleExportCSV = useCallback(() => {
    exportToCSV(data);
  }, [data]);


  return (
    <main className={styles.dashboardWrap}>
      <div className={styles.header}>
        <h1 className={styles.title}>Employee Allocations Dashboard</h1>
      </div>

      <section className={styles.body}>
        {loading && <p className={styles.info}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!error && (
          <DataTable
            data={data}
            total={total}
            columns={columns}
            filters={tableState.filters}
            setTextSearch={tableState.setTextSearch}
            setDateRangeFilter={tableState.setDateRangeFilter}
            onClearFilters={tableState.resetFilters}
            onExportCSV={handleExportCSV}
            sorting={tableState.sorting}
            setSorting={tableState.setSorting}
            pageIndex={tableState.pageIndex}
            setPageIndex={tableState.setPageIndex}
            pageSize={tableState.pageSize}
            setPageSize={tableState.setPageSize}
          />
        )}
      </section>
    </main>
  );
}
