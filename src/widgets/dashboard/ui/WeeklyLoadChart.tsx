"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { WeeklyLoadRange } from "@/shared/lib/workload";
import { getISOWeekKey } from "@/shared/lib/week";

interface WeeklyLoadChartProps {
  weeklyLoadRanges: WeeklyLoadRange[];
  activeWeekKey?: string;
  onWeekClick?: (weekKey: string) => void;
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

export function WeeklyLoadChart({
  weeklyLoadRanges,
  activeWeekKey,
  onWeekClick,
}: WeeklyLoadChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const loads = weeklyLoadRanges.map((r) => r.load);
  const maxLoad = Math.max(...loads, 1);
  const avgLoad =
    loads.length > 0
      ? Math.round(loads.reduce((a, b) => a + b, 0) / loads.length)
      : 0;

  const updateScrollIndicator = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
  }, []);

  // Scroll to rightmost on mount
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth - el.clientWidth;
    updateScrollIndicator();
  }, [weeklyLoadRanges, updateScrollIndicator]);

  // Auto-scroll to active week when it changes
  useEffect(() => {
    if (!activeWeekKey || !scrollRef.current) return;
    const bar = scrollRef.current.querySelector<HTMLElement>(
      `[data-week="${activeWeekKey}"]`,
    );
    if (!bar) return;

    const container = scrollRef.current;
    const barLeft = bar.offsetLeft;
    const barWidth = bar.offsetWidth;
    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    if (
      barLeft < scrollLeft ||
      barLeft + barWidth > scrollLeft + containerWidth
    ) {
      container.scrollTo({
        left: barLeft - containerWidth / 2 + barWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeWeekKey]);

  const getBarColor = (weekKey: string, index: number): string => {
    if (activeWeekKey) {
      return weekKey === activeWeekKey
        ? "bg-primary shadow-[0_-4px_12px_rgba(17,82,212,0.3)]"
        : "bg-primary/25";
    }
    if (index === weeklyLoadRanges.length - 1)
      return "bg-primary shadow-[0_-4px_12px_rgba(17,82,212,0.3)]";
    const opacities = [
      "bg-primary/20",
      "bg-primary/30",
      "bg-primary/40",
      "bg-primary/30",
    ];
    return opacities[index % opacities.length] || "bg-primary/20";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-tight">
        Weekly Training Load
      </h3>
      <div className="relative">
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-7 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        )}
        <div
          ref={scrollRef}
          className="overflow-x-auto flex h-48 gap-3 px-2 scrollbar-none"
          onScroll={updateScrollIndicator}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {weeklyLoadRanges.map((range, i) => {
            const weekKey = getISOWeekKey(range.startDate);
            const isDimmed = hoveredIndex !== null && hoveredIndex !== i;
            const isHovered = hoveredIndex === i;
            const pct = (range.load / maxLoad) * 100;

            return (
              <div
                key={weekKey}
                data-week={weekKey}
                className="flex flex-col items-center h-full cursor-pointer"
                style={{ minWidth: "56px", flex: "0 0 56px" }}
                onMouseEnter={() => setHoveredIndex(i)}
                onClick={() => onWeekClick?.(weekKey)}
              >
                <div className="flex-1 w-full flex items-end">
                  <div
                    className="relative w-full"
                    style={{
                      height: `${pct}%`,
                      minHeight: range.load > 0 ? "4px" : "0",
                    }}
                  >
                    <div
                      className={`w-full h-full rounded-t-sm transition-opacity duration-200 ${getBarColor(weekKey, i)} ${isDimmed ? "opacity-30" : ""}`}
                    />
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 px-3 py-2 text-xs font-medium text-white bg-slate-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                        {range.load.toLocaleString()} AU
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-t-slate-800 border-x-transparent border-b-transparent" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-7 flex items-start justify-center pt-2">
                  <span
                    className={`text-[9px] font-bold leading-tight text-center ${
                      activeWeekKey === weekKey
                        ? "text-primary"
                        : "text-slate-400"
                    }`}
                  >
                    {formatDateRange(range.startDate, range.endDate)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
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
