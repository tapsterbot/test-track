import { useState, useEffect, useRef } from 'react';

interface Chess3DPosition {
  level: number;
  row: number;
  col: number;
}

interface ChessControlsState {
  cursorPosition: Chess3DPosition;
  isKeyboardMode: boolean;
}

const LEVEL_SIZES = [4, 8, 4]; // Size of each level (bottom, main, top)

export function useChessControls() {
  const [cursorPosition, setCursorPosition] = useState<Chess3DPosition>({ level: 1, row: 7, col: 4 });
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const keyboardTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const enableKeyboardMode = () => {
    setIsKeyboardMode(true);
    
    // Clear existing timeout
    if (keyboardTimeoutRef.current) {
      clearTimeout(keyboardTimeoutRef.current);
    }
    
    // Auto-disable after 3 seconds of inactivity
    keyboardTimeoutRef.current = setTimeout(() => {
      setIsKeyboardMode(false);
    }, 3000);
  };

  const moveCursor = (direction: 'up' | 'down' | 'left' | 'right' | 'levelUp' | 'levelDown') => {
    enableKeyboardMode();
    
    setCursorPosition(prev => {
      let newLevel = prev.level;
      let newRow = prev.row;
      let newCol = prev.col;
      
      switch (direction) {
        case 'up':
          newRow = Math.max(0, prev.row - 1);
          break;
        case 'down':
          newRow = Math.min(LEVEL_SIZES[prev.level] - 1, prev.row + 1);
          break;
        case 'left':
          newCol = Math.max(0, prev.col - 1);
          break;
        case 'right':
          newCol = Math.min(LEVEL_SIZES[prev.level] - 1, prev.col + 1);
          break;
        case 'levelUp':
          newLevel = Math.min(2, prev.level + 1);
          // Adjust position if new level is smaller
          if (LEVEL_SIZES[newLevel] < LEVEL_SIZES[prev.level]) {
            newRow = Math.min(newRow, LEVEL_SIZES[newLevel] - 1);
            newCol = Math.min(newCol, LEVEL_SIZES[newLevel] - 1);
          }
          break;
        case 'levelDown':
          newLevel = Math.max(0, prev.level - 1);
          // Adjust position if new level is smaller
          if (LEVEL_SIZES[newLevel] < LEVEL_SIZES[prev.level]) {
            newRow = Math.min(newRow, LEVEL_SIZES[newLevel] - 1);
            newCol = Math.min(newCol, LEVEL_SIZES[newLevel] - 1);
          }
          break;
      }
      
      return { level: newLevel, row: newRow, col: newCol };
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
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
      case 'PageUp':
      case 'q':
      case 'Q':
        event.preventDefault();
        moveCursor('levelUp');
        break;
      case 'PageDown':
      case 'e':
      case 'E':
        event.preventDefault();
        moveCursor('levelDown');
        break;
      case 'Tab':
        event.preventDefault();
        enableKeyboardMode();
        break;
      case 'Escape':
        setIsKeyboardMode(false);
        break;
      default:
        // Any other key press enables keyboard mode
        if (event.key.length === 1 || ['Enter', 'Space'].includes(event.key)) {
          enableKeyboardMode();
        }
    }
  };

  const handleMouseMove = () => {
    setIsKeyboardMode(false);
    if (keyboardTimeoutRef.current) {
      clearTimeout(keyboardTimeoutRef.current);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      if (keyboardTimeoutRef.current) {
        clearTimeout(keyboardTimeoutRef.current);
      }
    };
  }, []);

  const handleSetCursorPosition = (position: Chess3DPosition) => {
    setCursorPosition(position);
    setIsKeyboardMode(false); // Disable keyboard mode when manually setting position
  };

  return {
    cursorPosition,
    isKeyboardMode,
    setCursorPosition: handleSetCursorPosition,
    moveCursor
  };
}