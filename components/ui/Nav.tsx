'use client';

import React, { useState, useEffect } from 'react';
import { usePortfolioStore } from '@lib/store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const { activeSection, setActiveSection, isMobile } = usePortfolioStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        // Transition at 80% of hero viewport height
        setIsScrolled(window.scrollY > rect.height * 0.8);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 flex items-center justify-between',
        isScrolled ? 'bg-bg-surface/80 backdrop-blur-md py-3' : 'bg-transparent'
      )}
    >
      <div
        className="text-accent font-display font-semibold text-2xl cursor-pointer"
        onClick={() => scrollTo('hero')}
      >
        DP
      </div>

      {/* Desktop Dots */}
      {!isMobile && (
        <div className="flex gap-4 items-center">
          {SECTIONS.map((section, i) => (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                activeSection === i
                  ? 'bg-accent scale-150 shadow-[0_0_8px_var(--accent)]'
                  : 'bg-text-muted hover:bg-text-primary'
              )}
              aria-label={section.label}
            />
          ))}
        </div>
      )}

      {/* Mobile Hamburger */}
      {isMobile && (
        <button
          className="text-text-primary w-6 h-6 flex flex-col justify-around"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={cn('w-full h-0.5 bg-current transition-all', isMenuOpen && 'rotate-45 translate-y-2')} />
          <span className={cn('w-full h-0.5 bg-current transition-all', isMenuOpen && 'opacity-0')} />
          <span className={cn('w-full h-0.5 bg-current transition-all', isMenuOpen && '-rotate-45 -translate-y-2')} />
        </button>
      )}

      {/* Mobile Drawer */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-bg-void z-40 flex flex-col items-center justify-center gap-8 text-text-primary font-display text-2xl">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              className={cn(
                'hover:text-accent transition-colors',
                activeSection === SECTIONS.findIndex(s => s.id === section.id) && 'text-accent'
              )}
              onClick={() => scrollTo(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
