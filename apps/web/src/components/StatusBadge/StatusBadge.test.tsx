import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';
import styles from './StatusBadge.module.css';

describe('StatusBadge', () => {
  it('renders the status text', () => {
    render(<StatusBadge status="Active" />);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('always renders an element with status-pill class', () => {
    const { container } = render(<StatusBadge status="Active" />);
    expect(container.querySelector(`.${styles.statusPill}`)).not.toBeNull();
  });

  it('applies status-active class for Active', () => {
    const { container } = render(<StatusBadge status="Active" />);
    const badge = container.querySelector(`.${styles.statusPill}`);
    expect(badge?.classList.contains(styles['status-active'])).toBe(true);
  });

  it('applies status-pending class for Pending', () => {
    const { container } = render(<StatusBadge status="Pending" />);
    const badge = container.querySelector(`.${styles.statusPill}`);
    expect(badge?.classList.contains(styles['status-pending'])).toBe(true);
  });

  it('applies status-completed class for Completed', () => {
    const { container } = render(<StatusBadge status="Completed" />);
    const badge = container.querySelector(`.${styles.statusPill}`);
    expect(badge?.classList.contains(styles['status-completed'])).toBe(true);
  });

  it('applies status-onhold class for On Hold', () => {
    const { container } = render(<StatusBadge status="On Hold" />);
    expect(screen.getByText('On Hold')).toBeTruthy();
    const badge = container.querySelector(`.${styles.statusPill}`);
    expect(badge?.classList.contains(styles['status-onhold'])).toBe(true);
  });

  it('applies status-cancelled class for Cancelled', () => {
    const { container } = render(<StatusBadge status="Cancelled" />);
    const badge = container.querySelector(`.${styles.statusPill}`);
    expect(badge?.classList.contains(styles['status-cancelled'])).toBe(true);
  });

  it('applies status-default class for unknown status', () => {
    const { container } = render(<StatusBadge status="Unknown" />);
    const badge = container.querySelector(`.${styles.statusPill}`);
    expect(badge?.classList.contains(styles['status-default'])).toBe(true);
  });

  it('renders any status text passed in', () => {
    render(<StatusBadge status="Custom Status" />);
    expect(screen.getByText('Custom Status')).toBeTruthy();
  });
});
