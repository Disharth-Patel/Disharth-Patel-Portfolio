'use client';

import React from 'react';

export default function HeroOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">
      <h1 className="font-display font-bold text-7xl text-text-primary mb-4 tracking-tight">
        DISHARTH PATEL
      </h1>
      <p className="font-body text-lg text-text-muted mb-8">
        Generative AI · ML · Automation
      </p>
      <button
        className="pointer-events-auto px-6 py-3 rounded-full border border-accent text-accent font-body hover:bg-accent hover:text-bg-void transition-all duration-300"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Explore Work ↓
      </button>
    </div>
  );
}
