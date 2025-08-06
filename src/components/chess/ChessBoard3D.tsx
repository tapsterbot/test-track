import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ChessPieces } from './ChessPieces';
import { ChessSquares } from './ChessSquares';
import { ChessLighting } from './ChessLighting';
import { ChessGameState, ChessSquare } from '@/hooks/useChessGame';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ChessBoard3DProps {
  gameState: ChessGameState;
  selectedSquare: ChessSquare | null;
  validMoves: ChessSquare[];
  onSquareClick: (square: ChessSquare) => void;
  cameraPreset: 'overview' | 'white' | 'black' | 'side';
  isActive: boolean;
}

export function ChessBoard3D({
  gameState,
  selectedSquare,
  validMoves,
  onSquareClick,
  cameraPreset,
  isActive
}: ChessBoard3DProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    // Camera preset positions
    const presets = {
      overview: { position: [0, 15, 15], target: [0, 0, 0] },
      white: { position: [0, 8, 8], target: [0, 0, -2] },
      black: { position: [0, 8, -8], target: [0, 0, 2] },
      side: { position: [15, 10, 0], target: [0, 0, 0] }
    };

    const preset = presets[cameraPreset];
    
    // Animate camera to new position
    camera.position.set(preset.position[0], preset.position[1], preset.position[2]);
    controls.target.set(preset.target[0], preset.target[1], preset.target[2]);
    controls.update();
  }, [cameraPreset]);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 15, 15], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <PerspectiveCamera ref={cameraRef} makeDefault />
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.2}
        dampingFactor={0.1}
        enableDamping
      />
      
      <ChessLighting />
      
      {/* Main Board */}
      <group position={[0, 0, 0]}>
        <ChessSquares
          level="main"
          selectedSquare={selectedSquare}
          validMoves={validMoves}
          onSquareClick={onSquareClick}
        />
        {/* Temporarily disabled to isolate error */}
        {/* <ChessPieces
          gameState={gameState}
          level="main"
          selectedSquare={selectedSquare}
          onSquareClick={onSquareClick}
        /> */}
      </group>

      {/* Upper Attack Boards */}
      <group position={[-3, 3, -3]}>
        <ChessSquares
          level="upper-left"
          selectedSquare={selectedSquare}
          validMoves={validMoves}
          onSquareClick={onSquareClick}
          size={[2, 4]}
        />
        {/* <ChessPieces
          gameState={gameState}
          level="upper-left"
          selectedSquare={selectedSquare}
          onSquareClick={onSquareClick}
        /> */}
      </group>

      <group position={[3, 3, -3]}>
        <ChessSquares
          level="upper-right"
          selectedSquare={selectedSquare}
          validMoves={validMoves}
          onSquareClick={onSquareClick}
          size={[2, 4]}
        />
        {/* <ChessPieces
          gameState={gameState}
          level="upper-right"
          selectedSquare={selectedSquare}
          onSquareClick={onSquareClick}
        /> */}
      </group>

      {/* Lower Attack Boards */}
      <group position={[-3, -3, 3]}>
        <ChessSquares
          level="lower-left"
          selectedSquare={selectedSquare}
          validMoves={validMoves}
          onSquareClick={onSquareClick}
          size={[2, 4]}
        />
        {/* <ChessPieces
          gameState={gameState}
          level="lower-left"
          selectedSquare={selectedSquare}
          onSquareClick={onSquareClick}
        /> */}
      </group>

      <group position={[3, -3, 3]}>
        <ChessSquares
          level="lower-right"
          selectedSquare={selectedSquare}
          validMoves={validMoves}
          onSquareClick={onSquareClick}
          size={[2, 4]}
        />
        {/* <ChessPieces
          gameState={gameState}
          level="lower-right"
          selectedSquare={selectedSquare}
          onSquareClick={onSquareClick}
        /> */}
      </group>

      {/* Support Structures */}
      <group>
        {/* Pillars for attack boards */}
        <mesh position={[-3, 0, -3]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 6]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[3, 0, -3]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 6]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-3, -6, 3]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 6]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[3, -6, 3]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 6]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Canvas>
  );
}