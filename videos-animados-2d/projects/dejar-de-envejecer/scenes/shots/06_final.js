// 06_final.js — s107–s136: el hospital, la decisión, la verdad, Leo, la rayita, la carta de 1890 y el cierre.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, shake, text, FONTS, glow, alpha, shade, mix, rr, seg, circle, ring, poly, rng } from '/engine/core.js';
import { bigFace, POSES, walkPose } from '/engine/rig2d.js';
import { push, mcam, pick, wt, act, faceShot, tag, pop, panel, bigPhone, arm, ui, FX, UI } from './_lib.js';
import { clinic, corridor, kitchen, street, car, carNight, labcell, publiclab, frameX, ground } from '../sets/places.js';
import { SAM, LEO, MAMA, BLACK, LEE, DOCTORA, EXTRA, VECINA, fig, CAST } from '../cast.js';
import { photoFrame, lunar } from './01_gancho.js';
import { mama, frameClose, markYc, pencil, hand } from './04_mama.js';
import { heart } from './02_bueno_raro.js';

const CX = () => E.W / 2;
const SCI = { top: 'labcoat', head: 'curly' };
// cama de hospital con mamá acostada (todo en el plano 1)
function hospBed(g, x, GY, s, o = {}) {
  FX.bed(g, { x, y: GY, w: 480, color: '#6a78a8', frame: '#1a1e2c', pillow: '#eef2fa' });
  mama(g, { x: x + 250, y: GY + 100 * s * 0.9 - 92, s: s * 0.9, facing: 1, outfit: MAMA, pose: POSES.lie, rot: -Math.PI / 2, expr: o.expr || 'sleepy', rim: { color: '#a9b8ff', dir: [0, -1] }, cane: false, shadow: false, blink: o.blink });
  g.fillStyle = '#8a9ac8'; rr(g, x + 230, GY - 104, 250, 50, 14); g.fill();
  seg(g, [[x + 520, GY], [x + 520, GY - 330]], 5, '#2a2e3a'); rr(g, x + 500, GY - 330, 40, 60, 8); g.fillStyle = 'rgba(200,230,255,.5)'; g.fill(); g.strokeStyle = 'rgba(200,230,255,.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 520, GY - 270); g.quadraticCurveTo(x + 480, GY - 150, x + 420, GY - 90); g.stroke();
}
function hospital(g, t, info, cam, o = {}) {
  const R = clinic(g, t, cam, { night: true, bed: false, noCross: true, ...o }); const GY = R.GY, s = V(1.5, 1.55);
  layer(g, cam, 1, g => hospBed(g, CX() - V(200, 150), GY, s, o));
  return { R, GY, s };
}
const sitChair = (g, x, GY, s) => { g.save(); g.translate(x, 0); FX.chair(g, -18 * s, GY, s, '#1a1e2a'); g.restore(); };

