import React, { FC, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { DirectionalLight, Group } from 'three';
import Model from './Model';

extend({ OrbitControls });

interface SceneProps {
  helpers?: boolean;
}

const Scene: FC<SceneProps> = ({ helpers }) => {
  const light = useRef<DirectionalLight>();
  const stage = useRef<Group>();
  const {
    camera,
    gl: { domElement },
  } = useThree();
  useFrame(({ clock }) => {
    if (stage && stage.current) {
      stage.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[50, 350, 75]} intensity={1.75} />
      <directionalLight
        color="#00fdf3"
        ref={light}
        position={[250, 200, -100]}
        intensity={0.5}
      />
      <directionalLight
        color="#ff59dd"
        position={[-50, 350, -200]}
        intensity={1.25}
      />
      <orbitControls args={[camera, domElement]} />
      {helpers && light.current && (
        <directionalLightHelper args={[light.current, 10]} />
      )}
      <group ref={stage}>
        <Model />
        <mesh rotation={[Math.PI / -2, 0, 0]} position={[0, 0, 0]}>
          <circleBufferGeometry args={[400, 400]} />
          <meshStandardMaterial
            color="#467591"
            metalness={1}
            roughness={0.3}
          ></meshStandardMaterial>
        </mesh>
      </group>
    </>
  );
};

export default Scene;
