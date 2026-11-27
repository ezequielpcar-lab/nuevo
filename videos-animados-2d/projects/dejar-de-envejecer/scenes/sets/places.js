// sets/places.js — todos los escenarios reutilizables. Cada uno: f(g, t, cam, opts) -> { GY, CX, M }.
// Paredes, pisos y cielos se extienden más allá del cuadro para que la cámara nunca muestre bordes.
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const ground = () => E.H * V(0.8, 0.68);
const BIG = (g, y0, y1, fill) => { g.fillStyle = fill; g.fillRect(-E.W * 1.5, y0, E.W * 4, y1 - y0); };

function floor(g, M, GY, o = {}) {
  BIG(g, GY, GY + E.H * 2, linGrad(g, 0, GY, 0, GY + 500, [shade(o.color || M.floor, o.lift ?? 0.02), shade(M.dark, -0.2)]));
  FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.22)', 0.07);
}
function backWall(g, M, GY, o = {}) {
  const wall = o.wall || shade(M.wall, -0.15);
  BIG(g, -E.H * 2, GY, linGrad(g, 0, GY - V(900, 1400), 0, GY, [shade(wall, -0.45), wall, shade(wall, -0.25)]));
  g.fillStyle = shade(wall, -0.5); g.fillRect(-E.W * 1.5, GY - 14, E.W * 4, 14);
}
function cityWindow(g, M, x, y, w, h, o = {}) {
  FX.windowFrame(g, { x, y, w, h, cols: o.cols || 3, rows: o.rows || 1, frame: o.frame || shade(M.wall, -0.6), bar: 10, blinds: o.blinds || 0 }, (g, X, Y, W, H) => {
    g.fillStyle = linGrad(g, 0, Y, 0, Y + H, o.sky || M.sky); g.fillRect(X, Y, W, H);
    if (o.moon) FX.moon(g, X + W * 0.75, Y + H * 0.25, 24);
    if (o.sun) FX.sun(g, X + W * 0.5, Y + H * 0.62, 48, '#fff7e6', M.key, 4);
    if (o.stars) FX.stars(g, 0, { count: 30, area: [X, Y, W, H * 0.5], seed: 7 });
    FX.skyline(g, { x: X, y: Y + H, w: W, maxH: H * 0.55, color: alpha(shade(M.wall, -0.35), 0.85), windowColor: alpha(M.practical, 0.75), lit: 0.3, seed: o.seed || 4 });
    o.inner?.(g, X, Y, W, H);
  });
  glow(g, x + w / 2, y + h / 2, Math.max(w, h) * 0.9, o.glowC || M.key, 0.12);
}

// ---------------- BAR (noche) ----------------
export function bar(g, t, cam, o = {}) {
  const M = mood('night'), GY = ground(), CX = E.W / 2, neon = '#ff5fa8';
  layer(g, cam, 0.12, g => { backdrop(g, M.sky); FX.stars(g, t, { count: 80, area: [-E.W, -E.H, E.W * 3, E.H * 0.9] }); FX.moon(g, CX + 650, GY - V(780, 1300), 34); });
  layer(g, cam, 0.3, g => FX.skyline(g, { x: -E.W, y: GY - V(320, 520), w: E.W * 3, maxH: V(360, 600), color: shade(M.wall, -0.4), windowColor: alpha(M.practical, 0.6), lit: 0.2, seed: 12 }));
  layer(g, cam, 0.6, g => {
    const top = GY - V(640, 1000), brick = shade('#4a2a36', -0.25);
    BIG(g, top, GY, linGrad(g, 0, top, 0, GY, [shade(brick, -0.3), brick, shade(brick, -0.4)]));
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2; for (let y = top + 20; y < GY; y += 26) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2.5, y); g.stroke(); }
    // puerta del bar con luz
    const dx = CX + V(120, 60), dw = 190, dh = V(340, 420);
    g.fillStyle = linGrad(g, 0, GY - dh, 0, GY, ['#ffcf9a', '#ff8a5a']); g.fillRect(dx, GY - dh, dw, dh);
    g.fillStyle = shade(brick, -0.6); g.fillRect(dx - 14, GY - dh - 14, dw + 28, 14); g.fillRect(dx - 14, GY - dh, 14, dh); g.fillRect(dx + dw, GY - dh, 14, dh);
    glow(g, dx + dw / 2, GY - dh / 2, 360, '#ff9a5a', 0.35);
    // letrero de neón
    const ny = GY - dh - V(120, 160);
    rr(g, dx - 40, ny - 60, dw + 80, 110, 18); g.fillStyle = 'rgba(10,6,14,.85)'; g.fill();
    const flick = (Math.sin(t * 23) > 0.96) ? 0.4 : 1;
    text(g, 'BAR', dx + dw / 2, ny - 4, { size: 78, color: '#ffe0f0', glow: 40, glowColor: alpha(neon, 0.95 * flick), spacing: 10 });
    glow(g, dx + dw / 2, ny, 300, neon, 0.28 * flick);
    // ventanas
    for (const wx of [CX - V(620, 420), CX - V(300, 230), CX + V(560, 380)]) cityWindow(g, { ...M, sky: ['#3a1a2a', '#ff9a6a'] }, wx, GY - V(440, 560), 200, 180, { cols: 2, glowC: '#ff9a6a', inner: (g, X, Y, W, H) => { for (let k = 0; k < 4; k++) circle(g, X + 30 + k * 45, Y + H - 30, 16, 'rgba(20,10,20,.8)'); } });
  });
  layer(g, cam, 0.9, g => {
    floor(g, M, GY, { color: shade(M.road, 0.05) });
    FX.lampPost(g, CX - V(760, 420), GY, V(420, 560), { light: M.practical });
    FX.lightCone(g, CX - V(726, 386), GY - V(430, 570), { angle: Math.PI / 2, spread: 0.45, len: 500, color: M.practical, a: 0.16 });
    FX.pool(g, CX - V(726, 386), GY + 20, 260, 40, M.practical, 0.25);
    FX.pool(g, CX + V(215, 155), GY + 30, 300, 50, '#ff9a5a', 0.35);
    // cordón de terciopelo
    for (const px of [CX - V(80, 60), CX + V(420, 300)]) { seg(g, [[px, GY], [px, GY - 90]], 8, '#c9a65a'); circle(g, px, GY - 94, 10, '#e8c87a'); }
    g.strokeStyle = '#a0283c'; g.lineWidth = 8; g.beginPath(); g.moveTo(CX - V(80, 60), GY - 84); g.quadraticCurveTo(CX + V(170, 120), GY - 30, CX + V(420, 300), GY - 84); g.stroke();
  });
  return { GY, CX, M, rim: { color: '#ffb0d0', dir: [0.6, -0.8] } };
}

