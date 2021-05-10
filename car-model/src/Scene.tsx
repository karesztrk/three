import React, { FC, useEffect, useRef, useState } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { extend, useFrame, useThree } from '@react-three/fiber';
import type { DirectionalLight, Group } from 'three';
import Scala from './Scala';
import { animate, useMotionValue } from 'framer-motion';

extend({ OrbitControls });

interface SceneProps {
  helpers?: boolean;
}

const destination = {
  x: 0,
  y: 300,
  z: 150,
};
const origin = {
  x: -150,
  y: 175,
  z: 500,
};

const Scene: FC<SceneProps> = ({ helpers }) => {
  const light = useRef<DirectionalLight>();
  const stage = useRef<Group>();
  const [show, setShow] = useState(false);
  const cameraX = useMotionValue(-150);
  const cameraY = useMotionValue(175);
  const cameraZ = useMotionValue(500);

  const {
    camera,
    gl: { domElement },
  } = useThree();
  useFrame(({ clock, camera }) => {
    if (stage && stage.current) {
      stage.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
    if (
      camera &&
      (cameraX.isAnimating() || cameraY.isAnimating() || cameraZ.isAnimating())
    ) {
      camera.position.set(cameraX.get(), cameraY.get(), cameraZ.get());
      camera.lookAt(0, 0, 0);
    }
  });

  const onModelClick = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (show) {
      const x = animate(cameraX, destination.x, {
        type: 'tween',
      });
      const y = animate(cameraY, destination.y, {
        type: 'tween',
      });
      const z = animate(cameraZ, destination.z, {
        type: 'tween',
      });
      return () => {
        x.stop();
        y.stop();
        z.stop();
      };
    } else {
      const x = animate(cameraX, origin.x, {
        type: 'tween',
      });
      const y = animate(cameraY, origin.y, {
        type: 'tween',
      });
      const z = animate(cameraZ, origin.z, {
        type: 'tween',
      });
      return () => {
        x.stop();
        y.stop();
        z.stop();
      };
    }
  }, [show]);

  return (
    <>
      <directionalLight
        ref={light}
        castShadow
        position={[0, 300, 0]}
        intensity={3}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-far={300}
        shadow-camera-left={-250}
        shadow-camera-right={250}
        shadow-camera-top={250}
        shadow-camera-bottom={-250}
      />
      <ambientLight intensity={0.3} />
      <directionalLight
        castShadow
        color="#fffdf3"
        position={[250, 200, -150]}
        intensity={0.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={650}
        shadow-camera-left={-250}
        shadow-camera-right={250}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
      />
      <directionalLight
        color="#ff59dd"
        position={[-50, 350, -200]}
        intensity={1.25}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <orbitControls args={[camera, domElement]} />
      {helpers && light.current && (
        <>
          <directionalLightHelper args={[light.current, 10]} />
          <cameraHelper args={[light.current.shadow.camera]} />
        </>
      )}
      <group ref={stage}>
        <Scala onClick={onModelClick} hideWindow={show} />
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[400, 400, 5, 64]} />
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
