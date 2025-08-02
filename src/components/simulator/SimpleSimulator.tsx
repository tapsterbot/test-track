import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import QRCode from "qrcode";
import { useSimpleVehicle } from "@/hooks/useSimpleVehicle";
import { useSimpleControls } from "@/hooks/useSimpleControls";

interface VehicleData {
  speed: number;
  heading: number;
  altitude: number;
  battery: number;
  temperature: number;
  position: { x: number; y: number; z: number };
  objectiveComplete: boolean;
}

interface SimpleSimulatorProps {
  isActive: boolean;
  onVehicleUpdate: (data: VehicleData) => void;
  shouldReset?: boolean;
  virtualJoystickControls?: {
    angle: number;
    magnitude: number;
  };
  onToggle?: () => void;
}

// Hidden QR Code component
function HiddenQRCode() {
  const [qrTexture, setQrTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const secretMessage = "\"I have no special talent. I am only passionately curious.\" - Albert Einstein. You found this by looking where others don't. Keep exploring! 🔬✨";
        const qrDataURL = await QRCode.toDataURL(secretMessage, {
          width: 512,
          margin: 2,
          color: { dark: '#000000', light: '#FFFFFF' }
        });
        
        console.log('QR Code generated successfully');
        const loader = new THREE.TextureLoader();
        const texture = loader.load(qrDataURL, () => {
          console.log('QR texture loaded successfully');
        });
        texture.flipY = false;
        setQrTexture(texture);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    };
    
    generateQRCode();
  }, []);

  if (!qrTexture) return null;

  return (
    <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[104, 104]} />
      <meshLambertMaterial
        map={qrTexture} 
        transparent={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
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
      
      {/* Calculator keypad maze - forces 1→4→7→8→5→2→3→6→9 path */}
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
      
      {/* Grid dividers - create 3x3 calculator keypad zones */}
      {/* Vertical dividers */}
      <mesh position={[-20, 2, 0]}>
        <boxGeometry args={[2, 4, 120]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      <mesh position={[20, 2, 0]}>
        <boxGeometry args={[2, 4, 120]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* Horizontal dividers */}
      <mesh position={[0, 2, -20]}>
        <boxGeometry args={[120, 4, 2]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      <mesh position={[0, 2, 20]}>
        <boxGeometry args={[120, 4, 2]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* Strategic wall openings to force the path 1→4→7→8→5→2→3→6→9 */}
      
      {/* Opening from zone 1 to 4 (bottom-left to center-left) */}
      <mesh position={[-20, 2, 30]}>
        <boxGeometry args={[2, 4, 20]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Opening from zone 4 to 7 (center-left to top-left) */}
      <mesh position={[-20, 2, -10]}>
        <boxGeometry args={[2, 4, 20]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Opening from zone 7 to 8 (top-left to top-center) */}
      <mesh position={[-10, 2, -20]}>
        <boxGeometry args={[20, 4, 2]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Opening from zone 8 to 5 (top-center to center) */}
      <mesh position={[0, 2, -10]}>
        <boxGeometry args={[2, 4, 20]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Opening from zone 5 to 2 (center to bottom-center) */}
      <mesh position={[0, 2, 30]}>
        <boxGeometry args={[2, 4, 20]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Opening from zone 2 to 3 (bottom-center to bottom-right) */}
      <mesh position={[10, 2, 20]}>
        <boxGeometry args={[20, 4, 2]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Opening from zone 3 to 6 (bottom-right to center-right) */}
      <mesh position={[20, 2, 10]}>
        <boxGeometry args={[2, 4, 20]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Opening from zone 6 to 9 (center-right to top-right) */}
      <mesh position={[20, 2, -30]}>
        <boxGeometry args={[2, 4, 20]} />
        <meshLambertMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Start marker - Zone 1 (bottom left) */}
      <mesh position={[-40, 0.05, 40]}>
        <cylinderGeometry args={[6, 6, 0.1]} />
        <meshLambertMaterial color="#10B981" />
      </mesh>
      
      {/* End marker - Zone 9 (top right) */}
      <mesh position={[40, 0.05, -40]}>
        <cylinderGeometry args={[6, 6, 0.1]} />
        <meshLambertMaterial color="#EF4444" />
      </mesh>
      
      {/* Path waypoint markers */}
      {/* Zone 4 marker */}
      <mesh position={[-40, 0.05, 0]}>
        <cylinderGeometry args={[3, 3, 0.1]} />
        <meshLambertMaterial color="#F59E0B" />
      </mesh>
      
      {/* Zone 7 marker */}
      <mesh position={[-40, 0.05, -40]}>
        <cylinderGeometry args={[3, 3, 0.1]} />
        <meshLambertMaterial color="#F59E0B" />
      </mesh>
      
      {/* Zone 8 marker */}
      <mesh position={[0, 0.05, -40]}>
        <cylinderGeometry args={[3, 3, 0.1]} />
        <meshLambertMaterial color="#F59E0B" />
      </mesh>
      
      {/* Zone 5 marker */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[3, 3, 0.1]} />
        <meshLambertMaterial color="#F59E0B" />
      </mesh>
      
      {/* Zone 2 marker */}
      <mesh position={[0, 0.05, 40]}>
        <cylinderGeometry args={[3, 3, 0.1]} />
        <meshLambertMaterial color="#F59E0B" />
      </mesh>
      
      {/* Zone 3 marker */}
      <mesh position={[40, 0.05, 40]}>
        <cylinderGeometry args={[3, 3, 0.1]} />
        <meshLambertMaterial color="#F59E0B" />
      </mesh>
      
      {/* Zone 6 marker */}
      <mesh position={[40, 0.05, 0]}>
        <cylinderGeometry args={[3, 3, 0.1]} />
        <meshLambertMaterial color="#F59E0B" />
      </mesh>
      
      <HiddenQRCode />
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
function SceneContent({ isActive, onVehicleUpdate, shouldReset, virtualJoystickControls }: SimpleSimulatorProps) {
  const vehicleRef = useRef<{
    position: THREE.Vector3;
    rotation: THREE.Euler;
    speed: number;
    update: (controls: any, joystickData?: { angle: number; magnitude: number }) => void;
    getSpeed: () => number;
    reset: () => void;
  } | null>(null);
  
  // Initialize vehicle only once
  if (!vehicleRef.current) {
    vehicleRef.current = {
      position: new THREE.Vector3(-40, 1, 40),
      rotation: new THREE.Euler(0, 0, 0),
      speed: 0,
      update: function(controls: any, joystickData?: { angle: number; magnitude: number }) {
        const deltaTime = 1/60;
        const walls = [
          // Outer walls
          { x: 0, z: -60, width: 120, height: 2 },
          { x: 0, z: 60, width: 120, height: 2 },
          { x: -60, z: 0, width: 2, height: 120 },
          { x: 60, z: 0, width: 2, height: 120 },
          
          // Calculator keypad grid walls with strategic openings
          // Vertical dividers (with gaps for path)
          { x: -20, z: 40, width: 2, height: 20 }, // Left divider, bottom section (blocks zone 1→2)
          { x: -20, z: 20, width: 2, height: 20 }, // Left divider, bottom section (blocks zone 4→5)
          { x: -20, z: -30, width: 2, height: 20 }, // Left divider, top section (blocks zone 7→8)
          
          { x: 20, z: 40, width: 2, height: 20 }, // Right divider, bottom section (blocks zone 2→3)
          { x: 20, z: 0, width: 2, height: 20 }, // Right divider, middle section (blocks zone 5→6)
          { x: 20, z: -40, width: 2, height: 20 }, // Right divider, top section (blocks zone 8→9)
          
          // Horizontal dividers (with gaps for path)
          { x: -40, z: -20, width: 20, height: 2 }, // Top divider, left section (blocks zone 4→7)
          { x: 10, z: -20, width: 20, height: 2 }, // Top divider, right section (blocks zone 8→9)
          { x: 30, z: -20, width: 20, height: 2 }, // Top divider, far right section
          
          { x: -40, z: 20, width: 20, height: 2 }, // Bottom divider, left section (blocks zone 1→4)
          { x: -10, z: 20, width: 20, height: 2 }, // Bottom divider, center section (blocks zone 2→5)
          { x: 30, z: 20, width: 20, height: 2 }, // Bottom divider, right section (blocks zone 3→6)
        ];
        
        // Handle joystick "follow me" control
        if (joystickData && joystickData.magnitude > 0) {
          // Convert joystick angle to robot rotation (joystick angle is screen-relative)
          // Adjust for coordinate system: joystick right=0, down=π/2, left=π, up=3π/2
          // Robot: forward=-Z, so we need to offset by π/2 to align properly
          const targetRotation = joystickData.angle + Math.PI / 2;
          
          // Smooth rotation towards target
          let angleDiff = targetRotation - this.rotation.y;
          
          // Normalize angle difference to [-π, π]
          while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
          while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
          
          // Apply rotation smoothing
          const rotationSpeed = 0.08;
          this.rotation.y += angleDiff * rotationSpeed;
          
          // Set speed based on joystick magnitude
          const maxSpeed = 12;
          this.speed = joystickData.magnitude * maxSpeed;
        } else {
          // Handle keyboard controls (tank-style)
          if (controls.forward) {
            this.speed = Math.min(this.speed + 0.2, 12);
          } else if (controls.backward) {
            this.speed = Math.max(this.speed - 0.2, -6);
          } else {
            this.speed *= 0.95;
          }
          
          // Simple turning (only when moving for keyboard)
          if (controls.left && Math.abs(this.speed) > 0.1) {
            this.rotation.y += 0.02;
          }
          if (controls.right && Math.abs(this.speed) > 0.1) {
            this.rotation.y -= 0.02;
          }
        }
        
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyEuler(this.rotation);
        direction.multiplyScalar(this.speed * deltaTime);
        
        const newPosition = this.position.clone().add(direction);
        
        // Collision detection
        const robotRadius = 4;
        let collision = false;
        for (const wall of walls) {
          const wallLeft = wall.x - wall.width / 2;
          const wallRight = wall.x + wall.width / 2;
          const wallTop = wall.z - wall.height / 2;
          const wallBottom = wall.z + wall.height / 2;
          
          if (newPosition.x + robotRadius > wallLeft && 
              newPosition.x - robotRadius < wallRight &&
              newPosition.z + robotRadius > wallTop && 
              newPosition.z - robotRadius < wallBottom) {
            collision = true;
            break;
          }
        }
        
        if (!collision) {
          this.position.copy(newPosition);
        } else {
          this.speed = 0;
        }
        
        this.position.y = 1;
      },
      getSpeed: function() {
        return Math.abs(this.speed);
      },
      reset: function() {
        this.position.set(-40, 1, 40);
        this.rotation.set(0, 0, 0);
        this.speed = 0;
      }
    };
  }
  
  const keyboardControls = useSimpleControls(isActive);
  
  // Use keyboard controls
  const controls = keyboardControls;
  
  // Handle reset when shouldReset changes
  useFrame(() => {
    if (shouldReset && vehicleRef.current) {
      vehicleRef.current.reset();
    }
    
    if (isActive && vehicleRef.current) {
      vehicleRef.current.update(controls, virtualJoystickControls);
      
      const distanceToEnd = Math.sqrt(
        Math.pow(vehicleRef.current.position.x - 40, 2) + 
        Math.pow(vehicleRef.current.position.z - (-40), 2)
      );
      
      const objectiveComplete = distanceToEnd < 8;
      
      onVehicleUpdate({
        speed: vehicleRef.current.getSpeed(),
        heading: (vehicleRef.current.rotation.y * 180 / Math.PI) % 360,
        altitude: vehicleRef.current.position.y,
        battery: 95,
        temperature: 25,
        position: { 
          x: vehicleRef.current.position.x, 
          y: vehicleRef.current.position.y, 
          z: vehicleRef.current.position.z 
        },
        objectiveComplete
      });
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.8} />
      
      <Ground />
      {vehicleRef.current && (
        <SimpleVehicle 
          position={vehicleRef.current.position} 
          rotation={vehicleRef.current.rotation} 
        />
      )}
    </>
  );
}

export function SimpleSimulator(props: SimpleSimulatorProps) {
  const handleCanvasClick = (event: React.MouseEvent) => {
    // Only toggle if clicking on the canvas itself, not during camera controls
    if (props.onToggle && event.detail === 1) {
      props.onToggle();
    }
  };

  return (
    <div onClick={handleCanvasClick} style={{ width: '100%', height: '100%' }}>
      <Canvas
        style={{ width: '100%', height: '100%', display: 'block' }}
        camera={{ 
          position: window.innerWidth < 768 ? [0, 100, 100] : [0, 80, 80], 
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