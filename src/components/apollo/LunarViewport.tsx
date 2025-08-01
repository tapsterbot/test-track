import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from "@/lib/utils";

function LunarSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Simple lunar surface texture
  const lunarTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Base lunar gray
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(0, 0, 256, 256);
    
    // Add simple craters
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const radius = Math.random() * 15 + 3;
      
      ctx.fillStyle = '#6a6a6a';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  if (!lunarTexture) return null;

  return (
    <mesh ref={meshRef} position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <meshLambertMaterial map={lunarTexture} />
    </mesh>
  );
}

function DistantEarth() {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <mesh ref={earthRef} position={[-10, 5, -15]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#4a90e2" />
    </mesh>
  );
}

function StarField() {
  const starsRef = useRef<THREE.Points>(null);
  
  const starPositions = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.5} />
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

      <Canvas 
        camera={{ position: [0, 2, 12], fov: 60 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          color="#ffffff"
        />
        
        <StarField />
        <LunarSurface />
        <DistantEarth />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
      
      {/* HUD overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-futura text-nasa-green">
        <div>ALT: 15.2 KM</div>
        <div>LUNAR SURFACE</div>
        <div>VEL: 1.7 KM/S</div>
      </div>
    </div>
  );
}