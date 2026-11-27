// 03_gente.js — s045–s065: la gente, las fotos, los vecinos, la mudanza, Toby, la orilla, la soledad, esconderse.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, text, FONTS, glow, alpha, shade, mix, rr, seg, circle, ring, poly, rng } from '/engine/core.js';
import { bigFace, POSES, walkPose } from '/engine/rig2d.js';
import { push, mcam, pick, wt, act, faceShot, tag, pop, panel, bigPhone, ui, FX, UI } from './_lib.js';
import { street, park, shore, boat, apartment, office, ground } from '../sets/places.js';
import { SAM, LEO, MAMA, VECINA, EXTRA, dog, fig } from '../cast.js';

const CX = () => E.W / 2;
const COWORKER = { top: 'tshirt', color: '#8a5ad6', head: 'ponytail' };
const NEIGHBOR2 = { top: 'tshirt', color: '#5a6a4a', head: 'capBack', headColor: '#3fb950' };
const box = (g, hand, s, c = '#9a6a44') => { const w = 70 * s, h = 54 * s; g.fillStyle = c; g.fillRect(hand[0] - w / 2, hand[1] - h + 6 * s, w, h); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(hand[0] - 6 * s, hand[1] - h + 6 * s, 12 * s, h); };
const carry = { ...POSES.holdFront, eF: [22, -128], hF: [40, -136], eB: [16, -130], hB: [34, -138] };

