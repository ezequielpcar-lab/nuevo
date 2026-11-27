# Instalar el estudio (una vez por equipo o espacio de trabajo)

El estudio es un pequeño kit de Node + Python que viene dentro de esta skill, en su carpeta `kit/`. Cópialo a una carpeta del espacio de trabajo donde se pueda escribir, porque la carpeta del plugin puede ser de solo lectura y el estudio necesita `node_modules`, proyectos y renders a su lado.

Todo lo que le informes al usuario en esta etapa, díselo en español y con palabras simples.

## 1. Encontrar el kit
- El kit es `kit/` dentro de la carpeta base de esta skill (`videos-animados-2d`).
- Si la ruta no está clara, búscala: `find / -path "*videos-animados-2d/kit/render.mjs" 2>/dev/null | head -1` (Linux/macOS/VM de Cowork), o `Get-ChildItem -Recurse -Filter render.mjs -Path $HOME\.claude | Where-Object FullName -like "*videos-animados-2d*kit*" | Select-Object -First 1` (PowerShell).

## 2. Elegir el espacio de trabajo y copiar
- Usa la carpeta del proyecto conectada por el usuario si existe; si no, la carpeta de trabajo actual. Crea ahí `videos-animados-2d/`.
- Si `videos-animados-2d/` ya existe con `render.mjs` adentro, ya está instalado. Salta al paso 4 (doctor), y nunca sobrescribas la carpeta `projects/` del usuario.
- Copia todo `kit/` adentro: `cp -r "<kit>/." videos-animados-2d/` (bash) o `Copy-Item -Recurse "<kit>\*" videos-animados-2d\` (PowerShell).
- Ejecuta `python tools/verify_kit.py` dentro de `videos-animados-2d/`. Debe decir 30/30. Si falta algo o no coincide, vuelve a copiar esos archivos.

## 3. Instalar dependencias
Dile al usuario, en una lista corta, qué se instala y para qué: ffmpeg (para armar el video y el audio), paquetes de Node.js (el render, Three.js y las fuentes), un Chromium sin ventana (dibuja los cuadros) y numpy, scipy y faster-whisper (sonido y marcas de tiempo).

| Necesidad | Windows | macOS | Linux |
|---|---|---|---|
| ffmpeg + ffprobe | `winget install --id Gyan.FFmpeg -e` (luego abre una terminal nueva) | `brew install ffmpeg` | `sudo apt-get install -y ffmpeg` |
| Node.js ≥ 18 | `winget install OpenJS.NodeJS.LTS` | `brew install node` | nodesource o el paquete de la distribución |
| Python ≥ 3.9 | instalador de python.org | `brew install python` | paquete de la distribución |
| Paquetes JS | `npm install` (dentro de videos-animados-2d) | igual | igual |
| Chromium sin ventana | `npx playwright install chromium` | igual | igual (`npx playwright install-deps chromium` si faltan librerías) |
| Paquetes de Python | `python -m pip install numpy scipy faster-whisper` | igual | agrega `--break-system-packages` en Pythons administrados |

## 4. Revisar y autoprueba
1. `python tools/doctor.py`. Usa `python3` donde `python` no sea Python 3, y `py -3` en algunos Windows. Repite hasta que todas las líneas digan OK. `python tools/doctor.py --install` ejecuta solo los arreglos de npm, playwright y pip.
2. Autoprueba: `node render.mjs --project examples/reaction-time --sheet --scale 0.3`. Debe generar `examples/reaction-time/build/sheets/sheet_01.png` con 14 cuadros terminados (escenas de café, caras gigantes, una órbita 3D, gráficos tipo plano y una tarjeta de título) sin errores. Abre el PNG para confirmar y luego borra `examples/reaction-time/build/`. (El ejemplo está en inglés; solo sirve para probar que el estudio funciona.)
3. Whisper descarga su modelo la primera vez que se usa (~75 MB para `base`, ~500 MB para `small`). Necesita acceso a internet a huggingface.co. Para español no existe la versión `.en`, así que se usa el modelo multilingüe normal (es automático con `--lang es`).

## Notas
- En servidores Linux y en la VM de Cowork no hay GPU. Chromium usa SwiftShader automáticamente (`--gl swiftshader` es el valor por defecto en Linux), así que todo funciona, solo que más lento.
- Disco: ~600 MB para node_modules + Chromium, más los renders (un video de 10 minutos en 1080p pesa ~150–300 MB).
- Actualizar: cuando se actualice la skill, copia el nuevo `kit/` encima de la instalación. Nunca toca `projects/`, así que los videos del usuario están a salvo. Los estilos propios agregados en `engine/styles.js` habría que volver a agregarlos, así que revisa antes.

## Sesiones de Claude Code en la nube
- Instala el estudio en el directorio de trabajo temporal (scratchpad) o en una carpeta ignorada por git, nunca dentro de `.claude/skills/`, para no meter `node_modules`, proyectos ni renders en el repositorio.
- No ejecutes `npx playwright install chromium`: ya hay un Chromium instalado. Úsalo con la variable `CHROMIUM_PATH` en todos los comandos de render y en el doctor:
  `CHROMIUM_PATH=/opt/pw-browsers/chromium node render.mjs ...` y `CHROMIUM_PATH=/opt/pw-browsers/chromium python3 tools/doctor.py`.
- Si la descarga del modelo de Whisper falla con `403 Forbidden (agent proxy ...)`, la red del entorno no permite huggingface.co. Pide al usuario un guion con marcas de tiempo (usa `parse_script.py`) o propón habilitar ese host en el entorno.
