# Pendientes — lo que solo tú puedes dar

Estado al 2026-10-28 (rama `yc-refresh`, después de tu revisión y tus fotos). Todo lo
demás está hecho y verificado; estas son las piezas que necesitan material o
una decisión tuya.

## 1. Dos logos oficiales que faltan

La pared ya usa logos oficiales de YC, Kodda, Softtek, Moneypool, Tec de
Monterrey, FIRST, Transpais, Cáritas de Monterrey, KAOS y Mediterra. Siguen
tipográficos (hechos con las fuentes del sitio):

- **VantTec**
- **Women in Technology**

- **Entregar**: el archivo oficial (SVG o PNG grande). Yo lo paso a crema con
  fondo transparente como hice con los demás.
- **Dónde cae**: `public/art/marks/` + `kind: 'official'` en `src/data/clients.ts`.

## 2. Dominio de producción

`index.html` apunta `og:url` y `og:image` a `https://mikealvaradol.web.app/`.
Si el sitio va a vivir en otro dominio, dime cuál y cambio las dos líneas.

## 3. Testimonios (opcional)

La sección de reseñas y su link en el nav se ocultan solos mientras
`src/data/testimonials.ts` esté vacío. Si quieres que aparezca: nombre, cargo,
organización y una o dos frases por persona, en inglés y español.

## 4. Capturas de preride desde la app

El proyecto preride usa una captura de su sitio web. Dos capturas de la app en
iPhone (ruta y resumen) la dejarían al nivel de AIMeter y midflight.

- **Dónde caen**: `portfolio/portfolio/public/projects/` y luego
  `npm run import:content` en redo.

## 5. CV v3.3

Los números de Softtek (70+ supermercados) y Moneypool (+37%) vienen del CV
v3.2. Si sacas la v3.3, pásamelo y reviso que las cifras sigan igual.

## Notas

- Correo público: `miguel_l06@hotmail.com` (tu decisión).
- Fotos (2026-10-28): retrato en `public/art/portrait-mike.webp`; las diez de
  "What drives me" en `public/art/photos/`. Si cambias alguna, mismo nombre,
  16:9, y `npm run build`.
- Kodda: fueron 23 personas en la empresa; el sitio no da ese número. Habla de
  "más de 30 personas con las que trabajé a la vez" y de ayudarles a crecer.
