import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { GameState, Position, ChessPiece } from "@/hooks/useRaumschach";

// Component to capture the canvas element
function CanvasCapture({ onCanvasReady }: { onCanvasReady?: (canvas: HTMLCanvasElement | null) => void }) {
  const { gl } = useThree();
  
  useEffect(() => {
    onCanvasReady?.(gl.domElement);
  }, [gl.domElement, onCanvasReady]);
  
  return null;
}

interface RaumschachBoardProps {
  gameState: GameState;
  selectedPosition: Position | null;
  validMoves: Position[];
  onSquareClick: (position: Position) => void;
  onCanvasClick?: () => void;
  onCanvasPointerDown?: (event: any) => void;
  onCanvasPointerMove?: (event: any) => void;
  onCanvasPointerUp?: () => void;
  isActive: boolean;
  currentPlayer: string;
  gameStatus: string;
  moveCount: number;
  cursorPosition?: Position | null;
  isKeyboardMode?: boolean;
  onMouseInteraction?: () => void;
  onCameraAzimuthChange?: (azimuth: number) => void;
  onCanvasReady?: (canvas: HTMLCanvasElement | null) => void;
  isFullscreen?: boolean;
  isDragging?: boolean;
}

interface SquareProps {
  position: Position;
  piece: ChessPiece | null;
  isSelected: boolean;
  isValidMove: boolean;
  isCursor: boolean;
  isHovered: boolean;
  onMouseEnter?: () => void;
}

function Square({ position, piece, isSelected, isValidMove, isCursor, isHovered, onMouseEnter }: SquareProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const x = (position.file - 2) * 1.2;
  const y = position.level * 1.5;
  const z = (2 - position.rank) * 1.2; // Flip Z to put rank 0 at back, rank 4 at front
  
  const isDark = (position.file + position.rank + position.level) % 2 === 1;

  // Add userData to mesh for identification
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData = { type: 'square', position };
    }
  }, [position]);

  return (
    <group position={[x, y, z]}>
      {/* Square */}
      <mesh
        ref={meshRef}
        onPointerOver={() => {
          onMouseEnter?.();
        }}
      >
        <boxGeometry args={[1, 0.1, 1]} />
        <meshPhongMaterial 
          color={
            isSelected 
              ? "#22c55e" // Green for selected
              : isValidMove 
                ? "#f59e0b" // Amber for valid moves
                : isCursor
                  ? "#3b82f6" // Blue for keyboard cursor
                : isHovered 
                  ? "#6b7280" // Gray for hover
                  : isDark 
                    ? "#374151" // Dark gray for dark squares
                    : "#f3f4f6" // Light gray for light squares
          }
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Keyboard cursor indicator */}
      {isCursor && (
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[1.1, 0.02, 1.1]} />
          <meshPhongMaterial 
            color="#3b82f6"
            emissive="#1e40af"
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
      
      {/* Chess piece */}
      {piece && (
        <ChessPieceComponent 
          piece={piece} 
          position={[0, 0.3, 0]} 
          isSelected={isSelected}
          boardPosition={position}
        />
      )}
    </group>
  );
}

interface ChessPieceComponentProps {
  piece: ChessPiece;
  position: [number, number, number];
  isSelected: boolean;
  boardPosition: Position;
}

