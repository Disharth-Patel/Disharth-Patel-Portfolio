'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { usePortfolioStore } from '@/lib/store';
import { useSpring, animated } from '@react-spring/three';

const CLUSTERS = {
  GEN_AI: { color: '#6C63FF', skills: ['Prompt Engineering', 'Microsoft Copilot', 'AI Agents', 'ChatGPT'] },
  ML_DS: { color: '#00E5FF', skills: ['Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Deep Learning'] },
  BI: { color: '#FFD166', skills: ['Power BI', 'MS Excel', 'SQL', 'Market Research', 'Data Storytelling'] },
  CS: { color: '#F0F0F5', skills: ['Python', 'DSA', 'OOP', 'DBMS', 'OS', 'Computer Networks'] },
  MLOPS: { color: '#A8FF78', skills: ['MLOps Pipelines', 'Model Deployment', 'Git', 'GitHub'] },
};

export default function SkillGraph() {
  const allSkills = Object.entries(CLUSTERS).flatMap(([key, cluster]) =>
    cluster.skills.map(skill => ({ label: skill, cluster: key, color: cluster.color }))
  );

  const { nodes, edges } = useMemo(() => {
    const nodes = allSkills.map(s => ({
      ...s,
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
    }));

    const edges: [number, number][] = [];
    // Simple logical connection: connect skills in the same cluster
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].cluster === nodes[j].cluster) {
          edges.push([i, j]);
        }
      }
    }

    // Force Layout
    for (let iter = 0; iter < 200; iter++) {
      const forces = nodes.map(() => new THREE.Vector3(0, 0, 0));

      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const delta = new THREE.Vector3().subVectors(nodes[i].position, nodes[j].position);
          const dist = delta.length() || 0.001;

          // Coulomb Repulsion
          const repulsion = delta.clone().normalize().multiplyScalar(0.5 / (dist * dist));
          forces[i].add(repulsion);
        }
      }

      // Spring Attraction
      edges.forEach(([i, j]) => {
        const delta = new THREE.Vector3().subVectors(nodes[i].position, nodes[j].position);
        const dist = delta.length();
        const spring = delta.clone().normalize().multiplyScalar(-0.05 * (dist - 2.0));
        forces[i].add(spring);
        forces[j].sub(spring);
      });

      // Centering and Update
      nodes.forEach((node, i) => {
        const centering = node.position.clone().multiplyScalar(-0.02);
        node.velocity.add(forces[i]).add(centering).multiplyScalar(0.85);
        node.position.add(node.velocity);
      });
    }

    return { nodes, edges };
  }, []);

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  return (
    <group>
      {nodes.map((node, i) => {
        const isHovered = hoveredNode === i;
        const isNeighbor = hoveredNode !== null && edges.some(([u, v]) =>
          (u === i && v === hoveredNode) || (v === i && u === hoveredNode)
        );

        return (
          <SkillNode
            key={i}
            node={node}
            position={node.position}
            isHighlighted={isHovered || isNeighbor}
            opacity={hoveredNode === null || isHovered || isNeighbor ? 1 : 0.3}
            onPointerOver={() => setHoveredNode(i)}
            onPointerOut={() => setHoveredNode(null)}
          />
        );
      })}
      {edges.map(([i, j], idx) => (
        <line
          key={idx}
          onPointerOver={() => {}} // Just for interaction
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
                nodes[j].position.x, nodes[j].position.y, nodes[j].position.z,
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#6C63FF"
            transparent
            opacity={hoveredNode === null || (hoveredNode === i || hoveredNode === j) ? 0.2 : 0.05}
          />
        </line>
      ))}
    </group>
  );
}

function SkillNode({ node, position, isHighlighted, opacity, onPointerOver, onPointerOut }: any) {
  const { scale, opacity: springOpacity } = useSpring({
    scale: isHighlighted ? 1.5 : 1,
    opacity: opacity,
    config: { tension: 300, friction: 10 },
  });

  return (
    <animated.mesh
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      scale={scale}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={isHighlighted ? 2 : 0.5} />
      {isHighlighted && (
        <Html distanceFactor={10}>
          <div className="bg-bg-surface text-text-primary px-2 py-1 rounded text-xs whitespace-nowrap border border-border shadow-lg">
            {node.label}
          </div>
        </Html>
      )}
    </animated.mesh>
  );
}
