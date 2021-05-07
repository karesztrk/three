import * as dat from 'dat.gui';
import {
  AmbientLight,
  Clock,
  DirectionalLight,
  IcosahedronBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const ratio = sizes.width / sizes.height;

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = ratio;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const scene = new Scene();
const gui = new dat.GUI({ closed: false });

const debug = {
  displacement: 0.05,
  elevation: 15,
  elevationFilter: 0.01,
  speed: 2,
};

const meshMaterial = new MeshPhongMaterial({
  wireframe: false,
});
const geometry = new IcosahedronBufferGeometry(0.04, 0);

gui
  .add(debug, 'displacement')
  .name('vertex disp.')
  .min(0.05)
  .max(1.0)
  .step(0.01)
  .onChange((displacement) => {
    if (meshMaterial.userData.shader) {
      meshMaterial.userData.shader.uniforms.displacement.value = displacement;
    }
  });
gui
  .add(debug, 'elevation')
  .name('wave elevation')
  .min(0.0)
  .max(20.0)
  .step(0.01)
  .onChange((elevation) => {
    if (meshMaterial.userData.shader) {
      meshMaterial.userData.shader.uniforms.elevation.value = elevation;
    }
  });
gui
  .add(debug, 'elevationFilter')
  .name('wave filter')
  .min(0.0)
  .max(5.0)
  .step(0.01)
  .onChange((elevationFilter) => {
    if (meshMaterial.userData.shader) {
      meshMaterial.userData.shader.uniforms.elevationFilter.value = elevationFilter;
    }
  });
gui
  .add(debug, 'speed')
  .name('wave speed')
  .min(0.0)
  .max(5)
  .step(0.01)
  .onChange((speed) => {
    if (meshMaterial.userData.shader) {
      meshMaterial.userData.shader.uniforms.speed.value = speed;
    }
  });

meshMaterial.onBeforeCompile = function (shader) {
  shader.uniforms.time = {
    value: 0.0,
  };
  shader.uniforms.displacement = {
    value: debug.displacement,
  };
  shader.uniforms.elevationFilter = {
    value: debug.elevationFilter,
  };
  shader.uniforms.elevation = {
    value: debug.elevation,
  };
  shader.uniforms.speed = {
    value: debug.speed,
  };

  shader.vertexShader =
    `uniform float time;
    uniform float displacement;
    uniform float elevation;
    uniform float elevationFilter;
    uniform float speed;\n` + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    [
      'float factor = abs(sin(time)) * displacement;',
      'vec3 offset = normal * factor;',
      'float waveY = abs(sin(position.y * elevation + time * speed)) * elevationFilter;',
      'vec3 transformed = vec3(position + waveY * offset);',
    ].join('\n'),
  );

  meshMaterial.userData.shader = shader;
};
const mesh = new Mesh(geometry, meshMaterial);
scene.add(mesh);
mesh.scale.set(20, 20, 20);
const ambientLight = new AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionLight = new DirectionalLight(0x1d129d, 1);
directionLight.position.set(-1, 0.5, 0);
scene.add(directionLight);

const camera = new PerspectiveCamera(75, ratio, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);

const canvas = document.querySelector('#webgl') as HTMLCanvasElement;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const clock = new Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  // material.uniforms.time.value = elapsedTime;
  if (meshMaterial.userData.shader) {
    meshMaterial.userData.shader.uniforms.time.value = elapsedTime;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
