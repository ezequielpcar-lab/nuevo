# CaptaWeb · Negocios sin web

Herramienta web (un solo archivo, sin servidor) para encontrar negocios de España que no tienen página web o la tienen anticuada, ver su contacto en un mapa, calcular un precio orientativo y escribirles por WhatsApp.

## Cómo funciona

- **Geocodificación:** Nominatim (OpenStreetMap).
- **Negocios:** Overpass API (OpenStreetMap), con varios servidores en carrera.
- **Mapa:** Leaflet + teselas oscuras de CARTO.
- **IA (opcional):** API de Anthropic directamente desde el navegador con tu propia clave (se guarda solo en tu navegador, en `localStorage`).

No hay backend ni dependencias que instalar: todo está en `index.html`.

## Probar en local

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Publicar con GitHub Pages

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Haz merge a la rama `main` (o lanza el workflow *Publicar en GitHub Pages* a mano desde la pestaña **Actions**).
3. La web quedará en `https://<tu-usuario>.github.io/<repositorio>/`.

## Configuración

Pulsa **⚙ Ajustes** en la web para poner tu nombre, teléfono, precios por sector, la plantilla del mensaje de WhatsApp y, si quieres el análisis con IA, tu clave API de Anthropic y el modelo (por defecto `claude-sonnet-5-5`).

> La clave API queda guardada en el navegador de quien la introduce. No la pongas en el código ni la compartas: cualquiera con acceso a ese navegador podría usarla.

## Créditos de datos

Datos de negocios © colaboradores de OpenStreetMap (ODbL). Comprueba cada negocio en Google antes de contactar.
