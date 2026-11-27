// 02_bueno_raro.js — s024–s044: lo bueno (cancha), lo raro (oficina, médico), el cuerpo por dentro, a favor / en contra.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, text, FONTS, glow, alpha, shade, mix, rr, seg, circle, ring, poly } from '/engine/core.js';
import { bigFace, POSES, walkPose } from '/engine/rig2d.js';
import { push, mcam, pick, wt, act, faceShot, tag, pop, panel, ui, FX, UI } from './_lib.js';
import { court, ball, office, clinic, cafe, beach, voidBg, ground } from '../sets/places.js';
import { SAM, LEO, JEFE, DOCTORA, EXTRA, fig } from '../cast.js';

const CX = () => E.W / 2;
const LEO_G = { ...LEO, face: 'glasses' };
const CLIENT = { top: 'suit', color: '#3a3448', color2: '#8a8aa0', head: 'none' };
const COWORKER = { top: 'tshirt', color: '#8a5ad6', head: 'ponytail' };

// s024 — "Primero, lo bueno."
registerShot('s024', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.0, z1: 1.06, x0: 40, x1: -20 }); const R = court(g, t, cam);
  act(g, t, info, cam, [{ who: SAM, x: CX() + V(360, 200), y: R.GY, s: 1.0, facing: -1, pose: 'holdFront', expr: 'smile' }, { who: LEO, x: CX() + V(560, 320), y: R.GY, s: 1.0, facing: -1, pose: 'relaxed', expr: 'happy', seed: 2 }], R.rim);
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
  UI.bigLine(g, t, { str: 'PRIMERO, LO BUENO', dur: info.dur, y: E.H * 0.3, color: ui().gold });
} });
// s025 — 3D: corres como a tus veinte
registerShot('s025', { kind: '3d',
  init(T) {
    const M = mood('golden'); const st = T.stage({ mood: 'golden', fov: V(36, 52), fog: [16, 60], keyPos: [-12, 6, 4], keyIntensity: 2.8, ambient: 1.2 });
    st.add(T.ground(80, 80, '#6a3a2e', T.tiles('#6a3a2e', 6, [8, 8])));
    for (let i = -4; i <= 4; i++) { const b = T.building(5, 8 + Math.abs(i * 37 % 6), 4, { color: '#3a2a3a', win: M.practical, lit: 0.3, seed: i + 9 }); b.position.x = i * 6; b.position.z = -18; st.add(b); }
    st.add(T.box(30, 0.05, 0.06, '#f2ece4', 0, 0.02, 3), T.box(0.06, 0.05, 12, '#f2ece4', 0, 0.02, -3));
    for (const sx of [-1, 1]) { st.add(T.cyl(0.08, 0.08, 3.2, '#1a1418', sx * 11, 1.6, -2)); st.add(T.box(0.06, 1.0, 1.6, '#efe6dc', sx * 10.85, 3.2, -2)); }
    for (let x = -14; x <= 14; x += 2) st.add(T.cyl(0.03, 0.03, 3, '#2a2030', x, 1.5, -8));
    st.add(T.tree3D(-16, -10, 1.3, '#2a2a22'), T.tree3D(15, -11, 1.2, '#2a2a22'));
    const sam = T.figure3D(SAM, { rim: M.rim }); const leo = T.figure3D(LEO, { rim: M.rim }); st.add(sam, leo);
    const ballM = T.sphere(0.12, '#e07a3a'); st.add(ballM);
    return { stage: st, sam, leo, ballM };
  },
  draw(s, t, info, T) {
    const xs = -7 + t * 4.2, xl = -7.5 + t * 1.6;
    s.sam.position.set(xs, 0, 0.6); s.sam.setPose(walkPose(t * Math.PI * 2 * 1.6, { run: true }));
    s.leo.position.set(xl, 0, -0.8); s.leo.setPose(walkPose(t * Math.PI * 2 * 1.0, { run: true }));
    s.ballM.position.set(xs + 0.35, 0.15 + Math.abs(Math.sin(t * 6)) * 0.7, 0.75);
    T.orbit(s.stage.camera, t, { target: [xs - 1.2, 1.0, 0], radius: V(7, 9), height: [1.6, 2.2], from: 0.9, to: 0.35, dur: info.dur });
  },
  overlay(g, t, info) { UI.readout(g, { label: 'EDAD', value: '40 AÑOS', x: V(120, 80), y: E.H - V(190, 520), a: ease.out(prog(t, 0.3, 0.7)) }); UI.readout(g, { label: 'RITMO', value: 'DE 20', x: V(120, 80), y: E.H - V(120, 450), a: ease.out(prog(t, wt(info, 'veinte', 1.5), wt(info, 'veinte', 1.5) + 0.4)) }); },
});
// s026 — "Leo jadea en la cancha."
const pant = { ...POSES.crouch, head: [24, -168], sh: [14, -138], hip: [0, -80], eF: [26, -100], hF: [30, -62], eB: [20, -100], hB: [24, -62], kF: [30, -44], fF: [24, 0], kB: [10, -44], fB: [-14, 0] };
registerShot('s026', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.45, -80, -110); const R = court(g, t, cam); const GY = R.GY, s = V(1.6, 1.7);
  const breathe = Math.sin(t * 9) * 5; const p = { ...pant, head: [24, -168 + breathe], sh: [14, -138 + breathe * 0.6] };
  const bx = CX() + V(330, 220), by = GY - 30 - Math.abs(Math.sin(t * 5.5)) * 120;
  act(g, t, info, cam, [
    { who: SAM, x: CX() + V(300, 200), y: GY, s: s * 0.85, facing: -1, pose: { ...POSES.holdFront, hF: [30, -110 + Math.abs(Math.sin(t * 5.5)) * 30] }, expr: 'smile', seed: 1 },
    { who: LEO, x: CX() - V(200, 140), y: GY, s, facing: 1, pose: p, expr: 'nervous', still: true },
  ], R.rim);
  layer(g, cam, 1, g => { ball(g, bx - 40, by, 22); const hx = CX() - V(200, 140) + 24 * s, hy = GY - 168 * s; for (let i = 0; i < 3; i++) { const k = ((t * 1.4 + i / 3) % 1); g.fillStyle = alpha('#9fd8ff', 1 - k); g.beginPath(); g.ellipse(hx - 30 - i * 14, hy - 10 + k * 70, 5, 9, 0, 0, 7); g.fill(); } });
} });
// s027 — "Tú ni sudas."
registerShot('s027', { draw(g, t, info) { faceShot(g, t, info, { set: court, who: SAM, expr: 'smirk', side: -1, bgX: -260, zoom: 0.05, after: (g, cx, cy, r) => pop(g, t, '0 GOTAS', cx + r * 1.5, cy - r * 0.7, 0.4, { size: V(52, 56) }) }); } });
// s028 — Leo: "Bro. Te odio."
registerShot('s028', { draw(g, t, info) { faceShot(g, t, info, { set: court, who: LEO, expr: [[0, 'nervous'], [0.6, 'angry']], talk: true, side: -1, bgX: 200, face: { sweat: true } }); } });
// s029 — "Con cariño. Pero te odio."
registerShot('s029', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.5, 0, -30); const R = court(g, t, cam); const GY = R.GY, s = V(1.6, 1.7);
  const hug = { ...POSES.stand, eF: [34, -170], hF: [74, -182] };
  act(g, t, info, cam, [
    { who: SAM, x: CX() + V(110, 80), y: GY, s, facing: -1, pose: 'relaxed', expr: [[0, 'smile'], [1.2, 'happy']], seed: 1 },
    { who: LEO, x: CX() - V(80, 60), y: GY, s, facing: 1, pose: [[0, 'stand'], [0.3, hug]], expr: [[0, 'happy'], [1.2, 'smirk']], talk: true, seed: 2 },
  ], R.rim);
} });
// s030 — "Después, lo raro."
registerShot('s030', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.0, z1: 1.06, x0: -30, x1: 20 }); const R = office(g, t, cam);
  act(g, t, info, cam, [{ who: SAM, x: CX() - V(80, 60), y: R.GY, s: 1.1, facing: 1, pose: 'holdFront', prop: 'paper', expr: 'neutral' }, { who: JEFE, x: CX() + V(220, 160), y: R.GY, s: 1.0, facing: -1, pose: 'crossArms', expr: 'smirk', seed: 3 }], R.rim);
  FX.dust(g, t, { count: 30, color: '#cfe4ff', a: 0.25 });
  UI.bigLine(g, t, { str: 'DESPUÉS, LO RARO', dur: info.dur, y: E.H * 0.25, color: ui().gold });
} });
// s031 — "Tu jefe es más joven que tú."
registerShot('s031', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.45, 0, -30); const R = office(g, t, cam); const GY = R.GY, s = V(1.6, 1.7), jx = CX() + V(200, 140), sx = CX() - V(220, 160);
  act(g, t, info, cam, [
    { who: SAM, x: sx, y: GY, s, facing: 1, pose: 'holdFront', prop: 'paper', expr: [[0, 'neutral'], [1, 'worried']], seed: 1 },
    { who: JEFE, x: jx, y: GY, s: s * 0.97, facing: -1, pose: [[0, 'crossArms'], [0.4, 'point']], expr: 'smirk', talk: [0.4, 1.4], seed: 3 },
  ], R.rim);
  layer(g, cam, 1, g => { tag(g, t, [jx, GY - 270 * s], [jx + V(220, 150), GY - 330 * s], 'JEFE · 28', wt(info, 'jefe', 0.4)); tag(g, t, [sx, GY - 270 * s], [sx - V(220, 150), GY - 330 * s], 'SAM · 45', wt(info, 'joven', 1.0), ui().accent); });
} });
// s032 — clientes: "Creen que eres el practicante."
registerShot('s032', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.4, 20, -20); const R = office(g, t, cam); const GY = R.GY, s = V(1.55, 1.6), sx = CX() - V(330, 220);
  const tp = wt(info, 'practicante', 1.6);
  act(g, t, info, cam, [
    { who: SAM, x: sx, y: GY, s, facing: 1, pose: [[0, 'relaxed'], [tp - 0.2, 'holdFront']], prop: t > tp - 0.2 ? 'cup' : null, expr: [[0, 'smile'], [tp, 'confused']], seed: 1 },
    { who: CLIENT, x: CX() + V(140, 90), y: GY, s, facing: -1, pose: [[0, 'talk'], [tp - 0.5, 'holdFront']], prop: t < tp - 0.2 ? 'cup' : null, expr: 'smile', talk: [0.4, 1.4], seed: 4 },
    { who: { ...CLIENT, color: '#4a3a40' }, x: CX() + V(420, 300), y: GY, s, facing: -1, pose: 'holdFront', prop: 'cup', expr: 'smile', seed: 5 },
  ], R.rim);
  layer(g, cam, 1, g => { if (t > tp) { const bx = sx + 10 * s, by = GY - 150 * s, k = ease.outBack(prog(t, tp, tp + 0.3)); g.save(); g.translate(bx, by); g.scale(k, k); rr(g, -46, -14, 92, 28, 6); g.fillStyle = '#f2ece4'; g.fill(); text(g, 'PRACTICANTE', 0, 1, { size: 12, color: '#d64a33', font: FONTS.ui, weight: 900 }); g.restore(); } });
  pop(g, t, 'PRACTICANTE', sx + V(0, 0), E.H * 0.2, tp, { size: V(58, 60), color: ui().cream });
} });
// s033 — "Vas al médico."
registerShot('s033', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.0, z1: 1.05, x0: 40, x1: 10 }); const R = clinic(g, t, cam, { doorOpen: 0.7 }); const GY = R.GY;
  const sx = CX() + V(470, 270) - t * 160;
  act(g, t, info, cam, [{ who: SAM, x: sx, y: GY, s: 1.15, facing: -1, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'neutral', still: true }, { who: DOCTORA, x: CX() - V(380, 260), y: GY, s: 1.15, facing: 1, pose: 'holdFront', prop: 'tablet', expr: 'smile', seed: 2 }], R.rim);
  FX.dust(g, t, { count: 30, color: '#cfe4ff', a: 0.25 });
} });
// s034 — "La doctora mira tus análisis."
registerShot('s034', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.45, -40, -70); const R = clinic(g, t, cam, { bed: false }); const GY = R.GY, s = V(1.55, 1.65);
  layer(g, cam, 1, g => FX.bed(g, { x: CX() + V(40, 20), y: GY, w: V(420, 340), color: '#8fa6c8', frame: '#1a1e2c', pillow: '#eef2fa' }));
  act(g, t, info, cam, [
    { who: DOCTORA, x: CX() - V(250, 180), y: GY, s, facing: 1, pose: { ...POSES.holdFront, hF: [40, -170], eF: [26, -140] }, prop: 'paper', expr: [[0, 'neutral'], [1.0, 'surprised']], look: [0.6, 0.3], seed: 2 },
    { who: SAM, x: CX() + V(160, 110), y: GY - 30, s, facing: -1, pose: 'sit', expr: 'smile', seed: 1, shadow: false },
  ], R.rim);
} });
// s035 — radiografía: densidad, presión, arterias
registerShot('s035', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), good = ui().good, gold = ui().gold;
  const T0 = [wt(info, 'Densidad', 0.15), wt(info, 'Presión', 1.85), wt(info, 'Arterias', 3.6)];
  const xs = [E.W * V(0.2, 0.5), E.W * 0.5, E.W * V(0.8, 0.5)], ys = E.vertical ? [E.H * 0.22, E.H * 0.45, E.H * 0.68] : [E.H * 0.45, E.H * 0.45, E.H * 0.45];
  const on = (i) => ease.outBack(prog(t, T0[i] - 0.1, T0[i] + 0.3));
  // hueso
  g.save(); g.translate(xs[0], ys[0]); g.scale(on(0), on(0)); g.rotate(-0.5); seg(g, [[-120, 0], [120, 0]], 34, alpha(c, 0.9)); for (const sx of [-1, 1]) for (const sy of [-1, 1]) circle(g, sx * 128, sy * 18, 26, alpha(c, 0.9)); g.restore();
  // manómetro
  g.save(); g.translate(xs[1], ys[1]); g.scale(on(1), on(1)); ring(g, 0, 0, 120, 6, alpha(c, 0.9)); for (let k = 0; k <= 10; k++) { const a = Math.PI * (0.8 + k * 0.14); seg(g, [[Math.cos(a) * 96, Math.sin(a) * 96], [Math.cos(a) * 112, Math.sin(a) * 112]], 4, alpha(c, 0.8)); } const na = Math.PI * (0.8 + 1.4 * lerp(0.2, 0.5, ease.inOut(prog(t, T0[1], T0[1] + 1)))); seg(g, [[0, 0], [Math.cos(na) * 90, Math.sin(na) * 90]], 7, gold); circle(g, 0, 0, 12, gold); g.restore();
  // arteria
  g.save(); g.translate(xs[2], ys[2]); g.scale(on(2), on(2)); g.strokeStyle = alpha(c, 0.9); g.lineWidth = 6; g.beginPath(); g.moveTo(-150, -50); g.bezierCurveTo(-50, -90, 50, -10, 150, -50); g.moveTo(-150, 50); g.bezierCurveTo(-50, 10, 50, 90, 150, 50); g.stroke(); for (let i = 0; i < 6; i++) { const u = ((t * 0.6 + i / 6) % 1); circle(g, lerp(-140, 140, u), Math.sin(u * 3) * 10, 12, ui().accent); } g.restore();
  const labels = [['DENSIDAD ÓSEA', '20 AÑOS'], ['PRESIÓN', '120/80'], ['ARTERIAS', 'LIMPIAS']];
  labels.forEach(([a, b], i) => { const k = clamp(on(i)); if (k <= 0) return; const ly = ys[i] + V(190, 150);
    text(g, a, xs[i], ly, { size: V(30, 30), color: alpha(c, 0.9), font: FONTS.ui, weight: 900, spacing: 2, alpha: k });
    text(g, b, xs[i], ly + V(56, 50), { size: V(52, 50), color: gold, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(gold, 0.6), alpha: k });
    const ck = ease.outBack(prog(t, T0[i] + 0.5, T0[i] + 0.8)); if (ck > 0) { g.save(); g.translate(xs[i] + V(150, 140), ys[i] - V(130, 110)); g.scale(ck, ck); circle(g, 0, 0, 34, good); seg(g, [[-14, 0], [-3, 12], [16, -12]], 8, '#0b1324'); g.restore(); } });
} });
// s036 — doctora: "¿Seguro que esta fecha de nacimiento está bien?"
registerShot('s036', { draw(g, t, info) { faceShot(g, t, info, { set: clinic, who: DOCTORA, expr: 'confused', talk: true, side: -1, bgX: -240, look: [0.3, 0.1] }); } });
// s037 — "Bastante seguro, sí."
registerShot('s037', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.5, 120, 90); const R = clinic(g, t, cam, { bed: false }); const GY = R.GY, s = V(1.55, 1.65);
  layer(g, cam, 1, g => FX.bed(g, { x: CX() - V(80, 60), y: GY, w: V(420, 340), color: '#8fa6c8', frame: '#1a1e2c', pillow: '#eef2fa' }));
  act(g, t, info, cam, [
    { who: SAM, x: CX() + V(40, 30), y: GY - 30, s, facing: 1, pose: [[0, 'sit'], [0.4, { ...POSES.sit, eF: [26, -128], hF: [40, -150], eB: [-20, -128], hB: [-34, -150] }]], expr: 'smirk', talk: true, seed: 1, shadow: false },
    { who: DOCTORA, x: CX() + V(420, 290), y: GY, s, facing: -1, pose: 'holdFront', prop: 'paper', expr: 'confused', seed: 2 },
  ], R.rim);
} });
// s038 — "Tu cuerpo sigue renovándose."
registerShot('s038', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = ui().gold, cx = E.W / 2, cy = E.H * 0.52;
  UI.lineFigure(g, { x: cx, y: cy + V(300, 300), s: V(2.3, 2.3), pose: POSES.stand, color: c });
  for (let k = 0; k < 2; k++) { const a0 = t * 2.2 + k * Math.PI; g.strokeStyle = gold; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, V(330, 330), a0, a0 + 2.2); g.stroke(); const ax = cx + Math.cos(a0 + 2.2) * V(330, 330), ay = cy + Math.sin(a0 + 2.2) * V(330, 330); poly(g, [[ax + Math.cos(a0 + 2.2 + 1.57) * 24, ay + Math.sin(a0 + 2.2 + 1.57) * 24], [ax + Math.cos(a0 + 2.2) * 16, ay + Math.sin(a0 + 2.2) * 16], [ax - Math.cos(a0 + 2.2) * 16, ay - Math.sin(a0 + 2.2) * 16]], gold); }
  for (let i = 0; i < 12; i++) { const a = i * 0.52 + t * 0.4, r = V(200, 200) + Math.sin(t * 2 + i) * 40; FX.sparkle(g, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 1.3, 10 + (i % 3) * 5, '#fff2c0', 0.5 + 0.5 * Math.sin(t * 3 + i)); }
  UI.readout(g, { value: 'RENOVACIÓN CONSTANTE', x: E.W / 2, y: E.H * V(0.12, 0.12), align: 'center', size: V(44, 40), color: ui().cream, a: ease.out(prog(t, 0.3, 0.7)) });
} });
// s039 — glóbulos rojos cada 120 días
registerShot('s039', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), y = E.H * V(0.5, 0.45), acc = '#ff6a5a';
  g.fillStyle = alpha(acc, 0.08); g.fillRect(-10, y - 150, E.W + 20, 300); seg(g, [[-10, y - 150], [E.W + 10, y - 150]], 5, alpha(c, 0.8)); seg(g, [[-10, y + 150], [E.W + 10, y + 150]], 5, alpha(c, 0.8));
  for (let i = 0; i < 26; i++) { const sp = 220 + (i % 5) * 30, x = ((i * 173 + t * sp) % (E.W + 200)) - 100, yy = y + Math.sin(i * 2.3) * 100, rot = t * (0.5 + (i % 3) * 0.3) + i; g.save(); g.translate(x, yy); g.rotate(rot); g.fillStyle = acc; g.beginPath(); g.ellipse(0, 0, 34, 24, 0, 0, 7); g.fill(); g.fillStyle = shade(acc, -0.3); g.beginPath(); g.ellipse(0, 0, 16, 10, 0, 0, 7); g.fill(); g.restore(); }
  const tn = wt(info, 'ciento', 1.6); const n = Math.round(lerp(0, 120, ease.out(prog(t, tn, tn + 1.0))));
  UI.readout(g, { label: 'SE REEMPLAZAN CADA', value: n + ' DÍAS', x: E.W / 2, y: E.H * V(0.84, 0.78), align: 'center', size: V(72, 72), a: ease.out(prog(t, tn - 0.3, tn)) });
  text(g, 'GLÓBULOS ROJOS', E.W / 2, E.H * V(0.15, 0.15), { size: V(42, 44), color: alpha(c, 0.95), font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.1, 0.5)) });
} });
// s040 — corazón: 100.000 latidos al día
export function heart(g, x, y, r, color) { g.fillStyle = color; g.beginPath(); g.moveTo(x, y + r * 0.9); g.bezierCurveTo(x - r * 1.6, y - r * 0.2, x - r * 0.7, y - r * 1.3, x, y - r * 0.45); g.bezierCurveTo(x + r * 0.7, y - r * 1.3, x + r * 1.6, y - r * 0.2, x, y + r * 0.9); g.fill(); }
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
registerShot('s040', { draw(g, t, info) {
  UI.blueprint(g); const acc = ui().accent, gold = ui().gold; const cx = E.W * V(0.3, 0.5), cy = E.H * V(0.5, 0.35);
  const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * 1.2)), 8); const r = V(150, 150) * (1 + 0.12 * beat);
  glow(g, cx, cy, r * 2.2, acc, 0.25 + 0.3 * beat); heart(g, cx, cy, r, acc); FX.rings(g, cx, cy, t, { count: 2, r0: r, r1: r * 2.2, color: acc, a: 0.4, speed: 1.2 });
  const tn = wt(info, 'cien', 0.9); const n = lerp(0, 100000, ease.out(prog(t, tn - 0.3, tn + 1.4)));
  const tx = E.W * V(0.66, 0.5), ty = E.H * V(0.46, 0.68);
  text(g, fmt(n), tx, ty, { size: V(130, 120), color: gold, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(gold, 0.6) });
  text(g, 'LATIDOS AL DÍA', tx, ty + V(100, 100), { size: V(40, 42), color: ui().cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.4, 0.8)) });
} });
// s041 — TIEMPO DETENIDO: algo dentro de ti dejó de contar
registerShot('s041', { draw(g, t, info) {
  const cam = { z: 1 + 0.03 * t, r: -0.02 + 0.01 * t };
  voidBg(g, t, cam, { glow: '#7fa0ff' }); const ts = wt(info, 'dejó', 1.5);
  layer(g, cam, 1, g => {
    const x = E.W / 2, y = E.H * 1.18, s = V(3.4, 3.2);
    fig(g, { x, y, s, facing: 1, outfit: SAM, pose: POSES.stand, expr: 'neutral', rim: { color: '#bcd0ff', dir: [0, -1] }, shadow: false });
    const cx = x + 2 * s, cy = y - 150 * s; const sec = t < ts ? t * 6 : ts * 6;
    glow(g, cx, cy, 260, t < ts ? '#ffd47e' : '#9fc0ff', 0.45);
    FX.clock(g, cx, cy, 120, 20 * 3600 + sec * 10, { face: '#f2efe8', speed: 1 });
    if (t > ts) FX.rings(g, cx, cy, t - ts, { count: 3, r0: 140, r1: 520, speed: 0.4, color: '#e8f0ff', a: 0.4 });
  });
  FX.drops(g, t, { count: 50, color: '#d8e4ff', rMax: 7, drift: 2 });
  if (t > ts) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.4)'; g.fillRect(0, 0, E.W, E.H); g.restore(); UI.badge(g, { str: 'EDAD: 20', a: ease.out(prog(t, ts, ts + 0.4)) }); }
} });
// s042 — "A favor: nunca necesitas lentes para leer."
registerShot('s042', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.5, 0, -30); const R = cafe(g, t, cam); const GY = R.GY, s = V(1.55, 1.6);
  layer(g, cam, 1, g => { const tx = CX(); rr(g, tx - 220, GY - 160, 440, 18, 8); g.fillStyle = '#2a1a18'; g.fill(); seg(g, [[tx, GY - 150], [tx, GY]], 12, '#2a1a18'); });
  act(g, t, info, cam, [
    { who: SAM, x: CX() - V(300, 210), y: GY - 20, s, facing: 1, pose: { ...POSES.sit, eF: [22, -128], hF: [38, -150] }, prop: 'paper', expr: 'smile', seed: 1, shadow: false },
    { who: LEO_G, x: CX() + V(300, 210), y: GY - 20, s, facing: -1, pose: { ...POSES.sitBack, eF: [30, -150], hF: [70, -160] }, prop: 'paper', expr: 'confused', seed: 2, shadow: false },
  ], R.rim);
  layer(g, cam, 1, g => { for (const [x, f] of [[CX() - V(300, 210), 1], [CX() + V(300, 210), -1]]) { g.save(); g.translate(x, 0); g.scale(f, 1); FX.chair(g, -18 * s, GY, s, '#24181e'); g.restore(); } });
  const tf = 0.1; const k = ease.outBack(prog(t, tf, tf + 0.35)); g.save(); g.translate(V(250, 200), V(150, 260)); g.scale(k, k); rr(g, -60, -56, 380, 112, 56); g.fillStyle = 'rgba(14,10,20,.7)'; g.fill(); circle(g, 0, 0, 40, ui().good); seg(g, [[-16, 0], [-4, 14], [18, -14]], 9, '#0b1324'); text(g, 'A FAVOR', 64, 2, { size: V(56, 56), color: ui().good, font: FONTS.ui, weight: 900, align: 'left', glow: 16, glowColor: alpha(ui().good, 0.5) }); g.restore();
} });
// s043 — "En contra: el sol te quema igual."
registerShot('s043', { draw(g, t, info) {
  const cam = mcam(t, info.dur, 1.4, 0, -30); const R = beach(g, t, cam); const GY = R.GY, s = V(1.6, 1.7), x = CX() + V(120, 0);
  act(g, t, info, cam, [{ who: { ...SAM, top: 'tshirt' }, x, y: GY, s, facing: -1, pose: [[0, 'relaxed'], [1.0, 'handsOnHead']], expr: [[0, 'smile'], [1.0, 'shocked']], seed: 1 }], R.rim);
  const burn = ease.inOut(prog(t, 0.6, 1.8)); layer(g, cam, 1, g => { glow(g, x, GY - 150 * s, 260 * s, '#ff3a2a', 0.45 * burn); for (let i = 0; i < 5; i++) { const k = (t * 0.8 + i / 5) % 1; g.strokeStyle = alpha('#ffb090', 0.4 * (1 - k)); g.lineWidth = 4; g.beginPath(); const yy = GY - 260 * s - k * 160; g.moveTo(x - 60 + i * 30, yy); g.quadraticCurveTo(x - 50 + i * 30, yy - 20, x - 60 + i * 30, yy - 40); g.stroke(); } });
  const k = ease.outBack(prog(t, 0.1, 0.45)); g.save(); g.translate(V(250, 200), V(150, 260)); g.scale(k, k); rr(g, -60, -56, 440, 112, 56); g.fillStyle = 'rgba(14,10,20,.7)'; g.fill(); circle(g, 0, 0, 40, ui().accent); seg(g, [[-14, -14], [14, 14]], 9, '#1a0a0a'); seg(g, [[14, -14], [-14, 14]], 9, '#1a0a0a'); text(g, 'EN CONTRA', 64, 2, { size: V(56, 56), color: ui().accent, font: FONTS.ui, weight: 900, align: 'left', glow: 16, glowColor: alpha(ui().accent, 0.5) }); g.restore();
} });
// s044 — "No eres inmortal. Solo joven."
registerShot('s044', { draw(g, t, info) {
  const cam = push(t, info.dur, { z0: 1.0, z1: 1.05, x0: -40, x1: 40 }); const R = beach(g, t, cam, { sunset: true }); const GY = R.GY;
  act(g, t, info, cam, [{ who: SAM, x: CX() - V(300, 160) + t * 120, y: GY, s: 1.0, facing: 1, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'neutral', still: true }], { color: R.M.rim, dir: [0.8, -0.5] });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.35 });
  const ts = wt(info, 'Solo', 1.4);
  UI.bigLine(g, t, { str: 'NO ERES INMORTAL', dur: ts + 0.1, y: E.H * 0.3, color: ui().cream, size: V(70, 64) });
  if (t > ts) UI.bigLine(g, t - ts, { str: 'SOLO JOVEN.', dur: info.dur - ts + 0.4, y: E.H * 0.3, size: V(84, 76) });
} });
