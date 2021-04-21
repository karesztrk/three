import { useFrame, useLoader } from '@react-three/fiber';
import React, { FC, useRef } from 'react';
import { Mesh, TextureLoader, Vector3 } from 'three';
const Mars: FC = () => {
  const planet = useRef<Mesh>();
  const moon = useRef<Mesh>();
  const radius = 3;
  const position = 2;
  const planetSpeed = 0.001;
  const moonSpeed = 0.25;
  const planetRotationAxis = new Vector3(0, 1, 0);
  const [colorMap, normalMap, iceworld] = useLoader(TextureLoader, [
    'mars_1k_color.jpg',
    'mars_1k_normal.jpg',
    'iceworld.jpg',
  ]);

  useFrame(({ clock }) => {
    if (planet.current) {
      planet.current.rotateOnAxis(planetRotationAxis, planetSpeed);
    }
    if (moon.current) {
      moon.current.rotation.y = clock.getElapsedTime() * 0.25;
      moon.current.position.x =
        Math.sin(clock.getElapsedTime() * moonSpeed) * radius + position;
      Math.sin(clock.getElapsedTime() * moonSpeed) * radius + position;
      moon.current.position.z =
        Math.cos(clock.getElapsedTime() * moonSpeed) * radius;
    }
  });
  return (
    <>
      <mesh ref={planet} rotation={[0, 0, 0.25]} position={[2, 0, 0]}>
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
