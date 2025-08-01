import { useRef } from "react";
import * as THREE from "three";

interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
}

export function useVehiclePhysics() {
  const position = useRef(new THREE.Vector3(0, 0, 0));
  const rotation = useRef(new THREE.Euler(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const angularVelocity = useRef(0);
  const distanceTraveled = useRef(0);

  const maxSpeed = 4;
  const acceleration = 0.08;
  const deceleration = 0.15;
  const turnSpeed = 0.004;
  const brakeForce = 0.6;

  const controls = {
    update: (inputs: Controls) => {
      const deltaTime = 1 / 60; // Assuming 60fps
      
      // Handle rotation (slower turning)
      if (inputs.left) {
        angularVelocity.current += turnSpeed * deltaTime * 60;
      }
      if (inputs.right) {
        angularVelocity.current -= turnSpeed * deltaTime * 60;
      }
      
      // Apply angular damping
      angularVelocity.current *= 0.95;
      rotation.current.y += angularVelocity.current;

      // Handle forward/backward movement
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyEuler(rotation.current);

      if (inputs.forward) {
        velocity.current.add(forward.multiplyScalar(acceleration * deltaTime * 60));
      }
      if (inputs.backward) {
        velocity.current.add(forward.multiplyScalar(-acceleration * 0.5 * deltaTime * 60));
      }

      // Apply braking
      if (inputs.brake) {
        velocity.current.multiplyScalar(1 - brakeForce * deltaTime * 60);
      } else {
        // Natural deceleration (friction)
        velocity.current.multiplyScalar(1 - deceleration * deltaTime * 60);
      }

      // Limit speed
      if (velocity.current.length() > maxSpeed) {
        velocity.current.normalize().multiplyScalar(maxSpeed);
      }

      // Update position (scaled movement)
      const oldPosition = position.current.clone();
      const scaledVelocity = velocity.current.clone().multiplyScalar(deltaTime * 60);
      position.current.add(scaledVelocity);
      
      // Simple terrain following (keep vehicle on ground)
      position.current.y = Math.max(0, getTerrainHeight(position.current.x, position.current.z));

      // Track distance traveled
      distanceTraveled.current += oldPosition.distanceTo(position.current);
    },

    getSpeed: () => velocity.current.length(),
    getDistanceTraveled: () => distanceTraveled.current,
    reset: () => {
      position.current.set(0, 0, 0);
      rotation.current.set(0, 0, 0);
      velocity.current.set(0, 0, 0);
      angularVelocity.current = 0;
      distanceTraveled.current = 0;
    }
  };

  // Simple terrain height calculation (matches the terrain generation)
  function getTerrainHeight(x: number, z: number): number {
    const distance = Math.sqrt(x * x + z * z);
    return Math.sin(distance * 0.005) * 12 + 
           Math.cos(x * 0.003) * 6 + 
           Math.sin(z * 0.004) * 4 + 1; // +1 for vehicle clearance
  }

  return {
    position: position.current,
    rotation: rotation.current,
    controls
  };
}
