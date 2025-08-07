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
  onCanvasClick?: () => void;
  onCanvasPointerDown?: (event: any) => void;
  onCanvasPointerMove?: (event: any) => void;
  onCanvasPointerUp?: () => void;
  isActive: boolean;
  currentPlayer: string;
  gameStatus: string;
  moveCount: number;
  cursorPosition?: Position | null;
  isKeyboardMode?: boolean;
  onMouseInteraction?: () => void;
  kingInCheck?: { color: 'white' | 'black' } | null;
}

interface SquareProps {
  position: Position;
  piece: ChessPiece | null;
  isSelected: boolean;
  isValidMove: boolean;
  isCursor: boolean;
  onClick: (position: Position) => void;
  onMouseEnter?: () => void;
  isKingInCheck?: boolean;
}

function Square({ position, piece, isSelected, isValidMove, isCursor, onClick, onMouseEnter, isKingInCheck }: SquareProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const x = (position.file - 2) * 1.2;
  const y = position.level * 1.5;
  const z = (position.rank - 2) * 1.2;
  
  const isDark = (position.file + position.rank + position.level) % 2 === 1;

  return (
    <group position={[x, y, z]}>
      {/* Square */}
      <mesh
        ref={meshRef}
        onClick={() => onClick(position)}
        onPointerOver={() => {
          setHovered(true);
          onMouseEnter?.();
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 0.1, 1]} />
        <meshPhongMaterial 
          color={
            isSelected 
              ? "#22c55e" // Green for selected
              : isValidMove 
                ? "#f59e0b" // Amber for valid moves
                : isCursor
                  ? "#3b82f6" // Blue for keyboard cursor
                : isKingInCheck
                  ? "#dc2626" // Red for king in check
                : hovered 
                  ? "#6b7280" // Gray for hover
                  : isDark 
                    ? "#374151" // Dark gray for dark squares
                    : "#f3f4f6" // Light gray for light squares
          }
          emissive={isKingInCheck ? "#dc2626" : "#000000"}
          emissiveIntensity={isKingInCheck ? 0.4 : 0}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Keyboard cursor indicator */}
      {isCursor && (
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[1.1, 0.02, 1.1]} />
          <meshPhongMaterial 
            color="#3b82f6"
            emissive="#1e40af"
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
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
  
  // More solid colors for better visibility
  const color = piece.color === 'white' ? "#e2e8f0" : "#1f2937"; // Light gray instead of white
  const edgeColor = piece.color === 'white' ? "#94a3b8" : "#111827"; // Darker edges for strong contrast
  
  const createMaterial = (useEdge = false) => (
    <meshPhongMaterial 
      color={useEdge ? edgeColor : color}
      shininess={piece.color === 'white' ? 5 : 80} // Lower shininess for white pieces to make them more solid
      specular={piece.color === 'white' ? "#64748b" : "#444444"} // Darker specular for white pieces
      emissive={isSelected ? "#22c55e" : (piece.color === 'white' ? "#f1f5f9" : "#000000")} // Slight emission for white pieces
      emissiveIntensity={isSelected ? 0.3 : (piece.color === 'white' ? 0.1 : 0)}
    />
  );

  const renderPiece = () => {
    switch (piece.type) {
      case 'king':
        return (
          <group>
            {/* Base cylinder */}
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.25, 0.3, 0.4, 8]} />
              {createMaterial()}
            </mesh>
            {/* Edge outline */}
            <mesh position={[0, -0.1, 0]} scale={[1.03, 1.03, 1.03]}>
              <cylinderGeometry args={[0.25, 0.3, 0.4, 8]} />
              <meshBasicMaterial color={edgeColor} transparent opacity={0.6} />
            </mesh>
            {/* Crown top */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
              {createMaterial()}
            </mesh>
          </group>
        );
      case 'queen':
        return (
          <group>
            {/* Base cylinder */}
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
              {createMaterial()}
            </mesh>
            {/* Edge outline */}
            <mesh position={[0, -0.05, 0]} scale={[1.03, 1.03, 1.03]}>
              <cylinderGeometry args={[0.2, 0.25, 0.4, 8]} />
              <meshBasicMaterial color={edgeColor} transparent opacity={0.6} />
            </mesh>
            {/* Crown points */}
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh key={i} position={[
                Math.cos((i * Math.PI * 2) / 5) * 0.15,
                0.25,
                Math.sin((i * Math.PI * 2) / 5) * 0.15
              ]}>
                <sphereGeometry args={[0.05]} />
                {createMaterial()}
              </mesh>
            ))}
          </group>
        );
      case 'rook':
        return (
          <group>
            {/* Base */}
            <mesh>
              <boxGeometry args={[0.35, 0.4, 0.35]} />
              {createMaterial()}
            </mesh>
            {/* Edge outline */}
            <mesh scale={[1.03, 1.03, 1.03]}>
              <boxGeometry args={[0.35, 0.4, 0.35]} />
              <meshBasicMaterial color={edgeColor} transparent opacity={0.6} />
            </mesh>
            {/* Crenellations */}
            {[-0.1, 0.1].map((x) => 
              [-0.1, 0.1].map((z) => (
                <mesh key={`${x}-${z}`} position={[x, 0.25, z]}>
                  <boxGeometry args={[0.08, 0.1, 0.08]} />
                  {createMaterial()}
                </mesh>
              ))
            )}
          </group>
        );
      case 'bishop':
        return (
          <group>
            {/* Base */}
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
              {createMaterial()}
            </mesh>
            {/* Miter top */}
            <mesh position={[0, 0.2, 0]}>
              <coneGeometry args={[0.12, 0.25, 8]} />
              {createMaterial()}
            </mesh>
          </group>
        );
      case 'knight':
        return (
          <group>
            {/* Body */}
            <mesh position={[0, -0.05, 0]}>
              <boxGeometry args={[0.25, 0.3, 0.35]} />
              {createMaterial()}
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.15, 0.15]}>
              <boxGeometry args={[0.15, 0.2, 0.25]} />
              {createMaterial()}
            </mesh>
          </group>
        );
      case 'unicorn':
        return (
          <group>
            {/* Body */}
            <mesh position={[0, -0.05, 0]}>
              <coneGeometry args={[0.2, 0.4, 6]} />
              {createMaterial()}
            </mesh>
            {/* Horn */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.02, 0.04, 0.3]} />
              {createMaterial()}
            </mesh>
          </group>
        );
      case 'pawn':
        return (
          <group>
            {/* Base */}
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.12, 0.15, 0.2]} />
              {createMaterial()}
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.15]} />
              {createMaterial()}
            </mesh>
          </group>
        );
      default:
        return (
          <mesh>
            <sphereGeometry args={[0.2]} />
            {createMaterial()}
          </mesh>
        );
    }
  };

  return (
    <group position={position}>
      {renderPiece()}
    </group>
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
          color="#6b7280"
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
              color="#9ca3af" 
              transparent 
              opacity={0.3} 
            />
          </mesh>
        ))
      )}
    </>
  );
}

