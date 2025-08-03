import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "./shaders/water/vertex.glsl";
import fragmentShader from "./shaders/water/fragment.glsl";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

const gui = new GUI();
const debugObject = {};

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

const canvas = document.querySelector("#canvas");

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Basic geometry (cube)
const geometry = new THREE.PlaneGeometry(2, 2, 256, 256);

//Color
debugObject.depthColor = "#186691";
debugObject.surfaceColor = "#9bd8ff";

//Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  side: THREE.DoubleSide,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.2 },
    uBigWavesSpeed: { value: 0.75 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },

    uSmallWavesElevation: { value: 0.20 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.03 },
    uSmallIterations: { value: 4.0 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: {
      value: 0.10,
    },
    uColorMultiplier: {
      value: 4,
    },
  },
});
//GUI

gui
  .add(material.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uBigWavesElevation");
gui
  .add(material.uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFreqX");
gui
  .add(material.uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFreqY");
gui
  .add(material.uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uBigWavesSpeed");

  gui
  .add(material.uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uSmallWavesElevation");
  gui
  .add(material.uniforms.uSmallWavesFrequency, "value")
  .min(0)
  .max(30)
  .step(0.001)
  .name("uSmallWavesFrequency");
  gui
  .add(material.uniforms.uSmallWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uSmallWavesSpeed");
  gui
  .add(material.uniforms.uSmallIterations, "value")
  .min(0)
  .max(5)
  .step(0.001)
  .name("uSmallIterations");
gui.addColor(debugObject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(debugObject.depthColor);
});
gui.addColor(debugObject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});

gui
  .add(material.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uColorOffset");
gui
  .add(material.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uColorMultiplier");

// Adding Cube In Scene
const cube = new THREE.Mesh(geometry, material);
cube.rotation.x = -Math.PI * 0.5;
scene.add(cube);

// Camera position
camera.position.set(2, 2, 5);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Handle resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
//Clock
const clock = new THREE.Clock();

// Animation loop
function animate() {
  const elepsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elepsedTime;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}
animate();
