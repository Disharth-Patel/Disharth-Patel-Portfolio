import { create } from 'zustand';

interface PortfolioStore {
  scrollProgress: number;          // Global 0–1 scroll progress
  activeSection: number;           // Index of current visible section (0–5)
  isMobile: boolean;               // True if viewport width < 768px
  animationsDisabled: boolean;     // True if prefers-reduced-motion is set
  setScrollProgress: (v: number) => void;
  setActiveSection: (i: number) => void;
  setIsMobile: (v: boolean) => void;
  setAnimationsDisabled: (v: boolean) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  scrollProgress: 0,
  activeSection: 0,
  isMobile: false,
  animationsDisabled: false,
  setScrollProgress: (v) => set({ scrollProgress: v }),
  setActiveSection: (i) => set({ activeSection: i }),
  setIsMobile: (v) => set({ isMobile: v }),
  setAnimationsDisabled: (v) => set({ animationsDisabled: v }),
}));
