import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWeekSessionSync } from '../model/useWeekSessionSync';

vi.mock('@/shared/lib/smooth-scroll', () => ({
  smoothScrollTo: vi.fn(() => Promise.resolve()),
}));

function createMockContainer(weekKeys: string[]): HTMLDivElement {
  const container = document.createElement('div');

  weekKeys.forEach((key) => {
    const divider = document.createElement('div');
    divider.setAttribute('data-week', key);
    container.appendChild(divider);
  });

  return container;
}

describe('useWeekSessionSync', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = vi.fn();
      takeRecords = vi.fn().mockReturnValue([]);
      root = null;
      rootMargin = '';
      thresholds = [0];
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sets activeWeekKey from first divider on mount', () => {
    const container = createMockContainer(['2026-W07', '2026-W08']);
    const ref = { current: container };

    const { result } = renderHook(() =>
      useWeekSessionSync({ containerRef: ref }),
    );

    expect(result.current.activeWeekKey).toBe('2026-W07');
  });

  it('observes all data-week dividers', () => {
    const container = createMockContainer(['2026-W07', '2026-W08']);
    const ref = { current: container };

    renderHook(() => useWeekSessionSync({ containerRef: ref }));

    // Each divider observed (may be called multiple times due to effect re-runs)
    expect(mockObserve).toHaveBeenCalled();
    const observedElements = mockObserve.mock.calls.map(
      (call: HTMLElement[]) => call[0],
    );
    const uniqueWeekKeys = [
      ...new Set(
        observedElements.map((el: HTMLElement) =>
          el.getAttribute('data-week'),
        ),
      ),
    ];
    expect(uniqueWeekKeys).toContain('2026-W07');
    expect(uniqueWeekKeys).toContain('2026-W08');
  });

  it('updates activeWeekKey when observer fires', () => {
    const container = createMockContainer(['2026-W07', '2026-W08']);
    const ref = { current: container };

    const { result } = renderHook(() =>
      useWeekSessionSync({ containerRef: ref }),
    );

    const dividerW08 = container.querySelector('[data-week="2026-W08"]')!;
    vi.spyOn(dividerW08, 'getBoundingClientRect').mockReturnValue({
      top: 50,
      left: 0,
      right: 800,
      bottom: 70,
      width: 800,
      height: 20,
      x: 0,
      y: 50,
      toJSON: () => {},
    });

    act(() => {
      observerCallback(
        [
          {
            isIntersecting: true,
            target: dividerW08,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(result.current.activeWeekKey).toBe('2026-W08');
  });

  it('scrollToWeek calls smoothScrollTo', async () => {
    const { smoothScrollTo } = await import('@/shared/lib/smooth-scroll');
    const container = createMockContainer(['2026-W07', '2026-W08']);
    const ref = { current: container };

    const { result } = renderHook(() =>
      useWeekSessionSync({ containerRef: ref }),
    );

    act(() => {
      result.current.scrollToWeek('2026-W08');
    });

    expect(smoothScrollTo).toHaveBeenCalled();
    expect(result.current.activeWeekKey).toBe('2026-W08');
  });
});
