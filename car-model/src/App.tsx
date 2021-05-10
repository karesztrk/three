import { Canvas } from '@react-three/fiber';
import React, { FC, Suspense } from 'react';
import './App.css';
import Scene from './Scene';

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ŠKODA Scala</h1>
        <h2>The journey start now</h2>
      </header>
      <Canvas
        camera={{
          fov: 60,
          near: 0.1,
          far: 2000,
          position: [-150, 175, 500],
        }}
        style={{ position: 'absolute' }}
        shadows
      >
        <Suspense fallback="Loading...">
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
