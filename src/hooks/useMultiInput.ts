import { useEffect, useState, useCallback } from "react";

interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
}

export function useMultiInput() {
  const [inputs, setInputs] = useState<InputState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false
  });

  // Keyboard handling
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        setInputs(prev => ({ ...prev, forward: true }));
        break;
      case 'KeyS':
      case 'ArrowDown':
        setInputs(prev => ({ ...prev, backward: true }));
        break;
      case 'KeyA':
      case 'ArrowLeft':
        setInputs(prev => ({ ...prev, left: true }));
        break;
      case 'KeyD':
      case 'ArrowRight':
        setInputs(prev => ({ ...prev, right: true }));
        break;
      case 'Space':
        event.preventDefault();
        setInputs(prev => ({ ...prev, brake: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        setInputs(prev => ({ ...prev, forward: false }));
        break;
      case 'KeyS':
      case 'ArrowDown':
        setInputs(prev => ({ ...prev, backward: false }));
        break;
      case 'KeyA':
      case 'ArrowLeft':
        setInputs(prev => ({ ...prev, left: false }));
        break;
      case 'KeyD':
      case 'ArrowRight':
        setInputs(prev => ({ ...prev, right: false }));
        break;
      case 'Space':
        setInputs(prev => ({ ...prev, brake: false }));
        break;
    }
  }, []);

  // Touch handling (basic implementation)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchCurrent({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    setTouchCurrent({ x: touch.clientX, y: touch.clientY });

    if (touchStart) {
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const threshold = 30;

      setInputs(prev => ({
        ...prev,
        forward: deltaY < -threshold,
        backward: deltaY > threshold,
        left: deltaX < -threshold,
        right: deltaX > threshold
      }));
    }
  }, [touchStart]);

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
    setTouchCurrent(null);
    setInputs(prev => ({
      ...prev,
      forward: false,
      backward: false,
      left: false,
      right: false
    }));
  }, []);

  // Mouse handling (for camera control, not vehicle movement)
  const handleMouseDown = useCallback((event: MouseEvent) => {
    // Mouse controls are handled by OrbitControls in the 3D scene
    // This is just a placeholder for future mouse-based vehicle controls
  }, []);

  useEffect(() => {
    // Keyboard listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Touch listeners
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    // Mouse listeners
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleKeyDown, handleKeyUp, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown]);

  return inputs;
}