function ChessPieceComponent({ piece, position, isSelected, boardPosition }: ChessPieceComponentProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Add userData to all piece meshes for identification
  const addUserDataToMesh = (mesh: THREE.Mesh) => {
    if (mesh) {
      mesh.userData = { type: 'piece', piece, position: boardPosition };
    }
  };
  
  // More solid colors for better visibility
  const color = piece.color === 'white' ? "#e2e8f0" : "#1f2937"; // Light gray instead of white
  const edgeColor = piece.color === 'white' ? "#94a3b8" : "#111827"; // Darker edges for strong contrast
  
  const createMaterial = (useEdge = false) => (
    <meshPhongMaterial 
      color={useEdge ? edgeColor : color}
      shininess={piece.color === 'white' ? 5 : 80} // Lower shininess for white pieces to make them more solid
      specular={piece.color === 'white' ? "#64748b" : "#444444"} // Darker specular for white pieces
      emissive={isSelected ? "#22c55e" : (piece.color === 'white' ? "#f1f5f9" : "#000000")} // Slight emission for white pieces
      emissiveIntensity={isSelected ? 0.3 : (piece.color === 'white' ? 0.1 : 0)}
    />
  );

  const createMeshWithUserData = (geometryJsx: any, materialJsx: any, meshPosition?: [number, number, number]) => (
    <mesh 
      ref={(mesh) => { if (mesh) addUserDataToMesh(mesh); }} 
      position={meshPosition}
    >
      {geometryJsx}
      {materialJsx}
    </mesh>
  );

  const renderPiece = () => {
    switch (piece.type) {
      case 'king':
        return (
          <group>
            {/* Base cylinder */}
            {createMeshWithUserData(
              <cylinderGeometry args={[0.25, 0.3, 0.4, 8]} />,
              createMaterial(),
              [0, -0.1, 0]
            )}
            {/* Edge outline */}
            <mesh position={[0, -0.1, 0]} scale={[1.03, 1.03, 1.03]}>
              <cylinderGeometry args={[0.25, 0.3, 0.4, 8]} />
              <meshBasicMaterial color={edgeColor} transparent opacity={0.6} />
            </mesh>
            {/* Crown top */}
            {createMeshWithUserData(
              <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />,
              createMaterial(),
              [0, 0.2, 0]
            )}
          </group>
        );
      case 'queen':
        return (
          <group>
            {/* Base cylinder */}
            {createMeshWithUserData(
              <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />,
              createMaterial(),
              [0, -0.05, 0]
            )}
            {/* Edge outline */}
            <mesh position={[0, -0.05, 0]} scale={[1.03, 1.03, 1.03]}>
              <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
              <meshBasicMaterial color={edgeColor} transparent opacity={0.6} />
            </mesh>
            {/* Crown points */}
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh 
                key={i} 
                position={[
                  Math.cos((i * Math.PI * 2) / 5) * 0.15,
                  0.25,
                  Math.sin((i * Math.PI * 2) / 5) * 0.15
                ]}
                ref={(mesh) => { if (mesh) addUserDataToMesh(mesh); }}
              >
                <sphereGeometry args={[0.05]} />
                {createMaterial()}
              </mesh>
            ))}
          </group>
        );
      case 'rook':
        return (
          <group>
            {/* Base */}
            {createMeshWithUserData(
              <boxGeometry args={[0.35, 0.4, 0.35]} />,
              createMaterial()
            )}
            {/* Edge outline */}
            <mesh scale={[1.03, 1.03, 1.03]}>
              <boxGeometry args={[0.35, 0.4, 0.35]} />
              <meshBasicMaterial color={edgeColor} transparent opacity={0.6} />
            </mesh>
            {/* Crenellations */}
            {[-0.1, 0.1].map((x) => 
              [-0.1, 0.1].map((z) => (
                <mesh 
                  key={`${x}-${z}`} 
                  position={[x, 0.25, z]}
                  ref={(mesh) => { if (mesh) addUserDataToMesh(mesh); }}
                >
                  <boxGeometry args={[0.08, 0.1, 0.08]} />
                  {createMaterial()}
                </mesh>
              ))
            )}
          </group>
        );
      case 'bishop':
        return (
          <group>
            {/* Base */}
            {createMeshWithUserData(
              <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />,
              createMaterial(),
              [0, -0.1, 0]
            )}
            {/* Miter top */}
            {createMeshWithUserData(
              <coneGeometry args={[0.12, 0.25, 8]} />,
              createMaterial(),
              [0, 0.2, 0]
            )}
          </group>
        );
      case 'knight':
        return (
          <group>
            {/* Body */}
            {createMeshWithUserData(
              <boxGeometry args={[0.25, 0.3, 0.35]} />,
              createMaterial(),
              [0, -0.05, 0]
            )}
            {/* Head */}
            {createMeshWithUserData(
              <boxGeometry args={[0.15, 0.2, 0.25]} />,
              createMaterial(),
              [0, 0.15, 0.15]
            )}
          </group>
        );
      case 'unicorn':
        return (
          <group>
            {/* Body */}
            {createMeshWithUserData(
              <coneGeometry args={[0.2, 0.4, 6]} />,
              createMaterial(),
              [0, -0.05, 0]
            )}
            {/* Horn */}
            {createMeshWithUserData(
              <cylinderGeometry args={[0.02, 0.04, 0.3]} />,
              createMaterial(),
              [0, 0.35, 0]
            )}
          </group>
        );
      case 'pawn':
        return (
          <group>
            {/* Base */}
            {createMeshWithUserData(
              <cylinderGeometry args={[0.12, 0.15, 0.2]} />,
              createMaterial(),
              [0, -0.1, 0]
            )}
            {/* Head */}
            {createMeshWithUserData(
              <sphereGeometry args={[0.15]} />,
              createMaterial(),
              [0, 0.1, 0]
            )}
          </group>
        );
      default:
        return createMeshWithUserData(
          <sphereGeometry args={[0.2]} />,
          createMaterial()
        );
    }
  };

  return (
    <group position={position}>
      {renderPiece()}
    </group>
  );
}

