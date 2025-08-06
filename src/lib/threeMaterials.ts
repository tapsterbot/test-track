import * as THREE from 'three';

// Global material cache to prevent recreation and flickering
class MaterialCache {
  private static instance: MaterialCache;
  private materials = new Map<string, THREE.Material>();
  private geometries = new Map<string, THREE.BufferGeometry>();

  static getInstance(): MaterialCache {
    if (!MaterialCache.instance) {
      MaterialCache.instance = new MaterialCache();
    }
    return MaterialCache.instance;
  }

  getMaterial(key: string, factory: () => THREE.Material): THREE.Material {
    if (!this.materials.has(key)) {
      this.materials.set(key, factory());
    }
    return this.materials.get(key)!;
  }

  getGeometry(key: string, factory: () => THREE.BufferGeometry): THREE.BufferGeometry {
    if (!this.geometries.has(key)) {
      this.geometries.set(key, factory());
    }
    return this.geometries.get(key)!;
  }

  dispose() {
    this.materials.forEach(material => material.dispose());
    this.geometries.forEach(geometry => geometry.dispose());
    this.materials.clear();
    this.geometries.clear();
  }
}

export const materialCache = MaterialCache.getInstance();

// Pre-defined material factories
export const createSquareMaterials = (level: string) => {
  const isMain = level === 'main';
  const opacity = isMain ? 1 : 0.8;
  const transparent = !isMain;

  return {
    lightSquare: materialCache.getMaterial(`${level}-light-square`, () => 
      new THREE.MeshStandardMaterial({ 
        color: '#f0d9b5', 
        metalness: 0.1, 
        roughness: 0.7,
        transparent,
        opacity,
        side: THREE.DoubleSide
      })
    ),
    darkSquare: materialCache.getMaterial(`${level}-dark-square`, () => 
      new THREE.MeshStandardMaterial({ 
        color: '#b58863', 
        metalness: 0.1, 
        roughness: 0.7,
        transparent,
        opacity,
        side: THREE.DoubleSide
      })
    ),
    selectedSquare: materialCache.getMaterial(`${level}-selected-square`, () => 
      new THREE.MeshStandardMaterial({ 
        color: '#7fc3ff', 
        metalness: 0.1, 
        roughness: 0.7,
        transparent,
        opacity,
        side: THREE.DoubleSide
      })
    ),
    validMove: materialCache.getMaterial(`${level}-valid-move`, () => 
      new THREE.MeshStandardMaterial({ 
        color: '#90ee90', 
        metalness: 0.1, 
        roughness: 0.7,
        transparent,
        opacity,
        side: THREE.DoubleSide
      })
    ),
    lightHovered: materialCache.getMaterial(`${level}-light-hovered`, () => 
      new THREE.MeshStandardMaterial({ 
        color: '#e6d3a8', 
        metalness: 0.1, 
        roughness: 0.7,
        transparent,
        opacity,
        side: THREE.DoubleSide
      })
    ),
    darkHovered: materialCache.getMaterial(`${level}-dark-hovered`, () => 
      new THREE.MeshStandardMaterial({ 
        color: '#a67d4a', 
        metalness: 0.1, 
        roughness: 0.7,
        transparent,
        opacity,
        side: THREE.DoubleSide
      })
    )
  };
};

export const createPieceMaterials = () => {
  return {
    white: materialCache.getMaterial('piece-white', () => 
      new THREE.MeshStandardMaterial({
        color: '#f5f5f5',
        metalness: 0.3,
        roughness: 0.4
      })
    ),
    black: materialCache.getMaterial('piece-black', () => 
      new THREE.MeshStandardMaterial({
        color: '#2c2c2c',
        metalness: 0.3,
        roughness: 0.4
      })
    ),
    whiteSelected: materialCache.getMaterial('piece-white-selected', () => 
      new THREE.MeshStandardMaterial({
        color: '#f5f5f5',
        metalness: 0.3,
        roughness: 0.4,
        emissive: '#3366ff',
        emissiveIntensity: 0.3
      })
    ),
    blackSelected: materialCache.getMaterial('piece-black-selected', () => 
      new THREE.MeshStandardMaterial({
        color: '#2c2c2c',
        metalness: 0.3,
        roughness: 0.4,
        emissive: '#3366ff',
        emissiveIntensity: 0.3
      })
    )
  };
};

// Shared geometries
export const getSharedGeometries = () => {
  return {
    square: materialCache.getGeometry('square', () => new THREE.BoxGeometry(0.9, 0.1, 0.9)),
    frame: materialCache.getGeometry('frame', () => new THREE.BoxGeometry(1, 0.2, 1)),
    // Piece geometries
    king: materialCache.getGeometry('king', () => {
      const group = new THREE.Group();
      const cylinder = new THREE.CylinderGeometry(0.3, 0.35, 0.6);
      const cross1 = new THREE.BoxGeometry(0.1, 0.3, 0.1);
      const cross2 = new THREE.BoxGeometry(0.3, 0.1, 0.1);
      return cylinder; // Simplified for now
    }),
    queen: materialCache.getGeometry('queen', () => new THREE.CylinderGeometry(0.28, 0.32, 0.6)),
    rook: materialCache.getGeometry('rook', () => new THREE.BoxGeometry(0.5, 0.5, 0.5)),
    bishop: materialCache.getGeometry('bishop', () => new THREE.CylinderGeometry(0.25, 0.3, 0.5)),
    knight: materialCache.getGeometry('knight', () => new THREE.CylinderGeometry(0.25, 0.3, 0.5)),
    pawn: materialCache.getGeometry('pawn', () => new THREE.CylinderGeometry(0.2, 0.25, 0.4))
  };
};