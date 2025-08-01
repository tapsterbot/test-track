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
    
    // Create varied terrain using multiple sine waves (simulating perlin noise)
    const noise1 = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 3;
    const noise2 = Math.sin(x * 0.1) * Math.cos(y * 0.08) * 2;
    const noise3 = Math.sin(x * 0.2) * Math.cos(y * 0.15) * 1;
    const noise4 = Math.sin(x * 0.4) * Math.cos(y * 0.3) * 0.5;
    
    vertices[i + 2] = noise1 + noise2 + noise3 + noise4;
  }
  
  geometry.computeVertexNormals();
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <primitive object={geometry} />
      <meshLambertMaterial color="#4A3728" wireframe={false} />
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
      {/* Main body - way bigger */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[12, 3, 18]} />
        <meshLambertMaterial color="#E2E8F0" />
      </mesh>
      
      {/* Wheels - much bigger */}
      <mesh position={[-5, -1.8, -6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.5, 1.5, 1]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      <mesh position={[5, -1.8, -6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.5, 1.5, 1]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      <mesh position={[-5, -1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.5, 1.5, 1]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      <mesh position={[5, -1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.5, 1.5, 1]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      <mesh position={[-5, -1.8, 6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.5, 1.5, 1]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      <mesh position={[5, -1.8, 6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.5, 1.5, 1]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      
      {/* Equipment deck - bigger */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[8, 0.5, 12]} />
        <meshLambertMaterial color="#3182CE" />
      </mesh>
      
      {/* Solar panels */}
      <mesh position={[-3, 3, 0]}>
        <boxGeometry args={[4, 0.1, 10]} />
        <meshLambertMaterial color="#1A365D" />
      </mesh>
      <mesh position={[3, 3, 0]}>
        <boxGeometry args={[4, 0.1, 10]} />
        <meshLambertMaterial color="#1A365D" />
      </mesh>
      
      {/* Camera mast */}
      <mesh position={[0, 5, -4]}>
        <cylinderGeometry args={[0.3, 0.3, 4]} />
        <meshLambertMaterial color="#718096" />
      </mesh>
      
      {/* Antenna */}
      <mesh position={[2, 4.5, 2]}>
        <cylinderGeometry args={[0.1, 0.1, 3]} />
        <meshLambertMaterial color="#E53E3E" />
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
        position: [0, 40, 40], 
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