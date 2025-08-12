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

export type PromotablePiece = 'queen' | 'rook' | 'bishop' | 'knight' | 'unicorn';

export interface GameSettings {
  defaultPromotionPiece: PromotablePiece;
  autoPromote: boolean;
}

export interface PendingPromotion {
  position: Position;
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
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    defaultPromotionPiece: 'queen',
    autoPromote: true
  });
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);

  function initializeBoard(): GameState {
    // Create empty 5x5x5 board
    const board: (ChessPiece | null)[][][] = Array(5).fill(null).map(() =>
      Array(5).fill(null).map(() =>
        Array(5).fill(null)
      )
    );

    // Official Raumschach starting position according to Ferdinand Maack's rules
    // Each side has: 2 rooks, 2 knights, 2 bishops, 1 queen, 1 king, 2 unicorns, 10 pawns
    // Source: https://www.chessvariants.com/3d.dir/3d5.html

    // Level 0 (Level A) - WHITE pieces (bottom level)
    board[0][0][0] = { type: 'rook', color: 'white' };     // Aa1
    board[0][0][1] = { type: 'knight', color: 'white' };   // Ab1
    board[0][0][2] = { type: 'king', color: 'white' };     // Ac1
    board[0][0][3] = { type: 'knight', color: 'white' };   // Ad1
    board[0][0][4] = { type: 'rook', color: 'white' };     // Ae1
    
    // White pawns on level A (rank 2)
    for (let i = 0; i < 5; i++) {
      board[0][1][i] = { type: 'pawn', color: 'white' };   // Aa2-Ae2
    }
    
    // Level 1 (Level B) - WHITE pieces
    board[1][0][0] = { type: 'bishop', color: 'white' };   // Ba1
    board[1][0][1] = { type: 'unicorn', color: 'white' };  // Bb1
    board[1][0][2] = { type: 'queen', color: 'white' };    // Bc1
    board[1][0][3] = { type: 'bishop', color: 'white' };   // Bd1
    board[1][0][4] = { type: 'unicorn', color: 'white' };  // Be1
    
    // White pawns on level B (rank 2)
    for (let i = 0; i < 5; i++) {
      board[1][1][i] = { type: 'pawn', color: 'white' };   // Ba2-Be2
    }

    // Level 2 (Level C) - Empty at startup (middle level)

    // Level 3 (Level D) - BLACK pieces  
    board[3][4][0] = { type: 'bishop', color: 'black' };   // Da5
    board[3][4][1] = { type: 'unicorn', color: 'black' };  // Db5
    board[3][4][2] = { type: 'queen', color: 'black' };    // Dc5
    board[3][4][3] = { type: 'bishop', color: 'black' };   // Dd5
    board[3][4][4] = { type: 'unicorn', color: 'black' };  // De5
    
    // Black pawns on level D (rank 4)
    for (let i = 0; i < 5; i++) {
      board[3][3][i] = { type: 'pawn', color: 'black' };   // Da4-De4
    }
    
    // Level 4 (Level E) - BLACK pieces (top level)
    board[4][4][0] = { type: 'rook', color: 'black' };     // Ea5
    board[4][4][1] = { type: 'knight', color: 'black' };   // Eb5
    board[4][4][2] = { type: 'king', color: 'black' };     // Ec5
    board[4][4][3] = { type: 'knight', color: 'black' };   // Ed5
    board[4][4][4] = { type: 'rook', color: 'black' };     // Ee5
    
    // Black pawns on level E (rank 4)
    for (let i = 0; i < 5; i++) {
      board[4][3][i] = { type: 'pawn', color: 'black' };   // Ea4-Ee4
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
        // Pawn movement - forward along rank dimension, capture diagonally
        const direction = piece.color === 'white' ? 1 : -1;
        const startingRank = piece.color === 'white' ? 1 : 3;
        
        // Single forward move
        const forward: Position = {
          level: pos.level,
          rank: pos.rank + direction,
          file: pos.file
        };
        
        if (isValidPosition(forward) && !getPieceAt(forward)) {
          moves.push(forward);
        }
        
        // Diagonal captures (forward + one square in file or level dimension)
        const captures = [
          { level: pos.level, rank: pos.rank + direction, file: pos.file + 1 },
          { level: pos.level, rank: pos.rank + direction, file: pos.file - 1 },
          { level: pos.level + 1, rank: pos.rank + direction, file: pos.file },
          { level: pos.level - 1, rank: pos.rank + direction, file: pos.file }
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
        const movingPiece = gameState.board[selectedPosition.level][selectedPosition.rank][selectedPosition.file];
        
        // Check for pawn promotion
        if (movingPiece?.type === 'pawn') {
          const promotionRank = movingPiece.color === 'white' ? 4 : 0;
          if (position.rank === promotionRank) {
            if (gameSettings.autoPromote) {
              // Auto-promote to default piece
              promotePawn(selectedPosition, position, gameSettings.defaultPromotionPiece);
            } else {
              // Set up pending promotion - don't make the move yet, wait for promotion choice
              setPendingPromotion({
                position: position,
                color: movingPiece.color
              });
              // Store the selected and target positions for when promotion is completed
              setSelectedPosition(selectedPosition);
              setValidMoves([position]); // Keep the target position as valid
            }
            return;
          }
        }
        
        // Regular move
        makeMove(selectedPosition, position);
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
  }, [selectedPosition, validMoves, gameState, getValidMoves, gameSettings]);

  const makeMove = useCallback((from: Position, to: Position) => {
    const newBoard = gameState.board.map(level => 
      level.map(rank => rank.slice())
    );
    
    const movingPiece = newBoard[from.level][from.rank][from.file];
    const capturedPiece = newBoard[to.level][to.rank][to.file];
    
    newBoard[to.level][to.rank][to.file] = movingPiece;
    newBoard[from.level][from.rank][from.file] = null;
    
    const move: Move = {
      from,
      to,
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
  }, [gameState]);

  const promotePawn = useCallback((from: Position, to: Position, promoteTo: PromotablePiece) => {
    const newBoard = gameState.board.map(level => 
      level.map(rank => rank.slice())
    );
    
    const movingPiece = newBoard[from.level][from.rank][from.file];
    const capturedPiece = newBoard[to.level][to.rank][to.file];
    
    if (movingPiece?.type === 'pawn') {
      newBoard[to.level][to.rank][to.file] = {
        type: promoteTo,
        color: movingPiece.color
      };
      newBoard[from.level][from.rank][from.file] = null;
      
      const move: Move = {
        from,
        to,
        piece: { ...movingPiece, type: promoteTo },
        captured: capturedPiece || undefined
      };
      
      setMoveHistory(prev => [...prev, move]);
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white'
      }));
    }
    
    setSelectedPosition(null);
    setValidMoves([]);
    setPendingPromotion(null);
  }, [gameState]);

  const handlePromotionChoice = useCallback((promoteTo: PromotablePiece) => {
    if (pendingPromotion && selectedPosition) {
      // Find the target position from valid moves (should be the promotion square)
      const targetPosition = validMoves[0]; // We stored this as the only valid move
      if (targetPosition) {
        promotePawn(selectedPosition, targetPosition, promoteTo);
      }
    }
  }, [pendingPromotion, selectedPosition, validMoves, promotePawn]);

  const updateGameSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setGameSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initializeBoard());
    setSelectedPosition(null);
    setValidMoves([]);
    setMoveHistory([]);
    setPendingPromotion(null);
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
    getMoveHistory,
    gameSettings,
    updateGameSettings,
    pendingPromotion,
    handlePromotionChoice
  };
}