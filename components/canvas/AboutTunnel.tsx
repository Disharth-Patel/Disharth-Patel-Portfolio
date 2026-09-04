'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '@lib/store';

const HolographicMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uAccentColor: { value: new THREE.Color('#6C63FF') },
    uSurfaceColor: { value: new THREE.Color('#0D0D14') },
    uOpacity: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uAccentColor;
    uniform vec3 uSurfaceColor;
    uniform float uOpacity;
    varying vec2 vUv;

    void main() {
      // Edge glow
      float edge = 1.0 - smoothstep(0.0, 0.05, min(vUv.x, min(vUv.y, min(1.0 - vUv.x, 1.0 - vUv.y))));

      // Scanline effect
      float scanline = sin(vUv.y * 40.0 + uTime * 2.0) * 0.03;

      vec3 finalColor = mix(uSurfaceColor, uAccentColor, edge + scanline);

      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `,
};

export default function AboutTunnel() {
  const scrollProgress = usePortfolioStore((state) => state.scrollProgress); // Note: This is global, need section-specific progress
  const cardRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const { clock, camera } = state;
    const t = clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }

    // We need the section-specific progress.
    // For now, we'll use a simplified version or assume the store handles it.
    // In Phase 3, we'll wire this properly.
    const p = scrollProgress;

    camera.position.z = THREE.MathUtils.lerp(8, 2, p);

    if (cardRef.current) {
      cardRef.current.scale.setScalar(THREE.MathUtils.lerp(0, 1, p));
      cardRef.current.rotation.y = THREE.MathUtils.lerp(Math.PI, 0, p);

      if (materialRef.current) {
        materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(0, 1, Math.min(p * 2, 1));
      }
    }
  });

  return (
    <group>
      {/* Simple particle field for tunnel effect */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={new Float32Array(1000 * 3).map(() => (Math.random() - 0.5) * 20)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#6B6B7A" transparent opacity={0.5} />
      </points>

      <mesh ref={cardRef} position={[0, 0, 0]}>
        <planeGeometry args={[3, 4]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={HolographicMaterial.uniforms}
          vertexShader={HolographicMaterial.vertexShader}
          fragmentShader={HolographicMaterial.fragmentShader}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
