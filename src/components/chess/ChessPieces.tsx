import { ChessGameState, ChessSquare } from '@/hooks/useChessGame';
import { useState, useMemo, memo, useCallback } from 'react';
import { createPieceMaterials, getSharedGeometries } from '@/lib/threeMaterials';

interface ChessPiecesProps {
  gameState: ChessGameState;
  level: 'main' | 'upper-left' | 'upper-right' | 'lower-left' | 'lower-right';
  selectedSquare: ChessSquare | null;
  onSquareClick: (square: ChessSquare) => void;
}

const PieceGeometry = memo(function PieceGeometry({ piece }: { piece: string }) {
  const type = piece.toLowerCase();
  const geometries = useMemo(() => getSharedGeometries(), []);
  
  switch (type) {
    case 'k': // King
      return (
        <group>
          <mesh position={[0, 0.3, 0]} geometry={geometries.king} />
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
          <mesh position={[0, 0.3, 0]} geometry={geometries.queen} />
          <mesh position={[0, 0.65, 0]}>
            <coneGeometry args={[0.25, 0.3]} />
          </mesh>
        </group>
      );
    
    case 'r': // Rook
      return (
        <group>
          <mesh position={[0, 0.25, 0]} geometry={geometries.rook} />
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[0.6, 0.1, 0.6]} />
          </mesh>
        </group>
      );
    
    case 'b': // Bishop
      return (
        <group>
          <mesh position={[0, 0.25, 0]} geometry={geometries.bishop} />
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
          <mesh position={[0, 0.25, 0]} geometry={geometries.knight} />
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
          <mesh position={[0, 0.2, 0]} geometry={geometries.pawn} />
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.15]} />
          </mesh>
        </group>
      );
    
    default:
      return (
        <mesh position={[0, 0.25, 0]} geometry={geometries.pawn} />
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
  
  // Use stable materials
  const materials = useMemo(() => createPieceMaterials(), []);
  
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
        
        // Select material based on piece color and selection state
        let material;
        if (isSelected) {
          material = isWhite ? materials.whiteSelected : materials.blackSelected;
        } else {
          material = isWhite ? materials.white : materials.black;
        }
        
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
            <meshStandardMaterial attach="material" {...material} />
            <PieceGeometry piece={piece} />
          </group>
        );
      }
    }
    
    return pieceElements;
  }, [boardState, level, selectedSquare, hoveredPiece, materials, handlePieceHover, handlePieceLeave, handlePieceClick]);
  
  return <>{pieces}</>;
});