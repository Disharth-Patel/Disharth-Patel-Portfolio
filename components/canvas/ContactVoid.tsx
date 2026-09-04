'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '@lib/store';

export default function ContactVoid() {
  const scrollProgress = usePortfolioStore((state) => state.scrollProgress);
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const particleCount = 1000;
  const initialPositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 8;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const p = scrollProgress;
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const basePos = new THREE.Vector3(
          initialPositions[i * 3],
          initialPositions[i * 3 + 1],
          initialPositions[i * 3 + 2]
        );
        const dir = basePos.clone().normalize();
        const finalPos = dir.multiplyScalar(50 * p);

        posAttr.array[i * 3] = THREE.MathUtils.lerp(initialPositions[i * 3], finalPos.x, p);
        posAttr.array[i * 3 + 1] = THREE.MathUtils.lerp(initialPositions[i * 3 + 1], finalPos.y, p);
        posAttr.array[i * 3 + 2] = THREE.MathUtils.lerp(initialPositions[i * 3 + 2], finalPos.z, p);
      }
      posAttr.needsUpdate = true;
    }

    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(0.8, 0, p);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={initialPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.05}
        color="#6C63FF"
        transparent
        opacity={0.8}
      />
    </points>
  );
}
