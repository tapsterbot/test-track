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

  const maxSpeed = 20;
  const acceleration = 0.5;
  const deceleration = 0.8;
  const turnSpeed = 0.02;
  const brakeForce = 1.5;

  const controls = {
    update: (inputs: Controls) => {
      const deltaTime = 1 / 60; // Assuming 60fps
      
      // Handle rotation
      if (inputs.left) {
        angularVelocity.current += turnSpeed;
      }
      if (inputs.right) {
        angularVelocity.current -= turnSpeed;
      }
      
      // Apply angular damping
      angularVelocity.current *= 0.95;
      rotation.current.y += angularVelocity.current;

      // Handle forward/backward movement
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyEuler(rotation.current);

      if (inputs.forward) {
        velocity.current.add(forward.multiplyScalar(acceleration * deltaTime));
      }
      if (inputs.backward) {
        velocity.current.add(forward.multiplyScalar(-acceleration * 0.5 * deltaTime));
      }

      // Apply braking
      if (inputs.brake) {
        velocity.current.multiplyScalar(1 - brakeForce * deltaTime);
      } else {
        // Natural deceleration
        velocity.current.multiplyScalar(1 - deceleration * deltaTime);
      }

      // Limit speed
      if (velocity.current.length() > maxSpeed) {
        velocity.current.normalize().multiplyScalar(maxSpeed);
      }

      // Update position
      const oldPosition = position.current.clone();
      position.current.add(velocity.current.clone().multiplyScalar(deltaTime));
      
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
    return Math.sin(distance * 0.02) * 8 + 
           Math.cos(x * 0.01) * 4 + 
           Math.sin(z * 0.015) * 3 + 1; // +1 for vehicle clearance
  }

  return {
    position: position.current,
    rotation: rotation.current,
    controls
  };
}
