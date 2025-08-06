import { useState, useCallback } from "react";

export interface Position {
  level: number;
  rank: number;
  file: number;
}

export interface ChessPiece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'unicorn' | 'pawn';
  color: 'white' | 'black';
}

export interface GameState {
  board: (ChessPiece | null)[][][]; // 5x5x5 board
  currentPlayer: 'white' | 'black';
  gameStatus: 'active' | 'check' | 'checkmate' | 'stalemate';
}

interface Move {
  from: Position;
  to: Position;
  piece: ChessPiece;
  captured?: ChessPiece;
}

export function useRaumschach() {
  const [gameState, setGameState] = useState<GameState>(initializeBoard());
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);

  function initializeBoard(): GameState {
    // Create empty 5x5x5 board
    const board: (ChessPiece | null)[][][] = Array(5).fill(null).map(() =>
      Array(5).fill(null).map(() =>
        Array(5).fill(null)
      )
    );

    // Place white pieces (levels 3-4) - now on top
    // Level 4 (top)
    board[4][0][0] = { type: 'rook', color: 'white' };
    board[4][0][4] = { type: 'rook', color: 'white' };
    board[4][4][0] = { type: 'rook', color: 'white' };
    board[4][4][4] = { type: 'rook', color: 'white' };
    
    // Level 3 - White pieces
    board[3][1][1] = { type: 'knight', color: 'white' };
    board[3][1][3] = { type: 'bishop', color: 'white' };
    board[3][2][2] = { type: 'queen', color: 'white' };
    board[3][3][1] = { type: 'bishop', color: 'white' };
    board[3][3][3] = { type: 'knight', color: 'white' };
    board[3][2][1] = { type: 'unicorn', color: 'white' };
    board[3][2][3] = { type: 'king', color: 'white' };
    
    // White pawns on level 2 (middle level)
    for (let i = 0; i < 5; i++) {
      board[2][3][i] = { type: 'pawn', color: 'white' };
    }

    // Place black pieces (levels 0-1) - now on bottom
    // Level 0 (bottom)
    board[0][0][0] = { type: 'rook', color: 'black' };
    board[0][0][4] = { type: 'rook', color: 'black' };
    board[0][4][0] = { type: 'rook', color: 'black' };
    board[0][4][4] = { type: 'rook', color: 'black' };
    
    // Level 1 - Black pieces
    board[1][1][1] = { type: 'knight', color: 'black' };
    board[1][1][3] = { type: 'bishop', color: 'black' };
    board[1][2][2] = { type: 'queen', color: 'black' };
    board[1][3][1] = { type: 'bishop', color: 'black' };
    board[1][3][3] = { type: 'knight', color: 'black' };
    board[1][2][1] = { type: 'unicorn', color: 'black' };
    board[1][2][3] = { type: 'king', color: 'black' };
    
    // Black pawns on level 2 (middle level)
    for (let i = 0; i < 5; i++) {
      board[2][1][i] = { type: 'pawn', color: 'black' };
    }

    return {
      board,
      currentPlayer: 'white',
      gameStatus: 'active'
    };
  }

  const isValidPosition = (pos: Position): boolean => {
    return pos.level >= 0 && pos.level < 5 &&
           pos.rank >= 0 && pos.rank < 5 &&
           pos.file >= 0 && pos.file < 5;
  };

  const getPieceAt = (pos: Position): ChessPiece | null => {
    if (!isValidPosition(pos)) return null;
    return gameState.board[pos.level][pos.rank][pos.file];
  };

  const getValidMoves = useCallback((pos: Position): Position[] => {
    const piece = getPieceAt(pos);
    if (!piece || piece.color !== gameState.currentPlayer) return [];

    const moves: Position[] = [];
    
    // Direction vectors for 3D movement
    const directions = {
      straight: [
        [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]
      ],
      diagonal: [
        [1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0],
        [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1],
        [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1]
      ],
      triagonal: [
        [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
        [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
      ]
    };

    const addMovesInDirections = (dirs: number[][], maxDistance: number = 5) => {
      dirs.forEach(([dl, dr, df]) => {
        for (let dist = 1; dist <= maxDistance; dist++) {
          const newPos: Position = {
            level: pos.level + dl * dist,
            rank: pos.rank + dr * dist,
            file: pos.file + df * dist
          };
          
          if (!isValidPosition(newPos)) break;
          
          const targetPiece = getPieceAt(newPos);
          if (targetPiece) {
            if (targetPiece.color !== piece.color) {
              moves.push(newPos);
            }
            break;
          } else {
            moves.push(newPos);
          }
        }
      });
    };

    switch (piece.type) {
      case 'king':
        // King moves one square in any direction (26 possible directions)
        [...directions.straight, ...directions.diagonal, ...directions.triagonal].forEach(([dl, dr, df]) => {
          const newPos: Position = {
            level: pos.level + dl,
            rank: pos.rank + dr,
            file: pos.file + df
          };
          if (isValidPosition(newPos)) {
            const targetPiece = getPieceAt(newPos);
            if (!targetPiece || targetPiece.color !== piece.color) {
              moves.push(newPos);
            }
          }
        });
        break;

      case 'queen':
        addMovesInDirections([...directions.straight, ...directions.diagonal]);
        break;

      case 'rook':
        addMovesInDirections(directions.straight);
        break;

      case 'bishop':
        addMovesInDirections(directions.diagonal);
        break;

      case 'unicorn':
        // Unicorn moves triagonally (equal steps in all three dimensions)
        addMovesInDirections(directions.triagonal);
        break;

      case 'knight':
        // Knight makes L-shaped moves in 3D
        const knightMoves = [
          [2, 1, 0], [2, -1, 0], [-2, 1, 0], [-2, -1, 0],
          [1, 2, 0], [1, -2, 0], [-1, 2, 0], [-1, -2, 0],
          [2, 0, 1], [2, 0, -1], [-2, 0, 1], [-2, 0, -1],
          [1, 0, 2], [1, 0, -2], [-1, 0, 2], [-1, 0, -2],
          [0, 2, 1], [0, 2, -1], [0, -2, 1], [0, -2, -1],
          [0, 1, 2], [0, 1, -2], [0, -1, 2], [0, -1, -2]
        ];
        
        knightMoves.forEach(([dl, dr, df]) => {
          const newPos: Position = {
            level: pos.level + dl,
            rank: pos.rank + dr,
            file: pos.file + df
          };
          if (isValidPosition(newPos)) {
            const targetPiece = getPieceAt(newPos);
            if (!targetPiece || targetPiece.color !== piece.color) {
              moves.push(newPos);
            }
          }
        });
        break;

      case 'pawn':
        // Simplified pawn movement - forward one square, capture diagonally
        const direction = piece.color === 'white' ? 1 : -1;
        const forward: Position = {
          level: pos.level + direction,
          rank: pos.rank,
          file: pos.file
        };
        
        if (isValidPosition(forward) && !getPieceAt(forward)) {
          moves.push(forward);
        }
        
        // Diagonal captures
        const captures = [
          { level: pos.level + direction, rank: pos.rank + 1, file: pos.file },
          { level: pos.level + direction, rank: pos.rank - 1, file: pos.file },
          { level: pos.level + direction, rank: pos.rank, file: pos.file + 1 },
          { level: pos.level + direction, rank: pos.rank, file: pos.file - 1 }
        ];
        
        captures.forEach(capturePos => {
          if (isValidPosition(capturePos)) {
            const targetPiece = getPieceAt(capturePos);
            if (targetPiece && targetPiece.color !== piece.color) {
              moves.push(capturePos);
            }
          }
        });
        break;
    }

    return moves;
  }, [gameState]);

  const selectSquare = useCallback((position: Position) => {
    // Handle invalid position (used for deselection via keyboard)
    if (position.level < 0 || position.rank < 0 || position.file < 0) {
      setSelectedPosition(null);
      setValidMoves([]);
      return;
    }

    const piece = getPieceAt(position);
    
    if (selectedPosition) {
      // Check if clicking on a valid move
      const isValidMove = validMoves.some(move => 
        move.level === position.level && 
        move.rank === position.rank && 
        move.file === position.file
      );
      
      if (isValidMove) {
        // Make the move
        const newBoard = gameState.board.map(level => 
          level.map(rank => rank.slice())
        );
        
        const movingPiece = newBoard[selectedPosition.level][selectedPosition.rank][selectedPosition.file];
        const capturedPiece = newBoard[position.level][position.rank][position.file];
        
        newBoard[position.level][position.rank][position.file] = movingPiece;
        newBoard[selectedPosition.level][selectedPosition.rank][selectedPosition.file] = null;
        
        const move: Move = {
          from: selectedPosition,
          to: position,
          piece: movingPiece!,
          captured: capturedPiece || undefined
        };
        
        setMoveHistory(prev => [...prev, move]);
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white'
        }));
        setSelectedPosition(null);
        setValidMoves([]);
      } else if (piece && piece.color === gameState.currentPlayer) {
        // Select new piece
        setSelectedPosition(position);
        setValidMoves(getValidMoves(position));
      } else {
        // Deselect
        setSelectedPosition(null);
        setValidMoves([]);
      }
    } else if (piece && piece.color === gameState.currentPlayer) {
      // Select piece
      setSelectedPosition(position);
      setValidMoves(getValidMoves(position));
    }
  }, [selectedPosition, validMoves, gameState, getValidMoves]);

  const resetGame = useCallback(() => {
    setGameState(initializeBoard());
    setSelectedPosition(null);
    setValidMoves([]);
    setMoveHistory([]);
  }, []);

  const getCurrentPlayer = () => gameState.currentPlayer;
  const getGameStatus = () => gameState.gameStatus;
  const getMoveHistory = () => moveHistory;

  return {
    gameState,
    selectedPosition,
    validMoves,
    selectSquare,
    resetGame,
    getCurrentPlayer,
    getGameStatus,
    getMoveHistory
  };
}