import * as THREE from 'https://cdn.skypack.dev/three?min';

const canvas = document.querySelector('.object');

const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000,
);
camera.position.set(0, 0, 5);

const topPointLight = new THREE.PointLight(0xffffff, 3, 10);
topPointLight.position.set(5, 5, 1);
scene.add(topPointLight);

const bottomPointLight = new THREE.PointLight(0xffffff, 1.43, 10);
bottomPointLight.position.set(-2.9, -7.1, 3.63);
scene.add(bottomPointLight);

const textureLoader = new THREE.TextureLoader();
const normalMap = textureLoader.load('model/circuitry-normal.png_specular.png');

const geometry = new THREE.DodecahedronBufferGeometry(1.5);
const material = new THREE.MeshStandardMaterial();
// const material = new THREE.MeshPhongMaterial();
material.color = new THREE.Color(0xc4c34c);
// material.flatShading = true;
material.roughness = 0.3;
material.metalness = 0.7;
material.normalMap = normalMap;

const dodecahedron = new THREE.Mesh(geometry, material);
scene.add(dodecahedron);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

window.addEventListener('mousemove', ({ clientX, clientY }) => {
  const value =
    Math.min(
      clientX - window.innerWidth / 2,
      clientY - window.innerHeight / 2,
    ) * 0.005;
  dodecahedron.position.z = value;
});

window.addEventListener('scroll', () => {
  dodecahedron.position.y = window.scrollY * 0.005;
});

function animate() {
  renderer.render(scene, camera);
  dodecahedron.rotation.z += 0.01;
  dodecahedron.rotation.y += 0.005;
  requestAnimationFrame(animate);
}
animate();
