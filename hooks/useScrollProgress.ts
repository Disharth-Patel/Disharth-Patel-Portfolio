import { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/lib/store';

export function useScrollProgress(elementId: string) {
  const [progress, setProgress] = useState(0);
  const setGlobalProgress = usePortfolioStore((state) => state.setScrollProgress);

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress based on when the element enters and leaves the viewport
      // 0 = top of element at bottom of viewport
      // 1 = bottom of element at top of viewport
      const start = rect.top - windowHeight;
      const end = -rect.bottom;
      const total = end - start;

      let p = (0 - start) / total;
      p = Math.max(0, Math.min(1, p));

      setProgress(p);
      setGlobalProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementId, setGlobalProgress]);

  return progress;
}
