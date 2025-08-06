import { useState, useCallback, useRef } from 'react';

export interface ChessPiece {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black';
  hasMoved?: boolean;
}

export interface Chess3DPosition {
  level: number; // 0, 1, 2 for bottom, main, top
  row: number;
  col: number;
}

export interface ChessMove {
  from: Chess3DPosition;
  to: Chess3DPosition;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  notation: string;
}

export interface GameState {
  currentPlayer: ChessPiece['color'];
  moveCount: number;
  status: 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  capturedPieces: { white: ChessPiece[]; black: ChessPiece[] };
  lastMove?: ChessMove;
  currentLevel: number;
}

// 3D chess board: [level][row][col]
// Level 0 (bottom): 4x4, Level 1 (main): 8x8, Level 2 (top): 4x4
const initialBoard: (ChessPiece | null)[][][] = [
  // Level 0 (Bottom 4x4)
  [
    [null, null, null, null],
    [null, { type: 'rook', color: 'black' }, { type: 'bishop', color: 'black' }, null],
    [null, { type: 'bishop', color: 'white' }, { type: 'rook', color: 'white' }, null],
    [null, null, null, null]
  ],
  // Level 1 (Main 8x8) - Standard setup
  [
    [
      { type: 'rook', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'queen', color: 'black' },
      { type: 'king', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'rook', color: 'black' }
    ],
    Array(8).fill({ type: 'pawn', color: 'black' }),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill({ type: 'pawn', color: 'white' }),
    [
      { type: 'rook', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'queen', color: 'white' },
      { type: 'king', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'rook', color: 'white' }
    ]
  ],
  // Level 2 (Top 4x4)
  [
    [null, null, null, null],
    [null, { type: 'knight', color: 'black' }, { type: 'queen', color: 'black' }, null],
    [null, { type: 'queen', color: 'white' }, { type: 'knight', color: 'white' }, null],
    [null, null, null, null]
  ]
];

const LEVEL_SIZES = [4, 8, 4]; // Size of each level (bottom, main, top)

