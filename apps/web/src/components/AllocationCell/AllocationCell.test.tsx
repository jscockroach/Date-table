import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AllocationCell } from './AllocationCell';
import styles from './AllocationCell.module.css';

describe('AllocationCell', () => {
  it('renders "-" fallback when value is null', () => {
    const { container } = render(<AllocationCell value={null} />);
    expect(container.textContent).toContain('-');
  });

  it('renders the allocation percentage as text', () => {
    render(<AllocationCell value={75} />);
    expect(screen.getByText('75%')).toBeTruthy();
  });

  it('renders 100% allocation correctly', () => {
    render(<AllocationCell value={100} />);
    expect(screen.getByText('100%')).toBeTruthy();
  });

  it('renders 0% allocation correctly', () => {
    render(<AllocationCell value={0} />);
    expect(screen.getByText('0%')).toBeTruthy();
  });

  it('renders a bar-fill element with correct width style', () => {
    const { container } = render(<AllocationCell value={60} />);
    const fill = container.querySelector(`.${styles.barFill}`) as HTMLElement;
    expect(fill).not.toBeNull();
    expect(fill.style.width).toBe('60%');
  });

  it('renders bar-track wrapper element', () => {
    const { container } = render(<AllocationCell value={80} />);
    expect(container.querySelector(`.${styles.barTrack}`)).not.toBeNull();
  });

  it('renders bar-fill width matching the value', () => {
    const { container } = render(<AllocationCell value={25} />);
    const fill = container.querySelector(`.${styles.barFill}`) as HTMLElement;
    expect(fill.style.width).toBe('25%');
  });

  it('accepts a custom emptyFallback element', () => {
    render(<AllocationCell value={null} emptyFallback={<span>N/A</span>} />);
    expect(screen.getByText('N/A')).toBeTruthy();
  });

  it('does not render bar elements when value is null', () => {
    const { container } = render(<AllocationCell value={null} />);
    expect(container.querySelector(`.${styles.barFill}`)).toBeNull();
    expect(container.querySelector(`.${styles.barTrack}`)).toBeNull();
  });

  it('renders allocation-cell wrapper when value is provided', () => {
    const { container } = render(<AllocationCell value={50} />);
    expect(container.querySelector(`.${styles.allocationCell}`)).not.toBeNull();
  });
});
