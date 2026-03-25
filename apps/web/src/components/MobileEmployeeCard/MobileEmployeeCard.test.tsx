import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileEmployeeCard } from './MobileEmployeeCard';
import type { EmployeeNormalized } from '../../types';
import styles from './MobileEmployeeCard.module.css';

const mockEmployee: EmployeeNormalized = {
  id: 1,
  employeeName: 'Alice Johnson',
  project: 'Project Alpha',
  allocation: 80,
  startDate: new Date(2024, 0, 15), // Jan 15, 2024
  endDate: new Date(2024, 5, 30),   // Jun 30, 2024
  status: 'Active',
};

describe('MobileEmployeeCard', () => {
  it('renders the employee name', () => {
    render(<MobileEmployeeCard employee={mockEmployee} />);
    expect(screen.getByText('Alice Johnson')).toBeTruthy();
  });

  it('renders the project name', () => {
    render(<MobileEmployeeCard employee={mockEmployee} />);
    expect(screen.getByText('Project Alpha')).toBeTruthy();
  });

  it('renders the allocation percentage', () => {
    render(<MobileEmployeeCard employee={mockEmployee} />);
    expect(screen.getByText('80%')).toBeTruthy();
  });

  it('renders "-" when allocation is null', () => {
    render(<MobileEmployeeCard employee={{ ...mockEmployee, allocation: null }} />);
    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('renders the status badge (via StatusBadge)', () => {
    render(<MobileEmployeeCard employee={mockEmployee} />);
    // StatusBadge renders the status text; it appears in both header and dl
    const statusElements = screen.getAllByText('Active');
    expect(statusElements.length).toBeGreaterThan(0);
  });

  it('renders a formatted start date containing the month name', () => {
    render(<MobileEmployeeCard employee={mockEmployee} />);
    expect(screen.getByText(/Jan/)).toBeTruthy();
  });

  it('renders a formatted end date containing the month name', () => {
    render(<MobileEmployeeCard employee={mockEmployee} />);
    expect(screen.getByText(/Jun/)).toBeTruthy();
  });

  it('renders "-" for null endDate in the date field', () => {
    render(<MobileEmployeeCard employee={{ ...mockEmployee, endDate: null }} />);
    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('renders the Allocation label in the details', () => {
    render(<MobileEmployeeCard employee={mockEmployee} />);
    expect(screen.getByText('Allocation')).toBeTruthy();
  });

  it('renders Start Date and End Date labels', () => {
    render(<MobileEmployeeCard employee={mockEmployee} />);
    expect(screen.getByText('Start Date')).toBeTruthy();
    expect(screen.getByText('End Date')).toBeTruthy();
  });

  it('renders Status label in the details', () => {
    render(<MobileEmployeeCard employee={mockEmployee} />);
    expect(screen.getByText('Status')).toBeTruthy();
  });

  it('wraps content in an article element with mobile-card class', () => {
    const { container } = render(<MobileEmployeeCard employee={mockEmployee} />);
    expect(container.querySelector(`article.${styles.mobileCard}`)).not.toBeNull();
  });

  it('renders header with h3 for employee name', () => {
    const { container } = render(<MobileEmployeeCard employee={mockEmployee} />);
    const h3 = container.querySelector('h3');
    expect(h3?.textContent).toBe('Alice Johnson');
  });
});
