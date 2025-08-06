import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ChessPiece } from '@/hooks/useChessLogic';

interface ChessPieceProps {
  piece: ChessPiece;
  position: [number, number, number];
  onClick: () => void;
}

function PieceGeometry({ type }: { type: ChessPiece['type'] }) {
  switch (type) {
    case 'pawn':
      return (
        <group>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 0.2, 16]} />
          </mesh>
        </group>
      );
    
    case 'rook':
      return (
        <group>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.18, 0.2, 0.3, 16]} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <boxGeometry args={[0.4, 0.04, 0.4]} />
          </mesh>
          <mesh position={[0.15, 0.38, 0]}>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
          </mesh>
          <mesh position={[-0.15, 0.38, 0]}>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
          </mesh>
          <mesh position={[0, 0.38, 0.15]}>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
          </mesh>
          <mesh position={[0, 0.38, -0.15]}>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
          </mesh>
        </group>
      );
    
    case 'knight':
      return (
        <group>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
          </mesh>
          <mesh position={[0, 0.35, 0.1]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.12, 0.25, 0.15]} />
          </mesh>
          <mesh position={[0, 0.45, 0.2]} rotation={[0.5, 0, 0]}>
            <boxGeometry args={[0.08, 0.08, 0.1]} />
          </mesh>
        </group>
      );
    
    case 'bishop':
      return (
        <group>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.08, 0.15, 0.2, 16]} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          <mesh position={[0, 0.58, 0]}>
            <coneGeometry args={[0.03, 0.08, 8]} />
          </mesh>
        </group>
      );
    
    case 'queen':
      return (
        <group>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 0.3, 16]} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 0.2, 16]} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
          </mesh>
          {/* Crown points */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i * Math.PI * 2) / 5) * 0.12,
                0.65,
                Math.sin((i * Math.PI * 2) / 5) * 0.12
              ]}
            >
              <coneGeometry args={[0.02, i === 2 ? 0.12 : 0.08, 6]} />
            </mesh>
          ))}
        </group>
      );
    
    case 'king':
      return (
        <group>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.3, 16]} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.2, 16]} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
          </mesh>
          {/* Cross */}
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[0.03, 0.15, 0.03]} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.08, 0.03, 0.03]} />
          </mesh>
        </group>
      );
    
    default:
      return (
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
        </mesh>
      );
  }
}

function ChessPiece3D({ piece, position, onClick }: ChessPieceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle hover animation
      if (hovered) {
        groupRef.current.position.y = position[1] + 0.1;
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        groupRef.current.position.y = position[1];
        groupRef.current.rotation.y = 0;
      }
    }
  });

  const materialColor = piece.color === 'white' ? '#f8f8f8' : '#2c2c2c';
  const emissiveColor = piece.color === 'white' ? '#ffffff' : '#000000';

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <group scale={hovered ? 1.1 : 1}>
        <meshStandardMaterial
          color={materialColor}
          emissive={emissiveColor}
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={piece.color === 'white' ? 0.1 : 0.2}
        />
        <PieceGeometry type={piece.type} />
      </group>
      
      {/* Shadow */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.25, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

interface ChessPiecesProps {
  board: (ChessPiece | null)[][];
  level: number;
  levelY: number;
  onPieceClick: (row: number, col: number) => void;
}

export function ChessPieces({ board, level, levelY, onPieceClick }: ChessPiecesProps) {
  const pieces = [];
  const levelSize = board.length;
  
  for (let row = 0; row < levelSize; row++) {
    for (let col = 0; col < levelSize; col++) {
      const piece = board[row][col];
      if (piece) {
        pieces.push(
          <ChessPiece3D
            key={`${level}-${row}-${col}`}
            piece={piece}
            position={[col - levelSize/2 + 0.5, levelY + 0.5, row - levelSize/2 + 0.5]}
            onClick={() => onPieceClick(row, col)}
          />
        );
      }
    }
  }
  
  return <>{pieces}</>;
}