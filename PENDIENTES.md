# Pendientes — lo que falta de tu lado (2026-09-01)

Todo lo demás está resuelto en código. Estos puntos necesitan material o
decisiones tuyas; cada uno dice exactamente qué entregar y dónde cae.

## 1. Foto tuya para la founder card — el de mayor impacto

Es lo único en la página que se ve "sin terminar": hoy sale un avatar genérico
rojo (`/art/founder-mike.svg`).

- **Entregar**: una foto real tuya. Ideal ≥ 800×800, encuadre de retrato
  (pecho hacia arriba), fondo simple, buena luz. JPG o PNG; nosotros la
  convertimos a WebP.
- **Dónde cae**: `public/art/` y se referencia en `src/data/founders.ts`
  (campo `portrait`).

## 2. Copy del hero (último `TODO(mike)` de textos)

El placeholder actual ("Imagine a space / between idea & product / That's
where I build.") lee bien, pero no dice tu nombre ni tu rol above the fold.

- **Entregar**: `hero.line1`, `hero.line2` y `hero.sub` en **inglés y
  español** (van en `src/i18n/en.ts` y `es.ts`).
- **Restricciones**: line1/line2 cortas (serif display enorme, 2 líneas);
  sub una sola línea. Sugerencia: usa el sub para nombre + rol, p. ej.
  "Mike Alvarado — technical founder & software engineer."

## 3. Wordmarks para las stats

Las cuatro cifras (8,000+ / 6 / 70+ / +37%) hoy muestran la fuente como texto
("KODDA", "SOFTTEK", "MONEYPOOL"). El diseño acepta un logo opcional.

- **Entregar**: wordmarks **con fondo transparente** (SVG o PNG) de Kodda,
  Softtek y Moneypool, en versión clara (crema/blanco) porque van sobre negro.
- **Dónde caen**: `public/art/` + campo `mark: { src, alt }` en
  `src/data/stats.ts`. Si no hay logo de alguna, el texto actual se queda —
  no inventamos nada.

## 4. Dominio de producción → social card

El `<head>` ya lleva título, descripción y OG/Twitter, pero faltan dos cosas
que exigen URL absoluta (marcadas `TODO(mike)` en `index.html`):

- **Entregar**: el dominio final (p. ej. `https://mikealvarado.dev`) y, si
  quieres preview con imagen al compartir el link, una social card
  **1200×630 PNG o JPG** (los crawlers no aceptan WebP de forma fiable).
- **Dónde caen**: `og:url` + `og:image` en `index.html`.

## 5. Decisiones (solo necesito un sí/no o el texto)

- **Email de contacto**: hoy es `miguel_l06@hotmail.com` (viene del repo
  portfolio). ¿Lo cambiamos a `mikealvaradol06@gmail.com` o a un correo del
  dominio propio? Afecta `src/data/contact.ts` y el footer.
- **Título del founder card en español**: hoy mezcla idiomas ("Technical
  Founder e Ingeniero de Software"). ¿Lo dejamos así a propósito o lo paso a
  "Fundador técnico e ingeniero de software"? (`src/data/founders.ts`)
- **Testimonios**: la sección existe pero está vacía y oculta. En cuanto
  tengas 1–3 quotes reales (texto EN/ES + nombre + rol; foto opcional),
  se rellena `src/data/testimonials.ts` y la sección reaparece sola, con su
  anchor en el nav incluido.

## Notas

- `src/data/projects.ts` es **generado**: cualquier cambio de proyectos se
  hace en el repo `portfolio` (o en los overrides de
  `scripts/import-portfolio-content.mjs`) y se corre `npm run import:content`.
- Cuando entregues cualquiera de estos, el cierre es correr `npm run verify`
  (todo el pipeline, e2e incluido) — hoy está en verde.
