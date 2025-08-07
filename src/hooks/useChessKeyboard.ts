import { useState, useEffect, useCallback } from "react";
import { Position } from "./useRaumschach";

interface ChessKeyboardState {
  cursorPosition: Position;
  isKeyboardMode: boolean;
}

export function useChessKeyboard(
  isActive: boolean,
  onSelect: (position: Position) => void,
  onReset: () => void,
  onNewGame: () => void,
  onCameraRotateLeft?: () => void,
  onCameraRotateRight?: () => void
) {
  const [keyboardState, setKeyboardState] = useState<ChessKeyboardState>({
    cursorPosition: { level: 2, rank: 2, file: 2 }, // Start at center of board
    isKeyboardMode: false
  });

  const [lastKeyTime, setLastKeyTime] = useState<number>(0);

  const isValidPosition = (pos: Position): boolean => {
    return pos.level >= 0 && pos.level < 5 &&
           pos.rank >= 0 && pos.rank < 5 &&
           pos.file >= 0 && pos.file < 5;
  };

  const moveCursor = useCallback((direction: 'up' | 'down' | 'left' | 'right' | 'level-up' | 'level-down') => {
    setKeyboardState(prev => {
      const newPos = { ...prev.cursorPosition };
      
      switch (direction) {
        case 'up':
          newPos.rank = Math.max(0, newPos.rank - 1);
          break;
        case 'down':
          newPos.rank = Math.min(4, newPos.rank + 1);
          break;
        case 'left':
          newPos.file = Math.max(0, newPos.file - 1);
          break;
        case 'right':
          newPos.file = Math.min(4, newPos.file + 1);
          break;
        case 'level-up':
          newPos.level = Math.min(4, newPos.level + 1);
          break;
        case 'level-down':
          newPos.level = Math.max(0, newPos.level - 1);
          break;
      }

      return {
        ...prev,
        cursorPosition: newPos,
        isKeyboardMode: true
      };
    });
  }, []);

  const selectCurrentSquare = useCallback(() => {
    if (keyboardState.isKeyboardMode) {
      onSelect(keyboardState.cursorPosition);
    }
  }, [keyboardState.cursorPosition, keyboardState.isKeyboardMode, onSelect]);

  const clearSelection = useCallback(() => {
    // Move cursor to center and clear any selection
    setKeyboardState(prev => ({
      ...prev,
      cursorPosition: { level: 2, rank: 2, file: 2 }
    }));
    // This will trigger the deselection through the game logic
    onSelect({ level: -1, rank: -1, file: -1 }); // Invalid position to deselect
  }, [onSelect]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const now = Date.now();
      
      // Prevent too rapid key presses
      if (now - lastKeyTime < 100) return;
      setLastKeyTime(now);

      switch (event.code) {
        case 'ArrowUp':
          event.preventDefault();
          if (event.shiftKey) {
            moveCursor('level-up');
          } else {
            moveCursor('up');
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (event.shiftKey) {
            moveCursor('level-down');
          } else {
            moveCursor('down');
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (event.ctrlKey || event.metaKey) {
            onCameraRotateLeft?.();
          } else {
            moveCursor('left');
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (event.ctrlKey || event.metaKey) {
            onCameraRotateRight?.();
          } else {
            moveCursor('right');
          }
          break;
        case 'PageUp':
          event.preventDefault();
          moveCursor('level-up');
          break;
        case 'PageDown':
          event.preventDefault();
          moveCursor('level-down');
          break;
        case 'Space':
        case 'Enter':
          event.preventDefault();
          selectCurrentSquare();
          break;
        case 'Escape':
          event.preventDefault();
          clearSelection();
          break;
        case 'KeyR':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with browser refresh
          event.preventDefault();
          onReset();
          break;
        case 'KeyN':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with browser shortcuts
          event.preventDefault();
          onNewGame();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, lastKeyTime, moveCursor, selectCurrentSquare, clearSelection, onReset, onNewGame]);

  // Reset keyboard mode when mouse is used
  const disableKeyboardMode = useCallback(() => {
    setKeyboardState(prev => ({
      ...prev,
      isKeyboardMode: false
    }));
  }, []);

  return {
    cursorPosition: keyboardState.cursorPosition,
    isKeyboardMode: keyboardState.isKeyboardMode,
    disableKeyboardMode
  };
}