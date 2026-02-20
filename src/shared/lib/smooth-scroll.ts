function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function smoothScrollTo(
  container: HTMLElement,
  target: HTMLElement,
  duration = 400,
): Promise<void> {
  return new Promise((resolve) => {
    const startY = container.scrollTop;
    const targetY =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      startY;
    const distance = targetY - startY;

    if (Math.abs(distance) < 1) {
      resolve();
      return;
    }

    let startTime: number | null = null;
    let cancelled = false;

    const onUserScroll = () => {
      cancelled = true;
    };

    container.addEventListener('wheel', onUserScroll, { passive: true });
    container.addEventListener('touchmove', onUserScroll, { passive: true });

    function step(timestamp: number) {
      if (cancelled) {
        cleanup();
        resolve();
        return;
      }

      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      container.scrollTop = startY + distance * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        cleanup();
        resolve();
      }
    }

    function cleanup() {
      container.removeEventListener('wheel', onUserScroll);
      container.removeEventListener('touchmove', onUserScroll);
    }

    requestAnimationFrame(step);
  });
}
