// 05_crisis.js — s078–s106: el viral, el señor Black, la cena, el paro cardíaco y la RCP.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, shake, text, FONTS, glow, alpha, shade, mix, rr, seg, circle, ring, poly, rng } from '/engine/core.js';
import { bigFace, POSES, walkPose } from '/engine/rig2d.js';
import { push, mcam, pick, wt, act, faceShot, tag, pop, panel, bigPhone, arm, ui, FX, UI } from './_lib.js';
import { street, car, kitchen, apartment, labcell, voidBg, ground } from '../sets/places.js';
import { SAM, MAMA, BLACK, EXTRA, fig } from '../cast.js';
import { photoFrame, lunar, ecg } from './01_gancho.js';
import { mama } from './04_mama.js';
import { heart } from './02_bueno_raro.js';

const CX = () => E.W / 2;
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const MEDIC = { top: 'jersey', color: '#2a7a9a', color2: '#ffffff', number: '+', head: 'none' };
const tint = (g, c, a) => { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = alpha(c, a); g.fillRect(0, 0, E.W, E.H); g.restore(); };

// s078 — "Un martes, todo se rompe."
registerShot('s078', { draw(g, t, info) {
  const tb = wt(info, 'rompe', 1.4); const [sx, sy] = t > tb ? shake(t, 14 * (1 - prog(t, tb, tb + 0.6)), 30) : [0, 0];
  g.save(); g.translate(sx, sy); voidBg(g, t, { z: 1 }, { glow: '#ff6a4a' });
  UI.bigLine(g, t, { str: 'UN MARTES', dur: info.dur + 0.4, y: E.H * 0.5, color: ui().cream, size: V(110, 96) });
  if (t > tb) { const k = ease.out(prog(t, tb, tb + 0.35)), r = rng(4); g.strokeStyle = 'rgba(255,240,230,.85)'; g.lineWidth = 3; for (let i = 0; i < 14; i++) { let x = E.W / 2, y = E.H / 2; const a = (i / 14) * Math.PI * 2 + r() * 0.3; g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 6; j++) { x += Math.cos(a + (r() - 0.5) * 0.8) * 140 * k; y += Math.sin(a + (r() - 0.5) * 0.8) * 140 * k; g.lineTo(x, y); } g.stroke(); } }
  g.restore();
} });
// s079 — alguien encuentra tu foto de 2001
registerShot('s079', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.55, 160, 130); const R = apartment(g, t, cam); const GY = R.GY, s = V(1.55, 1.6), x = CX() - V(100, 80);
  layer(g, cam, 1, g => { rr(g, x + 40, GY - 150, 420, 16, 6); g.fillStyle = '#1a1626'; g.fill(); seg(g, [[x + 420, GY - 140], [x + 420, GY]], 10, '#1a1626');
    poly(g, [[x + 150, GY - 152], [x + 300, GY - 152], [x + 320, GY - 160], [x + 140, GY - 160]], '#2a2a36'); poly(g, [[x + 300, GY - 158], [x + 320, GY - 158], [x + 352, GY - 300], [x + 332, GY - 300]], '#2a2a36'); glow(g, x + 330, GY - 230, 300, '#7fb8ff', 0.35); });
  act(g, t, info, cam, [{ who: { top: 'hoodie', color: '#5a5a6a', head: 'hood', headColor: '#4a4a5a' }, x, y: GY - 20, s, facing: 1, pose: { ...POSES.sit, eF: [30, -112], hF: [60, -100] }, expr: [[0, 'neutral'], [1.0, 'surprised']], look: [1, 0], seed: 2, shadow: false, rim: { color: '#9fd0ff', dir: [1, -0.2] } }], R.rim);
  const tp = wt(info, '2001', 1.4); const k = ease.outBack(prog(t, tp - 0.3, tp)); if (k > 0) { g.save(); g.translate(E.W * 0.74, E.H * 0.34); g.scale(k, k); g.rotate(0.05); photoFrame(g, -130, -150, 260, 300, '2001', { draw: (g, x, y, w, h) => { const r = w * 0.3; bigFace(g, x + w / 2, y + h * 0.58, r, { outfit: SAM, expr: 'happy', rimColor: '#fff3dc' }); lunar(g, x + w / 2, y + h * 0.58, r); } }); g.restore(); }
} });
// s080 — "La pone junto a una de ayer. Mismo lunar."
registerShot('s080', { draw(g, t, info) {
  backdrop(g, ['#0e1220', '#161c30']); glow(g, E.W / 2, E.H / 2, 900, '#7fb8ff', 0.12);
  const W = V(400, 360), H = V(480, 440), y = E.H * 0.17, sl = ease.out(prog(t, 0.1, 0.7));
  const xs = [E.W / 2 - W - 50, E.W / 2 + 50 + (1 - sl) * 600]; const tl = wt(info, 'lunar', 1.9);
  const pts = [];
  [['2001', '#6a7ab0', 'happy'], ['AYER', '#7a5a8a', 'smile']].forEach(([lab, bg, ex], i) => photoFrame(g, xs[i], y, W, H, lab, { bg, draw: (g, x, yy, w, h) => { const r = w * 0.3, cx = x + w / 2, cy = yy + h * 0.58; bigFace(g, cx, cy, r, { outfit: SAM, expr: ex, rimColor: '#fff3dc' }); lunar(g, cx, cy, r); pts.push([cx + r * 0.5, cy + r * 0.28]); } }));
  if (t > tl - 0.2) { const k = ease.outBack(prog(t, tl - 0.2, tl + 0.2)); pts.forEach(([px, py]) => { ring(g, px, py, 40 * k, 5, ui().accent); glow(g, px, py, 80, ui().accent, 0.4 * k); }); }
  pop(g, t, 'MISMO LUNAR', E.W / 2, E.H * 0.88, tl, { size: V(64, 64), color: ui().accent });
} });
// s081 — viral en una noche
registerShot('s081', { draw(g, t, info) {
  blurLayer(g, 16, g => apartment(g, t, { z: 1.5, x: -200, y: -120 })); veil(g, '#0c0810', 0.45);
  const n = lerp(1200, 48000000, ease.in(prog(t, 0.3, info.dur - 0.3)));
  bigPhone(g, t, E.W / 2, E.H * 0.55, V(780, 900), { draw: (g, x, y, w, h) => {
    g.fillStyle = '#6a7ab0'; g.fillRect(x + 16, y + 20, w - 32, w - 32); const r = (w - 32) * 0.28; bigFace(g, x + w / 2, y + 20 + (w - 32) * 0.58, r, { outfit: SAM, expr: 'happy', rimColor: '#fff3dc' }); lunar(g, x + w / 2, y + 20 + (w - 32) * 0.58, r);
    text(g, fmt(n), x + w / 2, y + w + 40, { size: 44, color: '#fff', font: FONTS.ui, weight: 900 }); text(g, 'VISTAS', x + w / 2, y + w + 84, { size: 20, color: '#8fa6c8', font: FONTS.ui, weight: 900, spacing: 3 });
    for (let i = 0; i < 4; i++) { const k = ease.out(prog(t, 0.6 + i * 0.6, 0.9 + i * 0.6)); if (k <= 0) continue; rr(g, x + 16, y + w + 120 + i * 50 - (1 - k) * 20, w - 32, 42, 12); g.fillStyle = alpha('#2a3550', k); g.fill(); text(g, ['🔔 Nuevo seguidor', '¿Es la misma persona?', '¡No envejece!', 'Tendencia #1'][i].replace('🔔 ', ''), x + 30, y + w + 141 + i * 50, { size: 18, color: '#dfe8ff', font: FONTS.ui, weight: 800, align: 'left', alpha: k }); }
  } });
  for (let i = 0; i < 14; i++) { const k = ((t * 0.7 + i / 14) % 1), x = E.W / 2 + V(260, 200) + Math.sin(i * 2.1 + t) * 80, y = E.H * 0.8 - k * E.H * 0.7; heart(g, x, y, 18 + (i % 3) * 6, alpha(ui().accent, (1 - k) * 0.9)); }
  pop(g, t, 'VIRAL', E.W * 0.2, E.H * 0.3, 1.0, { size: V(96, 90), color: ui().accent });
} });
// s082 — 3D: un auto negro se detiene frente a tu casa
registerShot('s082', { kind: '3d',
  init(T) {
    const M = mood('storm'); const st = T.stage({ mood: 'storm', fov: V(34, 50), fog: [14, 60], keyPos: [6, 9, 8], keyIntensity: 2.0, ambient: 1.4, sky: ['#5a6488', '#9aa0b8'] });
    st.add(T.ground(120, 60, '#3a3a48', T.tiles('#3a3a48', 8, [16, 8])));
    st.add(T.box(120, 0.12, 2.4, '#5a5a66', 0, 0.06, -3.4));
    const cols = ['#5a3a4a', '#4a3a5a', '#5a4a3a', '#3a4a5a'];
    for (let i = -4; i <= 4; i++) { const c = cols[(i + 8) % 4], x = i * 7; st.add(T.box(6, 4.2, 5, c, x, 2.1, -8)); const roof = T.cone(4.6, 1.8, shade(c, -0.3), x, 5.1, -8, 4); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.8); st.add(roof);
      for (const wx of [-1.6, 1.6]) { const w = T.windowPane(1.3, 1.4, { glowColor: M.practical, cols: 2, rows: 2, power: 0.7 }); w.position.set(x + wx, 2.7, -5.48); st.add(w); }
      st.add(T.box(1.2, 2.2, 0.1, shade(c, -0.4), x, 1.1, -5.46)); }
    st.add(T.tree3D(-10, -4.6, 1.1, '#2a2a30'), T.tree3D(12, -4.6, 1.2, '#2a2a30'));
    const carG = new T.THREE.Group(); const body = T.box(4.4, 0.9, 1.9, '#121016', 0, 0.75, 0); const cab = T.box(2.4, 0.75, 1.7, '#121016', -0.2, 1.55, 0);
    const glass = T.box(2.42, 0.55, 1.72, T.mat('#2a3048', { roughness: 0.2, metalness: 0.6 }), -0.2, 1.58, 0); carG.add(body, cab, glass);
    for (const [wx, wz] of [[-1.4, 0.95], [1.4, 0.95], [-1.4, -0.95], [1.4, -0.95]]) { const w = T.cyl(0.42, 0.42, 0.3, '#08080c', wx, 0.42, wz); w.rotation.x = Math.PI / 2; carG.add(w); }
    for (const z of [-0.6, 0.6]) { carG.add(T.box(0.06, 0.18, 0.4, T.basic('#fff4d0'), 2.2, 0.9, z)); carG.add(T.box(0.06, 0.16, 0.36, T.basic('#ff3a2a'), -2.2, 0.9, z)); }
    st.add(carG); const sam = T.figure3D(SAM, { rim: M.rim }); sam.position.set(0, 0, -5.0); sam.rotation.y = -Math.PI / 2; st.add(sam);
    return { stage: st, carG, sam };
  },
  draw(s, t, info, T) {
    const stop = 2.6, x = t < stop ? lerp(-26, 0.8, ease.out(t / stop)) : 0.8; s.carG.position.set(x, 0, -1.6);
    T.dolly(s.stage.camera, t, [[0, { pos: [-9, 2.2, 9], look: [-4, 1.2, -2] }], [info.dur, { pos: [-3, 1.8, 8], look: [0.5, 1.2, -2.5] }]]);
  },
  overlay(g, t, info) { UI.badge(g, { str: 'AL DÍA SIGUIENTE', a: ease.out(prog(t, 0.2, 0.6)) * clamp((1.8 - t) / 0.3), size: V(40, 44), color: ui().cream }); },
});
// --- Black en tu puerta ---
function doorScene(g, t, info, o) {
  const cam = mcam(t, info.dur, o.z ?? 1.5, o.x0 ?? 0, o.x1 ?? -30); const R = street(g, t, cam, { mood: 'morning', doorOpen: 0.8, fence: false }); const GY = R.GY, s = V(1.6, 1.7);
  layer(g, cam, 1, g => car(g, CX() - V(900, 600), GY + 10, 1.4, { lights: false }));
  act(g, t, info, cam, o.list(GY, s), { color: '#dfe6ff', dir: [0.6, -0.8] });
  return { GY, s, cam };
}
registerShot('s083', { draw(g, t, info) {
  const te = wt(info, 'Eterna', 1.6);
  const D = doorScene(g, t, info, { list: (GY, s) => [
    { who: BLACK, x: CX() - V(240, 170), y: GY, s, facing: 1, pose: [[0, 'stand'], [te - 0.3, 'holdFront']], prop: t > te - 0.3 ? 'paper' : null, expr: 'smirk', talk: true, seed: 5 },
    { who: SAM, x: CX() + V(10, 0), y: GY, s, facing: -1, pose: 'stand', expr: [[0, 'neutral'], [te, 'worried']], seed: 1 },
  ] });
  pop(g, t, 'ETERNA', E.W * 0.26, E.H * 0.22, te, { size: V(80, 80), color: ui().cream, spacing: 10 });
} });
registerShot('s084', { draw(g, t, info) { faceShot(g, t, info, { set: street, setOpts: { mood: 'morning', fence: false }, who: BLACK, expr: 'smirk', talk: true, side: 1, bgX: 200, veil: 0.55, rimColor: '#ff9a7a', after: (g, cx, cy, r) => { g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = g.createLinearGradient(cx - r, 0, cx + r, 0); const gr = g.createLinearGradient(cx - r * 1.2, 0, cx + r * 0.6, 0); gr.addColorStop(0, 'rgba(0,0,0,.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(cx - r * 1.6, cy - r * 1.6, r * 3.2, r * 3.4); g.restore(); } }); } });
// s085 — el contrato con nueve ceros
registerShot('s085', { draw(g, t, info) {
  blurLayer(g, 16, g => street(g, t, { z: 1.7, x: -100, y: -100 }, { mood: 'morning' })); veil(g, '#0c0810', 0.5);
  const cx = E.W / 2, cy = E.H * 0.55, w = V(900, 760), h = V(620, 700); g.save(); g.translate(cx, cy); g.rotate(-0.03 + 0.01 * Math.sin(t)); g.translate(-cx, -cy);
  rr(g, cx - w / 2 - 5, cy - h / 2 - 5, w + 10, h + 10, 12); g.fillStyle = '#ff9a7a'; g.fill(); rr(g, cx - w / 2, cy - h / 2, w, h, 10); g.fillStyle = '#f2ece0'; g.fill();
  text(g, 'CONTRATO · ETERNA', cx, cy - h / 2 + 70, { size: 44, color: '#1a1622', font: FONTS.ui, weight: 900, spacing: 6 });
  for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(30,30,40,.18)'; g.fillRect(cx - w / 2 + 60, cy - h / 2 + 130 + i * 30, w - 120 - (i % 2) * 120, 10); }
  const z = Math.min(9, Math.floor(prog(t, wt(info, 'cifra', 0.6), wt(info, 'ceros', 1.9)) * 9.99)); const str = '$' + fmt(Math.pow(10, z));
  text(g, str, cx, cy + 40, { size: V(110, 90), color: '#1a7a4a', font: FONTS.ui, weight: 900 });
  seg(g, [[cx - w / 2 + 80, cy + h / 2 - 90], [cx + 40, cy + h / 2 - 90]], 3, '#1a1622'); text(g, 'FIRMA', cx - w / 2 + 80, cy + h / 2 - 60, { size: 22, color: '#5a5a6a', font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
  g.restore();
  if (z >= 9) pop(g, t, '9 CEROS', E.W * 0.82, E.H * 0.24, wt(info, 'ceros', 1.9), { size: V(60, 60) });
} });
// s086 — vivir en su laboratorio, sin fecha de salida
registerShot('s086', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.35, 0, -20); const R = labcell(g, t, cam); const GY = R.GY, s = V(1.5, 1.6);
  act(g, t, info, cam, [{ who: SAM, x: CX(), y: GY - 40, s, facing: 1, pose: { ...POSES.sit, head: [16, -170], sh: [8, -142] }, expr: 'sad', seed: 1, shadow: false }], R.rim);
  layer(g, cam, 1, g => { const bw = 520, bh = 560; g.fillStyle = 'rgba(160,230,255,.08)'; g.fillRect(CX() - bw / 2, GY - bh, bw, bh); g.strokeStyle = 'rgba(180,240,255,.6)'; g.lineWidth = 6; g.strokeRect(CX() - bw / 2, GY - bh, bw, bh); seg(g, [[CX() - bw / 2 + 40, GY - bh + 30], [CX() - bw / 2 + 120, GY - bh + 160]], 4, 'rgba(255,255,255,.35)'); g.fillStyle = '#9a9aaa'; g.fillRect(CX() - 60, GY - 70, 120, 30); });
  const ts = wt(info, 'Sin', 1.9); const k = ease.outBack(prog(t, ts, ts + 0.3)); if (k > 0) { g.save(); g.translate(E.W * 0.78, E.H * 0.32); g.scale(k, k); rr(g, -190, -46, 380, 92, 12); g.fillStyle = '#0a1a1a'; g.fill(); g.strokeStyle = '#ff5a4a'; g.lineWidth = 4; g.stroke(); text(g, 'SALIDA: ——', 0, 2, { size: 44, color: '#ff6a5a', font: FONTS.ui, weight: 900, glow: 16, glowColor: 'rgba(255,80,60,.6)' }); g.restore(); }
} });
// s087 — "Y si no firmas... ¿Si no firmo?"
registerShot('s087', { draw(g, t, info) {
  const tb = wt(info, '¿Si', 1.5); doorScene(g, t, info, { z: 1.6, x0: -60, x1: -80, list: (GY, s) => [
    { who: BLACK, x: CX() - V(240, 170), y: GY, s, facing: 1, pose: 'holdFront', prop: { type: 'pointer' }, expr: 'smirk', talk: [0, tb - 0.1], seed: 5 },
    { who: SAM, x: CX() + V(10, 0), y: GY, s, facing: -1, pose: [[0, 'stand'], [tb, 'crossArms']], expr: [[0, 'worried'], [tb, 'determined']], talk: [tb, info.dur], seed: 1 },
  ] });
} });
// s088 — el nombre a cada periodista del mundo
registerShot('s088', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), acc = ui().accent, cx = E.W / 2, cy = E.H * 0.5, R = V(330, 360);
  ring(g, cx, cy, R, 4, alpha(c, 0.9)); const rot = t * 0.4;
  for (let i = -2; i <= 2; i++) { g.strokeStyle = alpha(c, 0.4); g.lineWidth = 2; g.beginPath(); g.ellipse(cx, cy, R * Math.abs(Math.cos(rot + i * 0.6)), R, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(cx, cy + i * R * 0.35, R * Math.sqrt(1 - (i * 0.35) ** 2), 6, 0, 0, 7); g.stroke(); }
  const r = rng(7); const n = Math.floor(lerp(0, 40, ease.in(prog(t, 0.3, info.dur - 0.2)))); for (let i = 0; i < 40; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * R * 0.9; if (i >= n) continue; const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; circle(g, x, y, 7, acc); glow(g, x, y, 40, acc, 0.5); }
  for (let i = 0; i < 6; i++) { const k = ((t * 0.8 + i / 6) % 1); if (t > 0.6) glow(g, cx + Math.cos(i * 1.1) * R * 1.3, cy + Math.sin(i * 1.7) * R * 0.8, 140 * (1 - k), '#ffffff', 0.5 * (1 - k)); }
  UI.readout(g, { label: 'PERIODISTAS', value: fmt(n * 1250), x: cx, y: E.H * V(0.92, 0.88), align: 'center', color: acc, a: ease.out(prog(t, 0.3, 0.7)) });
} });
// s089 — "Tienes hasta mañana a las ocho."
registerShot('s089', { draw(g, t, info) {
  doorScene(g, t, info, { z: 1.3, x0: -200, x1: -240, list: (GY, s) => [
    { who: BLACK, x: CX() - V(260, 180) - t * 140, y: GY, s: s * 0.9, facing: -1, pose: walkPose(t * 5), expr: 'smirk', talk: [0, 1.2], still: true },
    { who: SAM, x: CX() + V(10, 0), y: GY, s: s * 0.9, facing: -1, pose: 'stand', expr: 'worried', seed: 1 },
  ] });
  FX.clock(g, E.W * 0.8, E.H * 0.3, V(90, 100), 8 * 3600, { face: '#f2efe8', speed: 0 }); pop(g, t, 'MAÑANA · 08:00', E.W * 0.8, E.H * 0.3 + V(140, 150), 0.4, { size: V(46, 50), color: ui().accent });
} });
// --- la cena ---
const lieY = (GY, s) => GY + 100 * s - 26;
function dinner(g, t, info, o) {
  const cam = o.cam || mcam(t, info.dur, 1.5, -40, -60); const R = kitchen(g, t, cam, { night: true, table: true }); const GY = R.GY, s = V(1.55, 1.6);
  layer(g, cam, 1, g => { for (const [x, f] of [[CX() - V(330, 240), 1], [CX() + V(210, 150), -1]]) { g.save(); g.translate(x, 0); g.scale(f, 1); FX.chair(g, -18 * s, GY, s, '#24181e'); g.restore(); } });
  return { R, GY, s, cam };
}
registerShot('s090', { draw(g, t, info) {
  const D = dinner(g, t, info, {}); const { GY, s, cam, R } = D; const tr = wt(info, 'ríe', 2.0);
  act(g, t, info, cam, [{ who: SAM, x: CX() - V(330, 240), y: GY - 20, s, facing: 1, pose: [[0, { ...POSES.sit, eF: [24, -120], hF: [44, -110] }], [1.4, { ...POSES.sit, eF: [28, -134], hF: [50, -150] }]], expr: [[0, 'smile'], [tr, 'happy']], talk: [1.2, tr], seed: 1, shadow: false }], R.rim);
  const laugh = t > tr ? Math.sin(t * 16) * 4 : 0;
  layer(g, cam, 1, g => mama(g, { x: CX() + V(210, 150), y: GY - 20, s: s * 0.95, facing: -1, outfit: MAMA, pose: { ...POSES.sit, head: [10 + laugh, -178 + Math.abs(laugh)], eF: [24, -120], hF: [44, -112] }, expr: t > tr ? 'joy' : 'smile', rim: R.rim, cane: false, shadow: false }));
} });
registerShot('s091', { draw(g, t, info) {
  const tq = wt(info, 'quieta', 1.7) - 0.3;
  faceShot(g, t, info, { set: kitchen, setOpts: { night: true }, who: MAMA, expr: [[0, 'joy'], [0.6, 'smile'], [tq, 'neutral']], face: t > tq ? { eyes: 'dot', mouth: 'smallFlat' } : undefined, noBlink: t > tq, look: t > tq ? [0, 0.3] : undefined, side: -1, bgX: 200, zoom: 0.08, drift: t > tq ? 0 : 20, veil: lerp(0.38, 0.6, prog(t, tq, info.dur)) });
} });
// s092 — la cuchara cae (cámara lenta)
function spoon(g, x, y, s, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); seg(g, [[-120, 0], [40, 0]], 14, '#cfd4e0'); g.fillStyle = '#e8ecf4'; g.beginPath(); g.ellipse(80, 0, 52, 34, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(70, -10, 20, 8, 0, 0, 7); g.fill(); g.restore(); }
registerShot('s092', { draw(g, t, info) {
  blurLayer(g, 14, g => kitchen(g, 0, { z: 1.8, x: -150, y: -60 }, { night: true, table: true })); veil(g, '#0c0810', 0.4);
  const cam = { z: 1 + 0.03 * t, r: -0.03 + 0.02 * t }; layer(g, cam, 1, g => { spoon(g, E.W / 2, E.H * 0.4 + t * 60, V(2.6, 2.4), 0.5 + t * 0.35); FX.drops(g, t, { count: 40, color: '#fff2e0', rMax: 8, drift: 2 }); FX.rings(g, E.W / 2, E.H * 0.42, t, { count: 3, r0: 140, r1: 520, speed: 0.35, color: '#e8f0ff', a: 0.3 }); });
  tint(g, 'rgba(80,120,255,1)', 0.35); UI.badge(g, { str: '×0.1', a: ease.out(prog(t, 0.2, 0.5)) });
} });
// s093 — su cuerpo se va hacia un lado; Sam se lanza
registerShot('s093', { draw(g, t, info) {
  const D = dinner(g, t, info, { cam: mcam(t, info.dur, 1.5, -20, -30) }); const { GY, s, cam, R } = D; const k = ease.in(prog(t, 0, 1.2));
  layer(g, cam, 1, g => mama(g, { x: CX() + V(210, 150), y: GY - 20, s: s * 0.95, facing: -1, outfit: MAMA, pose: POSES.sit, rot: -0.9 * k, expr: 'sleepy', rim: R.rim, cane: false, shadow: false }));
  const jx = lerp(CX() - V(330, 240), CX() - V(40, 20), ease.out(prog(t, 0.4, 1.2)));
  act(g, t, info, cam, [{ who: SAM, x: jx, y: GY - (t > 0.4 && t < 1.2 ? 30 : 0), s, facing: 1, pose: [[0, 'sit'], [0.4, 'reach'], [1.2, 'kneel']], expr: 'shocked', seed: 1 }], R.rim);
  if (t > 0.4 && t < 0.6) g.translate(...shake(t, 8, 30));
} });
// s094 — no respira: paro cardíaco
registerShot('s094', { draw(g, t, info) {
  backdrop(g, ['#070810', '#0c1020']); g.strokeStyle = alpha('#ff6f61', 0.07); g.lineWidth = 1; for (let x = 0; x < E.W; x += 48) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } for (let y = 0; y < E.H; y += 48) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); }
  ecg(g, t + 1.5, { flatAt: 0.2, color: ui().accent, y: E.H * 0.6 });
  pop(g, t, 'PARO CARDÍACO', E.W / 2, E.H * 0.3, wt(info, 'Paro', 0.9), { size: V(100, 84), color: ui().accent });
} });
// --- en el piso: RCP ---
const KNEEL_P = (b) => ({ ...POSES.kneel, sh: [26, -132 + b * 10], head: [38, -162 + b * 12], eF: [40, -96 + b * 6], hF: [46, -56], eB: [36, -96 + b * 6], hB: [42, -56] });
function floorScene(g, t, info, o = {}) {
  const cam = o.cam || mcam(t, info.dur, 1.6, -40, -60, 0.9); const R = kitchen(g, t, cam, { night: true }); const GY = R.GY, s = V(1.5, 1.55);
  const mx = CX() - V(20, 10); layer(g, cam, 1, g => mama(g, { x: mx, y: lieY(GY, s), s: s * 0.95, facing: 1, outfit: MAMA, pose: POSES.lie, rot: Math.PI / 2, expr: o.momExpr || 'sleepy', rim: R.rim, cane: false, shadow: false }));
  return { R, GY, s, cam, mx };
}
registerShot('s095', { draw(g, t, info) {
  const F = floorScene(g, t, info); const { GY, s, cam, R, mx } = F;
  act(g, t, info, cam, [{ who: SAM, x: mx - V(130, 100), y: GY, s, facing: 1, pose: { ...POSES.kneel, eF: [20, -138], hF: [28, -166] }, prop: 'phone', expr: 'scared', talk: [0.1, 1.4], seed: 1 }], R.rim);
  const tO = wt(info, 'Ocho', 2.3); UI.readout(g, { label: 'EMERGENCIAS', value: 'LLAMANDO…', x: V(120, 80), y: E.H * 0.2, color: ui().cream, a: ease.out(prog(t, 0.2, 0.5)) * clamp((tO - t) / 0.2 + 0.0001) });
  pop(g, t, 'AMBULANCIA: 8 MIN', E.W * 0.7, E.H * 0.22, tO, { size: V(64, 56), color: ui().accent });
} });
registerShot('s096', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), acc = ui().accent, gold = ui().gold;
  const mins = clamp((t - 0.4) / (info.dur - 1.0)) * 5, m = Math.floor(mins), pct = Math.max(50, 100 - mins * 10);
  const x0 = V(260, 120), x1 = E.W - V(260, 120), y = E.H * 0.5;
  text(g, 'PROBABILIDAD DE SOBREVIVIR', x0, y - V(120, 140), { size: V(40, 40), color: alpha(c, 0.95), font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
  rr(g, x0, y - 40, x1 - x0, 80, 40); g.fillStyle = alpha(c, 0.12); g.fill(); const w = (x1 - x0) * pct / 100; rr(g, x0, y - 40, w, 80, 40); g.fillStyle = mix(ui().good, acc, (100 - pct) / 50); g.fill(); glow(g, x0 + w, y, 90, acc, 0.5);
  text(g, Math.round(pct) + ' %', x0 + w - 30, y + 2, { size: V(52, 52), color: '#0b1324', font: FONTS.ui, weight: 900, align: 'right' });
  for (let k = 0; k <= 5; k++) { const xx = x0 + (x1 - x0) * (1 - k * 0.1); seg(g, [[xx, y + 56], [xx, y + 74]], 3, alpha(c, 0.6)); }
  UI.readout(g, { label: 'SIN AYUDA', value: '0' + m + ':00 MIN', x: x0, y: E.H * V(0.75, 0.7), a: ease.out(prog(t, 0.2, 0.5)) });
  pop(g, t, '−10 % POR MINUTO', x1, E.H * V(0.76, 0.72), wt(info, 'diez', 3.6), { size: V(54, 50), color: acc, spacing: 1 });
} });
registerShot('s097', { draw(g, t, info) {
  blurLayer(g, 12, g => kitchen(g, t, { z: 2.0, x: -100, y: 120 }, { night: true })); veil(g, '#0c0810', 0.35);
  const cx = E.W / 2, cy = E.H * 0.6; g.fillStyle = '#f29ac0'; g.beginPath(); g.ellipse(cx, cy + 60, V(520, 440), 240, 0, 0, 7); g.fill(); g.fillStyle = shade('#f29ac0', -0.15); g.fillRect(cx - 520, cy + 100, 1040, 200);
  const press = Math.max(0, Math.sin(t * Math.PI * 2 * 1.8)) * 18 * prog(t, 0.6, 0.9);
  arm(g, [cx - 120, -200], [cx - 10, cy - 20 + press], { sleeve: SAM.color, rim: '#ffcf8f', w: 70 }); arm(g, [cx + 140, -200], [cx + 20, cy - 34 + press], { sleeve: shade(SAM.color, -0.15), rim: '#ffcf8f', w: 66 });
  if (t > 0.6) FX.rings(g, cx, cy, t, { count: 2, r0: 60, r1: 200, color: '#fff3e0', a: 0.35, speed: 1.8 });
  UI.callout(g, t, { at: [cx + 10, cy - 30], to: [cx + V(360, 260), cy - V(260, 300)], str: 'CENTRO DEL PECHO', start: 0.4, color: ui().gold, size: V(40, 40) });
} });
registerShot('s098', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = ui().gold, cx = E.W / 2, y = E.H * 0.62;
  const press = Math.max(0, Math.sin(t * Math.PI * 2 * 1.0)) * 50;
  g.strokeStyle = c; g.lineWidth = 6; g.beginPath(); g.moveTo(cx - 500, y + 120); g.lineTo(cx + 500, y + 120); g.stroke();
  g.beginPath(); g.moveTo(cx - 360, y + 110); g.bezierCurveTo(cx - 200, y - 60 + press * 0.8, cx + 200, y - 60 + press * 0.8, cx + 360, y + 110); g.stroke();
  ring(g, cx + 420, y + 60, 50, 6, c);
  const hy = y - 80 + press; seg(g, [[cx - 40, hy - 360], [cx - 10, hy - 40]], 10, c); seg(g, [[cx + 40, hy - 360], [cx + 10, hy - 40]], 10, c); rr(g, cx - 60, hy - 50, 120, 44, 20); g.strokeStyle = c; g.lineWidth = 6; g.stroke();
  for (const d of [-1, 1]) poly(g, [[cx + d * 160 - 16, y - 180 + press * 0.4], [cx + d * 160 + 16, y - 180 + press * 0.4], [cx + d * 160, y - 150 + press * 0.4]], gold);
  UI.dimension(g, t, { x1: cx + 220, y1: y - 60, x2: cx + 220, y2: y - 10, str: '5 CM', start: wt(info, 'Cinco', 0.2) });
  pop(g, t, '5 CM DE PROFUNDIDAD', E.W / 2, E.H * 0.16, wt(info, 'Cinco', 0.2) + 0.3, { size: V(60, 56) });
} });
registerShot('s099', { draw(g, t, info) {
  UI.blueprint(g); const acc = ui().accent, gold = ui().gold, cx = E.W * V(0.3, 0.5), cy = E.H * V(0.52, 0.35);
  const bpm = 110, ph = (t * bpm / 60) % 1, beat = Math.pow(1 - ph, 6); heart(g, cx, cy, V(140, 140) * (1 + 0.15 * beat), acc); glow(g, cx, cy, 300, acc, 0.2 + 0.4 * beat);
  const ta = wt(info, 'cien', 0.3); pop(g, t, '100–120', E.W * V(0.66, 0.5), E.H * V(0.45, 0.66), ta, { size: V(130, 120) }); pop(g, t, 'COMPRESIONES POR MINUTO', E.W * V(0.66, 0.5), E.H * V(0.58, 0.75), ta + 0.4, { size: V(36, 36), color: ui().cream });
  UI.meter(g, t, { x: V(260, 120), y: E.H * V(0.82, 0.88), w: E.W - V(520, 240), label: 'RITMO', start: 0.2, speed: 0.6 });
} });
registerShot('s100', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), acc = ui().accent, x = E.W * V(0.32, 0.5), y = E.H * V(0.78, 0.62);
  const tired = ease.inOut(prog(t, 0.6, info.dur - 0.4)); const b = Math.max(0, Math.sin(t * Math.PI * 2 * 1.8 * (1 - tired * 0.7)));
  UI.lineFigure(g, { x, y, s: 2, pose: { ...KNEEL_P(b), head: [38 + tired * 10, -162 + b * 12 + tired * 26] }, color: c });
  const bx = E.W * V(0.58, 0.15), bw = V(560, 760), by = E.H * V(0.4, 0.82); text(g, 'ENERGÍA · PERSONA NORMAL', bx, by - 50, { size: V(30, 32), color: alpha(c, 0.9), font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  rr(g, bx, by - 24, bw, 48, 24); g.fillStyle = alpha(c, 0.12); g.fill(); rr(g, bx, by - 24, Math.max(48, bw * (1 - tired)), 48, 24); g.fillStyle = mix(ui().good, acc, tired); g.fill();
  pop(g, t, '2 MIN', bx + bw * 0.5, by + 90, wt(info, 'dos', 2.2), { size: V(80, 80), color: acc });
} });
registerShot('s101', { draw(g, t, info) { faceShot(g, t, info, { set: kitchen, setOpts: { night: true }, who: SAM, expr: 'determined', side: -1, bgX: -100, dy: Math.abs(Math.sin(t * Math.PI * 1.8)) * 24, face: { sweat: true }, after: (g, cx, cy, r) => pop(g, t, '20', cx + r * 1.6, cy - r * 0.6, wt(info, 'veinte', 1.6), { size: 90 }) }); } });
registerShot('s102', { draw(g, t, info) {
  const F = floorScene(g, t, info, { cam: mcam(t, info.dur, 1.9, -60, -70, 0.9) }); const { GY, s, cam, R, mx } = F; const b = Math.max(0, Math.sin(t * Math.PI * 2 * 1.85));
  act(g, t, info, cam, [{ who: SAM, x: mx - V(70, 60), y: GY, s, facing: 1, pose: KNEEL_P(b), expr: 'determined', still: true, face: { sweat: true } }], R.rim);
  ['Uno', 'Dos', 'Tres', 'Cuatro'].forEach((w, i) => { const tw = wt(info, w, 0.15 + i * 0.9); pop(g, t, String(i + 1), E.W * (0.25 + i * 0.17), E.H * 0.24, tw, { size: V(130, 120), end: tw + 0.8 }); });
} });
registerShot('s103', { draw(g, t, info) {
  blurLayer(g, 10, g => { const F = floorScene(g, t, info, { cam: mcam(t, info.dur, 1.7, -60, -70, 0.9) }); const b = Math.max(0, Math.sin(t * Math.PI * 2 * 1.85)); layer(g, F.cam, 1, g => fig(g, { x: F.mx - V(70, 60), y: F.GY, s: F.s, facing: 1, outfit: SAM, pose: KNEEL_P(b), expr: 'determined', rim: F.R.rim })); }); veil(g, '#0c0810', 0.45);
  const sec = 7 * 60 + Math.floor(t * 3); text(g, '0' + Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'), E.W / 2, E.H * 0.5, { size: V(220, 200), color: ui().gold, font: FONTS.ui, weight: 900, glow: 40, glowColor: alpha(ui().gold, 0.6) });
  text(g, 'MINUTO SIETE', E.W / 2, E.H * 0.72, { size: V(44, 44), color: ui().cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.2, 0.5)) });
} });
registerShot('s104', { draw(g, t, info) {
  const cam = { z: 2.2 + 0.1 * t, x: -V(560, 340) + 20, y: -V(300, 400) };
  kitchen(g, t, cam, { night: true }); const on = Math.sin(t * 14) > 0;
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.45, E.H * 0.45, 900, on ? '#ff2a2a' : '#2a5aff', 0.55); g.restore();
  tint(g, on ? '#ff3030' : '#3060ff', 0.3);
} });
registerShot('s105', { draw(g, t, info) {
  const F = floorScene(g, t, info, { cam: mcam(t, info.dur, 1.45, -20, -40) }); const { GY, s, cam, R, mx } = F; const b = Math.max(0, Math.sin(t * Math.PI * 2 * 1.85));
  act(g, t, info, cam, [
    { who: MEDIC, x: mx - V(80, 60), y: GY, s, facing: 1, pose: KNEEL_P(b), expr: 'determined', still: true },
    { who: { ...MEDIC, color: '#2a6a8a' }, x: mx + V(300, 220), y: GY, s, facing: -1, pose: 'kneel', expr: 'neutral', seed: 4 },
    { who: SAM, x: mx - V(420, 300), y: GY, s, facing: 1, pose: { ...POSES.sitBack, head: [-14, -168] }, expr: 'sleepy', seed: 1, face: { sweat: true } },
  ], R.rim);
  const on = Math.sin(t * 14) > 0; g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.1, E.H * 0.3, 700, on ? '#ff2a2a' : '#2a5aff', 0.25); g.restore();
} });
registerShot('s106', { draw(g, t, info) {
  backdrop(g, ['#070810', '#0c1020']); g.strokeStyle = alpha('#5fd39a', 0.08); g.lineWidth = 1; for (let x = 0; x < E.W; x += 48) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } for (let y = 0; y < E.H; y += 48) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); }
  const tv = wt(info, 'Vuelve', 0.7), tp = wt(info, 'pero', 3.1);
  ecg(g, t, { flatAt: -10, revive: tv - 0.2, weakUntil: tp, color: '#5fd39a', y: E.H * 0.58 });
  pop(g, t, '¿SU CORAZÓN?', E.W / 2, E.H * 0.24, 0.05, { size: V(70, 64), color: ui().cream, end: tv });
  pop(g, t, 'VUELVE', E.W / 2, E.H * 0.24, tv, { size: V(96, 90), color: ui().good });
} });
