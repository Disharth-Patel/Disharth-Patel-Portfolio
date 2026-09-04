'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '@lib/store';
import { gsap } from '@lib/gsapSetup';

export default function HeroParticles() {
  const { isMobile } = usePortfolioStore();
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const particleCount = isMobile ? 800 : 3000;
  const radius = 8;
  const edgeDistance = 1.5;
  const maxEdges = 6000;

  const { initialPositions, targetPositions, velocities, edgePositions } = useMemo(() => {
    const initPos = new Float32Array(particleCount * 3);
    const targetPos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const edges = [];

    for (let i = 0; i < particleCount; i++) {
      // Scattered start
      const thetaI = Math.random() * Math.PI * 2;
      const phiI = Math.acos(2 * Math.random() - 1);
      const rI = 30;
      initPos[i * 3] = rI * Math.sin(phiI) * Math.cos(thetaI);
      initPos[i * 3 + 1] = rI * Math.sin(phiI) * Math.sin(thetaI);
      initPos[i * 3 + 2] = rI * Math.cos(phiI);

      // Target position
      const thetaT = Math.random() * Math.PI * 2;
      const phiT = Math.acos(2 * Math.random() - 1);
      const rT = Math.random() * radius;
      targetPos[i * 3] = rT * Math.sin(phiT) * Math.cos(thetaT);
      targetPos[i * 3 + 1] = rT * Math.sin(phiT) * Math.sin(thetaT);
      targetPos[i * 3 + 2] = rT * Math.cos(phiT);

      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        if (edges.length >= maxEdges) break;
        const dx = targetPos[i * 3] - targetPos[j * 3];
        const dy = targetPos[i * 3 + 1] - targetPos[j * 3 + 1];
        const dz = targetPos[i * 3 + 2] - targetPos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < edgeDistance) {
          edges.push(targetPos[i * 3], targetPos[i * 3 + 1], targetPos[i * 3 + 2]);
          edges.push(targetPos[j * 3], targetPos[j * 3 + 1], targetPos[j * 3 + 2]);
        }
      }
    }

    return {
      initialPositions: initPos,
      targetPositions: targetPos,
      velocities: vel,
      edgePositions: new Float32Array(edges)
    };
  }, [particleCount]);

  // We use a proxy for the entry animation progress
  const entryProgress = useRef(0);

  useEffect(() => {
    gsap.to(entryProgress, {
      value: 1,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        // Handled in useFrame
      }
    });

    if (materialRef.current) {
      gsap.from(materialRef.current, {
        opacity: 0,
        duration: 2,
        ease: 'power2.out'
      });
    }
  }, []);

  useFrame((state) => {
    const { clock, mouse, camera } = state;
    const delta = clock.getDelta();

    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      const p = (entryProgress as any).value || 0;

      for (let i = 0; i < particleCount; i++) {
        // Entry Lerp: Initial -> Target
        const curX = THREE.MathUtils.lerp(initialPositions[i * 3], targetPositions[i * 3], p);
        const curY = THREE.MathUtils.lerp(initialPositions[i * 3 + 1], targetPositions[i * 3 + 1], p);
        const curZ = THREE.MathUtils.lerp(initialPositions[i * 3 + 2], targetPositions[i * 3 + 2], p);

        // Drift (only after entry is mostly done)
        const driftFactor = p;
        posAttr.array[i * 3] = curX + velocities[i * 3] * delta * 60 * driftFactor;
        posAttr.array[i * 3 + 1] = curY + velocities[i * 3 + 1] * delta * 60 * driftFactor;
        posAttr.array[i * 3 + 2] = curZ + velocities[i * 3 + 2] * delta * 60 * driftFactor;

        // Boundary reversal (simplified)
        const dist = Math.sqrt(
          posAttr.array[i * 3]**2 +
          posAttr.array[i * 3 + 1]**2 +
          posAttr.array[i * 3 + 2]**2
        );
        if (dist > radius) {
          // This is tricky with lerp, so we just let it be for the entry.
          // Proper boundary reversal would need separate state per particle.
        }
      }
      posAttr.needsUpdate = true;
    }

    const targetX = mouse.x * 0.5;
    const targetY = mouse.y * 0.3;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
  });

  return (
    <group>
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
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={edgePositions.length / 3}
            array={edgePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#6C63FF"
          transparent
          opacity={0.2}
        />
      </lineSegments>
    </group>
  );
}
