# Desglose de la historia (la parte creativa)

Lee la transcripción completa dos veces. Luego escribe `story/bible.md` (corto y práctico, en español):
- **Idea central y tono** (asombro / suspenso / comedia / drama), y quién es "tú" si el guion está en segunda persona.
- **Tabla del reparto.** Para cada personaje que se repite: id, papel, ropa `{top, color, head, headColor, face, legs, gloves, kid}`, color distintivo, personalidad y las expresiones que más usa. Cada personaje recurrente lleva exactamente UN elemento distintivo de color intenso (style-bible.md, Personajes). Pon la ropa en `scenes/cast.js`.
- **Lugares (escenarios).** Para cada uno: nombre, ambiente (`day|golden|dusk|night|storm|interiorWarm|interiorCool|void`), de dónde viene la luz principal, la ventana o vista, 3–6 objetos característicos y las capas (cielo → fondo → medio → piso → primer plano).
- **Motivos visuales:** recursos que se repiten ligados a la historia, como gotas congeladas para el tiempo detenido, una insignia de multiplicador en la esquina, una línea de latidos o un color que marca un poder.
- **Plan de partes y música:** secciones con un ambiente y una intensidad (sound-design.md).

Después **reescribe `story/shots.json`** (esquema en engine-api.md, story/shots.json). En cada toma define:
`id, start, end, line, scene` (una frase concreta que describe la imagen, por ejemplo "Sobre el hombro: hombro desenfocado de Jake adelante, Max en la ventana, lluvia, acercamiento lento"), `set`, `bars`, `in` (transición), `sfx`, `amb`, `notes`.

`line` debe copiar las palabras exactas de la narración en español. `scene` y `notes` puedes escribirlas en español.

Reglas de ritmo:
- Las tomas van **seguidas**: cada `end` es igual al `start` de la siguiente. La primera empieza en 0 y la última termina en `duration`, que es la duración de la voz más unos 1,5 s.
- Corta en los límites de frase. Empieza cada toma **0,1–0,2 s antes** de la frase que ilustra.
- Apunta a una **mediana de 2–3,5 s**. Acción rápida: cortes de 0,8–2 s (divide una frase en varias tomas). Momentos emocionales o de diálogo: 4–8 s. Nunca pases de ~10 s sin una acción nueva o un movimiento de cámara.
- Cada lugar nuevo empieza con una toma de presentación (abierta en 2D o 3D).
- Espera más o menos **15–25 tomas por minuto** de narración.

Dale al usuario un resumen de 5–10 líneas en español: el reparto, los lugares, la cantidad de tomas y lo más destacado de cada parte. Continúa salvo que tenga objeciones.
