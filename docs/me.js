import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const EXPERIENCE = [
  { t: 'Founding engineer, Applied Work', s: 'Applied Work', when: 'Sep 2026 - now' },
  { t: 'Growth', s: 'Buildalytic', when: 'Jul - Sep 2026' },
  { t: 'Open-source contributor', s: 'Hacktoberfest', when: 'Oct 2024' },
  { t: 'Re-Imagine Hackathon 2024', s: 'Redesigned the Swiggy and Air India websites. Qualified for the second round.', when: '2024' },
  { t: 'Junior developer', s: 'GDG IIIT Surat', when: '' },
  { t: 'B.Tech, Electronics and Communication', s: 'IIIT Surat', when: '2023 - 2027' }
];
const PROJECTS = [
  { n: 'Mock AI', d: 'AI interview platform that helps you prepare for your interviews.', t: ['Next.js', 'Tailwind', 'PostgreSQL', 'Drizzle', 'Gemini API', 'Clerk'], live: 'https://mock-ai-one.vercel.app', src: 'https://github.com/Sivadheeraj5356/mock-ai' },
  { n: 'CodeDevAI', d: 'AI website generator that helps you create websites in minutes.', t: ['Next.js', 'Tailwind', 'Convex', 'Gemini API'], live: 'https://codedevai.vercel.app', src: 'https://github.com/Sivadheeraj5356/CodeDevIDE' },
  { n: 'Tutor AI', d: 'An AI tutor that explains concepts and works through problems step by step.', t: ['Next.js', 'Tailwind', 'Gemini API'], live: 'https://tutor-ai-red.vercel.app', src: 'https://github.com/Sivadheeraj5356/Tutor-AI' },
  { n: 'OmniSync', d: 'Personal assistant dashboard that connects communication tools, generates AI briefings, tracks alerts and offers an assistant chat.', t: ['Next.js', 'TypeScript', 'Tailwind', 'Gemini API', 'Trigger.dev'], src: 'https://github.com/Sivadheeraj5356/omnisync' },
  { n: 'Memories', d: 'A memory sharing platform for saving notes and photos.', t: ['React', 'Node.js', 'Express'], src: 'https://github.com/Sivadheeraj5356/Memories' },
  { n: 'Pomodoro App', d: 'Productivity app built on the Pomodoro technique to help manage your time.', t: ['React Native', 'Tailwind'], src: 'https://github.com/Sivadheeraj5356/pomodoro-app' },
  { n: 'Ochi Design', d: 'Design agency platform with smooth animations and an interactive hero.', t: ['Next.js', 'Tailwind'] },
  { n: 'Todo App', d: 'Todo application with create, read, update and delete.', t: ['Next.js', 'Tailwind'] }
];

function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

const expHost = document.getElementById('exp');
EXPERIENCE.forEach((e, i) => {
  const d = document.createElement('div');
  d.className = 'item';
  d.innerHTML = (e.when ? '<div class="when">' + esc(e.when) + '</div>' : '') +
    '<h3>' + esc(e.t) + '</h3>' + (e.s ? '<div class="sub">' + esc(e.s) + '</div>' : '');
  expHost.appendChild(d);
});
const projHost = document.getElementById('proj');
PROJECTS.forEach((p, i) => {
  const d = document.createElement('div');
  d.className = 'item';
  let links = '';
  if (p.live) links += '<a href="' + p.live + '" target="_blank" rel="noopener">Live</a>';
  if (p.src) links += '<a href="' + p.src + '" target="_blank" rel="noopener">Source</a>';
  d.innerHTML = '<div class="num">' + String(i + 1).padStart(2, '0') + '</div><h3>' + esc(p.n) + '</h3><div class="sub">' + esc(p.d) + '</div>' +
    '<div class="chips">' + p.t.map(c => '<span>' + esc(c) + '</span>').join('') + '</div>' +
    (links ? '<div class="links">' + links + '</div>' : '');
  projHost.appendChild(d);
});
const items = [...document.querySelectorAll('.item')];

/* --- three.js backdrop --- */
const canvas = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
const target = new THREE.Vector3(0, -0.05, 0);
const camDir = new THREE.Vector3(0.06, 0.05, 1).normalize();

scene.add(new THREE.AmbientLight(0xf2ecd9, 0.85));
const key = new THREE.DirectionalLight(0xfff1dd, 1.5);
key.position.set(2.2, 3.4, 2.6);
scene.add(key);
const fill = new THREE.DirectionalLight(0xdfe8ff, 0.6);
fill.position.set(-2.0, 0.8, 2.4);
scene.add(fill);
const rim = new THREE.DirectionalLight(0x9db8ff, 0.7);
rim.position.set(0.5, 1.6, -2.8);
scene.add(rim);

const model = new THREE.Group();
scene.add(model);

let baseD = 3.2;
function applyFraming(d) {
  const aspect = camera.aspect || 1;
  const fit = Math.max(1, 1.9 / aspect);
  camera.position.copy(target).addScaledVector(camDir, d * fit);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
}
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  applyFraming(baseD);
}
addEventListener('resize', resize);
resize();

let ready = false;
new GLTFLoader().load('assets/head.glb', (gltf) => {
  const inner = gltf.scene;
  const box = new THREE.Box3().setFromObject(inner);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  inner.scale.setScalar(2.15 / Math.max(size.x, size.y, size.z));
  box.setFromObject(inner);
  box.getCenter(center);
  inner.position.sub(center);
  model.add(inner);
  ready = true;
});

/* scroll: rotate + dolly into the face for the resume, dark sections cover for works */
const hintEl = document.getElementById('scrollhint');
const bar = document.getElementById('bar');
function smooth(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

let last = performance.now();
let shown = -1;
renderer.setAnimationLoop((now) => {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - innerHeight);
  const p = Math.min(1, Math.max(0, scrollY / max));

  const expTop = expHost.offsetTop - innerHeight * 0.35;
  const zoomT = smooth(expTop, expTop + innerHeight * 1.2, scrollY);
  const d = baseD + (1.45 - baseD) * zoomT;

  if (ready) {
    const targetRot = p * Math.PI * 3;
    model.rotation.y += (targetRot - model.rotation.y) * Math.min(1, dt * 6);
    model.rotation.x = Math.sin(now / 2400) * 0.03;
  }
  applyFraming(d);

  /* reveal the item nearest the viewport middle */
  let best = -1, bestDist = 1e9;
  const mid = innerHeight * 0.5;
  items.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const c = r.top + r.height / 2;
    const dist = Math.abs(c - mid);
    if (c > -r.height * 0.2 && c < innerHeight + r.height * 0.2 && dist < bestDist) { bestDist = dist; best = i; }
  });
  if (best !== shown) {
    shown = best;
    items.forEach((el, i) => el.classList.toggle('on', i === best));
  }

  if (hintEl) hintEl.style.opacity = scrollY > 40 ? '0' : '1';
  if (bar) bar.classList.toggle('dark', projHost.getBoundingClientRect().top < 60);

  renderer.render(scene, camera);
});
