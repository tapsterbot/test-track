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

// Simple ground plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[200, 200]} />
      <meshLambertMaterial color="#8B4513" />
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
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.5, 3]} />
        <meshLambertMaterial color="#4A5568" />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[-1, -0.3, -1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshLambertMaterial color="#2D3748" />
      </mesh>
      <mesh position={[1, -0.3, -1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshLambertMaterial color="#2D3748" />
      </mesh>
      <mesh position={[-1, -0.3, 1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshLambertMaterial color="#2D3748" />
      </mesh>
      <mesh position={[1, -0.3, 1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshLambertMaterial color="#2D3748" />
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
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Ground />
      <SimpleVehicle position={vehicle.position} rotation={vehicle.rotation} />
    </>
  );
}

export function SimpleSimulator(props: SimpleSimulatorProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ 
          position: [0, 15, 15], 
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
    </div>
  );
}