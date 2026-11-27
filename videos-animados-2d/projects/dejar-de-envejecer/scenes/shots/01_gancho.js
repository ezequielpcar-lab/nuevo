// 01_gancho.js — s001–s023: el portero, Sam, Leo, el cuerpo de 20 y la tarjeta de título.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, key, shake, text, FONTS, glow, alpha, shade, mix, rr, seg, circle, ring, poly } from '/engine/core.js';
import { bigFace, POSES, posesAt, walkPose } from '/engine/rig2d.js';
import { push, mcam, pick, wt, act, faceShot, tag, pop, panel, arm, ui, FX, UI } from './_lib.js';
import { bar, street, apartment, voidBg, ground } from '../sets/places.js';
import { SAM, LEO, PORTERO, EXTRA, fig } from '../cast.js';

const CX = () => E.W / 2;
const holdCard = { ...POSES.holdFront, eF: [24, -140], hF: [46, -150] };
// tarjeta de identificación / carnet (x,y = centro)
export function idCard(g, x, y, w, o = {}) {
  const h = w * 0.62; g.save(); g.translate(x, y); g.rotate(o.rot || 0);
  rr(g, -w / 2 - 4, -h / 2 - 4, w + 8, h + 8, 18); g.fillStyle = o.rimC || '#ffc68a'; g.fill();
  rr(g, -w / 2, -h / 2, w, h, 16); g.fillStyle = o.bg || '#e8e2d6'; g.fill();
  g.fillStyle = o.band || '#3a6ea5'; g.fillRect(-w / 2, -h / 2, w, h * 0.2); text(g, o.title || 'IDENTIFICACIÓN', 0, -h / 2 + h * 0.1, { size: w * 0.055, color: '#fff', font: FONTS.ui, weight: 900, spacing: 3 });
  const px = -w / 2 + w * 0.07, py = -h / 2 + h * 0.28, pw = w * 0.3, ph = h * 0.62;
  rr(g, px, py, pw, ph, 10); g.fillStyle = '#9ab0c8'; g.fill(); g.save(); rr(g, px, py, pw, ph, 10); g.clip();
  bigFace(g, px + pw / 2, py + ph * 0.55, pw * 0.36, { outfit: SAM, expr: 'smile', rimColor: '#ffffff', rimSide: -1 }); circle(g, px + pw / 2 + pw * 0.2, py + ph * 0.66, pw * 0.025, '#3a2a2a'); g.restore();
  const tx = -w / 2 + w * 0.43; const lines = o.lines || [['NOMBRE', 'SAM'], ['NACIMIENTO', '14 · 03 · 1981']];
  lines.forEach(([a, b], i) => { text(g, a, tx, -h * 0.12 + i * h * 0.3, { size: w * 0.04, color: '#6a6a7a', font: FONTS.ui, weight: 900, align: 'left', spacing: 2 }); text(g, b, tx, -h * 0.12 + i * h * 0.3 + w * 0.06, { size: w * 0.075, color: '#1a1622', font: FONTS.ui, weight: 900, align: 'left' }); });
  g.restore();
}
export function smallCard(g, hand, s = 1) { g.save(); g.translate(hand[0], hand[1]); rr(g, -4, -26 * s, 40 * s, 26 * s, 4); g.fillStyle = '#e8e2d6'; g.fill(); g.fillStyle = '#3a6ea5'; g.fillRect(-4, -26 * s, 40 * s, 6 * s); g.restore(); }

