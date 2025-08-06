export function ChessLighting() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} color="#404060" />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Secondary fill light */}
      <directionalLight
        position={[-5, 10, -5]}
        intensity={0.6}
        color="#6699ff"
      />
      
      {/* Accent lights for dramatic effect */}
      <pointLight
        position={[0, 8, 0]}
        intensity={0.8}
        color="#4080ff"
        distance={20}
        decay={2}
      />
      
      {/* Rim lighting */}
      <pointLight
        position={[-10, 5, 10]}
        intensity={0.4}
        color="#ff6b35"
        distance={15}
        decay={2}
      />
      
      <pointLight
        position={[10, 5, -10]}
        intensity={0.4}
        color="#35ff6b"
        distance={15}
        decay={2}
      />
    </>
  );
}