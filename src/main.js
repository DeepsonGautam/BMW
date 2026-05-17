import './style.css'
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
let car;

const scene = new Three.Scene();

const light1 = new Three.PointLight(0xffffff, 2);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new Three.AmbientLight(0xffffff, 1);
scene.add(light2);

const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 30);

const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 30;

const geometry = new Three.IcosahedronGeometry(10, 1);


const material = new Three.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 1.2,
  metalness: 1,
  roughness: 0.25,
  wireframe: true
});

const torus = new Three.Mesh(geometry, material);

scene.add(torus);

const pointLight = new Three.PointLight(0xffffff, 1)
pointLight.position.set(5,15,10)

const dirLight = new Three.DirectionalLight(0xffffff, 1)
dirLight.position.set(-5, 10, -5)

scene.add(dirLight)

const ambientLight = new Three.AmbientLight(0xffffff, 0.2);
scene.add(pointLight, ambientLight)


function addStar() {

  const geometry = new Three.SphereGeometry(0.25, 24, 24);
  const material = new Three.MeshStandardMaterial( { color: 0xffffff})
  const star = new Three.Mesh( geometry, material)

  const [x, y, z] = Array(3).fill().map(() => Three.MathUtils.randFloatSpread( 130 ));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(500).fill().forEach(addStar)

const spaceTexture = new Three.TextureLoader().load('bg4.png');
scene.background = spaceTexture;


const jeffTexture = new Three.TextureLoader().load('/jeff.jpg');

const jeff = new Three.Mesh(
  new Three.BoxGeometry(3, 3, 3),
  new Three.MeshBasicMaterial( {map: jeffTexture})

);

scene.add(jeff);

const loader = new GLTFLoader();

loader.load('/car.glb', function (gltf) {

  car = gltf.scene;

  car.scale.set(1, 1, 1);
  car.position.set(0, 0, 0);

  car.position.z = 30;
  car.position.setX(0);

  scene.add(car);
});


const logoTexture = new Three.TextureLoader().load('logo.jpg');
const normalTexture = new Three.TextureLoader().load('tire-texture.jpg');

const logo = new Three.Mesh(
  new Three.SphereGeometry(3, 32, 32),
  new Three.MeshStandardMaterial( {
    map: logoTexture,
    normalMap: normalTexture
  })
);

logo.material.roughness = 0.1;

logo.position.z = 30
logo.rotation.y = 5.5
logo.rotation.x = -0.2
logo.position.setX(-20)
scene.add(logo)



function moveCamera() {

  const t = document.body.getBoundingClientRect().top;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.0101;
  camera.rotation.x = t* -0.0001;
  camera.position.y = t * -0.0017;
  camera.lookAt(0, 0, 3)
}

document.body.onscroll = moveCamera
moveCamera();



function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.02;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  renderer.render(scene, camera);
}

animate();