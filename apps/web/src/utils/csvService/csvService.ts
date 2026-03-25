import { EmployeeNormalized } from '../../types';

/**
 * Escape CSV field values to handle special characters
 * - Wraps fields containing commas, quotes, or newlines in quotes
 * - Doubles any internal quotes
 * @param value - The field value to escape
 * @returns Escaped CSV field
 */
function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);

  // Check if field needs quoting
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    // Escape internal quotes by doubling them
    const escaped = str.replace(/"/g, '""');
    // Wrap in quotes
    return `"${escaped}"`;
  }

  return str;
}

/**
 * Format a Date object to DD-MM-YYYY string for CSV export
 * @param date - Date object or null
 * @returns Formatted date string or empty string
 */
function formatDateForCsv(date: Date | null): string {
  if (!date || !(date instanceof Date)) {
    return '';
  }

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

/**
 * Convert employee data to CSV format with proper escaping
 * @param employees - Array of normalized employee records
 * @returns CSV string with header row and data rows
 */
export function generateCsv(employees: EmployeeNormalized[]): string {
  // Define column order
  const columns = [
    'employeeName',
    'project',
    'allocation',
    'startDate',
    'endDate',
    'status',
  ] as const;

  const headers = [
    'Employee Name',
    'Project',
    'Allocation (%)',
    'Start Date',
    'End Date',
    'Status',
  ];

  // Generate header row
  const headerRow = headers.map(escapeCsvField).join(',');

  // Generate data rows
  const dataRows = employees.map((employee) => {
    const row = columns.map((col) => {
      if (col === 'startDate' || col === 'endDate') {
        return escapeCsvField(formatDateForCsv(employee[col]));
      }
      const value = employee[col];
      return escapeCsvField(value);
    });
    return row.join(',');
  });

  // Combine header and data
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file
 * @param csvContent - CSV string content
 * @param filename - Name of the file to download
 */
export function downloadCsv(csvContent: string, filename: string = 'allocations.csv'): void {
  // Make CSV Excel-friendly across locales:
  // - BOM preserves UTF-8 characters
  // - sep=, forces comma delimiter parsing in Excel
  // - CRLF improves compatibility with spreadsheet apps on Windows
  const normalizedCsv = csvContent.replace(/\r?\n/g, '\r\n');
  const excelReadyCsv = `\uFEFFsep=,\r\n${normalizedCsv}`;

  // Create a blob with UTF-8 encoding
  const blob = new Blob([excelReadyCsv], { type: 'text/csv;charset=utf-8;' });

  // Create a temporary URL for the blob
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  // Set download attributes and click to trigger download
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL
  URL.revokeObjectURL(url);
}

/**
 * Generate and download CSV file from employee data
 * @param employees - Array of normalized employee records
 * @param filename - Optional filename (defaults to allocations.csv with timestamp)
 */
export function exportToCSV(
  employees: EmployeeNormalized[],
  filename?: string
): void {
  const csv = generateCsv(employees);
  const finalFilename = filename || `allocations-${new Date().toISOString().split('T')[0]}.csv`;
  downloadCsv(csv, finalFilename);
}
