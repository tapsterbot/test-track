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
  
  // Create larger terrain with finer detail
  const geometry = new THREE.PlaneGeometry(400, 400, 256, 256);
  const vertices = geometry.attributes.position.array as Float32Array;
  
  // Generate random terrain heights
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const distance = Math.sqrt(x * x + y * y);
    
    // Create more subtle terrain features
    vertices[i + 2] = Math.sin(distance * 0.005) * 12 + 
                      Math.cos(x * 0.003) * 6 + 
                      Math.sin(y * 0.004) * 4 +
                      (Math.random() - 0.5) * 1;
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
function Vehicle({ position, rotation, isActive, controls }: { 
  position: THREE.Vector3; 
  rotation: THREE.Euler;
  isActive: boolean;
  controls?: any;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.copy(position);
      meshRef.current.rotation.copy(rotation);
      
      // Only add bounce animation when vehicle is moving
      if (isActive && controls && controls.getSpeed() > 0.1) {
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 8) * 0.02;
      }
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
function CameraController({ vehiclePosition, vehicleSpeed }: { 
  vehiclePosition: THREE.Vector3; 
  vehicleSpeed: number;
}) {
  const { camera } = useThree();
  const lastPosition = useRef(new THREE.Vector3(-25, 15, 20));
  
  useFrame(() => {
    // Only update camera if vehicle is moving or camera needs to catch up
    const targetPosition = new THREE.Vector3(
      vehiclePosition.x - 25,
      vehiclePosition.y + 15,
      vehiclePosition.z + 20
    );
    
    const distance = lastPosition.current.distanceTo(targetPosition);
    
    // Only move camera if vehicle moved significantly or camera is far from target
    if (vehicleSpeed > 0.01 || distance > 0.1) {
      camera.position.lerp(targetPosition, vehicleSpeed > 0.01 ? 0.02 : 0.001);
      camera.lookAt(vehiclePosition);
      lastPosition.current.copy(camera.position);
    }
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
      const currentSpeed = controls.getSpeed();
      onVehicleUpdate({
        speed: currentSpeed,
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
      <Vehicle 
        position={position} 
        rotation={rotation} 
        isActive={isActive}
        controls={controls}
      />
      
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
      <CameraController 
        vehiclePosition={position} 
        vehicleSpeed={controls.getSpeed()}
      />
    </>
  );
}

export function SimulatorEngine(props: SimulatorEngineProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        style={{ width: '100%', height: '100%' }}
        camera={{ 
          position: [-25, 15, 20], 
          fov: 45,
          near: 0.1,
          far: 2000
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