import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useSimpleVehicle } from "@/hooks/useSimpleVehicle";
import { useSimpleControls } from "@/hooks/useSimpleControls";

interface VehicleData {
  speed: number;
  heading: number;
  altitude: number;
  battery: number;
  temperature: number;
  position: { x: number; y: number; z: number };
}

interface SimpleSimulatorProps {
  isActive: boolean;
  onVehicleUpdate: (data: VehicleData) => void;
}

// Procedural terrain with noise-like generation
function Ground() {
  const geometry = new THREE.PlaneGeometry(120, 120, 64, 64);
  const vertices = geometry.attributes.position.array as Float32Array;
  
  // Generate terrain using noise-like functions
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    
    // Create subtle terrain using multiple sine waves (more subtle noise)
    const noise1 = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 0.8;
    const noise2 = Math.sin(x * 0.05) * Math.cos(y * 0.04) * 0.5;
    const noise3 = Math.sin(x * 0.1) * Math.cos(y * 0.08) * 0.3;
    const noise4 = Math.sin(x * 0.2) * Math.cos(y * 0.15) * 0.1;
    
    vertices[i + 2] = noise1 + noise2 + noise3 + noise4;
  }
  
  geometry.computeVertexNormals();
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <primitive object={geometry} />
      <meshLambertMaterial color="#22C55E" wireframe={false} />
    </mesh>
  );
}

// Simple vehicle representation
function SimpleVehicle({ position, rotation }: { 
  position: THREE.Vector3; 
  rotation: THREE.Euler; 
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(position);
      meshRef.current.rotation.copy(rotation);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main delivery van body - one compact rectangle */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[10, 6, 16]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 6, -8.2]}>
        <boxGeometry args={[8, 3, 0.3]} />
        <meshLambertMaterial color="#60A5FA" transparent opacity={0.7} />
      </mesh>
      
      {/* Side windows */}
      <mesh position={[-5.2, 5.5, -2]}>
        <boxGeometry args={[0.3, 2, 8]} />
        <meshLambertMaterial color="#60A5FA" transparent opacity={0.7} />
      </mesh>
      <mesh position={[5.2, 5.5, -2]}>
        <boxGeometry args={[0.3, 2, 8]} />
        <meshLambertMaterial color="#60A5FA" transparent opacity={0.7} />
      </mesh>
      
      {/* 4 wheels */}
      <mesh position={[-6, -1, -4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2, 2, 1.5]} />
        <meshLambertMaterial color="#1F2937" />
      </mesh>
      <mesh position={[6, -1, -4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2, 2, 1.5]} />
        <meshLambertMaterial color="#1F2937" />
      </mesh>
      <mesh position={[-6, -1, 4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2, 2, 1.5]} />
        <meshLambertMaterial color="#1F2937" />
      </mesh>
      <mesh position={[6, -1, 4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2, 2, 1.5]} />
        <meshLambertMaterial color="#1F2937" />
      </mesh>
      
      {/* Front grille */}
      <mesh position={[0, 3, -8.3]}>
        <boxGeometry args={[6, 1.5, 0.2]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[-3, 3, -8.4]}>
        <sphereGeometry args={[0.6]} />
        <meshLambertMaterial color="#FEF3C7" />
      </mesh>
      <mesh position={[3, 3, -8.4]}>
        <sphereGeometry args={[0.6]} />
        <meshLambertMaterial color="#FEF3C7" />
      </mesh>
      
      {/* Company branding */}
      <mesh position={[0, 5, 2]}>
        <boxGeometry args={[8, 2, 0.1]} />
        <meshLambertMaterial color="#3B82F6" />
      </mesh>
      
      {/* Rear doors */}
      <mesh position={[-2.5, 4, 8.2]}>
        <boxGeometry args={[4, 4, 0.2]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      <mesh position={[2.5, 4, 8.2]}>
        <boxGeometry args={[4, 4, 0.2]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Door handles */}
      <mesh position={[-1, 3, 8.4]}>
        <boxGeometry args={[0.8, 0.3, 0.2]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      <mesh position={[1, 3, 8.4]}>
        <boxGeometry args={[0.8, 0.3, 0.2]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* Tail lights */}
      <mesh position={[-3, 4, 8.3]}>
        <sphereGeometry args={[0.4]} />
        <meshLambertMaterial color="#EF4444" />
      </mesh>
      <mesh position={[3, 4, 8.3]}>
        <sphereGeometry args={[0.4]} />
        <meshLambertMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}

// Scene content
function SceneContent({ isActive, onVehicleUpdate }: SimpleSimulatorProps) {
  const vehicle = useSimpleVehicle();
  const controls = useSimpleControls();
  
  useFrame(() => {
    if (isActive) {
      vehicle.update(controls);
      
      onVehicleUpdate({
        speed: vehicle.getSpeed(),
        heading: (vehicle.rotation.y * 180 / Math.PI) % 360,
        altitude: vehicle.position.y,
        battery: 95,
        temperature: 25,
        position: { 
          x: vehicle.position.x, 
          y: vehicle.position.y, 
          z: vehicle.position.z 
        }
      });
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.8} />
      
      <Ground />
      <SimpleVehicle position={vehicle.position} rotation={vehicle.rotation} />
    </>
  );
}

export function SimpleSimulator(props: SimpleSimulatorProps) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', display: 'block' }}
      camera={{ 
        position: [0, 60, 60], 
        fov: 60 
      }}
    >
      <SceneContent {...props} />
      <OrbitControls 
        target={[0, 0, 0]}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </Canvas>
  );
}