import { ChessSquare } from '@/hooks/useChessGame';
import { useState, useMemo, memo, useCallback } from 'react';

interface ChessSquaresProps {
  level: 'main' | 'upper-left' | 'upper-right' | 'lower-left' | 'lower-right';
  selectedSquare: ChessSquare | null;
  validMoves: ChessSquare[];
  onSquareClick: (square: ChessSquare) => void;
  size?: [number, number]; // [width, height] in squares
}

export const ChessSquares = memo(function ChessSquares({ 
  level, 
  selectedSquare, 
  validMoves, 
  onSquareClick, 
  size = [8, 8] 
}: ChessSquaresProps) {
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);
  
  const [width, height] = size;
  
  // Stable event handlers
  const handleSquareHover = useCallback((squareKey: string) => {
    setHoveredSquare(squareKey);
  }, []);
  
  const handleSquareLeave = useCallback(() => {
    setHoveredSquare(null);
  }, []);

  const handleSquareClick = useCallback((square: ChessSquare) => {
    onSquareClick(square);
  }, [onSquareClick]);

  // Memoize valid moves set for faster lookups
  const validMovesSet = useMemo(() => {
    return new Set(validMoves.map(move => `${move.level}-${move.file}-${move.rank}`));
  }, [validMoves]);

  // Memoize selected square key
  const selectedSquareKey = useMemo(() => {
    return selectedSquare ? `${selectedSquare.level}-${selectedSquare.file}-${selectedSquare.rank}` : null;
  }, [selectedSquare]);

  // Memoize squares array to prevent recreation
  const squares = useMemo(() => {
    const squareElements = [];
    
    for (let file = 0; file < width; file++) {
      for (let rank = 0; rank < height; rank++) {
        const isLight = (file + rank) % 2 === 0;
        const squareKey = `${level}-${file}-${rank}`;
        const square: ChessSquare = { level, file, rank };
        
        const isSelected = selectedSquareKey === squareKey;
        const isValidMove = validMovesSet.has(squareKey);
        const isHovered = hoveredSquare === squareKey;
        
        // Determine color based on state
        let color: string;
        if (isSelected) {
          color = '#7fc3ff';
        } else if (isValidMove) {
          color = '#90ee90';
        } else if (isHovered) {
          color = isLight ? '#e6d3a8' : '#a67d4a';
        } else {
          color = isLight ? '#f0d9b5' : '#b58863';
        }
        
        squareElements.push(
          <mesh
            key={squareKey}
            position={[
              file - (width - 1) / 2,
              0.05,
              rank - (height - 1) / 2
            ]}
            onPointerOver={() => handleSquareHover(squareKey)}
            onPointerOut={handleSquareLeave}
            onClick={() => handleSquareClick(square)}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.9, 0.1, 0.9]} />
            <meshStandardMaterial
              color={color}
              metalness={0.0}
              roughness={0.95}
            />
          </mesh>
        );
      }
    }
    
    return squareElements;
  }, [width, height, level, selectedSquareKey, validMovesSet, hoveredSquare, handleSquareHover, handleSquareLeave, handleSquareClick]);

  return (
    <>
      {squares}
      {/* Board frame */}
      <mesh 
        position={[0, 0, 0]} 
        receiveShadow
        scale={[width + 0.2, 1, height + 0.2]}
      >
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial
          color="#b58863"
          metalness={0.0}
          roughness={0.95}
        />
      </mesh>
    </>
  );
});