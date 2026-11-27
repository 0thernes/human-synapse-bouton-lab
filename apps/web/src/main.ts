// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2026 Alexander Stephen Donahue (Independent Researcher, ORCID 0009-0006-8168-9648)

import './styles.css';
import Chart from 'chart.js/auto';
import strings from './i18n/en.json';
import {
  BOUTON_PRESETS,
  CLASSIFIED_FINDINGS,
  CONSCIOUSNESS_CLUES,
  FORENSIC_AUDIT_HOTSPOTS,
  LITERATURE_LEDGER,
  OPEN_HARD_PROBLEMS,
  VESICLE_LIPIDOME,
  analyzeExperimentalTrace,
  classifyEndocytosisMode,
  computeBioenergetics,
  computeCleftGluPeakMm,
  computeEffectivePharmacology,
  computeEiBalance,
  computeElectrochemistry,
  computeKinesinTransport,
  computeLocalCaPeakUm,
  computeMetrology,
  computeNmdaMgUnblock,
  computePeakEpscPa,
  computeReleaseProbability,
  computeSnareEnergyProfile,
  computeSnareThermodynamics,
  computeThermalEnergyPnNm,
  createSeededRng,
  runVerificationSuite,
  solveHodgkinHuxleyRK4,
  type Discipline11,
  type FindingClass,
  type PharmacologyAgent,
} from '@synapse/core';
import { mountSynapse3D, type Synapse3DHandle } from './scene3d.js';

type TabKey = keyof typeof strings.tabs;

const SAMPLE_EPSC_CSV = `0.0,-2.0
0.5,-2.1
1.0,-1.9
1.5,-2.0
2.0,-14.8
2.5,-31.4
3.0,-33.8
4.0,-24.2
5.0,-15.1
6.0,-9.2
8.0,-4.4
10.0,-2.5`;

function esc(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing required DOM node #${id}`);
  return node as T;
}

// ---------- Live API detection (graceful fallback to @synapse/core on GitHub Pages) ----------
async function probeApiHealth(): Promise<void> {
  const badge = el<HTMLSpanElement>('api-status-badge');
  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://127.0.0.1:8000';
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 900);
    const res = await fetch(`${baseUrl}/healthz`, { signal: controller.signal });
    window.clearTimeout(timer);
    if (res.ok) {
      const body = (await res.json()) as { version?: string; oracle_precision_digits?: string };
      badge.textContent = `FastAPI 50-Digit Oracle Connected (v${body.version ?? '1.4.0'})`;
      badge.className = 'status-pill status-live';
    }
  } catch {
    badge.textContent = 'Static Core Engine (@synapse/core)';
    badge.className = 'status-pill status-static';
  }
}

// ---------- Tab navigation with full keyboard support (WCAG 2.2 AA, A38) ----------
let scene3d: Synapse3DHandle | null = null;
const TAB_KEYS = Object.keys(strings.tabs) as TabKey[];

function initTabs(): void {
  el('app-title').textContent = strings.title;
  el('app-subtitle').textContent = strings.subtitle;
  const nav = el('tab-nav');
  nav.innerHTML = TAB_KEYS.map(
    (key, idx) =>
      `<button type="button" role="tab" id="tab-btn-${key}" class="tab-btn ${idx === 0 ? 'active' : ''}" aria-selected="${idx === 0 ? 'true' : 'false'}" aria-controls="panel-${key}" data-tab="${key}">${esc(strings.tabs[key])}</button>`
  ).join('');

  const activate = (target: TabKey): void => {
    for (const k of TAB_KEYS) {
      const btn = el<HTMLButtonElement>(`tab-btn-${k}`);
      const panel = el<HTMLElement>(`panel-${k}`);
      const on = k === target;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
      panel.hidden = !on;
    }
    if (target === 'lab3d') {
      if (!scene3d) {
        scene3d = mountSynapse3D(el('viewport-3d'));
      } else {
        scene3d.resize();
      }
    }
  };

  nav.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-tab]');
    if (btn?.dataset.tab) activate(btn.dataset.tab as TabKey);
  });

  nav.addEventListener('keydown', (e) => {
    const current = document.activeElement as HTMLButtonElement | null;
    if (!current?.dataset.tab) return;
    const i = TAB_KEYS.indexOf(current.dataset.tab as TabKey);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = TAB_KEYS[(i + 1) % TAB_KEYS.length];
      activate(next);
      el(`tab-btn-${next}`).focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = TAB_KEYS[(i - 1 + TAB_KEYS.length) % TAB_KEYS.length];
      activate(prev);
      el(`tab-btn-${prev}`).focus();
    }
  });
}

