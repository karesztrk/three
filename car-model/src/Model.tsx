import { useLoader } from '@react-three/fiber';
import React, { FC } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Model: FC = () => {
  const result = useLoader(GLTFLoader, '/model/car/Scala.gltf');
  delete result.nodes.Default_light;

  return <primitive object={result.scene} position={[-135, 0, 0]} />;
};

export default Model;