function CameraControls({ isActive, onRotateLeft, onRotateRight }: { 
  isActive: boolean;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  
  // Expose rotation functions
  useEffect(() => {
    if (onRotateLeft) {
      (window as any).rotateCameraLeft = () => {
        if (controlsRef.current) {
          const currentAzimuth = controlsRef.current.getAzimuthalAngle();
          controlsRef.current.setAzimuthalAngle(currentAzimuth - Math.PI / 4); // 45 degrees left
          controlsRef.current.update();
        }
      };
    }
    if (onRotateRight) {
      (window as any).rotateCameraRight = () => {
        if (controlsRef.current) {
          const currentAzimuth = controlsRef.current.getAzimuthalAngle();
          controlsRef.current.setAzimuthalAngle(currentAzimuth + Math.PI / 4); // 45 degrees right
          controlsRef.current.update();
        }
      };
    }
  }, [onRotateLeft, onRotateRight]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enablePan={isActive}
      enableZoom={isActive}
      enableRotate={isActive}
      minDistance={5}
      maxDistance={20}
      target={[0, 3, 0]}
    />
  );
}

function Scene({ gameState, selectedPosition, validMoves, onSquareClick, isActive, cursorPosition, isKeyboardMode, onMouseInteraction, kingInCheck }: { 
  gameState: GameState; 
  selectedPosition: Position | null; 
  validMoves: Position[]; 
  onSquareClick: (position: Position) => void; 
  isActive: boolean; 
  cursorPosition?: Position | null; 
  isKeyboardMode?: boolean; 
  onMouseInteraction?: () => void;
  kingInCheck?: { color: 'white' | 'black' } | null;
}) {
  const rotateLeft = () => (window as any).rotateCameraLeft?.();
  const rotateRight = () => (window as any).rotateCameraRight?.();
  
  return (
    <>
      <CameraControls isActive={isActive} onRotateLeft={rotateLeft} onRotateRight={rotateRight} />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.0} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 8, 0]} intensity={0.8} />
      
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
            const isCursor = isKeyboardMode && cursorPosition && 
              cursorPosition.level === levelIndex && 
              cursorPosition.rank === rankIndex && 
              cursorPosition.file === fileIndex;
            const isKingInCheck = kingInCheck && 
              square?.type === 'king' && 
              square?.color === kingInCheck.color;
            
            return (
              <Square
                key={`${levelIndex}-${rankIndex}-${fileIndex}`}
                position={position}
                piece={square}
                isSelected={isSelected}
                isValidMove={isValidMove}
                isCursor={isCursor}
                onClick={onSquareClick}
                onMouseEnter={onMouseInteraction}
                isKingInCheck={!!isKingInCheck}
              />
            );
          })
        )
      )}
    </>
  );
}

