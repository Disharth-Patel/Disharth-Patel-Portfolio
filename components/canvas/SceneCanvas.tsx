'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

interface SceneCanvasProps {
  children: React.ReactNode;
  cameraPos?: [number, number, number];
}

export default function SceneCanvas({ children, cameraPos = [0, 0, 5] }: SceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: cameraPos, fov: 75 }}
      shadows
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#050508']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

      <Suspense fallback={null}>
        {children}
        <Environment preset="city" />
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      </Suspense>
    </Canvas>
  );
}
