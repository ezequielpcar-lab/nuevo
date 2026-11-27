# Guía de estilo: el look de Videos Animados 2D

Síguela al pie de la letra. Es la única descripción del look buscado; no hay imágenes de referencia.

## El look en un párrafo
Figuras stickman negro puro (`S().ink`), cada una con cabeza circular y extremidades de línea gruesa con puntas redondeadas, llevan un borde de luz fino en el lado que mira hacia la luz. Actúan dentro de **ambientes vectoriales planos, oscuros y cinematográficos**: una sola fuente de luz fuerte por escena (una ventana al atardecer, un farol, reflectores de estadio, un monitor), sombras violeta o azul marino profundas, luces ámbar cálidas, brillos suaves, polvo o lluvia flotando, poca profundidad de campo (capas de adelante y de fondo desenfocadas), una deriva de cámara lenta y constante, barras de cine, grano de película y viñeta. A los personajes se les reconoce por UNA prenda o accesorio de color. Las caras son mínimas: ojos de punto o anillo blancos, una boca blanca simple y cejas de vez en cuando. El ritmo se rompe con primeros planos gigantes de la cara que llenan el cuadro, momentos de imagen congelada con partículas suspendidas en el aire, números y gráficos animados que brillan, diagramas tipo plano azul marino para las explicaciones y tomas 3D low-poly que usan las mismas figuras y colores. La sensación general es "una película de stickman iluminada por un director de fotografía": formas simples, luz sofisticada.

## Personajes
- **Construcción** (la hace `drawFigure`): cabeza circular r = 26 unidades, torso 15, extremidades 11–13 con puntas redondeadas, pies cortos apuntando hacia adelante, sin dedos en tamaños normales. Manos y dedos aparecen solo en tomas de detalle (cápsulas gruesas).
- **Sombreado de profundidad:** el brazo y la pierna cercanos son tinta pura. Los lejanos usan `inkFar`, un gris violeta oscuro. Es automático.
- **Luz de borde en cada personaje iluminado:** pasa `rim: { color: M.rim, dir: [dx, dy] }`, donde `dir` apunta desde la figura hacia la luz. Contraluz de ventana o sol detrás → `[0, -1]`. Luz desde la izquierda → `[-1, -0.3]`. Ancho 4–5 a 1080p. El borde es lo que hace legible el negro sobre oscuro, así que nunca lo omitas.
- **Elementos distintivos** (exactamente un color fuerte por personaje recurrente; idéntico todo el video): sudadera rojo anaranjado `#d64a33`, gorra amarilla `#f2c21a`, gorro rosa `#f29ac0`, gorra verde `#3fb950`, camiseta azul `#3a6ea5`, conjunto deportivo morado `#8a5ad6`, bata blanca + lentes redondos (científico), gabardina negra + sombrero + lentes oscuros (mentor misterioso o antagonista, a menudo medio en sombra), cinta en la cabeza de cualquier color de acento (atleta), cola de caballo o moño para variar. Niños: `kid: true` (72 % del tamaño). Gente de fondo y multitudes: tinta simple sin color.
- **Las caras** se dibujan del lado hacia donde mira la figura (vista 3/4). Las expresiones son la herramienta principal de actuación. Cámbialas **al ritmo de las palabras**, no al azar:
  `neutral, smile, happy, joy, surprised, shocked, scared, worried, nervous, angry, determined, sad, cry, smirk, sleepy, thinking, confused, awe` (neutral, sonrisa, feliz, alegría, sorprendido, impactado, asustado, preocupado, nervioso, enojado, decidido, triste, llorando, sonrisa pícara, somnoliento, pensando, confundido, asombro).
  Parpadeo cada 2,5–4 s (`blink: (t % 3.1) > 3.0`, con un periodo distinto por personaje).
