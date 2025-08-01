import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HolographicDisplayProps {
  shipStatus: string;
  dimensionalPhase: string;
  quantumCharge: number;
}

export function HolographicDisplay({ shipStatus, dimensionalPhase, quantumCharge }: HolographicDisplayProps) {
  const shipRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  // Create holographic ship model
  const shipGeometry = useMemo(() => {
    const geometry = new THREE.ConeGeometry(0.3, 1.5, 8);
    return geometry;
  }, []);

  // Create particle field for holographic effect
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1000 * 3);
    const colors = new Float32Array(1000 * 3);

    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

      const color = new THREE.Color();
      color.setHSL(0.6, 0.8, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate ship
    if (shipRef.current) {
      shipRef.current.rotation.y = time * 0.5;
      shipRef.current.position.y = Math.sin(time) * 0.2;
      
      // Status-based effects
      if (shipStatus === 'CRITICAL') {
        shipRef.current.position.x = Math.sin(time * 10) * 0.1;
      }
    }

    // Animate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < 1000; i++) {
        positions[i * 3 + 1] += Math.sin(time + i) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Quantum wave effect
    if (waveRef.current && waveRef.current.material) {
      waveRef.current.rotation.z = time * 0.3;
      if ('opacity' in waveRef.current.material) {
        (waveRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(time * 2) * 0.2;
      }
    }
  });

  const statusColor = shipStatus === 'OPTIMAL' ? '#00ff00' : 
                     shipStatus === 'WARNING' ? '#ffff00' : '#ff0000';

  return (
    <group>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 2, 2]} intensity={0.8} color="#00aaff" />

      {/* Holographic ship */}
      <group ref={shipRef}>
        <mesh geometry={shipGeometry}>
          <meshPhongMaterial 
            color={statusColor}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Ship glow effect */}
        <mesh geometry={shipGeometry} scale={[1.2, 1.2, 1.2]}>
          <meshBasicMaterial 
            color={statusColor}
            transparent
            opacity={0.1}
          />
        </mesh>
      </group>

      {/* Particle field */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.6}
        />
      </points>

      {/* Quantum wave */}
      <mesh ref={waveRef} position={[0, -1, 0]}>
        <ringGeometry args={[1, 2, 32]} />
        <meshBasicMaterial 
          color="#00aaff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dimensional phase indicators */}
      {dimensionalPhase === 'CHAOTIC' && (
        <group>
          {[...Array(5)].map((_, i) => (
            <mesh 
              key={i}
              position={[
                Math.sin(i * 1.26) * 2,
                Math.cos(i * 1.26) * 2,
                0
              ]}
            >
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshBasicMaterial color="#ff4444" transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {/* Quantum charge visualization */}
      <mesh position={[0, 0, -2]} scale={[quantumCharge / 100, quantumCharge / 100, 1]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial 
          color="#00ffaa"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
    </group>
  );
}