function BoardStructure() {
  return (
    <>
      {/* Level indicators - positioned on the far side, facing the camera */}
      {[0, 1, 2, 3, 4].map((level) => (
        <Text
          key={`level-${level}`}
          position={[3.5, level * 1.5, 0]}
          fontSize={0.3}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
        >
          {String.fromCharCode(65 + level)}
        </Text>
      ))}
      
      {/* File (column) indicators - positioned next to rank 1 (white pieces) */}
      {[0, 1, 2, 3, 4].map((file) => (
        <Text
          key={`file-${file}`}
          position={[(file - 2) * 1.2, -0.5, 2.8]}
          fontSize={0.3}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
        >
          {String.fromCharCode(97 + file)}
        </Text>
      ))}
      
      {/* Rank (row) indicators - positioned on the left side, 1 at White's side */}
      {[0, 1, 2, 3, 4].map((rank) => (
        <Text
          key={`rank-${rank}`}
          position={[-3.5, -0.5, (2 - rank) * 1.2]}
          fontSize={0.3}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
        >
          {rank + 1}
        </Text>
      ))}
    </>
  );
}

function CameraControls({ isActive, onRotateLeft, onRotateRight, onAzimuthChange }: { 
  isActive: boolean;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onAzimuthChange?: (azimuth: number) => void;
}) {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef<any>(null);
  
  // Track azimuth changes
  useEffect(() => {
    const updateAzimuth = () => {
      if (controlsRef.current && onAzimuthChange) {
        const azimuth = controlsRef.current.getAzimuthalAngle();
        onAzimuthChange(azimuth);
      }
    };

    const interval = setInterval(updateAzimuth, 100); // Update 10 times per second
    return () => clearInterval(interval);
  }, [onAzimuthChange]);
  
  // Expose rotation functions
  useEffect(() => {
    if (onRotateLeft) {
      (window as any).rotateCameraLeft = () => {
        if (controlsRef.current) {
          const currentAzimuth = controlsRef.current.getAzimuthalAngle();
          controlsRef.current.setAzimuthalAngle(currentAzimuth - Math.PI / 4); // 45 degrees left
          controlsRef.current.update();
        }
      };
    }
    if (onRotateRight) {
      (window as any).rotateCameraRight = () => {
        if (controlsRef.current) {
          const currentAzimuth = controlsRef.current.getAzimuthalAngle();
          controlsRef.current.setAzimuthalAngle(currentAzimuth + Math.PI / 4); // 45 degrees right
          controlsRef.current.update();
        }
      };
    }
  }, [onRotateLeft, onRotateRight]);

  // Expose enhanced focus on piece function
  useEffect(() => {
    (window as any).focusOnPiece = (level: number | string, file: number | string, rank: number | string) => {
      if (!controlsRef.current) {
        console.error('Camera controls not available');
        return;
      }

      // Convert chess notation to numeric values if needed
      const parseCoordinate = (coord: number | string, type: 'level' | 'file' | 'rank'): number => {
        if (typeof coord === 'number') {
          return coord;
        }
        
        const str = coord.toString().toLowerCase();
        
        if (type === 'level') {
          // Convert A-E to 0-4
          const charCode = str.charCodeAt(0);
          if (charCode >= 97 && charCode <= 101) { // a-e
            return charCode - 97;
          } else if (charCode >= 65 && charCode <= 69) { // A-E
            return charCode - 65;
          }
        } else if (type === 'file') {
          // Convert a-e to 0-4
          const charCode = str.charCodeAt(0);
          if (charCode >= 97 && charCode <= 101) { // a-e
            return charCode - 97;
          } else if (charCode >= 65 && charCode <= 69) { // A-E
            return charCode - 65;
          }
        } else if (type === 'rank') {
          // Convert 1-5 to 0-4
          const num = parseInt(str);
          if (num >= 1 && num <= 5) {
            return num - 1;
          }
        }
        
        console.error(`Invalid ${type} coordinate: ${coord}`);
        return 0;
      };

      const numLevel = parseCoordinate(level, 'level');
      const numFile = parseCoordinate(file, 'file');
      const numRank = parseCoordinate(rank, 'rank');

      // Validate coordinates
      if (numLevel < 0 || numLevel > 4 || numFile < 0 || numFile > 4 || numRank < 0 || numRank > 4) {
        console.error('Invalid coordinates: Level, File, and Rank must be 0-4 or equivalent chess notation');
        return;
      }

      // Calculate 3D world position (same logic as Square component)
      const x = (numFile - 2) * 1.2;
      const y = numLevel * 1.5;
      const z = (2 - numRank) * 1.2;

      console.log(`Focusing on piece at Level ${numLevel}, File ${numFile}, Rank ${numRank} (world position: ${x}, ${y}, ${z})`);

      // Enhanced target positioning - focus on center vertical axis of the board
      const pieceHeight = 0.3;
      const centerAxisTarget = new THREE.Vector3(0, y + pieceHeight, 0);
      const piecePosition = new THREE.Vector3(x, y + pieceHeight, z);
      
      // Multi-angle camera positioning with ultra-close distances
      const testAngles = [
        { azimuth: 0, elevation: Math.PI / 6 }, // 0°, 30° elevation
        { azimuth: Math.PI / 4, elevation: Math.PI / 6 }, // 45°, 30° elevation
        { azimuth: Math.PI / 2, elevation: Math.PI / 6 }, // 90°, 30° elevation
        { azimuth: 3 * Math.PI / 4, elevation: Math.PI / 6 }, // 135°, 30° elevation
        { azimuth: Math.PI, elevation: Math.PI / 6 }, // 180°, 30° elevation
        { azimuth: 5 * Math.PI / 4, elevation: Math.PI / 6 }, // 225°, 30° elevation
        { azimuth: 3 * Math.PI / 2, elevation: Math.PI / 6 }, // 270°, 30° elevation
        { azimuth: 7 * Math.PI / 4, elevation: Math.PI / 6 }, // 315°, 30° elevation
        { azimuth: Math.PI / 4, elevation: Math.PI / 8 }, // 45°, 22.5° elevation
        { azimuth: Math.PI / 4, elevation: Math.PI / 3 }, // 45°, 60° elevation
      ];

      // Multi-Stage Focus Enhancement
      const raycaster = new THREE.Raycaster();
      
      // Stage 1: Find Maximum Zoom Distance
      console.log('Stage 1: Finding maximum zoom distance...');
      let maxZoomDistance = null;
      
      // Test distances from ultra-close to reasonable, find the closest that works
      const testDistances = [0.8, 1.0, 1.2, 1.5, 1.8, 2.0, 2.2, 2.5];
      for (const distance of testDistances) {
        // Test with a basic angle first to see if this distance is viable
        const testAngle = Math.PI / 6; // 30 degrees elevation
        const testAzimuth = 0;
        
        const cameraX = distance * Math.cos(testAngle) * Math.cos(testAzimuth);
        const cameraY = (y + pieceHeight) + distance * Math.sin(testAngle);
        const cameraZ = distance * Math.cos(testAngle) * Math.sin(testAzimuth);
        
        const testCameraPos = new THREE.Vector3(cameraX, cameraY, cameraZ);
        
        // Test line of sight to piece from center axis view
        const direction = new THREE.Vector3().subVectors(piecePosition, testCameraPos).normalize();
        raycaster.set(testCameraPos, direction);
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        let hasObstruction = false;
        for (const intersect of intersects) {
          const intersectDistance = testCameraPos.distanceTo(intersect.point);
          const targetDistance = testCameraPos.distanceTo(piecePosition);
          
          if (intersectDistance < targetDistance - 0.3) {
            hasObstruction = true;
            break;
          }
        }
        
        if (!hasObstruction) {
          maxZoomDistance = distance;
          break; // Found the closest working distance
        }
      }
      
      if (!maxZoomDistance) {
        maxZoomDistance = 2.5; // Fallback distance
      }
      
      console.log(`Stage 1 complete: Maximum zoom distance = ${maxZoomDistance}`);
      
      // Stage 2: Find Optimal Rotation at Max Zoom
      console.log('Stage 2: Finding optimal rotation...');
      let bestRotation = null;
      let bestRotationScore = -1;
      
      // Test many more angles for better coverage
      const azimuthAngles = [];
      const elevationAngles = [Math.PI / 8, Math.PI / 6, Math.PI / 4, Math.PI / 3]; // 22.5°, 30°, 45°, 60°
      
      // Generate 16 azimuth angles (every 22.5 degrees)
      for (let i = 0; i < 16; i++) {
        azimuthAngles.push((i * Math.PI * 2) / 16);
      }
      
      for (const azimuth of azimuthAngles) {
        for (const elevation of elevationAngles) {
          const cameraX = maxZoomDistance * Math.cos(elevation) * Math.cos(azimuth);
          const cameraY = (y + pieceHeight) + maxZoomDistance * Math.sin(elevation);
          const cameraZ = maxZoomDistance * Math.cos(elevation) * Math.sin(azimuth);
          
          const testCameraPos = new THREE.Vector3(cameraX, cameraY, cameraZ);
          
          // Test line of sight to piece from center axis view
          const direction = new THREE.Vector3().subVectors(piecePosition, testCameraPos).normalize();
          raycaster.set(testCameraPos, direction);
          const intersects = raycaster.intersectObjects(scene.children, true);
          
          let score = 0;
          let hasObstruction = false;
          
          for (const intersect of intersects) {
            const intersectDistance = testCameraPos.distanceTo(intersect.point);
            const targetDistance = testCameraPos.distanceTo(piecePosition);
            
            if (intersectDistance < targetDistance - 0.3) {
              hasObstruction = true;
              break;
            }
          }
          
          if (!hasObstruction) {
            score += 100; // Clear line of sight bonus
            score += Math.sin(elevation) * 20; // Prefer elevated angles
            score += Math.random() * 5; // Small randomness to break ties
            
            if (score > bestRotationScore) {
              bestRotationScore = score;
              bestRotation = {
                camera: testCameraPos.clone(),
                target: centerAxisTarget.clone(),
                azimuth,
                elevation
              };
            }
          }
        }
      }
      
      if (!bestRotation) {
        // Fallback rotation
        const fallbackElevation = Math.PI / 6;
        const fallbackAzimuth = Math.PI / 4;
        bestRotation = {
          camera: new THREE.Vector3(
            maxZoomDistance * Math.cos(fallbackElevation) * Math.cos(fallbackAzimuth),
            (y + pieceHeight) + maxZoomDistance * Math.sin(fallbackElevation),
            maxZoomDistance * Math.cos(fallbackElevation) * Math.sin(fallbackAzimuth)
          ),
          target: centerAxisTarget.clone(),
          azimuth: fallbackAzimuth,
          elevation: fallbackElevation
        };
      }
      
      console.log(`Stage 2 complete: Optimal rotation found with score ${bestRotationScore}`);
      
      // Stage 3: Precision Panning for Perfect Centering
      console.log('Stage 3: Precision panning for perfect centering...');
      let finalPosition = bestRotation;
      
      // Test small adjustments to target position for perfect centering
      const panAdjustments = [
        { x: 0, y: 0, z: 0 }, // Current position
        { x: 0.1, y: 0, z: 0 }, { x: -0.1, y: 0, z: 0 },
        { x: 0, y: 0.1, z: 0 }, { x: 0, y: -0.1, z: 0 },
        { x: 0, y: 0, z: 0.1 }, { x: 0, y: 0, z: -0.1 }
      ];
      
      let bestPanScore = -1;
      
      for (const adjustment of panAdjustments) {
        const adjustedTarget = new THREE.Vector3(
          centerAxisTarget.x + adjustment.x,
          centerAxisTarget.y + adjustment.y,
          centerAxisTarget.z + adjustment.z
        );
        
        // Calculate camera position relative to adjusted center axis target
        const direction = new THREE.Vector3().subVectors(bestRotation.camera, centerAxisTarget).normalize();
        const adjustedCamera = new THREE.Vector3().addVectors(
          adjustedTarget,
          direction.multiplyScalar(maxZoomDistance)
        );
        
        // Score based on how centered the piece would be
        const score = 100 - (Math.abs(adjustment.x) + Math.abs(adjustment.y) + Math.abs(adjustment.z)) * 10;
        
        if (score > bestPanScore) {
          bestPanScore = score;
          finalPosition = {
            camera: adjustedCamera,
            target: adjustedTarget,
            azimuth: bestRotation.azimuth,
            elevation: bestRotation.elevation
          };
        }
      }
      
      console.log(`Stage 3 complete: Final position optimized with pan score ${bestPanScore}`);
      console.log(`Multi-stage focus complete: Distance=${maxZoomDistance}, Final score=${bestPanScore}`);
      
      // Set minimum distance to match the focused distance
      controlsRef.current.minDistance = Math.max(0.5, maxZoomDistance - 0.3);
      
      // Sequential animation through all stages
      const startPosition = camera.position.clone();
      const startTarget = controlsRef.current.target.clone();
      const startTime = Date.now();
      const totalDuration = 1500; // 1.5 seconds for more sophisticated animation

      const animateMultiStage = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        
        // Multi-stage easing: fast start, smooth middle, precise end
        let easeProgress;
        if (progress < 0.3) {
          // Stage 1: Fast zoom
          easeProgress = (progress / 0.3) * 0.4;
        } else if (progress < 0.7) {
          // Stage 2: Smooth rotation
          const stageProgress = (progress - 0.3) / 0.4;
          easeProgress = 0.4 + stageProgress * 0.4;
        } else {
          // Stage 3: Precise final positioning
          const stageProgress = (progress - 0.7) / 0.3;
          easeProgress = 0.8 + stageProgress * 0.2;
        }
        
        // Apply smooth easing to final progress
        const smoothProgress = 1 - Math.pow(1 - easeProgress, 2);
        
        camera.position.lerpVectors(startPosition, finalPosition.camera, smoothProgress);
        controlsRef.current.target.lerpVectors(startTarget, finalPosition.target, smoothProgress);
        controlsRef.current.update();

        if (progress < 1) {
          requestAnimationFrame(animateMultiStage);
        } else {
          console.log('Multi-stage focus animation complete - piece optimally positioned and clickable');
        }
      };

      animateMultiStage();
    };
  }, [camera, scene]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enablePan={isActive}
      enableZoom={isActive}
      enableRotate={isActive}
      minDistance={5}
      maxDistance={20}
      target={[0, 3, 0]}
    />
  );
}

