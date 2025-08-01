import { useRef, useCallback, useMemo } from "react";
import * as THREE from "three";

export function useSimpleVehicle() {
  const position = useRef(new THREE.Vector3(-40, 1, 40)); // Start at bottom left
  const rotation = useRef(new THREE.Euler(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const speed = useRef(0);
  
  // Wall boundaries for collision detection
  const walls = useMemo(() => [
    // Outer walls
    { x: 0, z: -60, width: 120, height: 2 }, // Top wall
    { x: 0, z: 60, width: 120, height: 2 },  // Bottom wall
    { x: -60, z: 0, width: 2, height: 120 }, // Left wall
    { x: 60, z: 0, width: 2, height: 120 },  // Right wall
    
    // Inner maze walls - adjusted for bottom-left to top-right path
    { x: -20, z: 20, width: 2, height: 40 },   // Vertical wall 1
    { x: 20, z: -10, width: 2, height: 60 },   // Vertical wall 2  
    { x: 0, z: 40, width: 40, height: 2 },     // Horizontal wall 1
    { x: 40, z: -20, width: 40, height: 2 },   // Horizontal wall 2
  ], []);

  const checkCollision = useCallback((newPos: THREE.Vector3) => {
    const robotRadius = 4; // Robot radius for collision
    
    for (const wall of walls) {
      const wallLeft = wall.x - wall.width / 2;
      const wallRight = wall.x + wall.width / 2;
      const wallTop = wall.z - wall.height / 2;
      const wallBottom = wall.z + wall.height / 2;
      
      // Check if robot would intersect with wall
      if (newPos.x + robotRadius > wallLeft && 
          newPos.x - robotRadius < wallRight &&
          newPos.z + robotRadius > wallTop && 
          newPos.z - robotRadius < wallBottom) {
        return true; // Collision detected
      }
    }
    return false; // No collision
  }, [walls]);

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
    
    // Check collision before moving
    if (!checkCollision(newPosition)) {
      position.current.copy(newPosition);
    } else {
      // Stop the robot if it hits a wall
      speed.current = 0;
    }
    
    // Keep Roomba on flat ground
    position.current.y = 1;
  }, [checkCollision]);
  
  const getSpeed = useCallback(() => Math.abs(speed.current), []);
  
  const reset = useCallback(() => {
    position.current.set(-40, 1, 40); // Reset to start position
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
