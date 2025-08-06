import { useState, useCallback } from 'react';

export interface ChessSquare {
  level: 'main' | 'upper-left' | 'upper-right' | 'lower-left' | 'lower-right';
  file: number; // 0-7 for main board, 0-1 for attack boards
  rank: number; // 0-7 for main board, 0-3 for attack boards
}

export interface ChessGameState {
  boards: {
    'main': (string | null)[][];
    'upper-left': (string | null)[][];
    'upper-right': (string | null)[][];
    'lower-left': (string | null)[][];
    'lower-right': (string | null)[][];
  };
  currentPlayer: 'white' | 'black';
}

interface Move {
  from: string;
  to: string;
  piece: string;
  player: 'white' | 'black';
  moveNumber: number;
}

const initialChessState: ChessGameState = {
  boards: {
    'main': [
      ['R', 'P', null, null, null, null, 'p', 'r'],
      ['N', 'P', null, null, null, null, 'p', 'n'],
      ['B', 'P', null, null, null, null, 'p', 'b'],
      ['Q', 'P', null, null, null, null, 'p', 'q'],
      ['K', 'P', null, null, null, null, 'p', 'k'],
      ['B', 'P', null, null, null, null, 'p', 'b'],
      ['N', 'P', null, null, null, null, 'p', 'n'],
      ['R', 'P', null, null, null, null, 'p', 'r']
    ],
    'upper-left': [
      [null, null, null, null],
      [null, null, null, null]
    ],
    'upper-right': [
      [null, null, null, null],
      [null, null, null, null]
    ],
    'lower-left': [
      [null, null, null, null],
      [null, null, null, null]
    ],
    'lower-right': [
      [null, null, null, null],
      [null, null, null, null]
    ]
  },
  currentPlayer: 'white'
};

