function toDate(d: Date | string): Date {
  return typeof d === 'string' ? new Date(d) : d;
}

function startOfDay(d: Date): Date {
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Returns the ISO week number and year for a given date.
 * ISO weeks start on Monday. Week 1 is the week containing the first Thursday of the year.
 */
function isoWeekNumber(d: Date): { year: number; week: number } {
  const date = startOfDay(d);
  // Thursday of the current week determines the year
  const day = date.getDay();
  const diff = day === 0 ? -3 : 4 - day;
  const thursday = new Date(date);
  thursday.setDate(date.getDate() + diff);

  const year = thursday.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const dayOfYear =
    Math.floor((thursday.getTime() - jan1.getTime()) / 86400000) + 1;
  const week = Math.ceil(dayOfYear / 7);

  return { year, week };
}

export function getISOWeekKey(date: Date | string): string {
  const d = toDate(date);
  const { year, week } = isoWeekNumber(d);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function getWeekBounds(weekKey: string): { start: Date; end: Date } {
  const match = weekKey.match(/^(\d{4})-W(\d{2})$/);
  if (!match) throw new Error(`Invalid week key: ${weekKey}`);

  const year = Number(match[1]);
  const week = Number(match[2]);

  // Jan 4 is always in week 1 of its ISO year
  const jan4 = new Date(year, 0, 4);
  const jan4Day = jan4.getDay() || 7; // Convert Sunday=0 to 7
  // Monday of week 1
  const week1Monday = new Date(jan4);
  week1Monday.setDate(jan4.getDate() - (jan4Day - 1));

  const monday = new Date(week1Monday);
  monday.setDate(week1Monday.getDate() + (week - 1) * 7);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { start: startOfDay(monday), end: startOfDay(sunday) };
}
