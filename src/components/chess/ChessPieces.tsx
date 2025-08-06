import { ChessGameState, ChessSquare } from '@/hooks/useChessGame';
import { useState, useMemo, memo, useCallback } from 'react';

interface ChessPiecesProps {
  gameState: ChessGameState;
  level: 'main' | 'upper-left' | 'upper-right' | 'lower-left' | 'lower-right';
  selectedSquare: ChessSquare | null;
  onSquareClick: (square: ChessSquare) => void;
}

const PieceGeometry = memo(function PieceGeometry({ 
  piece, 
  isWhite, 
  isSelected 
}: { 
  piece: string; 
  isWhite: boolean; 
  isSelected: boolean; 
}) {
  const type = piece.toLowerCase();
  
  const material = (
    <meshStandardMaterial
      color={isWhite ? '#f5f5f5' : '#2c2c2c'}
      metalness={0.0}
      roughness={0.8}
      emissive={isSelected ? '#3366ff' : '#000000'}
      emissiveIntensity={isSelected ? 0.2 : 0}
    />
  );
  
  switch (type) {
    case 'k': // King
      return (
        <group>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 0.6]} />
            {material}
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            {material}
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.1]} />
            {material}
          </mesh>
        </group>
      );
    
    case 'q': // Queen
      return (
        <group>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.28, 0.32, 0.6]} />
            {material}
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <coneGeometry args={[0.25, 0.3]} />
            {material}
          </mesh>
        </group>
      );
    
    case 'r': // Rook
      return (
        <group>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            {material}
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.6, 0.1, 0.6]} />
            {material}
          </mesh>
        </group>
      );
    
    case 'b': // Bishop
      return (
        <group>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.25, 0.3, 0.5]} />
            {material}
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <coneGeometry args={[0.2, 0.3]} />
            {material}
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.08]} />
            {material}
          </mesh>
        </group>
      );
    
    case 'n': // Knight
      return (
        <group>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.25, 0.3, 0.5]} />
            {material}
          </mesh>
          <mesh position={[0, 0.5, 0.15]}>
            <boxGeometry args={[0.2, 0.4, 0.3]} />
            {material}
          </mesh>
          <mesh position={[0, 0.65, 0.25]}>
            <coneGeometry args={[0.1, 0.2]} />
            {material}
          </mesh>
        </group>
      );
    
    case 'p': // Pawn
      return (
        <group>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.4]} />
            {material}
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.15]} />
            {material}
          </mesh>
        </group>
      );
    
    default:
      return (
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.5]} />
          {material}
        </mesh>
      );
  }
});

export const ChessPieces = memo(function ChessPieces({ 
  gameState, 
  level, 
  selectedSquare, 
  onSquareClick 
}: ChessPiecesProps) {
  const [hoveredPiece, setHoveredPiece] = useState<string | null>(null);
  
  const boardState = gameState.boards[level];
  
  // Stable event handlers
  const handlePieceHover = useCallback((pieceKey: string) => {
    setHoveredPiece(pieceKey);
  }, []);
  
  const handlePieceLeave = useCallback(() => {
    setHoveredPiece(null);
  }, []);

  const handlePieceClick = useCallback((square: ChessSquare) => {
    onSquareClick(square);
  }, [onSquareClick]);
  
  // Memoize pieces array to prevent recreation
  const pieces = useMemo(() => {
    if (!boardState) return [];
    
    const pieceElements = [];
    
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
        
        pieceElements.push(
          <group
            key={pieceKey}
            position={[
              file - (boardSize[0] - 1) / 2,
              0.15,
              rank - (boardSize[1] - 1) / 2
            ]}
            onPointerOver={() => handlePieceHover(pieceKey)}
            onPointerOut={handlePieceLeave}
            onClick={() => handlePieceClick(square)}
            scale={isHovered ? 1.1 : 1}
          >
            <PieceGeometry 
              piece={piece} 
              isWhite={isWhite} 
              isSelected={isSelected} 
            />
          </group>
        );
      }
    }
    
    return pieceElements;
  }, [boardState, level, selectedSquare, hoveredPiece, handlePieceHover, handlePieceLeave, handlePieceClick]);
  
  return <>{pieces}</>;
});