import { useRef, useCallback } from "react";
import * as THREE from "three";

export function useSimpleVehicle() {
  const position = useRef(new THREE.Vector3(-40, 1, -40)); // Start at top left
  const rotation = useRef(new THREE.Euler(0, Math.PI, 0)); // 180 degrees rotation
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const speed = useRef(0);
  
  // Wall collision detection
  const checkWallCollision = useCallback((newPos: THREE.Vector3) => {
    const robotRadius = 4; // Roomba radius
    
    // Maze walls (same as in SimpleSimulator.tsx)
    const walls = [
      // Outer walls
      { x: 0, z: -60, width: 120, height: 2 },
      { x: 0, z: 60, width: 120, height: 2 },
      { x: -60, z: 0, width: 2, height: 120 },
      { x: 60, z: 0, width: 2, height: 120 },
      
      // Inner maze walls
      { x: -20, z: -20, width: 2, height: 40 },
      { x: 20, z: 10, width: 2, height: 60 },
      { x: 0, z: -40, width: 40, height: 2 },
      { x: -40, z: 20, width: 40, height: 2 },
    ];
    
    for (const wall of walls) {
      // Check collision with each wall
      const distX = Math.abs(newPos.x - wall.x);
      const distZ = Math.abs(newPos.z - wall.z);
      
      if (distX < (wall.width / 2 + robotRadius) && distZ < (wall.height / 2 + robotRadius)) {
        return true; // Collision detected
      }
    }
    
    return false;
  }, []);

  const update = useCallback((controls: any) => {
    const deltaTime = 1/60;
    
    // Simple forward/backward movement
    if (controls.forward) {
      speed.current = Math.min(speed.current + 0.2, 12);
    } else if (controls.backward) {
      speed.current = Math.max(speed.current - 0.2, -6);
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
    
    // Calculate new position
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyEuler(rotation.current);
    direction.multiplyScalar(speed.current * deltaTime);
    
    const newPosition = position.current.clone().add(direction);
    
    // Check for wall collision before moving
    if (!checkWallCollision(newPosition)) {
      position.current.copy(newPosition);
    } else {
      // Stop the robot if it hits a wall
      speed.current = 0;
    }
    
    // Keep Roomba on flat ground
    position.current.y = 1;
  }, [checkWallCollision]);
  
  const getSpeed = useCallback(() => Math.abs(speed.current), []);
  
  const reset = useCallback(() => {
    position.current.set(-40, 1, -40); // Reset to start position
    rotation.current.set(0, Math.PI, 0); // Reset with 180 degrees rotation
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
