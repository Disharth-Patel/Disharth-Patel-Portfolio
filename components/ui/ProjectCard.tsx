'use client';

import React from 'react';

interface ProjectCardProps {
  title: string;
  date: string;
  metrics: string;
  stack: string[];
  description: string;
  link?: string;
}

export default function ProjectCard({ title, date, metrics, stack, description, link }: ProjectCardProps) {
  return (
    <div className="bg-bg-surface/80 backdrop-blur-md border border-border p-8 rounded-2xl max-w-md w-full flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <h3 className="font-display font-semibold text-2xl text-text-primary">{title}</h3>
        <span className="text-text-muted text-xs font-body">{date}</span>
      </div>

      <div className="text-accent text-sm font-medium mb-2">
        {metrics}
      </div>

      <p className="text-text-muted font-body text-sm leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {stack.map((s) => (
          <span key={s} className="px-2 py-1 bg-accent/10 text-accent text-[10px] uppercase tracking-wider rounded border border-accent/20">
            {s}
          </span>
        ))}
      </div>

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-center py-2 rounded-full border border-accent text-accent text-sm hover:bg-accent hover:text-bg-void transition-all duration-300"
        >
          View Project
        </a>
      )}
    </div>
  );
}
