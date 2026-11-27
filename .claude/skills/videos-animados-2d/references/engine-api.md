# Referencia del motor

## Estructura de carpetas
```
videos-animados-2d/
  render.mjs  player.html  package.json
  engine/   core.js styles.js rig2d.js fx2d.js ui2d.js three-kit.js player.js
  tools/    doctor.py verify_kit.py new_project.py transcribe.py parse_script.py beats.py common.py
  audio/    dsp.py sfx.py music.py mix.py
  examples/reaction-time/   (proyecto de referencia: escenas + historia)
  projects/<slug>/
     config.json   input/ (voz, guion, música)   timeline/ (palabras, oraciones, ritmos)
     story/shots.json  story/bible.md   scenes/cast.js  scenes/sets/*.js  scenes/shots/*.js
     build/ (sheets, stills, styles, parts, music.wav, mix.wav, video_silent.mp4)   out/<title>.mp4
```
Todo `.js` dentro de `scenes/` se carga automáticamente (se omiten los que empiezan con `_`). Importa el motor con rutas absolutas (`'/engine/core.js'`) y los archivos del proyecto con rutas relativas (`'../cast.js'`).

## config.json
`{ title, aspect: "16:9"|"9:16", resolution: "720p"|"1080p"|"1440p"|"2160p", fps: 24, style: "dusk", voiceover, script, duration, captions: bool, captionStyle?: {y,size,max}, bars: null|"wide"|"scope"|"none"|number, fadeIn: 0.5, fadeOut: 0.8, music: {enabled, gainDb, file?, seed?, key?}, sfx: {enabled, gainDb}, loudness: -14 }`

## story/shots.json
```json
{ "title": "…", "duration": 312.4,
  "shots": [ { "id": "s001", "start": 0, "end": 3.4, "line": "palabras habladas", "scene": "lo que se ve", "set": "cafe",
               "bars": null, "in": {"type": "cut|fade|dip|dipWhite|flash|whip|zoom", "dur": 0.4, "dir": 1},
               "sfx": [{"at": 0.4, "name": "buzz", "gain": -10}], "amb": {"name": "murmur", "gain": -26},
               "params": {}, "vignette": true, "captions": true, "notes": "" } ],
  "music": [ {"start": 0, "end": 42, "mood": "mystery", "intensity": 0.4} ],
  "sfx": [ {"t": 120.5, "name": "impact", "gain": -6} ] }
```

## Módulos de tomas
```js
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, wordTime, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';  import * as UI from '/engine/ui2d.js';
import { lab } from '../sets/lab.js';  import { MAX, DOC } from '../cast.js';

registerShot('s013', { draw(g, t, info) {            // 2D: g = contexto canvas en unidades lógicas, t = segundos dentro de la toma
  const cam = { z: 1 + 0.06 * ease.inOut(t / info.dur), x: -30 };
  const { GY, M } = lab(g, t, cam);
  layer(g, cam, 1, g => drawFigure(g, { x: E.W/2 - 40, y: GY, s: 1.4, facing: -1, outfit: DOC,
        pose: breathe(posesAt(t, [[0, 'stand'], [0.4, 'point']]), t), expr: 'smile', rim: { color: M.rim, dir: [0, -1] } }));
  FX.dust(g, t);
}});
registerShot('s008', { kind: '3d',                   // 3D: init una vez (T = three-kit), draw en cada cuadro, overlay 2D opcional
  init(T, info) { const st = T.stage({ mood: 'golden' }); /* construir */ return { stage: st }; },
  draw(s, t, info, T) { T.orbit(s.stage.camera, t, { target: [0, 1, 0], radius: 6, height: 2.5, from: -0.8, to: 0.3, dur: info.dur }); },
  overlay(g, t, info, s) { /* gráficos 2D encima, unidades lógicas */ } });
```
`info = { dur, globalT, p, line, shot, ...shot.params }`. Un error dentro de una toma se imprime en la consola y se dibuja como texto rojo en el cuadro, así que revisa lo que muestra el render.

## Miniaturas (story/thumbs.json + `--thumbs`)
```json
{ "duration": 3, "shots": [
  { "id": "thumb1", "start": 0, "end": 1, "title": "¿Y si fueras INMORTAL?", "text": ["NO PUEDES", "MORIR."], "emotion": "curiosidad" },
  { "id": "thumb2", "start": 1, "end": 2, "title": "…", "text": ["…"], "emotion": "miedo" },
  { "id": "thumb3", "start": 2, "end": 3, "title": "…", "text": ["…"], "emotion": "reto" } ] }
```
- Escenas en `scenes/thumbs/*.js` con `registerShot('thumb1', { draw(g, t, info) {…} })`. Pueden importar `../cast.js` y `../sets/*.js` (ruta relativa desde `scenes/thumbs/`).
- `node render.mjs --project projects/<slug> --thumbs` dibuja cada toma a la mitad de su duración (o en `"at"` segundos) y guarda `out/miniaturas/miniatura_N.png` a 1280×720, más `build/thumbs_sheet.png`. Siempre en 16:9 (lógico 1920×1080, `E.vertical = false`), sin subtítulos, sin fundidos y sin barras (`config.thumbBars` para cambiarlo). El color y la viñeta del estilo sí se aplican.
- `UI.thumbText(g, lines, { x = 80, y = 70, size = 190, maxW = E.W*0.52, align = 'left'|'center', colors = ['#ffffff', '#FFD23F'] })`: 1–3 líneas grandes con borde oscuro letra por letra y sombra. `lines` acepta strings o `{ str, color, size }`. Devuelve la `y` debajo de la última línea.

