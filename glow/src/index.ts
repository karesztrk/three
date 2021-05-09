import * as dat from 'dat.gui';
import {
  AdditiveBlending,
  AmbientLight,
  BackSide,
  Clock,
  DirectionalLight,
  IcosahedronBufferGeometry,
  Mesh,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereBufferGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

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

const meshMaterial = new ShaderMaterial({
  uniforms: {},
  wireframe: false,
  vertexShader,
  fragmentShader,
  side: BackSide,
  blending: AdditiveBlending,
  transparent: true,
});
const geometry = new SphereBufferGeometry(1, 32, 32);

const mesh = new Mesh(geometry, meshMaterial);
scene.add(mesh);

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
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