registerShot('s107', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.12, z1: 1.18, x0: -60, x1: -80, y0: 50, y1: 50 }); const H = hospital(g, t, info, cam); const { GY, s, R } = H; const tv = wt(info, 'vibra', 1.4);
  const sx = CX() - V(480, 330); layer(g, cam, 1, g => sitChair(g, sx, GY, s));
  act(g, t, info, cam, [{ who: SAM, x: sx, y: GY - 20, s, facing: 1, pose: t > tv ? { ...POSES.sit, eF: [20, -118], hF: [28, -140] } : { ...POSES.sit, head: [16, -170] }, prop: t > tv ? { type: 'phone', glow: '#ff9a7a' } : null, expr: [[0, 'sleepy'], [tv, 'worried']], seed: 1, shadow: false }], R.rim);
  if (t > tv) layer(g, cam, 1, g => FX.rings(g, sx + 28 * s, GY - 160 * s, t, { count: 3, r0: 20, r1: 80, color: '#ff9a7a', a: 0.6, speed: 3 }));
} });
registerShot('s108', { draw(g, t, info) {
  blurLayer(g, 16, g => clinic(g, t, { z: 1.6, x: -100, y: -100 }, { night: true })); veil(g, '#0c0810', 0.5);
  const jit = Math.sin(t * 60) * (Math.sin(t * 3) > 0.7 ? 6 : 0);
  bigPhone(g, t, E.W / 2 + jit, E.H * 0.55, V(780, 900), { glowC: '#ff9a7a', rim: '#ff9a7a', screen: '#1a1014', draw: (g, x, y, w, h) => {
    circle(g, x + w / 2, y + 150, 80, '#2a2228'); bigFace(g, x + w / 2, y + 160, 62, { outfit: BLACK, expr: 'smirk', rimColor: '#ff9a7a' });
    text(g, 'BLACK · ETERNA', x + w / 2, y + 280, { size: 30, color: '#fff', font: FONTS.ui, weight: 900, spacing: 2 }); text(g, 'en llamada', x + w / 2, y + 318, { size: 20, color: '#c8a0a0', font: FONTS.ui, weight: 800 });
    for (let i = 0; i < 18; i++) { const hh = 10 + Math.abs(Math.sin(t * 9 + i * 0.7)) * 50; rr(g, x + 40 + i * ((w - 80) / 18), y + 420 - hh / 2, 8, hh, 4); g.fillStyle = '#ff9a7a'; g.fill(); }
    circle(g, x + w / 2, y + h - 90, 44, '#e0302a'); seg(g, [[x + w / 2 - 18, y + h - 90], [x + w / 2 + 18, y + h - 90]], 8, '#fff');
  } });
} });
registerShot('s109', { draw(g, t, info) { faceShot(g, t, info, { set: carNight, who: BLACK, expr: 'smirk', talk: true, side: 1, bgX: 0, bgY: 0, veil: 0.3, rimColor: '#ff9a7a', after: (g, cx, cy, r) => { rr(g, cx + r * 0.9, cy - r * 0.3, r * 0.3, r * 0.6, 12); g.fillStyle = '#0a0a10'; g.fill(); FX.rain(g, t, { count: 60, color: '#cfd9ff', a: 0.2, seed: 2 }); } }); } });
registerShot('s110', { draw(g, t, info) {
  blurLayer(g, 14, g => clinic(g, t, { z: 1.5, x: 100, y: -200 }, { night: true })); veil(g, '#0c0810', 0.4);
  FX.clock(g, E.W / 2, E.H * 0.5, V(300, 300) * (1 + 0.03 * t), 19 * 3600 + 20 * 60 + t * 240, { face: '#e6ecf4' });
  glow(g, E.W / 2, E.H * 0.5, 600, '#a9b8ff', 0.12);
} });
registerShot('s111', { draw(g, t, info) {
  const cam = { z: 2.1 + 0.08 * t, x: V(470, 300), y: -V(170, 260) }; clinic(g, t, cam, { night: true, doorOpen: 0.45, bed: false, noCross: true });
  layer(g, cam, 0.4, g => FX.lightCone(g, CX() + V(470, 310), ground() - V(380, 480), { angle: Math.PI * 0.62, spread: 0.3, len: 900, color: '#e0f0ff', a: 0.12 }));
} });
registerShot('s112', { draw(g, t, info) {
  backdrop(g, ['#141a30', '#1e2440']); const cx = E.W / 2, cy = E.H * 0.58;
  g.fillStyle = '#6a78a8'; g.fillRect(-10, cy - 40, E.W + 20, E.H); g.fillStyle = 'rgba(255,255,255,.08)'; for (let i = 0; i < 6; i++) g.fillRect(-10, cy - 20 + i * 70, E.W + 20, 6);
  seg(g, [[-100, cy - 20], [cx - 60, cy - 10]], 120, shade('#f29ac0', -0.15)); const ink = S().ink;
  g.fillStyle = '#a9b8ff'; g.beginPath(); g.ellipse(cx + 40, cy - 34, 130, 66, 0, 0, 7); g.fill(); g.fillStyle = ink; g.beginPath(); g.ellipse(cx + 40, cy - 30, 124, 60, 0, 0, 7); g.fill();
  for (let i = 0; i < 4; i++) seg(g, [[cx + 120, cy - 60 + i * 26], [cx + 190 + (i === 0 ? -10 : 0), cy - 54 + i * 28]], 26, ink);
  rr(g, cx - 20, cy - 70, 70, 34, 8); g.fillStyle = '#eef2fa'; g.fill(); g.strokeStyle = 'rgba(220,235,255,.6)'; g.lineWidth = 4; g.beginPath(); g.moveTo(cx + 10, cy - 70); g.quadraticCurveTo(cx - 60, -100, cx - 300, -200); g.stroke();
  const b = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * 1.1)), 10); glow(g, cx + 40, cy - 30, 300, '#ffb0c8', 0.12 + 0.2 * b); FX.dust(g, t, { count: 30, color: '#cfd9ff', a: 0.3 });
} });
registerShot('s113', { draw(g, t, info) {
  const sp = E.W / 2 + Math.sin(t * 0.8) * 20;
  g.save(); g.beginPath(); g.rect(0, 0, sp, E.H); g.clip(); labcell(g, t, { z: 1.3, x: -200, y: -60 }); text(g, 'EL LABORATORIO', sp / 2, E.H * 0.3, { size: V(50, 44), color: '#9fe8ff', font: FONTS.ui, weight: 900, spacing: 4, glow: 16, glowColor: 'rgba(120,220,255,.6)', alpha: ease.out(prog(t, 0.1, 0.4)) }); g.restore();
  g.save(); g.beginPath(); g.rect(sp, 0, E.W - sp, E.H); g.clip(); backdrop(g, ['#3a2426', '#5a3a36']); glow(g, sp + (E.W - sp) / 2, E.H * 0.55, 600, '#ffcf8f', 0.35);
  const hx = sp + (E.W - sp) / 2, hy = E.H * 0.62; g.fillStyle = S().ink; g.beginPath(); g.ellipse(hx, hy, 110, 54, 0, 0, 7); g.fill(); for (let i = 0; i < 4; i++) seg(g, [[hx + 70, hy - 26 + i * 22], [hx + 130, hy - 20 + i * 24]], 22, S().ink); seg(g, [[hx - 400, hy + 10], [hx - 60, hy]], 100, '#f29ac0');
  text(g, 'LA MANO DE TU MAMÁ', hx, E.H * 0.3, { size: V(50, 44), color: '#ffe0c0', font: FONTS.ui, weight: 900, spacing: 3, glow: 16, glowColor: 'rgba(255,180,120,.6)', alpha: ease.out(prog(t, wt(info, 'mano', 1.2), wt(info, 'mano', 1.2) + 0.3)) }); g.restore();
  seg(g, [[sp, 0], [sp, E.H]], 6, '#0a0810');
} });
registerShot('s114', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.5, -200, -230); const H = hospital(g, t, info, cam, { expr: 'sleepy' }); const { GY, s, R } = H; const ts = wt(info, 'sientas', 1.4), th = wt(info, 'tomas', 2.4);
  const sx = lerp(CX() - V(380, 260), CX() - V(330, 230), ease.inOut(prog(t, ts - 0.4, ts + 0.3)));
  layer(g, cam, 1, g => sitChair(g, CX() - V(330, 230), GY, s));
  const seated = t > ts; act(g, t, info, cam, [{ who: SAM, x: sx, y: seated ? GY - 20 : GY, s, facing: 1, pose: [[0, 'stand'], [ts - 0.3, 'sit'], [th, { ...POSES.sit, eF: [40, -120], hF: [76, -112] }]], expr: [[0, 'determined'], [th, 'smile']], seed: 1, shadow: !seated }], R.rim);
  if (t > th) layer(g, cam, 1, g => glow(g, sx + 76 * s, GY - 20 - 112 * s, 120, '#ffcf8f', 0.4 * ease.out(prog(t, th, th + 0.5))));
} });
registerShot('s115', { draw(g, t, info) {
  blurLayer(g, 16, g => clinic(g, t, { z: 1.6, x: -100, y: -100 }, { night: true })); veil(g, '#0c0810', 0.5);
  const to = wt(info, 'apagas', 0.8) + 0.3, off = t > to; const k = ease.in(prog(t, to, to + 0.25));
  const P = bigPhone(g, t, E.W / 2, E.H * 0.55, V(780, 900), { off, glowC: '#ff9a7a', rim: '#ffcf8f', screen: off ? '#05050a' : '#1a1014', draw: (g, x, y, w, h) => { if (off) return; text(g, 'BLACK · ETERNA', x + w / 2, y + 280, { size: 30, color: '#fff', font: FONTS.ui, weight: 900 }); circle(g, x + w / 2, y + h - 90, 44, '#e0302a'); } });
  if (t > to && t < to + 0.3) { g.fillStyle = alpha('#ffffff', 0.8 * (1 - k)); g.fillRect(P.sx, P.sy + P.sh / 2 - 3, P.sw, 6); }
  const hk = ease.out(prog(t, 0, 0.5)); arm(g, [E.W * 0.85, E.H * 1.2], [E.W / 2 + 80, E.H * 0.82 - hk * 30], { sleeve: SAM.color, rim: '#ffcf8f', w: 60 });
} });
// --- Black llega tarde ---
registerShot('s116', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.2, z1: 1.26 }); carNight(g, t, cam);
  const cx = E.W * 0.4, GY = E.H * 0.95; act(g, t, info, cam, [{ who: BLACK, x: cx, y: GY, s: 2.0, facing: 1, pose: { ...POSES.sit, eF: [34, -116], hF: [70, -118], eB: [30, -118], hB: [64, -122] }, expr: 'smirk', shadow: false, seed: 5 }], { color: '#9fd0ff', dir: [1, -0.2] });
  layer(g, cam, 1, g => { poly(g, [[cx + 120, GY - 230], [cx + 300, GY - 230], [cx + 340, GY - 250], [cx + 120, GY - 250]], '#2a2a36'); poly(g, [[cx + 300, GY - 248], [cx + 330, GY - 248], [cx + 380, GY - 440], [cx + 350, GY - 440]], '#2a2a36'); glow(g, cx + 350, GY - 340, 360, '#9fd0ff', 0.4); });
  FX.clock(g, E.W * 0.82, E.H * 0.3, V(90, 100), 7 * 3600 + 59 * 60 + 50 + t * 4, { face: '#f2efe8' });
  pop(g, t, '08:00', E.W * 0.82, E.H * 0.3 + 150, wt(info, 'ocho', 0.4), { size: V(56, 56), color: ui().accent });
  const ts = wt(info, 'cumple', 1.4); if (t > ts) pop(g, t, 'ENVIAR ▸', E.W * 0.55, E.H * 0.25, ts, { size: V(44, 44), color: '#9fd0ff' });
} });
registerShot('s117', { draw(g, t, info) { const tt = wt(info, 'tarde', 0.6); faceShot(g, t, info, { set: carNight, who: BLACK, expr: [[0, 'smirk'], [tt - 0.1, 'shocked']], side: 1, bgX: 0, bgY: 0, veil: 0.35, rimColor: '#9fd0ff', after: (g, cx, cy, r) => pop(g, t, 'TARDE', cx - r * 1.6, cy - r * 0.4, tt, { size: V(110, 100), color: ui().accent }) }); } });
// --- la verdad ---
registerShot('s118', { draw(g, t, info) {
  blurLayer(g, 16, g => corridor(g, t, { z: 1.5, x: 100, y: -120 })); veil(g, '#0c0810', 0.4);
  bigPhone(g, t, E.W / 2, E.H * 0.55, V(780, 900), { glowC: '#9fd0ff', draw: (g, x, y, w, h) => {
    g.fillStyle = '#34405a'; g.fillRect(x, y, w, h); bigFace(g, x + w / 2, y + h * 0.55, w * 0.32, { outfit: SAM, expr: 'determined', talk: Math.abs(Math.sin(t * 9)) * 0.6, rimColor: '#e0f0ff' }); lunar(g, x + w / 2, y + h * 0.55, w * 0.32);
    if (Math.sin(t * 6) > -0.3) circle(g, x + 40, y + 40, 12, '#ff3a2a'); text(g, 'REC', x + 62, y + 41, { size: 24, color: '#fff', font: FONTS.ui, weight: 900, align: 'left' });
    text(g, '7:00 PM', x + w - 30, y + 41, { size: 24, color: '#fff', font: FONTS.ui, weight: 900, align: 'right' });
  } });
  pop(g, t, 'A LAS 7:00', E.W * 0.2, E.H * 0.3, wt(info, 'siete', 0.4), { size: V(64, 60) });
} });
registerShot('s119', { draw(g, t, info) {
  faceShot(g, t, info, { set: corridor, who: SAM, expr: [[0, 'determined'], [1.6, 'smile']], side: -1, bgX: 0, rimColor: '#e0f0ff', zoom: 0.05 });
  if (Math.sin(t * 6) > -0.3) circle(g, V(110, 80), V(120, 160), 16, '#ff3a2a'); text(g, 'REC', V(140, 110), V(121, 161), { size: 34, color: '#fff', font: FONTS.ui, weight: 900, align: 'left' });
  pop(g, t, 'SIN ESCONDERTE', E.W * 0.78, E.H * 0.24, wt(info, 'Sin', 2.2), { size: V(54, 50), color: ui().cream });
} });
registerShot('s120', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.35, 0, -40); const R = publiclab(g, t, cam); const GY = R.GY, s = V(1.5, 1.55); const tl = wt(info, 'Lee', 4.2);
  const shake2 = { ...POSES.stand, eF: [26, -136], hF: [54, -134 + Math.sin(t * 8) * 6] };
  act(g, t, info, cam, [
    { who: SCI, x: CX() - V(620, 420), y: GY, s: s * 0.92, facing: 1, pose: 'holdFront', prop: 'tablet', expr: 'smile', seed: 6 },
    { who: { ...SCI, head: 'bun' }, x: CX() + V(620, 420), y: GY, s: s * 0.92, facing: -1, pose: 'crossArms', expr: 'smile', seed: 7 },
    { who: SAM, x: CX() - V(110, 80), y: GY, s, facing: 1, pose: t > 1.2 ? shake2 : 'stand', expr: 'smile', seed: 1 },
    { who: LEE, x: CX() + V(150, 100), y: GY, s, facing: -1, pose: t > 1.2 ? shake2 : 'stand', expr: 'happy', seed: 2 },
  ], R.rim);
  layer(g, cam, 1, g => tag(g, t, [CX() + V(150, 100), GY - 260 * s], [CX() + V(380, 260), GY - 340 * s], 'DRA. LEE', tl));
  pop(g, t, 'HOSPITALES PÚBLICOS', E.W / 2, E.H * 0.16, wt(info, 'hospitales', 0.9), { size: V(52, 48), color: ui().cream, end: tl - 0.1 });
} });
registerShot('s121', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), good = ui().good;
  const items = [['PRUEBAS ABIERTAS', 'Pruebas'], ['RESULTADOS PARA TODOS', 'Resultados'], ['NADA A LA VENTA', 'Nada']];
  items.forEach(([s, w], i) => { const tw = wt(info, w, 0.15 + i * 1.3); const k = ease.outBack(prog(t, tw - 0.1, tw + 0.25)); if (k <= 0) return; const y = E.H * (0.3 + i * 0.2), x = E.W * V(0.24, 0.12);
    g.save(); g.translate(x, y); g.scale(k, k); circle(g, 0, 0, 44, good); seg(g, [[-18, 0], [-4, 16], [20, -16]], 10, '#0b1324'); g.restore();
    text(g, s, x + 90, y + 2, { size: V(64, 56), color: ui().cream, font: FONTS.title, weight: 700, align: 'left', spacing: 2, alpha: clamp(k) }); });
} });
registerShot('s122', { draw(g, t, info) {
  blurLayer(g, 16, g => street(g, t, { z: 1.7, x: -100, y: -100 }, { mood: 'night' })); veil(g, '#0c0810', 0.55);
  const cx = E.W / 2, cy = E.H * 0.56, w = V(1100, 900), h = V(700, 900); rr(g, cx - w / 2, cy - h / 2, w, h, 10); g.fillStyle = '#f2ece0'; g.fill();
  text(g, 'UN LABORATORIO SERIO NUNCA TE PIDE:', cx, cy - h / 2 + 70, { size: V(40, 36), color: '#1a1622', font: FONTS.ui, weight: 900, spacing: 2 });
  const items = [['FIRMAR ESA MISMA NOCHE', 'noche'], ['SIN ABOGADO', 'abogado'], ['BAJO AMENAZA', 'amenaza']];
  items.forEach(([s, wd], i) => { const tw = wt(info, wd, 2.8 + i); const k = ease.outBack(prog(t, tw - 0.2, tw + 0.15)); const y = cy - h / 2 + 200 + i * 140;
    text(g, s, cx - w / 2 + 160, y, { size: V(54, 48), color: '#1a1622', font: FONTS.ui, weight: 900, align: 'left', alpha: clamp(ease.out(prog(t, 0.3 + i * 0.25, 0.6 + i * 0.25))) });
    if (k > 0) { g.save(); g.translate(cx - w / 2 + 90, y); g.scale(k, k); circle(g, 0, 0, 38, '#e0302a'); seg(g, [[-14, -14], [14, 14]], 9, '#fff'); seg(g, [[14, -14], [-14, 14]], 9, '#fff'); g.restore(); seg(g, [[cx - w / 2 + 150, y], [lerp(cx - w / 2 + 150, cx + w / 2 - 80, clamp(k)), y]], 5, alpha('#e0302a', 0.8)); } });
} });
registerShot('s123', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.3, -160, -200); const R = street(g, t, cam, { mood: 'night', fence: false }); const GY = R.GY, s = V(1.5, 1.55), bx = CX() + V(60, 40) - t * 30;
  layer(g, cam, 1, g => car(g, CX() + V(520, 360), GY + 10, 1.4, { lights: true }));
  act(g, t, info, cam, [{ who: BLACK, x: bx, y: GY, s, facing: -1, pose: { ...POSES.sad, eF: [14, -128], hF: [30, -104] }, expr: 'sad', seed: 5 }], R.rim);
  layer(g, cam, 1, g => { const hx = bx - 30 * s, hy = GY - 104 * s; rr(g, hx - 50, hy, 100, 70, 8); g.fillStyle = '#1a1418'; g.fill(); g.strokeStyle = '#3a3038'; g.lineWidth = 3; g.stroke(); });
  FX.rain(g, t, { count: 160, color: '#cfd9ff', a: 0.35, seed: 5 });
  pop(g, t, 'NADA QUE VENDER', E.W * 0.3, E.H * 0.2, wt(info, 'nada', 1.0), { size: V(56, 52), color: ui().cream });
} });
// --- Leo y el café ---
registerShot('s124', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.15, z1: 1.2, x0: 80, x1: 40, y0: 60, y1: 60 }); const R = corridor(g, t, cam); const GY = R.GY;
  layer(g, cam, 1, g => { rr(g, CX() - V(560, 380), GY - 110, 360, 20, 8); g.fillStyle = '#3a4258'; g.fill(); for (const d of [20, 320]) seg(g, [[CX() - V(560, 380) + d, GY - 100], [CX() - V(560, 380) + d, GY]], 10, '#2a3044'); });
  act(g, t, info, cam, [
    { who: SAM, x: CX() - V(400, 260), y: GY - 30, s: 1.3, facing: 1, pose: { ...POSES.sit, head: [14, -172] }, expr: [[0, 'sleepy'], [1.2, 'surprised']], seed: 1, shadow: false },
    { who: LEO, x: CX() + V(560, 360) - t * 190, y: GY, s: 1.3, facing: -1, pose: { ...walkPose(t * 5.5), eF: [22, -132], hF: [38, -146] }, prop: 'cup', expr: 'happy', still: true },
  ], R.rim);
} });
registerShot('s125', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.5, 0, -30); const R = corridor(g, t, cam); const GY = R.GY, s = V(1.6, 1.7);
  act(g, t, info, cam, [
    { who: SAM, x: CX() - V(200, 140), y: GY, s, facing: 1, pose: [[0, 'stand'], [0.5, 'holdFront']], prop: t > 0.5 ? 'cup' : null, expr: [[0, 'smile'], [1.6, 'happy']], seed: 1 },
    { who: LEO, x: CX() + V(160, 110), y: GY, s, facing: -1, pose: [[0, 'holdFront'], [0.6, 'talk']], prop: 'cup', expr: 'smirk', talk: true, seed: 2 },
  ], R.rim);
  layer(g, cam, 1, g => { for (const [x, d] of [[CX() - V(200, 140) + 40 * s, 0], [CX() + V(160, 110) - 40 * s, 1]]) for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3 + d * 0.5) % 1; g.strokeStyle = alpha('#ffffff', 0.3 * (1 - k)); g.lineWidth = 3; g.beginPath(); g.moveTo(x, GY - 200 * s - k * 60); g.quadraticCurveTo(x + 10, GY - 210 * s - k * 60, x, GY - 220 * s - k * 60); g.stroke(); } });
} });
registerShot('s126', { draw(g, t, info) {
  const to = wt(info, 'abre', 0.9); faceShot(g, t, info, { set: clinic, setOpts: { night: true }, who: MAMA, expr: [[0, 'sleepy'], [to, 'neutral'], [to + 0.6, 'smile']], side: -1, bgX: -100, rimColor: '#ffd8b0', noBlink: true, zoom: 0.06,
    after: (g, cx, cy, r) => { if (t > to) glow(g, cx, cy - r * 0.2, r * 1.6, '#ffe0b0', 0.15 * ease.out(prog(t, to, to + 0.6))); } });
} });
registerShot('s127', { draw(g, t, info) {
  blurLayer(g, 14, g => clinic(g, t, { z: 1.6, x: 100, y: -100 }, { night: true })); veil(g, '#0c0810', 0.4);
  const tl = wt(info, 'lápiz', 1.6); const k = ease.inOut(prog(t, tl - 0.8, tl + 0.2)); const ink = S().ink;
  const mx = E.W * 0.62, my = E.H * 0.6; seg(g, [[E.W + 200, my + 100], [mx + 80, my + 10]], 110, '#f29ac0'); g.fillStyle = ink; g.beginPath(); g.ellipse(mx, my, 90, 50, 0.2, 0, 7); g.fill(); for (let i = 0; i < 4; i++) seg(g, [[mx - 50, my - 26 + i * 18], [mx - 110, my - 34 + i * 22 + (i === 0 ? -10 : 0)]], 20, ink);
  const px = lerp(E.W * 0.1, mx - 60, k), py = lerp(E.H * 0.75, my - 10, k); pencil(g, px, py, 0.9, 0.2); arm(g, [-200, E.H * 0.9], [px - 140, py + 30], { sleeve: SAM.color, rim: '#ffd8b0', w: 60 });
  if (t > tl) FX.sparkle(g, mx - 60, my - 20, 30 * ease.outBack(prog(t, tl, tl + 0.3)), '#fff2c0');
} });
registerShot('s128', { draw(g, t, info) {
  const fx = frameX(); const cam = mcam(t, info.dur, 1.35, fx - E.W / 2 - 360, fx - E.W / 2 - 220); const R = kitchen(g, t, cam); const GY = R.GY, s = V(1.5, 1.6);
  const x = lerp(fx - 520, fx - 180, ease.inOut(prog(t, 0.2, info.dur - 0.4)));
  layer(g, cam, 1, g => mama(g, { x, y: GY, s: s * 0.92, facing: 1, outfit: MAMA, pose: { ...walkPose(t * 2.2, { stride: 14, lift: 6, arm: 6 }), hF: [26, -104], eF: [16, -132] }, expr: 'smile', rim: R.rim }));
  act(g, t, info, cam, [{ who: SAM, x: x - 110, y: GY, s, facing: 1, pose: { ...walkPose(t * 2.2), eF: [30, -150], hF: [62, -160] }, expr: 'happy', still: true }], R.rim);
} });
registerShot('s129', { draw(g, t, info) {
  const y20 = markYc(20), cam = { z: 2.3 + 0.05 * t, x: 691 + 80 - E.W / 2 + 40, y: y20 - E.H / 2 + 20 };
  frameClose(g, t, cam, { age: 45, labels: false }); const fx = E.W * V(0.36, 0.3), k = ease.inOut(prog(t, 0.4, 1.8));
  layer(g, cam, 1, g => { seg(g, [[fx + 14, y20], [fx + 14 + 140 * k, y20]], 7, '#2a1a1a'); pencil(g, fx + 14 + 140 * k, y20, 0.6, -0.7); });
  pop(g, t, 'EL MISMO LUGAR', E.W * 0.7, E.H * 0.25, wt(info, 'mismo', 2.0), { size: V(54, 50), color: ui().cream });
} });
registerShot('s130', { draw(g, t, info) {
  const y20 = markYc(20), cam = { z: 1.5 + 0.03 * t, x: E.W * 0.36 + 360 - E.W / 2, y: y20 - E.H / 2 + 40 };
  frameClose(g, t, cam, { age: 45, labels: false }); const t1 = wt(info, 'alto', 0.6) - 0.7, t2 = wt(info, 'mío', 2.2) - 0.7;
  layer(g, cam, 1, g => { const x = E.W * 0.36 + 210; hand(g, 'Igual de alto.', x, y20 + 10, prog(t, t1, t1 + 0.8), { color: '#fff2d8', glow: 24, glowColor: 'rgba(255,200,120,.9)' }); hand(g, 'Igual de mío.', x, y20 + 90, prog(t, t2, t2 + 0.8), { color: '#fff2d8', glow: 24, glowColor: 'rgba(255,200,120,.9)' }); });
  for (let i = 0; i < 8; i++) { const k = (t * 0.4 + i / 8) % 1; heart(g, E.W * (0.55 + (i % 4) * 0.1), E.H * (0.9 - k * 0.7), 10 + (i % 3) * 4, alpha('#ffb0c8', 0.6 * (1 - k))); }
} });
registerShot('s131', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.1, z1: 1.16, x0: -40, x1: 20, y0: 60, y1: 60 }); const R = street(g, t, cam, { mood: 'day' }); const GY = R.GY;
  act(g, t, info, cam, [
    { who: VECINA, x: CX() - V(560, 380), y: GY, s: 1.3, facing: 1, pose: 'wave', expr: 'happy', seed: 3 },
    { who: SAM, x: CX() - V(160, 100) + t * 120, y: GY, s: 1.4, facing: 1, pose: walkPose(t * 5), expr: 'happy', still: true },
    { who: EXTRA, x: CX() + V(560, 380), y: GY, s: 1.3, facing: -1, pose: 'wave', expr: 'smile', seed: 4 },
  ], R.rim);
  FX.dust(g, t, { count: 30, color: '#fff2d0', a: 0.3 });
} });
// --- el giro ---
registerShot('s132', { draw(g, t, info) {
  blurLayer(g, 12, g => street(g, t, { z: 1.6, x: -200, y: -120 }, { mood: 'day', fence: false })); veil(g, '#0c0810', 0.25);
  const cx = E.W * 0.5, cy = E.H * 0.6; seg(g, [[cx, cy + 60], [cx, E.H + 50]], 30, '#2a2228'); rr(g, cx - 210, cy - 170, 420, 230, 110); g.fillStyle = '#3a6ea5'; g.fill(); g.fillStyle = '#1a1622'; rr(g, cx - 150, cy - 70, 300, 40, 20); g.fill(); seg(g, [[cx + 190, cy - 140], [cx + 190, cy - 260]], 10, '#d64a33'); poly(g, [[cx + 190, cy - 260], [cx + 280, cy - 230], [cx + 190, cy - 200]], '#d64a33');
  const k = ease.out(prog(t, 0.3, 1.4)); g.save(); g.translate(cx, cy - 50 - k * 160); g.rotate(-0.08); rr(g, -150, -90, 300, 180, 8); g.fillStyle = '#f2e6c8'; g.fill(); poly(g, [[-150, -90], [0, 10], [150, -90]], '#e0d2b0'); circle(g, 0, 10, 20, '#a0283c'); text(g, 'Para: Sam', -10, 50, { size: 28, color: '#3a2a2a', font: FONTS.serif, weight: 900, italic: true }); g.restore();
  UI.badge(g, { str: '3 SEMANAS DESPUÉS', a: ease.out(prog(t, 0.1, 0.4)), size: V(44, 44), color: ui().cream });
  pop(g, t, 'LETRA A MANO', E.W * 0.2, E.H * 0.3, wt(info, 'Letra', 3.3), { size: V(50, 48), font: FONTS.serif, italic: true, color: ui().cream });
} });
function letter(g, t, lines) { backdrop(g, ['#2a1c18', '#3a2620']); glow(g, E.W / 2, E.H * 0.4, 900, '#ffcf8f', 0.2); const cx = E.W / 2, w = V(1100, 900), h = E.H * 1.1; g.save(); g.translate(cx, E.H * 0.55); g.rotate(-0.02); rr(g, -w / 2, -h / 2, w, h, 6); g.fillStyle = '#f2e6c8'; g.fill(); g.strokeStyle = 'rgba(120,90,60,.2)'; g.lineWidth = 2; for (let y = -h / 2 + 120; y < h / 2; y += 90) { g.beginPath(); g.moveTo(-w / 2 + 60, y); g.lineTo(w / 2 - 60, y); g.stroke(); } g.restore();
  lines.forEach(([s, k, o = {}], i) => hand(g, s, cx - w / 2 + 90, E.H * 0.55 - h / 2 + 290 + i * 86, k, { size: V(54, 48), color: o.color || '#3a2a2a', glow: o.glow, glowColor: o.glowColor })); }
