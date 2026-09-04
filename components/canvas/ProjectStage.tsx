'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProjectStageProps {
  variant: 'chip' | 'bars' | 'nodes';
}

export default function ProjectStage({ variant }: ProjectStageProps) {
  return (
    <group>
      {variant === 'chip' && <ChipMesh />}
      {variant === 'bars' && <BarsMesh />}
      {variant === 'nodes' && <NodesMesh />}
    </group>
  );
}

function ChipMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = Math.sin(t * 1.5) * 0.5 + 0.5;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0D0D14" emissive="#6C63FF" emissiveIntensity={1} />
      </mesh>
      <mesh ref={wireframeRef}>
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshBasicMaterial color="#6C63FF" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function BarsMesh() {
  const barsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (barsRef.current) {
      barsRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(t + i) * 0.001;
      });
    }
  });

  return (
    <group ref={barsRef}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[(i - 2) * 0.4, 0, 0]}>
          <boxGeometry args={[0.3, 1, 0.3]} />
          <meshStandardMaterial color="#00E5FF" />
        </mesh>
      ))}
    </group>
  );
}

function NodesMesh() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#F0F0F5" />
        </mesh>
      ))}
    </group>
  );
}
