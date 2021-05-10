import React, { FC, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import type { Group } from 'three';
import { animate, useMotionValue } from 'framer-motion';
import { useFrame } from '@react-three/fiber';

interface ModelProps {
  onClick?: () => void;
  hideWindow?: boolean;
}

const Model: FC<ModelProps> = ({ onClick, hideWindow }) => {
  const group = useRef<Group>();
  const opacity = useMotionValue(1);
  const { nodes, materials } = useGLTF('/model/car/Scala.gltf') as any;
  useFrame(() => {
    if (opacity.isAnimating()) {
      materials.Scala_skla_.opacity = opacity.get();
    }
  });
  useEffect(() => {
    let handle;
    if (hideWindow) {
      handle = animate(opacity, 0, {
        type: 'tween',
      });
    } else {
      handle = animate(opacity, 1, {
        type: 'tween',
      });
    }
    return handle.stop;
  }, [hideWindow]);
  return (
    <group ref={group} dispose={null} position={[-135, 0, 0]} onClick={onClick}>
      <group>
        <mesh
          name="Scala_skla_"
          castShadow
          receiveShadow
          geometry={nodes.Scala_skla_.geometry}
          material={materials.Scala_skla_}
        />

        <mesh
          name="Scala_body_"
          castShadow
          receiveShadow
          geometry={nodes.Scala_body_.geometry}
          material={nodes.Scala_body_.material}
          position={[8.97, 29.92, 0]}
        />
        <group name="Scala_bodyB_" position={[8.97, 29.92, 0]}>
          <mesh
            name="Scala_bodyB__1"
            castShadow
            receiveShadow
            geometry={nodes.Scala_bodyB__1.geometry}
            material={materials.Scala_body_noR}
          />
          <mesh
            name="Scala_bodyB__2"
            castShadow
            receiveShadow
            geometry={nodes.Scala_bodyB__2.geometry}
            material={nodes.Scala_bodyB__2.material}
          />
        </group>
        <mesh
          name="Scala_skla_svetla_"
          castShadow
          receiveShadow
          geometry={nodes.Scala_skla_svetla_.geometry}
          material={materials.Scala_skla_svetla_}
        />
      </group>
    </group>
  );
};

useGLTF.preload('/model/car/Scala.gltf');

export default Model;
