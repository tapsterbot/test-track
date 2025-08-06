import { ChessSquare } from '@/hooks/useChessGame';
import { useState, useMemo, memo, useCallback } from 'react';
import { createSquareMaterials, getSharedGeometries } from '@/lib/threeMaterials';

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
  
  // Use shared geometries and stable materials
  const { square: boxGeometry, frame: frameGeometry } = useMemo(() => getSharedGeometries(), []);
  const materials = useMemo(() => createSquareMaterials(level), [level]);
  
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
        
        // Select the appropriate material based on state
        let material;
        if (isSelected) {
          material = materials.selectedSquare;
        } else if (isValidMove) {
          material = materials.validMove;
        } else if (isHovered) {
          material = isLight ? materials.lightHovered : materials.darkHovered;
        } else {
          material = isLight ? materials.lightSquare : materials.darkSquare;
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
            geometry={boxGeometry}
            material={material}
          />
        );
      }
    }
    
    return squareElements;
  }, [width, height, level, selectedSquareKey, validMovesSet, hoveredSquare, materials, boxGeometry, handleSquareHover, handleSquareLeave, handleSquareClick]);

  // Memoize frame geometry and material
  const frameMaterial = useMemo(() => {
    return materials.darkSquare.clone();
  }, [materials.darkSquare, level]);

  return (
    <>
      {squares}
      {/* Board frame */}
      <mesh 
        position={[0, 0, 0]} 
        receiveShadow
        geometry={frameGeometry}
        material={frameMaterial}
        scale={[width + 0.2, 1, height + 0.2]}
      />
    </>
  );
});