# Metadatos para YouTube: títulos, miniaturas, descripción y etiquetas

Todo se entrega en español. Este paquete es lo que decide si alguien hace clic, así que trátalo con el mismo cuidado que el video.

Entregables (siempre los cuatro):
1. **3 títulos**, cada uno con una emoción distinta.
2. **3 miniaturas** de 1280×720, una por título (la miniatura 1 acompaña al título 1, y así).
3. **Descripción** lista para pegar.
4. **Etiquetas** separadas por comas, dentro de los límites de YouTube.

## 1. De dónde sale el tema
1. Lee el **nombre del archivo de la voz** (`config.json` → `voiceover`). `python tools/metadata.py --project projects/<slug> --base` lo limpia (quita guiones bajos, la extensión y palabras como "voz", "audio" o "final"). Ese es el **tema base**: la idea con la que el usuario guardó su video. Por ejemplo, `si_tu_corazon_latiera_lento.mp3` → "si tu corazón latiera lento".
2. Confírmalo con `timeline/transcript.txt` y `story/bible.md`: el título tiene que prometer algo que el video **sí muestra**. Si el nombre del archivo no dice nada útil ("audio_final_2.mp3"), usa la idea central de la transcripción y dilo en la entrega.
3. Saca de ahí: la **palabra clave principal** (lo que la gente buscaría: "qué pasaría si", "inmortal", "corazón lento"), el **número más llamativo** que diga la narración (7, 300, 1.000) y la **consecuencia o giro** más fuerte de la historia.

## 2. Lo que hacen los videos ganadores (referencias analizadas)

| Video de referencia | Vistas | Título | Texto de la miniatura | Imagen |
|---|---|---|---|---|
| Solo quedan 2 | 5,1 M | ¿Pueden 2 personas realmente reiniciar la humanidad? | SOLO QUEDAN **2** | Calle vacía vista desde arriba, 2 personajes pequeños y preocupados, un farol cálido |
| Discipline | 5,9 M | Una sola palabra + "cortometraje animado" | DAY 1. | Cara enojada y decidida en la cama, despertador en 5:00 |
| Lust is killing you | 1,6 M | Acusación directa en segunda persona | THE PRICE OF LUST. | Cara ansiosa iluminada por el celular, de noche |
| ¿Y si fueras INMORTAL? | 1,2 M | ¿Y si + poder, palabra clave en MAYÚSCULAS? | NO PUEDES **MORIR.** | Cara grande, pícara; una bala a punto de tocarla; ciudad de noche desenfocada |
| ¿Y si NUNCA fallaras? | 635 k | ¿Y si + NUNCA? | NUNCA **FALLAS.** | Cara confiada; la pelota entrando al aro con su trayectoria marcada |
| ¿Y si vivieras el mismo día PARA SIEMPRE? | 275 k | ¿Y si + PARA SIEMPRE? | DÍA **300.** | Personaje marcando rayitas en una pared llena de rayitas |
| ¿Y si despertaras con 1000 de IQ? | 156 k en 5 días | ¿Y si + número enorme? | **1000** | Ojos brillantes, fórmulas flotando, número dorado gigante |
| 1,000 or 1? | — | Dilema | 1.000 ¿O 1? | El protagonista dudando entre dos opciones opuestas |
| One man | — | Situación extrema | UN HOMBRE + contador "HOMBRES A BORDO: 1" | Un solo personaje rodeado de una multitud |

**Patrones que se repiten:**
- El título y la miniatura **no dicen lo mismo, se completan**. El título hace la pregunta ("¿Y si fueras INMORTAL?") y la miniatura muestra la consecuencia ("NO PUEDES MORIR.") con una prueba visual (la bala).
- Los títulos son **cortos** (4–9 palabras, idealmente ≤ 60 caracteres) y ponen **una sola palabra clave en MAYÚSCULAS**.
- El texto de la miniatura tiene **1–3 palabras**, en 1–2 líneas, **termina en punto** ("MORIR.", "FALLAS.", "DÍA 300."), la primera línea en blanco y la palabra fuerte en amarillo.
- Los **números** funcionan muy bien: 2, 300, 1000, 1, 5:00.
- **Un personaje grande con una emoción clara** (pícaro, asustado, ansioso, decidido) + **un objeto que explica la idea** (bala, aro, rayitas, despertador, celular) + **fondo oscuro con una sola luz cálida o de color**. Nada más.
- La alternativa que más vistas tuvo es la **escena abierta** con personajes pequeños y un texto enorme centrado (SOLO QUEDAN 2).

