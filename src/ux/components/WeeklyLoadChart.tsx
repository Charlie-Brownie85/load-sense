interface WeeklyLoadChartProps {
  weeklyLoads: number[];
}

export function WeeklyLoadChart({ weeklyLoads }: WeeklyLoadChartProps) {
  const maxLoad = Math.max(...weeklyLoads, 1);
  const avgLoad =
    weeklyLoads.length > 0
      ? Math.round(weeklyLoads.reduce((a, b) => a + b, 0) / weeklyLoads.length)
      : 0;

  const getWeekLabel = (index: number, total: number): string => {
    if (index === total - 1) return "Current";
    const weeksAgo = total - 1 - index;
    return `W-${weeksAgo}`;
  };

  const getBarOpacity = (index: number, total: number): string => {
    if (index === total - 1) return "bg-primary shadow-[0_-4px_12px_rgba(17,82,212,0.3)]";
    const opacities = ["bg-primary/20", "bg-primary/30", "bg-primary/40", "bg-primary/30"];
    return opacities[index % opacities.length] || "bg-primary/20";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-tight">
        Weekly Training Load
      </h3>
      <div className="flex items-end justify-between h-48 gap-3 px-2">
        {weeklyLoads.map((load, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
          >
            <div
              className={`w-full rounded-t-sm ${getBarOpacity(i, weeklyLoads.length)}`}
              style={{ height: `${(load / maxLoad) * 100}%`, minHeight: load > 0 ? "4px" : "0" }}
            />
            <span
              className={`text-[10px] font-bold uppercase ${
                i === weeklyLoads.length - 1 ? "text-primary" : "text-slate-400"
              }`}
            >
              {getWeekLabel(i, weeklyLoads.length)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-500 font-medium">Avg. Weekly Load</p>
          <p className="text-sm font-bold text-slate-900">
            {avgLoad.toLocaleString()} AU
          </p>
        </div>
      </div>
    </div>
  );
}
