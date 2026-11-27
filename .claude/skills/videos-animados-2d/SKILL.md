---
name: videos-animados-2d
description: >
  Usa esta skill cuando el usuario quiera un video animado y narrado al estilo Videos Animados 2D
  (monitos stickman cinematográficos con luz de borde, escenarios 2.5D con ambiente, primeros planos gigantes
  de la cara, congelados de imagen, datos animados, diagramas tipo plano y tomas 3D low-poly). Por ejemplo:
  "haz un video 2D con esta voz", "anima mi guion", "convierte esta narración en un video de stickman",
  "haz un video de ¿Qué pasaría si...?", "crea un video explicativo animado con mi audio" o "haz el video completo",
  "haz los títulos, miniaturas, descripción y etiquetas de mi video" (también en inglés: "make a 2D video from this
  voiceover", "animate my script"). Ejecuta todo el proceso:
  instalación, marcas de tiempo (Whisper), desglose de la historia, elección de estilo, construcción de escenas,
  render, música, efectos de sonido, MP4 final en 16:9 o 9:16 de 720p a 4K y los metadatos para YouTube
  (3 títulos, 3 miniaturas, descripción y etiquetas). Todo en español.
metadata:
  version: "0.3.0-es-skill"
  author: aiTrends · adaptado al español y mejorado por Fannquis IA
---

# Videos Animados 2D: proceso completo del video

Convierte una voz en off (más un guion opcional) en un MP4 terminado, donde cada cuadro se dibuja con código (HTML canvas + Three.js), se captura cuadro por cuadro en Chromium sin ventana y se codifica con ffmpeg. No se usan modelos de generación de imagen ni de video, así que los personajes se mantienen iguales y el texto se ve nítido. Inventa las imágenes desde cero para cada guion; solo el estilo es fijo.

## Idioma: todo en español
- **Habla con el usuario en español**: preguntas, resúmenes, avances, errores explicados y entrega final. Lenguaje simple, sin palabras técnicas innecesarias.
- **Todo el texto que aparece en el video va en español**: títulos, etiquetas, números con su unidad, tarjetas de datos, diagramas, subtítulos, la pregunta final y el botón (`endScreen(g, t, { question: '¿Y tú qué harías?', subscribe: 'Suscríbete' })`).
- Respeta tildes, ñ y los signos de apertura `¿` `¡`. Las fuentes ya los incluyen.
- Al buscar palabras con `wordTime()`, escríbelas igual que en la narración, con tilde: `wordTime('corazón')`.
- Transcribe con `--lang es`.
- Los comandos, rutas, nombres de archivos, ids y código se quedan como están (en inglés). No los traduzcas o el estudio deja de funcionar.

**Recursos incluidos (carpeta base de esta skill):**
- `kit/`: el estudio probado (render, motor, herramientas, audio y el proyecto de referencia `examples/reaction-time`). Se instala en el espacio de trabajo como `videos-animados-2d/` (ver `references/install.md`).
- `references/install.md`: instalación, tabla de dependencias, doctor y autoprueba.
- `references/style-bible.md`: **el estilo visual** (personajes, escenarios, luz, cámara, edición, gráficos, reglas 9:16 y lo que no se debe hacer). Léelo completo antes de diseñar cualquier toma.
- `references/story-breakdown.md`: cómo escribir `story/bible.md` y `story/shots.json`, más las reglas de ritmo.
- `references/engine-api.md`: la API de escenas, los esquemas de config y shots.json, y la referencia de three-kit.
- `references/sound-design.md`: plan de música, biblioteca de efectos, ambientes y niveles.
- `references/render-qc.md`: vista previa y render final, guía de velocidad, lista de control de calidad y solución de problemas.
- `references/metadata-seo.md`: títulos, miniaturas, descripción y etiquetas para YouTube, con el análisis de los videos ganadores.

Si el usuario pide solo una parte (por ejemplo solo los estilos, solo el sonido, solo volver a renderizar o solo los títulos y miniaturas), haz solo esa etapa con el proyecto que ya existe. Para hacer todo de principio a fin, sigue este archivo y carga cada referencia cuando la etapa la necesite.

## Reglas de oro
1. **No toques la narración.** Nunca reescribas, agregues, quites ni cambies el orden de las palabras habladas. Cada toma ilustra las palabras que se dicen mientras está en pantalla.
2. **Mismo estilo, imágenes nuevas.** Inventa escenarios, objetos, personajes y acciones a partir de este guion. Usa `examples/reaction-time` solo para aprender la API.
3. **Muestra lo que se dice, de forma literal y concreta.** Las frases abstractas se convierten en metáforas visuales, diagramas o reacciones en primer plano.
4. **Borrador, mirar, corregir y después renderizar.** Abre tú mismo las hojas de contacto y las imágenes fijas (lee los PNG) antes de cualquier render completo. Renderizar es lento; mirar es rápido.
5. **Tres pausas para el usuario:** las opciones iniciales, la elección del estilo con muestras renderizadas y la vista previa antes del render final. Si el usuario no está, usa los valores por defecto, di qué asumiste y continúa.
6. **Los archivos mandan.** Cada video vive en `videos-animados-2d/projects/<slug>/`, y `story/shots.json` controla todos los tiempos.

## Etapa 1: Datos iniciales
Pregunta una sola vez (con AskUserQuestion si está disponible), en español:
- **Archivo de voz en off** (obligatorio).
- **Guion:** con marcas de tiempo (SRT/VTT/JSON/TXT con `[mm:ss]`), texto simple (lo mejor: se alinea con el audio y conserva las palabras exactas) o ninguno (se transcribe).
- **Formato:** 16:9 (YouTube normal) o 9:16 (Shorts, TikTok, Reels).
- **Calidad:** 720p / 1080p (recomendado) / 1440p / 2160p (4K). Avisa que mientras más alta, más tarda el render.
- **Subtítulos:** activados por defecto en 9:16, desactivados en 16:9.
- **Música:** generada, un archivo propio del usuario o sin música. **Efectos de sonido:** sí o no.
- **Título.**

Pide que el archivo de voz tenga el tema del video en su nombre (por ejemplo `si_fueras_inmortal.mp3`): de ahí salen los títulos de la Etapa 9. Si ya lo tiene, no preguntes.

No preguntes por el estilo todavía. Valores por defecto: 16:9, 1080p, 24 fps, música generada + efectos, estilo `dusk`.

## Etapa 2: Instalar o revisar el estudio
Sigue `references/install.md`: copia `kit/` a `videos-animados-2d/` en el espacio de trabajo (sáltalo si ya existe), instala las dependencias, ejecuta `python tools/verify_kit.py` y `python tools/doctor.py`, y luego la autoprueba del ejemplo. Informa al usuario qué se instaló en una lista corta.

## Etapa 3: Proyecto + línea de tiempo
Ejecuta dentro de `videos-animados-2d/`. Usa `python3` donde `python` no sea Python 3.
```bash
python tools/new_project.py --name <slug> --voice "<ruta de la voz>" [--script "<ruta del guion>"] --aspect 16:9 --resolution 1080p --title "<título>" [--captions]
```
- Guion con marcas de tiempo: `python tools/parse_script.py --project projects/<slug> --script projects/<slug>/input/script.<ext>`
- Guion simple: `python tools/transcribe.py --project projects/<slug> --script projects/<slug>/input/script.txt --lang es --model small`. La coincidencia debe ser ≥ 90 %; si es menor, dile al usuario que el guion y el audio no coinciden.
- Sin guion: `python tools/transcribe.py --project projects/<slug> --lang es --model small` (`base` en equipos lentos, `large-v3` para audio difícil).

Revisa `timeline/transcript.txt` (debe terminar cerca de la duración de la voz) y luego ejecuta `python tools/beats.py --project projects/<slug>` para obtener la hoja de ritmos y un borrador de `story/shots.json`.

## Etapa 4: Desglose de la historia
Lee `references/style-bible.md` y `references/story-breakdown.md`. Escribe `story/bible.md` (idea central, reparto con un color distintivo para cada uno, lugares con su ambiente y luz principal, motivos visuales y plan de música). Escribe `scenes/cast.js`. Reescribe `story/shots.json`: tomas seguidas sin huecos, cortes en los límites de frase 0,1–0,2 s antes, una mediana de 2–3,5 s, una toma de presentación por cada lugar nuevo y una descripción `scene` concreta en cada una. Envía al usuario un resumen del plan de 5–10 líneas en español y continúa salvo que tenga objeciones.

## Etapa 5: Elección del estilo
Construye los 1–2 escenarios más usados y 3 tomas representativas (una toma abierta con ≥ 2 personajes, un primer plano `bigFace` y una toma de datos/plano o 3D). Luego renderiza:
```bash
node render.mjs --project projects/<slug> --styles dusk,midnight,golden,neon,storybook --at <t1>,<t2>,<t3> --scale 0.5
```
Abre `build/styles/style_grid.png` y luego muéstralo con una línea por estilo: **dusk – Atardecer cinematográfico** (sombras malva, luz ámbar, borde crema), **midnight – Azul medianoche** (azul marino frío, bordes blanco azulado, luces de sodio), **golden – Hora dorada** (naranja cálido y verde azulado), **neon – Neón noir** (negros profundos, magenta y turquesa), **storybook – Cuento suave** (pastel suave, poco contraste). Guarda la elección en `config.json` → `style`. Para ajustes, agrega una entrada propia a `STYLES` en `engine/styles.js` (cambios de `moods` y el `grade` lift/gamma/gain, sat, contrast, vignette, grain, bloom) y vuelve a renderizar esa fila.

## Etapa 6: Construir cada toma
Lee `references/engine-api.md` y las escenas de ejemplo en `examples/reaction-time/scenes/` una vez. Trabaja en grupos de 8–12 tomas:
1. Escribe `scenes/sets/<lugar>.js` (reutilizable, anclado a `GY = E.H * V(0.8, 0.68)` y `CX = E.W/2`, con paredes, piso y cielo extendidos más allá del cuadro) y `scenes/shots/NN_<nombre>.js` con `registerShot('<id>', {...})` para los ids de shots.json.
2. Ejecuta `node render.mjs --project projects/<slug> --sheet --scale 0.5`. Abre cada `build/sheets/sheet_XX.png` y compáralo con la lista de control de `references/render-qc.md`. Corrige las tomas MISSING, los errores que imprime el render y los problemas de composición.
3. Revisa el movimiento con `--stills t1,t2,t3` o `--from A --to B --scale 0.5` (genera `build/preview.mp4`).

Lo que no se negocia, según la guía de estilo:
- Luz de borde en cada figura iluminada.
- Colores tomados de `mood()`/`S()`.
- Un movimiento de cámara en cada toma.
- Atmósfera (polvo, lluvia, brillos).
- Estructura de valores oscura y con ambiente.
- Gráficos sincronizados con las palabras usando `wordTime()`.
- `V()` para cada valor que dependa del formato.
- Nada de `Math.random`/`Date.now`.
- Todo texto en pantalla, en español.

## Etapa 7: Sonido
Lee `references/sound-design.md`. Completa `story/shots.json` → `music` (secciones seguidas con su ambiente musical) y agrega efectos `sfx` y fondos `amb` por toma. La mezcla se hace después del render final (Etapa 8), o ejecuta ahora `python audio/mix.py --project projects/<slug>` para escuchar `build/mix.wav`.

## Etapa 8: Renderizar y entregar
Lee `references/render-qc.md`.
1. Vista previa: `node render.mjs --project projects/<slug> --from 0 --to 30 --scale 0.5`. Muestra al usuario la vista previa o una hoja de contacto antes del render largo.
2. Final: `node render.mjs --project projects/<slug>`. En videos largos, ejecútalo en segundo plano y revisa el registro. El registro muestra los cuadros por segundo y el tiempo estimado; compártelo con el usuario.
3. Ejecuta `python audio/mix.py --project projects/<slug>`, que genera la música y los efectos, baja la música cuando habla la voz, normaliza a −14 LUFS y une todo en `out/<title>.mp4`.
4. Revisa el archivo final: la duración coincide, tiene audio y una hoja de contacto de 1 cuadro cada 10 s se ve bien. Entrega el MP4 (envía el archivo) y di en palabras simples dónde quedó guardado.

## Etapa 9: Metadatos para YouTube
Lee `references/metadata-seo.md` completo y entrega siempre, en español:
1. **3 títulos** a partir del nombre del archivo de la voz (`python tools/metadata.py --project projects/<slug> --base`), cada uno con una emoción distinta (curiosidad, intriga, deseo, miedo/dolor, reto o dilema).
2. **3 miniaturas** de 1280×720 en el estilo del video, una por título y con composiciones distintas: escribe `story/thumbs.json` y `scenes/thumbs/thumbs.js`, renderiza con `node render.mjs --project projects/<slug> --thumbs`, abre `build/thumbs_sheet.png` y corrige hasta que se lean bien en pequeño.
3. **Descripción** con gancho, resumen, capítulos, pregunta, suscripción y 3–5 hashtags.
4. **Etiquetas** dentro del límite de YouTube.

Guarda todo en `story/metadata.json` y ejecuta `python tools/metadata.py --project projects/<slug>` hasta que diga OK; genera `out/metadatos.txt`. Envía las 3 miniaturas y `metadatos.txt`, muestra títulos, descripción y etiquetas en bloques de código para copiar, y termina con la combinación título + miniatura que recomiendas probar primero y una línea sobre qué se podría ajustar.

## Valores por defecto y criterio
- Si dudas sobre una imagen, elige la opción más literal y más cinematográfica: primer plano para emociones, toma de detalle para objetos, plano técnico para mecanismos y 3D para espacios grandes.
- Mantén unas 15–25 tomas por minuto. Usa 1–3 congelados por video y más o menos una toma 3D por minuto.
- Cada personaje conserva el mismo color de ropa todo el video, y la dirección en pantalla se mantiene dentro de una escena.
- Volver a renderizar solo un tramo arreglado conviene únicamente si el usuario está cómodo uniendo partes. Si no, vuelve a renderizar todo.