## 3. Títulos (3 opciones, cada una con una emoción distinta)
Elige 3 emociones diferentes de esta lista y escribe un título para cada una:

| Emoción | Fórmula | Ejemplo con "si fueras inmortal" |
|---|---|---|
| Curiosidad | ¿Y si + [situación] + PALABRA CLAVE? | ¿Y si fueras INMORTAL? |
| Intriga | ¿Pueden / Podrías + [hazaña] + realmente…? | ¿Podrías realmente vivir para siempre? |
| Deseo | ¿Y si pudieras + [poder]? / Lo que harías con… | ¿Y si NADA pudiera hacerte daño? |
| Miedo o dolor | [Algo] te está [consecuencia] / El precio de… | El precio de no poder morir |
| Reto | ¿Sobrevivirías…? / ¿Aguantarías…? | ¿Aguantarías 1.000 años solo? |
| Dilema | ¿[A] o [B]? | ¿Vivir para siempre o vivir feliz? |

Reglas:
- Español natural, con tildes y signos de apertura `¿` `¡`.
- Una sola palabra o frase corta en MAYÚSCULAS por título.
- Máximo 100 caracteres (límite de YouTube); apunta a 40–70 para que no se corte en el celular.
- La palabra clave principal aparece en al menos 2 de los 3 títulos.
- Sin mentiras: si el video no muestra algo, el título no lo promete. Nada de "100 % real" o "NO VAS A CREER" vacíos.
- Nunca uses `<` ni `>`.

## 4. Miniaturas (3, una por título)
Cada miniatura se diseña para **su** título: el texto completa la pregunta del título con la consecuencia, el número o el giro.

**Texto de la miniatura:**
- 1–3 palabras en 1–2 líneas, en español, MAYÚSCULAS, terminando en punto cuando es una afirmación ("NUNCA FALLAS."), o con `¿…?` cuando es dilema.
- Distinto al título. Ejemplo: título "¿Y si tu corazón latiera 10 veces más lento?" → miniatura "7 LATIDOS. / POR MINUTO".
- Arriba a la izquierda (o arriba al centro en la composición de escena abierta), sin tapar la cara. Nunca abajo a la derecha (ahí YouTube pone la duración).

**Las 3 composiciones** (usa una distinta en cada miniatura):
1. **Primer plano + prueba:** `bigFace` grande a la derecha (radio 320–380 en 1920×1080, ocupa 50–60 % de la altura), expresión fuerte, luz de borde, y el objeto que explica la idea junto a la cara. Texto a la izquierda. (Como NO PUEDES MORIR.)
2. **Escena abierta + número gigante:** el escenario del video visto desde arriba o en plano abierto, 1–2 personajes pequeños, una luz cálida, y un texto o número enorme arriba al centro. (Como SOLO QUEDAN 2.)
3. **Acción o dilema:** el personaje de cuerpo entero haciendo la acción clave (`drawFigure` escala 2–2,6), con un elemento que muestra el resultado: rayitas, contador, reloj, trayectoria, dos caminos. (Como DÍA 300. o NUNCA FALLAS.)

**Reglas visuales:**
- Mismo personaje, misma ropa y mismo estilo que el video (usa `scenes/cast.js` y los escenarios del video).
- Fondo oscuro y desenfocado (`blurLayer` + `veil`), una sola luz fuerte, alto contraste. Que se entienda en tamaño pequeño, como se ve en el celular.
- Expresiones exageradas: `shocked`, `scared`, `smirk`, `determined`, `awe`, `nervous`.
- Máximo 1 personaje grande + 1 objeto + el texto. Nada de muchos elementos.
- Colores del texto: blanco + amarillo (`#FFD23F`) por defecto; rojo (`#ff5a5a`) solo para peligro.
- Sin subtítulos, sin barras de cine, sin logos ni marcas reales.

