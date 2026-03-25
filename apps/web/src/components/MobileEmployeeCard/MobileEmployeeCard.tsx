import type { EmployeeNormalized } from '../../types';
import { formatDisplayDate } from '../../utils';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import styles from './MobileEmployeeCard.module.css';

interface MobileEmployeeCardProps {
  employee: EmployeeNormalized;
}

export function MobileEmployeeCard({ employee }: MobileEmployeeCardProps) {
  return (
    <article className={styles.mobileCard}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.title}>{employee.employeeName}</h3>
          <p className={styles.project}>{employee.project}</p>
        </div>
        <StatusBadge status={employee.status} />
      </header>

      <dl className={styles.details}>
        <div>
          <dt className={styles.term}>Allocation</dt>
          <dd className={styles.description}>{employee.allocation == null ? '-' : `${employee.allocation}%`}</dd>
        </div>
        <div>
          <dt className={styles.term}>Start Date</dt>
          <dd className={styles.description}>{formatDisplayDate(employee.startDate)}</dd>
        </div>
        <div>
          <dt className={styles.term}>End Date</dt>
          <dd className={styles.description}>{formatDisplayDate(employee.endDate)}</dd>
        </div>
        <div>
          <dt className={styles.term}>Status</dt>
          <dd className={styles.description}>{employee.status}</dd>
        </div>
      </dl>
    </article>
  );
}
