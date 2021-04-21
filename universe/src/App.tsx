import { Canvas } from '@react-three/fiber';
import React, { FC, Suspense } from 'react';
import { OrthographicCamera } from 'three';
import './App.css';
import Scene from './Scene';

interface AppProps {}

const App: FC<AppProps> = () => {
  const camera = new OrthographicCamera(-6, 6, 3, -3, -5, 5);
  return (
    <div className="App">
      <h1>Mars</h1>
      <h2>The red planet and its imaginary moon</h2>
      <Canvas
        orthographic
        camera={camera}
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
