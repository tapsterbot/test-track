import { useRef, useCallback } from "react";
import * as THREE from "three";

export function useSimpleVehicle() {
  const position = useRef(new THREE.Vector3(0, 2, 0));
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
    
    // Simple terrain following for big vehicle
    const terrainHeight = getTerrainHeight(position.current.x, position.current.z);
    position.current.y = terrainHeight + 2; // Keep vehicle above terrain
  }, []);
  
  const getSpeed = useCallback(() => Math.abs(speed.current), []);
  
  const reset = useCallback(() => {
    position.current.set(0, 2, 0);
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

// Simple terrain height calculation matching the ground generation
function getTerrainHeight(x: number, z: number): number {
  const noise1 = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 3;
  const noise2 = Math.sin(x * 0.1) * Math.cos(z * 0.08) * 2;
  const noise3 = Math.sin(x * 0.2) * Math.cos(z * 0.15) * 1;
  const noise4 = Math.sin(x * 0.4) * Math.cos(z * 0.3) * 0.5;
  
  return noise1 + noise2 + noise3 + noise4;
}