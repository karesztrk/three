import { Canvas } from '@react-three/fiber';
import React, { FC, Suspense } from 'react';
import { OrthographicCamera } from 'three';
import './App.css';
import Scene from './Scene';

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <div className="App">
      <h1>Mars</h1>
      <h2>The red planet and its imaginary moon</h2>
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 10, position: [2, 0, 5] }}
        style={{
          position: 'absolute',
        }}
      >
        <Suspense fallback="Loading..">
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
