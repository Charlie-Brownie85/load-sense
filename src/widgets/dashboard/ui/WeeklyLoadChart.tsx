"use client";

import { useState } from "react";
import type { WeeklyLoadRange } from "@/shared/lib/workload";

interface WeeklyLoadChartProps {
  weeklyLoadRanges: WeeklyLoadRange[];
}

function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const startDay = start.getDate();
  const endDay = end.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}–${endDay}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
}

export function WeeklyLoadChart({ weeklyLoadRanges }: WeeklyLoadChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const loads = weeklyLoadRanges.map((r) => r.load);
  const maxLoad = Math.max(...loads, 1);
  const avgLoad =
    loads.length > 0
      ? Math.round(loads.reduce((a, b) => a + b, 0) / loads.length)
      : 0;

  const getBarColor = (index: number): string => {
    if (index === weeklyLoadRanges.length - 1)
      return "bg-primary shadow-[0_-4px_12px_rgba(17,82,212,0.3)]";
    const opacities = ["bg-primary/20", "bg-primary/30", "bg-primary/40", "bg-primary/30"];
    return opacities[index % opacities.length] || "bg-primary/20";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-tight">
        Weekly Training Load
      </h3>
      <div
        className="flex items-end justify-between h-48 gap-3 px-2"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {weeklyLoadRanges.map((range, i) => {
          const isDimmed = hoveredIndex !== null && hoveredIndex !== i;
          const isHovered = hoveredIndex === i;
          const pct = (range.load / maxLoad) * 100;

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
              onMouseEnter={() => setHoveredIndex(i)}
            >
              <div
                className="relative w-full"
                style={{
                  height: `${pct}%`,
                  minHeight: range.load > 0 ? "4px" : "0",
                }}
              >
                <div
                  className={`w-full h-full rounded-t-sm transition-opacity duration-200 ${getBarColor(i)} ${isDimmed ? "opacity-30" : ""}`}
                />
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 px-3 py-2 text-xs font-medium text-white bg-slate-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                    {range.load.toLocaleString()} AU
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-t-slate-800 border-x-transparent border-b-transparent" />
                  </div>
                )}
              </div>
              <span
                className={`text-[9px] font-bold leading-tight text-center ${
                  i === weeklyLoadRanges.length - 1
                    ? "text-primary"
                    : "text-slate-400"
                }`}
              >
                {formatDateRange(range.startDate, range.endDate)}
              </span>
            </div>
          );
        })}
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
