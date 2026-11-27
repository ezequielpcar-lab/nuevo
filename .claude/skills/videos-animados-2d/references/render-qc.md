# Render, control de calidad y solución de problemas

## Render

**Primero la vista previa.** `node render.mjs --project projects/mi-video --from 0 --to 30 --scale 0.5` genera `build/preview.mp4`. Mírala (o revisa imágenes fijas). Luego envía al usuario una vista previa o una hoja de contacto antes del render final largo.

**Render final:**
```bash
node render.mjs --project projects/mi-video [--workers N] [--format jpeg]
python audio/mix.py --project projects/mi-video        # genera música + efectos, mezcla y une -> out/<title>.mp4
```
- Los procesos (workers) por defecto son la mitad de los hilos de la CPU (máximo 8). Cada uno es un Chromium aparte. Baja la cantidad si falta RAM (unos 0,6–1,5 GB por proceso a 1080p, más a 4K).
- En equipos sin GPU (la mayoría de servidores Linux), Chromium usa SwiftShader (`--gl swiftshader`, por defecto en Linux). En computadoras Windows y macOS se usa la GPU (`--gl auto`).
- **Guía de velocidad** (cuadros = segundos × 24): medido a 720p en una CPU en la nube de 2 hilos, unos 2 cuadros/s, así que un video de 47 s tardó unos 10 min. 1080p cuesta ~2× eso, 1440p ~3,5× y 4K ~8×. Una computadora moderna de 8 núcleos es ~3–5× más rápida, y una GPU ayuda sobre todo en las tomas 3D. Calcula el tiempo con esto, y para videos de 10 minutos en 4K planea un render largo o de toda la noche. Los renders largos deben correr en segundo plano (`nohup … &` o una terminal aparte) mientras revisas el registro.
- `--format jpeg` acelera la captura (~1,5×) con una pérdida de calidad mínima.
- **Volver a renderizar una parte después de un arreglo:** vuelve a renderizar todo el video (simple y seguro), o solo el tramo cambiado con `--from/--to --out build/fix.mp4` y únelo con ffmpeg si sabes hacerlo.
- **Revisión final:** la duración de `ffprobe` ≈ la duración de shots.json, hay audio, y luego haz una hoja de contacto del archivo final con ffmpeg (`-vf fps=1/10,scale=320:-1,tile=6x5`) y mírala.

## Lista de control de calidad (en cada hoja de contacto)
- [ ] No hay cuadros `MISSING SHOT` ni `ERROR` en rojo, y la consola no mostró errores de tomas.
- [ ] Cada imagen corresponde a su `line`, y la acción clave cae en la palabra clave.
- [ ] Los personajes se distinguen: tienen luz de borde, están delante de zonas más claras, no se cortan en los bordes y no se encima el texto.
- [ ] La ropa y la dirección en pantalla son iguales dentro de una escena, y cada personaje tiene sombra de contacto o está apoyado en el piso.
- [ ] Estructura de valores con ambiente (casi todo oscuro, 1–3 acentos brillantes), nada plano ni lavado, y los colores vienen del ambiente/estilo.
- [ ] Cada toma tiene movimiento de cámara y algo de atmósfera (polvo, lluvia, partículas, brillos).
- [ ] El texto es corto, está dentro de la zona segura y se lee en un celular. Los números coinciden con la narración.
- [ ] **Todo texto en pantalla está en español**, con tildes, ñ, `¿` y `¡` correctos.
- [ ] Variedad: no más de 3 tomas seguidas del mismo tipo o encuadre, con primeros planos y detalles intercalados.
- [ ] 9:16: los sujetos están al centro y nada importante queda debajo de los subtítulos.
- [ ] Audio: voz clara, música más baja cuando se habla, sin efectos amontonados, volumen final de unos −14 LUFS.

## Lista de control de las miniaturas (`build/thumbs_sheet.png`)
- [ ] Se entienden en tamaño pequeño: texto legible, cara y emoción claras.
- [ ] Cada una conecta con su título y no repite sus palabras.
- [ ] Las 3 usan composiciones distintas.
- [ ] Texto en español, 1–3 palabras, arriba, sin tapar la cara y lejos de la esquina inferior derecha (duración).
- [ ] Mismo personaje y estilo que el video, fondo oscuro con una sola luz fuerte.

## Solución de problemas
- **Las fuentes se ven como letra con serifas por defecto** → faltan los paquetes `@fontsource`. Ejecuta `npm install` en videos-animados-2d.
- **`Player failed to boot`** → lee el mensaje. Casi siempre es un error de sintaxis JSON en shots.json/config.json o una ruta de import en una escena. Los errores de import de escenas aparecen al final del render.
- **Toma WebGL o 3D en negro** → agrega `--gl swiftshader` y revisa la consola por errores de Three.js (un constructor mal escrito o falta `return {stage}` en init).
- **Sin memoria o se cae en 4K** → usa `--workers 1` o `2`, y evita desenfoques enormes en 4K (el costo del desenfoque crece con la resolución).
- **Whisper lento** → usa `--model base`. **Coincidencia del guion < 90 %** → el guion o el audio no son los correctos. Pregúntale al usuario.
- **`wordTime()` no encuentra una palabra** → escríbela igual que en la narración, con su tilde (`'corazón'`, no `'corazon'`). Revisa `timeline/words.json`.
- **El video es más largo o más corto que el audio** → `story.duration` debe ser igual al `end` de la última toma. Vuelve a ejecutar `beats.py --force` o corrígelo a mano.
- **Errores de PyAV/`av` en faster-whisper** → las herramientas decodifican el audio con ffmpeg, así que solo asegúrate de que ffmpeg esté en el PATH.
- **`--thumbs` dice que falta `story/thumbs.json`** → créalo primero (ver metadata-seo.md). **Una miniatura sale MISSING** → el id en thumbs.json no coincide con `registerShot`.
- **Rutas en Windows** → pon entre comillas las rutas con espacios. Usa `python` (o `py -3`) en vez de `python3`.
