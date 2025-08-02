import { useRef, useEffect, useState, useCallback } from "react";

interface JoystickState {
  angle: number;
  magnitude: number;
}

interface VirtualJoystickProps {
  onControlChange: (state: JoystickState) => void;
  isActive: boolean;
}

export function VirtualJoystick({ onControlChange, isActive }: VirtualJoystickProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [joystickCenter, setJoystickCenter] = useState({ x: 0, y: 0 });

  const resetJoystick = useCallback(() => {
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(-50%, -50%)';
    }
    onControlChange({ angle: 0, magnitude: 0 });
  }, [onControlChange]);

  const updateControls = useCallback((deltaX: number, deltaY: number) => {
    const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 40;
    const normalizedMagnitude = Math.min(magnitude / maxDistance, 1);
    
    if (normalizedMagnitude < 0.1) {
      onControlChange({ angle: 0, magnitude: 0 });
    } else {
      // Calculate angle in radians (0 = right, π/2 = down, π = left, 3π/2 = up)
      // Flip Y-axis so UP gives negative Y (forward movement expectation)
      const angle = Math.atan2(-deltaY, deltaX);
      onControlChange({ angle, magnitude: normalizedMagnitude });
    }
  }, [onControlChange]);

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
    const maxDistance = 40;

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

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden pointer-events-auto">
      <div 
        ref={joystickRef}
        className="relative w-20 h-20 bg-black/40 border-2 border-white/30 rounded-full cursor-pointer select-none touch-none"
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
      >
        <div 
          ref={knobRef}
          className="absolute w-6 h-6 bg-white/80 border border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-none"
          style={{ 
            left: '50%',
            top: '50%',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            touchAction: 'none'
          }}
        />
      </div>
    </div>
  );
}