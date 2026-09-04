'use client';

import React from 'react';

export default function AboutOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          <h2 className="font-display font-semibold text-4xl text-text-primary mb-6">
            About Me
          </h2>
          <p className="font-body text-lg text-text-muted leading-relaxed">
            I build systems where AI meets real business problems — from candidate-ranking pipelines that process over 100,000 profiles to sales dashboards that reduced reporting time by 80%. Currently pursuing B.Tech Computer Science Engineering at MIT ADT University, Pune, graduating July 2027.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[
            { value: '8.11 / 10', label: 'CGPA' },
            { value: '4', label: 'Major Projects' },
            { value: '2', label: 'Certifications' },
          ].map((stat, i) => (
            <div key={i} className="bg-bg-surface/50 backdrop-blur-sm border border-border p-4 rounded-lg flex justify-between items-center">
              <span className="font-body text-text-muted">{stat.label}</span>
              <span className="font-display font-bold text-accent text-xl">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
