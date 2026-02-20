import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { smoothScrollTo } from "../smooth-scroll";

describe("smoothScrollTo", () => {
  let container: HTMLElement;
  let target: HTMLElement;
  let rafCallbacks: ((time: number) => void)[];

  beforeEach(() => {
    rafCallbacks = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    container = document.createElement("div");
    Object.defineProperty(container, "scrollTop", {
      writable: true,
      value: 0,
    });

    target = document.createElement("div");

    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      top: 300,
      left: 0,
      right: 800,
      bottom: 320,
      width: 800,
      height: 20,
      x: 0,
      y: 300,
      toJSON: () => {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function flushRaf(time: number) {
    const cbs = [...rafCallbacks];
    rafCallbacks = [];
    cbs.forEach((cb) => cb(time));
  }

  it("scrolls to target position", async () => {
    const promise = smoothScrollTo(container, target, 400);

    // Run through animation
    flushRaf(0);
    flushRaf(200);
    flushRaf(400);

    await promise;
    expect(container.scrollTop).toBe(300);
  });

  it("resolves promise on completion", async () => {
    const promise = smoothScrollTo(container, target, 100);
    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    flushRaf(0);
    expect(resolved).toBe(false);

    flushRaf(100);
    await promise;
    expect(resolved).toBe(true);
  });

  it("resolves immediately when already at target", async () => {
    vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
      top: 0,
      left: 0,
      right: 800,
      bottom: 20,
      width: 800,
      height: 20,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const promise = smoothScrollTo(container, target, 400);
    await promise;
    expect(rafCallbacks).toHaveLength(0);
  });

  it("respects custom duration", async () => {
    const promise = smoothScrollTo(container, target, 200);

    flushRaf(0);
    flushRaf(100);
    // At 100ms/200ms, should be roughly halfway through easing
    const midScroll = container.scrollTop;
    expect(midScroll).toBeGreaterThan(0);
    expect(midScroll).toBeLessThan(300);

    flushRaf(200);
    await promise;
    expect(container.scrollTop).toBe(300);
  });
});
