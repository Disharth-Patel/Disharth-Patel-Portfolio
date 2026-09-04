'use client';

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Nav from '@/components/ui/Nav';
import HeroOverlay from '@/components/ui/HeroOverlay';
import AboutOverlay from '@/components/ui/AboutOverlay';
import ProjectCard from '@/components/ui/ProjectCard';
import ContactPanel from '@/components/ui/ContactPanel';
import SceneCanvas from '@/components/canvas/SceneCanvas';
import { useMobileDetect } from '@/hooks/useMobileDetect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsapSetup';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Lazy load Canvas components
const HeroParticles = dynamic(() => import('@/components/canvas/HeroParticles'), { ssr: false });
const AboutTunnel = dynamic(() => import('@/components/canvas/AboutTunnel'), { ssr: false });
const SkillGraph = dynamic(() => import('@/components/canvas/SkillGraph'), { ssr: false });
const ProjectStage = dynamic(() => import('@/components/canvas/ProjectStage'), { ssr: false });
const TimelinePath = dynamic(() => import('@/components/canvas/TimelinePath'), { ssr: false });
const ContactVoid = dynamic(() => import('@/components/canvas/ContactVoid'), { ssr: false });

const PROJECTS = [
  {
    id: 'project-1',
    title: 'Intelligent Candidate Discovery',
    date: '2026',
    metrics: '100K+ Profiles Processed · 2-Stage Pipeline',
    stack: ['Python', 'SQL', 'BAAI/bge-small', 'Streamlit'],
    description: 'AI-powered candidate evaluation system combining rule-based pre-filtering with transformer-based semantic similarity scoring.',
    variant: 'chip' as const,
    link: 'https://github.com/disharthpatel'
  },
  {
    id: 'project-2',
    title: 'Sales Analytics Dashboard',
    date: '2024',
    metrics: '150K+ Transactions · 80% Reporting Reduction',
    stack: ['MySQL', 'Power BI', 'Power Query', 'ETL'],
    description: 'End-to-end automated sales analytics pipeline delivering interactive dashboards with market segmentation and revenue tracking.',
    variant: 'bars' as const,
    link: 'https://github.com/disharthpatel'
  },
  {
    id: 'project-3',
    title: 'Netflix Recommendation System',
    date: '2025',
    metrics: 'Hybrid ML Model · Full EDA Pipeline',
    stack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    description: 'Personalised film recommendation engine combining collaborative filtering and content-based methods with a full EDA pipeline.',
    variant: 'nodes' as const,
    link: 'https://github.com/disharthpatel'
  }
];

export default function Page() {
  const railRef = useRef<HTMLDivElement>(null);
  const overlaysRef = useRef<(HTMLElement | null)[]>([]);

  useMobileDetect();
  useReducedMotion();

  useEffect(() => {
    // Project rail horizontal scroll
    if (railRef.current) {
      const rail = railRef.current;
      const railWidth = rail.scrollWidth;
      const viewportWidth = window.innerWidth;

      gsap.to(rail, {
        x: -(railWidth - viewportWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top top',
          end: () => `+=${railWidth - viewportWidth}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }

    // Section overlays fade-in
    const sections = ['#about', '#skills', '#timeline', '#contact'];
    sections.forEach((id) => {
      gsap.fromTo(`.overlay-${id.slice(1)}`,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: id,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  return (
    <main className="relative w-full bg-bg-void">
      <Nav />

      {/* Section 0: Hero */}
      <section id="hero" className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SceneCanvas>
            <HeroParticles />
          </SceneCanvas>
        </div>
        <HeroOverlay />
      </section>

      {/* Section 1: About */}
      <section id="about" className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SceneCanvas cameraPos={[0, 0, 8]}>
            <AboutTunnel />
          </SceneCanvas>
        </div>
        <div className="overlay-about">
          <AboutOverlay />
        </div>
      </section>

      {/* Section 2: Skills */}
      <section id="skills" className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SceneCanvas>
            <SkillGraph />
          </SceneCanvas>
        </div>
        <div className="overlay-skills absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <h2 className="font-display font-semibold text-4xl text-text-primary">Technical Arsenal</h2>
        </div>
      </section>

      {/* Section 3: Projects - Horizontal Rail */}
      <section id="projects" className="relative overflow-hidden">
        <div className="relative h-screen w-full flex items-center">
          <div className="absolute inset-0 z-0 pointer-events-none">
             <SceneCanvas>
               <ProjectStage variant="chip" />
             </SceneCanvas>
          </div>

          <div
            ref={railRef}
            className="flex gap-20 px-[10vw] items-center relative z-10"
            style={{ width: 'max-content' }}
          >
            {PROJECTS.map((project) => (
              <div key={project.id} className="w-[80vw] md:w-[40vw] flex-shrink-0">
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Timeline */}
      <section id="timeline" className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SceneCanvas cameraPos={[0, 0, 5]}>
            <TimelinePath />
          </SceneCanvas>
        </div>
        <div className="overlay-timeline absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <h2 className="font-display font-semibold text-4xl text-text-primary">The Journey</h2>
        </div>
      </section>

      {/* Section 5: Contact */}
      <section id="contact" className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SceneCanvas>
            <ContactVoid />
          </SceneCanvas>
        </div>
        <div className="overlay-contact">
          <ContactPanel />
        </div>
      </section>
    </main>
  );
}
