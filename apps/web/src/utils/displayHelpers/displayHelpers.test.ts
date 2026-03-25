import { describe, it, expect } from 'vitest';
import { formatDisplayDate, getStatusClass } from './displayHelpers';

describe('formatDisplayDate', () => {
  it('returns "-" for null', () => {
    expect(formatDisplayDate(null)).toBe('-');
  });

  it('returns "-" for undefined', () => {
    expect(formatDisplayDate(undefined)).toBe('-');
  });

  it('returns "-" for an invalid Date object', () => {
    expect(formatDisplayDate(new Date('invalid'))).toBe('-');
  });

  it('formats a valid Date object to readable en-GB string', () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024 in local time
    const result = formatDisplayDate(date);
    expect(result).toContain('2024');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
  });

  it('formats an ISO datetime string to readable string', () => {
    const result = formatDisplayDate('2024-06-20T00:00:00Z');
    expect(result).toContain('2024');
    expect(result).toContain('Jun');
  });

  it('formats an ISO date-only string to readable string', () => {
    const result = formatDisplayDate('2024-03-10');
    expect(result).toContain('2024');
    expect(result).toContain('Mar');
  });

  it('formats a DD-MM-YYYY fallback string to readable string', () => {
    const result = formatDisplayDate('15-01-2024');
    expect(result).toContain('2024');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
  });

  it('returns the original string when it cannot be parsed at all', () => {
    const unparseable = 'not-a-date-at-all';
    const result = formatDisplayDate(unparseable);
    expect(typeof result).toBe('string');
    expect(result).not.toBe('-');
  });

  it('returns "-" for empty string', () => {
    // Empty string is falsy, so early return kicks in
    expect(formatDisplayDate('')).toBe('-');
  });
});

describe('getStatusClass', () => {
  it('returns status-active for Active', () => {
    expect(getStatusClass('Active')).toBe('status-active');
  });

  it('returns status-pending for Pending', () => {
    expect(getStatusClass('Pending')).toBe('status-pending');
  });

  it('returns status-completed for Completed', () => {
    expect(getStatusClass('Completed')).toBe('status-completed');
  });

  it('returns status-onhold for On Hold', () => {
    expect(getStatusClass('On Hold')).toBe('status-onhold');
  });

  it('returns status-cancelled for Cancelled', () => {
    expect(getStatusClass('Cancelled')).toBe('status-cancelled');
  });

  it('returns status-default for unknown status', () => {
    expect(getStatusClass('SomethingElse')).toBe('status-default');
  });

  it('returns status-default for empty string', () => {
    expect(getStatusClass('')).toBe('status-default');
  });

  it('is case-sensitive (active !== Active)', () => {
    expect(getStatusClass('active')).toBe('status-default');
  });
});
