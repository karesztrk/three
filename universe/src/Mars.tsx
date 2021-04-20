import { useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { FC, useRef } from 'react';
import { Mesh, TextureLoader } from 'three';

const Mars: FC = () => {
  const sphere = useRef<Mesh>();
  const [colorMap, normalMap] = useLoader(TextureLoader, [
    'mars_1k_color.jpg',
    'mars_1k_normal.jpg',
  ]);

  useFrame(({ clock }) => {
    if (sphere.current) {
      sphere.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  return (
    <mesh ref={sphere} rotation={[0, 0, 0.5]} position={[2, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        roughness={0.75}
        map={colorMap}
        normalMap={normalMap}
      />
    </mesh>
  );
};

export default Mars;
