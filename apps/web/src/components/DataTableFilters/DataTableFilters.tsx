import { useEffect, useState } from 'react';
import type { FilterState } from '../../utils';
import styles from './DataTableFilters.module.css';

interface DataTableFiltersProps {
  filters: FilterState;
  setTextSearch: (query: string) => void;
  setDateRangeFilter: (fromDate: Date | null, toDate: Date | null) => void;
  onClearFilters: () => void;
  onExportCSV: () => void;
}

function formatDateInputValue(date: Date | null): string {
  if (!date || Number.isNaN(date.getTime())) {
    return '';
  }

  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1000) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  const isExactDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isExactDate ? date : null;
}

export function DataTableFilters({ filters, setTextSearch, setDateRangeFilter, onClearFilters, onExportCSV }: DataTableFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.textSearch);
  // Key increments on Clear Filters to remount date inputs and reset their native state
  const [dateResetKey, setDateResetKey] = useState(0);

  useEffect(() => {
    setSearchValue(filters.textSearch);
  }, [filters.textSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTextSearch(searchValue);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchValue, setTextSearch]);

  const handleClearFilters = () => {
    setDateResetKey((k) => k + 1);
    onClearFilters();
  };

  return (
    <div className={styles.toolbarGrid}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Search</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Search by name or project..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
        <small className={styles.hint}>Debounced input, case-insensitive</small>
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Start Date From</span>
        <input
          key={`from-${dateResetKey}`}
          className={styles.input}
          type="date"
          defaultValue={formatDateInputValue(filters.startDateFrom)}
          onChange={(event) => {
            const val = event.target.value;
            if (!val) {
              // badInput=true means browser has partial year typed — don't reset filter
              if (!event.target.validity.badInput) {
                setDateRangeFilter(null, filters.startDateTo);
              }
              return;
            }
            const fromDate = parseDateInputValue(val);
            if (fromDate) {
              setDateRangeFilter(fromDate, filters.startDateTo);
            }
          }}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Start Date To</span>
        <input
          key={`to-${dateResetKey}`}
          className={styles.input}
          type="date"
          defaultValue={formatDateInputValue(filters.startDateTo)}
          onChange={(event) => {
            const val = event.target.value;
            if (!val) {
              if (!event.target.validity.badInput) {
                setDateRangeFilter(filters.startDateFrom, null);
              }
              return;
            }
            const toDate = parseDateInputValue(val);
            if (toDate) {
              setDateRangeFilter(filters.startDateFrom, toDate);
            }
          }}
        />
      </label>

      <div className={styles.buttonGroup}>
        <button type="button" className="btn btn-secondary" onClick={handleClearFilters}>
          Clear Filters
        </button>
        <button type="button" className="btn btn-primary" onClick={onExportCSV}>
          Export CSV
        </button>
      </div>
    </div>
  );
}
