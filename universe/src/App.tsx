import { Canvas } from '@react-three/fiber';
import React, { FC, Suspense } from 'react';
import './App.css';
import Scene from './Scene';

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <div className="App">
      <h1>Mars</h1>
      <h2>The red planet</h2>
      <Canvas
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
