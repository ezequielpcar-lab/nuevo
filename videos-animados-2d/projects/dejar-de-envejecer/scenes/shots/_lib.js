// _lib.js — ayudas compartidas por las tomas (no registra tomas).
import { E, V, S, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, talkAmount, wordTime, text, FONTS, glow, alpha, rr, seg, circle } from '/engine/core.js';
import { POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { fig, bigHair } from '../cast.js';

// cámara: acercamiento + deriva suave durante la toma
export const push = (t, dur, o = {}) => { const k = ease.inOut(t / dur); return { z: lerp(o.z0 ?? 1, o.z1 ?? 1.07, k), x: lerp(o.x0 ?? 0, o.x1 ?? -30, k), y: lerp(o.y0 ?? 0, o.y1 ?? 0, k), r: o.r ? lerp(-o.r, o.r, k) : 0 }; };
// valor por tramos: pick(t, [[0,'neutral'],[1.2,'smile']])
// cámara de toma media: zoom z, el piso (GY) queda en gy*H de la pantalla
export const mcam = (t, dur, z = 1.5, x0 = 0, x1 = -30, gy = 0.86, z1) => { const GY = E.H * V(0.8, 0.68), k = ease.inOut(t / dur), zz = lerp(z, z1 ?? z * 1.05, k); return { z: zz, x: lerp(x0, x1, k), y: (GY - E.H / 2) - (gy * E.H - E.H / 2) / zz }; };
export const pick = (t, keys) => { let v = keys[0][1]; for (const [k, x] of keys) if (t >= k) v = x; return v; };
// tiempo local (s dentro de la toma) de una palabra; respaldo si no aparece
export const wt = (info, w, fb = 0.3) => { const x = wordTime(w, info.shot.start); return x == null || x > info.shot.end ? fb : x - info.shot.start; };
const poseOf = (t, p) => (Array.isArray(p) ? posesAt(t, p) : typeof p === 'string' ? POSES[p] : p || POSES.stand);
// dibuja personajes en el plano 1: list = [{ who, x, s, facing, pose, expr, talk, prop, look, rot, alpha, still, seed, shadow }]
export function act(g, t, info, cam, list, rim) {
  layer(g, cam, 1, g => { for (const a of list) {
    const ps = poseOf(t, a.pose); const pose = a.still ? ps : breathe(ps, t, 1, a.seed ?? 0);
    const talk = a.talk === true ? talkAmount(info.globalT, info.shot.start, info.shot.end) : Array.isArray(a.talk) ? talkAmount(info.globalT, info.shot.start + a.talk[0], info.shot.start + a.talk[1]) : 0;
    const o = { x: a.x, y: a.y, s: a.s ?? V(1.6, 1.7), facing: a.facing ?? 1, outfit: a.who, pose, expr: Array.isArray(a.expr) ? pick(t, a.expr) : a.expr || 'neutral', talk, prop: a.prop, look: a.look, rot: a.rot, alpha: a.alpha, shadow: a.shadow, trail: a.trail, face: a.face, blink: !a.still && ((t + (a.seed ?? 0) * 0.7) % (2.9 + (a.seed ?? 0) * 0.3)) > 2.8 + (a.seed ?? 0) * 0.3, rim: a.rim ?? rim };
    fig(g, o);
    if (talk > 0 && a.rings !== false) { const s = o.s; FX.rings(g, a.x + (o.facing) * 6 * s, a.y - 200 * s, t, { count: 2, r0: 40 * s, r1: 90 * s, color: '#fff3e0', a: 0.25 }); }
  } });
}
// primer plano gigante sobre el escenario desenfocado
export function faceShot(g, t, info, o) {
  const dur = info.dur; const { set, setOpts = {}, who, side = -1 } = o;
  const bg = o.bgCam || { z: 1.5, x: o.bgX ?? -120, y: o.bgY ?? -140 };
  let R = { M: mood('dusk'), rim: { color: '#ffc68a' } };
  blurLayer(g, o.blur ?? 14, g => { R = set(g, t, bg, setOpts) || R; }); veil(g, o.veilC || '#0c0810', o.veil ?? 0.38);
  const r = V(300, 330) * (o.scale ?? 1) * (1 + (o.zoom ?? 0.04) * ease.inOut(t / dur));
  const cx = E.W / 2 + (o.dx ?? 0) + (o.drift ?? 20) * Math.sin(t * 0.6), cy = E.H * V(0.6, 0.55) + (o.dy ?? 0);
  const talk = o.talk === true ? talkAmount(info.globalT, info.shot.start, info.shot.end) : Array.isArray(o.talk) ? talkAmount(info.globalT, info.shot.start + o.talk[0], info.shot.start + o.talk[1]) : 0;
  const rimC = o.rimColor || R.rim?.color || R.M.rim;
  o.behind?.(g, cx, cy, r);
  bigFace(g, cx, cy, r, { outfit: who, expr: Array.isArray(o.expr) ? pick(t, o.expr) : o.expr || 'neutral', talk, look: o.look, rimColor: rimC, rimSide: side, blink: (t % 3.1) > 3.0 && !o.noBlink, tilt: o.tilt ? o.tilt * Math.sin(t * 0.8) : 0, face: o.face });
  bigHair(g, cx, cy, r, who);
  if (talk > 0) FX.rings(g, cx, cy, t, { count: 3, r0: r * 1.1, r1: r * 1.6, color: '#fff3e0', a: 0.3 });
  o.after?.(g, cx, cy, r);
  if (o.dust !== false) FX.dust(g, t, { count: 30, color: alpha(rimC, 1), a: 0.3 });
  return { cx, cy, r };
}
// etiqueta corta que aparece con línea guía
export const tag = (g, t, at, to, str, start = 0, color) => UI.callout(g, t, { at, to, str, start, color, size: V(34, 40) });
// número/etiqueta grande con pop
export function pop(g, t, str, x, y, start = 0, o = {}) {
  const k = ease.outBack(prog(t, start, start + 0.35)); if (k <= 0) return; const a = clamp((o.end ?? 1e9) - t, 0, 0.3) / 0.3;
  g.save(); g.translate(x, y); g.scale(k, k); text(g, str, 0, 0, { size: o.size || V(72, 80), color: o.color || S().ui.gold, font: o.font || FONTS.ui, weight: 900, glow: 24, glowColor: alpha(o.color || S().ui.gold, 0.6), alpha: a, spacing: o.spacing ?? 2, italic: o.italic }); g.restore();
}
// panel redondeado (pantallas de celular, tarjetas)
export function panel(g, x, y, w, h, o = {}) { rr(g, x, y, w, h, o.r ?? 24); g.fillStyle = o.fill || S().ui.card; g.fill(); if (o.line !== false) { g.strokeStyle = o.line || S().ui.cardLine; g.lineWidth = 3; g.stroke(); } }
// celular grande en primer plano (devuelve el área de la pantalla)
export function bigPhone(g, t, cx, cy, h, o = {}) {
  const w = h * 0.5, x = cx - w / 2, y = cy - h / 2; const ink = S().ink;
  rr(g, x - 6, y - 6, w + 12, h + 12, 46); g.fillStyle = o.rim || '#ffc68a'; g.fill();
  rr(g, x, y, w, h, 42); g.fillStyle = ink; g.fill();
  const sx = x + 18, sy = y + 40, sw = w - 36, sh = h - 80; rr(g, sx, sy, sw, sh, 22); g.fillStyle = o.screen || '#121a2c'; g.fill();
  glow(g, cx, cy, h * 0.7, o.glowC || '#7fb8ff', o.off ? 0 : 0.18);
  g.save(); rr(g, sx, sy, sw, sh, 22); g.clip(); o.draw?.(g, sx, sy, sw, sh); g.restore();
  return { sx, sy, sw, sh };
}
// mano negra simple (antebrazo con manga) que entra desde un borde
export function arm(g, from, to, o = {}) { const ink = S().ink; const w = o.w || 60; if (o.rim) seg(g, [[from[0] - 5, from[1] - 5], [to[0] - 5, to[1] - 5]], w + 6, o.rim); seg(g, [from, to], w, ink); seg(g, [from, [lerp(from[0], to[0], 0.6), lerp(from[1], to[1], 0.6)]], w * 1.35, o.sleeve || '#d64a33'); circle(g, to[0], to[1], w * 0.62, ink); }
export const ui = () => S().ui;
export { POSES, FX, UI };
