import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WeeklyLoadChart } from "../ui/WeeklyLoadChart";
import type { WeeklyLoadRange } from "@/shared/lib/workload";

const mockRanges: WeeklyLoadRange[] = [
  {
    load: 1200,
    startDate: "2026-02-02T00:00:00.000Z",
    endDate: "2026-02-08T00:00:00.000Z",
  },
  {
    load: 1500,
    startDate: "2026-02-09T00:00:00.000Z",
    endDate: "2026-02-15T00:00:00.000Z",
  },
  {
    load: 1800,
    startDate: "2026-02-16T00:00:00.000Z",
    endDate: "2026-02-22T00:00:00.000Z",
  },
];

describe("WeeklyLoadChart", () => {
  it("renders all week bars with data-week attributes", () => {
    const { container } = render(
      <WeeklyLoadChart weeklyLoadRanges={mockRanges} />,
    );
    const bars = container.querySelectorAll("[data-week]");
    expect(bars).toHaveLength(3);
  });

  it("renders date range labels", () => {
    render(<WeeklyLoadChart weeklyLoadRanges={mockRanges} />);
    expect(screen.getByText("Feb 2–8")).toBeInTheDocument();
    expect(screen.getByText("Feb 9–15")).toBeInTheDocument();
    expect(screen.getByText("Feb 16–22")).toBeInTheDocument();
  });

  it("renders average weekly load", () => {
    render(<WeeklyLoadChart weeklyLoadRanges={mockRanges} />);
    expect(screen.getByText("1,500 AU")).toBeInTheDocument();
  });

  it("calls onWeekClick when a bar is clicked", () => {
    const onWeekClick = vi.fn();
    const { container } = render(
      <WeeklyLoadChart
        weeklyLoadRanges={mockRanges}
        onWeekClick={onWeekClick}
      />,
    );

    const bars = container.querySelectorAll("[data-week]");
    fireEvent.click(bars[1]);

    expect(onWeekClick).toHaveBeenCalledTimes(1);
    expect(onWeekClick).toHaveBeenCalledWith(
      expect.stringMatching(/^\d{4}-W\d{2}$/),
    );
  });

  it("highlights active week bar", () => {
    const { container } = render(
      <WeeklyLoadChart
        weeklyLoadRanges={mockRanges}
        activeWeekKey="2026-W07"
      />,
    );

    const activeBar = container.querySelector('[data-week="2026-W07"]');
    expect(activeBar).toBeInTheDocument();
    const label = activeBar?.querySelector("span");
    expect(label?.className).toContain("text-primary");
  });
});
