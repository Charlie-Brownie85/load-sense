import type { TrainingStatus } from '@/shared/types';

export const ACUTE_WINDOW_DAYS = 7;
export const CHRONIC_WINDOW_DAYS = 28;
export const CHRONIC_WEEKS = 4;

export const ACWR_THRESHOLDS = {
  undertraining: 0.8,
  optimalUpper: 1.3,
  fatigueUpper: 1.5,
} as const;

interface SessionInput {
  date: Date | string;
  duration: number;
  rpe: number;
}

function toDate(d: Date | string): Date {
  return typeof d === 'string' ? new Date(d) : d;
}

function startOfDay(d: Date): Date {
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
}

function filterSessionsInWindow(
  sessions: SessionInput[],
  referenceDate: Date,
  windowDays: number,
): SessionInput[] {
  const ref = startOfDay(referenceDate);
  const windowStart = new Date(ref);
  windowStart.setDate(windowStart.getDate() - (windowDays - 1));

  return sessions.filter((s) => {
    const sessionDate = startOfDay(toDate(s.date));
    return sessionDate >= windowStart && sessionDate <= ref;
  });
}

export function computeSessionLoad(duration: number, rpe: number): number {
  return duration * rpe;
}

export function computeAcuteLoad(
  sessions: SessionInput[],
  referenceDate: Date = new Date(),
): number {
  const windowSessions = filterSessionsInWindow(
    sessions,
    referenceDate,
    ACUTE_WINDOW_DAYS,
  );
  return windowSessions.reduce(
    (sum, s) => sum + computeSessionLoad(s.duration, s.rpe),
    0,
  );
}

export function computeChronicLoad(
  sessions: SessionInput[],
  referenceDate: Date = new Date(),
): number {
  const windowSessions = filterSessionsInWindow(
    sessions,
    referenceDate,
    CHRONIC_WINDOW_DAYS,
  );
  const total = windowSessions.reduce(
    (sum, s) => sum + computeSessionLoad(s.duration, s.rpe),
    0,
  );
  return total / CHRONIC_WEEKS;
}

export function computeACWR(
  acuteLoad: number,
  chronicLoad: number,
): number | null {
  if (chronicLoad === 0) return null;
  return acuteLoad / chronicLoad;
}

export function classifyStatus(acwr: number | null): TrainingStatus {
  if (acwr === null) return 'Insufficient Data';
  if (acwr < ACWR_THRESHOLDS.undertraining) return 'Undertraining';
  if (acwr <= ACWR_THRESHOLDS.optimalUpper) return 'Optimal Zone';
  if (acwr <= ACWR_THRESHOLDS.fatigueUpper) return 'Fatigue Risk';
  return 'High Injury Risk';
}

export function computeWeeklyLoads(
  sessions: SessionInput[],
  referenceDate: Date = new Date(),
  weekCount: number = 5,
): number[] {
  const ref = startOfDay(referenceDate);
  const loads: number[] = [];

  for (let w = weekCount - 1; w >= 0; w--) {
    const weekEnd = new Date(ref);
    weekEnd.setDate(weekEnd.getDate() - w * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    const weekTotal = sessions
      .filter((s) => {
        const d = startOfDay(toDate(s.date));
        return d >= weekStart && d <= weekEnd;
      })
      .reduce((sum, s) => sum + computeSessionLoad(s.duration, s.rpe), 0);

    loads.push(weekTotal);
  }

  return loads;
}

export interface WeeklyLoadRange {
  load: number;
  startDate: string;
  endDate: string;
}

function getMondayOfWeek(d: Date): Date {
  const result = new Date(d);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  return startOfDay(result);
}

function getSundayOfWeek(d: Date): Date {
  const monday = getMondayOfWeek(d);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return startOfDay(sunday);
}

export function computeWeeklyLoadRanges(
  sessions: SessionInput[],
  referenceDate: Date = new Date(),
  weekCount: number = 5,
): WeeklyLoadRange[] {
  const ref = startOfDay(referenceDate);
  const currentSunday = getSundayOfWeek(ref);
  const ranges: WeeklyLoadRange[] = [];

  for (let w = weekCount - 1; w >= 0; w--) {
    const weekEnd = new Date(currentSunday);
    weekEnd.setDate(currentSunday.getDate() - w * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);

    const weekTotal = sessions
      .filter((s) => {
        const d = startOfDay(toDate(s.date));
        return d >= weekStart && d <= weekEnd;
      })
      .reduce((sum, s) => sum + computeSessionLoad(s.duration, s.rpe), 0);

    ranges.push({
      load: weekTotal,
      startDate: weekStart.toISOString(),
      endDate: weekEnd.toISOString(),
    });
  }

  return ranges;
}

export function getDataSufficiencyFlags(
  sessions: SessionInput[],
  referenceDate: Date = new Date(),
): { isAcuteIncomplete: boolean; isChronicUnstable: boolean } {
  if (sessions.length === 0) {
    return { isAcuteIncomplete: true, isChronicUnstable: true };
  }

  const ref = startOfDay(referenceDate);
  const dates = sessions.map((s) => startOfDay(toDate(s.date)));
  const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));

  const daySpan =
    Math.floor((ref.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24)) +
    1;

  return {
    isAcuteIncomplete: daySpan < ACUTE_WINDOW_DAYS,
    isChronicUnstable: daySpan < CHRONIC_WINDOW_DAYS,
  };
}

export function computeWeekSpan(
  sessions: { date: Date | string }[],
  now: Date,
): number {
  if (sessions.length === 0) return 1;
  const dates = sessions.map((s) =>
    typeof s.date === 'string' ? new Date(s.date) : s.date,
  );
  const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
  const diffMs = now.getTime() - earliest.getTime();
  const diffWeeks = Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.max(diffWeeks + 1, 1);
}