export function useChessLogic() {
  const [board, setBoard] = useState<(ChessPiece | null)[][][]>(() => 
    initialBoard.map(level => level.map(row => row.map(piece => piece ? { ...piece } : null)))
  );
  const [currentPlayer, setCurrentPlayer] = useState<ChessPiece['color']>('white');
  const [moveHistory, setMoveHistory] = useState<ChessMove[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<Chess3DPosition | null>(null);
  const [validMoves, setValidMoves] = useState<Chess3DPosition[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(1); // Focus on main level initially

  // Convert 3D position to string (e.g., "L1a1")
  const positionToString = (pos: Chess3DPosition): string => {
    const levelSize = LEVEL_SIZES[pos.level];
    const file = String.fromCharCode(97 + pos.col);
    const rank = (levelSize - pos.row).toString();
    return `L${pos.level}${file}${rank}`;
  };

  // Convert string to 3D position
  const stringToPosition = (str: string): Chess3DPosition => {
    const level = parseInt(str.charAt(1));
    const file = str.charCodeAt(2) - 97;
    const rank = LEVEL_SIZES[level] - parseInt(str.charAt(3));
    return { level, row: rank, col: file };
  };

  // Check if 3D position is valid
  const isValidPosition = (pos: Chess3DPosition): boolean => {
    const levelSize = LEVEL_SIZES[pos.level];
    return pos.level >= 0 && pos.level < 3 && 
           pos.row >= 0 && pos.row < levelSize && 
           pos.col >= 0 && pos.col < levelSize;
  };

  // Get piece at 3D position
  const getPieceAt = (pos: Chess3DPosition): ChessPiece | null => {
    if (!isValidPosition(pos)) return null;
    return board[pos.level][pos.row][pos.col];
  };

  // Check if a square is under attack by the given color
  const isSquareUnderAttack = (pos: Chess3DPosition, byColor: ChessPiece['color']): boolean => {
    for (let level = 0; level < 3; level++) {
      const levelSize = LEVEL_SIZES[level];
      for (let row = 0; row < levelSize; row++) {
        for (let col = 0; col < levelSize; col++) {
          const piece = board[level][row][col];
          if (piece && piece.color === byColor) {
            const attackingMoves = getValidMovesForPiece({ level, row, col }, piece, true);
            if (attackingMoves.some(move => 
              move.level === pos.level && move.row === pos.row && move.col === pos.col)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  // Check if current player is in check
  const isInCheck = (): boolean => {
    // Find the king
    for (let level = 0; level < 3; level++) {
      const levelSize = LEVEL_SIZES[level];
      for (let row = 0; row < levelSize; row++) {
        for (let col = 0; col < levelSize; col++) {
          const piece = board[level][row][col];
          if (piece && piece.type === 'king' && piece.color === currentPlayer) {
            return isSquareUnderAttack({ level, row, col }, currentPlayer === 'white' ? 'black' : 'white');
          }
        }
      }
    }
    return false;
  };

  // Get valid moves for a piece in 3D space
  const getValidMovesForPiece = (
    from: Chess3DPosition, 
    piece: ChessPiece, 
    ignoreCheck: boolean = false
  ): Chess3DPosition[] => {
    const moves: Chess3DPosition[] = [];
    const levelSize = LEVEL_SIZES[from.level];
    
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? levelSize - 2 : 1;
        
        // Forward move on same level
        const oneForward = { level: from.level, row: from.row + direction, col: from.col };
        if (isValidPosition(oneForward) && !getPieceAt(oneForward)) {
          moves.push(oneForward);
          
          // Two squares forward from starting position
          if (from.row === startRow) {
            const twoForward = { level: from.level, row: from.row + 2 * direction, col: from.col };
            if (isValidPosition(twoForward) && !getPieceAt(twoForward)) {
              moves.push(twoForward);
            }
          }
        }
        
        // Captures on same level
        const captureLeft = { level: from.level, row: from.row + direction, col: from.col - 1 };
        const captureRight = { level: from.level, row: from.row + direction, col: from.col + 1 };
        
        [captureLeft, captureRight].forEach(pos => {
          if (isValidPosition(pos)) {
            const targetPiece = getPieceAt(pos);
            if (targetPiece && targetPiece.color !== piece.color) {
              moves.push(pos);
            }
          }
        });
        
        // Level changes (diagonal attack to adjacent levels)
        for (const levelDelta of [-1, 1]) {
          const newLevel = from.level + levelDelta;
          if (newLevel >= 0 && newLevel < 3) {
            const levelCaptures = [
              { level: newLevel, row: from.row + direction, col: from.col - 1 },
              { level: newLevel, row: from.row + direction, col: from.col + 1 }
            ];
            
            levelCaptures.forEach(pos => {
              if (isValidPosition(pos)) {
                const targetPiece = getPieceAt(pos);
                if (targetPiece && targetPiece.color !== piece.color) {
                  moves.push(pos);
                }
              }
            });
          }
        }
        break;
        
      case 'rook':
        // Horizontal and vertical moves on same level
        const rookDirections = [
          { level: 0, row: 0, col: 1 }, { level: 0, row: 0, col: -1 },
          { level: 0, row: 1, col: 0 }, { level: 0, row: -1, col: 0 }
        ];
        
        for (const dir of rookDirections) {
          for (let i = 1; i < Math.max(...LEVEL_SIZES); i++) {
            const newPos = { 
              level: from.level, 
              row: from.row + dir.row * i, 
              col: from.col + dir.col * i 
            };
            if (!isValidPosition(newPos)) break;
            
            const pieceAtPos = getPieceAt(newPos);
            if (pieceAtPos) {
              if (pieceAtPos.color !== piece.color) {
                moves.push(newPos);
              }
              break;
            } else {
              moves.push(newPos);
            }
          }
        }
        
        // Vertical movement between levels
        for (const levelDelta of [-1, 1]) {
          for (let i = 1; i < 3; i++) {
            const newLevel = from.level + levelDelta * i;
            if (newLevel < 0 || newLevel >= 3) break;
            
            const newPos = { level: newLevel, row: from.row, col: from.col };
            if (!isValidPosition(newPos)) break;
            
            const pieceAtPos = getPieceAt(newPos);
            if (pieceAtPos) {
              if (pieceAtPos.color !== piece.color) {
                moves.push(newPos);
              }
              break;
            } else {
              moves.push(newPos);
            }
          }
        }
        break;
        
      case 'knight':
        // Standard L-moves on same level
        const knightMoves = [
          { level: 0, row: -2, col: -1 }, { level: 0, row: -2, col: 1 },
          { level: 0, row: -1, col: -2 }, { level: 0, row: -1, col: 2 },
          { level: 0, row: 1, col: -2 }, { level: 0, row: 1, col: 2 },
          { level: 0, row: 2, col: -1 }, { level: 0, row: 2, col: 1 }
        ];
        
        // Add level-change moves (knight can jump between any levels)
        for (const levelDelta of [-2, -1, 1, 2]) {
          const newLevel = from.level + levelDelta;
          if (newLevel >= 0 && newLevel < 3) {
            knightMoves.push(
              { level: levelDelta, row: -1, col: 0 }, { level: levelDelta, row: 1, col: 0 },
              { level: levelDelta, row: 0, col: -1 }, { level: levelDelta, row: 0, col: 1 }
            );
          }
        }
        
        for (const move of knightMoves) {
          const newPos = { 
            level: from.level + move.level, 
            row: from.row + move.row, 
            col: from.col + move.col 
          };
          if (isValidPosition(newPos)) {
            const pieceAtPos = getPieceAt(newPos);
            if (!pieceAtPos || pieceAtPos.color !== piece.color) {
              moves.push(newPos);
            }
          }
        }
        break;
        
      case 'bishop':
        // Diagonal moves on same level
        const bishopDirections = [
          { level: 0, row: 1, col: 1 }, { level: 0, row: 1, col: -1 },
          { level: 0, row: -1, col: 1 }, { level: 0, row: -1, col: -1 }
        ];
        
        // Add 3D diagonal moves (between levels)
        for (const levelDelta of [-1, 1]) {
          bishopDirections.push(
            { level: levelDelta, row: 1, col: 1 }, { level: levelDelta, row: 1, col: -1 },
            { level: levelDelta, row: -1, col: 1 }, { level: levelDelta, row: -1, col: -1 },
            { level: levelDelta, row: 0, col: 0 } // Pure level change
          );
        }
        
        for (const dir of bishopDirections) {
          for (let i = 1; i < Math.max(...LEVEL_SIZES); i++) {
            const newPos = { 
              level: from.level + dir.level * i, 
              row: from.row + dir.row * i, 
              col: from.col + dir.col * i 
            };
            if (!isValidPosition(newPos)) break;
            
            const pieceAtPos = getPieceAt(newPos);
            if (pieceAtPos) {
              if (pieceAtPos.color !== piece.color) {
                moves.push(newPos);
              }
              break;
            } else {
              moves.push(newPos);
            }
          }
        }
        break;
        
      case 'queen':
        // Combination of rook and bishop in 3D
        const queenDirections = [
          // Same level moves
          { level: 0, row: 0, col: 1 }, { level: 0, row: 0, col: -1 },
          { level: 0, row: 1, col: 0 }, { level: 0, row: -1, col: 0 },
          { level: 0, row: 1, col: 1 }, { level: 0, row: 1, col: -1 },
          { level: 0, row: -1, col: 1 }, { level: 0, row: -1, col: -1 }
        ];
        
        // Add 3D moves
        for (const levelDelta of [-1, 1]) {
          queenDirections.push(
            { level: levelDelta, row: 0, col: 0 }, // Pure level change
            { level: levelDelta, row: 1, col: 0 }, { level: levelDelta, row: -1, col: 0 },
            { level: levelDelta, row: 0, col: 1 }, { level: levelDelta, row: 0, col: -1 },
            { level: levelDelta, row: 1, col: 1 }, { level: levelDelta, row: 1, col: -1 },
            { level: levelDelta, row: -1, col: 1 }, { level: levelDelta, row: -1, col: -1 }
          );
        }
        
        for (const dir of queenDirections) {
          for (let i = 1; i < Math.max(...LEVEL_SIZES); i++) {
            const newPos = { 
              level: from.level + dir.level * i, 
              row: from.row + dir.row * i, 
              col: from.col + dir.col * i 
            };
            if (!isValidPosition(newPos)) break;
            
            const pieceAtPos = getPieceAt(newPos);
            if (pieceAtPos) {
              if (pieceAtPos.color !== piece.color) {
                moves.push(newPos);
              }
              break;
            } else {
              moves.push(newPos);
            }
          }
        }
        break;
        
      case 'king':
        // King moves in all directions including between levels
        const kingMoves = [
          // Same level
          { level: 0, row: -1, col: -1 }, { level: 0, row: -1, col: 0 }, { level: 0, row: -1, col: 1 },
          { level: 0, row: 0, col: -1 }, { level: 0, row: 0, col: 1 },
          { level: 0, row: 1, col: -1 }, { level: 0, row: 1, col: 0 }, { level: 0, row: 1, col: 1 }
        ];
        
        // Add level changes
        for (const levelDelta of [-1, 1]) {
          kingMoves.push(
            { level: levelDelta, row: 0, col: 0 }, // Pure level change
            { level: levelDelta, row: -1, col: -1 }, { level: levelDelta, row: -1, col: 0 }, { level: levelDelta, row: -1, col: 1 },
            { level: levelDelta, row: 0, col: -1 }, { level: levelDelta, row: 0, col: 1 },
            { level: levelDelta, row: 1, col: -1 }, { level: levelDelta, row: 1, col: 0 }, { level: levelDelta, row: 1, col: 1 }
          );
        }
        
        for (const move of kingMoves) {
          const newPos = { 
            level: from.level + move.level, 
            row: from.row + move.row, 
            col: from.col + move.col 
          };
          if (isValidPosition(newPos)) {
            const pieceAtPos = getPieceAt(newPos);
            if (!pieceAtPos || pieceAtPos.color !== piece.color) {
              moves.push(newPos);
            }
          }
        }
        break;
    }
    
    return moves;
  };

  // Check if a move is valid
  const isValidMove = (from: Chess3DPosition, to: Chess3DPosition): boolean => {
    const piece = getPieceAt(from);
    if (!piece || piece.color !== currentPlayer) return false;
    
    const validMoves = getValidMovesForPiece(from, piece);
    return validMoves.some(move => 
      move.level === to.level && move.row === to.row && move.col === to.col);
  };

  // Make a move
  const makeMove = (from: Chess3DPosition, to: Chess3DPosition): boolean => {
    if (!isValidMove(from, to)) return false;
    
    const piece = getPieceAt(from);
    const capturedPiece = getPieceAt(to);
    
    if (!piece) return false;
    
    // Create new board
    const newBoard = board.map(level => level.map(row => [...row]));
    newBoard[to.level][to.row][to.col] = piece;
    newBoard[from.level][from.row][from.col] = null;
    
    // Check if this move puts own king in check
    const tempBoard = board;
    setBoard(newBoard);
    
    // Temporarily set the new board to check for self-check
    const wouldBeInCheck = isInCheck();
    setBoard(tempBoard); // Restore original board
    
    if (wouldBeInCheck) return false;
    
    // Make the move
    setBoard(newBoard);
    
    // Record the move
    const move: ChessMove = {
      from,
      to,
      piece,
      capturedPiece: capturedPiece || undefined,
      notation: positionToString(from) + positionToString(to)
    };
    
    setMoveHistory(prev => [...prev, move]);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    setSelectedSquare(null);
    setValidMoves([]);
    
    return true;
  };

  // Select a square (for UI interaction)
  const selectSquare = (pos: Chess3DPosition) => {
    const piece = getPieceAt(pos);
    
    if (selectedSquare) {
      // Try to make a move
      if (selectedSquare.level === pos.level && selectedSquare.row === pos.row && selectedSquare.col === pos.col) {
        // Clicking same square - deselect
        setSelectedSquare(null);
        setValidMoves([]);
      } else {
        // Try to move
        const moveSuccessful = makeMove(selectedSquare, pos);
        if (!moveSuccessful) {
          // Invalid move, select new piece if it belongs to current player
          if (piece && piece.color === currentPlayer) {
            setSelectedSquare(pos);
            setValidMoves(getValidMovesForPiece(pos, piece));
          } else {
            setSelectedSquare(null);
            setValidMoves([]);
          }
        }
      }
    } else {
      // Select piece if it belongs to current player
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare(pos);
        setValidMoves(getValidMovesForPiece(pos, piece));
      }
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard(initialBoard.map(level => level.map(row => row.map(piece => piece ? { ...piece } : null))));
    setCurrentPlayer('white');
    setMoveHistory([]);
    setSelectedSquare(null);
    setValidMoves([]);
    setCurrentLevel(1);
  };

  // Get current game state
  const getGameState = (): GameState => {
    const capturedPieces = { white: [], black: [] };
    
    // Count pieces to find captured ones
    const currentPieceCounts = { white: 0, black: 0 };
    
    for (let level = 0; level < 3; level++) {
      const levelSize = LEVEL_SIZES[level];
      for (let row = 0; row < levelSize; row++) {
        for (let col = 0; col < levelSize; col++) {
          const piece = board[level][row][col];
          if (piece) {
            currentPieceCounts[piece.color]++;
          }
        }
      }
    }
    
    return {
      currentPlayer,
      moveCount: moveHistory.length,
      status: isInCheck() ? 'check' : 'playing',
      capturedPieces,
      lastMove: moveHistory[moveHistory.length - 1],
      currentLevel
    };
  };

  return {
    board,
    selectedSquare,
    validMoves,
    currentPlayer,
    currentLevel,
    setCurrentLevel,
    selectSquare,
    resetGame,
    getGameState
  };
}