import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useChessLogic } from '@/hooks/useChessLogic';
import { useChessControls } from '@/hooks/useChessControls';
import { ChessPieces } from './ChessPieces';

interface ChessBoard3DProps {
  isActive: boolean;
  cameraMode: 'orbit' | 'white' | 'black';
  onGameUpdate: (gameState: any) => void;
  onToggleGame: () => void;
}

function ChessSquare({ 
  position, 
  color, 
  isSelected, 
  isValidMove, 
  isKeyboardCursor,
  onClick 
}: {
  position: [number, number, number];
  color: 'light' | 'dark';
  isSelected: boolean;
  isValidMove: boolean;
  isKeyboardCursor: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle hover animation
      if (hovered || isSelected) {
        meshRef.current.position.y = 0.05;
      } else {
        meshRef.current.position.y = 0;
      }

      // Keyboard cursor pulsing effect
      if (isKeyboardCursor) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.05);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const baseColor = color === 'light' ? '#f0d9b5' : '#b58863';
  let materialColor = baseColor;
  
  if (isSelected) {
    materialColor = '#9bc53d'; // Green for selected
  } else if (isValidMove) {
    materialColor = '#ffd700'; // Gold for valid moves
  } else if (isKeyboardCursor) {
    materialColor = '#4a9eff'; // Blue for keyboard cursor
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial 
        color={materialColor}
        roughness={0.3}
        metalness={0.1}
      />
      {isValidMove && (
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
          <meshStandardMaterial color="#ffd700" transparent opacity={0.8} />
        </mesh>
      )}
    </mesh>
  );
}

function Board({ 
  selectedSquare, 
  validMoves, 
  keyboardCursor, 
  isKeyboardMode,
  onSquareClick,
  board
}: {
  selectedSquare: any;
  validMoves: any[];
  keyboardCursor: any;
  isKeyboardMode: boolean;
  onSquareClick: (row: number, col: number) => void;
  board: any[][];
}) {
  const squares = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0;
      const isSelected = selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
      const isValidMove = validMoves.some(move => move.row === row && move.col === col);
      const isKeyboardCursor = isKeyboardMode && keyboardCursor.row === row && keyboardCursor.col === col;
      
      squares.push(
        <ChessSquare
          key={`${row}-${col}`}
          position={[col - 3.5, 0, row - 3.5]}
          color={isLight ? 'light' : 'dark'}
          isSelected={isSelected}
          isValidMove={isValidMove}
          isKeyboardCursor={isKeyboardCursor}
          onClick={() => onSquareClick(row, col)}
        />
      );
    }
  }

  return (
    <group>
      {squares}
      <ChessPieces board={board} onPieceClick={onSquareClick} />
    </group>
  );
}

function CameraController({ 
  cameraMode, 
  isActive 
}: { 
  cameraMode: 'orbit' | 'white' | 'black';
  isActive: boolean;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>();

  useFrame(() => {
    if (!controlsRef.current) return;

    switch (cameraMode) {
      case 'white':
        camera.position.lerp(new THREE.Vector3(0, 8, 6), 0.05);
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, -1), 0.05);
        break;
      case 'black':
        camera.position.lerp(new THREE.Vector3(0, 8, -6), 0.05);
        controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 1), 0.05);
        break;
      case 'orbit':
        // Let OrbitControls handle positioning
        break;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={cameraMode === 'orbit'}
      maxPolarAngle={Math.PI / 2.2}
      minDistance={5}
      maxDistance={20}
    />
  );
}

function SceneContent({ 
  isActive, 
  cameraMode, 
  onGameUpdate, 
  onToggleGame 
}: ChessBoard3DProps) {
  const chessLogic = useChessLogic();
  const chessControls = useChessControls();

  useEffect(() => {
    const gameState = chessLogic.getGameState();
    onGameUpdate(gameState);
  }, [chessLogic.currentPlayer, chessLogic.board, onGameUpdate]);

  const handleSquareClick = (row: number, col: number) => {
    chessLogic.selectSquare({ row, col });
    chessControls.setCursorPosition({ row, col });
  };

  // Handle keyboard selection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (chessControls.isKeyboardMode) {
          event.preventDefault();
          const pos = chessControls.cursorPosition;
          chessLogic.selectSquare(pos);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chessLogic, chessControls]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      {/* Board */}
      <Board
        selectedSquare={chessLogic.selectedSquare}
        validMoves={chessLogic.validMoves}
        keyboardCursor={chessControls.cursorPosition}
        isKeyboardMode={chessControls.isKeyboardMode}
        onSquareClick={handleSquareClick}
        board={chessLogic.board}
      />

      {/* Board Frame */}
      <group position={[0, -0.1, 0]}>
        <mesh>
          <boxGeometry args={[9, 0.2, 9]} />
          <meshStandardMaterial color="#8b4513" roughness={0.8} />
        </mesh>
      </group>

      {/* Camera Controller */}
      <CameraController cameraMode={cameraMode} isActive={isActive} />
    </>
  );
}

export function ChessBoard3D(props: ChessBoard3DProps) {
  const handleCanvasClick = () => {
    if (!props.isActive) {
      props.onToggleGame();
    }
  };

  return (
    <div className="w-full h-full" onClick={handleCanvasClick}>
      <Canvas
        camera={{ position: [0, 8, 6], fov: 50 }}
        shadows
        style={{ background: 'transparent' }}
      >
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
}