// s001 — toma abierta del bar
registerShot('s001', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.0, z1: 1.08, x0: -40, x1: 10 });
  const R = bar(g, t, cam); const GY = R.GY, s = V(1.25, 1.4);
  act(g, t, info, cam, [
    { who: EXTRA, x: CX() - V(820, 420), y: GY, s: s * 0.95, facing: 1, pose: 'phone', seed: 2, dim: true },
    { who: EXTRA, x: CX() - V(700, 330), y: GY, s: s * 0.9, facing: 1, pose: 'relaxed', seed: 3 },
    { who: SAM, x: CX() - V(200, 120), y: GY, s, facing: 1, pose: 'relaxed', expr: 'smile', seed: 1 },
    { who: PORTERO, x: CX() + V(60, 40), y: GY, s: s * 1.12, facing: -1, pose: holdCard, expr: 'thinking', look: [0.6, 0.6], seed: 4 },
  ], R.rim);
  FX.dust(g, t, { count: 30, color: '#ffd0e0', a: 0.25 });
} });
// s002 — primer plano del portero que te mira
registerShot('s002', { draw(g, t, info) {
  faceShot(g, t, info, { set: bar, who: PORTERO, expr: [[0, 'thinking'], [0.6, 'confused']], look: [-0.7, -0.1], side: 1, bgX: 220, rimColor: '#ffb0d0' });
} });
// s003 — detalle: la identificación bajo la linterna
registerShot('s003', { draw(g, t, info) {
  blurLayer(g, 16, g => bar(g, t, { z: 1.8, x: 150, y: -180 })); veil(g, '#0c0810', 0.45);
  const k = ease.out(prog(t, 0, 0.5)), x = E.W / 2 + 40 * Math.sin(t * 0.5), y = E.H * 0.5 + (1 - k) * 200;
  arm(g, [E.W + 200, E.H * 0.95], [x + V(260, 180), y + 40], { sleeve: PORTERO.color, rim: '#ffb0d0', w: 70 });
  idCard(g, x, y, V(640, 560), { rot: -0.05 + 0.02 * Math.sin(t) });
  const lx = lerp(x - 200, x + 120, ease.inOut(prog(t, 0.6, 2.2))); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, lx, y, 220, '#fff2d0', 0.35); g.restore();
} });
// s004 — "Aquí dice que naciste en 1981."
registerShot('s004', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.55, 60, 30);
  const R = bar(g, t, cam); const GY = R.GY, s = V(1.6, 1.7);
  act(g, t, info, cam, [
    { who: SAM, x: CX() - V(240, 160), y: GY, s, facing: 1, pose: 'relaxed', expr: 'smile', seed: 1 },
    { who: PORTERO, x: CX() + V(160, 120), y: GY, s: s * 1.12, facing: -1, pose: [[0, holdCard], [1.4, 'point']], expr: 'thinking', talk: true, seed: 4 },
  ], R.rim);
  pop(g, t, '1981', CX() - V(10, 0), E.H * 0.24, wt(info, '1981', 1.5), { size: V(110, 120) });
} });
// s005 — Sam: "Sí."
registerShot('s005', { draw(g, t, info) { faceShot(g, t, info, { set: bar, who: SAM, expr: 'smile', side: -1, bgX: -200, rimColor: '#ffb0d0', zoom: 0.06 }); } });
// s006 — sobre el hombro: "¿Tienes cuarenta y cinco años?"
registerShot('s006', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.6, 160, 130, 0.9);
  const R = bar(g, t, cam); const GY = R.GY;
  act(g, t, info, cam, [{ who: PORTERO, x: CX() + V(220, 150), y: GY, s: V(1.8, 1.9), facing: -1, pose: 'talk', expr: 'surprised', talk: true, seed: 4 }], R.rim);
  blurLayer(g, 12, g => fig(g, { x: CX() - V(380, 300), y: GY + 260, s: V(2.8, 3), facing: 1, outfit: SAM, pose: POSES.stand, rim: R.rim }), cam, 1.6);
  pop(g, t, '¿45 AÑOS?', CX() - V(80, 0), E.H * 0.2, wt(info, 'cuarenta', 0.3), { size: V(80, 86) });
} });
// s007 — "Sí. Amigo... ¿qué crema usas?"
registerShot('s007', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.45, 40, 20);
  const R = bar(g, t, cam); const GY = R.GY, s = V(1.6, 1.7), ta = wt(info, 'Amigo', 0.9);
  const lean = { ...POSES.talk, head: [18, -200], sh: [10, -170] };
  act(g, t, info, cam, [
    { who: SAM, x: CX() - V(220, 150), y: GY, s, facing: 1, pose: [[0, 'relaxed'], [info.dur - 1.0, 'shrug']], expr: pick(t, [[0, 'smile'], [info.dur - 1.0, 'smirk']]), seed: 1 },
    { who: PORTERO, x: CX() + V(150, 110), y: GY, s: s * 1.12, facing: -1, pose: [[0, 'crossArms'], [ta, lean]], expr: [[0, 'neutral'], [ta, 'confused']], talk: [ta, info.dur], seed: 4 },
  ], R.rim);
} });
// s008 — IMAGEN CONGELADA: "Te llamas Sam."
registerShot('s008', { draw(g, t, info) {
  const cam = { ...mcam(t, info.dur, 1.2, -120, -120, 0.86, 1.23), r: -0.01 };
  const R = bar(g, 0.4, cam); const GY = R.GY, s = V(1.35, 1.5);
  act(g, 0.4, info, cam, [
    { who: SAM, x: CX() - V(200, 120), y: GY, s, facing: 1, pose: 'relaxed', expr: 'smirk', still: true },
    { who: PORTERO, x: CX() + V(60, 40), y: GY, s: s * 1.12, facing: -1, pose: 'shrug', expr: 'confused', still: true },
  ], R.rim);
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  FX.drops(g, t, { count: 40, color: '#d8e4ff', rMax: 6, drift: 2 });
  layer(g, cam, 1, g => UI.callout(g, t, { at: [CX() - V(196, 116), GY - 330 * s], to: [CX() - V(560, 420), GY - 470 * s], str: 'SAM', start: 0.15, color: ui().gold, size: V(64, 70) }));
} });
// s009 — plano: crecer hasta los 20 y luego quedarse igual
registerShot('s009', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = ui().gold; const tStop = wt(info, 'dejaste', 1.6);
  const ages = [5, 10, 15, 20, 25, 35, 45], years = [1986, 1991, 1996, 2001, 2006, 2016, 2026];
  const n = ages.length, x0 = E.W * V(0.12, 0.1), dx = (E.W * V(0.78, 0.8)) / (n - 1), y = E.H * V(0.72, 0.6);
  seg(g, [[x0 - 60, y + 8], [x0 + dx * (n - 1) + 60, y + 8]], 3, alpha(c, 0.5));
  ages.forEach((a, i) => {
    const on = ease.outBack(prog(t, 0.15 + i * 0.22, 0.45 + i * 0.22)); if (on <= 0) return;
    const sc = Math.min(a, 20) / 20 * 0.85 + 0.15, frozen = a > 20, col = frozen && t > tStop ? gold : c;
    UI.lineFigure(g, { x: x0 + i * dx, y, s: sc * 1.25 * on, pose: POSES.stand, color: alpha(col, 0.95) });
    if (frozen && t > tStop) glow(g, x0 + i * dx, y - 150, 120, gold, 0.25);
    text(g, String(years[i]), x0 + i * dx, y + 50, { size: V(30, 30), color: alpha(c, 0.85), font: FONTS.ui, weight: 900, alpha: on });
    text(g, a + ' años', x0 + i * dx, y + 88, { size: V(26, 26), color: alpha(frozen && t > tStop ? gold : c, 0.8), font: FONTS.ui, weight: 800, alpha: on });
  });
  const hy = y - 310 * 1.25 * 0.85 - 40; if (t > tStop) { g.setLineDash([14, 12]); seg(g, [[x0 + dx * 3 - 50, hy], [x0 + dx * (n - 1) + 60, hy]], 3, alpha(gold, 0.8 * ease.out(prog(t, tStop, tStop + 0.5)))); g.setLineDash([]); }
  UI.readout(g, { label: 'EDAD DEL CUERPO', value: '20', x: E.W / 2, y: E.H * V(0.16, 0.2), align: 'center', a: ease.out(prog(t, tStop, tStop + 0.4)) });
} });
// s010 — Leo con canas
registerShot('s010', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.4, -60, -90);
  const R = bar(g, t, cam); const GY = R.GY, s = V(1.6, 1.7), lx = CX() - V(60, 0);
  act(g, t, info, cam, [
    { who: LEO, x: lx, y: GY, s, facing: 1, pose: 'relaxed', expr: 'happy', seed: 2 },
    { who: SAM, x: CX() + V(260, 200), y: GY, s, facing: -1, pose: 'relaxed', expr: 'smile', seed: 1 },
  ], R.rim);
  layer(g, cam, 1, g => tag(g, t, [lx + 4 * s, GY - 236 * s], [lx - V(300, 200), GY - 330 * s], 'CANAS', wt(info, 'canas', 1.2), GRAYC));
} });
const GRAYC = '#d8d4e4';
// s011 — foto de graduación 2001 vs. hoy
export function gradCap(g, cx, cy, r) { poly(g, [[cx - r * 1.3, cy - r * 0.85], [cx, cy - r * 1.25], [cx + r * 1.3, cy - r * 0.85], [cx, cy - r * 0.5]], '#16131c'); g.fillStyle = '#16131c'; g.fillRect(cx - r * 0.6, cy - r * 0.85, r * 1.2, r * 0.3); seg(g, [[cx + r * 0.2, cy - r * 0.9], [cx + r * 1.05, cy - r * 0.6], [cx + r * 1.05, cy - r * 0.1]], r * 0.05, '#f2c21a'); }
export function photoFrame(g, x, y, w, h, label, o = {}) {
  rr(g, x - 14, y - 14, w + 28, h + 28 + (label ? 60 : 0), 10); g.fillStyle = o.frame || '#efe6d4'; g.fill();
  rr(g, x, y, w, h, 6); g.fillStyle = o.bg || (o.sepia ? '#8a6a48' : '#6a7ab0'); g.fill();
  g.save(); rr(g, x, y, w, h, 6); g.clip(); o.draw?.(g, x, y, w, h); if (o.sepia) { g.globalCompositeOperation = 'color'; g.fillStyle = '#a07a4a'; g.fillRect(x, y, w, h); } g.restore();
  if (label) text(g, label, x + w / 2, y + h + 36, { size: 36, color: '#3a2a2a', font: FONTS.ui, weight: 900, spacing: 3 });
}
export const lunar = (g, cx, cy, r) => circle(g, cx + r * 0.5, cy + r * 0.28, r * 0.06, '#3a2228');
registerShot('s011', { draw(g, t, info) {
  blurLayer(g, 14, g => apartment(g, t, { z: 1.5, x: 0, y: -150 })); veil(g, '#0c0810', 0.4);
  const k = ease.out(prog(t, 0, 0.5)), sway = Math.sin(t * 0.7) * 6, W = V(420, 380), H = V(500, 460), y = E.H * 0.18;
  g.save(); g.translate(0, (1 - k) * 60); g.globalAlpha = k;
  photoFrame(g, E.W * 0.5 - W - 60 + sway, y, W, H, 'GRADUACIÓN 2001', { draw: (g, x, y, w, h) => { const r = w * 0.3; bigFace(g, x + w / 2, y + h * 0.58, r, { outfit: SAM, expr: 'happy', rimColor: '#fff3dc' }); gradCap(g, x + w / 2, y + h * 0.58, r); lunar(g, x + w / 2, y + h * 0.58, r); } });
  photoFrame(g, E.W * 0.5 + 60 - sway, y, W, H, 'HOY', { bg: '#7a5a8a', draw: (g, x, y, w, h) => { const r = w * 0.3; bigFace(g, x + w / 2, y + h * 0.58, r, { outfit: SAM, expr: 'smile', rimColor: '#ffc68a' }); lunar(g, x + w / 2, y + h * 0.58, r); } });
  g.restore();
  pop(g, t, '=', E.W / 2, y + H / 2, 1.2, { size: 120 });
} });
// s012 — "Tu rodilla no cruje."
registerShot('s012', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.3, -20, -40);
  const R = bar(g, t, cam); const GY = R.GY, s = V(1.5, 1.6);
  const hop = Math.max(0, Math.sin(clamp((t - 0.55) / 0.5) * Math.PI)) * 90;
  act(g, t, info, cam, [
    { who: LEO, x: CX() + V(330, 220), y: GY, s, facing: -1, pose: { ...POSES.crouch, hF: [34, -54], eF: [28, -86] }, expr: 'nervous', seed: 2 },
    { who: SAM, x: CX() - V(160, 120), y: GY - hop, s, facing: 1, pose: [[0, 'crouch'], [0.5, 'jump'], [1.05, 'cheer']], expr: 'happy', shadow: hop < 5, seed: 1 },
  ], R.rim);
  layer(g, cam, 1, g => pop(g, t, 'crac', CX() + V(380, 260), GY - 110 * s, 0.35, { size: 40, color: ui().accent }));
} });
// s013 — la billetera y el carnet de estudiante
registerShot('s013', { draw(g, t, info) {
  blurLayer(g, 16, g => bar(g, t, { z: 1.7, x: -200, y: -150 })); veil(g, '#0c0810', 0.45);
  const cx = E.W / 2, cy = E.H * 0.62, w = V(820, 700), h = V(420, 380), up = ease.out(prog(t, 0.5, 1.4));
  g.save(); g.translate(Math.sin(t * 0.6) * 10, 0);
  rr(g, cx - w / 2 - 5, cy - 5, w + 10, h + 10, 30); g.fillStyle = '#ffc68a'; g.fill(); rr(g, cx - w / 2, cy, w, h, 28); g.fillStyle = '#5a3424'; g.fill(); seg(g, [[cx, cy + 10], [cx, cy + h - 10]], 4, '#3a2018');
  g.save(); rr(g, cx - w / 2 - 200, cy - 800, w + 400, 800 + h * 0.45, 0); g.clip();
  idCard(g, cx + V(40, 30), cy + h * 0.25 - up * V(300, 280), V(560, 500), { title: 'CARNET DE ESTUDIANTE', band: '#d64a33', rot: 0.04, lines: [['UNIVERSIDAD', 'SAM'], ['VÁLIDO HASTA', '2003']] });
  g.restore();
  g.fillStyle = '#4a2a1e'; rr(g, cx - w / 2, cy + h * 0.45, w, h * 0.55, 26); g.fill(); g.strokeStyle = 'rgba(255,200,150,.3)'; g.setLineDash([10, 10]); g.lineWidth = 3; rr(g, cx - w / 2 + 20, cy + h * 0.5, w - 40, h * 0.45, 18); g.stroke(); g.setLineDash([]);
  g.restore();
  if (t > wt(info, 'acaso', 3.2)) FX.sparkle(g, cx + V(230, 180), cy - V(290, 270), 40 * ease.outBack(prog(t, wt(info, 'acaso', 3.2), wt(info, 'acaso', 3.2) + 0.3)), '#ffe8b0');
} });