// ---------------- CANCHA (golden) ----------------
export function court(g, t, cam, o = {}) {
  const M = mood('golden'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.1, g => { backdrop(g, M.sky); FX.sun(g, CX - V(560, 200), GY - V(330, 600), 70, '#fff3dc', M.key, 5); FX.clouds(g, { y: GY - V(800, 1300), color: '#ffe0c0', a: 0.2, seed: 5 }); });
  layer(g, cam, 0.25, g => FX.skyline(g, { x: -E.W, y: GY - V(160, 260), w: E.W * 3, maxH: V(380, 600), color: mix(M.sky[0], M.dark, 0.6), windowColor: alpha(M.practical, 0.5), lit: 0.15, seed: 31 }));
  layer(g, cam, 0.45, g => { FX.godRays(g, CX - V(560, 200), GY - V(330, 600), { count: 12, angle: 0.2, spread: 1.6, len: 1800, a: 0.05, t }); for (let x = -E.W; x < E.W * 2.5; x += 260) FX.tree(g, x + ((x * 7) % 90), GY - 60, 1.3, shade(M.grass, -0.55)); });
  layer(g, cam, 0.7, g => { // reja de alambre
    g.strokeStyle = alpha(shade(M.dark, 0.2), 0.7); g.lineWidth = 2; const top = GY - V(330, 450);
    for (let x = -E.W; x < E.W * 2.5; x += 34) { g.beginPath(); g.moveTo(x, top); g.lineTo(x + 140, GY - 20); g.moveTo(x + 140, top); g.lineTo(x, GY - 20); g.stroke(); }
    for (let x = -E.W; x < E.W * 2.5; x += 300) seg(g, [[x, GY - 20], [x, top - 10]], 8, shade(M.dark, 0.1));
    seg(g, [[-E.W, top], [E.W * 2.5, top]], 6, shade(M.dark, 0.1));
  });
  layer(g, cam, 0.9, g => {
    BIG(g, GY - 20, GY + E.H * 2, linGrad(g, 0, GY - 20, 0, GY + 500, [shade('#7a4a3a', -0.15), shade('#4a2a26', -0.3)]));
    g.strokeStyle = alpha('#fff1d6', 0.55); g.lineWidth = 6; g.beginPath(); g.ellipse(CX + V(560, 300), GY + 40, 300, 40, 0, Math.PI, Math.PI * 2); g.stroke(); seg(g, [[-E.W, GY + 70], [E.W * 2.5, GY + 70]], 5, alpha('#fff1d6', 0.4));
    // aro
    const hx = CX + V(780, 380); seg(g, [[hx + 60, GY + 30], [hx + 60, GY - 420]], 14, '#1a1418'); rr(g, hx - 70, GY - 520, 150, 100, 6); g.fillStyle = alpha('#f2ece4', 0.85); g.fill(); g.strokeStyle = '#d64a33'; g.lineWidth = 5; g.strokeRect(hx - 25, GY - 480, 60, 44); g.beginPath(); g.ellipse(hx - 10, GY - 420, 42, 9, 0, 0, 7); g.stroke();
    FX.pool(g, CX - V(200, 0), GY + 40, 700, 70, M.key, 0.18);
  });
  return { GY, CX, M, rim: { color: M.rim, dir: [-0.8, -0.5] } };
}
export function ball(g, x, y, r) { circle(g, x, y, r, '#e07a3a'); g.strokeStyle = '#2a1410'; g.lineWidth = r * 0.12; g.beginPath(); g.arc(x, y, r, 0, 7); g.moveTo(x - r, y); g.lineTo(x + r, y); g.moveTo(x, y - r); g.lineTo(x, y + r); g.stroke(); glow(g, x - r * 0.3, y - r * 0.3, r, '#ffd0a0', 0.25); }

