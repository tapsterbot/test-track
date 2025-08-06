import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { GameState, Position, ChessPiece } from "@/hooks/useRaumschach";

interface RaumschachBoardProps {
  gameState: GameState;
  selectedPosition: Position | null;
  validMoves: Position[];
  onSquareClick: (position: Position) => void;
  isActive: boolean;
}

interface SquareProps {
  position: Position;
  piece: ChessPiece | null;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: (position: Position) => void;
}

function Square({ position, piece, isSelected, isValidMove, onClick }: SquareProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const x = (position.file - 2) * 1.2;
  const y = position.level * 1.5;
  const z = (position.rank - 2) * 1.2;
  
  const isDark = (position.file + position.rank + position.level) % 2 === 1;
  
  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={[x, y, z]}>
      {/* Square */}
      <mesh
        ref={meshRef}
        onClick={() => onClick(position)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 0.1, 1]} />
        <meshPhongMaterial 
          color={
            isSelected 
              ? "hsl(var(--primary))" 
              : isValidMove 
                ? "hsl(var(--accent))" 
                : hovered 
                  ? "hsl(var(--muted))" 
                  : isDark 
                    ? "hsl(var(--muted-foreground))" 
                    : "hsl(var(--card))"
          }
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Valid move indicator */}
      {isValidMove && (
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshPhongMaterial 
            color="hsl(var(--accent))" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      )}
      
      {/* Chess piece */}
      {piece && (
        <ChessPieceComponent 
          piece={piece} 
          position={[0, 0.3, 0]} 
          isSelected={isSelected}
        />
      )}
    </group>
  );
}

interface ChessPieceComponentProps {
  piece: ChessPiece;
  position: [number, number, number];
  isSelected: boolean;
}

function ChessPieceComponent({ piece, position, isSelected }: ChessPieceComponentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.1;
    }
  });

  const color = piece.color === 'white' ? "hsl(var(--card))" : "hsl(var(--foreground))";
  
  const renderPieceGeometry = () => {
    switch (piece.type) {
      case 'king':
        return <coneGeometry args={[0.3, 0.6, 8]} />;
      case 'queen':
        return <coneGeometry args={[0.25, 0.5, 6]} />;
      case 'rook':
        return <boxGeometry args={[0.4, 0.5, 0.4]} />;
      case 'bishop':
        return <coneGeometry args={[0.2, 0.4, 5]} />;
      case 'knight':
        return <dodecahedronGeometry args={[0.25]} />;
      case 'unicorn':
        return <octahedronGeometry args={[0.3]} />;
      case 'pawn':
        return <sphereGeometry args={[0.2]} />;
      default:
        return <sphereGeometry args={[0.2]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      {renderPieceGeometry()}
      <meshPhongMaterial 
        color={color} 
        emissive={isSelected ? "hsl(var(--primary))" : "black"}
        emissiveIntensity={isSelected ? 0.2 : 0}
      />
    </mesh>
  );
}

function BoardStructure() {
  return (
    <>
      {/* Level indicators */}
      {[0, 1, 2, 3, 4].map((level) => (
        <Text
          key={`level-${level}`}
          position={[-3.5, level * 1.5, 0]}
          fontSize={0.3}
          color="hsl(var(--muted-foreground))"
          anchorX="center"
          anchorY="middle"
        >
          L{level}
        </Text>
      ))}
      
      {/* Support pillars */}
      {[-2, -1, 0, 1, 2].map((x) =>
        [-2, -1, 0, 1, 2].map((z) => (
          <mesh key={`pillar-${x}-${z}`} position={[x * 1.2, 3, z * 1.2]}>
            <cylinderGeometry args={[0.02, 0.02, 6]} />
            <meshPhongMaterial 
              color="hsl(var(--border))" 
              transparent 
              opacity={0.3} 
            />
          </mesh>
        ))
      )}
    </>
  );
}

function Scene({ gameState, selectedPosition, validMoves, onSquareClick }: Omit<RaumschachBoardProps, 'isActive'>) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 6, 0]} intensity={0.5} />
      
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
            
            return (
              <Square
                key={`${levelIndex}-${rankIndex}-${fileIndex}`}
                position={position}
                piece={square}
                isSelected={isSelected}
                isValidMove={isValidMove}
                onClick={onSquareClick}
              />
            );
          })
        )
      )}
    </>
  );
}

export function RaumschachBoard({ gameState, selectedPosition, validMoves, onSquareClick, isActive }: RaumschachBoardProps) {
  return (
    <div className="w-full h-full nasa-panel">
      <Canvas
        camera={{ position: [8, 8, 8], fov: 75 }}
        style={{ background: 'hsl(var(--background))' }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          target={[0, 3, 0]}
        />
        <Scene
          gameState={gameState}
          selectedPosition={selectedPosition}
          validMoves={validMoves}
          onSquareClick={isActive ? onSquareClick : () => {}}
        />
      </Canvas>
    </div>
  );
}