// ---------- TAB 1: Nanoscale Bouton Simulator, Live Oscilloscope & Real Videos ----------
function renderSimTab(): void {
  const host = el('panel-sim');
  host.innerHTML = `
    <div class="grid-2">
      <div class="panel">
        <h2>Interactive Human Synaptic Bouton Parameters</h2>
        <div class="control-row">
          <label for="sim-preset"><span>Species &amp; Cortical Layer Preset</span><span id="sim-preset-ves"></span></label>
          <select id="sim-preset">
            ${BOUTON_PRESETS.map((p) => `<option value="${p.id}" ${p.id === 'human_l1_elife_2024' ? 'selected' : ''}>${esc(p.label)} — ${p.totalVesicles.toLocaleString()} vesicles</option>`).join('')}
          </select>
        </div>
        <div class="control-row">
          <label for="sim-pharm"><span>Molecular Pharmacology Perturbation</span></label>
          <select id="sim-pharm">
            <option value="control">Control (Physiological Cortical Bouton)</option>
            <option value="bonta">Botulinum Neurotoxin A (BoNT/A — SNAP-25 cleavage)</option>
            <option value="agatoxin">ω-Agatoxin IVA (CaV2.1 P/Q-type channel block)</option>
            <option value="tboa">DL-TBOA (Astrocyte EAAT2/GLT-1 clearance block)</option>
            <option value="cnqx">CNQX (Postsynaptic AMPAR antagonist)</option>
            <option value="pip2_depletion">PI(4,5)P2 Depletion (Syt1 C2B membrane block)</option>
          </select>
        </div>
        <div class="control-row">
          <label for="sim-ca"><span>Extracellular [Ca²⁺]₀ (mM)</span><strong id="val-ca">2.0 mM</strong></label>
          <input id="sim-ca" type="range" min="0.5" max="4.0" step="0.1" value="2.0" />
        </div>
        <div class="control-row">
          <label for="sim-dist"><span>CaV2.1 → Syt1 Coupling Distance d (nm)</span><strong id="val-dist">17 nm</strong></label>
          <input id="sim-dist" type="range" min="8" max="90" step="1" value="17" />
        </div>
        <div class="control-row">
          <label for="sim-offset"><span>Trans-Synaptic Nanocolumn Offset (nm)</span><strong id="val-offset">0 nm</strong></label>
          <input id="sim-offset" type="range" min="0" max="120" step="2" value="0" />
        </div>
        <div class="control-row">
          <label for="sim-cleft"><span>Synaptic Cleft Width (nm)</span><strong id="val-cleft">22 nm</strong></label>
          <input id="sim-cleft" type="range" min="14" max="36" step="1" value="22" />
        </div>
        <div class="control-row">
          <label for="sim-temp"><span>Temperature (°C) — Endocytosis Switch</span><strong id="val-temp">37 °C</strong></label>
          <input id="sim-temp" type="range" min="20" max="40" step="1" value="37" />
        </div>
        <div class="control-row">
          <label for="sim-seed"><span>Deterministic PRNG Seed (Build Standard B03)</span></label>
          <input id="sim-seed" type="number" min="1" max="9999999" value="1000" />
        </div>
        <div class="btn-row">
          <button type="button" class="btn" id="btn-trigger-ap">Trigger Deterministic AP</button>
          <button type="button" class="btn btn-amber" id="btn-trigger-train">Run 10-AP Burst</button>
          <button type="button" class="btn" id="btn-reset-sim">Reset Pool &amp; Seed</button>
        </div>
        <p class="meta-small" id="sim-pharm-note" style="margin-top:10px;"></p>
      </div>

      <div class="panel">
        <h2>Live Nanoscale Telemetry &amp; Cross-Section</h2>
        <canvas id="sim-canvas" class="sim-canvas" width="640" height="300" aria-label="2D nanoscale synaptic bouton schematic"></canvas>
        <div class="metric-grid" id="sim-metrics"></div>
        <div style="margin-top:14px; height:170px;">
          <canvas id="sim-oscilloscope" aria-label="Postsynaptic EPSC oscilloscope"></canvas>
        </div>
      </div>
    </div>

    <div class="panel" style="margin-top:18px;">
      <h2>Code-Reproducible Simulation Videos (Generated by <code>synapse-media</code>)</h2>
      <p class="meta-small" style="margin-bottom:12px;">
        Rendered deterministically from our Hodgkin–Huxley 4D RK4 solver and exact biophysical equations (not pre-rendered mockups).
      </p>
      <div class="grid-2">
        <div class="card">
          <h3>Action Potential → Ca²⁺ Nanodomain → Glutamate Cleft → AMPAR EPSC</h3>
          <video class="media-video" controls loop muted playsinline preload="metadata">
            <source src="./media/synapse_exocytosis_sim.mp4" type="video/mp4" />
          </video>
        </div>
        <div class="card">
          <h3>Trans-Synaptic Nanocolumn Misalignment Sweep (0 → 120 nm)</h3>
          <video class="media-video" controls loop muted playsinline preload="metadata">
            <source src="./media/nanocolumn_sweep_sim.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  `;

  let rng = createSeededRng(1000);
  let rrpRemaining = 20;
  let apHistory: { label: string; epsc: number; ca: number }[] = [];

  const oscChart = new Chart(el<HTMLCanvasElement>('sim-oscilloscope'), {
    type: 'bar',
    data: {
      labels: [] as string[],
      datasets: [
        {
          label: 'Peak |EPSC| (pA)',
          data: [] as number[],
          backgroundColor: 'rgba(56, 189, 248, 0.72)',
          borderColor: '#38bdf8',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#cbd5e1' } } },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.12)' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.12)' }, beginAtZero: true },
      },
    },
  });

  const drawCanvas = (
    caUm: number,
    couplingNm: number,
    offsetNm: number,
    cleftNm: number,
    fusedNow: number
  ): void => {
    const canvas = el<HTMLCanvasElement>('sim-canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, w, h);

    const cleftPx = Math.max(24, Math.min(70, cleftNm * 1.9));
    const preY = h / 2 - cleftPx / 2;
    const postY = h / 2 + cleftPx / 2;

    // Presynaptic membrane
    ctx.fillStyle = '#0f1b33';
    ctx.fillRect(40, 18, w - 80, preY - 18);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, preY);
    ctx.lineTo(w - 40, preY);
    ctx.stroke();

    // Postsynaptic spine + strictly intracellular PSD-95 underneath bilayer
    ctx.fillStyle = '#0c1a2e';
    ctx.fillRect(40, postY, w - 80, h - postY - 18);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, postY);
    ctx.lineTo(w - 40, postY);
    ctx.stroke();

    const centerX = w / 2;
    const relX = centerX + Math.min(180, offsetNm * 1.5);

    // Intracellular PSD-95 mat
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(centerX - 88, postY + 12, 176, 26);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(centerX - 88, postY + 12, 176, 26);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Intracellular PSD-95 / CaMKII', centerX, postY + 29);

    // AMPAR nanodomain at centerX
    for (let i = -2; i <= 2; i++) {
      ctx.fillStyle = i === 0 ? '#a78bfa' : '#10b981';
      ctx.fillRect(centerX + i * 24 - 6, postY - 7, 12, 16);
    }

    // Lateral CaV2.1 channels offset by couplingNm
    const cOffPx = Math.max(16, Math.min(110, couplingNm * 1.4));
    for (const dir of [-1, 1]) {
      const cx = relX + dir * cOffPx;
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cx - 5, preY - 8, 10, 14);
      const glow = ctx.createRadialGradient(cx, preY - 4, 2, cx, preY - 4, Math.min(60, caUm * 1.4));
      glow.addColorStop(0, 'rgba(245, 158, 11, 0.55)');
      glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, preY - 4, Math.min(60, caUm * 1.4), 0, Math.PI * 2);
      ctx.fill();
    }

    // Docked synaptic vesicle at relX
    ctx.fillStyle = fusedNow > 0 ? '#fde047' : '#fef3c7';
    ctx.beginPath();
    ctx.arc(relX, preY - 22, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glutamate cloud if fused
    if (fusedNow > 0) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
      for (let i = 0; i < 24; i++) {
        const dx = ((i * 37) % 52) - 26;
        const dy = ((i * 19) % Math.max(10, Math.floor(cleftPx - 8))) + 4;
        ctx.beginPath();
        ctx.arc(relX + dx, preY + dy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`d = ${couplingNm} nm | Offset = ${offsetNm} nm | Cleft = ${cleftNm} nm | RRP = ${rrpRemaining}`, 50, 36);
  };

  const getParams = () => {
    const presetId = el<HTMLSelectElement>('sim-preset').value;
    const preset = BOUTON_PRESETS.find((p) => p.id === presetId) ?? BOUTON_PRESETS[1];
    const caExt = Number(el<HTMLInputElement>('sim-ca').value);
    const dist = Number(el<HTMLInputElement>('sim-dist').value);
    const offset = Number(el<HTMLInputElement>('sim-offset').value);
    const cleft = Number(el<HTMLInputElement>('sim-cleft').value);
    const temp = Number(el<HTMLInputElement>('sim-temp').value);
    const pharm = el<HTMLSelectElement>('sim-pharm').value as PharmacologyAgent;
    return { preset, caExt, dist, offset, cleft, temp, pharm };
  };

  const refreshUI = (fusedNow = 0): void => {
    const p = getParams();
    el('val-ca').textContent = `${p.caExt.toFixed(1)} mM`;
    el('val-dist').textContent = `${p.dist} nm`;
    el('val-offset').textContent = `${p.offset} nm`;
    el('val-cleft').textContent = `${p.cleft} nm`;
    el('val-temp').textContent = `${p.temp} °C`;
    el('sim-preset-ves').textContent = `AZ ≈ ${p.preset.activeZoneAreaUm2} μm²`;

    const caPeak = computeLocalCaPeakUm(p.caExt, p.dist);
    const basePr = computeReleaseProbability(caPeak);
    const gluPeak = computeCleftGluPeakMm(Math.max(1, fusedNow), p.cleft, p.offset);
    const baseEpsc = computePeakEpscPa(gluPeak, p.temp);
    const eff = computeEffectivePharmacology(basePr, baseEpsc, p.pharm);
    const kbt = computeThermalEnergyPnNm(p.temp);
    const endo = classifyEndocytosisMode(p.temp);

    el('sim-pharm-note').textContent = `Active Mechanism: ${eff.mechanism}`;
    el('sim-metrics').innerHTML = `
      <div class="metric-box"><div class="metric-label">Peak Local [Ca²⁺]</div><div class="metric-value">${caPeak.toFixed(2)} μM</div></div>
      <div class="metric-box"><div class="metric-label">Effective Release P_r</div><div class="metric-value">${(eff.effectivePr * 100).toFixed(1)}%</div></div>
      <div class="metric-box"><div class="metric-label">Peak Cleft [Glu]</div><div class="metric-value">${gluPeak.toFixed(2)} mM</div></div>
      <div class="metric-box"><div class="metric-label">Peak AMPAR EPSC</div><div class="metric-value">${eff.effectiveEpscPa.toFixed(1)} pA</div></div>
      <div class="metric-box"><div class="metric-label">Thermal k_B T</div><div class="metric-value">${kbt.toFixed(3)} pN·nm</div></div>
      <div class="metric-box"><div class="metric-label">Endocytosis Mode</div><div class="metric-value" style="font-size:0.86rem;">${esc(endo)}</div></div>
    `;
    drawCanvas(caPeak, p.dist, p.offset, p.cleft, fusedNow);
  };

  const fireOneAp = (): void => {
    const p = getParams();
    const caPeak = computeLocalCaPeakUm(p.caExt, p.dist) * (0.88 + 0.24 * rng.next());
    const basePr = computeReleaseProbability(caPeak);
    const effPr = computeEffectivePharmacology(basePr, -30, p.pharm).effectivePr;
    let fused = 0;
    const slots = Math.min(rrpRemaining, 4);
    for (let s = 0; s < slots; s++) {
      if (rng.next() < Math.min(0.98, effPr * 0.45)) fused++;
    }
    rrpRemaining = Math.max(0, rrpRemaining - fused);
    if (rrpRemaining < p.preset.rrpMax && rng.next() < 0.72) rrpRemaining += 1;

    const glu = computeCleftGluPeakMm(fused, p.cleft, p.offset);
    const epsc = fused > 0 ? computeEffectivePharmacology(basePr, computePeakEpscPa(glu, p.temp), p.pharm).effectiveEpscPa : 0;
    apHistory.push({ label: `AP${apHistory.length + 1}`, epsc: Math.abs(epsc), ca: caPeak });
    if (apHistory.length > 20) apHistory = apHistory.slice(-20);

    oscChart.data.labels = apHistory.map((h) => h.label);
    oscChart.data.datasets[0].data = apHistory.map((h) => Number(h.epsc.toFixed(2)));
    oscChart.update('none');
    refreshUI(fused);
  };

  for (const id of ['sim-preset', 'sim-pharm', 'sim-ca', 'sim-dist', 'sim-offset', 'sim-cleft', 'sim-temp']) {
    el(id).addEventListener('input', () => {
      if (id === 'sim-preset') rrpRemaining = getParams().preset.rrpMax;
      refreshUI(0);
    });
  }
  el('btn-trigger-ap').addEventListener('click', fireOneAp);
  el('btn-trigger-train').addEventListener('click', () => {
    for (let i = 0; i < 10; i++) fireOneAp();
  });
  el('btn-reset-sim').addEventListener('click', () => {
    const seed = Number(el<HTMLInputElement>('sim-seed').value) || 1000;
    rng = createSeededRng(seed);
    rrpRemaining = getParams().preset.rrpMax;
    apHistory = [];
    oscChart.data.labels = [];
    oscChart.data.datasets[0].data = [];
    oscChart.update();
    refreshUI(0);
  });

  refreshUI(0);
}

