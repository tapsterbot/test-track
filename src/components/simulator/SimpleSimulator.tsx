import { useRef, useImperativeHandle, forwardRef, MutableRefObject } from "react";
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
  objectiveComplete?: boolean;
  nearTarget?: boolean;
}

interface SimpleSimulatorProps {
  isActive: boolean;
  onVehicleUpdate: (data: VehicleData) => void;
}

interface SimpleSimulatorRef {
  reset: () => void;
}

// Simple maze ground
function Ground() {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Maze walls - simple child-friendly layout */}
      {/* Outer walls */}
      <mesh position={[0, 2, -60]}>
        <boxGeometry args={[120, 4, 2]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      <mesh position={[0, 2, 60]}>
        <boxGeometry args={[120, 4, 2]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      <mesh position={[-60, 2, 0]}>
        <boxGeometry args={[2, 4, 120]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      <mesh position={[60, 2, 0]}>
        <boxGeometry args={[2, 4, 120]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* Simple maze walls */}
      <mesh position={[-20, 2, -20]}>
        <boxGeometry args={[2, 4, 40]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      <mesh position={[20, 2, 10]}>
        <boxGeometry args={[2, 4, 60]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      <mesh position={[0, 2, -40]}>
        <boxGeometry args={[40, 4, 2]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      <mesh position={[-40, 2, 20]}>
        <boxGeometry args={[40, 4, 2]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* Start marker (top left) */}
      <mesh position={[-40, 0.5, -40]}>
        <cylinderGeometry args={[3, 3, 1]} />
        <meshLambertMaterial color="#10B981" />
      </mesh>
      
      {/* End marker (bottom right) */}
      <mesh position={[40, 0.5, 40]}>
        <cylinderGeometry args={[3, 3, 1]} />
        <meshLambertMaterial color="#EF4444" />
      </mesh>
    </>
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
      {/* Main Roomba body - circular and flat */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[4, 4, 1.5]} />
        <meshLambertMaterial color="#2D3748" />
      </mesh>
      
      {/* Top cover - slightly smaller circle */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[3.8, 3.8, 0.2]} />
        <meshLambertMaterial color="#4A5568" />
      </mesh>
      
      {/* Center button */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.3]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      
      {/* Power button LED */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.2]} />
        <meshLambertMaterial color="#48BB78" />
      </mesh>
      
      {/* Front sensor bar */}
      <mesh position={[0, 1.5, 3.5]}>
        <boxGeometry args={[3, 0.4, 0.6]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      
      {/* Sensor cameras/IR sensors */}
      <mesh position={[-1, 1.5, 3.7]}>
        <sphereGeometry args={[0.15]} />
        <meshLambertMaterial color="#2B6CB0" />
      </mesh>
      <mesh position={[0, 1.5, 3.7]}>
        <sphereGeometry args={[0.15]} />
        <meshLambertMaterial color="#2B6CB0" />
      </mesh>
      <mesh position={[1, 1.5, 3.7]}>
        <sphereGeometry args={[0.15]} />
        <meshLambertMaterial color="#2B6CB0" />
      </mesh>
      
      {/* Side sensors */}
      <mesh position={[-3.7, 1.5, 0]}>
        <sphereGeometry args={[0.12]} />
        <meshLambertMaterial color="#2B6CB0" />
      </mesh>
      <mesh position={[3.7, 1.5, 0]}>
        <sphereGeometry args={[0.12]} />
        <meshLambertMaterial color="#2B6CB0" />
      </mesh>
      
      {/* Main drive wheels (hidden inside but we'll show them slightly) */}
      <mesh position={[-1.5, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.8, 0.8, 0.6]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      <mesh position={[1.5, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.8, 0.8, 0.6]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      
      {/* Front caster wheel */}
      <mesh position={[0, 0.2, 2.5]}>
        <sphereGeometry args={[0.4]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* Back caster wheel */}
      <mesh position={[0, 0.2, -2.5]}>
        <sphereGeometry args={[0.4]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* Charging contacts */}
      <mesh position={[-2, 0.1, -3]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
        <meshLambertMaterial color="#F6AD55" />
      </mesh>
      <mesh position={[2, 0.1, -3]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
        <meshLambertMaterial color="#F6AD55" />
      </mesh>
      
      
      {/* Status LED strip */}
      <mesh position={[0, 2, 1.5]}>
        <boxGeometry args={[2, 0.1, 0.3]} />
        <meshLambertMaterial color="#4299E1" />
      </mesh>
      
      {/* Roomba branding area */}
      <mesh position={[0, 1.9, -1]}>
        <cylinderGeometry args={[1.2, 1.2, 0.05]} />
        <meshLambertMaterial color="#E2E8F0" />
      </mesh>
      
      {/* WiFi indicator */}
      <mesh position={[1.5, 2, 1]}>
        <sphereGeometry args={[0.1]} />
        <meshLambertMaterial color="#38B2AC" />
      </mesh>
    </group>
  );
}

// Scene content
function SceneContent({ isActive, onVehicleUpdate, controls, resetRef }: SimpleSimulatorProps & { controls: any; resetRef: MutableRefObject<(() => void) | undefined> }) {
  const vehicle = useSimpleVehicle();
  
  // Store reset function reference
  resetRef.current = vehicle.reset;
  
  useFrame(() => {
    if (isActive) {
      vehicle.update(controls);
      
      // Check if robot reached the end (bottom right corner)
      const distanceToEnd = Math.sqrt(
        Math.pow(vehicle.position.x - 40, 2) + 
        Math.pow(vehicle.position.z - 40, 2)
      );
      
      const objectiveComplete = distanceToEnd < 8;
      const nearTarget = distanceToEnd < 15; // Within 15 units of target
      
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
        },
        objectiveComplete,
        nearTarget
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

export const SimpleSimulator = forwardRef<SimpleSimulatorRef, SimpleSimulatorProps>((props, ref) => {
  const controls = useSimpleControls();
  const vehicleResetRef = useRef<() => void>();

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (vehicleResetRef.current) {
        vehicleResetRef.current();
      }
    }
  }));

  return (
    <Canvas
      style={{ width: '100%', height: '100%', display: 'block' }}
      camera={{ 
        position: [0, 80, 80], 
        fov: 60 
      }}
    >
      <SceneContent {...props} controls={controls} resetRef={vehicleResetRef} />
      <OrbitControls 
        target={[0, 0, 0]}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </Canvas>
  );
});