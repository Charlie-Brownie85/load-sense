import { describe, it, expect } from "vitest";
import { getISOWeekKey, getWeekBounds } from "../week";

describe("getISOWeekKey", () => {
  it("returns correct week key for a Monday", () => {
    expect(getISOWeekKey(new Date(2026, 1, 16))).toBe("2026-W08");
  });

  it("returns correct week key for a mid-week date (Wednesday)", () => {
    expect(getISOWeekKey(new Date(2026, 1, 18))).toBe("2026-W08");
  });

  it("returns same week key for Sunday as its Monday", () => {
    const monday = new Date(2026, 1, 16);
    const sunday = new Date(2026, 1, 22);
    expect(getISOWeekKey(sunday)).toBe(getISOWeekKey(monday));
  });

  it("handles ISO string input", () => {
    expect(getISOWeekKey("2026-02-18T12:00:00.000Z")).toBe("2026-W08");
  });

  it("handles cross-year week boundary (late December → W01 of next year)", () => {
    // Dec 29, 2025 is a Monday in ISO week 1 of 2026
    expect(getISOWeekKey(new Date(2025, 11, 29))).toBe("2026-W01");
  });

  it("handles first week of year", () => {
    // Jan 1, 2026 is a Thursday → W01
    expect(getISOWeekKey(new Date(2026, 0, 1))).toBe("2026-W01");
  });

  it("handles week 52/53 at end of year", () => {
    // Dec 28, 2025 is a Sunday, part of W52 of 2025
    expect(getISOWeekKey(new Date(2025, 11, 28))).toBe("2025-W52");
  });

  it("pads single-digit week numbers", () => {
    const key = getISOWeekKey(new Date(2026, 0, 5));
    expect(key).toMatch(/^\d{4}-W\d{2}$/);
  });
});

describe("getWeekBounds", () => {
  it("returns Monday to Sunday for a given week key", () => {
    const { start, end } = getWeekBounds("2026-W08");
    expect(start.getDay()).toBe(1); // Monday
    expect(end.getDay()).toBe(0); // Sunday
  });

  it("returns correct dates for W08 2026", () => {
    const { start, end } = getWeekBounds("2026-W08");
    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(1); // February
    expect(start.getDate()).toBe(16);
    expect(end.getDate()).toBe(22);
  });

  it("round-trips with getISOWeekKey", () => {
    const original = new Date(2026, 1, 18); // Wednesday
    const key = getISOWeekKey(original);
    const { start, end } = getWeekBounds(key);
    expect(original.getTime()).toBeGreaterThanOrEqual(start.getTime());
    expect(original.getTime()).toBeLessThanOrEqual(
      end.getTime() + 24 * 60 * 60 * 1000,
    );
  });

  it("handles cross-year week", () => {
    const { start } = getWeekBounds("2026-W01");
    // Week 1 of 2026 starts on Monday Dec 29, 2025
    expect(start.getFullYear()).toBe(2025);
    expect(start.getMonth()).toBe(11);
    expect(start.getDate()).toBe(29);
  });

  it("throws on invalid week key format", () => {
    expect(() => getWeekBounds("2026-08")).toThrow("Invalid week key");
    expect(() => getWeekBounds("invalid")).toThrow("Invalid week key");
  });
});
