import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeekDivider } from "../ui/WeekDivider";

describe("WeekDivider", () => {
  it("renders the date range label for same-month range", () => {
    render(
      <WeekDivider
        weekKey="2026-W08"
        startDate="2026-02-16T00:00:00.000Z"
        endDate="2026-02-22T00:00:00.000Z"
      />,
    );
    expect(screen.getByText("Feb 16 – 22")).toBeInTheDocument();
  });

  it("renders cross-month date range", () => {
    render(
      <WeekDivider
        weekKey="2026-W05"
        startDate="2026-01-26T00:00:00.000Z"
        endDate="2026-02-01T00:00:00.000Z"
      />,
    );
    expect(screen.getByText("Jan 26 – Feb 1")).toBeInTheDocument();
  });

  it("renders data-week attribute", () => {
    const { container } = render(
      <WeekDivider
        weekKey="2026-W08"
        startDate="2026-02-16T00:00:00.000Z"
        endDate="2026-02-22T00:00:00.000Z"
      />,
    );
    const divider = container.querySelector('[data-week="2026-W08"]');
    expect(divider).toBeInTheDocument();
  });
});
