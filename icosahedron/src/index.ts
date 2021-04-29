import * as dat from 'dat.gui';
import {
  Clock,
  DoubleSide,
  Mesh,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
  IcosahedronBufferGeometry,
  MeshPhongMaterial,
  AmbientLight,
  DirectionalLight,
  MeshNormalMaterial,
  PointLight,
  PointLightHelper,
  SphereBufferGeometry,
  MeshBasicMaterial,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import testVertexShader from './shaders/vertex.glsl';
import testFragmentShader from './shaders/fragment.glsl';
import { CustomMaterial } from './CustomMaterial';

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
  elevation: 0.2,
  speed: 2,
};

const meshMaterial = new CustomMaterial({
  wireframe: false,
  displacement: debug.displacement,
  elevation: debug.elevation,
  speed: debug.speed,
});
const geometry = new IcosahedronBufferGeometry(0.75, 0);
const material = new ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: DoubleSide,
  wireframe: true,
  uniforms: {
    displacement: {
      value: debug.displacement,
    },
    elevation: {
      value: debug.elevation,
    },
    speed: {
      value: debug.speed,
    },
  },
});

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
  .max(5.0)
  .step(0.01)
  .onChange((elevation) => {
    if (meshMaterial.userData.shader) {
      meshMaterial.userData.shader.uniforms.elevation.value = elevation;
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
    uniform float speed;\n` + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    [
      'float factor = abs(sin(time)) * displacement;',
      'vec3 offset = normal * factor;',
      'float waveY = abs(sin(position.y + time * speed)) * elevation;',
      'vec3 transformed = vec3(position + waveY * offset);',
    ].join('\n'),
  );

  meshMaterial.userData.shader = shader;
};
const mesh = new Mesh(geometry, meshMaterial);
scene.add(mesh);

const ambientLight = new AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionLight = new DirectionalLight(0x1d129d, 1);
directionLight.position.set(-1, 0.5, 0);
scene.add(directionLight);

const camera = new PerspectiveCamera(75, ratio, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);
const a = new Mesh(
  new IcosahedronBufferGeometry(0.75),
  new MeshBasicMaterial({
    color: 0xfd0404,
  }),
);
a.position.set(0, 0, 0);
scene.add(a);

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
