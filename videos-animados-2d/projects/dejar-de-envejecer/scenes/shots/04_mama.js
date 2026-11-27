// 04_mama.js — s066–s077: la casa de mamá, la cocina y las rayitas del marco.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, text, FONTS, glow, alpha, shade, mix, rr, seg, circle, ring, poly, rng } from '/engine/core.js';
import { bigFace, POSES, walkPose } from '/engine/rig2d.js';
import { push, mcam, pick, wt, act, faceShot, tag, pop, ui, FX, UI } from './_lib.js';
import { street, kitchen, frameX, ground } from '../sets/places.js';
import { SAM, MAMA, fig } from '../cast.js';

const CX = () => E.W / 2;
// mamá con bastón (dibujado desde la mano lejana al piso)
export function mama(g, o) { fig(g, o); if (o.cane !== false) { const s = o.s ?? 1, f = o.facing ?? 1, p = o.pose || POSES.stand; const hx = o.x + f * p.hF[0] * s, hy = o.y + p.hF[1] * s; seg(g, [[hx, hy - 6 * s], [hx + f * 8 * s, o.y]], 5 * s, '#5a3424'); seg(g, [[hx - f * 8 * s, hy - 8 * s], [hx + f * 4 * s, hy - 10 * s]], 5 * s, '#5a3424'); } }
const OLD = { ...POSES.stand, head: [12, -200], sh: [6, -170], eF: [16, -132], hF: [26, -104] };
const oldWalk = (ph) => { const w = walkPose(ph, { stride: 14, lift: 6, arm: 6 }); return { ...w, head: [w.head[0] + 10, w.head[1] + 8], sh: [w.sh[0] + 6, w.sh[1] + 4], eF: [16, -132], hF: [26, -104] }; };

// ---------- primer plano del marco (madera, pared, rayitas) ----------
// base = y del piso en pantalla; marca a (1..45) en markYc(a)
const FRAME = { x: () => E.W * V(0.36, 0.3), w: () => V(170, 170), base: 1900, top: 1700 };
export const markYc = (a) => FRAME.base - (Math.min(a, 20) / 20) * FRAME.top - (a <= 20 ? 0 : 0);
export function frameClose(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), fx = FRAME.x(), fw = FRAME.w();
  layer(g, cam, 0.6, g => { backdrop(g, ['#3a2426', '#5a3a36', '#4a2e2e'], [-E.W, -3000, E.W * 3, 6000]); glow(g, fx - 500, -200, 1400, M.practical, 0.18); });
  layer(g, cam, 1, g => {
    // pasillo oscuro a la derecha del marco
    g.fillStyle = linG(g); g.fillRect(fx + fw, -3000, E.W * 2, 6000); g.fillStyle = alpha('#ffd28a', 0.05); g.fillRect(fx + fw, -3000, E.W * 2, 6000);
    // poste de madera
    g.fillStyle = '#d8c0a0'; g.fillRect(fx, -3000, fw, 6000); g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(fx + fw - 16, -3000, 16, 6000); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(fx + 8, -3000, 6, 6000);
    for (let i = 0; i < 9; i++) { g.strokeStyle = 'rgba(120,80,50,.18)'; g.lineWidth = 2; g.beginPath(); g.moveTo(fx + 30 + i * 15, -3000); g.lineTo(fx + 30 + i * 15 + Math.sin(i) * 10, 6000); g.stroke(); }
    g.fillStyle = '#3a2420'; g.fillRect(-E.W, FRAME.base, E.W * 4, 400); // zócalo/piso
    const show = o.age ?? 0, ink = '#3a2a2a';
    for (let a = 1; a <= Math.min(show, 45); a++) { const y = markYc(a), on = o.appear ? clamp((show - a) * 3 + 1) : 1; if (on <= 0) continue;
      const stacked = a > 20; seg(g, [[fx + 14, y], [fx + 14 + (fw - 30) * on, y]], stacked ? 4 : 5, alpha(ink, stacked ? 0.55 : 0.85));
      if (a <= 20 && (o.labels ?? true)) text(g, String(a), fx + fw - 34, y - 22, { size: 28, color: alpha(ink, 0.8 * on), font: FONTS.serif, weight: 900, italic: true }); }
    o.extra?.(g, fx, fw);
  });
}
function linG(g) { const gr = g.createLinearGradient(0, 0, 0, 1080); gr.addColorStop(0, '#1a1012'); gr.addColorStop(1, '#2a1a1a'); return gr; }
// lápiz en primer plano (punta en x,y)
export function pencil(g, x, y, s = 1, rot = -0.6) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); poly(g, [[0, 0], [30, -12], [30, 12]], '#e8c8a0'); poly(g, [[0, 0], [10, -4], [10, 4]], '#2a2228'); g.fillStyle = '#f2c21a'; g.fillRect(30, -12, 260, 24); g.fillStyle = '#d8a810'; g.fillRect(30, 4, 260, 8); g.fillStyle = '#c0c0c8'; g.fillRect(290, -12, 26, 24); g.fillStyle = '#f29ac0'; rr(g, 316, -12, 36, 24, 8); g.fill(); g.restore(); }
// letra de mamá que se escribe sola (revelado de izquierda a derecha)
export function hand(g, str, x, y, k, o = {}) { if (k <= 0) return; const size = o.size || V(64, 60); g.save(); g.font = `italic 900 ${size}px "${FONTS.serif}"`; const w = g.measureText(str).width; g.beginPath(); g.rect(x - 10, y - size, (w + 20) * clamp(k), size * 2); g.clip(); text(g, str, x, y, { size, font: FONTS.serif, weight: 900, italic: true, color: o.color || '#3a2a2a', align: 'left', glow: o.glow || 0, glowColor: o.glowColor }); g.restore(); }
const camAt = (yWorld, z = 1, x = 0) => ({ z, x, y: yWorld - E.H / 2 });

