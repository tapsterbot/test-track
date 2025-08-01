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
      <planeGeometry args={[100, 100]} />
      <meshLambertMaterial color="#4A3728" />
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
      {/* Main body - bigger */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 1, 6]} />
        <meshLambertMaterial color="#E2E8F0" />
      </mesh>
      
      {/* Wheels - rotated to face forward/back */}
      <mesh position={[-1.5, -0.5, -2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      <mesh position={[1.5, -0.5, -2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      <mesh position={[-1.5, -0.5, 2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      <mesh position={[1.5, -0.5, 2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      
      {/* Equipment on top */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2, 0.2, 3]} />
        <meshLambertMaterial color="#3182CE" />
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
  );
}