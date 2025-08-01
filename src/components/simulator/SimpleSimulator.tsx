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
      
      {/* Edge-sweeping brush */}
      <mesh position={[3, 0.1, 3]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1]} />
        <meshLambertMaterial color="#E53E3E" />
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
        position: [0, 20, 20], 
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