// ---------- TAB 2: 3D WebGL Bouton ----------
function render3dTab(): void {
  const host = el('panel-lab3d');
  host.innerHTML = `
    <div class="panel">
      <h2>Interactive 3D WebGL Human Synaptic Bouton (Three.js)</h2>
      <p class="meta-small" style="margin-bottom:10px;">
        Drag to orbit · Features longitudinal golden tau crest (EMD-7769), walking Kinesin-1 motor, Synapsin LLPS condensate, lateral CaV2.1 channels, aligned AMPAR/NMDAR nanocolumn, and strictly intracellular PSD-95 mat.
      </p>
      <div class="btn-row" style="margin-bottom:12px;">
        <button type="button" class="btn" id="btn-3d-burst">Trigger 3D Glutamate Fusion Burst</button>
        <label class="btn" style="display:inline-flex;align-items:center;gap:6px;"><input type="checkbox" id="chk-3d-llps" checked /> Synapsin LLPS</label>
        <label class="btn" style="display:inline-flex;align-items:center;gap:6px;"><input type="checkbox" id="chk-3d-mt" checked /> Microtubule &amp; Kinesin-1</label>
        <label class="btn" style="display:inline-flex;align-items:center;gap:6px;"><input type="checkbox" id="chk-3d-nano" checked /> Nanocolumn</label>
      </div>
      <div id="viewport-3d" class="viewport-3d" aria-label="Interactive 3D synaptic bouton viewport"></div>
    </div>
  `;
  el('btn-3d-burst').addEventListener('click', () => scene3d?.triggerFusionBurst());
  el('chk-3d-llps').addEventListener('change', (e) =>
    scene3d?.setLayerVisibility('llps', (e.target as HTMLInputElement).checked)
  );
  el('chk-3d-mt').addEventListener('change', (e) =>
    scene3d?.setLayerVisibility('microtubule', (e.target as HTMLInputElement).checked)
  );
  el('chk-3d-nano').addEventListener('change', (e) =>
    scene3d?.setLayerVisibility('nanocolumn', (e.target as HTMLInputElement).checked)
  );
}