// Click handler component using raycasting
function ClickHandler({ onSquareClick, isActive, isDragging }: { onSquareClick: (position: Position) => void; isActive: boolean; isDragging?: boolean }) {
  const { camera, scene, raycaster, pointer } = useThree();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!isActive || isDragging) return;

      // Convert mouse position to normalized device coordinates (-1 to +1)
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the raycaster with the camera and pointer position
      raycaster.setFromCamera(pointer, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Find the closest intersection with valid userData
        for (const intersection of intersects) {
          const userData = intersection.object.userData;
          if (userData && (userData.type === 'square' || userData.type === 'piece')) {
            const position = userData.type === 'piece' ? userData.position : userData.position;
            onSquareClick(position);
            break;
          }
        }
      }
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('click', handleClick);
      return () => canvas.removeEventListener('click', handleClick);
    }
  }, [camera, scene, raycaster, pointer, onSquareClick, isActive]);

  return null;
}

// Hover handler component using raycasting
function HoverHandler({ 
  onHoverChange, 
  isActive 
}: { 
  onHoverChange: (position: Position | null) => void; 
  isActive: boolean; 
}) {
  const { camera, scene, raycaster, pointer } = useThree();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isActive) {
        onHoverChange(null);
        return;
      }

      // Convert mouse position to normalized device coordinates (-1 to +1)
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the raycaster with the camera and pointer position
      raycaster.setFromCamera(pointer, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Find the closest intersection with valid userData
        for (const intersection of intersects) {
          const userData = intersection.object.userData;
          if (userData && (userData.type === 'square' || userData.type === 'piece')) {
            const position = userData.type === 'piece' ? userData.position : userData.position;
            onHoverChange(position);
            return;
          }
        }
      }

      // No valid intersection found
      onHoverChange(null);
    };

    const handleMouseLeave = () => {
      onHoverChange(null);
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [camera, scene, raycaster, pointer, onHoverChange, isActive]);

  return null;
}

