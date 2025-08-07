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

  // Move helper function definitions before getValidMoves
  const getValidMovesForPosition = useCallback((board: (ChessPiece | null)[][][], pos: Position): Position[] => {
    const piece = board[pos.level][pos.rank][pos.file];
    if (!piece) return [];

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
          
          const targetPiece = board[newPos.level][newPos.rank][newPos.file];
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
        [...directions.straight, ...directions.diagonal, ...directions.triagonal].forEach(([dl, dr, df]) => {
          const newPos: Position = {
            level: pos.level + dl,
            rank: pos.rank + dr,
            file: pos.file + df
          };
          if (isValidPosition(newPos)) {
            const targetPiece = board[newPos.level][newPos.rank][newPos.file];
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
        addMovesInDirections(directions.triagonal);
        break;

      case 'knight':
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
            const targetPiece = board[newPos.level][newPos.rank][newPos.file];
            if (!targetPiece || targetPiece.color !== piece.color) {
              moves.push(newPos);
            }
          }
        });
        break;

      case 'pawn':
        const direction = piece.color === 'white' ? 1 : -1;
        const forward: Position = {
          level: pos.level + direction,
          rank: pos.rank,
          file: pos.file
        };
        
        if (isValidPosition(forward) && !board[forward.level][forward.rank][forward.file]) {
          moves.push(forward);
        }
        
        const captures = [
          { level: pos.level + direction, rank: pos.rank + 1, file: pos.file },
          { level: pos.level + direction, rank: pos.rank - 1, file: pos.file },
          { level: pos.level + direction, rank: pos.rank, file: pos.file + 1 },
          { level: pos.level + direction, rank: pos.rank, file: pos.file - 1 }
        ];
        
        captures.forEach(capturePos => {
          if (isValidPosition(capturePos)) {
            const targetPiece = board[capturePos.level][capturePos.rank][capturePos.file];
            if (targetPiece && targetPiece.color !== piece.color) {
              moves.push(capturePos);
            }
          }
        });
        break;
    }

    return moves;
  }, []);

  // Game status detection functions
  const findKing = useCallback((board: (ChessPiece | null)[][][], color: 'white' | 'black'): Position | null => {
    for (let level = 0; level < 5; level++) {
      for (let rank = 0; rank < 5; rank++) {
        for (let file = 0; file < 5; file++) {
          const piece = board[level][rank][file];
          if (piece?.type === 'king' && piece.color === color) {
            return { level, rank, file };
          }
        }
      }
    }
    return null;
  }, []);

  const isPositionUnderAttack = useCallback((board: (ChessPiece | null)[][][], pos: Position, attackingColor: 'white' | 'black'): boolean => {
    // Check if any piece of attackingColor can move to this position
    for (let level = 0; level < 5; level++) {
      for (let rank = 0; rank < 5; rank++) {
        for (let file = 0; file < 5; file++) {
          const piece = board[level][rank][file];
          if (piece?.color === attackingColor) {
            const piecePos = { level, rank, file };
            const moves = getValidMovesForPosition(board, piecePos);
            if (moves.some(move => move.level === pos.level && move.rank === pos.rank && move.file === pos.file)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }, [getValidMovesForPosition]);

  const isKingInCheck = useCallback((board: (ChessPiece | null)[][][], color: 'white' | 'black'): boolean => {
    const kingPos = findKing(board, color);
    if (!kingPos) return false;

    const enemyColor = color === 'white' ? 'black' : 'white';
    return isPositionUnderAttack(board, kingPos, enemyColor);
  }, [findKing, isPositionUnderAttack]);

  const getValidMoves = useCallback((pos: Position): Position[] => {
    const piece = getPieceAt(pos);
    if (!piece || piece.color !== gameState.currentPlayer) return [];

    // Don't allow moves if game is over
    if (gameState.gameStatus === 'checkmate' || gameState.gameStatus === 'stalemate') {
      return [];
    }

    const possibleMoves = getValidMovesForPosition(gameState.board, pos);
    
    // Filter out moves that would leave the king in check
    const legalMoves: Position[] = [];
    for (const move of possibleMoves) {
      const testBoard = gameState.board.map(level => level.map(rank => rank.slice()));
      testBoard[move.level][move.rank][move.file] = piece;
      testBoard[pos.level][pos.rank][pos.file] = null;
      
      if (!isKingInCheck(testBoard, piece.color)) {
        legalMoves.push(move);
      }
    }

    return legalMoves;
  }, [gameState, getValidMovesForPosition, isKingInCheck]);

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
          const promotionLevel = movingPiece.color === 'white' ? 4 : 0;
          if (position.level === promotionLevel) {
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


  const hasValidMoves = useCallback((board: (ChessPiece | null)[][][], color: 'white' | 'black'): boolean => {
    for (let level = 0; level < 5; level++) {
      for (let rank = 0; rank < 5; rank++) {
        for (let file = 0; file < 5; file++) {
          const piece = board[level][rank][file];
          if (piece?.color === color) {
            const piecePos = { level, rank, file };
            const moves = getValidMovesForPosition(board, piecePos);
            
            // Check if any move is legal (doesn't leave king in check)
            for (const move of moves) {
              const testBoard = board.map(level => level.map(rank => rank.slice()));
              testBoard[move.level][move.rank][move.file] = piece;
              testBoard[level][rank][file] = null;
              
              if (!isKingInCheck(testBoard, color)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }, [getValidMovesForPosition, isKingInCheck]);

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
    
    // Determine new game status
    const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
    let newGameStatus: 'active' | 'check' | 'checkmate' | 'stalemate' = 'active';
    
    // Check if king was captured (immediate game over)
    if (capturedPiece?.type === 'king') {
      newGameStatus = 'checkmate';
    } else {
      // Check the game state for the next player
      const nextPlayerInCheck = isKingInCheck(newBoard, nextPlayer);
      const nextPlayerHasMoves = hasValidMoves(newBoard, nextPlayer);
      
      if (nextPlayerInCheck && !nextPlayerHasMoves) {
        newGameStatus = 'checkmate';
      } else if (!nextPlayerInCheck && !nextPlayerHasMoves) {
        newGameStatus = 'stalemate';
      } else if (nextPlayerInCheck) {
        newGameStatus = 'check';
      }
    }
    
    setMoveHistory(prev => [...prev, move]);
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: nextPlayer,
      gameStatus: newGameStatus
    }));
    setSelectedPosition(null);
    setValidMoves([]);
  }, [gameState, isKingInCheck, hasValidMoves]);

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
      
      // Determine new game status after promotion
      const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
      let newGameStatus: 'active' | 'check' | 'checkmate' | 'stalemate' = 'active';
      
      // Check if king was captured (immediate game over)
      if (capturedPiece?.type === 'king') {
        newGameStatus = 'checkmate';
      } else {
        // Check the game state for the next player
        const nextPlayerInCheck = isKingInCheck(newBoard, nextPlayer);
        const nextPlayerHasMoves = hasValidMoves(newBoard, nextPlayer);
        
        if (nextPlayerInCheck && !nextPlayerHasMoves) {
          newGameStatus = 'checkmate';
        } else if (!nextPlayerInCheck && !nextPlayerHasMoves) {
          newGameStatus = 'stalemate';
        } else if (nextPlayerInCheck) {
          newGameStatus = 'check';
        }
      }
      
      setMoveHistory(prev => [...prev, move]);
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        currentPlayer: nextPlayer,
        gameStatus: newGameStatus
      }));
    }
    
    setSelectedPosition(null);
    setValidMoves([]);
    setPendingPromotion(null);
  }, [gameState, isKingInCheck, hasValidMoves]);

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

  // Check if a king is in check (for visual highlighting)
  const getKingInCheck = useCallback((): { color: 'white' | 'black' } | null => {
    if (gameState.gameStatus === 'check' || gameState.gameStatus === 'checkmate') {
      // The current player's king is in check if it's check/checkmate
      const playerInCheck = gameState.gameStatus === 'checkmate' ? 
        (gameState.currentPlayer === 'white' ? 'black' : 'white') : // In checkmate, the previous player delivered checkmate
        gameState.currentPlayer; // In check, current player's king is in check
      return { color: playerInCheck };
    }
    return null;
  }, [gameState.gameStatus, gameState.currentPlayer]);

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
    handlePromotionChoice,
    getKingInCheck
  };
}