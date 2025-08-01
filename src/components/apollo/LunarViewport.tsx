import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from "@/lib/utils";

function LunarSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create lunar surface texture
  const lunarTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base lunar gray
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add craters and surface details
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 30 + 5;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, '#6a6a6a');
      gradient.addColorStop(1, '#4a4a4a');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <>
      {/* Lunar surface */}
      <Sphere ref={meshRef} args={[8, 64, 32]} position={[0, -12, 0]}>
        <meshLambertMaterial map={lunarTexture} />
      </Sphere>
      
      {/* Distant Earth */}
      <Sphere args={[0.3, 32, 16]} position={[-15, 8, -20]}>
        <meshBasicMaterial color="#4a90e2" />
      </Sphere>
    </>
  );
}

function LunarParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 2 - 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#c0c0c0" size={0.02} />
    </points>
  );
}

interface LunarViewportProps {
  className?: string;
}

export function LunarViewport({ className }: LunarViewportProps) {
  return (
    <div className={cn(
      "relative bg-black rounded-sm overflow-hidden",
      "border-4 border-muted-foreground shadow-inner",
      className
    )}>
      {/* Window frame details */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-2 left-2 w-2 h-2 bg-muted-foreground rounded-full shadow-inner" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-muted-foreground rounded-full shadow-inner" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-muted-foreground rounded-full shadow-inner" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-muted-foreground rounded-full shadow-inner" />
        
        {/* Reflection effect */}
        <div className="absolute inset-2 border border-white/10 rounded-sm pointer-events-none" />
      </div>

      <Canvas camera={{ position: [0, 2, 15], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          color="#ffffff"
          castShadow
        />
        
        <Stars radius={100} depth={50} count={2000} factor={4} fade />
        <LunarSurface />
        <LunarParticles />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
      
      {/* HUD overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-mono text-nasa-green">
        <div>ALT: 15.2 KM</div>
        <div>LUNAR SURFACE</div>
        <div>VEL: 1.7 KM/S</div>
      </div>
    </div>
  );
}