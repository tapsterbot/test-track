import { ChessGameState, ChessSquare } from '@/hooks/useChessGame';
import { useState } from 'react';
import * as THREE from 'three';

interface ChessPiecesProps {
  gameState: ChessGameState;
  level: 'main' | 'upper-left' | 'upper-right' | 'lower-left' | 'lower-right';
  selectedSquare: ChessSquare | null;
  onSquareClick: (square: ChessSquare) => void;
}

function PieceGeometry({ piece }: { piece: string }) {
  const type = piece.toLowerCase();
  
  switch (type) {
    case 'k': // King
      return (
        <group>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.6]} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.1]} />
          </mesh>
        </group>
      );
    
    case 'q': // Queen
      return (
        <group>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.28, 0.32, 0.6]} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <coneGeometry args={[0.25, 0.3]} />
          </mesh>
        </group>
      );
    
    case 'r': // Rook
      return (
        <group>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.6, 0.1, 0.6]} />
          </mesh>
        </group>
      );
    
    case 'b': // Bishop
      return (
        <group>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.25, 0.3, 0.5]} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <coneGeometry args={[0.2, 0.3]} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.08]} />
          </mesh>
        </group>
      );
    
    case 'n': // Knight
      return (
        <group>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.25, 0.3, 0.5]} />
          </mesh>
          <mesh position={[0, 0.5, 0.15]}>
            <boxGeometry args={[0.2, 0.4, 0.3]} />
          </mesh>
          <mesh position={[0, 0.65, 0.25]}>
            <coneGeometry args={[0.1, 0.2]} />
          </mesh>
        </group>
      );
    
    case 'p': // Pawn
      return (
        <group>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.4]} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.15]} />
          </mesh>
        </group>
      );
    
    default:
      return (
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.5]} />
        </mesh>
      );
  }
}

export function ChessPieces({ 
  gameState, 
  level, 
  selectedSquare, 
  onSquareClick 
}: ChessPiecesProps) {
  const [hoveredPiece, setHoveredPiece] = useState<string | null>(null);
  
  const pieces = [];
  const boardState = gameState.boards[level];
  
  if (!boardState) return null;
  
  for (let file = 0; file < boardState.length; file++) {
    for (let rank = 0; rank < boardState[file].length; rank++) {
      const piece = boardState[file][rank];
      if (!piece) continue;
      
      const pieceKey = `${level}-${file}-${rank}-${piece}`;
      const square: ChessSquare = { level, file, rank };
      const boardSize = level === 'main' ? [8, 8] : [2, 4];
      
      const isSelected = selectedSquare && 
        selectedSquare.level === level && 
        selectedSquare.file === file && 
        selectedSquare.rank === rank;
      
      const isHovered = hoveredPiece === pieceKey;
      const isWhite = piece === piece.toUpperCase();
      
      pieces.push(
        <group
          key={pieceKey}
          position={[
            file - (boardSize[0] - 1) / 2,
            0.15,
            rank - (boardSize[1] - 1) / 2
          ]}
          onPointerOver={() => setHoveredPiece(pieceKey)}
          onPointerOut={() => setHoveredPiece(null)}
          onClick={() => onSquareClick(square)}
          scale={isHovered ? 1.1 : 1}
        >
          <meshStandardMaterial
            color={isWhite ? '#f5f5f5' : '#2c2c2c'}
            metalness={0.3}
            roughness={0.4}
            emissive={isSelected ? '#3366ff' : '#000000'}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
          <PieceGeometry piece={piece} />
        </group>
      );
    }
  }
  
  return <>{pieces}</>;
}