// ---------------- OFICINA (interiorCool, noche) ----------------
export function office(g, t, cam, o = {}) {
  const M = mood('interiorCool'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.4, g => {
    backWall(g, M, GY);
    cityWindow(g, mood('night'), CX - V(820, 480), GY - V(640, 900), V(1640, 960), V(470, 560), { cols: 6, stars: true, moon: true, seed: 9 });
    for (const x of [CX - 600, CX, CX + 600]) { rr(g, x - 70, GY - V(760, 1060), 140, 14, 7); g.fillStyle = '#e8f2ff'; g.fill(); FX.lightCone(g, x, GY - V(746, 1046), { len: 700, spread: 0.6, color: '#cfe4ff', a: 0.08 }); }
  });
  layer(g, cam, 0.75, g => {
    floor(g, M, GY);
    for (const x of [CX - V(700, 420), CX + V(560, 380)]) { FX.counter(g, { x: x - 160, y: GY, w: 320, h: 110, color: shade(M.wall, -0.5), top: shade(M.wall, -0.1), doors: 3 });
      FX.screen(g, { x: x - 60, y: GY - 230, w: 120, h: 80, glowC: M.practical, a: 0.25 }, (g, X, Y, W, H) => { for (let k = 0; k < 4; k++) { g.fillStyle = alpha(M.practical, 0.6); g.fillRect(X + 10, Y + 12 + k * 16, W * (0.4 + ((k * 37) % 50) / 100), 6); } }); }
    FX.pool(g, CX, GY + 20, 600, 70, M.key, 0.12);
  });
  return { GY, CX, M, rim: { color: M.rim, dir: [0, -1] } };
}

// ---------------- CONSULTORIO / HOSPITAL / PASILLO ----------------
export function clinic(g, t, cam, o = {}) {
  const night = o.night, M = mood(night ? 'night' : 'interiorCool'), GY = ground(), CX = E.W / 2;
  const wallC = night ? '#232a44' : '#2e3a52';
  layer(g, cam, 0.4, g => {
    backWall(g, M, GY, { wall: wallC });
    g.fillStyle = shade(wallC, 0.12); g.fillRect(-E.W * 1.5, GY - V(300, 380), E.W * 4, 10); // zócalo
    cityWindow(g, mood('night'), CX - V(560, 360), GY - V(660, 980), V(460, 400), V(340, 420), { cols: 2, moon: true, stars: true, blinds: 5, seed: 17 });
    FX.clock(g, CX + V(80, 120), GY - V(640, 1080), 40, (o.clock ?? (19 * 3600 + 20 * 60)) + t * (o.clockSpeed ?? 1), { face: '#e6ecf4' });
    // puerta
    const dx = CX + V(380, 220);
    FX.door(g, { x: dx, y: GY, w: 170, h: V(380, 480), color: shade(wallC, -0.2), open: o.doorOpen ?? 0.15, light: '#e0f0ff' });
    if (!o.noCross) { rr(g, CX - V(840, 500), GY - V(560, 900), 90, 90, 8); g.fillStyle = 'rgba(240,248,255,.15)'; g.fill(); g.fillStyle = '#ff6f61'; g.fillRect(CX - V(810, 470), GY - V(545, 885), 30, 60); g.fillRect(CX - V(825, 485), GY - V(530, 870), 60, 30); }
  });
  layer(g, cam, 0.8, g => {
    floor(g, M, GY, { color: night ? '#1e2338' : '#2a3048' });
    if (o.monitor !== false) {
      const mx = CX - V(120, 120); seg(g, [[mx, GY], [mx, GY - 300]], 8, '#141820');
      FX.screen(g, { x: mx - 80, y: GY - 420, w: 160, h: 110, glowC: '#5fd39a', a: 0.3 }, (g, X, Y, W, H) => { g.strokeStyle = '#5fd39a'; g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40, ph = (u * 3 + t * 1.2) % 1; const y = Y + H / 2 - (ph > 0.45 && ph < 0.5 ? 40 : ph > 0.5 && ph < 0.53 ? -20 : 0) * (o.pulse ?? 1); i ? g.lineTo(X + 8 + u * (W - 16), y) : g.moveTo(X + 8, y); } g.stroke(); });
    }
    if (o.bed !== false) FX.bed(g, { x: CX - V(40, 60), y: GY, w: V(460, 380), color: night ? '#6a78a8' : '#8fa6c8', frame: '#1a1e2c', pillow: '#eef2fa' });
    FX.pool(g, CX - V(320, 200), GY + 20, 500, 70, night ? '#a9b8ff' : M.key, 0.15);
  });
  return { GY, CX, M, rim: { color: M.rim, dir: [-0.6, -0.8] } };
}
export function corridor(g, t, cam, o = {}) {
  const M = mood('interiorCool'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.3, g => {
    backWall(g, M, GY, { wall: '#34405a' });
    for (let x = -E.W; x < E.W * 2.5; x += 520) { FX.door(g, { x, y: GY, w: 160, h: V(360, 460), color: '#2a3348', open: 0 }); rr(g, x + 20, GY - V(330, 430), 120, 50, 6); g.fillStyle = 'rgba(200,230,255,.25)'; g.fill(); }
    for (let x = -E.W; x < E.W * 2.5; x += 400) { rr(g, x - 80, GY - V(720, 1100), 160, 14, 7); g.fillStyle = '#eef6ff'; g.fill(); FX.lightCone(g, x, GY - V(706, 1086), { len: 760, spread: 0.55, color: '#dceaff', a: 0.09 }); }
    seg(g, [[-E.W, GY - 150], [E.W * 2.5, GY - 150]], 10, '#5a6a8a');
  });
  layer(g, cam, 0.85, g => { floor(g, M, GY, { color: '#2a3248' }); for (let x = -E.W; x < E.W * 2.5; x += 400) FX.pool(g, x, GY + 30, 260, 40, '#dceaff', 0.18); });
  return { GY, CX, M, rim: { color: M.rim, dir: [0, -1] } };
}

