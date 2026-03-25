import type { ReactNode } from 'react';
import styles from './AllocationCell.module.css';

interface AllocationCellProps {
  value: number | null;
  emptyFallback?: ReactNode;
}

export function AllocationCell({
  value,
  emptyFallback = <span className={styles.emptyFallback}>-</span>,
}: AllocationCellProps) {
  if (value == null) {
    return <>{emptyFallback}</>;
  }

  return (
    <div className={styles.allocationCell}>
      <span className={styles.barTrack}>
        <span className={styles.barFill} style={{ width: `${value}%` }} />
      </span>
      <span>{value}%</span>
    </div>
  );
}