- **Hablar:** solo cuando un personaje dice una frase entre comillas. Usa `talk: talkAmount(info.globalT, lineStart, lineEnd)` (guiado por los tiempos reales de las palabras) y agrega 2–3 `FX.rings` tenues que se expanden alrededor de la cabeza. El narrador nunca mueve la boca.
- **Actuación:** las poses deben leerse como siluetas. Usa `POSES` con `posesAt(t, [[0,'stand'],[0.6,'point']])`, mezclando ~0,3 s, y envuelve las figuras de pie o sentadas en `breathe(pose, t, 1, seed)` para que nadie quede congelado. La excepción son los momentos de tiempo detenido, donde el mundo se congela y solo se mueve el protagonista. Caminar y correr usan `walkPose(phase, {run})`, moviendo x a una velocidad acorde (caminar ≈ 160 unidades/s × s, correr ≈ 420 unidades/s × s, con phase = t × 2π × 0.9 para caminar y × 1.6 para correr). Usa `trail: {count:4, dx:-40}` para estelas de súper velocidad.
- **Escala:** tomas abiertas `s` ≈ 0,8–1,2 (las figuras ocupan el 15–25 % de la altura). Tomas medias `s` ≈ 1,5–1,8. Primeros planos emocionales con `bigFace` (radio 280–360 a 1080p, cabeza un poco debajo del centro, hombros cortados por el borde inferior, con una media luna de borde en el lado iluminado). Pon siempre las figuras sobre un piso con sombra de contacto (automática) y nunca las dejes flotando.

## Escenarios y ambientes
- Hechos con **formas planas y degradados lineales suaves**: sin contornos, sin fotos, sin clip-art, sin emojis. La textura se limita a líneas del piso, marcos de ventanas, persianas y cuadrículas de ventanas iluminadas.
- **Estructura de valores:** 60–75 % del cuadro en tonos medios oscuros (paredes y pisos del ambiente, normalmente oscurecidos con `shade(c, -0.3)`), con 1–3 acentos brillantes (una ventana, lámparas, pantallas, reflectores, un atardecer). **Pon las figuras negras delante de la zona más brillante** (una ventana, un charco de luz, una pantalla encendida) para que su silueta se lea.
- **Capas de profundidad** con paralaje mediante `layer(g, cam, depth, fn)`: cielo 0,1–0,2 → horizonte/colinas 0,3–0,4 → pared del fondo/fachada 0,5–0,6 → piso/objetos 0,8–0,9 → personajes 1,0 → primer plano desenfocado 1,5–1,8 (`blurLayer(g, 8–14, fn, cam, 1.7)`). La mayoría de las tomas medias deberían tener algo suave adelante (vasos, plantas, una baranda, cabezas de público, el hombro de otro personaje).
- **Las ventanas son el elemento distintivo.** Ventanas grandes con marcos y un degradado de cielo detrás (atardecer, dorado o noche con edificios de ventanas iluminadas), un brillo de sol o luna, a veces persianas. Las calles de noche tienen fachadas con ventanas cálidas, escalones, faroles con conos de luz, autos estacionados y árboles como siluetas redondas.
- Lugares típicos para inventar según el guion: laboratorios, cafés, dormitorios (luz de luna sobre la cama), cocinas, aulas, oficinas, hospitales, vestuarios, estadios (gradas con público, torres de reflectores, pantalla gigante), calles, azoteas, muelles al atardecer, carreteras de noche, parques, aeropuertos, el espacio. Construye cada uno como una función reutilizable `sets/<nombre>.js` anclada a `GY` (la línea del suelo: `E.H * V(0.8, 0.68)`) y `CX = E.W/2`. Extiende paredes, pisos y cielos mucho más allá del cuadro para que los movimientos de cámara nunca muestren bordes.
- **Atmósfera en casi todas las tomas:** polvo en interiores (`FX.dust`), lluvia para tormentas y noche (`FX.rain`), gotas o burbujas congeladas para el tiempo detenido (`FX.drops`), estrellas en cielos nocturnos, un destello de lente en fuentes brillantes (`FX.lensStreak`), rayos de luz desde soles y ventanas (`FX.godRays`) y bandas de niebla suave.

