import { useEffect, useState } from "react";

interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export function useSimpleControls(isActive: boolean = true) {
  const [controls, setControls] = useState<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'KeyW':
        case 'ArrowUp':
          if (isActive) e.preventDefault();
          setControls(prev => ({ ...prev, forward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          if (isActive) e.preventDefault();
          setControls(prev => ({ ...prev, backward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          if (isActive) e.preventDefault();
          setControls(prev => ({ ...prev, left: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          if (isActive) e.preventDefault();
          setControls(prev => ({ ...prev, right: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'KeyW':
        case 'ArrowUp':
          if (isActive) e.preventDefault();
          setControls(prev => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          if (isActive) e.preventDefault();
          setControls(prev => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          if (isActive) e.preventDefault();
          setControls(prev => ({ ...prev, left: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          if (isActive) e.preventDefault();
          setControls(prev => ({ ...prev, right: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isActive]);

  return controls;
}