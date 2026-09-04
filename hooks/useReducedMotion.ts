import { useEffect } from 'react';
import { usePortfolioStore } from '@lib/store';

export function useReducedMotion() {
  const setAnimationsDisabled = usePortfolioStore((state) => state.setAnimationsDisabled);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setAnimationsDisabled(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setAnimationsDisabled(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [setAnimationsDisabled]);
}