## Luz y color
- Elige un **ambiente** por lugar: `M = mood('night')` da `sky[], ambient, key, rim, wall, floor, dark, practical, grass, road, fog`. Toma todos los colores de `M`, `S()` (los colores del estilo) o del reparto. Evita colores escritos a mano para que el cambio de estilo funcione.
- La historia manda el ambiente: los momentos tensos o de miedo van más oscuros y fríos (night/storm/interiorCool), los triunfales o tiernos van cálidos (golden/dusk/interiorWarm), y las explicaciones usan `void`/plano técnico.
- **Una luz principal por toma.** Muéstrala (un sol, una lámpara o una ventana) y deja que se derrame: `glow()` alrededor de la fuente, `FX.pool()` en el piso debajo, `FX.lightCone()` desde lámparas, `FX.godRays()` desde ventanas y soles.
- El color general viene del estilo elegido y se aplica automáticamente a cada cuadro final, 2D y 3D: lift/gamma/gain por canal (lift tiñe las sombras, gain tiñe las luces), contraste, saturación, viñeta y grano. El bloom se aplica al 3D. Por eso las escenas deben usar los colores del ambiente y del estilo: así cada estilo se ve distinto.

## Cámara (nunca del todo quieta)
Cada toma se mueve: un acercamiento lento (`z` 1,0 → 1,05–1,10 durante la toma), una deriva lateral (`x` ±20–60), un alejamiento lento para revelar, una leve rotación (`r` ±0,02) para incomodidad, o sacudida (`shake(t, amp)`) para impactos. Usa `ease.inOut` para movimientos y `ease.out` para golpes rápidos.

**Vocabulario de tomas** (usa todas a lo largo de un video, más o menos en estas proporciones):
1. **Toma abierta de presentación** (10 %): el lugar con figuras pequeñas y un acercamiento lento. Abre cada escena nueva. A menudo en 3D.
2. **Toma media de dos personajes** (25 %): vista de lado, personajes frente a frente, conversación y acción.
3. **Sobre el hombro** (10 %): la silueta grande y desenfocada de un personaje adelante (`blurLayer`, profundidad 1,6) y el otro nítido.
4. **Primer plano gigante de la cara** (`bigFace`, 10–15 %): reacciones, momentos de comprensión, momentos de "tú" y frases de diálogo. Fondo = el lugar, desenfocado y oscurecido (`blurLayer` + `veil`).
5. **Detalle / macro** (10 %): manos, la pantalla de un celular, un reloj, una pelota, una taza, una manija. Grande, simple, con fondo desenfocado.
6. **Vista desde arriba / diagrama** (5 %): por ejemplo, una mesa vista desde arriba con una trayectoria punteada y una etiqueta de tiempo.
7. **Imagen congelada / tiempo detenido** (momento distintivo, 1–3 por video): partículas suspendidas en el aire, un tono frío, una insignia en la esquina (`100x`), anillos lentos, una rotación lenta y solo el protagonista moviéndose. Entra con una transición `flash` y un efecto `freeze`.
8. **Órbita / recorrido 3D** (más o menos 1 por minuto): espacios grandes como estadios, calles y salones, usando `three-kit` (engine-api.md, three-kit).
9. **Tarjeta de datos / interfaz** (según haga falta): cualquier número que diga el narrador aparece en pantalla y se anima mientras se dice.
10. **Diagrama tipo plano**: la parte explicativa o científica (cuadrícula azul marino, dibujo de líneas celeste, resaltados dorados, etiquetas sincronizadas con las palabras).
11. **Tarjeta de título**: título brillante en mayúsculas sobre una toma abierta cinematográfica (a menudo después del gancho inicial).
12. **Pantalla final**: la pregunta en letra serif cursiva, una burbuja de comentario, un botón de suscripción y todo el reparto en fila.

**Barras de cine (`bars`):** `wide` (2:1) es lo normal. `scope` (2,39:1) es para el drama: el título, los congelados, los clímax y los primeros planos intensos. Usa `none` para interfaz o planos técnicos a pantalla completa si quieres. Las barras se animan suavemente entre tomas.

## Edición y transiciones
**Corte** directo por defecto (80 % o más). **flash** (blanco) hacia congelados, tiempo detenido o súper poderes y grandes momentos de comprensión. **dip** (a negro) para saltos de tiempo y cambios de capítulo. **fade** para momentos suaves o de ensueño y la tarjeta de título. **whip** para saltos enérgicos entre lugares. **zoom** para meterse en una explicación. Mantén la continuidad: la misma ropa, la misma dirección en pantalla (en una conversación, el protagonista está a la izquierda mirando a la derecha) y la misma geometría del escenario en todas las tomas de una escena.

