import { useEffect } from 'react';
import { usePortfolioStore } from '@lib/store';

export function useMobileDetect() {
  const setIsMobile = usePortfolioStore((state) => state.setIsMobile);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);
}
