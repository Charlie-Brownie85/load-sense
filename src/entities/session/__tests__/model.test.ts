import { describe, it, expect } from 'vitest';
import { getRpeIntensityColor, formatAbsoluteDate } from '../model';

describe('getRpeIntensityColor', () => {
  it('returns emerald for low RPE (1-3)', () => {
    expect(getRpeIntensityColor(1)).toBe('border-l-emerald-400');
    expect(getRpeIntensityColor(3)).toBe('border-l-emerald-400');
  });
  it('returns amber for medium RPE (4-6)', () => {
    expect(getRpeIntensityColor(4)).toBe('border-l-amber-400');
    expect(getRpeIntensityColor(6)).toBe('border-l-amber-400');
  });
  it('returns red for high RPE (7-10)', () => {
    expect(getRpeIntensityColor(7)).toBe('border-l-red-400');
    expect(getRpeIntensityColor(10)).toBe('border-l-red-400');
  });
});

describe('formatAbsoluteDate', () => {
  it('formats date as short month + day', () => {
    expect(formatAbsoluteDate('2026-02-20T00:00:00Z')).toBe('Feb 20');
  });
});
