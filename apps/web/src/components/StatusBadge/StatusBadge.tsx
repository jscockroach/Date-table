import { getStatusClass } from '../../utils';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`${styles.statusPill} ${styles[getStatusClass(status)]}`}>{status}</span>;
}
