import { useRef, useEffect, useState, useCallback } from "react";

interface JoystickState {
  angle: number;
  magnitude: number;
  forward?: number;
  turn?: number;
}

interface VirtualJoystickProps {
  onControlChange: (state: JoystickState) => void;
  isActive: boolean;
  cameraMode?: 'orbit' | 'follow';
  onToggleSimulation?: () => void;
}

export function VirtualJoystick({ onControlChange, isActive, cameraMode = 'orbit', onToggleSimulation }: VirtualJoystickProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [joystickCenter, setJoystickCenter] = useState({ x: 0, y: 0 });

  const resetJoystick = useCallback(() => {
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(-50%, -50%)';
    }
    if (cameraMode === 'follow') {
      onControlChange({ angle: 0, magnitude: 0, forward: 0, turn: 0 });
    } else {
      onControlChange({ angle: 0, magnitude: 0 });
    }
  }, [onControlChange, cameraMode]);

  const updateControls = useCallback((deltaX: number, deltaY: number) => {
    const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    // Large circle radius is 48px (w-24 = 96px, so radius = 48px)
    const maxDistance = 48;
    const normalizedMagnitude = Math.min(magnitude / maxDistance, 1);
    
    if (normalizedMagnitude < 0.1) {
      if (cameraMode === 'follow') {
        onControlChange({ angle: 0, magnitude: 0, forward: 0, turn: 0 });
      } else {
        onControlChange({ angle: 0, magnitude: 0 });
      }
    } else if (cameraMode === 'follow') {
      // First-person mode: tank-style controls
      // Up/Down controls forward/backward movement
      // Left/Right controls turning rate
      const forward = -deltaY / maxDistance; // Negative because up is negative deltaY
      const turn = deltaX / maxDistance; // Positive deltaX is right turn
      
      onControlChange({ 
        angle: 0, 
        magnitude: normalizedMagnitude,
        forward: Math.max(-1, Math.min(1, forward)),
        turn: Math.max(-1, Math.min(1, turn))
      });
    } else {
      // Orbit mode: original angle-based controls
      // Calculate angle - don't flip deltaY for correct up/down mapping
      // UP joystick = robot away from camera (-Z), DOWN = toward camera (+Z)
      const angle = Math.atan2(deltaY, -deltaX);
      onControlChange({ angle, magnitude: normalizedMagnitude });
    }
  }, [onControlChange, cameraMode]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!isActive || !joystickRef.current) return;
    
    setIsDragging(true);
    const rect = joystickRef.current.getBoundingClientRect();
    setJoystickCenter({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
  }, [isActive]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !knobRef.current || !isActive) return;

    const deltaX = clientX - joystickCenter.x;
    const deltaY = clientY - joystickCenter.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    // Large circle radius is 48px (w-24 = 96px, so radius = 48px)
    const maxDistance = 48;

    let finalX = deltaX;
    let finalY = deltaY;

    if (distance > maxDistance) {
      finalX = (deltaX / distance) * maxDistance;
      finalY = (deltaY / distance) * maxDistance;
    }

    knobRef.current.style.transform = `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px))`;
    updateControls(finalX, finalY);
  }, [isDragging, joystickCenter, isActive, updateControls]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    resetJoystick();
  }, [resetJoystick]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  // Mouse events (for testing on desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove as any);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove as any);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd, handleTouchMove]);

  return (
    <>
      {/* Joystick - Always visible, centered */}
      <div 
        className="flex justify-center pointer-events-auto cursor-pointer"
        onClick={onToggleSimulation}
      >
        <div 
          ref={joystickRef}
          className={`relative w-24 h-24 border-2 rounded-full cursor-pointer select-none touch-none transition-all duration-300 ${
            isActive 
              ? 'bg-black/60 border-primary/60 shadow-lg shadow-primary/20' 
              : 'bg-black/30 border-white/20'
          }`}
          onTouchStart={handleTouchStart}
          onMouseDown={handleMouseDown}
        >
          <div 
            ref={knobRef}
            className={`absolute w-6 h-6 border rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all ${
              isActive 
                ? 'bg-primary/80 border-primary' 
                : 'bg-white/40 border-white/60'
            }`}
            style={{ 
              left: '50%',
              top: '50%',
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              touchAction: 'none'
            }}
          />
          
        </div>
      </div>
    </>
  );
}