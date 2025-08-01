import { useRef, useEffect, useState, useCallback } from "react";

interface JoystickState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
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
    onControlChange({ forward: false, backward: false, left: false, right: false });
  }, [onControlChange]);

  const updateControls = useCallback((deltaX: number, deltaY: number) => {
    const threshold = 20;
    const controls = {
      forward: deltaY < -threshold,
      backward: deltaY > threshold,
      left: deltaX < -threshold,
      right: deltaX > threshold,
    };
    onControlChange(controls);
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
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <div 
        ref={joystickRef}
        className="relative w-24 h-24 bg-gray-800/60 border-2 border-gray-600/80 rounded-full backdrop-blur-sm"
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
      >
        <div 
          ref={knobRef}
          className="absolute top-1/2 left-1/2 w-8 h-8 bg-blue-500 rounded-full border-2 border-blue-300 transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
          style={{ 
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            touchAction: 'none'
          }}
        />
      </div>
      <div className="text-center mt-2 text-white/70 text-xs font-medium">
        Joystick
      </div>
    </div>
  );
}