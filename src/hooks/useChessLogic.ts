import { useState, useCallback, useRef } from 'react';

export interface ChessPiece {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black';
  hasMoved?: boolean;
}

export interface ChessPosition {
  row: number;
  col: number;
}

export interface ChessMove {
  from: ChessPosition;
  to: ChessPosition;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  isSpecialMove?: 'castling' | 'enPassant' | 'promotion';
  promotedTo?: ChessPiece['type'];
}

export interface GameState {
  currentPlayer: 'white' | 'black';
  moveCount: number;
  gameStatus: 'active' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  capturedPieces: { white: ChessPiece[]; black: ChessPiece[] };
  lastMove: { from: string; to: string; piece: string } | null;
  selectedSquare: string | null;
  gameTime: { white: number; black: number };
}

const initialBoard: (ChessPiece | null)[][] = [
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
  Array(8).fill(null).map(() => ({ type: 'pawn', color: 'black' })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: 'pawn', color: 'white' })),
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
];

export function useChessLogic() {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(
    initialBoard.map(row => row.map(piece => piece ? { ...piece } : null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [moveHistory, setMoveHistory] = useState<ChessMove[]>([]);
  const [selectedSquare, setSelectedSquare] = useState<ChessPosition | null>(null);
  const [validMoves, setValidMoves] = useState<ChessPosition[]>([]);
  const gameTimers = useRef({ white: 600, black: 600 });
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const positionToString = (pos: ChessPosition) => {
    return String.fromCharCode(97 + pos.col) + (8 - pos.row);
  };

  const stringToPosition = (str: string): ChessPosition => {
    return {
      col: str.charCodeAt(0) - 97,
      row: 8 - parseInt(str[1])
    };
  };

  const isValidPosition = (pos: ChessPosition): boolean => {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
  };

  const getPieceAt = useCallback((pos: ChessPosition): ChessPiece | null => {
    if (!isValidPosition(pos)) return null;
    return board[pos.row][pos.col];
  }, [board]);

  const isSquareUnderAttack = useCallback((pos: ChessPosition, byColor: 'white' | 'black'): boolean => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === byColor) {
          const attackMoves = getValidMovesForPiece({ row, col }, piece, true);
          if (attackMoves.some(move => move.row === pos.row && move.col === pos.col)) {
            return true;
          }
        }
      }
    }
    return false;
  }, [board]);

  const isInCheck = useCallback((color: 'white' | 'black'): boolean => {
    // Find the king
    let kingPos: ChessPosition | null = null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.type === 'king' && piece.color === color) {
          kingPos = { row, col };
          break;
        }
      }
    }
    
    if (!kingPos) return false;
    return isSquareUnderAttack(kingPos, color === 'white' ? 'black' : 'white');
  }, [board, isSquareUnderAttack]);

  const getValidMovesForPiece = useCallback((
    pos: ChessPosition, 
    piece: ChessPiece, 
    forAttackCheck = false
  ): ChessPosition[] => {
    const moves: ChessPosition[] = [];
    const { row, col } = pos;

    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Forward move
        const oneForward = { row: row + direction, col };
        if (isValidPosition(oneForward) && !getPieceAt(oneForward)) {
          moves.push(oneForward);
          
          // Two squares forward from starting position
          if (row === startRow) {
            const twoForward = { row: row + direction * 2, col };
            if (isValidPosition(twoForward) && !getPieceAt(twoForward)) {
              moves.push(twoForward);
            }
          }
        }
        
        // Diagonal captures
        if (!forAttackCheck) {
          for (const dc of [-1, 1]) {
            const capturePos = { row: row + direction, col: col + dc };
            if (isValidPosition(capturePos)) {
              const targetPiece = getPieceAt(capturePos);
              if (targetPiece && targetPiece.color !== piece.color) {
                moves.push(capturePos);
              }
            }
          }
        } else {
          // For attack checking, pawns attack diagonally regardless of pieces
          for (const dc of [-1, 1]) {
            const capturePos = { row: row + direction, col: col + dc };
            if (isValidPosition(capturePos)) {
              moves.push(capturePos);
            }
          }
        }
        break;

      case 'rook':
        // Horizontal and vertical moves
        const rookDirections = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dr, dc] of rookDirections) {
          for (let i = 1; i < 8; i++) {
            const newPos = { row: row + dr * i, col: col + dc * i };
            if (!isValidPosition(newPos)) break;
            
            const targetPiece = getPieceAt(newPos);
            if (!targetPiece) {
              moves.push(newPos);
            } else {
              if (forAttackCheck || targetPiece.color !== piece.color) {
                moves.push(newPos);
              }
              break;
            }
          }
        }
        break;

      case 'knight':
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        for (const [dr, dc] of knightMoves) {
          const newPos = { row: row + dr, col: col + dc };
          if (isValidPosition(newPos)) {
            const targetPiece = getPieceAt(newPos);
            if (!targetPiece || forAttackCheck || targetPiece.color !== piece.color) {
              moves.push(newPos);
            }
          }
        }
        break;

      case 'bishop':
        // Diagonal moves
        const bishopDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (const [dr, dc] of bishopDirections) {
          for (let i = 1; i < 8; i++) {
            const newPos = { row: row + dr * i, col: col + dc * i };
            if (!isValidPosition(newPos)) break;
            
            const targetPiece = getPieceAt(newPos);
            if (!targetPiece) {
              moves.push(newPos);
            } else {
              if (forAttackCheck || targetPiece.color !== piece.color) {
                moves.push(newPos);
              }
              break;
            }
          }
        }
        break;

      case 'queen':
        // Combination of rook and bishop moves
        const queenDirections = [
          [0, 1], [0, -1], [1, 0], [-1, 0],
          [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        for (const [dr, dc] of queenDirections) {
          for (let i = 1; i < 8; i++) {
            const newPos = { row: row + dr * i, col: col + dc * i };
            if (!isValidPosition(newPos)) break;
            
            const targetPiece = getPieceAt(newPos);
            if (!targetPiece) {
              moves.push(newPos);
            } else {
              if (forAttackCheck || targetPiece.color !== piece.color) {
                moves.push(newPos);
              }
              break;
            }
          }
        }
        break;

      case 'king':
        const kingMoves = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1]
        ];
        for (const [dr, dc] of kingMoves) {
          const newPos = { row: row + dr, col: col + dc };
          if (isValidPosition(newPos)) {
            const targetPiece = getPieceAt(newPos);
            if (!targetPiece || forAttackCheck || targetPiece.color !== piece.color) {
              moves.push(newPos);
            }
          }
        }
        break;
    }

    return moves;
  }, [getPieceAt]);

  const isValidMove = useCallback((from: ChessPosition, to: ChessPosition): boolean => {
    const piece = getPieceAt(from);
    if (!piece || piece.color !== currentPlayer) return false;
    
    const validMoves = getValidMovesForPiece(from, piece);
    return validMoves.some(move => move.row === to.row && move.col === to.col);
  }, [getPieceAt, currentPlayer, getValidMovesForPiece]);

  const makeMove = useCallback((from: ChessPosition, to: ChessPosition): boolean => {
    if (!isValidMove(from, to)) return false;

    const piece = getPieceAt(from);
    const capturedPiece = getPieceAt(to);
    
    if (!piece) return false;

    // Create new board
    const newBoard = board.map(row => [...row]);
    newBoard[to.row][to.col] = { ...piece, hasMoved: true };
    newBoard[from.row][from.col] = null;

    // Check if this move would put own king in check
    const tempBoard = board;
    setBoard(newBoard);
    
    const wouldBeInCheck = isInCheck(piece.color);
    setBoard(tempBoard);
    
    if (wouldBeInCheck) return false;

    // Make the move
    setBoard(newBoard);
    
    // Add to move history
    const move: ChessMove = {
      from,
      to,
      piece,
      capturedPiece: capturedPiece || undefined
    };
    setMoveHistory(prev => [...prev, move]);

    // Switch players
    setCurrentPlayer(prev => prev === 'white' ? 'black' : 'white');
    setSelectedSquare(null);
    setValidMoves([]);

    return true;
  }, [board, getPieceAt, isValidMove, isInCheck]);

  const selectSquare = useCallback((pos: ChessPosition) => {
    const piece = getPieceAt(pos);
    
    if (selectedSquare) {
      // Try to make a move
      if (makeMove(selectedSquare, pos)) {
        return;
      }
    }
    
    if (piece && piece.color === currentPlayer) {
      setSelectedSquare(pos);
      setValidMoves(getValidMovesForPiece(pos, piece));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }, [selectedSquare, getPieceAt, currentPlayer, makeMove, getValidMovesForPiece]);

  const resetGame = useCallback(() => {
    setBoard(initialBoard.map(row => row.map(piece => piece ? { ...piece } : null)));
    setCurrentPlayer('white');
    setMoveHistory([]);
    setSelectedSquare(null);
    setValidMoves([]);
    gameTimers.current = { white: 600, black: 600 };
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  }, []);

  const getGameState = useCallback((): GameState => {
    const inCheck = isInCheck(currentPlayer);
    let gameStatus: GameState['gameStatus'] = 'active';
    
    if (inCheck) {
      gameStatus = 'check';
      // TODO: Check for checkmate
    }

    const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;
    
    return {
      currentPlayer,
      moveCount: moveHistory.length,
      gameStatus,
      capturedPieces: {
        white: moveHistory.filter(m => m.capturedPiece?.color === 'white').map(m => m.capturedPiece!),
        black: moveHistory.filter(m => m.capturedPiece?.color === 'black').map(m => m.capturedPiece!)
      },
      lastMove: lastMove ? {
        from: positionToString(lastMove.from),
        to: positionToString(lastMove.to),
        piece: lastMove.piece.type
      } : null,
      selectedSquare: selectedSquare ? positionToString(selectedSquare) : null,
      gameTime: gameTimers.current
    };
  }, [currentPlayer, moveHistory, selectedSquare, isInCheck]);

  return {
    board,
    selectedSquare,
    validMoves,
    currentPlayer,
    selectSquare,
    makeMove,
    resetGame,
    getGameState,
    isValidPosition,
    positionToString,
    stringToPosition
  };
}