// ---------------- DEPARTAMENTO DE SAM (noche, lluvia opcional) ----------------
export function apartment(g, t, cam, o = {}) {
  const M = mood('night'), GY = ground(), CX = E.W / 2, warm = '#ffc070';
  layer(g, cam, 0.4, g => {
    backWall(g, M, GY, { wall: '#2c2b48' });
    cityWindow(g, M, CX - V(300, 260), GY - V(640, 980), V(600, 520), V(420, 480), { cols: 2, rows: 2, moon: !o.rain, stars: !o.rain, seed: 21, inner: o.rain ? (g, X, Y, W, H) => { g.save(); g.beginPath(); g.rect(X, Y, W, H); g.clip(); FX.rain(g, t, { count: 120, color: '#cfd9ff', a: 0.35, seed: 3 }); g.restore(); } : null });
    // cuadro y estante
    rr(g, CX + V(420, 300), GY - V(600, 900), 150, 110, 6); g.fillStyle = shade('#2c2b48', -0.4); g.fill(); g.fillStyle = alpha(warm, 0.25); g.fillRect(CX + V(430, 310), GY - V(590, 890), 130, 90);
  });
  layer(g, cam, 0.8, g => {
    floor(g, M, GY, { color: '#25243a' });
    // lámpara cálida
    const lx = CX + V(640, 360); seg(g, [[lx, GY], [lx, GY - 300]], 6, '#141220'); poly(g, [[lx - 46, GY - 300], [lx + 46, GY - 300], [lx + 30, GY - 360], [lx - 30, GY - 360]], '#e8b870'); glow(g, lx, GY - 320, 420, warm, 0.4); FX.pool(g, lx, GY + 20, 380, 60, warm, 0.25);
    if (o.bed) FX.bed(g, { x: CX - V(560, 360), y: GY, w: V(520, 420), color: '#4a4a80', frame: '#1a1828', pillow: '#d8d6ee' });
    if (o.boxes) for (const [bx, by, bw, bh] of [[CX - V(760, 440), 0, 170, 130], [CX - V(600, 300), 0, 150, 110], [CX - V(690, 380), 130, 150, 100], [CX + V(250, 200), 0, 180, 140]]) { g.fillStyle = '#9a6a44'; g.fillRect(bx, GY - by - bh, bw, bh); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(bx + bw / 2 - 12, GY - by - bh, 24, bh); g.fillStyle = 'rgba(255,220,170,.2)'; g.fillRect(bx, GY - by - bh, bw, 5); }
  });
  return { GY, CX, M, rim: { color: '#ffd09a', dir: [0.8, -0.5] } };
}