function Scene({ gameState, selectedPosition, validMoves, onSquareClick, isActive, cursorPosition, isKeyboardMode, onMouseInteraction, onCameraAzimuthChange, isDragging }: Pick<RaumschachBoardProps, 'gameState' | 'selectedPosition' | 'validMoves' | 'onSquareClick' | 'isActive' | 'cursorPosition' | 'isKeyboardMode' | 'onMouseInteraction' | 'onCameraAzimuthChange' | 'isDragging'>) {
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);
  const rotateLeft = () => (window as any).rotateCameraLeft?.();
  const rotateRight = () => (window as any).rotateCameraRight?.();
  
  return (
    <>
      <CameraControls 
        isActive={isActive} 
        onRotateLeft={rotateLeft} 
        onRotateRight={rotateRight}
        onAzimuthChange={onCameraAzimuthChange}
      />
      <ClickHandler onSquareClick={onSquareClick} isActive={isActive} isDragging={isDragging} />
      <HoverHandler onHoverChange={setHoveredPosition} isActive={isActive} />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.0} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 8, 0]} intensity={0.8} />
      
      {/* Board positioned for traditional chess view - White at bottom, File A on left */}
      <group>
        <BoardStructure />
        
        {/* Render all squares and pieces */}
        {gameState.board.map((level, levelIndex) =>
          level.map((rank, rankIndex) =>
            rank.map((square, fileIndex) => {
              const position: Position = { 
                level: levelIndex, 
                rank: rankIndex, 
                file: fileIndex 
              };
              const isSelected = selectedPosition?.level === levelIndex && 
                               selectedPosition?.rank === rankIndex && 
                               selectedPosition?.file === fileIndex;
              const isValidMove = validMoves.some(move => 
                move.level === levelIndex && 
                move.rank === rankIndex && 
                move.file === fileIndex
              );
              const isCursor = isKeyboardMode && cursorPosition && 
                cursorPosition.level === levelIndex && 
                cursorPosition.rank === rankIndex && 
                cursorPosition.file === fileIndex;
              const isHovered = hoveredPosition?.level === levelIndex && 
                hoveredPosition?.rank === rankIndex && 
                hoveredPosition?.file === fileIndex;
              
              return (
                <Square
                  key={`${levelIndex}-${rankIndex}-${fileIndex}`}
                  position={position}
                  piece={square}
                  isSelected={isSelected}
                  isValidMove={isValidMove}
                  isCursor={isCursor}
                  isHovered={isHovered}
                  onMouseEnter={onMouseInteraction}
                />
              );
            })
          )
        )}
      </group>
    </>
  );
}

