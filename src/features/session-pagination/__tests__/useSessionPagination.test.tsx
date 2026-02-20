import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useSessionPagination } from '../model/useSessionPagination';
import type { Session } from '@/shared/types';

function makeSession(id: number, date: string): Session {
  return {
    id,
    date,
    type: 'Strength',
    duration: 60,
    rpe: 7,
    notes: null,
    createdAt: date,
    updatedAt: date,
  };
}

const page1: Session[] = [
  makeSession(3, '2026-02-20T10:00:00Z'),
  makeSession(2, '2026-02-18T10:00:00Z'),
];

const page2: Session[] = [makeSession(1, '2026-02-15T10:00:00Z')];

function TestComponent({
  initialSessions,
  initialNextCursor,
  initialHasMore,
}: {
  initialSessions: Session[];
  initialNextCursor: number | null;
  initialHasMore: boolean;
}) {
  const { sessions, isLoading, sentinelRef } = useSessionPagination({
    initialSessions,
    initialNextCursor,
    initialHasMore,
  });

  return (
    <div>
      <div data-testid="count">{sessions.length}</div>
      <div data-testid="loading">{String(isLoading)}</div>
      {sessions.map((s) => (
        <div key={s.id} data-testid={`session-${s.id}`}>
          {s.id}
        </div>
      ))}
      <div ref={sentinelRef} data-testid="sentinel" />
    </div>
  );
}

describe('useSessionPagination', () => {
  let observerCallback: IntersectionObserverCallback;
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;

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

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              sessions: page2,
              nextCursor: null,
              hasMore: false,
            }),
        }),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial sessions', () => {
    render(
      <TestComponent
        initialSessions={page1}
        initialNextCursor={2}
        initialHasMore={true}
      />,
    );

    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });

  it('fetches next page on sentinel intersection', async () => {
    render(
      <TestComponent
        initialSessions={page1}
        initialNextCursor={2}
        initialHasMore={true}
      />,
    );

    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('3');
    });

    expect(fetch).toHaveBeenCalledWith('/api/sessions?cursor=2&limit=20');
  });

  it('stops fetching when hasMore is false', () => {
    render(
      <TestComponent
        initialSessions={page1}
        initialNextCursor={null}
        initialHasMore={false}
      />,
    );

    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('shows loading state during fetch', async () => {
    let resolveJson: (value: unknown) => void;
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveJson = (data) =>
              resolve({ json: () => Promise.resolve(data) });
          }),
      ),
    );

    render(
      <TestComponent
        initialSessions={page1}
        initialNextCursor={2}
        initialHasMore={true}
      />,
    );

    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('true');
    });

    resolveJson!({ sessions: page2, nextCursor: null, hasMore: false });

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
  });
});
