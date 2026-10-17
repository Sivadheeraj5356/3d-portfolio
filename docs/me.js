import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const EXPERIENCE = [
  { t: 'Founding engineer, Applied Work', s: 'September 2026 to now' },
  { t: 'Growth, Buildalytic', s: 'July to September 2026' },
  { t: 'Hacktoberfest open-source contributor', s: 'October 2024' },
  { t: 'Re-Imagine Hackathon 2024', s: 'Redesigned the Swiggy and Air India websites. Qualified for the second round.' },
  { t: 'Junior developer, GDG IIIT Surat', s: '' },
  { t: 'B.Tech, Electronics and Communication, IIIT Surat', s: '2023 to 2027' }
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

/* Build content blocks */
const expHost = document.getElementById('exp');
EXPERIENCE.forEach((e, i) => {
  const d = document.createElement('div');
  d.className = 'item';
  d.innerHTML = '<div class="num">' + String(i + 1).padStart(2, '0') + '</div><h3>' + esc(e.t) + '</h3>' + (e.s ? '<div class="sub">' + esc(e.s) + '</div>' : '');
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
const target = new THREE.Vector3(0, -0.08, 0);

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
const fill = new THREE.DirectionalLight(0xfff4e6, 0.55);
fill.position.set(0.4, 0.3, 3.0);
scene.add(fill);
const hemi = new THREE.HemisphereLight(0x3a4460, 0x1a1410, 0.5);
scene.add(hemi);

const model = new THREE.Group();
scene.add(model);

function applyFraming() {
  const aspect = camera.aspect || 1;
  const d = Math.max(3.25, 2.45 / aspect);
  camera.position.copy(target).add(new THREE.Vector3(0.09, 0.07, 1).normalize().multiplyScalar(d));
  camera.lookAt(target);
  camera.updateProjectionMatrix();
}
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  applyFraming();
}
addEventListener('resize', resize);
resize();

let ready = false;
new GLTFLoader().load('assets/head.glb', (gltf) => {
  const inner = gltf.scene;
  const box = new THREE.Box3().setFromObject(inner);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  inner.scale.setScalar(1.62 / Math.max(size.x, size.y, size.z));
  box.setFromObject(inner);
  box.getCenter(center);
  inner.position.sub(center);
  model.add(inner);
  ready = true;
});

/* scroll drives rotation; items light up in turn */
let last = performance.now();
let shown = -1;
renderer.setAnimationLoop((now) => {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - innerHeight);
  const p = Math.min(1, Math.max(0, scrollY / max));
  if (ready) {
    const targetRot = p * Math.PI * 4;
    model.rotation.y += (targetRot - model.rotation.y) * Math.min(1, dt * 6);
    model.rotation.x = Math.sin(now / 2400) * 0.03;
  }
  const idx = Math.min(items.length - 1, Math.floor(p * items.length));
  if (idx !== shown) {
    shown = idx;
    items.forEach((el, i) => el.classList.toggle('on', i === idx));
  }
  renderer.render(scene, camera);
});
