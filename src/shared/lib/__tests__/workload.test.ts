import { describe, it, expect } from 'vitest';
import {
  computeSessionLoad,
  computeAcuteLoad,
  computeChronicLoad,
  computeACWR,
  classifyStatus,
  computeWeeklyLoads,
  computeWeeklyLoadRanges,
} from '../workload';

describe('computeSessionLoad', () => {
  it('multiplies duration by RPE', () => {
    expect(computeSessionLoad(45, 8)).toBe(360);
  });

  it('returns 0 for zero duration', () => {
    expect(computeSessionLoad(0, 8)).toBe(0);
  });

  it('returns 0 for zero RPE', () => {
    expect(computeSessionLoad(45, 0)).toBe(0);
  });
});

describe('computeAcuteLoad', () => {
  const ref = new Date('2026-02-20');

  it('sums loads within the 7-day window', () => {
    const sessions = [
      { date: '2026-02-18', duration: 30, rpe: 6 },
      { date: '2026-02-15', duration: 45, rpe: 8 },
    ];
    expect(computeAcuteLoad(sessions, ref)).toBe(30 * 6 + 45 * 8);
  });

  it('excludes sessions outside the 7-day window', () => {
    const sessions = [
      { date: '2026-02-18', duration: 30, rpe: 6 },
      { date: '2026-02-10', duration: 45, rpe: 8 },
    ];
    expect(computeAcuteLoad(sessions, ref)).toBe(30 * 6);
  });

  it('returns 0 with no sessions', () => {
    expect(computeAcuteLoad([], ref)).toBe(0);
  });
});

describe('computeChronicLoad', () => {
  const ref = new Date('2026-02-20');

  it('averages total load across 4 weeks', () => {
    const sessions = [
      { date: '2026-02-18', duration: 40, rpe: 5 },
      { date: '2026-02-05', duration: 60, rpe: 7 },
    ];
    const total = 40 * 5 + 60 * 7;
    expect(computeChronicLoad(sessions, ref)).toBe(total / 4);
  });

  it('returns 0 with no sessions', () => {
    expect(computeChronicLoad([], ref)).toBe(0);
  });
});

describe('computeACWR', () => {
  it('returns ratio when chronic load > 0', () => {
    expect(computeACWR(200, 100)).toBe(2);
  });

  it('returns null when chronic load is 0', () => {
    expect(computeACWR(100, 0)).toBeNull();
  });

  it('returns 0 when acute load is 0 and chronic > 0', () => {
    expect(computeACWR(0, 150)).toBe(0);
  });
});

describe('classifyStatus', () => {
  it("returns 'Insufficient Data' for null", () => {
    expect(classifyStatus(null)).toBe('Insufficient Data');
  });

  it("returns 'Undertraining' below 0.8", () => {
    expect(classifyStatus(0.5)).toBe('Undertraining');
    expect(classifyStatus(0.79)).toBe('Undertraining');
  });

  it("returns 'Optimal Zone' at exactly 0.8 (lower boundary)", () => {
    expect(classifyStatus(0.8)).toBe('Optimal Zone');
  });

  it("returns 'Optimal Zone' at 1.0", () => {
    expect(classifyStatus(1.0)).toBe('Optimal Zone');
  });

  it("returns 'Optimal Zone' at exactly 1.3 (upper boundary)", () => {
    expect(classifyStatus(1.3)).toBe('Optimal Zone');
  });

  it("returns 'Fatigue Risk' above 1.3 up to 1.5", () => {
    expect(classifyStatus(1.31)).toBe('Fatigue Risk');
    expect(classifyStatus(1.5)).toBe('Fatigue Risk');
  });

  it("returns 'High Injury Risk' above 1.5", () => {
    expect(classifyStatus(1.51)).toBe('High Injury Risk');
    expect(classifyStatus(2.0)).toBe('High Injury Risk');
  });
});

describe('computeWeeklyLoads', () => {
  const ref = new Date('2026-02-20');

  it('returns array of length weekCount', () => {
    const result = computeWeeklyLoads([], ref, 5);
    expect(result).toHaveLength(5);
  });

  it('returns all zeros with no sessions', () => {
    const result = computeWeeklyLoads([], ref, 3);
    expect(result).toEqual([0, 0, 0]);
  });

  it('places sessions in correct week buckets', () => {
    const sessions = [{ date: '2026-02-19', duration: 30, rpe: 5 }];
    const result = computeWeeklyLoads(sessions, ref, 2);
    expect(result[result.length - 1]).toBe(150);
  });
});

describe('computeWeeklyLoadRanges', () => {
  const ref = new Date('2026-02-20'); // Thursday

  it('returns array of length weekCount', () => {
    const result = computeWeeklyLoadRanges([], ref, 5);
    expect(result).toHaveLength(5);
  });

  it('returns ranges with Monday start dates', () => {
    const result = computeWeeklyLoadRanges([], ref, 3);
    for (const range of result) {
      const start = new Date(range.startDate);
      expect(start.getDay()).toBe(1); // Monday
    }
  });

  it('returns ranges with Sunday end dates', () => {
    const result = computeWeeklyLoadRanges([], ref, 3);
    for (const range of result) {
      const end = new Date(range.endDate);
      expect(end.getDay()).toBe(0); // Sunday
    }
  });

  it('sums loads within each Mon-Sun week', () => {
    const sessions = [
      { date: '2026-02-17', duration: 30, rpe: 5 }, // Monday of current week
      { date: '2026-02-19', duration: 20, rpe: 4 }, // Wednesday of current week
    ];
    const result = computeWeeklyLoadRanges(sessions, ref, 2);
    const currentWeek = result[result.length - 1];
    expect(currentWeek.load).toBe(30 * 5 + 20 * 4);
  });

  it('returns ISO date strings', () => {
    const result = computeWeeklyLoadRanges([], ref, 1);
    expect(() => new Date(result[0].startDate)).not.toThrow();
    expect(() => new Date(result[0].endDate)).not.toThrow();
  });

  it('returns zero load for weeks with no sessions', () => {
    const result = computeWeeklyLoadRanges([], ref, 3);
    for (const range of result) {
      expect(range.load).toBe(0);
    }
  });
});
