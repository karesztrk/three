import { useFrame, useLoader } from '@react-three/fiber';
import React, { FC, useRef } from 'react';
import { Mesh, TextureLoader } from 'three';
const Mars: FC = () => {
  const planet = useRef<Mesh>();
  const moon = useRef<Mesh>();
  const radius = 3;
  const position = 2;
  const speed = 0.25;
  const [colorMap, normalMap, iceworld] = useLoader(TextureLoader, [
    'mars_1k_color.jpg',
    'mars_1k_normal.jpg',
    'iceworld.jpg',
  ]);

  useFrame(({ clock }) => {
    if (planet.current) {
      planet.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    if (moon.current) {
      moon.current.rotation.y = clock.getElapsedTime() * 0.25;
      moon.current.position.x =
        Math.sin(clock.getElapsedTime() * speed) * radius + position;
      moon.current.position.z =
        Math.cos(clock.getElapsedTime() * speed) * radius;
    }
  });
  return (
    <>
      <mesh ref={planet} rotation={[0, 0, 0.5]} position={[2, 0, 0]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          roughness={0.75}
          map={colorMap}
          normalMap={normalMap}
        />
      </mesh>
      <mesh ref={moon} position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 64, 64]} />
        <meshStandardMaterial roughness={0.65} map={iceworld} />
      </mesh>
    </>
  );
};

export default Mars;
