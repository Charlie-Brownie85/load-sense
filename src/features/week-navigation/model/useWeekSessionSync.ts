"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { RefObject } from "react";
import { smoothScrollTo } from "@/shared/lib/smooth-scroll";

interface UseWeekSessionSyncOptions {
  containerRef: RefObject<HTMLElement | null>;
}

interface UseWeekSessionSyncResult {
  activeWeekKey: string | null;
  scrollToWeek: (weekKey: string) => void;
}

export function useWeekSessionSync({
  containerRef,
}: UseWeekSessionSyncOptions): UseWeekSessionSyncResult {
  const [activeWeekKey, setActiveWeekKey] = useState<string | null>(null);
  const programmaticScroll = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dividers = container.querySelectorAll<HTMLElement>("[data-week]");
    if (dividers.length > 0 && !activeWeekKey) {
      const firstWeek = dividers[0].getAttribute("data-week");
      if (firstWeek) setActiveWeekKey(firstWeek);
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (programmaticScroll.current) return;

        const visibleDividers = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort(
            (a, b) =>
              a.getBoundingClientRect().top - b.getBoundingClientRect().top,
          );

        if (visibleDividers.length > 0) {
          const topmost = visibleDividers[0];
          const weekKey = topmost.getAttribute("data-week");
          if (weekKey) setActiveWeekKey(weekKey);
        }
      },
      {
        root: container,
        rootMargin: "0px 0px -70% 0px",
        threshold: 0,
      },
    );

    dividers.forEach((d) => observerRef.current!.observe(d));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [containerRef, activeWeekKey]);

  const scrollToWeek = useCallback(
    (weekKey: string) => {
      const container = containerRef.current;
      if (!container) return;

      const target = container.querySelector<HTMLElement>(
        `[data-week="${weekKey}"]`,
      );
      if (!target) return;

      programmaticScroll.current = true;
      setActiveWeekKey(weekKey);

      smoothScrollTo(container, target, 400).then(() => {
        programmaticScroll.current = false;
      });
    },
    [containerRef],
  );

  return { activeWeekKey, scrollToWeek };
}