// Helper functions to convert internal coordinates to chess notation
const fileIndexToLetter = (index: number): string => String.fromCharCode(97 + index);
const levelIndexToLetter = (index: number): string => String.fromCharCode(65 + index);
const indexToHumanNumber = (index: number): number => index + 1;

function GameHUD({ 
  selectedPosition, 
  validMoves, 
  gameState, 
  currentPlayer, 
  gameStatus, 
  moveCount, 
  isActive,
  cursorPosition,
  isKeyboardMode
}: {
  selectedPosition: Position | null;
  validMoves: Position[];
  gameState: GameState;
  currentPlayer: string;
  gameStatus: string;
  moveCount: number;
  isActive: boolean;
  cursorPosition?: Position | null;
  isKeyboardMode?: boolean;
}) {
  if (!isActive) return null;

  const selectedPiece = selectedPosition 
    ? gameState.board[selectedPosition.level][selectedPosition.rank][selectedPosition.file]
    : null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Left - Game Status */}
      <div className="absolute top-4 left-4 bg-black/80 border border-primary/30 rounded p-3 text-white">
        <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wider">GAME STATUS</div>
        <div className="space-y-1 text-xs font-mono">
          <div className="flex justify-between gap-4">
            <span>PLAYER:</span>
            <span className="text-primary">{currentPlayer.toUpperCase()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>MOVES:</span>
            <span className="text-primary">{moveCount}</span>
          </div>
        </div>
      </div>

      {/* Top Right - Selection Info */}
      <div className="absolute top-4 right-4 bg-black/80 border border-primary/30 rounded p-3 text-white">
        <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wider">SELECTION</div>
        {selectedPosition && selectedPiece ? (
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between gap-4">
              <span>PIECE:</span>
              <span className="text-primary">{selectedPiece.type.toUpperCase()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>COLOR:</span>
              <span className="text-primary">{selectedPiece.color.toUpperCase()}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs font-mono text-muted-foreground">
            NO SELECTION
          </div>
        )}
      </div>

      {/* Bottom Left - Position Details */}
      {(selectedPosition || (isKeyboardMode && cursorPosition)) && (
        <div className="absolute bottom-4 left-4 bg-black/80 border border-primary/30 rounded p-3 text-white">
          <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wider">
            {isKeyboardMode && cursorPosition && !selectedPosition ? "CURSOR" : "POSITION"}
          </div>
          <div className="space-y-1 text-xs font-mono">
            {selectedPosition ? (
              <>
                <div className="flex justify-between gap-4">
                  <span>LEVEL:</span>
                  <span className="text-primary">{levelIndexToLetter(selectedPosition.level)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>RANK:</span>
                  <span className="text-primary">{indexToHumanNumber(selectedPosition.rank)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>FILE:</span>
                  <span className="text-primary">{fileIndexToLetter(selectedPosition.file)}</span>
                </div>
              </>
            ) : (isKeyboardMode && cursorPosition) ? (
              <>
                <div className="flex justify-between gap-4">
                  <span>LEVEL:</span>
                  <span className="text-blue-400">{levelIndexToLetter(cursorPosition.level)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>RANK:</span>
                  <span className="text-blue-400">{indexToHumanNumber(cursorPosition.rank)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>FILE:</span>
                  <span className="text-blue-400">{fileIndexToLetter(cursorPosition.file)}</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Bottom Right - Move Info */}
      {validMoves.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-black/80 border border-primary/30 rounded p-3 text-white">
          <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wider">VALID MOVES</div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between gap-4">
              <span>COUNT:</span>
              <span className="text-primary">{validMoves.length}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>STATUS:</span>
              <span className="text-yellow-400">READY</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function RaumschachBoard({
  gameState,
  selectedPosition,
  validMoves,
  onSquareClick,
  onCanvasClick,
  onCanvasPointerDown,
  onCanvasPointerMove,
  onCanvasPointerUp,
  isActive,
  currentPlayer,
  gameStatus,
  moveCount,
  cursorPosition,
  isKeyboardMode,
  onMouseInteraction,
  onCameraAzimuthChange,
  onCanvasReady,
  isFullscreen,
  isDragging
}: RaumschachBoardProps) {
  return (
    <div className={`relative w-full h-full ${isFullscreen ? '' : 'nasa-panel'}`}>
      <Canvas
        camera={{ position: [-8, 8, 8], fov: 75 }}
        style={{ background: 'hsl(var(--background))' }}
        onClick={onCanvasClick}
        onPointerDown={onCanvasPointerDown}
        onPointerMove={onCanvasPointerMove}
        onPointerUp={onCanvasPointerUp}
      >
        <CanvasCapture onCanvasReady={onCanvasReady} />
        <Scene
          gameState={gameState}
          selectedPosition={selectedPosition}
          validMoves={validMoves}
          onSquareClick={isActive ? onSquareClick : () => {}}
          isActive={isActive}
          cursorPosition={cursorPosition}
          isKeyboardMode={isKeyboardMode}
          onMouseInteraction={onMouseInteraction}
          onCameraAzimuthChange={onCameraAzimuthChange}
          isDragging={isDragging}
        />
      </Canvas>
      
      {/* Game HUD */}
      <GameHUD
        selectedPosition={selectedPosition}
        validMoves={validMoves}
        gameState={gameState}
        currentPlayer={currentPlayer}
        gameStatus={gameStatus}
        moveCount={moveCount}
        isActive={isActive}
        cursorPosition={cursorPosition}
        isKeyboardMode={isKeyboardMode}
      />

      {/* Game Ready Overlay */}
      {!isActive && !isFullscreen && (
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer z-10"
          onClick={onCanvasClick}
        >
          <div className="text-center">
            <h2 className="text-4xl font-futura font-bold text-primary mb-4 tracking-wider">
              GAME READY
            </h2>
            <p className="text-lg text-muted-foreground font-futura tracking-wide">
              Click anywhere to begin
            </p>
          </div>
        </div>
      )}
    </div>
  );
}