// ---------------- CALLE / BARRIO (dusk | day | night | morning) ----------------
export function street(g, t, cam, o = {}) {
  const md = o.mood || 'dusk', M = mood(md === 'morning' ? 'storm' : md), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.12, g => { backdrop(g, md === 'morning' ? ['#5a6488', '#9aa0b8', '#c8c0c0'] : M.sky); if (md === 'night') FX.stars(g, t, { count: 90, area: [-E.W, -E.H, E.W * 3, E.H * 0.9] }); if (md === 'dusk' || md === 'day') FX.sun(g, CX + V(700, 260), GY - V(420, 800), 56, '#fff3dc', M.key, 5); FX.clouds(g, { y: GY - V(780, 1300), color: '#ffffff', a: md === 'morning' ? 0.18 : 0.1, seed: 22 }); });
  layer(g, cam, 0.3, g => FX.skyline(g, { x: -E.W, y: GY - V(260, 420), w: E.W * 3, maxH: V(300, 520), color: mix(M.sky[0], M.dark, 0.55), windowColor: alpha(M.practical, 0.5), lit: md === 'day' ? 0 : 0.2, seed: 41 }));
  layer(g, cam, 0.6, g => {
    const r = rng(5); const cols = ['#5a3a4a', '#4a3a5a', '#5a4a3a', '#3a4a5a'];
    for (let i = -3; i <= 4; i++) { const hx = CX + i * 560 - 260, hw = 480, hh = V(430, 600) + r() * 80; const c = shade(md === 'day' ? mix(cols[(i + 8) % 4], '#8a7a8a', 0.3) : cols[(i + 8) % 4], -0.2);
      g.fillStyle = c; g.fillRect(hx, GY - hh, hw, hh); poly(g, [[hx - 30, GY - hh], [hx + hw / 2, GY - hh - 150], [hx + hw + 30, GY - hh]], shade(c, -0.35));
      const lit = md !== 'day'; for (const wx of [hx + 50, hx + hw - 170]) { g.fillStyle = lit ? linGrad(g, 0, GY - hh + 90, 0, GY - hh + 230, [M.practical, shade(M.practical, -0.4)]) : '#2a3040'; g.fillRect(wx, GY - hh + 90, 120, 140); g.fillStyle = shade(c, -0.5); g.fillRect(wx + 56, GY - hh + 90, 8, 140); if (lit) glow(g, wx + 60, GY - hh + 160, 180, M.practical, 0.12); }
      FX.door(g, { x: hx + hw / 2 - 60, y: GY, w: 120, h: 230, color: shade(c, -0.3), open: i === 0 ? (o.doorOpen ?? 0) : 0, light: M.practical }); }
  });
  layer(g, cam, 0.85, g => {
    floor(g, M, GY, { color: shade(M.road, 0.05) });
    for (let x = -E.W; x < E.W * 2.5; x += 300) { g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, GY + 6); g.lineTo(x + 140, GY + 6); g.stroke(); }
    if (o.fence !== false) { for (let x = CX - V(900, 520); x < CX - V(380, 180); x += 30) seg(g, [[x, GY], [x, GY - 120]], 6, shade(M.dark, 0.1)); seg(g, [[CX - V(910, 530), GY - 100], [CX - V(370, 170), GY - 100]], 6, shade(M.dark, 0.1)); }
    FX.lampPost(g, CX + V(840, 440), GY, V(420, 560), { light: M.practical, on: md !== 'day' });
    if (md !== 'day') { FX.lightCone(g, CX + V(874, 474), GY - V(430, 570), { spread: 0.45, len: 500, color: M.practical, a: 0.14 }); FX.pool(g, CX + V(874, 474), GY + 20, 260, 40, M.practical, 0.25); }
    FX.tree(g, CX - V(1000, 600), GY, 2, shade(M.grass, -0.6));
  });
  const rimC = md === 'day' ? M.rim : md === 'night' ? M.rim : M.rim;
  return { GY, CX, M, rim: { color: rimC, dir: [0.7, -0.7] } };
}
export function car(g, x, y, s = 1, o = {}) { // auto negro de lado, mirando a +x
  const { color = '#14121a', lights = true, rim = '#c9d4ff' } = o; g.save(); g.translate(x, y); g.scale(s * (o.facing || 1), s);
  const body = (c, d) => { g.fillStyle = c; g.beginPath(); g.moveTo(-260 - d, -40); g.lineTo(-250 - d, -110 - d); g.lineTo(-120, -120 - d); g.lineTo(-60, -190 - d); g.lineTo(110, -190 - d); g.lineTo(180, -120 - d); g.lineTo(260 + d, -105 - d); g.lineTo(270 + d, -40); g.closePath(); g.fill(); };
  body(rim, 4); body(color, 0);
  g.fillStyle = '#2a3048'; g.beginPath(); g.moveTo(-100, -125); g.lineTo(-50, -178); g.lineTo(30, -178); g.lineTo(30, -125); g.fill(); g.beginPath(); g.moveTo(45, -125); g.lineTo(45, -178); g.lineTo(100, -178); g.lineTo(158, -125); g.fill();
  for (const wx of [-170, 170]) { circle(g, wx, -40, 52, '#08080c'); circle(g, wx, -40, 24, '#4a4a58'); }
  if (lights) { circle(g, 255, -95, 10, '#fff4d0'); glow(g, 255, -95, 160, '#fff0c0', 0.5); circle(g, -255, -95, 8, '#ff3a2a'); glow(g, -255, -95, 80, '#ff3a2a', 0.5); }
  g.restore();
}