registerShot('s133', { draw(g, t, info) {
  const cam = { z: 1.05 + 0.02 * t }; const a = 0.1, b = wt(info, 'Yo', 1.9);
  layer(g, cam, 1, g => letter(g, t, [['Lo vi en las noticias.', prog(t, a, a + 1.2)], ['Yo también me detuve a los veinte.', prog(t, b, b + 1.8)]]));
  FX.dust(g, t, { count: 25, color: '#ffe2bd', a: 0.3 });
} });
registerShot('s134', { draw(g, t, info) {
  const cam = { z: 1.08 + 0.03 * t }; const tY = wt(info, '1890', 0.3), tT = wt(info, 'Tenemos', 2.0);
  layer(g, cam, 1, g => letter(g, t, [['Lo vi en las noticias.', 1], ['Yo también me detuve a los veinte.', 1], ['En 1890.', prog(t, tY - 0.2, tY + 0.5), { color: '#a0283c' }], ['Tenemos que hablar.', prog(t, tT, tT + 1.0)]]));
  const k = ease.outBack(prog(t, tY + 0.3, tY + 0.8)); if (k > 0) { g.save(); g.translate(E.W * 0.8, E.H * 0.6); g.scale(k, k); g.rotate(0.08); photoFrame(g, -160, -200, 320, 380, '1890', { sepia: true, draw: (g, x, y, w, h) => { const r = w * 0.3; bigFace(g, x + w / 2, y + h * 0.58, r, { outfit: { top: 'suit', color: '#3a2a20', head: 'fedora', headColor: '#2a1a14' }, expr: 'neutral', rimColor: '#fff3dc' }); } }); g.restore(); }
  FX.dust(g, t, { count: 25, color: '#ffe2bd', a: 0.3 });
} });
// --- cierre ---
registerShot('s135', { draw(g, t, info) {
  UI.endScreen(g, t, { question: '¿Y tú qué harías con 20 años para siempre?', subscribe: 'Suscríbete', cast: [SAM, LEO, MAMA, DOCTORA, LEE, BLACK], moodColors: ['#1b1426', '#2a1a2e', '#5a2e22'] });
  const tc = wt(info, 'Cuéntanos', 3.1); pop(g, t, '¿A QUÉ EDAD TE DETENDRÍAS?', E.W / 2, V(430, 700), tc, { size: V(44, 44), color: ui().gold });
} });
registerShot('s136', { draw(g, t, info) {
  const y20 = markYc(20), cam = { z: 1.6 + 0.03 * t, x: E.W * 0.36 + 300 - E.W / 2, y: y20 - E.H / 2 + 60 };
  frameClose(g, t, cam, { age: 45, labels: false });
  layer(g, cam, 1, g => { const x = E.W * 0.36 + 200; hand(g, 'Igual de alto.', x, y20 + 10, 1, { color: '#fff2d8', glow: 18, glowColor: 'rgba(255,200,120,.8)', size: 52 }); const b = 1 + 0.1 * Math.pow(Math.max(0, Math.sin(t * 6)), 8); heart(g, E.W * 0.36 + 85, y20 - 50, 26 * b, '#ff5a7a'); glow(g, E.W * 0.36 + 85, y20 - 50, 120, '#ff5a7a', 0.4); });
  const tl = wt(info, 'like', 2.6), tp = wt(info, 'Parte', 4.8);
  if (t > tl) { const k = ease.outBack(prog(t, tl, tl + 0.4)); g.save(); g.translate(E.W * 0.7, E.H * 0.6); g.scale(k, k); rr(g, -170, -44, 340, 88, 44); g.fillStyle = '#e0302a'; g.fill(); text(g, 'Suscríbete', 0, 2, { size: 40, color: '#fff', font: FONTS.ui, weight: 900 }); g.restore(); heart(g, E.W * 0.7 - 260, E.H * 0.6, 34 * k, '#ff5a7a'); }
  if (t > tp - 0.2) UI.titleCard(g, t - tp + 0.2, { lines: ['PRÓXIMAMENTE', 'PARTE 2'], dur: info.dur - tp + 1, y: E.H * 0.28 });
} });
