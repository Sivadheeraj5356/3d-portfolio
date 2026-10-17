import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const host = document.getElementById('avatar-view');
const canvas = document.getElementById('avatar-canvas');
const hint = document.getElementById('avatar-hint');

if (host && canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

  scene.add(new THREE.AmbientLight(0x8fa3c7, 0.55));
  const key = new THREE.DirectionalLight(0xfff1dd, 1.1);
  key.position.set(2.2, 3.4, 2.6);
  scene.add(key);
  const rimCyan = new THREE.DirectionalLight(0x35e0ff, 1.5);
  rimCyan.position.set(-3.2, 1.6, -2.4);
  scene.add(rimCyan);
  const rimMagenta = new THREE.DirectionalLight(0xff4fd8, 1.2);
  rimMagenta.position.set(3.0, 1.2, -2.8);
  scene.add(rimMagenta);

  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1.6;
  controls.maxDistance = 6;
  controls.maxPolarAngle = Math.PI * 0.62;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.1;
  canvas.addEventListener('pointerdown', () => { controls.autoRotate = false; if (hint) hint.classList.add('gone'); }, { once: true });

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  resize();

  new GLTFLoader().load('assets/avatar.glb', (gltf) => {
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 2.1 / Math.max(size.x, size.y, size.z);
    model.scale.setScalar(scale);
    box.setFromObject(model);
    box.getCenter(center);
    model.position.sub(center);
    scene.add(model);
    const fit = new THREE.Box3().setFromObject(model);
    const c = fit.getCenter(new THREE.Vector3());
    controls.target.set(c.x, c.y + 0.15, c.z);
    camera.position.set(c.x + 1.15, c.y + 0.55, c.z + 3.1);
    controls.update();
    if (hint) hint.textContent = 'drag to rotate - scroll to zoom';
  }, undefined, () => {
    if (hint) hint.textContent = 'avatar failed to load';
  });

  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
}
