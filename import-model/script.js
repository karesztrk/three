import * as THREE from 'https://cdn.skypack.dev/three?min';
import GLTFLoader from 'https://cdn.skypack.dev/three-gltf-loader?min';
import * as dat from 'https://cdn.skypack.dev/dat.gui?min';

// const gui = new dat.GUI();

const canvas = document.querySelector('.capsule');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 0, 3);

const light = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(-9.2, -2.8, 27.391);
scene.add(pointLight);

// gui.add(pointLight.position, 'x').min(-100).max(100).step(0.1);
// gui.add(pointLight.position, 'y').min(-100).max(100).step(0.1);
// gui.add(pointLight.position, 'z').min(-100).max(100).step(0.11);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

let obj;
const loader = new GLTFLoader().setPath('model/');
loader.load('scene.gltf', (gltf) => {
  obj = gltf.scene.children[0];

  obj.castShadow = true;
  obj.receiveShadow = true;
  scene.add(obj);
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate() {
  renderer.render(scene, camera);
  if (obj) {
    obj.rotation.z += 0.005;
  }

  requestAnimationFrame(animate);
}
animate();