function GameHUD({ 
  selectedPosition, 
  validMoves, 
  gameState, 
  currentPlayer, 
  gameStatus, 
  moveCount, 
  isActive,
  cursorPosition,
  isKeyboardMode,
  kingInCheck
}: {
  selectedPosition: Position | null;
  validMoves: Position[];
  gameState: GameState;
  currentPlayer: string;
  gameStatus: string;
  moveCount: number;
  isActive: boolean;
  cursorPosition?: Position | null;
  isKeyboardMode?: boolean;
  kingInCheck?: { color: 'white' | 'black' } | null;
}) {
  if (!isActive) return null;

  const selectedPiece = selectedPosition 
    ? gameState.board[selectedPosition.level][selectedPosition.rank][selectedPosition.file]
    : null;

  const getStatusDisplay = () => {
    switch (gameState.gameStatus) {
      case 'check':
        return <span className="text-yellow-400 animate-pulse">CHECK!</span>;
      case 'checkmate':
        return <span className="text-red-400 animate-pulse">CHECKMATE!</span>;
      case 'stalemate':
        return <span className="text-gray-400">STALEMATE</span>;
      default:
        return <span className="text-primary">ACTIVE</span>;
    }
  };

  const getStatusMessage = () => {
    switch (gameState.gameStatus) {
      case 'check':
        return `${kingInCheck?.color?.toUpperCase() || 'PLAYER'} KING IN CHECK!`;
      case 'checkmate':
        const winner = gameState.currentPlayer === 'white' ? 'BLACK' : 'WHITE';
        return `${winner} WINS BY CHECKMATE!`;
      case 'stalemate':
        return 'GAME DRAWN BY STALEMATE';
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Critical Status Alert (when check/checkmate/stalemate) */}
      {statusMessage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className={`bg-black/95 border-2 rounded-lg p-6 text-center shadow-lg ${
            gameState.gameStatus === 'check' 
              ? "border-yellow-400" 
              : gameState.gameStatus === 'checkmate' 
                ? "border-red-400" 
                : "border-gray-400"
          }`}>
            <div className="text-2xl font-mono font-bold mb-2">
              {getStatusDisplay()}
            </div>
            <div className="text-lg font-mono text-white">
              {statusMessage}
            </div>
          </div>
        </div>
      )}

      {/* Top Left - Game Status */}
      <div className="absolute top-4 left-4 bg-black/80 border border-primary/30 rounded p-3 text-white">
        <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wider">GAME STATUS</div>
        <div className="space-y-1 text-xs font-mono">
          <div className="flex justify-between gap-4">
            <span>STATUS:</span>
            {getStatusDisplay()}
          </div>
          <div className="flex justify-between gap-4">
            <span>PLAYER:</span>
            <span className="text-primary">{currentPlayer.toUpperCase()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>MOVES:</span>
            <span className="text-primary">{moveCount}</span>
          </div>
        </div>
      </div>

      {/* Top Right - Selection Info */}
      <div className="absolute top-4 right-4 bg-black/80 border border-primary/30 rounded p-3 text-white">
        <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wider">SELECTION</div>
        {selectedPosition && selectedPiece ? (
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between gap-4">
              <span>PIECE:</span>
              <span className="text-primary">{selectedPiece.type.toUpperCase()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>COLOR:</span>
              <span className="text-primary">{selectedPiece.color.toUpperCase()}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs font-mono text-muted-foreground">
            NO SELECTION
          </div>
        )}
      </div>

      {/* Bottom Left - Position Details */}
      {(selectedPosition || (isKeyboardMode && cursorPosition)) && (
        <div className="absolute bottom-4 left-4 bg-black/80 border border-primary/30 rounded p-3 text-white">
          <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wider">
            {isKeyboardMode && cursorPosition && !selectedPosition ? "CURSOR" : "POSITION"}
          </div>
          <div className="space-y-1 text-xs font-mono">
            {selectedPosition ? (
              <>
                <div className="flex justify-between gap-4">
                  <span>LEVEL:</span>
                  <span className="text-primary">{selectedPosition.level}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>RANK:</span>
                  <span className="text-primary">{selectedPosition.rank}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>FILE:</span>
                  <span className="text-primary">{selectedPosition.file}</span>
                </div>
              </>
            ) : (isKeyboardMode && cursorPosition) ? (
              <>
                <div className="flex justify-between gap-4">
                  <span>LEVEL:</span>
                  <span className="text-blue-400">{cursorPosition.level}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>RANK:</span>
                  <span className="text-blue-400">{cursorPosition.rank}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>FILE:</span>
                  <span className="text-blue-400">{cursorPosition.file}</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Bottom Right - Move Info */}
      {validMoves.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-black/80 border border-primary/30 rounded p-3 text-white">
          <div className="text-xs font-futura text-primary mb-2 uppercase tracking-wider">VALID MOVES</div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between gap-4">
              <span>COUNT:</span>
              <span className="text-primary">{validMoves.length}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>STATUS:</span>
              <span className="text-yellow-400">READY</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function RaumschachBoard({ 
  gameState, 
  selectedPosition, 
  validMoves, 
  onSquareClick, 
  onCanvasClick,
  onCanvasPointerDown,
  onCanvasPointerMove,
  onCanvasPointerUp,
  isActive,
  currentPlayer,
  gameStatus,
  moveCount,
  cursorPosition,
  isKeyboardMode,
  onMouseInteraction,
  kingInCheck
}: RaumschachBoardProps) {
  return (
    <div className="relative w-full h-full nasa-panel">
      <Canvas
        camera={{ position: [8, 8, 8], fov: 75 }}
        style={{ background: 'hsl(var(--background))' }}
        onClick={onCanvasClick}
        onPointerDown={onCanvasPointerDown}
        onPointerMove={onCanvasPointerMove}
        onPointerUp={onCanvasPointerUp}
      >
        <Scene
          gameState={gameState}
          selectedPosition={selectedPosition}
          validMoves={validMoves}
          onSquareClick={isActive ? onSquareClick : () => {}}
          isActive={isActive}
          cursorPosition={cursorPosition}
          isKeyboardMode={isKeyboardMode}
          onMouseInteraction={onMouseInteraction}
          kingInCheck={kingInCheck}
        />
      </Canvas>
      
      {/* Game HUD */}
      <GameHUD
        selectedPosition={selectedPosition}
        validMoves={validMoves}
        gameState={gameState}
        currentPlayer={currentPlayer}
        gameStatus={gameStatus}
        moveCount={moveCount}
        isActive={isActive}
        cursorPosition={cursorPosition}
        isKeyboardMode={isKeyboardMode}
        kingInCheck={kingInCheck}
      />

      {/* Game Ready Overlay */}
      {!isActive && (
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer z-10"
          onClick={onCanvasClick}
        >
          <div className="text-center">
            <h2 className="text-4xl font-futura font-bold text-primary mb-4 tracking-wider">
              GAME READY
            </h2>
            <p className="text-lg text-muted-foreground font-futura tracking-wide">
              Click anywhere to begin
            </p>
          </div>
        </div>
      )}
    </div>
  );
}