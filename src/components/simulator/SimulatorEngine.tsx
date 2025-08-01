import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useVehiclePhysics } from "@/hooks/useVehiclePhysics";
import { useMultiInput } from "@/hooks/useMultiInput";

interface VehicleData {
  speed: number;
  heading: number;
  altitude: number;
  battery: number;
  temperature: number;
  position: { x: number; y: number; z: number };
}

interface SimulatorEngineProps {
  isActive: boolean;
  onVehicleUpdate: (data: VehicleData) => void;
}

// Terrain Component
function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create heightmap terrain
  const geometry = new THREE.PlaneGeometry(200, 200, 128, 128);
  const vertices = geometry.attributes.position.array as Float32Array;
  
  // Generate random terrain heights
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const distance = Math.sqrt(x * x + y * y);
    
    // Create hills and valleys
    vertices[i + 2] = Math.sin(distance * 0.02) * 8 + 
                      Math.cos(x * 0.01) * 4 + 
                      Math.sin(y * 0.015) * 3 +
                      (Math.random() - 0.5) * 2;
  }
  
  geometry.computeVertexNormals();

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <primitive object={geometry} />
      <meshLambertMaterial 
        color="#8B4513" 
        wireframe={false}
        transparent={true}
        opacity={0.9}
      />
    </mesh>
  );
}

// Vehicle/Rover Component
function Vehicle({ position, rotation, isActive }: { 
  position: THREE.Vector3; 
  rotation: THREE.Euler;
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.position.copy(position);
      meshRef.current.rotation.copy(rotation);
      
      // Add subtle bounce animation
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 4) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 1, 5]} />
        <meshLambertMaterial color="#4A5568" />
      </mesh>
      
      {/* Wheels */}
      {[-1.5, 1.5].map((x) =>
        [-1.8, 0, 1.8].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.2, z]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3]} />
            <meshLambertMaterial color="#2D3748" />
          </mesh>
        ))
      )}
      
      {/* Solar panels */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2, 0.1, 3]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      
      {/* Camera mast */}
      <mesh position={[0, 2, -1]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5]} />
        <meshLambertMaterial color="#718096" />
      </mesh>
    </group>
  );
}

// Camera Controller
function CameraController({ vehiclePosition }: { vehiclePosition: THREE.Vector3 }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Follow the vehicle
    const targetPosition = new THREE.Vector3(
      vehiclePosition.x - 15,
      vehiclePosition.y + 10,
      vehiclePosition.z + 10
    );
    
    camera.position.lerp(targetPosition, 0.05);
    camera.lookAt(vehiclePosition);
  });
  
  return null;
}

// Scene Content
function SceneContent({ isActive, onVehicleUpdate }: SimulatorEngineProps) {
  const { position, rotation, controls } = useVehiclePhysics();
  const inputs = useMultiInput();
  
  useFrame(() => {
    if (isActive) {
      controls.update(inputs);
      
      // Update parent with vehicle data
      onVehicleUpdate({
        speed: controls.getSpeed(),
        heading: (rotation.y * 180 / Math.PI) % 360,
        altitude: position.y,
        battery: Math.max(0, 100 - controls.getDistanceTraveled() * 0.01),
        temperature: 25 + Math.random() * 10 - 5,
        position: { x: position.x, y: position.y, z: position.z }
      });
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[50, 50, 25]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Environment */}
      <Terrain />
      <Vehicle position={position} rotation={rotation} isActive={isActive} />
      
      {/* Sky gradient */}
      <mesh scale={[500, 500, 500]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#2D1B69" 
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Camera controller */}
      <CameraController vehiclePosition={position} />
    </>
  );
}

export function SimulatorEngine(props: SimulatorEngineProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ 
          position: [-15, 10, 10], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
      >
        <SceneContent {...props} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}