## Texto en español
- Todos los textos que pases a `UI.*` y a `text()` van en español: `UI.titleCard(g, t, { lines: ['¿Y SI', 'TU CORAZÓN LATIERA MÁS LENTO?'] })`, `UI.readout(g, { label: 'NORMAL:', value: '0,25 s' })`, `UI.endScreen(g, t, { question: '¿Y tú qué harías?', subscribe: 'Suscríbete', cast })`.
- Los valores por defecto de `ui2d.js` ya están en español, pero escribe siempre el texto real de cada toma.
- `wordTime('corazón', después)` reconoce tildes y ñ; escribe la palabra igual que en la narración.
- Las fuentes Fredoka, Nunito y Playfair Display incluyen á é í ó ú ü ñ ¿ ¡.

## API de core, rig, FX y UI (unidades lógicas: 16:9 → 1920×1080, 9:16 → 1080×1920)
- **core.js:** `E` (W, H, PX, fps, vertical, cfg, words, shots), `V(h, v)`, `clamp lerp prog ease{linear,in,out,inOut,sine,outBack,outElastic} key(t, [[t,v],…], ease) mixVal rng(seed) noise(x, seed) shake(t, amp, freq, seed) talkAmount(globalT, from, to) wordTime(word, afterGlobalT)`, color `rgb css mix alpha shade`, `mood(name) S() setStyle`, dibujo `rr seg poly circle ring linGrad radGrad glow fillRect backdrop veil text measure FONTS`, cámara `layer(g, cam, depth, fn) blurLayer(g, amount, fn, cam?, depth?)`, `registerShot getShot`.
- **rig2d.js:** `drawFigure(g, {x, y, s, facing, pose, rot, outfit, expr, talk, blink, look:[x,y], rim:{color, dir, w}, dim, alpha, prop, shadow, trail})`. Poses: `POSES.{stand, relaxed, talk, explain, point, pointUp, wave, cheer, handsOnHead, crossArms, think, shrug, holdFront, phone, reach, sad, facepalm, ready, crouch, sit, sitBack, kneel, lie(+rot), dive(+rot), kick, jump, fall}`, más `posesAt, blendPose, breathe, walkPose(phase, {run})`, `face(g, x, y, r, {expr, talk, blink, look, front})`, `bigFace(g, cx, cy, r, {outfit, expr, talk, blink, look, rimColor, rimSide, tilt})`, `headPos(o) → [x, y, r]`, `soccerBall(g, x, y, r, rot)`. Objetos: `phone, ball, paper, cup, paddle, pointer, tablet, flashlight`. Ropa: `top: hoodie|labcoat|trench|jersey|tshirt|suit|dress|tracksuit|none, color, color2, legs, head: cap|capBack|beanie|fedora|headband|visor|hood|ponytail|bun|curly|spiky|none, headColor, face: glasses|sunglasses, gloves, number, kid`. Las poses propias son objetos simples con los 11 puntos; edita una copia (`{...POSES.sit, hF:[34,-188]}`).
- **fx2d.js:** `rain drops dust snow stars fog sun moon godRays lightCone pool lensStreak sparkle lightning speedLines rings skyline hills clouds tree pine lampPost windowFrame facade door chair stool counter screen bed clock floorLines crowd`.
- **ui2d.js:** `titleCard bigLine badge readout callout dimension dataCard compareBars meter blueprint bpStroke lineFigure bubble endScreen captions`. `endScreen` acepta `question` y `subscribe` (texto del botón).

## three-kit.js (llega como `T` a `init`/`draw`)
`T.stage({mood, fov, fog:[near, far], sky, keyPos, keyIntensity, ambient, bloom})` → `{scene, camera, composer, sun, add(...objs), render(), dispose()}`. Constructores: `box cyl cone sphere plane ground(w, d, color, tex) planks tiles windowPane(w, h, {glowColor, cols, rows, power, interior}) shaft(w, len, color, opacity) building(w, h, d, {color, win, lit}) tree3D pine3D crowd3D({rows, perRow, width, step, rise, colors}) figure3D(outfit, {rim, pose, s}) → .setPose(pose)`, `mat basic canvasTex`, y cámaras `orbit(camera, t, {target, radius, height, from, to, dur})` y `dolly(camera, t, [[t, {pos, look, fov}], …])`. Las unidades son metros, una figura mide ~1,7 m y mira hacia +x. Las tomas 3D reciben automáticamente el mismo color, barras y grano. Mantén la exposición con ambiente: que las ventanas y lámparas sean lo más brillante y el piso se mantenga oscuro.