// ---------------- PARQUE (golden) y MUELLE / ORILLA (dusk) ----------------
export function park(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.1, g => { backdrop(g, M.sky); FX.sun(g, CX + V(380, 160), GY - V(260, 520), 80, '#fff3dc', M.key, 5); });
  layer(g, cam, 0.25, g => { FX.godRays(g, CX + V(380, 160), GY - V(260, 520), { count: 14, angle: Math.PI, spread: 2.4, len: 1800, a: 0.06, t }); FX.hills(g, { y: GY - 120, amp: 50, color: mix(M.sky[1], M.dark, 0.6), seed: 3 }); });
  layer(g, cam, 0.5, g => { FX.hills(g, { y: GY - 40, amp: 30, color: shade(M.grass, -0.45), seed: 8 }); for (let x = -E.W; x < E.W * 2.5; x += 380) FX.tree(g, x + ((x * 13) % 140), GY - 30, 1.6 + ((x * 7) % 5) / 10, shade(M.grass, -0.65)); });
  layer(g, cam, 0.85, g => {
    BIG(g, GY, GY + E.H * 2, linGrad(g, 0, GY, 0, GY + 500, [shade(M.grass, -0.25), shade(M.grass, -0.7)]));
    g.fillStyle = shade('#c09a7a', -0.35); g.beginPath(); g.ellipse(CX, GY + 70, E.W * 1.4, 50, 0, 0, 7); g.fill(); // sendero
    FX.lampPost(g, CX - V(760, 440), GY, V(380, 500), { light: M.practical, on: false });
    // banco
    const bx = CX - V(520, 320); seg(g, [[bx - 90, GY - 60], [bx + 90, GY - 60]], 10, '#2a1e1e'); seg(g, [[bx - 90, GY - 100], [bx + 90, GY - 100]], 8, '#2a1e1e'); for (const d of [-70, 70]) seg(g, [[bx + d, GY], [bx + d, GY - 60]], 6, '#1a1214');
    FX.pool(g, CX + V(100, 0), GY + 40, 700, 70, M.key, 0.2);
  });
  return { GY, CX, M, rim: { color: M.rim, dir: [0.8, -0.5] } };
}
export function shore(g, t, cam, o = {}) {
  const M = mood('dusk'), GY = ground(), CX = E.W / 2, HZ = GY - V(150, 300);
  layer(g, cam, 0.08, g => { backdrop(g, M.sky); FX.sun(g, CX + V(300, 100), HZ - 20, 90, '#fff3dc', M.key, 5); FX.clouds(g, { y: HZ - V(500, 800), color: '#ffd0b0', a: 0.18, seed: 9 }); });
  layer(g, cam, 0.2, g => {
    BIG(g, HZ, GY + E.H * 2, linGrad(g, 0, HZ, 0, GY + 300, [mix(M.sky[3], M.sky[1], 0.4), shade(M.sky[0], -0.3), shade(M.dark, -0.2)]));
    for (let i = 0; i < 40; i++) { const y = HZ + 6 + i * i * 0.4, w = 60 + i * 9, x = CX + V(300, 100) + Math.sin(i * 1.7 + t * 0.8) * 30; g.fillStyle = alpha('#ffe0b0', 0.35 * (1 - i / 40)); g.fillRect(x - w / 2, y, w, 3); }
    FX.hills(g, { y: HZ + 4, amp: 18, color: shade(M.sky[0], -0.2), seed: 4 });
  });
  layer(g, cam, 0.9, g => { // muelle de madera a la izquierda
    const px = CX - V(300, 200);
    g.fillStyle = '#2a1c1c'; g.fillRect(-E.W * 1.5, GY - 16, px + E.W * 1.5 + 0, 28); for (let x = -E.W; x < px; x += 80) { g.fillRect(x, GY, 18, 160); g.fillStyle = 'rgba(255,200,150,.15)'; g.fillRect(x, GY - 16, 3, 28); g.fillStyle = '#2a1c1c'; }
    BIG(g, GY + 160, GY + E.H * 2, shade(M.dark, -0.4));
  });
  return { GY, CX, M, HZ, rim: { color: M.rim, dir: [0.8, -0.4] } };
}
export function boat(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); poly(g, [[-200, -60], [200, -60], [150, 10], [-160, 10]], '#1a1216'); g.fillStyle = alpha('#ffc68a', 0.6); g.fillRect(-200, -64, 400, 5); g.restore(); }

