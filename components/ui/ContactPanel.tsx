'use client';

import React from 'react';

export default function ContactPanel() {
  const links = [
    { label: 'disharthpatel@gmail.com', href: 'mailto:disharthpatel@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/disharthpatel' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/disharthpatel' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10 px-6">
      <h2 className="font-display font-bold text-5xl text-text-primary mb-4">
        Let's build something.
      </h2>
      <p className="font-body text-lg text-text-muted mb-12 max-w-md">
        Open to Generative AI roles, research, and internships.
      </p>
      <div className="flex flex-wrap justify-center gap-4 pointer-events-auto">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full border border-accent text-accent font-body hover:bg-accent hover:text-bg-void transition-all duration-300 shadow-none hover:shadow-[0_0_16px_var(--accent)]"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
