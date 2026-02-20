interface WeekDividerProps {
  weekKey: string;
  startDate: string;
  endDate: string;
}

function formatWeekRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const startDay = start.getDate();
  const endDay = end.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
}

export function WeekDivider({ weekKey, startDate, endDate }: WeekDividerProps) {
  return (
    <div data-week={weekKey} className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
        {formatWeekRange(startDate, endDate)}
      </span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
