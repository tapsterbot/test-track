import { useState, useEffect, useCallback, useRef } from 'react';

export interface ChessPosition {
  row: number;
  col: number;
}

interface ChessControlsState {
  cursorPosition: ChessPosition;
  isKeyboardMode: boolean;
}

export function useChessControls() {
  const [state, setState] = useState<ChessControlsState>({
    cursorPosition: { row: 7, col: 4 }, // Start at white king
    isKeyboardMode: false
  });

  const lastKeyTime = useRef<number>(0);
  const keyboardTimeout = useRef<NodeJS.Timeout>();

  const enableKeyboardMode = useCallback(() => {
    setState(prev => ({ ...prev, isKeyboardMode: true }));
    lastKeyTime.current = Date.now();
    
    // Clear existing timeout
    if (keyboardTimeout.current) {
      clearTimeout(keyboardTimeout.current);
    }
    
    // Disable keyboard mode after 3 seconds of inactivity
    keyboardTimeout.current = setTimeout(() => {
      setState(prev => ({ ...prev, isKeyboardMode: false }));
    }, 3000);
  }, []);

  const moveCursor = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    enableKeyboardMode();
    
    setState(prev => {
      const { row, col } = prev.cursorPosition;
      let newRow = row;
      let newCol = col;
      
      switch (direction) {
        case 'up':
          newRow = Math.max(0, row - 1);
          break;
        case 'down':
          newRow = Math.min(7, row + 1);
          break;
        case 'left':
          newCol = Math.max(0, col - 1);
          break;
        case 'right':
          newCol = Math.min(7, col + 1);
          break;
      }
      
      return {
        ...prev,
        cursorPosition: { row: newRow, col: newCol }
      };
    });
  }, [enableKeyboardMode]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        moveCursor('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        moveCursor('down');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        moveCursor('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveCursor('right');
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        enableKeyboardMode();
        // Return the current cursor position for selection
        return state.cursorPosition;
      case 'Escape':
        event.preventDefault();
        setState(prev => ({ ...prev, isKeyboardMode: false }));
        break;
    }
    return null;
  }, [moveCursor, enableKeyboardMode, state.cursorPosition]);

  const handleMouseMove = useCallback(() => {
    // Disable keyboard mode when mouse is used
    setState(prev => ({ ...prev, isKeyboardMode: false }));
    if (keyboardTimeout.current) {
      clearTimeout(keyboardTimeout.current);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      if (keyboardTimeout.current) {
        clearTimeout(keyboardTimeout.current);
      }
    };
  }, [handleKeyDown, handleMouseMove]);

  const setCursorPosition = useCallback((position: ChessPosition) => {
    setState(prev => ({
      ...prev,
      cursorPosition: position,
      isKeyboardMode: false
    }));
  }, []);

  return {
    cursorPosition: state.cursorPosition,
    isKeyboardMode: state.isKeyboardMode,
    setCursorPosition,
    moveCursor
  };
}