// --- gráfico de masa muscular (s014–s016) ---
function muscleGraph(g, t, info, mode) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = ui().gold;
  const x0 = V(260, 140), x1 = E.W - V(180, 100), y0 = E.H * V(0.8, 0.7), y1 = E.H * V(0.25, 0.25);
  const ax = (age) => lerp(x0, x1, (age - 20) / 60), ay = (v) => lerp(y0, y1, v);
  seg(g, [[x0, y1 - 40], [x0, y0], [x1 + 30, y0]], 3, alpha(c, 0.7));
  for (let a = 20; a <= 80; a += 10) { seg(g, [[ax(a), y0], [ax(a), y0 + 14]], 3, alpha(c, 0.7)); text(g, String(a), ax(a), y0 + 44, { size: V(30, 32), color: alpha(c, 0.85), font: FONTS.ui, weight: 900 }); }
  text(g, 'EDAD', x1 + 10, y0 + 90, { size: 26, color: alpha(c, 0.7), font: FONTS.ui, weight: 900, align: 'right', spacing: 3 });
  text(g, 'MASA MUSCULAR', x0 + 10, y1 - 110, { size: V(32, 34), color: alpha(c, 0.9), font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
  const norm = (a) => (a <= 30 ? 0.9 : 0.9 - Math.pow((a - 30) / 50, 1.15) * 0.55);
  const p = mode === 0 ? ease.inOut(prog(t, 0.3, 3.4)) : 1;
  g.strokeStyle = c; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i <= 100; i++) { const a = 20 + 60 * (i / 100) * p; const X = ax(a), Y = ay(norm(a)); i ? g.lineTo(X, Y) : g.moveTo(X, Y); } g.stroke();
  const hx = ax(20 + 60 * p), hy = ay(norm(20 + 60 * p)); glow(g, hx, hy, 50, c, 0.7);
  text(g, 'PERSONA NORMAL', ax(66), ay(norm(66)) - 46, { size: V(28, 30), color: c, font: FONTS.ui, weight: 900, alpha: clamp(p * 3 - 2) });
  const t30 = mode === 0 ? wt(info, 'treinta', 3) : -1; if (t > t30) { g.setLineDash([8, 10]); seg(g, [[ax(30), y0], [ax(30), y1 - 20]], 3, alpha(ui().accent, 0.8)); g.setLineDash([]); text(g, '30', ax(30), y1 - 44, { size: 40, color: ui().accent, font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, t30, t30 + 0.3)) }); }
  if (mode === 2) {
    const tg = wt(info, 'detuviste', 0.6), q = ease.inOut(prog(t, tg, tg + 1.4));
    g.strokeStyle = gold; g.lineWidth = 8; g.beginPath(); g.moveTo(ax(20), ay(0.9) - 4); g.lineTo(lerp(ax(20), x1 + 30, q), ay(0.9) - 4); g.stroke(); glow(g, lerp(ax(20), x1 + 30, q), ay(0.9) - 4, 70, gold, 0.9);
    text(g, 'TÚ: SIEMPRE 20', ax(40), ay(0.9) - 52, { size: V(40, 42), color: gold, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(gold, 0.6), alpha: clamp(q * 3) });
    pop(g, t, '∞', x1 + 30, ay(0.9) - 70, wt(info, 'siempre', 2.6), { size: 110 });
  }
}
registerShot('s014', { draw(g, t, info) { muscleGraph(g, t, info, 0); } });
registerShot('s015', { draw(g, t, info) {
  UI.blueprint(g);
  UI.dataCard(g, t, { title: 'MASA MUSCULAR', subtitle: 'PÉRDIDA POR DÉCADA (DESPUÉS DE LOS 30)', from: 3, to: 8, decimals: 0, unit: ' %', start: wt(info, 'tres', 0.3), dur: 1.6, labels: [[0, '3 %'], [1, '8 %']], total: info.dur, arrow: true });
} });
registerShot('s016', { draw(g, t, info) { muscleGraph(g, t, info, 2); } });
// s017 — "Pero hay una regla."
registerShot('s017', { draw(g, t, info) {
  voidBg(g, t, { z: 1 }); const gold = ui().gold;
  g.save(); g.globalAlpha = 0.25; FX.clock(g, E.W / 2, E.H * 0.5, V(300, 280), 20 * 3600, { face: '#2a2238', ink: '#8a7a9a', red: '#8a3a3a', speed: 0 }); g.restore();
  UI.bigLine(g, t, { str: 'PERO HAY UNA REGLA', dur: info.dur, y: E.H * 0.5, size: V(96, 80) });
  FX.dust(g, t, { count: 40, color: '#ffd0a0', a: 0.3 });
} });
// s018 — cuerpo que no envejece, pero sigue siendo un cuerpo
registerShot('s018', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = ui().gold, acc = ui().accent; const tb = wt(info, 'No', 1.9);
  const cx = E.W / 2 - V(260, 0), fy = E.H * V(0.86, 0.66);
  UI.lineFigure(g, { x: cx, y: fy, s: V(2.6, 2.4), pose: POSES.stand, color: c });
  const ky = fy - V(670, 630); ring(g, cx + 8, ky, 46, 4, gold); seg(g, [[cx + 8, ky], [cx + 8, ky - 30]], 5, gold); seg(g, [[cx + 8, ky], [cx + 30, ky]], 5, gold);
  text(g, 'RELOJ: DETENIDO', cx + 80, ky, { size: 30, color: gold, font: FONTS.ui, weight: 900, align: 'left', alpha: ease.out(prog(t, 0.3, 0.7)) });
  const items = [['CORAZÓN', [cx + 20, fy - V(420, 390)]], ['HUESOS', [cx - 10, fy - V(140, 130)]], ['SANGRE', [cx - 40, fy - V(300, 280)]]];
  items.forEach(([s, at], i) => UI.callout(g, t, { at, to: [E.W / 2 + V(240, 200), E.H * V(0.3, 0.35) + i * V(140, 130)], str: s, start: tb + 0.15 + i * 0.35, color: acc, size: V(40, 42) }));
  if (t > tb) UI.readout(g, { value: 'SIGUE SIENDO UN CUERPO', x: E.W / 2 + V(200, 0), y: E.H * V(0.16, 0.14), align: 'center', size: V(44, 40), color: ui().cream, a: ease.out(prog(t, tb, tb + 0.4)) });
} });
// s019 — "Te puedes romper." brazo enyesado
registerShot('s019', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.45, 0, -20);
  const R = apartment(g, t, cam); const GY = R.GY, s = V(1.7, 1.8), x = CX() - V(60, 0);
  const sling = { ...POSES.stand, eF: [18, -128], hF: [-6, -150], head: [8, -200] };
  act(g, t, info, cam, [{ who: SAM, x, y: GY, s, facing: 1, pose: sling, expr: [[0, 'scared'], [0.5, 'sad']], seed: 1 }], R.rim);
  layer(g, cam, 1, g => { seg(g, [[x + 18 * s, GY - 128 * s], [x - 6 * s, GY - 150 * s]], 22 * s, '#f2efe8'); seg(g, [[x - 4 * s, GY - 176 * s], [x + 22 * s, GY - 118 * s], [x - 12 * s, GY - 150 * s]], 6 * s, '#3a6ea5'); });
  pop(g, t, '¡AY!', CX() + V(260, 200), E.H * 0.3, 0.15, { size: 70, color: ui().accent, end: 1.1 });
} });
// s020 — "Te puedes enfermar." en cama con fiebre
registerShot('s020', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.5, -40, -70, 0.84);
  const R = apartment(g, t, cam); const GY = R.GY;
  const bx = E.W / 2 - V(300, 200), s = 1.3;
  layer(g, cam, 1, g => {
    FX.bed(g, { x: bx, y: GY, w: V(560, 420), color: '#4a4a80', frame: '#1a1828', pillow: '#d8d6ee' });
    fig(g, { x: bx + 300, y: GY + 40, s, facing: 1, outfit: SAM, pose: POSES.lie, rot: -Math.PI / 2, expr: 'nervous', rim: R.rim, shadow: false });
    g.fillStyle = '#5a5a96'; rr(g, bx + 230, GY - 120, V(320, 180), 60, 20); g.fill(); g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(bx + 240, GY - 120, V(300, 160), 4);
  });
  layer(g, cam, 1, g => { const hx = bx + 300 - 108 * s, hy = GY - 90; seg(g, [[hx + 20, hy + 30], [hx + 70, hy + 10]], 6, '#e8e8f0'); circle(g, hx + 70, hy + 10, 6, '#e04a3a'); });
  pop(g, t, '39 °C', E.W / 2 + V(300, 160), E.H * 0.28, 0.3, { size: 74, color: ui().accent });
} });
// s021 — "Puedes morir." monitor plano
export function ecg(g, t, o = {}) {
  const { x0 = V(160, 80), x1 = E.W - V(160, 80), y = E.H * 0.52, amp = 160, flatAt = 0.8, color = ui().accent, weak = 1, speed = 1.0, revive = null } = o;
  const N = 220; g.strokeStyle = color; g.lineWidth = 7; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath();
  const head = clamp((t * speed) % 1.4 / 1.0);
  for (let i = 0; i <= N; i++) { const u = i / N, X = lerp(x0, x1, u); const tt = t - (1 - u) * 1.2; let a = 0;
    const ph = ((tt * 1.1) % 1 + 1) % 1; const beat = ph > 0.42 && ph < 0.48 ? -1 : ph > 0.48 && ph < 0.52 ? 0.6 : ph > 0.6 && ph < 0.7 ? -0.15 : 0;
    const alive = tt < flatAt ? 1 : 0; const back = revive != null && tt > revive ? (o.weakUntil != null && tt < o.weakUntil ? 0.35 : 1) : 0;
    a = beat * Math.max(alive, back);
    i ? g.lineTo(X, y + a * amp) : g.moveTo(X, y + a * amp); }
  g.stroke(); glow(g, x1, y, 90, color, 0.6);
}
registerShot('s021', { draw(g, t, info) {
  backdrop(g, ['#070810', '#0c1020']); const c = ui().accent;
  g.strokeStyle = alpha('#5fd39a', 0.08); g.lineWidth = 1; for (let x = 0; x < E.W; x += 48) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } for (let y = 0; y < E.H; y += 48) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); }
  ecg(g, t + 0.2, { flatAt: 0.6, color: t < 0.7 ? '#5fd39a' : c });
} });
// s022 — "...no te haces viejo." reloj de arena congelado
registerShot('s022', { draw(g, t, info) {
  blurLayer(g, 14, g => { const R = apartment(g, t, { z: 1.4, x: 120, y: -140 }); fig(g, { x: E.W / 2 + 380, y: R.GY + 200, s: 2.4, facing: -1, outfit: SAM, pose: POSES.relaxed, expr: 'smile', rim: R.rim }); }); veil(g, '#0c0810', 0.35);
  const cx = E.W / 2 - V(140, 0), cy = E.H * 0.5, h = V(300, 320), w = h * 0.62; const k = 1 + 0.03 * t;
  g.save(); g.translate(cx, cy); g.scale(k, k);
  rr(g, -w * 0.75, -h - 30, w * 1.5, 30, 10); g.fillStyle = '#5a3424'; g.fill(); rr(g, -w * 0.75, h, w * 1.5, 30, 10); g.fill();
  g.fillStyle = 'rgba(200,220,255,.14)'; g.beginPath(); g.moveTo(-w / 2, -h); g.lineTo(w / 2, -h); g.quadraticCurveTo(w * 0.5, -h * 0.2, 12, 0); g.quadraticCurveTo(w * 0.5, h * 0.2, w / 2, h); g.lineTo(-w / 2, h); g.quadraticCurveTo(-w * 0.5, h * 0.2, -12, 0); g.quadraticCurveTo(-w * 0.5, -h * 0.2, -w / 2, -h); g.fill(); g.strokeStyle = 'rgba(230,240,255,.5)'; g.lineWidth = 4; g.stroke();
  g.fillStyle = '#e8b86a'; g.beginPath(); g.moveTo(-w * 0.36, -h * 0.55); g.quadraticCurveTo(0, -h * 0.62, w * 0.36, -h * 0.55); g.quadraticCurveTo(w * 0.3, -h * 0.15, 0, -6); g.quadraticCurveTo(-w * 0.3, -h * 0.15, -w * 0.36, -h * 0.55); g.fill();
  g.beginPath(); g.moveTo(-w * 0.46, h); g.quadraticCurveTo(0, h * 0.55, w * 0.46, h); g.fill();
  for (let i = 0; i < 14; i++) { circle(g, Math.sin(i * 3.1) * 4, i * (h * 0.06) + 10, 4, '#ffd890'); }
  g.restore(); FX.drops(g, t, { count: 30, color: '#ffe8c0', rMax: 4, drift: 1.5 }); glow(g, cx, cy, 300, '#ffd890', 0.15);
} });
// s023 — TARJETA DE TÍTULO
registerShot('s023', { draw(g, t, info) {
  const M = mood('dusk'), cam = { z: 1.06 - 0.05 * ease.inOut(t / info.dur), y: -14 * t };
  layer(g, cam, 0.2, g => { backdrop(g, M.sky); FX.sun(g, E.W / 2, E.H * V(0.66, 0.55), V(90, 110), '#fff3dc', M.key, 5); FX.godRays(g, E.W / 2, E.H * V(0.66, 0.55), { count: 14, angle: -Math.PI / 2, spread: Math.PI * 1.6, len: 1800, a: 0.06, t }); });
  layer(g, cam, 0.5, g => FX.skyline(g, { x: -200, y: E.H * V(0.76, 0.66), w: E.W + 400, maxH: V(300, 500), color: '#2a1f36', windowColor: alpha(M.practical, 0.8), seed: 21 }));
  layer(g, cam, 0.8, g => { g.fillStyle = '#16111e'; g.fillRect(-E.W, E.H * V(0.76, 0.66), E.W * 3, E.H); FX.skyline(g, { x: -200, y: E.H * V(0.82, 0.72), w: E.W + 400, minH: 60, maxH: V(160, 260), color: '#120d18', windowColor: alpha(M.practical, 0.9), lit: 0.25, seed: 5 }); });
  layer(g, cam, 1, g => fig(g, { x: E.W / 2, y: E.H * V(0.82, 0.72), s: 0.7, facing: 1, outfit: SAM, pose: POSES.relaxed, rim: { color: M.rim, dir: [0, -1] } }));
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.4 });
  UI.titleCard(g, t, { lines: ['¿QUÉ PASARÍA SI DEJARAS', 'DE ENVEJECER A LOS 20?'], dur: info.dur + 0.3, y: E.H * V(0.36, 0.34) });
} });
