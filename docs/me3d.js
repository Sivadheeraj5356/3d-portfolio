import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const host = document.getElementById('me3d-view');
const canvas = document.getElementById('me3d-canvas');
const hint = document.getElementById('me3d-hint');
const card = document.getElementById('me3d-card');
const dots = document.getElementById('me3d-dots');
const stage = document.getElementById('me3d-stage');

if (host && canvas && window.ME3D_ITEMS) {
  const ITEMS = window.ME3D_ITEMS;
  const N = ITEMS.length;
  const SEG = (Math.PI * 2) / N;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);

  scene.add(new THREE.AmbientLight(0x8fa3c7, 0.6));
  const key = new THREE.DirectionalLight(0xfff1dd, 1.15);
  key.position.set(2.2, 3.4, 2.6);
  scene.add(key);
  const rimCyan = new THREE.DirectionalLight(0x35e0ff, 1.6);
  rimCyan.position.set(-3.2, 1.6, -2.4);
  scene.add(rimCyan);
  const rimMagenta = new THREE.DirectionalLight(0xff4fd8, 1.3);
  rimMagenta.position.set(3.0, 1.2, -2.8);
  scene.add(rimMagenta);

  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minPolarAngle = Math.PI * 0.38;
  controls.maxPolarAngle = Math.PI * 0.62;

  const model = new THREE.Group();
  scene.add(model);

  let phase = 0;            // master rotation, drives both model and content
  let active = -1;
  let auto = true;
  let idleTimer = null;
  let tween = null;         // {from,to,t0,dur}
  let userDragging = false;

  function itemIndex(p) {
    let a = p % (Math.PI * 2);
    if (a < 0) a += Math.PI * 2;
    return Math.min(N - 1, Math.floor(a / SEG));
  }

  function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

  function renderCard(i) {
    if (i === active) return;
    active = i;
    const it = ITEMS[i];
    const chips = (it.chips || []).map(c => '<span class="chip">' + esc(c) + '</span>').join('');
    const links = (it.links || []).map(l => '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>').join('');
    card.innerHTML =
      '<p class="me3d-kind ' + it.kind + '">' + (it.kind === 'exp' ? 'experience' : 'project') + ' · ' + (i + 1) + ' / ' + N + '</p>' +
      '<h3>' + esc(it.title) + '</h3>' +
      (it.sub ? '<p class="me3d-sub">' + esc(it.sub) + '</p>' : '') +
      (it.desc ? '<p class="me3d-desc">' + esc(it.desc) + '</p>' : '') +
      (chips ? '<div class="chips">' + chips + '</div>' : '') +
      (links ? '<div class="row">' + links + '</div>' : '');
    card.classList.remove('swap');
    void card.offsetWidth;
    card.classList.add('swap');
    [...dots.children].forEach((d, j) => d.classList.toggle('on', j === i));
  }

  ITEMS.forEach((it, j) => {
    const b = document.createElement('button');
    b.className = 'me3d-dot';
    b.setAttribute('aria-label', it.title);
    b.addEventListener('click', () => { gotoItem(j); });
    dots.appendChild(b);
  });

  function gotoItem(j) {
    const target = j * SEG + SEG / 2;
    let from = phase;
    let to = target;
    while (to - from > Math.PI) to -= Math.PI * 2;
    while (from - to > Math.PI) to += Math.PI * 2;
    tween = { from, to, t0: performance.now(), dur: 700 };
    auto = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { auto = true; }, 4000);
  }

  canvas.addEventListener('pointerdown', () => {
    userDragging = true; auto = false; tween = null;
    clearTimeout(idleTimer);
    if (hint) hint.classList.add('gone');
  });
  addEventListener('pointerup', () => {
    if (!userDragging) return;
    userDragging = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { auto = true; }, 4000);
  });

  function applyFraming() {
    const aspect = camera.aspect || 1;
    const d = Math.max(3.25, 2.45 / aspect);
    const dir = camera.position.clone().sub(controls.target);
    if (dir.lengthSq() === 0) dir.set(0, 0, 1);
    dir.normalize();
    camera.position.copy(controls.target).addScaledVector(dir, d);
    camera.updateProjectionMatrix();
  }

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    applyFraming();
  }
  new ResizeObserver(resize).observe(host);
  resize();

  let ready = false;
  const HIDE3D = new Set(['cuff_L','cuff_R','laptop_base','laptop_screen_1','laptop_screen_2','keyboard','seat','seatback','leg','leg001','leg002','leg003','Cylinder','Cube009','Cube009_2','Cube009_3']);
  new GLTFLoader().load('assets/seated_baked.glb', (gltf) => {
    const inner = gltf.scene;
    const box = new THREE.Box3();
    inner.traverse((o) => { if (o.isMesh && o.visible !== false && !HIDE3D.has(o.name)) box.expandByObject(o); });
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 1.62 / Math.max(size.x, size.y, size.z);
    inner.scale.setScalar(scale);
    inner.updateMatrixWorld(true);
    box.makeEmpty();
    inner.traverse((o) => { if (o.isMesh && o.visible !== false && !HIDE3D.has(o.name)) box.expandByObject(o); });
    box.getCenter(center);
    inner.position.sub(center);
    inner.rotation.y = -Math.PI / 2;
    inner.traverse((o) => {
    if (o.isMesh && o.material) {
      if (HIDE3D.has(o.name)) { o.visible = false; return; }
      const m = o.material;
      const c = m.color ? m.color.clone() : new THREE.Color(0xffffff);
      if (m.name === 'shirt') c.multiplyScalar(0.45);
      const b = new THREE.MeshBasicMaterial({ map: m.map || null, color: c, side: THREE.DoubleSide });
      o.material = b;
    }
  });
  model.add(inner);
    controls.target.set(0, 0.15, 0);
    camera.position.set(0.3, 0.22, 3.25);
    applyFraming();
    controls.update();
    ready = true;
    if (hint) hint.textContent = 'drag to rotate - my work turns with me';
  }, undefined, () => {
    if (hint) hint.textContent = '3D head failed to load';
  });

  let last = performance.now();
  renderer.setAnimationLoop((now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (tween) {
      const k = Math.min(1, (now - tween.t0) / tween.dur);
      const e = 1 - Math.pow(1 - k, 3);
      phase = tween.from + (tween.to - tween.from) * e;
      if (k >= 1) tween = null;
    } else if (auto && ready && !userDragging) {
      phase += dt * 0.45;
    }
    if (ready) {
      model.rotation.y = phase;
      renderCard(itemIndex(phase + SEG / 2));
    }
    controls.update();
    renderer.render(scene, camera);
  });
  renderCard(0);
}
