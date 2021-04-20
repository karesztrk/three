import React from 'react';
import Mars from './Mars';

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[-1, 0.5, 0]} />
      <Mars />
    </>
  );
};

export default Scene;
