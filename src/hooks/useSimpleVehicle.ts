import { useRef, useCallback } from "react";
import * as THREE from "three";

export function useSimpleVehicle() {
  const position = useRef(new THREE.Vector3(0, 0.5, 0));
  const rotation = useRef(new THREE.Euler(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const speed = useRef(0);
  
  const update = useCallback((controls: any) => {
    const deltaTime = 1/60;
    
    // Simple forward/backward movement
    if (controls.forward) {
      speed.current = Math.min(speed.current + 0.1, 5);
    } else if (controls.backward) {
      speed.current = Math.max(speed.current - 0.1, -2);
    } else {
      speed.current *= 0.95; // Friction
    }
    
    // Simple turning
    if (controls.left && Math.abs(speed.current) > 0.1) {
      rotation.current.y += 0.02;
    }
    if (controls.right && Math.abs(speed.current) > 0.1) {
      rotation.current.y -= 0.02;
    }
    
    // Move based on rotation and speed
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyEuler(rotation.current);
    direction.multiplyScalar(speed.current * deltaTime);
    
    position.current.add(direction);
    position.current.y = 0.5; // Keep on ground - adjusted for even bigger vehicle
  }, []);
  
  const getSpeed = useCallback(() => Math.abs(speed.current), []);
  
  const reset = useCallback(() => {
    position.current.set(0, 0.5, 0);
    rotation.current.set(0, 0, 0);
    velocity.current.set(0, 0, 0);
    speed.current = 0;
  }, []);
  
  return {
    position: position.current,
    rotation: rotation.current,
    update,
    getSpeed,
    reset
  };
}