## Gráficos en pantalla y tipografía
- **Todo el texto en pantalla va en español**, con tildes, ñ, `¿` y `¡`.
- **Fuentes:** Fredoka Bold para títulos y frases grandes (TODO EN MAYÚSCULAS, con espaciado y brillo cálido). Nunito Black para etiquetas y números. Playfair Display Black Italic para la pregunta de la pantalla final.
- **Colores:** dorado `S().ui.gold` para números clave, coral `ui.accent` para valores alarmantes, crema `ui.cream` para etiquetas, azul plano `ui.blueprint`.
- **Herramientas (`ui2d`):** `titleCard`, `bigLine` (una pregunta o frase de capítulo), `badge` (multiplicador en la esquina o contador de días), `readout` ("NORMAL: 0,25 s"), `dataCard` (título, contador y una curva que se dibuja), `compareBars`, `dimension` (medida con flechas "30 m"), `callout` (etiqueta con línea guía), `meter`, `blueprint` + `lineFigure`, `bubble`, `endScreen`, `captions`.
- Cada número o medida que diga el narrador debe aparecer, sincronizado con `wordTime()`. Mantén el texto al mínimo: como mucho 1–2 etiquetas cortas a la vez, y nunca oraciones salvo el título, la pregunta y la pantalla final.
- Haz aparecer los gráficos con escala `ease.outBack` y un efecto `pop`/`blip`. Desvanécelos antes del corte.

## Convenciones de historia (relatos de "¿Qué pasaría si...?"; usa solo lo que tenga el guion)
Gancho inicial (un momento dramático, a menudo congelado) → tarjeta de título → vida normal y el descubrimiento → escalada con números concretos → el costo o el giro → el clímax → el cierre → "¿Es real todo esto?" (parte científica en plano técnico) → pantalla final con una pregunta y llamada a la acción. Los guiones explicativos, de historia y documentales usan el mismo vocabulario: los personajes actúan los ejemplos, las tarjetas de datos llevan los números y los diagramas tipo plano explican los mecanismos.

## Lo que no se hace
Nada de realismo, degradados en los personajes, contornos gruesos, fotos, emojis, clip-art ni fondos blancos planos (salvo los flashes). Nada de tomas quietas. Nada de figuras sin luz de borde en escenas iluminadas. El narrador no mueve la boca. Nada de muros de texto. No más de ~4 personajes en foco a la vez (las multitudes están bien). Nada de figuras flotando. Nada de cambios de color de ropa. No centres todo (usa tercios; el primer plano de la cara es la excepción). Nada de colores escritos a mano que ignoren `mood()`/`S()`. Nada de `Math.random()` ni `Date.now()` en las escenas (rompen la repetibilidad; usa `rng(seed)` y `t`). Nada de texto en pantalla en inglés.


## Reglas para 9:16 vertical
El escenario lógico es 1080×1920 (`E.vertical === true`). Usa `V(horizontal, vertical)` para cada tamaño y posición que dependa del formato.
- **Encuadre más cerrado:** dominan las tomas medias y los primeros planos. Las tomas abiertas se vuelven pilas altas (cielo → edificio → suelo), con las figuras en el tercio del medio.
- **Zona segura:** mantén caras y texto dentro de los ~900×1500 centrales, lejos de los botones de la plataforma. Los subtítulos van a ~79 % de la altura (`captions: true` en config.json); las frases largas se achican solas.
- Los diagramas se apilan en vertical (ojo arriba del cerebro arriba del brazo). Las tarjetas de datos son más altas. Las letras son más grandes (las herramientas de UI ya usan `V()`).
- Las barras van en `none` por defecto, y `scope` da barras finas. Línea del suelo `GY = E.H * 0.68`, que deja a los personajes encima de los subtítulos (y ≈ 0,79·H). Pon `"captions": false` en las tomas de título o pantalla final para que las palabras no se repitan con el texto en pantalla.
- Revisa con `--sheet` en 9:16 antes de renderizar. Las tomas pensadas solo para 16:9 suelen cortar al sujeto.

---
