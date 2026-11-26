// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)
// Interactive Three.js 3D WebGL Human Synaptic Bouton viewer with reduced-motion support.

import * as THREE from 'three';

export interface Synapse3DHandle {
  triggerFusionBurst(): void;
  setLayerVisibility(layer: 'llps' | 'microtubule' | 'nanocolumn', visible: boolean): void;
  resize(): void;
  dispose(): void;
}

export function mountSynapse3D(container: HTMLElement): Synapse3DHandle {
  const width = Math.max(320, container.clientWidth || 800);
  const height = Math.max(300, container.clientHeight || 460);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030712);

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
  camera.position.set(0, 4.5, 22);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch (err) {
    container.innerHTML = `<div class="card" role="status" style="margin:18px;">
      <h3>WebGL Context Unavailable</h3>
      <p class="meta-small">Your browser or headless environment does not expose a WebGL rendering context (${err instanceof Error ? err.message : 'unavailable'}). All 2D nanoscale simulation, Hodgkin-Huxley RK4, formal verification, and open-problems tabs remain fully interactive.</p>
    </div>`;
    return {
      triggerFusionBurst() {},
      setLayerVisibility() {},
      resize() {},
      dispose() {},
    };
  }
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0x94a3b8, 0.9);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0x38bdf8, 1.4);
  key.position.set(10, 14, 12);
  scene.add(key);
  const warm = new THREE.PointLight(0xf59e0b, 1.8, 35);
  warm.position.set(-8, 6, 6);
  scene.add(warm);

  const root = new THREE.Group();
  scene.add(root);

  // Presynaptic membrane dome
  const preMem = new THREE.Mesh(
    new THREE.SphereGeometry(6.8, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.56),
    new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.22,
      roughness: 0.35,
      side: THREE.DoubleSide,
    })
  );
  preMem.position.y = 1.6;
  root.add(preMem);

  // Postsynaptic dendritic spine dome
  const postMem = new THREE.Mesh(
    new THREE.SphereGeometry(6.4, 32, 20, 0, Math.PI * 2, Math.PI * 0.44, Math.PI * 0.56),
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.24,
      roughness: 0.35,
      side: THREE.DoubleSide,
    })
  );
  postMem.position.y = -1.6;
  root.add(postMem);

  // Strictly INTRACELLULAR PSD-95 / CaMKII scaffold slab underneath postsynaptic bilayer
  const psdMat = new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 3.6, 0.7, 28),
    new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.5, metalness: 0.2 })
  );
  psdMat.position.y = -2.75;
  root.add(psdMat);

  // Postsynaptic AMPAR/NMDAR nanocolumn cluster
  const nanocolumnGroup = new THREE.Group();
  for (let i = -2; i <= 2; i++) {
    const rec = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.24, 1.0, 12),
      new THREE.MeshStandardMaterial({ color: i === 0 ? 0xa78bfa : 0x10b981, emissive: 0x064e3b })
    );
    rec.position.set(i * 0.85, -1.55, (i % 2) * 0.45);
    nanocolumnGroup.add(rec);
  }
  const nanoBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(2.1, 2.1, 3.0, 24, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
  );
  nanoBeam.position.y = 0;
  nanocolumnGroup.add(nanoBeam);
  root.add(nanocolumnGroup);

  // Lateral CaV2.1 channels offset ~17 nm (NOT blocking fusion pore)
  for (const x of [-2.2, 2.2]) {
    const cav = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 1.0, 14),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0x78350f })
    );
    cav.position.set(x, 1.55, 0);
    root.add(cav);
  }

  // Synaptic vesicle reserve pool + Synapsin LLPS translucent cloud
  const llpsGroup = new THREE.Group();
  const llpsCloud = new THREE.Mesh(
    new THREE.SphereGeometry(3.6, 24, 18),
    new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.13, wireframe: false })
  );
  llpsCloud.position.set(0, 4.4, 0);
  llpsGroup.add(llpsCloud);
  root.add(llpsGroup);

  const vesGeo = new THREE.SphereGeometry(0.55, 16, 12);
  const vesMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.4 });
  const vesCoords: [number, number, number][] = [
    [0, 2.1, 0],
    [-1.4, 3.3, 0.6],
    [1.3, 3.2, -0.5],
    [-0.4, 4.6, -0.8],
    [0.8, 4.8, 0.9],
    [-2.0, 4.7, -0.2],
    [2.1, 4.4, 0.4],
    [0.1, 5.7, 0.1],
  ];
  for (const [vx, vy, vz] of vesCoords) {
    const v = new THREE.Mesh(vesGeo, vesMat);
    v.position.set(vx, vy, vz);
    root.add(v);
  }

  // Microtubule + LONGITUDINAL golden tau crest (EMD-7769) + walking Kinesin-1 motor
  const mtGroup = new THREE.Group();
  const mtTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.65, 9.5, 16),
    new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.45 })
  );
  mtTube.rotation.z = Math.PI / 2;
  mtTube.position.set(-1.5, 6.9, -1.2);
  mtGroup.add(mtTube);

  // Longitudinal tau ridge along lower crest (NOT spiraling!)
  const tauRidge = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 0.16, 0.22),
    new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0x78350f })
  );
  tauRidge.position.set(-1.5, 6.22, -1.2);
  mtGroup.add(tauRidge);

  const kinesin = new THREE.Group();
  const kinBody = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.38),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0369a1 })
  );
  kinesin.add(kinBody);
  const cargoVes = new THREE.Mesh(vesGeo, vesMat);
  cargoVes.position.y = 0.95;
  kinesin.add(cargoVes);
  kinesin.position.set(-4.5, 7.85, -1.2);
  mtGroup.add(kinesin);
  root.add(mtGroup);

  // Glutamate fusion burst particles
  const nParticles = 60;
  const pPos = new Float32Array(nParticles * 3);
  const pVel = new Float32Array(nParticles * 3);
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xfbbf24, size: 0.24, transparent: true, opacity: 0.0 });
  const particles = new THREE.Points(pGeo, pMat);
  root.add(particles);

  let burstLife = 0;
  const triggerFusionBurst = (): void => {
    burstLife = 1.0;
    for (let i = 0; i < nParticles; i++) {
      const a = (i / nParticles) * Math.PI * 2;
      const r = (i % 5) * 0.14;
      pPos[i * 3] = Math.cos(a) * r;
      pPos[i * 3 + 1] = 1.25;
      pPos[i * 3 + 2] = Math.sin(a) * r;
      pVel[i * 3] = Math.cos(a) * (0.02 + (i % 7) * 0.004);
      pVel[i * 3 + 1] = -0.055 - (i % 4) * 0.01;
      pVel[i * 3 + 2] = Math.sin(a) * (0.02 + (i % 5) * 0.004);
    }
    pGeo.attributes.position.needsUpdate = true;
    pMat.opacity = 0.95;
  };

  // Drag-to-orbit pointer controls
  let dragging = false;
  let prevX = 0;
  let prevY = 0;
  let rotY = 0.25;
  let rotX = 0.12;

  const onDown = (e: PointerEvent): void => {
    dragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  };
  const onMove = (e: PointerEvent): void => {
    if (!dragging) return;
    rotY += (e.clientX - prevX) * 0.008;
    rotX = Math.max(-0.8, Math.min(0.8, rotX + (e.clientY - prevY) * 0.006));
    prevX = e.clientX;
    prevY = e.clientY;
  };
  const onUp = (): void => {
    dragging = false;
  };
  renderer.domElement.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let rafId = 0;
  let t = 0;

  const animate = (): void => {
    rafId = requestAnimationFrame(animate);
    if (!reducedMotion) {
      t += 0.016;
      if (!dragging) rotY += 0.003;
      // Processive kinesin-1 walk along unobstructed top protofilament (- to +)
      kinesin.position.x = -5.2 + ((t * 0.9) % 7.5);
    }
    root.rotation.y = rotY;
    root.rotation.x = rotX;

    if (burstLife > 0) {
      burstLife = Math.max(0, burstLife - 0.016);
      for (let i = 0; i < nParticles; i++) {
        pPos[i * 3] += pVel[i * 3];
        pPos[i * 3 + 1] = Math.max(-1.45, pPos[i * 3 + 1] + pVel[i * 3 + 1]);
        pPos[i * 3 + 2] += pVel[i * 3 + 2];
      }
      pGeo.attributes.position.needsUpdate = true;
      pMat.opacity = burstLife;
    }

    renderer.render(scene, camera);
  };
  animate();

  return {
    triggerFusionBurst,
    setLayerVisibility(layer, visible) {
      if (layer === 'llps') llpsGroup.visible = visible;
      if (layer === 'microtubule') mtGroup.visible = visible;
      if (layer === 'nanocolumn') nanocolumnGroup.visible = visible;
    },
    resize() {
      const w = Math.max(320, container.clientWidth || 800);
      const h = Math.max(300, container.clientHeight || 460);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    },
    dispose() {
      cancelAnimationFrame(rafId);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      renderer.dispose();
    },
  };
}
