// thumbs.js — 3 miniaturas 1280x720, una por título.
import { E, registerShot, mood, layer, blurLayer, veil, glow, alpha, text, FONTS, seg } from '/engine/core.js';
import { bigFace, POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bar, shore, boat, kitchen, frameX, ground } from '../sets/places.js';
import { SAM, LEO, MAMA, fig } from '../cast.js';
import { idCard } from '../shots/01_gancho.js';
import { frameClose, markYc } from '../shots/04_mama.js';

// 1) primer plano + prueba: cara joven de Sam + carnet "1981"
registerShot('thumb1', { draw(g, t) {
  blurLayer(g, 14, g => bar(g, 0, { z: 1.5, x: 200, y: -150 })); veil(g, '#0c0810', 0.45);
  const cx = E.W * 0.7, cy = E.H * 0.62, r = 360; glow(g, cx, cy, 700, '#ff9a5a', 0.25);
  bigFace(g, cx, cy, r, { outfit: SAM, expr: 'smirk', rimColor: '#ffcf8f', rimSide: -1 });
  idCard(g, E.W * 0.3, E.H * 0.72, 620, { rot: -0.1 });
  UI.thumbText(g, ['NACÍ EN', '1981.'], { x: 80, y: 60, size: 190, maxW: E.W * 0.5 });
} });
// 2) escena abierta + texto enorme: el bote se aleja, Sam en el muelle
registerShot('thumb2', { draw(g, t) {
  const cam = { z: 1.0, x: -80, y: 60 }; const R = shore(g, 0, cam); const GY = R.GY;
  layer(g, cam, 0.9, g => { const bx = E.W / 2 + 330, by = R.HZ + 70, bs = 0.4; fig(g, { x: bx - 70 * bs, y: by - 58 * bs, s: 0.85 * bs, facing: -1, outfit: LEO, pose: POSES.sad, expr: 'sad', rim: R.rim, shadow: false }); fig(g, { x: bx + 40 * bs, y: by - 58 * bs, s: 0.85 * bs, facing: -1, outfit: MAMA, pose: POSES.wave, expr: 'smile', rim: R.rim, shadow: false }); boat(g, bx, by, bs); });
  layer(g, cam, 1, g => fig(g, { x: E.W / 2 - 520, y: GY - 14, s: 1.9, facing: 1, outfit: SAM, pose: POSES.sad, expr: 'sad', rim: { color: '#ffc68a', dir: [0.8, -0.4] } }));
  UI.thumbText(g, ['TODOS ENVEJECEN.', 'MENOS TÚ.'], { x: E.W / 2, y: 50, size: 170, maxW: E.W * 0.9, align: 'center' });
} });
// 3) acción: Sam contra el marco, la rayita apilada en el mismo lugar
registerShot('thumb3', { draw(g, t) {
  const y20 = markYc(20), cam = { z: 1.15, x: -217, y: -387 };
  frameClose(g, 0, cam, { age: 45, labels: false, extra: (g, fx, fw) => {
    fig(g, { x: fx + fw + 150, y: y20 + 234 * 5 + 4, s: 5.0, facing: -1, outfit: SAM, pose: POSES.stand, expr: 'shocked', rim: { color: '#ffcf8f', dir: [-1, -0.3] }, shadow: false });
    seg(g, [[fx - 10, y20], [fx + fw + 200, y20]], 10, '#ffd23f'); glow(g, fx + fw / 2, y20, 220, '#ffd23f', 0.4);
    text(g, '×25', fx - 40, y20 - 6, { size: 70, color: '#ffd23f', font: FONTS.ui, weight: 900, align: 'right', glow: 20, glowColor: 'rgba(255,200,60,.7)' });
  } });
  UI.thumbText(g, ['LA MISMA', 'RAYITA.'], { x: 70, y: 60, size: 190, maxW: E.W * 0.45 });
} });