// ---------------- COCINA DE MAMÁ (interiorWarm) + MARCO DE LA PUERTA ----------------
export const frameX = () => E.W / 2 + V(330, 200);
export function kitchen(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), GY = ground(), CX = E.W / 2, nightK = o.night;
  const wallC = '#5a4040';
  layer(g, cam, 0.4, g => {
    backWall(g, M, GY, { wall: wallC });
    // azulejos
    g.fillStyle = alpha('#ffe0c0', 0.06); for (let x = -E.W; x < CX + 100; x += 46) for (let y = GY - 330; y < GY - 120; y += 46) g.fillRect(x, y, 42, 42);
    cityWindow(g, nightK ? mood('night') : M, CX - V(760, 470), GY - V(640, 940), V(420, 360), V(300, 360), { cols: 2, sun: !nightK, moon: nightK, seed: 33, sky: nightK ? mood('night').sky : ['#c98a74', '#f2b585', '#f7cf98'], glowC: nightK ? '#a9b8ff' : M.key });
    // estante con frascos
    seg(g, [[CX - V(220, 150), GY - V(520, 780)], [CX + V(80, 60), GY - V(520, 780)]], 8, '#2a1a1a'); for (let k = 0; k < 5; k++) { rr(g, CX - V(200, 140) + k * 56, GY - V(580, 840), 36, 56, 6); g.fillStyle = ['#c86a4a', '#e8c87a', '#8ab08a', '#d8a0a0', '#a08ac8'][k]; g.fill(); }
    // marco de la puerta (motivo)
    const fx = frameX(), fw = 220, fh = V(560, 700);
    g.fillStyle = linGrad(g, 0, GY - fh, 0, GY, ['#2a1a1a', '#1a1012']); g.fillRect(fx, GY - fh, fw, fh); // pasillo oscuro
    g.fillStyle = alpha('#ffd28a', 0.08); g.fillRect(fx, GY - fh, fw, fh);
    for (const [x, w] of [[fx - 34, 34], [fx + fw, 34]]) { g.fillStyle = '#d8c0a0'; g.fillRect(x, GY - fh - 34, w, fh + 34); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + w - 6, GY - fh, 6, fh); }
    g.fillStyle = '#d8c0a0'; g.fillRect(fx - 34, GY - fh - 34, fw + 68, 34);
    if (o.marks !== false) marksOn(g, fx - 34, GY, o.marksAge ?? 45, 1);
  });
  layer(g, cam, 0.75, g => {
    floor(g, M, GY, { color: '#4a3030' });
    FX.counter(g, { x: CX - V(1100, 760), y: GY, w: V(820, 560), h: 120, color: shade(wallC, -0.5), top: '#c8a888', doors: 5 });
    if (o.table) { const tx = CX - V(60, 40); rr(g, tx - 260, GY - 150, 520, 18, 8); g.fillStyle = '#3a2420'; g.fill(); for (const d of [-220, 220]) seg(g, [[tx + d, GY - 140], [tx + d, GY]], 12, '#2a1a18'); g.fillStyle = alpha('#fff', 0.12); g.fillRect(tx - 250, GY - 150, 500, 3);
      for (const d of [-130, 130]) { g.fillStyle = '#f2ece4'; g.beginPath(); g.ellipse(tx + d, GY - 154, 56, 10, 0, 0, 7); g.fill(); } }
    // lámpara colgante
    const lx = CX - V(60, 40); seg(g, [[lx, -E.H], [lx, GY - V(560, 860)]], 3, '#1a1012'); poly(g, [[lx - 70, GY - V(500, 800)], [lx + 70, GY - V(500, 800)], [lx + 30, GY - V(560, 860)], [lx - 30, GY - V(560, 860)]], '#2a1a18'); glow(g, lx, GY - V(490, 790), 500, M.practical, 0.35);
    FX.lightCone(g, lx, GY - V(500, 800), { len: 800, spread: 0.7, color: M.practical, a: 0.1 });
    FX.pool(g, lx, GY + 30, 520, 70, M.practical, 0.25);
  });
  return { GY, CX, M, rim: { color: M.rim, dir: [-0.3, -1] } };
}
// rayitas en el marco: x = borde izquierdo del marco, GY = piso, age = cuántas marcar (1..45), k = escala
export function markY(GY, a) { const h = a <= 20 ? 60 + (a / 20) * 250 + Math.sqrt(a) * 6 : 60 + 250 + Math.sqrt(20) * 6; return GY - h * 1.0; }
export function marksOn(g, x, GY, age, k = 1, o = {}) {
  const ink = o.ink || '#3a2a2a';
  for (let a = 1; a <= Math.min(age, 45); a++) { const y = markY(GY, a); seg(g, [[x + 6, y], [x + 30, y]], a > 20 ? 2.4 : 1.8, alpha(ink, a > 20 ? 0.55 : 0.8)); }
}

