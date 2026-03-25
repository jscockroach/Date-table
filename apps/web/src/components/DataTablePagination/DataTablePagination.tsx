import styles from './DataTablePagination.module.css';

interface DataTablePaginationProps {
  total: number;
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  currentCount: number;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
}

export function DataTablePagination({
  total,
  pageIndex,
  pageSize,
  pageCount,
  currentCount,
  setPageIndex,
  setPageSize,
}: DataTablePaginationProps) {
  return (
    <div className={styles.footerRow}>
      <p className={styles.count}>
        Showing {total === 0 ? 0 : pageIndex * pageSize + 1}-
        {Math.min(pageIndex * pageSize + currentCount, total)} of {total} records
      </p>
      <div className={styles.pager}>
        <select className={styles.select} value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setPageIndex(Math.max(pageIndex - 1, 0))}
          disabled={pageIndex === 0}
        >
          Previous
        </button>

        <span className={styles.pageInfo}>
          Page {pageIndex + 1} of {pageCount}
        </span>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setPageIndex(Math.min(pageIndex + 1, pageCount - 1))}
          disabled={pageIndex >= pageCount - 1 || total === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}