// s066 — la casa de mamá
registerShot('s066', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.5, z1: 1.75, x0: -20, x1: -20, y0: -60, y1: -40 }); const R = street(g, t, cam, { mood: 'dusk', fence: false });
  layer(g, cam, 0.6, g => glow(g, CX() - 20, R.GY - 300, 520, R.M.practical, 0.25));
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.3 });
} });
// s067 — "Tu mamá. Tiene setenta y ocho años."
registerShot('s067', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.45, -260, -290); const R = kitchen(g, t, cam); const GY = R.GY, s = V(1.55, 1.6), x = CX() - V(420, 300);
  act(g, t, info, cam, [], R.rim);
  layer(g, cam, 1, g => mama(g, { x, y: GY, s, facing: 1, outfit: MAMA, pose: OLD, expr: 'smile', rim: R.rim, blink: (t % 3.3) > 3.2 }));
  layer(g, cam, 1, g => pop(g, t, '78 AÑOS', x + V(260, 200), GY - 330 * s, wt(info, 'setenta', 1.0), { size: V(70, 70) }));
} });
// s068 — "Camina despacio."
registerShot('s068', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.4, -140, -110); const R = kitchen(g, t, cam); const GY = R.GY, s = V(1.55, 1.6), x = CX() - V(480, 320) + t * 50;
  layer(g, cam, 1, g => mama(g, { x, y: GY, s, facing: 1, outfit: MAMA, pose: oldWalk(t * 2.2), expr: 'neutral', rim: R.rim }));
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });
// s069 — la cámara sube por el marco de la puerta hasta las rayitas
registerShot('s069', { draw(g, t, info) {
  const fx = frameX(), GY = ground(); const k = ease.inOut(prog(t, 0.2, info.dur - 0.3));
  const cam = { z: lerp(1.4, 2.6, k), x: fx - E.W / 2 + lerp(60, 20, k), y: lerp(GY - 300, GY - 300, k) - E.H / 2 };
  kitchen(g, t, cam);
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
  if (t > wt(info, 'rayitas', 2.8)) FX.sparkle(g, E.W / 2 - 40, E.H * 0.45, 30 * ease.outBack(prog(t, wt(info, 'rayitas', 2.8), wt(info, 'rayitas', 2.8) + 0.3)), '#fff2c0');
} });
// s070 — una por cada cumpleaños
registerShot('s070', { draw(g, t, info) {
  const age = 1 + t * 5.2; frameClose(g, t, camAt(markYc(3), 1.6, FRAME.x() + 60 - E.W / 2 + 160), { age, appear: true });
  FX.dust(g, t, { count: 25, color: '#ffe2bd', a: 0.3 });
} });
// s071 — subieron hasta los veinte (la cámara sube con ellas)
registerShot('s071', { draw(g, t, info) {
  const k = ease.inOut(prog(t, 0, info.dur - 0.4)), age = lerp(6, 20.9, k);
  const cy = markYc(Math.min(age, 20)) + 120;
  frameClose(g, t, { z: 1.0, x: FRAME.x() + 60 - E.W / 2 + 200, y: cy - E.H / 2 }, { age, appear: true, labels: true, extra: (g, fx, fw) => {
    const sc = lerp(0.5, 7.0, Math.min(age, 20) / 20); fig(g, { x: fx + fw + 160, y: FRAME.base, s: sc, facing: -1, outfit: SAM, pose: POSES.stand, expr: 'smile', rim: { color: '#ffcf8f', dir: [-1, -0.3] }, alpha: 0.85, shadow: false });
  } });
  if (age >= 20) pop(g, t, '20', E.W * 0.62, E.H * 0.3, info.dur - 0.5, { size: 110 });
} });
// s072 — después se quedaron en el mismo lugar
registerShot('s072', { draw(g, t, info) {
  const age = 20 + clamp((t - 0.3) / (info.dur - 0.6)) * 25; const y20 = markYc(20);
  frameClose(g, t, { z: 1.7 + 0.04 * t, x: FRAME.x() + 60 - E.W / 2 + 120, y: y20 - E.H / 2 }, { age, labels: false });
  const fx = FRAME.x(), n = Math.floor(age);
  layer(g, { z: 1.7 + 0.04 * t, x: FRAME.x() + 60 - E.W / 2 + 120, y: y20 - E.H / 2 }, 1, g => { for (let a = 21; a <= n; a++) { const k = clamp((age - a) * 2); text(g, String(a), fx + FRAME.w() + 30 + ((a - 21) % 5) * 42, y20 - 30 - Math.floor((a - 21) / 5) * 34, { size: 26, color: alpha('#ffe8c8', 0.75 * k), font: FONTS.serif, weight: 900, italic: true, align: 'left' }); } text(g, '20', fx + FRAME.w() - 34, y20 - 22, { size: 28, color: '#3a2a2a', font: FONTS.serif, weight: 900, italic: true }); });
  FX.dust(g, t, { count: 25, color: '#ffe2bd', a: 0.3 });
} });
// s073 — "Pero ella nunca dejó de marcarlas." mamá marca la altura de Sam
registerShot('s073', { draw(g, t, info) {
  const fx = frameX(); const cam = mcam(t, info.dur, 1.55, fx - E.W / 2 - 40, fx - E.W / 2 - 70); const R = kitchen(g, t, cam); const GY = R.GY, s = V(1.6, 1.7);
  const reach = { ...OLD, eF: [30, -200], hF: [60, -232], head: [10, -204] };
  act(g, t, info, cam, [{ who: SAM, x: fx + 40, y: GY, s, facing: -1, pose: 'stand', expr: 'smile', look: [0, -0.6], seed: 1 }], R.rim);
  layer(g, cam, 1, g => { mama(g, { x: fx - 150, y: GY, s: s * 0.92, facing: 1, outfit: MAMA, pose: reach, expr: 'happy', rim: R.rim, cane: false }); });
} });
// s074 — cada año otra línea encima de la anterior
registerShot('s074', { draw(g, t, info) {
  const y20 = markYc(20), cam = { z: 2.3 + 0.05 * t, x: FRAME.x() + 80 - E.W / 2 + 40, y: y20 - E.H / 2 + 20 };
  frameClose(g, t, cam, { age: 45, labels: false });
  const k = ease.inOut(prog(t, 0.4, 1.8)), fx = FRAME.x();
  layer(g, cam, 1, g => { seg(g, [[fx + 14, y20], [fx + 14 + (FRAME.w() - 30) * k, y20]], 6, '#2a1a1a'); pencil(g, fx + 14 + (FRAME.w() - 30) * k, y20, 0.6, -0.7); });
  UI.badge(g, { str: '2026', a: ease.out(prog(t, 0.3, 0.6)), color: ui().cream });
} });
// s075 — "Igual de alto. Igual de mío."
registerShot('s075', { draw(g, t, info) {
  const y20 = markYc(20), cam = { z: 1.5 + 0.03 * t, x: FRAME.x() + 360 - E.W / 2, y: y20 - E.H / 2 + 40 };
  frameClose(g, t, cam, { age: 45, labels: false });
  const t1 = wt(info, 'alto', 1.0) - 0.7, t2 = wt(info, 'mío', 3.8) - 0.7;
  layer(g, cam, 1, g => { const x = FRAME.x() + FRAME.w() + 40; hand(g, 'Igual de alto.', x, y20 + 10, prog(t, t1 - 0.1, t1 + 0.9), { color: '#ffe8c8', glow: 10, glowColor: 'rgba(255,200,120,.6)' }); hand(g, 'Igual de mío.', x, y20 + 90, prog(t, t2, t2 + 0.9), { color: '#ffe8c8', glow: 10, glowColor: 'rgba(255,200,120,.6)' }); });
  FX.dust(g, t, { count: 25, color: '#ffe2bd', a: 0.35 });
} });
// s076 — "¿Mamá, por qué sigues haciendo eso?"
registerShot('s076', { draw(g, t, info) {
  const fx = frameX(); const cam = mcam(t, info.dur, 1.5, fx - E.W / 2 - 120, fx - E.W / 2 - 150); const R = kitchen(g, t, cam); const GY = R.GY, s = V(1.6, 1.7);
  act(g, t, info, cam, [{ who: SAM, x: fx + 60, y: GY, s, facing: -1, pose: 'shrug', expr: 'smile', talk: true, seed: 1 }], R.rim);
  layer(g, cam, 1, g => mama(g, { x: fx - 260, y: GY, s: s * 0.92, facing: 1, outfit: MAMA, pose: OLD, expr: 'smile', rim: R.rim }));
} });
// s077 — "Porque los años no se miden en centímetros, Sam."
registerShot('s077', { draw(g, t, info) { faceShot(g, t, info, { set: kitchen, who: MAMA, expr: 'smile', talk: true, side: -1, bgX: 260, bgY: -200, zoom: 0.06, scale: 0.95 }); } });