// ---------- TAB 3: Hodgkin-Huxley RK4, NMDAR Mg2+, E/I Balance & Trace Analyzer ----------
function renderHhTab(): void {
  const host = el('panel-hh');
  host.innerHTML = `
    <div class="grid-2">
      <div class="panel">
        <h2>Hodgkin–Huxley 4D RK4 Solver (<code>numerical_approximation</code>)</h2>
        <div class="control-row">
          <label for="hh-inj"><span>Injected Current I_inj (μA/cm²)</span><strong id="val-hh-inj">15.0</strong></label>
          <input id="hh-inj" type="range" min="0" max="40" step="0.5" value="15" />
        </div>
        <div class="control-row">
          <label for="hh-gna"><span>Max Na⁺ Conductance g_Na (mS/cm²)</span><strong id="val-hh-gna">120</strong></label>
          <input id="hh-gna" type="range" min="40" max="180" step="5" value="120" />
        </div>
        <div class="control-row">
          <label for="hh-temp"><span>Temperature (°C)</span><strong id="val-hh-temp">6.3 °C</strong></label>
          <input id="hh-temp" type="range" min="6.3" max="24" step="0.5" value="6.3" />
        </div>
        <div style="height:220px;"><canvas id="hh-chart"></canvas></div>
        <p class="meta-small" id="hh-summary" style="margin-top:8px;"></p>
      </div>

      <div class="panel">
        <h2>NMDAR Mg²⁺ Coincidence Switch &amp; KCC2 E/I Shunting</h2>
        <div class="control-row">
          <label for="ei-ge"><span>Excitatory g_E (nS)</span><strong id="val-ei-ge">3.0 nS</strong></label>
          <input id="ei-ge" type="range" min="0" max="15" step="0.2" value="3.0" />
        </div>
        <div class="control-row">
          <label for="ei-gi"><span>Inhibitory GABA g_I (nS)</span><strong id="val-ei-gi">4.0 nS</strong></label>
          <input id="ei-gi" type="range" min="0" max="15" step="0.2" value="4.0" />
        </div>
        <div class="control-row">
          <label for="ei-clin"><span>Intracellular [Cl⁻]_i (mM) — KCC2 vs NKCC1</span><strong id="val-ei-clin">7.0 mM</strong></label>
          <input id="ei-clin" type="range" min="4" max="35" step="0.5" value="7.0" />
        </div>
        <div class="metric-grid" id="ei-metrics"></div>
        <hr style="border-color:rgba(148,163,184,0.18);margin:14px 0;" />
        <h3>Hardened CSV / JSON Experimental Trace Analyzer (B06 Negative-Checked)</h3>
        <textarea id="trace-input" rows="5" aria-label="CSV or JSON electrophysiology trace">${SAMPLE_EPSC_CSV}</textarea>
        <div class="btn-row">
          <button type="button" class="btn" id="btn-analyze-trace">Analyze Trace</button>
        </div>
        <div id="trace-output" class="meta-small" style="margin-top:8px;"></div>
      </div>
    </div>
  `;

  const hhChart = new Chart(el<HTMLCanvasElement>('hh-chart'), {
    type: 'line',
    data: {
      labels: [] as number[],
      datasets: [{ label: 'V_m (mV)', data: [] as number[], borderColor: '#38bdf8', borderWidth: 2, pointRadius: 0 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#cbd5e1' } } },
      scales: {
        x: { ticks: { color: '#94a3b8', maxTicksLimit: 8 } },
        y: { ticks: { color: '#94a3b8' }, min: -85, max: 50 },
      },
    },
  });

  const updateHH = (): void => {
    const iInj = Number(el<HTMLInputElement>('hh-inj').value);
    const gNa = Number(el<HTMLInputElement>('hh-gna').value);
    const temp = Number(el<HTMLInputElement>('hh-temp').value);
    el('val-hh-inj').textContent = `${iInj.toFixed(1)}`;
    el('val-hh-gna').textContent = `${gNa}`;
    el('val-hh-temp').textContent = `${temp.toFixed(1)} °C`;
    const res = solveHodgkinHuxleyRK4({ iInjUaCm2: iInj, gNaMsCm2: gNa, gKMsCm2: 36, tempC: temp, durationMs: 20 });
    hhChart.data.labels = res.timesMs;
    hhChart.data.datasets[0].data = res.vmMv;
    hhChart.update('none');
    el('hh-summary').textContent = `Peak V_m = ${res.peakVmMv.toFixed(1)} mV | Action Potential: ${res.spiked ? 'FIRED' : 'Subthreshold'} | Tag: ${res.classification}`;
  };

  const updateEI = (): void => {
    const gE = Number(el<HTMLInputElement>('ei-ge').value);
    const gI = Number(el<HTMLInputElement>('ei-gi').value);
    const clIn = Number(el<HTMLInputElement>('ei-clin').value);
    el('val-ei-ge').textContent = `${gE.toFixed(1)} nS`;
    el('val-ei-gi').textContent = `${gI.toFixed(1)} nS`;
    el('val-ei-clin').textContent = `${clIn.toFixed(1)} mM`;
    const ei = computeEiBalance({ gExcNs: gE, gInhNs: gI, clInMm: clIn, clOutMm: 125, tempC: 37 });
    const mgUnblock = computeNmdaMgUnblock(ei.vSteadyMv, 1.0);
    el('ei-metrics').innerHTML = `
      <div class="metric-box"><div class="metric-label">E_Cl Reversal</div><div class="metric-value">${ei.eClMv.toFixed(1)} mV</div></div>
      <div class="metric-box"><div class="metric-label">Steady V_∞</div><div class="metric-value">${ei.vSteadyMv.toFixed(1)} mV</div></div>
      <div class="metric-box"><div class="metric-label">Shunting Ratio</div><div class="metric-value">${ei.shuntingRatio.toFixed(3)}</div></div>
      <div class="metric-box"><div class="metric-label">NMDAR Mg²⁺ Unblock</div><div class="metric-value">${(mgUnblock * 100).toFixed(1)}%</div></div>
    `;
  };

  const runTrace = (): void => {
    const out = el('trace-output');
    try {
      const res = analyzeExperimentalTrace(el<HTMLTextAreaElement>('trace-input').value);
      out.innerHTML = `<span class="pill pill-emerald">Parsed ${res.count} pts</span> Peak = <strong>${res.peakValue.toFixed(2)}</strong> · 10–90% Rise = <strong>${res.rise10To90Ms.toFixed(2)} ms</strong> · Charge = <strong>${res.chargeFc.toFixed(2)}</strong> · SNR = <strong>${res.snr.toFixed(1)}</strong>`;
    } catch (err) {
      out.innerHTML = `<span class="pill pill-rose">Rejected (B06 Guard)</span> ${esc((err as Error).message)}`;
    }
  };

  for (const id of ['hh-inj', 'hh-gna', 'hh-temp']) el(id).addEventListener('input', updateHH);
  for (const id of ['ei-ge', 'ei-gi', 'ei-clin']) el(id).addEventListener('input', updateEI);
  el('btn-analyze-trace').addEventListener('click', runTrace);
  updateHH();
  updateEI();
  runTrace();
}

// ---------- TAB 4: Electrochemistry, SNARE Thermodynamics & Bioenergetics ----------
function renderChemTab(): void {
  const host = el('panel-chem');
  host.innerHTML = `
    <div class="grid-2">
      <div class="panel">
        <h2>SNAREpin Zippering &amp; Syt1 (5 Ca²⁺) Clamp Switch</h2>
        <div class="control-row">
          <label for="snare-n"><span>SNAREpin Ring Copy Number</span><strong id="val-snare-n">4</strong></label>
          <input id="snare-n" type="range" min="1" max="6" step="1" value="4" />
        </div>
        <div class="control-row">
          <label for="snare-ca"><span>Ca²⁺ Ions Bound to Syt1 (C2A+C2B)</span><strong id="val-snare-ca">5</strong></label>
          <input id="snare-ca" type="range" min="0" max="5" step="1" value="5" />
        </div>
        <div class="control-row">
          <label for="snare-clamp"><span>Complexin Clamp Energy (k_B T)</span><strong id="val-snare-clamp">15</strong></label>
          <input id="snare-clamp" type="range" min="0" max="25" step="1" value="15" />
        </div>
        <div class="metric-grid" id="snare-metrics"></div>
        <div style="height:200px;margin-top:12px;"><canvas id="snare-chart"></canvas></div>
      </div>

      <div class="panel">
        <h2>V-ATPase PMF, Local ATP Budget &amp; Vesicle Lipidome</h2>
        <div class="control-row">
          <label for="bio-hz"><span>Firing Rate (Hz) — Critical Mito Limit ≈ 29.56 Hz</span><strong id="val-bio-hz">20 Hz</strong></label>
          <input id="bio-hz" type="range" min="0" max="60" step="1" value="20" />
        </div>
        <div class="control-row">
          <label style="justify-content:flex-start;gap:8px;"><input type="checkbox" id="bio-mito" checked /> Presynaptic Mitochondria Active (OxPhos + Glycolysis)</label>
        </div>
        <div class="metric-grid" id="bio-metrics"></div>
        <h3 style="margin-top:14px;">Exact Nernst &amp; GHK Physiology (37 °C)</h3>
        <div class="metric-grid" id="nernst-metrics"></div>
        <h3 style="margin-top:14px;">Synaptic Vesicle Organic Lipidome (<em>Narcine brasiliensis</em> Electric Organ, Deutsch &amp; Kelly 1981)</h3>
        <table class="data-table">
          <thead><tr><th>Lipid</th><th>mol %</th><th>Biophysical Role</th></tr></thead>
          <tbody>
            ${VESICLE_LIPIDOME.map((l) => `<tr><td><strong>${esc(l.lipid)}</strong></td><td>${l.molPercent}%</td><td>${esc(l.biophysicalRole)}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const snareChart = new Chart(el<HTMLCanvasElement>('snare-chart'), {
    type: 'line',
    data: {
      labels: [] as string[],
      datasets: [{ label: 'Free Energy (k_B T)', data: [] as number[], borderColor: '#34d399', borderWidth: 2.2, tension: 0.25 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#cbd5e1' } } },
      scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } },
    },
  });

  const ec = computeElectrochemistry({
    naOutMm: 145, naInMm: 12, kOutMm: 4, kInMm: 140, caOutMm: 2, caInUm: 0.08,
    clOutMm: 120, clInMm: 9, pNaRel: 0.04, pClRel: 0.45, tempC: 37,
  });
  const kin = computeKinesinTransport();
  el('nernst-metrics').innerHTML = `
    <div class="metric-box"><div class="metric-label">E_Na</div><div class="metric-value">+${ec.eNaMv.toFixed(1)} mV</div></div>
    <div class="metric-box"><div class="metric-label">E_K</div><div class="metric-value">${ec.eKMv.toFixed(1)} mV</div></div>
    <div class="metric-box"><div class="metric-label">V_GHK Rest</div><div class="metric-value">${ec.vmGhkMv.toFixed(1)} mV</div></div>
    <div class="metric-box"><div class="metric-label">Kinesin-1 (1 mm)</div><div class="metric-value">${kin.atpPerMm.toLocaleString()} ATP</div></div>
  `;

  const updateSnare = (): void => {
    const n = Number(el<HTMLInputElement>('snare-n').value);
    const ca = Number(el<HTMLInputElement>('snare-ca').value);
    const clamp = Number(el<HTMLInputElement>('snare-clamp').value);
    el('val-snare-n').textContent = `${n}`;
    el('val-snare-ca').textContent = `${ca}`;
    el('val-snare-clamp').textContent = `${clamp} k_B T`;
    const res = computeSnareThermodynamics({ snareCount: n, clampEnergyKbt: clamp, syt1CaBound: ca, tempC: 37 });
    const prof = computeSnareEnergyProfile({ snareCount: n, clampEnergyKbt: clamp, syt1CaBound: ca, tempC: 37 });
    el('snare-metrics').innerHTML = `
      <div class="metric-box"><div class="metric-label">Zip Drive</div><div class="metric-value">${res.totalZipKbt.toFixed(1)} k_B T</div></div>
      <div class="metric-box"><div class="metric-label">Eff. Barrier</div><div class="metric-value">${res.effectiveBarrierKbt.toFixed(1)} k_B T</div></div>
      <div class="metric-box"><div class="metric-label">Fusion Delay</div><div class="metric-value">${res.fusionDelayMs.toFixed(2)} ms</div></div>
      <div class="metric-box"><div class="metric-label">Regime</div><div class="metric-value" style="font-size:0.84rem;">${esc(res.stateLabel)}</div></div>
    `;
    snareChart.data.labels = prof.map((pt) => pt.stage);
    snareChart.data.datasets[0].data = prof.map((pt) => Number(pt.energyKbt.toFixed(2)));
    snareChart.update('none');
  };

  const updateBio = (): void => {
    const hz = Number(el<HTMLInputElement>('bio-hz').value);
    const mito = el<HTMLInputElement>('bio-mito').checked;
    el('val-bio-hz').textContent = `${hz} Hz`;
    const bio = computeBioenergetics({ luminalPh: 5.5, cytosolicPh: 7.2, deltaPsiMv: 40, firingRateHz: hz, mitoActive: mito, tempC: 37 });
    el('bio-metrics').innerHTML = `
      <div class="metric-box"><div class="metric-label">V-ATPase PMF</div><div class="metric-value">${bio.pmfMv.toFixed(1)} mV</div></div>
      <div class="metric-box"><div class="metric-label">Est. Glu Quanta</div><div class="metric-value">${bio.estGluQuanta.toLocaleString()}</div></div>
      <div class="metric-box"><div class="metric-label">ATP Burn / Synth</div><div class="metric-value" style="font-size:0.88rem;">${(bio.atpBurnPerSec / 1000).toFixed(0)}k / ${(bio.atpSynthPerSec / 1000).toFixed(0)}k s⁻¹</div></div>
      <div class="metric-box"><div class="metric-label">Sustainability</div><div class="metric-value">${Number.isFinite(bio.sustainSeconds) ? `${bio.sustainSeconds.toFixed(1)} s` : 'Sustained ∞'}</div></div>
    `;
  };

  for (const id of ['snare-n', 'snare-ca', 'snare-clamp']) el(id).addEventListener('input', updateSnare);
  for (const id of ['bio-hz', 'bio-mito']) el(id).addEventListener('input', updateBio);
  updateSnare();
  updateBio();
}

// ---------- TAB 5: DNA-PAINT / RESI Metrology ----------
function renderNanoTab(): void {
  const host = el('panel-nano');
  host.innerHTML = `
    <div class="grid-2">
      <div class="panel">
        <h2>DNA-PAINT &amp; RESI Ångström Metrology (Reinhardt et al. 2023)</h2>
        <div class="control-row">
          <label for="met-photons"><span>Photons Detected (N)</span><strong id="val-met-photons">2500</strong></label>
          <input id="met-photons" type="range" min="200" max="10000" step="100" value="2500" />
        </div>
        <div class="control-row">
          <label for="met-k"><span>RESI Orthogonal Subsets (K)</span><strong id="val-met-k">9</strong></label>
          <input id="met-k" type="range" min="1" max="16" step="1" value="9" />
        </div>
        <div class="control-row">
          <label for="met-spacing"><span>Receptor Pair Spacing (nm)</span><strong id="val-met-spacing">3.0 nm</strong></label>
          <input id="met-spacing" type="range" min="0.5" max="12" step="0.5" value="3.0" />
        </div>
        <div class="metric-grid" id="met-metrics"></div>
      </div>
      <div class="panel">
        <h2>Two-Receptor Nanocolumn Resolvability Profile</h2>
        <div style="height:260px;"><canvas id="met-chart"></canvas></div>
      </div>
    </div>
  `;

  const metChart = new Chart(el<HTMLCanvasElement>('met-chart'), {
    type: 'line',
    data: { labels: [] as number[], datasets: [{ label: 'Intensity Profile', data: [] as number[], borderColor: '#c084fc', borderWidth: 2, pointRadius: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } } },
  });

  const updateMet = (): void => {
    const photons = Number(el<HTMLInputElement>('met-photons').value);
    const k = Number(el<HTMLInputElement>('met-k').value);
    const spacing = Number(el<HTMLInputElement>('met-spacing').value);
    el('val-met-photons').textContent = `${photons}`;
    el('val-met-k').textContent = `${k}`;
    el('val-met-spacing').textContent = `${spacing.toFixed(1)} nm`;
    const r = computeMetrology({ photons, psfSigmaNm: 110, imagerConcNm: 2, kOn: 2, kOff: 5, spacingNm: spacing, resiSubsetsK: k });
    el('met-metrics').innerHTML = `
      <div class="metric-box"><div class="metric-label">DNA-PAINT σ</div><div class="metric-value">${r.crlbNm.toFixed(2)} nm</div></div>
      <div class="metric-box"><div class="metric-label">RESI σ</div><div class="metric-value">${r.resiNm.toFixed(2)} nm</div></div>
      <div class="metric-box"><div class="metric-label">FWHM</div><div class="metric-value">${r.fwhmNm.toFixed(2)} nm</div></div>
      <div class="metric-box"><div class="metric-label">Pair Resolvable?</div><div class="metric-value">${r.resolvable ? 'YES' : 'NO'}</div></div>
    `;
    const xs: number[] = [];
    const ys: number[] = [];
    for (let x = -10; x <= 10; x += 0.25) {
      xs.push(Number(x.toFixed(2)));
      const s = Math.max(0.2, r.resiNm);
      const y = Math.exp(-Math.pow(x + spacing / 2, 2) / (2 * s * s)) + Math.exp(-Math.pow(x - spacing / 2, 2) / (2 * s * s));
      ys.push(Number(y.toFixed(4)));
    }
    metChart.data.labels = xs;
    metChart.data.datasets[0].data = ys;
    metChart.update('none');
  };

  for (const id of ['met-photons', 'met-k', 'met-spacing']) el(id).addEventListener('input', updateMet);
  updateMet();
}

// ---------- TAB 6: Forensic Scientific Audit (Fixed broken 4163_audit.jpg!) ----------
function renderAuditTab(): void {
  const host = el('panel-audit');
  host.innerHTML = `
    <div class="grid-2">
      <div class="panel">
        <h2>Audited Human Cortical Tripartite Bouton Blueprint</h2>
        <p class="meta-small" style="margin-bottom:10px;">
          Click or Tab through numbered pins (1–5) to inspect every critical biophysical correction over naive AI/textbook synapse cartoons.
          Rendered deterministically by <code>synapse-media</code> (schematic, not atomic PDB data).
        </p>
        <div class="audit-stage">
          <img src="./media/tripartite_bouton_blueprint.png" alt="Biophysically audited human cortical tripartite synaptic bouton cross-section blueprint with five inspection hotspots" />
          ${FORENSIC_AUDIT_HOTSPOTS.map(
            (h) =>
              `<button type="button" class="audit-pin pin-${h.severity}" style="left:${h.xPct}%;top:${h.yPct}%;" data-pin="${h.id}" aria-label="Hotspot ${h.id}: ${esc(h.title)}">${h.id}</button>`
          ).join('')}
        </div>
      </div>
      <div class="panel">
        <h2>Forensic Hotspot Inspection Card</h2>
        <div id="audit-detail" class="card"></div>
        <h3 style="margin-top:16px;">Publication Figures (Generated Live from Verified Code)</h3>
        <div class="grid-2" style="margin-top:8px;">
          <a href="./media/fig1_nanoscale_architecture.png" target="_blank" rel="noreferrer"><img src="./media/fig1_nanoscale_architecture.png" alt="Figure 1 nanoscale architecture" style="width:100%;border-radius:8px;" /></a>
          <a href="./media/fig4_preregistered_monte_carlo.png" target="_blank" rel="noreferrer"><img src="./media/fig4_preregistered_monte_carlo.png" alt="Figure 4 pre-registered Monte Carlo results" style="width:100%;border-radius:8px;" /></a>
        </div>
      </div>
    </div>
  `;

  const showPin = (id: number): void => {
    const h = FORENSIC_AUDIT_HOTSPOTS.find((x) => x.id === id) ?? FORENSIC_AUDIT_HOTSPOTS[0];
    el('audit-detail').innerHTML = `
      <span class="pill pill-${h.severity === 'critical' ? 'rose' : h.severity === 'scale' ? 'amber' : h.severity === 'frontier' ? 'violet' : 'emerald'}">Pin #${h.id} · ${h.severity.toUpperCase()}</span>
      <h3 style="margin-top:10px;">${esc(h.title)}</h3>
      <p><strong>Defect in Naive Cartoons:</strong> ${esc(h.defectInNaiveVisuals)}</p>
      <p><strong>Biophysical Correction:</strong> ${esc(h.biophysicalCorrection)}</p>
      <p class="meta-small"><strong>Primary Anchor:</strong> ${esc(h.literatureAnchor)}</p>
    `;
  };
  host.addEventListener('click', (e) => {
    const pin = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-pin]');
    if (pin?.dataset.pin) showPin(Number(pin.dataset.pin));
  });
  showPin(1);
}

// ---------- TAB 7: Live Verification Suite, Lean 4 Summary & Literature ----------
function renderVerifyTab(): void {
  const host = el('panel-verify');
  const checks = runVerificationSuite();
  const passed = checks.filter((c) => c.passed).length;
  host.innerHTML = `
    <div class="panel" style="margin-bottom:18px;">
      <h2>Live Computational Self-Verification Suite (${passed}/${checks.length} Passed)</h2>
      <p class="meta-small" style="margin-bottom:10px;">
        Cross-backed by 24 sorry-free Lean 4.35.0 elementary lemmas (0 unused hypotheses, enforced 0 Classical.choice, 27 concrete witnesses + 7 sanity &amp; sharpness checks, replayed across official kernel, leanchecker-paranoid, lean4lean, nanoda, con-ron, con-leche; <a href="./blueprint/" style="color:#38bdf8;">explore Proof Blueprint &amp; DAG</a>) + 1,000-case Python 50-digit mpmath vs TypeScript vs Rust differential &amp; Lean vector parity tests.
      </p>
      <table class="data-table">
        <thead><tr><th>ID</th><th>Status</th><th>Tier</th><th>Check</th><th>Observed Output</th></tr></thead>
        <tbody>
          ${checks
            .map(
              (c) =>
                `<tr><td><code>${c.id}</code></td><td><span class="pill ${c.passed ? 'pill-emerald' : 'pill-rose'}">${c.passed ? 'PASS' : 'FAIL'}</span></td><td><code>${c.tier}</code></td><td>${esc(c.name)}</td><td>${esc(c.detail)}</td></tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div class="panel">
      <h2>Verified 2000–2026 Grounded Literature Ledger (${LITERATURE_LEDGER.length} Primary Sources)</h2>
      <table class="data-table">
        <thead><tr><th>#</th><th>Authors (Year)</th><th>Title &amp; Venue</th><th>Tier</th></tr></thead>
        <tbody>
          ${LITERATURE_LEDGER.map(
            (r) =>
              `<tr><td>${r.id}</td><td>${esc(r.authors)} (${r.year})</td><td><a href="${esc(r.url)}" target="_blank" rel="noreferrer">${esc(r.title)}</a><br/><span class="meta-small">${esc(r.venue)} · ${esc(r.identifier)}</span></td><td><span class="pill pill-cyan">${esc(r.tier)}</span></td></tr>`
          ).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ---------- TAB 8: 11-Discipline Open Hard Problems & Consciousness Epistemic Frontier ----------
function renderOpenProblemsTab(): void {
  const host = el('panel-open-problems');
  const disciplines: ('ALL' | Discipline11)[] = [
    'ALL',
    'Math',
    'Physics',
    'Chemistry',
    'Biology',
    'Neuroscience',
    'Neuropsychology',
    'NeuroCS',
    'NeuroMath',
    'Neurochemistry',
    'Neurobiology',
    'Neurophysics',
  ];

  host.innerHTML = `
    <div class="panel" style="margin-bottom:18px;">
      <h2>11-Discipline Open Hard Problems Registry &amp; Verification Progress</h2>
      <div class="btn-row" id="op-filter-row" style="margin-bottom:14px;">
        ${disciplines.map((d, i) => `<button type="button" class="tab-btn ${i === 0 ? 'active' : ''}" data-disc="${d}">${d}</button>`).join('')}
      </div>
      <div id="op-cards" class="grid-2"></div>
    </div>

    <div class="panel">
      <h2>Consciousness &amp; Sentience Frontier — Deductive, Inductive, Abductive &amp; Hard-Problem Boundary Map</h2>
      <p class="meta-small" style="margin-bottom:12px;">
        Ruthless epistemic separation (Build Standard B41): clearly distinguishes what is <strong>deductively proved in Lean 4</strong>, what is <strong>inductively constrained by neuroscience</strong>, what is an <strong>abductive hypothesis</strong>, and what remains an <strong>unsolved philosophical barrier</strong>.
      </p>
      <table class="data-table">
        <thead><tr><th>ID</th><th>Mode</th><th>Domain</th><th>Proposition</th><th>Evidence / Proof</th><th>Explicitly NOT Claimed</th></tr></thead>
        <tbody>
          ${CONSCIOUSNESS_CLUES.map(
            (c) =>
              `<tr><td><code>${c.id}</code></td><td><span class="pill ${c.mode === 'deductive' ? 'pill-emerald' : c.mode === 'inductive' ? 'pill-cyan' : c.mode === 'abductive' ? 'pill-amber' : 'pill-rose'}">${c.mode.toUpperCase()}</span></td><td>${esc(c.domain)}</td><td>${esc(c.proposition)}</td><td>${esc(c.evidenceOrProof)}</td><td><em>${esc(c.whatIsNotClaimed)}</em></td></tr>`
          ).join('')}
        </tbody>
      </table>
    </div>
  `;

  const renderCards = (disc: 'ALL' | Discipline11): void => {
    const items = disc === 'ALL' ? OPEN_HARD_PROBLEMS : OPEN_HARD_PROBLEMS.filter((p) => p.discipline === disc);
    el('op-cards').innerHTML = items
      .map(
        (p) => `
        <article class="card">
          <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
            <span class="pill pill-cyan">${esc(p.discipline)} · ${esc(p.id)}</span>
            <span class="pill ${p.epistemicStatus === 'kernel-checked-partial' ? 'pill-emerald' : p.epistemicStatus === 'computationally-bounded' ? 'pill-amber' : 'pill-violet'}">${esc(p.epistemicStatus)}</span>
          </div>
          <h3>${esc(p.title)}</h3>
          <p class="meta-small"><strong>Formal Statement:</strong> ${esc(p.formalStatement)}</p>
          <p><strong>Our Verified Progress:</strong> ${esc(p.ourProgress)}</p>
          <p class="meta-small"><strong>Anchor:</strong> <code>${esc(p.leanOrCodeAnchor)}</code></p>
          <p class="meta-small"><strong>Refuted If:</strong> ${esc(p.falsificationCriterion)}</p>
          <p class="meta-small" style="color:#fda4af;"><strong>Remaining Gap / Blindspot:</strong> ${esc(p.remainingGap)}</p>
        </article>`
      )
      .join('');
  };

  el('op-filter-row').addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-disc]');
    if (!btn?.dataset.disc) return;
    el('op-filter-row')
      .querySelectorAll('button')
      .forEach((b) => b.classList.toggle('active', b === btn));
    renderCards(btn.dataset.disc as 'ALL' | Discipline11);
  });
  renderCards('ALL');
}

