'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { usePortfolioStore } from '@/lib/store';

const EVENTS = [
  { date: 'Aug 2023', text: 'B.Tech CSE commences — MIT ADT University' },
  { date: 'Jan 2025', text: 'Netflix Recommendation System' },
  { date: 'May 2025', text: 'Commodity Price Comparison System' },
  { date: 'Sep 2025', text: 'Intellipaat × IIT Indore AI cert' },
  { date: 'Feb 2026', text: 'Professional Certification completed' },
  { date: '2026', text: 'Candidate Ranking System — Hackathon' },
  { date: 'Jul 2027', text: 'B.Tech graduation (expected)' },
];

export default function TimelinePath() {
  const scrollProgress = usePortfolioStore((state) => state.scrollProgress);
  const tubeRef = useRef<THREE.Mesh>(null);

  const { curve, points } = useMemo(() => {
    const pts = EVENTS.map((_, i) => new THREE.Vector3(
      Math.sin(i * 0.8) * 3,
      i * -1.5,
      Math.cos(i * 0.8) * 2
    ));
    const c = new THREE.CatmullRomCurve3(pts);
    return { curve: c, points: pts };
  }, []);

  useFrame((state) => {
    const { camera } = state;
    const p = scrollProgress;

    // Reveal tube
    if (tubeRef.current) {
      const geom = tubeRef.current.geometry as THREE.TubeGeometry;
      const totalIndices = geom.index ? geom.index.count : 0;
      geom.setDrawRange(0, Math.floor(p * totalIndices));
      geom.attributes.position.needsUpdate = true;
    }

    // Camera movement
    const camPos = curve.getPoint(p);
    const lookAtPos = curve.getPoint(Math.min(p + 0.05, 1));

    camera.position.set(camPos.x, camPos.y + 0.5, camPos.z + 2);
    camera.lookAt(lookAtPos);
  });

  return (
    <group>
      <mesh ref={tubeRef}>
        <tubeGeometry args={[curve, 200, 0.05, 8, false]} />
        <meshStandardMaterial color="#6C63FF" emissive="#6C63FF" emissiveIntensity={2} />
      </mesh>

      {points.map((pt, i) => (
        <group key={i} position={pt}>
          <mesh>
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial color="#F0F0F5" emissive="#F0F0F5" emissiveIntensity={2} />
          </mesh>
          <Html distanceFactor={10}>
            <div className="bg-bg-surface text-text-primary p-2 rounded border border-border text-xs w-40 shadow-xl">
              <div className="font-bold text-accent">{EVENTS[i].date}</div>
              <div>{EVENTS[i].text}</div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
