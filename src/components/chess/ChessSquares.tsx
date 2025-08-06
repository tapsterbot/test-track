import { ChessSquare } from '@/hooks/useChessGame';
import { useState, useMemo, memo } from 'react';
import * as THREE from 'three';

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
  
  // Memoize geometry to prevent recreation
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(0.9, 0.1, 0.9), []);
  
  // Memoize materials to prevent flickering
  const materials = useMemo(() => ({
    lightSquare: new THREE.MeshStandardMaterial({ 
      color: '#f0d9b5', 
      metalness: 0.1, 
      roughness: 0.7,
      transparent: level !== 'main',
      opacity: level !== 'main' ? 0.8 : 1,
      side: THREE.DoubleSide
    }),
    darkSquare: new THREE.MeshStandardMaterial({ 
      color: '#b58863', 
      metalness: 0.1, 
      roughness: 0.7,
      transparent: level !== 'main',
      opacity: level !== 'main' ? 0.8 : 1,
      side: THREE.DoubleSide
    }),
    selectedSquare: new THREE.MeshStandardMaterial({ 
      color: '#7fc3ff', 
      metalness: 0.1, 
      roughness: 0.7,
      transparent: level !== 'main',
      opacity: level !== 'main' ? 0.8 : 1,
      side: THREE.DoubleSide
    }),
    validMove: new THREE.MeshStandardMaterial({ 
      color: '#90ee90', 
      metalness: 0.1, 
      roughness: 0.7,
      transparent: level !== 'main',
      opacity: level !== 'main' ? 0.8 : 1,
      side: THREE.DoubleSide
    }),
    lightHovered: new THREE.MeshStandardMaterial({ 
      color: '#e6d3a8', 
      metalness: 0.1, 
      roughness: 0.7,
      transparent: level !== 'main',
      opacity: level !== 'main' ? 0.8 : 1,
      side: THREE.DoubleSide
    }),
    darkHovered: new THREE.MeshStandardMaterial({ 
      color: '#a67d4a', 
      metalness: 0.1, 
      roughness: 0.7,
      transparent: level !== 'main',
      opacity: level !== 'main' ? 0.8 : 1,
      side: THREE.DoubleSide
    })
  }), [level]);

  // Memoize valid moves set for faster lookups
  const validMovesSet = useMemo(() => {
    return new Set(validMoves.map(move => `${move.level}-${move.file}-${move.rank}`));
  }, [validMoves]);

  // Memoize selected square key
  const selectedSquareKey = useMemo(() => {
    return selectedSquare ? `${selectedSquare.level}-${selectedSquare.file}-${selectedSquare.rank}` : null;
  }, [selectedSquare]);

  const squares = [];
  
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
      
      squares.push(
        <mesh
          key={squareKey}
          position={[
            file - (width - 1) / 2,
            0.05,
            rank - (height - 1) / 2
          ]}
          onPointerOver={() => setHoveredSquare(squareKey)}
          onPointerOut={() => setHoveredSquare(null)}
          onClick={() => onSquareClick(square)}
          castShadow
          receiveShadow
        >
          <primitive object={boxGeometry} />
          <primitive object={material} />
        </mesh>
      );
    }
  }

  return (
    <>
      {squares}
      {/* Board frame */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[width + 0.2, 0.2, height + 0.2]} />
        <meshStandardMaterial 
          color="#4a4a4a" 
          metalness={0.8} 
          roughness={0.2}
          transparent={level !== 'main'}
          opacity={level !== 'main' ? 0.6 : 1}
        />
      </mesh>
    </>
  );
});