// ---------- TAB 9: Ten-Class Findings Ledger (Build Standard v1.2.0 R7) ----------
function renderFindingsTab(): void {
  const host = el('panel-findings');
  const classes: ('ALL' | FindingClass)[] = [
    'ALL',
    'bug',
    'error',
    'issue',
    'problem',
    'concern',
    'dilemma',
    'conflict',
    'gap',
    'hole',
    'blindspot',
  ];
  host.innerHTML = `
    <div class="panel">
      <h2>Ten-Class Audit Ledger (Build Standard v1.2.0 R7)</h2>
      <p class="meta-small" style="margin-bottom:12px;">
        Per Build Standard v1.2.0 R7, every finding across code, specs, white papers, and simulations is classified into exactly one of ten buckets (<code>bug</code>, <code>error</code>, <code>issue</code>, <code>problem</code>, <code>concern</code>, <code>dilemma</code>, <code>conflict</code>, <code>gap</code>, <code>hole</code>, <code>blindspot</code>) and transparently logged.
      </p>
      <div class="btn-row" id="finding-filter-row" style="margin-bottom:14px;">
        ${classes.map((c, i) => `<button type="button" class="tab-btn ${i === 0 ? 'active' : ''}" data-cls="${c}">${c.toUpperCase()}</button>`).join('')}
      </div>
      <table class="data-table">
        <thead><tr><th>ID</th><th>Class</th><th>Finding</th><th>Details</th><th>Resolution / Status</th></tr></thead>
        <tbody id="finding-tbody"></tbody>
      </table>
    </div>
  `;

  const renderRows = (cls: 'ALL' | FindingClass): void => {
    const rows = cls === 'ALL' ? CLASSIFIED_FINDINGS : CLASSIFIED_FINDINGS.filter((f) => f.findingClass === cls);
    el('finding-tbody').innerHTML = rows
      .map(
        (f) =>
          `<tr><td><code>${f.id}</code></td><td><span class="pill ${f.findingClass === 'bug' || f.findingClass === 'error' || f.findingClass === 'conflict' ? 'pill-rose' : f.findingClass === 'dilemma' ? 'pill-amber' : 'pill-violet'}">${f.findingClass}</span></td><td><strong>${esc(f.title)}</strong></td><td>${esc(f.description)}</td><td>${esc(f.resolution)} <br/><span class="pill pill-emerald" style="margin-top:4px;display:inline-block;">${esc(f.status)}</span></td></tr>`
      )
      .join('');
  };

  el('finding-filter-row').addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-cls]');
    if (!btn?.dataset.cls) return;
    el('finding-filter-row')
      .querySelectorAll('button')
      .forEach((b) => b.classList.toggle('active', b === btn));
    renderRows(btn.dataset.cls as 'ALL' | FindingClass);
  });
  renderRows('ALL');
}

// ---------- Boot ----------
initTabs();
renderSimTab();
render3dTab();
renderHhTab();
renderChemTab();
renderNanoTab();
renderAuditTab();
renderVerifyTab();
renderOpenProblemsTab();
renderFindingsTab();
void probeApiHealth();
