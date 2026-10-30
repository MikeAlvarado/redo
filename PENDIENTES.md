# Pendientes — lo que solo tú puedes dar

Estado al 2026-10-29 (`main`, desplegado en mikealvaradol.web.app). Todo lo
demás está hecho y verificado; estas son las piezas que necesitan material o
una decisión tuya.

## 1. Dominio de producción

`index.html` apunta `og:url` y `og:image` a `https://mikealvaradol.web.app/`.
Si el sitio va a vivir en otro dominio, dime cuál y cambio las dos líneas.

## 2. Testimonios (opcional)

La sección de reseñas y su link en el nav se ocultan solos mientras
`src/data/testimonials.ts` esté vacío. Si quieres que aparezca: nombre, cargo,
organización y una o dos frases por persona, en inglés y español.

## 3. Capturas de preride desde la app

El proyecto preride usa una captura de su sitio web. Dos capturas de la app en
iPhone (ruta y resumen) la dejarían al nivel de AIMeter y midflight.

- **Dónde caen**: `portfolio/portfolio/public/projects/` y luego
  `npm run import:content` en redo.

## 4. CV v3.3

Los números de Softtek (70+ supermercados) y Moneypool (+37%) vienen del CV
v3.2. Si sacas la v3.3, pásamelo y reviso que las cifras sigan igual.

## Notas

- Correo público: `miguel_l06@hotmail.com` (tu decisión).
- Fotos (2026-10-28): retrato en `public/art/portrait-mike.webp`; las diez de
  "What drives me" en `public/art/photos/`. Si cambias alguna, mismo nombre,
  16:9, y `npm run build`.
- Logos (2026-10-29): la pared ya es toda oficial; VantTec y Women in Tech
  entraron desde el avatar de GitHub y el logo de women-in-tech.org,
  recoloreados a crema en `public/art/marks/`.
- Kodda: fueron 23 personas en la empresa; el sitio no da ese número. Habla de
  "más de 30 personas con las que trabajé a la vez" y de ayudarles a crecer.