// s045 — la gente pasa, Sam quieto
registerShot('s045', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.12, z1: 1.2, x0: 0, x1: 0, y0: 60, y1: 70 }); const R = street(g, t, cam, { mood: 'dusk' }); const GY = R.GY;
  const r = rng(11); const list = [];
  for (let i = 0; i < 12; i++) { const dir = r() < 0.5 ? 1 : -1, sp = 600 + r() * 500, x0 = r() * E.W * 1.6 - E.W * 0.3; const x = ((x0 + dir * t * sp) % (E.W * 1.6) + E.W * 1.6) % (E.W * 1.6) - E.W * 0.3; const depth = r();
    list.push({ who: EXTRA, x, y: GY + depth * 30, s: 1.05 + depth * 0.3, facing: dir, pose: walkPose((t * sp / 160) * Math.PI * 2 * 0.25 + i, { run: false }), alpha: 0.5, still: true, trail: { count: 3, dx: -dir * 40, a: 0.25 }, rings: false }); }
  list.sort((a, b) => a.y - b.y); list.splice(6, 0, { who: SAM, x: CX(), y: GY + 15, s: 1.3, facing: 1, pose: 'relaxed', expr: 'sad', seed: 1 });
  act(g, t, info, cam, list, R.rim);
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.3 });
} });
// s046 — "Dejas de publicar fotos."
registerShot('s046', { draw(g, t, info) {
  blurLayer(g, 16, g => apartment(g, t, { z: 1.5, x: 200, y: -120 })); veil(g, '#0c0810', 0.45);
  const fade = ease.inOut(prog(t, 0.5, 1.6));
  bigPhone(g, t, E.W / 2, E.H * 0.55 + 10 * Math.sin(t), V(780, 900), { draw: (g, x, y, w, h) => {
    text(g, '@sam', x + 30, y + 50, { size: 34, color: '#fff', font: FONTS.ui, weight: 900, align: 'left' });
    text(g, '0 PUBLICACIONES NUEVAS', x + 30, y + 96, { size: 18, color: '#8fa6c8', font: FONTS.ui, weight: 900, align: 'left', spacing: 1 });
    const cs = (w - 40) / 3; const cols = ['#c86a4a', '#5a8ac8', '#e8b86a', '#8ab08a', '#a08ac8', '#d88aa0', '#6ac0c0', '#c8a06a', '#7a7ad8'];
    for (let i = 0; i < 9; i++) { const cx = x + 16 + (i % 3) * (cs + 4), cy = y + 140 + Math.floor(i / 3) * (cs + 4); g.fillStyle = mix(cols[i], '#2a2a36', i < 3 ? fade * 0.85 : 0.85); g.fillRect(cx, cy, cs, cs); if (i < 3) { circle(g, cx + cs / 2, cy + cs * 0.55, cs * 0.25, alpha('#0e0b12', 1 - fade * 0.6)); } }
    text(g, 'ÚLTIMA FOTO: 2016', x + w / 2, y + 140 + 3 * (cs + 4) + 50, { size: 26, color: ui().accent, font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 0.8, 1.2)) });
  } });
} });
// s047 — "Tus vecinos empiezan a preguntar."
registerShot('s047', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.45, -300, -330, 0.88); const R = street(g, t, cam, { mood: 'dusk' }); const GY = R.GY, s = V(1.5, 1.6);
  act(g, t, info, cam, [
    { who: VECINA, x: CX() - V(560, 380), y: GY, s, facing: 1, pose: { ...POSES.talk, head: [14, -204] }, expr: 'confused', talk: [0.2, 1.4], seed: 3 },
    { who: NEIGHBOR2, x: CX() - V(430, 280), y: GY, s, facing: -1, pose: 'think', expr: 'thinking', seed: 4 },
    { who: SAM, x: CX() + V(60, 40) - t * 60, y: GY, s: s * 0.8, facing: -1, pose: walkPose(t * 5), expr: 'neutral', still: true },
  ], R.rim);
  layer(g, cam, 1, g => { const k = ease.outBack(prog(t, 0.3, 0.6)); if (k > 0) { g.save(); g.translate(CX() - V(500, 330), GY - 320 * s); g.scale(k, k); UI.bubble(g, 0, 0, { w: 90, h: 80, str: '?', dots: false }); g.restore(); } });
} });
// s048 — "¿Tu hijo vive contigo?"
registerShot('s048', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.5, -120, -150); const R = street(g, t, cam, { mood: 'dusk' }); const GY = R.GY, s = V(1.6, 1.7);
  act(g, t, info, cam, [
    { who: VECINA, x: CX() - V(330, 230), y: GY, s, facing: 1, pose: 'talk', expr: 'confused', talk: true, seed: 3 },
    { who: SAM, x: CX() + V(80, 60), y: GY, s, facing: -1, pose: carry, expr: [[0, 'smile'], [1.0, 'nervous']], seed: 1 },
  ], R.rim);
  layer(g, cam, 1, g => { const sx = CX() + V(80, 60); g.save(); g.translate(sx, GY); g.scale(-s, s); box(g, [40, -136], 1, '#e8dcc8'); g.restore(); });
} });
// s049 — "No. Soy yo."
registerShot('s049', { draw(g, t, info) { faceShot(g, t, info, { set: street, setOpts: { mood: 'dusk' }, who: SAM, expr: [[0, 'nervous'], [0.6, 'smile']], talk: true, side: 1, bgX: 200, face: { sweat: true } }); } });
// s050 — "Te mudas cada diez años."
registerShot('s050', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.15, z1: 1.2, x0: 60, x1: 20, y0: 60, y1: 60 }); const R = street(g, t, cam, { mood: 'dusk' }); const GY = R.GY;
  layer(g, cam, 1, g => { const tx = CX() + V(260, 160); g.fillStyle = '#e8dcc8'; g.fillRect(tx, GY - 340, 520, 280); g.fillStyle = '#2a2230'; g.fillRect(tx + 520, GY - 230, 190, 170); poly(g, [[tx + 600, GY - 230], [tx + 700, GY - 230], [tx + 710, GY - 160], [tx + 600, GY - 160]], '#5a6a8a'); text(g, 'MUDANZAS', tx + 260, GY - 200, { size: 52, color: '#d64a33', font: FONTS.ui, weight: 900, spacing: 4 }); for (const wx of [tx + 100, tx + 600]) { circle(g, wx, GY - 50, 50, '#0e0b12'); circle(g, wx, GY - 50, 20, '#5a5a66'); } });
  const sx = CX() - V(340, 200) + t * 150;
  act(g, t, info, cam, [{ who: SAM, x: sx, y: GY, s: 1.35, facing: 1, pose: { ...walkPose(t * 5.5), hF: [40, -136], eF: [22, -128], hB: [34, -138], eB: [16, -130] }, expr: 'neutral', still: true }], R.rim);
  layer(g, cam, 1, g => { g.save(); g.translate(sx, GY); g.scale(1.35, 1.35); box(g, [40, -136], 1.2); g.restore(); });
  const yrs = ['2006', '2016', '2026'], k = Math.min(2, Math.floor(prog(t, 0.3, info.dur - 0.3) * 3));
  UI.badge(g, { str: 'AÑO ' + yrs[k], a: ease.out(prog(t, 0.2, 0.5)), size: V(52, 56) });
  pop(g, t, 'CADA 10 AÑOS', E.W * 0.3, E.H * 0.22, 0.2, { size: V(60, 60), color: ui().cream });
} });
// --- Toby ---
registerShot('s051', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.35, -60, -90); const R = park(g, t, cam); const GY = R.GY, s = V(1.5, 1.6), dx = CX() + V(140, 100) + Math.sin(t * 2.5) * 80;
  act(g, t, info, cam, [{ who: SAM, x: CX() - V(200, 140), y: GY, s, facing: 1, pose: [[0, 'relaxed'], [0.4, 'wave']], expr: 'joy', seed: 1 }], R.rim);
  layer(g, cam, 1, g => { dog(g, dx, GY, 0.9, { facing: -1, t, mode: 'jump', age: 0, rim: R.M.rim }); tag(g, t, [dx, GY - 120], [dx + V(220, 150), GY - 320], 'TOBY', wt(info, 'Toby', 0.8)); });
} });
registerShot('s052', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.35, -60, -80); const R = park(g, t, cam, { mood: 'dusk' }); const GY = R.GY, s = V(1.5, 1.6);
  act(g, t, info, cam, [{ who: SAM, x: CX() - V(200, 140) + t * 40, y: GY, s, facing: 1, pose: walkPose(t * 3.2), expr: 'sad', still: true }], R.rim);
  layer(g, cam, 1, g => dog(g, CX() + V(120, 80) + t * 40, GY, 1.1, { facing: 1, t: t * 0.5, mode: 'walk', age: 0.55, rim: R.M.rim }));
} });
registerShot('s053', { draw(g, t, info) {
  blurLayer(g, 14, g => park(g, t, { z: 1.6, x: 100, y: -150 }, { mood: 'dusk' })); veil(g, '#120a10', 0.35);
  const age = ease.inOut(prog(t, 0.2, info.dur - 0.2)); const s = V(5.2, 5) * (1 + 0.03 * t);
  dog(g, E.W / 2 - 60 * s, E.H * 0.5 + 75 * s, s, { facing: 1, t: 0.2, mode: 'stand', age: 0.2 + 0.8 * age, rim: '#ffc68a' });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.35 });
} });
const holdDog = { ...POSES.stand, eF: [24, -132], hF: [44, -146], eB: [18, -134], hB: [38, -150], head: [6, -206] };
registerShot('s054', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.0, z1: 1.05, x0: -30, x1: 20 }); const R = park(g, t, cam, { mood: 'dusk' }); const GY = R.GY, s = 1.0, x = CX() - V(200, 100) + t * 50;
  act(g, t, info, cam, [{ who: SAM, x, y: GY, s, facing: 1, pose: { ...walkPose(t * 3), ...{ eF: holdDog.eF, hF: holdDog.hF, eB: holdDog.eB, hB: holdDog.hB } }, expr: 'sad', still: true }], R.rim);
  layer(g, cam, 1, g => dog(g, x + 36 * s, GY - 122 * s, 0.42 * s, { facing: 1, t: 0, age: 1, rim: R.M.rim }));
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.35 });
} });
registerShot('s055', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.7, -40, -60, 0.95); const R = park(g, t, cam, { mood: 'dusk' }); const GY = R.GY, s = V(1.7, 1.8), x = CX() - V(80, 40);
  act(g, t, info, cam, [{ who: SAM, x, y: GY, s, facing: 1, pose: holdDog, expr: [[0, 'sad'], [2.2, 'cry']], seed: 1 }], R.rim);
  layer(g, cam, 1, g => dog(g, x + 36 * s, GY - 124 * s, 0.42 * s, { facing: 1, t: 0, age: 1, rim: R.M.rim }));
  const t20 = wt(info, 'veinte', 1.2), t14 = wt(info, 'catorce', 2.6);
  layer(g, cam, 1, g => { pop(g, t, '20', x - 150, GY - 220 * s, t20, { size: 80 }); pop(g, t, '14', x + 220, GY - 160 * s, t14, { size: 80, color: '#d8d4e4' }); });
} });
// s056 — "Y hay un costo. Nadie habla de él."
registerShot('s056', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.25, z1: 1.32, x0: 0, x1: -20, y0: -60, y1: -60 }); const R = apartment(g, t, cam, { rain: true }); const GY = R.GY;
  act(g, t, info, cam, [{ who: SAM, x: CX() + V(40, 0), y: GY, s: 1.5, facing: -1, pose: 'sad', expr: 'sad', seed: 1, rim: { color: '#bcd0ff', dir: [0, -1] } }], R.rim);
  UI.bigLine(g, t - wt(info, 'costo', 0.6) + 0.1, { str: 'EL COSTO', dur: 2.6, y: E.H * 0.2, color: ui().accent, size: V(90, 80) });
} });
// --- la orilla ---
function boatScene(g, t, info, o) {
  const cam = o.cam; const R = shore(g, t, cam); const GY = R.GY, HZ = R.HZ;
  const k = o.k; const bx = lerp(CX() + V(60, 40), CX() + V(420, 160), k), by = lerp(GY + 60, HZ + 24, Math.pow(k, 0.7)), bs = lerp(1.0, 0.18, Math.pow(k, 0.6));
  layer(g, cam, 0.9, g => {
    const ageK = o.age ?? 0; const bend = { ...POSES.sad, head: [16, -184], sh: [8, -160] };
    const pl = ageK > 0.5 ? bend : POSES.stand;
    fig(g, { x: bx - 70 * bs, y: by - 58 * bs, s: 0.85 * bs, facing: -1, outfit: LEO, pose: pl, expr: ageK > 0.5 ? 'sad' : 'smile', rim: R.rim, shadow: false });
    fig(g, { x: bx + 40 * bs, y: by - 58 * bs, s: 0.85 * bs, facing: -1, outfit: MAMA, pose: ageK > 0.3 ? bend : POSES.wave, expr: 'smile', rim: R.rim, shadow: false });
    boat(g, bx, by, bs);
    g.fillStyle = alpha('#ffe0b0', 0.2); g.fillRect(bx - 200 * bs, by + 12 * bs, 400 * bs, 3);
  });
  if (o.sam !== false) act(g, t, info, cam, [{ who: SAM, x: CX() - V(500, 300), y: GY - 14, s: o.samS ?? 1.3, facing: 1, pose: o.samPose || 'relaxed', expr: 'sad', seed: 1 }], R.rim);
  FX.dust(g, t, { count: 25, color: '#ffd0b0', a: 0.3 });
  return R;
}
registerShot('s057', { draw(g, t, info) { boatScene(g, t, info, { cam: push(t, info.dur, { z0: 1.12, z1: 1.18, x0: -60, x1: -40, y0: 40, y1: 40 }), k: 0.1 + 0.25 * ease.inOut(t / info.dur), samPose: 'wave' }); } });
registerShot('s058', { draw(g, t, info) {
  const k = 0.38, bx = lerp(CX() + V(60, 40), CX() + V(420, 160), k), by = lerp(ground() + 60, ground() - V(150, 300) + 24, Math.pow(k, 0.7)); const cam = { z: 2.6 + 0.1 * t, x: (bx - E.W / 2) / 0.9, y: (by - 90 - E.H / 2) / 0.9 }; const ag = ease.inOut(prog(t, 0.2, info.dur - 0.3));
  boatScene(g, t, info, { cam, k, sam: false, age: ag });
  const y0 = 2026, y1 = 2056; UI.badge(g, { str: 'AÑO ' + Math.round(lerp(y0, y1, ag)), size: V(52, 56) });
} });
registerShot('s059', { draw(g, t, info) { boatScene(g, t, info, { cam: push(t, info.dur, { z0: 0.98, z1: 1.0, x0: 0, x1: 0 }), k: 0.82 + 0.12 * ease.inOut(t / info.dur), samS: 0.9, samPose: 'sad', age: 1 }); } });
// s060 — "¿Amigos nuevos? ¿Para qué?"
registerShot('s060', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.45, 0, -20); const R = office(g, t, cam); const GY = R.GY, s = V(1.6, 1.7);
  act(g, t, info, cam, [
    { who: SAM, x: CX() - V(220, 160), y: GY, s, facing: 1, pose: [[0, 'relaxed'], [1.2, 'crossArms']], expr: [[0, 'neutral'], [1.2, 'sad']], seed: 1 },
    { who: COWORKER, x: CX() + V(220, 160), y: GY, s: s * 0.96, facing: -1, pose: 'wave', expr: 'happy', seed: 3 },
  ], R.rim);
  layer(g, cam, 1, g => { const k = ease.outBack(prog(t, 0.2, 0.5)); if (k > 0) { g.save(); g.translate(CX() + V(330, 240), GY - 330 * s); g.scale(k, k); UI.bubble(g, 0, 0, { w: 220, h: 80, str: '¿VIENES?', dots: false }); g.restore(); } });
  pop(g, t, '¿AMIGOS NUEVOS?', E.W / 2, E.H * 0.18, 0.1, { size: V(60, 60), color: ui().cream, end: wt(info, 'Para', 1.4) + 0.1 });
  pop(g, t, '¿PARA QUÉ?', E.W / 2, E.H * 0.18, wt(info, 'Para', 1.4) + 0.1, { size: V(66, 66), color: ui().accent });
} });
// s061 — "Igual tendrás que mudarte."
registerShot('s061', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.12, z1: 1.18, x0: -40, x1: -60, y0: 40, y1: 40 }); const R = apartment(g, t, cam, { boxes: true }); const GY = R.GY;
  layer(g, cam, 1, g => { g.fillStyle = '#9a6a44'; g.fillRect(CX() - 80, GY - 120, 170, 120); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(CX() - 8, GY - 120, 20, 120); });
  act(g, t, info, cam, [{ who: SAM, x: CX() - 20, y: GY - 60, s: 1.3, facing: 1, pose: { ...POSES.sit, head: [14, -170], sh: [6, -142] }, expr: 'sad', seed: 1, shadow: false }], R.rim);
} });
// s062 — cortisol
registerShot('s062', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), acc = ui().accent; const tc = wt(info, 'cortisol', 1.6);
  const gx = E.W * V(0.68, 0.5), gy0 = E.H * V(0.8, 0.75), gh = V(560, 700); const lvl = ease.inOut(prog(t, 0.3, tc + 1.2)) * 0.85;
  rr(g, gx - 60, gy0 - gh, 120, gh, 60); g.strokeStyle = alpha(c, 0.8); g.lineWidth = 5; g.stroke();
  g.save(); rr(g, gx - 60, gy0 - gh, 120, gh, 60); g.clip(); g.fillStyle = linG(g, gy0, gh, acc); g.fillRect(gx - 60, gy0 - gh * lvl, 120, gh * lvl); g.restore(); glow(g, gx, gy0 - gh * lvl, 120, acc, 0.6);
  for (let k = 1; k < 5; k++) seg(g, [[gx + 70, gy0 - gh * k / 5], [gx + 96, gy0 - gh * k / 5]], 4, alpha(c, 0.7));
  text(g, 'CORTISOL', gx, gy0 + 60, { size: V(46, 48), color: acc, font: FONTS.ui, weight: 900, spacing: 4, glow: 16, glowColor: alpha(acc, 0.5), alpha: ease.out(prog(t, tc - 0.2, tc + 0.2)) });
  // figura sola a la izquierda + molécula
  if (!E.vertical) { UI.lineFigure(g, { x: E.W * 0.26, y: E.H * 0.78, s: 2, pose: POSES.sad, color: c }); }
  const mx = E.W * V(0.42, 0.25), my = E.H * V(0.32, 0.2); g.strokeStyle = alpha(c, 0.8); g.lineWidth = 4; for (const [dx, dy] of [[0, 0], [52, 30], [104, 0]]) { g.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; g.lineTo(mx + dx + Math.cos(a) * 30, my + dy + Math.sin(a) * 30); } g.closePath(); g.stroke(); }
  text(g, 'LA HORMONA DEL ESTRÉS', E.W / 2, E.H * V(0.12, 0.1), { size: V(40, 40), color: ui().cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, wt(info, 'hormona', 2.6) - 0.1, wt(info, 'hormona', 2.6) + 0.3)) });
} });
function linG(g, y0, h, c) { const gr = g.createLinearGradient(0, y0, 0, y0 - h); gr.addColorStop(0, shade(c, -0.3)); gr.addColorStop(1, c); return gr; }
// s063 — ánimo cansado: Sam en la cama, lluvia
registerShot('s063', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.35, -120, -150, 0.86, 1.42); const R = apartment(g, t, cam, { rain: true }); const GY = R.GY;
  layer(g, cam, 1, g => FX.bed(g, { x: CX() - V(400, 280), y: GY, w: V(520, 420), color: '#4a4a80', frame: '#1a1828', pillow: '#d8d6ee' }));
  act(g, t, info, cam, [{ who: SAM, x: CX() - V(140, 100), y: GY - 40, s: V(1.55, 1.6), facing: 1, pose: { ...POSES.sit, head: [22, -160], sh: [10, -136], eF: [30, -100], hF: [40, -76], eB: [26, -100], hB: [36, -76] }, expr: [[0, 'sad'], [2.4, 'sleepy']], seed: 1, shadow: false }], R.rim);
  FX.rain(g, t, { count: 40, color: '#cfd9ff', a: 0.12, seed: 9 });
} });
// s064 — disfraz: "Esconderte funciona."
const DISGUISE = { ...SAM, head: 'hood', face: 'sunglasses' };
registerShot('s064', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.35, -100, 60); const R = street(g, t, cam, { mood: 'day' }); const GY = R.GY;
  act(g, t, info, cam, [
    { who: EXTRA, x: CX() + V(500, 320) - t * 200, y: GY, s: 1.4, facing: -1, pose: walkPose(t * 5), still: true },
    { who: DISGUISE, x: CX() - V(400, 260) + t * 180, y: GY, s: V(1.55, 1.6), facing: 1, pose: walkPose(t * 5.2), expr: 'smirk', still: true },
  ], R.rim);
  const tf = wt(info, 'funciona', 1.3); const k = ease.outBack(prog(t, tf, tf + 0.3)); if (k > 0) { g.save(); g.translate(V(300, 220), V(160, 260)); g.scale(k, k); rr(g, -60, -56, 400, 112, 56); g.fillStyle = 'rgba(14,10,20,.7)'; g.fill(); circle(g, 0, 0, 40, ui().good); seg(g, [[-16, 0], [-4, 14], [18, -14]], 9, '#0b1324'); text(g, 'FUNCIONA', 64, 2, { size: 52, color: ui().good, font: FONTS.ui, weight: 900, align: 'left' }); g.restore(); }
} });
// s065 — "Hasta que deja de funcionar." alguien te reconoce + falla
registerShot('s065', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.5, 60, 40); const R = street(g, t, cam, { mood: 'day' }); const GY = R.GY, s = V(1.6, 1.7);
  const drop = ease.in(prog(t, 0.6, 1.0));
  act(g, t, info, cam, [
    { who: { ...VECINA, color: '#3a8ac8', head: 'ponytail' }, x: CX() - V(300, 220), y: GY, s, facing: 1, pose: [[0, 'phone'], [0.3, 'point']], prop: 'phone', expr: 'shocked', seed: 3 },
    { who: t < 0.6 ? DISGUISE : { ...SAM, head: 'hood' }, x: CX() + V(220, 160), y: GY, s, facing: -1, pose: [[0, 'stand'], [0.5, 'handsOnHead']], expr: [[0, 'smirk'], [0.4, 'shocked']], seed: 1 },
  ], R.rim);
  layer(g, cam, 1, g => { if (t > 0.6 && t < 1.2) { const x = CX() + V(200, 140), y = GY - 200 * s + drop * 200 * s; rr(g, x - 30, y - 8, 60, 16, 6); g.fillStyle = '#05060a'; g.fill(); } if (t > 0.25 && t < 0.45) glow(g, CX() - V(240, 170), GY - 170 * s, 260, '#ffffff', 0.9); });
  if (t > 0.5 && t < 1.1) { const k = Math.sin(t * 60) > 0 ? 1 : 0; g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const y = ((i * 197 + Math.floor(t * 20) * 53) % E.H); g.fillStyle = i % 2 ? 'rgba(255,40,80,.12)' : 'rgba(40,200,255,.12)'; g.fillRect(-20 + k * 30, y, E.W + 40, 18 + (i % 3) * 10); } g.restore(); }
} });