// ---------------- CAFÉ, PLAYA, CELDA, LAB PÚBLICO, AUTO DE NOCHE ----------------
export function cafe(g, t, cam, o = {}) {
  const M = mood('golden'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.4, g => { backWall(g, M, GY, { wall: '#4a3030' }); cityWindow(g, M, CX - V(700, 420), GY - V(620, 900), V(1400, 840), V(420, 480), { cols: 5, sun: true, seed: 3 }); });
  layer(g, cam, 0.85, g => { floor(g, M, GY, { color: '#3a2424' }); FX.pool(g, CX, GY + 30, 700, 70, M.key, 0.22); });
  return { GY, CX, M, rim: { color: M.rim, dir: [0, -1] } };
}
export function beach(g, t, cam, o = {}) {
  const noon = !o.sunset, M = mood(noon ? 'day' : 'golden'), GY = ground(), CX = E.W / 2, HZ = GY - V(200, 380);
  layer(g, cam, 0.08, g => { backdrop(g, noon ? ['#3a6aa8', '#8fb8e0', '#f0e0c0'] : M.sky); FX.sun(g, CX + V(noon ? -200 : 500, 0), noon ? GY - V(780, 1300) : HZ - 30, noon ? 70 : 90, '#ffffff', noon ? '#ffe08a' : M.key, noon ? 7 : 5); });
  layer(g, cam, 0.25, g => { BIG(g, HZ, GY + 40, linGrad(g, 0, HZ, 0, GY, noon ? ['#2a5a8a', '#3a7aa0'] : [mix(M.sky[2], M.sky[0], 0.5), shade(M.sky[0], -0.2)])); for (let i = 0; i < 18; i++) { g.fillStyle = alpha('#ffffff', 0.18); g.fillRect(-E.W + ((i * 397) % (E.W * 3)) + Math.sin(t + i) * 20, HZ + 10 + i * 9, 120, 3); } });
  layer(g, cam, 0.85, g => BIG(g, GY - 10, GY + E.H * 2, linGrad(g, 0, GY - 10, 0, GY + 400, [noon ? '#d8b888' : '#b8805a', noon ? '#8a6a4a' : '#4a2a20'])));
  return { GY, CX, M, rim: { color: noon ? '#fff6d8' : M.rim, dir: [-0.3, -1] } };
}
export function labcell(g, t, cam, o = {}) {
  const M = mood('void'), GY = ground(), CX = E.W / 2, cold = '#7fe0ff';
  layer(g, cam, 0.4, g => { backWall(g, M, GY, { wall: '#141c2e' }); for (let x = -E.W; x < E.W * 2.5; x += 240) { seg(g, [[x, -E.H], [x, GY]], 3, alpha(cold, 0.08)); } text(g, 'ETERNA', CX - V(620, 300), GY - V(520, 900), { size: 60, color: alpha(cold, 0.6), glow: 20, glowColor: alpha(cold, 0.7), spacing: 14, font: FONTS.ui, weight: 900 }); });
  layer(g, cam, 0.85, g => { floor(g, M, GY, { color: '#0e1424' }); FX.lightCone(g, CX, GY - V(760, 1200), { len: 900, spread: 0.35, color: cold, a: 0.22 }); FX.pool(g, CX, GY + 20, 340, 50, cold, 0.35); });
  return { GY, CX, M, rim: { color: cold, dir: [0, -1] } };
}
export function publiclab(g, t, cam, o = {}) {
  const M = mood('day'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.4, g => { backWall(g, M, GY, { wall: '#6a7890' }); cityWindow(g, { ...M, wall: '#6a7890' }, CX - V(820, 480), GY - V(660, 980), V(1640, 960), V(440, 520), { cols: 6, sun: true, sky: ['#8fb0d8', '#cfdcea', '#ffe8c8'], seed: 15 });
 });
  layer(g, cam, 0.8, g => { floor(g, M, GY, { color: '#5a6278' }); FX.counter(g, { x: CX - V(900, 520), y: GY, w: V(1800, 1040), h: 110, color: '#3a4258', top: '#dfe6f0', doors: 10 }); for (let k = 0; k < 6; k++) { const x = CX - V(800, 460) + k * V(300, 170); rr(g, x, GY - 170, 26, 60, 8); g.fillStyle = ['#5fd39a', '#8fb8e8', '#ffd47e'][k % 3]; g.fill(); } FX.pool(g, CX, GY + 30, 800, 70, '#fff6e0', 0.2); });
  return { GY, CX, M, rim: { color: '#fff6e0', dir: [0, -1] } };
}
// interior del auto de noche con lluvia en el vidrio (para primeros planos de Black)
export function carNight(g, t, cam, o = {}) {
  const M = mood('storm'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.2, g => { backdrop(g, M.sky); FX.skyline(g, { x: -E.W, y: E.H * 0.85, w: E.W * 3, maxH: 500, color: '#1a2038', windowColor: alpha('#ffb860', 0.8), lit: 0.35, seed: 61 }); for (let i = 0; i < 14; i++) glow(g, ((i * 293) % (E.W + 400)) - 200, E.H * (0.4 + ((i * 7) % 5) / 12), 90 + (i % 3) * 40, i % 2 ? '#ff6a4a' : '#ffd080', 0.25); });
  layer(g, cam, 0.5, g => FX.rain(g, t, { count: 160, color: '#cfd9ff', a: 0.3, seed: 8 }));
  return { GY, CX, M, rim: { color: '#ff9a7a', dir: [1, -0.2] } };
}
// fondo oscuro genérico para frases grandes
export function voidBg(g, t, cam, o = {}) {
  const M = mood('void'); layer(g, cam, 0.3, g => { backdrop(g, ['#0a0812', '#1a1226', '#2a1a2a']); glow(g, E.W / 2, E.H * 0.55, E.W * 0.6, o.glow || '#ff9a5a', 0.12); });
  return { GY: ground(), CX: E.W / 2, M };
}