**Cómo se hacen** (detalles en engine-api.md):
- Escribe `story/thumbs.json` con 3 tomas `thumb1`, `thumb2`, `thumb3` (1 s cada una) y, en cada una, `title`, `text` y `emotion`.
- Escribe `scenes/thumbs/thumbs.js` con `registerShot('thumb1', …)`, etc. Dibuja el fondo, el personaje y el objeto, y al final el texto con `UI.thumbText(g, ['NO PUEDES', 'MORIR.'])`.
- Renderiza con `node render.mjs --project projects/<slug> --thumbs`. Sale `out/miniaturas/miniatura_1.png` … `_3.png` (1280×720) y la hoja `build/thumbs_sheet.png`.
- Abre la hoja y revisa: ¿se lee el texto en pequeño?, ¿se entiende la emoción?, ¿cada miniatura conecta con su título?, ¿las 3 son distintas? Corrige y vuelve a renderizar.

## 5. Descripción
Estructura (en español, sin `<` ni `>`):
1. **Primeras 1–2 líneas (≤ 150 caracteres):** el gancho con la palabra clave principal. Es lo único que se ve antes de "más".
2. **Resumen de 2–3 frases** de lo que pasa en la historia, con palabras clave usadas de forma natural, sin contar el final.
3. **Capítulos** sacados de las partes de la historia (`story/bible.md` y los tiempos de `story/shots.json`): el primero en `00:00`, mínimo 3, cada uno de 10 s o más, en orden. Formato: `00:00 El gancho`.
4. **Una pregunta para comentar**, ligada a la historia ("¿Tú qué harías si…?").
5. **Llamada a suscribirse** en una línea.
6. Si el usuario dio enlaces fijos para sus descripciones, agrégalos en una sección corta. Si no dio ninguno, no inventes enlaces.
7. **3–5 hashtags** al final (los 3 primeros salen arriba del título): `#QuéPasaríaSi`, el tema y el formato (`#Animación`, `#HistoriasAnimadas`).

Límite: 5000 bytes (las letras con tilde cuentan doble). Una buena descripción tiene 800–1500 caracteres.

## 6. Etiquetas
- 12–20 etiquetas, de la más importante a la menos importante, separadas por comas.
- Mezcla: la palabra clave principal y sus variantes, el tema ("corazón lento"), el formato ("historia animada", "animación 2d", "qué pasaría si"), búsquedas reales de la gente ("qué pasaría si tu corazón", "curiosidades del cuerpo humano") y 1–2 en inglés solo si el tema se busca mucho así.
- Sin hashtags, sin `<` `>`, sin comas dentro de una etiqueta, sin repetir.
- **Límite de YouTube: 500 caracteres en total**, contando las comas, y cada etiqueta con espacios cuenta 2 caracteres más. Apunta a ≤ 450.

## 7. Revisar y entregar
1. Escribe todo en `story/metadata.json`:
```json
{ "base": "si tu corazon latiera lento",
  "titles": [ {"title": "¿Y si tu corazón latiera 10 veces MÁS LENTO?", "emotion": "curiosidad", "thumb": 1},
              {"title": "…", "emotion": "miedo", "thumb": 2},
              {"title": "…", "emotion": "reto", "thumb": 3} ],
  "description": "…texto con \\n para los saltos de línea…",
  "tags": ["qué pasaría si", "corazón lento", "…"] }
```
2. Ejecuta `python tools/metadata.py --project projects/<slug>`. Revisa los límites de YouTube (títulos, bytes de la descripción, total de etiquetas, capítulos, hashtags y caracteres prohibidos) y escribe `out/metadatos.txt` listo para copiar. Si muestra ERROR, corrígelo y vuelve a ejecutarlo hasta que diga OK. Atiende también los AVISOS.
3. Entrega al usuario: las 3 miniaturas (envía los PNG), `out/metadatos.txt` (envía el archivo) y, en el mensaje, los títulos, la descripción y las etiquetas en bloques de código para copiar. Incluye una tabla corta: título → emoción → miniatura. Termina con una línea recomendando cuál combinación probar primero y por qué.
