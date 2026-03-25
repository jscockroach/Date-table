export function formatDisplayDate(value: Date | string | null | undefined): string {
  if (!value) {
    return '-';
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(value);
  }

  if (typeof value === 'string') {
    const isoDate = new Date(value);
    if (!Number.isNaN(isoDate.getTime())) {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(isoDate);
    }

    const [day, month, year] = value.split('-').map(Number);
    const fallbackDate = new Date(year, month - 1, day);
    if (!Number.isNaN(fallbackDate.getTime())) {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(fallbackDate);
    }

    return value;
  }

  return '-';
}

export function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    Active: 'status-active',
    Pending: 'status-pending',
    Completed: 'status-completed',
    'On Hold': 'status-onhold',
    Cancelled: 'status-cancelled',
  };

  return map[status] || 'status-default';
}
