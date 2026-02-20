'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Session, PaginatedSessionsResponse } from '@/shared/types';

interface UseSessionPaginationOptions {
  initialSessions: Session[];
  initialNextCursor: number | null;
  initialHasMore: boolean;
}

interface UseSessionPaginationResult {
  sessions: Session[];
  isLoading: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  reset: (
    sessions: Session[],
    nextCursor: number | null,
    hasMore: boolean,
  ) => void;
}

export function useSessionPagination({
  initialSessions,
  initialNextCursor,
  initialHasMore,
}: UseSessionPaginationOptions): UseSessionPaginationResult {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [nextCursor, setNextCursor] = useState<number | null>(
    initialNextCursor,
  );
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);

  const fetchNextPage = useCallback(async () => {
    if (fetchingRef.current || !hasMore || nextCursor === null) return;
    fetchingRef.current = true;
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/sessions?cursor=${nextCursor}&limit=20`,
      );
      const data: PaginatedSessionsResponse = await res.json();

      setSessions((prev) => [...prev, ...data.sessions]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [hasMore, nextCursor]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, fetchNextPage]);

  useEffect(() => {
    setSessions(initialSessions);
    setNextCursor(initialNextCursor);
    setHasMore(initialHasMore);
  }, [initialSessions, initialNextCursor, initialHasMore]);

  const reset = useCallback(
    (newSessions: Session[], newCursor: number | null, newHasMore: boolean) => {
      setSessions(newSessions);
      setNextCursor(newCursor);
      setHasMore(newHasMore);
    },
    [],
  );

  return { sessions, isLoading, sentinelRef, reset };
}