export function useChessGame() {
  const [gameState, setGameState] = useState<ChessGameState>(initialChessState);
  const [selectedSquare, setSelectedSquare] = useState<ChessSquare | null>(null);
  const [validMoves, setValidMoves] = useState<ChessSquare[]>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [isInCheck, setIsInCheck] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'white' | 'black' | 'draw' | null>(null);

  const squareToString = (square: ChessSquare): string => {
    return `${square.level}-${square.file}-${square.rank}`;
  };

  const getPieceAt = (square: ChessSquare): string | null => {
    const board = gameState.boards[square.level];
    if (!board || !board[square.file] || square.rank >= board[square.file].length) {
      return null;
    }
    return board[square.file][square.rank];
  };

  const isValidSquare = (square: ChessSquare): boolean => {
    const board = gameState.boards[square.level];
    if (!board) return false;
    
    if (square.level === 'main') {
      return square.file >= 0 && square.file < 8 && square.rank >= 0 && square.rank < 8;
    } else {
      return square.file >= 0 && square.file < 2 && square.rank >= 0 && square.rank < 4;
    }
  };

  const getValidMoves = (square: ChessSquare): ChessSquare[] => {
    const piece = getPieceAt(square);
    if (!piece) return [];

    const isWhite = piece === piece.toUpperCase();
    const currentPlayerPiece = (gameState.currentPlayer === 'white') === isWhite;
    if (!currentPlayerPiece) return [];

    const moves: ChessSquare[] = [];
    const pieceType = piece.toLowerCase();

    // Basic movement patterns for demonstration
    // In a full implementation, this would include all chess rules
    switch (pieceType) {
      case 'p': // Pawn
        const direction = isWhite ? 1 : -1;
        const forwardSquare: ChessSquare = {
          ...square,
          rank: square.rank + direction
        };
        if (isValidSquare(forwardSquare) && !getPieceAt(forwardSquare)) {
          moves.push(forwardSquare);
        }
        break;

      case 'r': // Rook
        // Horizontal and vertical moves
        for (let i = 1; i < 8; i++) {
          const directions = [
            { file: square.file + i, rank: square.rank },
            { file: square.file - i, rank: square.rank },
            { file: square.file, rank: square.rank + i },
            { file: square.file, rank: square.rank - i }
          ];
          
          directions.forEach(dir => {
            const newSquare: ChessSquare = { ...square, file: dir.file, rank: dir.rank };
            if (isValidSquare(newSquare)) {
              const targetPiece = getPieceAt(newSquare);
              if (!targetPiece) {
                moves.push(newSquare);
              } else if ((targetPiece === targetPiece.toUpperCase()) !== isWhite) {
                moves.push(newSquare);
              }
            }
          });
        }
        break;

      case 'k': // King
        // One square in any direction
        for (let fileOffset = -1; fileOffset <= 1; fileOffset++) {
          for (let rankOffset = -1; rankOffset <= 1; rankOffset++) {
            if (fileOffset === 0 && rankOffset === 0) continue;
            
            const newSquare: ChessSquare = {
              ...square,
              file: square.file + fileOffset,
              rank: square.rank + rankOffset
            };
            
            if (isValidSquare(newSquare)) {
              const targetPiece = getPieceAt(newSquare);
              if (!targetPiece || (targetPiece === targetPiece.toUpperCase()) !== isWhite) {
                moves.push(newSquare);
              }
            }
          }
        }
        break;

      default:
        // Basic movement for other pieces
        const adjacentSquares = [
          { file: square.file + 1, rank: square.rank },
          { file: square.file - 1, rank: square.rank },
          { file: square.file, rank: square.rank + 1 },
          { file: square.file, rank: square.rank - 1 }
        ];
        
        adjacentSquares.forEach(adj => {
          const newSquare: ChessSquare = { ...square, file: adj.file, rank: adj.rank };
          if (isValidSquare(newSquare)) {
            const targetPiece = getPieceAt(newSquare);
            if (!targetPiece || (targetPiece === targetPiece.toUpperCase()) !== isWhite) {
              moves.push(newSquare);
            }
          }
        });
        break;
    }

    return moves;
  };

  const makeMove = useCallback((from: ChessSquare, to: ChessSquare): boolean => {
    const piece = getPieceAt(from);
    if (!piece) return false;

    const newGameState = { ...gameState };
    const fromBoard = newGameState.boards[from.level];
    const toBoard = newGameState.boards[to.level];

    if (!fromBoard || !toBoard) return false;

    // Make the move
    fromBoard[from.file][from.rank] = null;
    toBoard[to.file][to.rank] = piece;

    // Add to move history
    const move: Move = {
      from: squareToString(from),
      to: squareToString(to),
      piece,
      player: gameState.currentPlayer,
      moveNumber: moveHistory.length + 1
    };

    setGameState({
      ...newGameState,
      currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white'
    });
    setMoveHistory(prev => [...prev, move]);
    setSelectedSquare(null);
    setValidMoves([]);

    return true;
  }, [gameState, moveHistory]);

  const selectSquare = useCallback((square: ChessSquare) => {
    const piece = getPieceAt(square);
    
    if (selectedSquare) {
      // Check if this is a valid move
      const isValidMove = validMoves.some(move => 
        move.level === square.level && 
        move.file === square.file && 
        move.rank === square.rank
      );
      
      if (isValidMove) {
        makeMove(selectedSquare, square);
        return;
      }
    }
    
    if (piece) {
      const isWhite = piece === piece.toUpperCase();
      const isCurrentPlayerPiece = (gameState.currentPlayer === 'white') === isWhite;
      
      if (isCurrentPlayerPiece) {
        setSelectedSquare(square);
        setValidMoves(getValidMoves(square));
        return;
      }
    }
    
    setSelectedSquare(null);
    setValidMoves([]);
  }, [selectedSquare, validMoves, gameState.currentPlayer, makeMove]);

  const resetGame = useCallback(() => {
    setGameState(initialChessState);
    setSelectedSquare(null);
    setValidMoves([]);
    setMoveHistory([]);
    setIsInCheck(false);
    setIsGameOver(false);
    setWinner(null);
  }, []);

  return {
    gameState,
    selectedSquare,
    validMoves,
    moveHistory,
    isInCheck,
    isGameOver,
    winner,
    makeMove,
    selectSquare,
    resetGame
  };
}