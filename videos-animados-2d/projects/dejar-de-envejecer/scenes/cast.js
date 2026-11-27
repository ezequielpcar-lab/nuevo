// cast.js — una prenda/color distintivo por personaje, igual en todo el video.
import { S, seg, circle, alpha, shade, rr, poly } from '/engine/core.js';
import { drawFigure, headPos, POSES } from '/engine/rig2d.js';

export const SAM = { top: 'hoodie', color: '#d64a33', head: 'none' };
export const LEO = { top: 'tshirt', color: '#3a6ea5', head: 'none', gray: true };
export const MAMA = { top: 'dress', color: '#f29ac0', head: 'bun', grayBun: true };
export const BLACK = { top: 'trench', color: '#1c1a22', head: 'fedora', headColor: '#16141c', face: 'sunglasses' };
export const DOCTORA = { top: 'labcoat', head: 'ponytail', headColor: '#3fb9a8' };
export const LEE = { top: 'labcoat', face: 'glasses', head: 'beanie', headColor: '#3fb950' };
export const PORTERO = { top: 'suit', color: '#22202a', color2: '#8a5ad6', head: 'cap', headColor: '#8a5ad6' };
export const JEFE = { top: 'suit', color: '#2a2833', color2: '#f2c21a', head: 'spiky' };
export const VECINA = { top: 'dress', color: '#3fb950', head: 'curly' };
export const EXTRA = { top: 'none' };
export const CAST = [SAM, LEO, MAMA, DOCTORA, BLACK];
export const GRAY = '#b9b4c4';

// drawFigure + detalles propios (canas de Leo, moño gris de mamá)
export function fig(g, o) {
  drawFigure(g, o);
  const of = o.outfit || {};
  if (of.gray || of.grayBun) {
    const [hx, hy, r] = headPos(o); const f = o.facing ?? 1, s = o.s ?? 1;
    g.save(); if (o.alpha != null) g.globalAlpha *= o.alpha;
    if (of.gray) { // canas: mechones grises arriba y en la sien
      g.strokeStyle = GRAY; g.lineWidth = r * 0.22; g.lineCap = 'round';
      g.beginPath(); g.arc(hx, hy, r * 0.92, Math.PI * 1.08, Math.PI * 1.62); g.stroke();
      seg(g, [[hx - f * r * 0.85, hy - r * 0.35], [hx - f * r * 0.95, hy + r * 0.1]], r * 0.2, GRAY);
    }
    if (of.grayBun) { circle(g, hx - f * r * 0.55, hy - r * 0.95, r * 0.46, GRAY); g.strokeStyle = GRAY; g.lineWidth = r * 0.2; g.beginPath(); g.arc(hx, hy, r * 0.95, f > 0 ? Math.PI * 1.05 : Math.PI * 1.45, f > 0 ? Math.PI * 1.55 : Math.PI * 1.95); g.stroke(); }
    g.restore();
  }
}
// canas / moño gris para primeros planos gigantes (bigFace)
export function bigHair(g, cx, cy, r, of) {
  if (of.gray) { g.strokeStyle = GRAY; g.lineWidth = r * 0.2; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, r * 0.93, Math.PI * 1.12, Math.PI * 1.88); g.stroke(); seg(g, [[cx - r * 0.9, cy - r * 0.3], [cx - r * 0.97, cy + r * 0.05]], r * 0.16, GRAY); seg(g, [[cx + r * 0.9, cy - r * 0.3], [cx + r * 0.97, cy + r * 0.05]], r * 0.16, GRAY); }
  if (of.grayBun) { circle(g, cx - r * 0.55, cy - r * 0.95, r * 0.47, GRAY); g.strokeStyle = GRAY; g.lineWidth = r * 0.22; g.beginPath(); g.arc(cx, cy, r * 0.94, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
}
// Toby: perro negro con collar rojo; age 0..1 vuelve gris el hocico; pose: 'stand'|'jump'|'walk'|'carried'
export function dog(g, x, y, s = 1, o = {}) {
  const { facing = 1, age = 0, t = 0, mode = 'stand', rim = '#ffc68a', rimDir = [0, -1] } = o; const ink = S().ink;
  const draw = (col, ox, oy, grow) => {
    g.save(); g.translate(x + ox, y + oy); g.scale(facing * s, s);
    const bob = mode === 'jump' ? -Math.abs(Math.sin(t * 7)) * 40 : mode === 'walk' ? Math.sin(t * 6) * 2 : 0; g.translate(0, bob);
    const ph = mode === 'walk' || mode === 'jump' ? t * (mode === 'jump' ? 9 : 5) : 0, leg = (k) => Math.sin(ph + k) * (mode === 'stand' ? 0 : 8);
    const lw = 9 + grow;
    for (const [lx, k] of [[-34, 0], [-22, Math.PI], [26, Math.PI], [38, 0]]) seg(g, [[lx, -30], [lx + leg(k), 0]], lw, col);
    g.fillStyle = col; g.beginPath(); g.ellipse(0, -40, 48 + grow, 20 + grow, 0, 0, 7); g.fill();
    seg(g, [[-44, -46], [-64, -66 - Math.sin(t * 10) * 8 * (1 - age * 0.8)]], 7 + grow, col); // cola
    g.beginPath(); g.ellipse(52, -66, 22 + grow, 19 + grow, 0, 0, 7); g.fill(); // cabeza
    g.beginPath(); g.ellipse(72, -60, 15 + grow, 11 + grow, 0, 0, 7); g.fill(); // hocico
    g.beginPath(); g.ellipse(42, -80, 9 + grow, 16 + grow, -0.5, 0, 7); g.fill(); // oreja
    g.restore();
  };
  draw(rim, rimDir[0] * 4, rimDir[1] * 4, 2); draw(ink, 0, 0, 0);
  g.save(); g.translate(x, y); g.scale(facing * s, s); g.translate(0, mode === 'jump' ? -Math.abs(Math.sin(t * 7)) * 40 : mode === 'walk' ? Math.sin(t * 6) * 2 : 0);
  if (age > 0) { g.fillStyle = alpha(GRAY, age); g.beginPath(); g.ellipse(74, -59, 15, 10, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(58, -76, 8, 5, 0, 0, 7); g.fill(); }
  circle(g, 60, -72, 3.6, S().feature); circle(g, 87, -63, 4, '#0a0a0a');
  seg(g, [[38, -58], [46, -48]], 6, '#d64a33');
  g.restore();
}
