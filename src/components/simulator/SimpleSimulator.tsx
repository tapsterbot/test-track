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
      {/* Truck cab */}
      <mesh position={[0, 4, -8]}>
        <boxGeometry args={[12, 6, 8]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 6, -12.5]}>
        <boxGeometry args={[10, 4, 1]} />
        <meshLambertMaterial color="#60A5FA" transparent opacity={0.7} />
      </mesh>
      
      {/* Side windows */}
      <mesh position={[-6.2, 5, -8]}>
        <boxGeometry args={[0.5, 3, 6]} />
        <meshLambertMaterial color="#60A5FA" transparent opacity={0.7} />
      </mesh>
      <mesh position={[6.2, 5, -8]}>
        <boxGeometry args={[0.5, 3, 6]} />
        <meshLambertMaterial color="#60A5FA" transparent opacity={0.7} />
      </mesh>
      
      {/* Cargo box */}
      <mesh position={[0, 5, 8]}>
        <boxGeometry args={[12, 8, 16]} />
        <meshLambertMaterial color="#F1F5F9" />
      </mesh>
      
      {/* Cargo door */}
      <mesh position={[0, 5, 16.2]}>
        <boxGeometry args={[10, 6, 0.5]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Cargo door handle */}
      <mesh position={[4, 3, 16.5]}>
        <boxGeometry args={[1.5, 0.5, 0.3]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* 4 Truck wheels */}
      <mesh position={[-7, -1, -6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2.5, 2.5, 2]} />
        <meshLambertMaterial color="#1F2937" />
      </mesh>
      <mesh position={[7, -1, -6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2.5, 2.5, 2]} />
        <meshLambertMaterial color="#1F2937" />
      </mesh>
      <mesh position={[-7, -1, 6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2.5, 2.5, 2]} />
        <meshLambertMaterial color="#1F2937" />
      </mesh>
      <mesh position={[7, -1, 6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2.5, 2.5, 2]} />
        <meshLambertMaterial color="#1F2937" />
      </mesh>
      
      {/* Grille */}
      <mesh position={[0, 3, -12.8]}>
        <boxGeometry args={[8, 2, 0.5]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[-4, 3, -12.9]}>
        <sphereGeometry args={[0.8]} />
        <meshLambertMaterial color="#FEF3C7" />
      </mesh>
      <mesh position={[4, 3, -12.9]}>
        <sphereGeometry args={[0.8]} />
        <meshLambertMaterial color="#FEF3C7" />
      </mesh>
      
      {/* Company logo/branding */}
      <mesh position={[0, 7, 8]}>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshLambertMaterial color="#3B82F6" />
      </mesh>
      
      {/* Delivery text panel */}
      <mesh position={[0, 4, 8]}>
        <boxGeometry args={[10, 1.5, 0.2]} />
        <meshLambertMaterial color="#1D4ED8" />
      </mesh>
      
      {/* Tail lights */}
      <mesh position={[-4, 4, 16.3]}>
        <sphereGeometry args={[0.5]} />
        <meshLambertMaterial color="#EF4444" />
      </mesh>
      <mesh position={[4, 4, 16.3]}>
        <sphereGeometry args={[0.5]} />
        <meshLambertMaterial color="#EF4444" />
      </mesh>
      
      {/* Side mirrors */}
      <mesh position={[-7, 6, -10]}>
        <boxGeometry args={[1, 0.5, 0.3]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      <mesh position={[7, 6, -10]}>
        <boxGeometry args={[1, 0.5, 0.3]} />
        <meshLambertMaterial color="#374151" />
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