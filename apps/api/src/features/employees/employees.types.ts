export interface EmployeeRaw {
  id: number;
  employeeName: string;
  project: string;
  allocation: number | null;
  startDate: string;
  endDate: string | null;
  status: string;
}

export interface Employee {
  id: number;
  employeeName: string;
  project: string;
  allocation: number | null;
  startDate: string;
  endDate: string | null;
  status: string;
}

export type SortableField =
  | 'id'
  | 'employeeName'
  | 'project'
  | 'allocation'
  | 'startDate'
  | 'endDate'
  | 'status';

export type SortOrder = 'asc' | 'desc';

export interface EmployeesQuery {
  page: number;
  pageSize: number;
  search: string;
  startDateFrom: Date | null;
  startDateTo: Date | null;
  sortBy: SortableField | null;
  sortOrder: SortOrder;
}

export interface EmployeesListResponse {
  total: number;
  page: number;
  pageSize: number;
  data: Employee[];
}