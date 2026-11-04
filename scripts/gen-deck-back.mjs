import sharp from 'sharp'
// Builds public/art/deck-back.webp, the joined back face of the three deck
// cards (2130 x 928, 2x of the 1066 x 464 triptych), from a photograph of
// the Winged Victory of Samothrace at the Louvre under the hero's red treatment:
// grayscale, contrast, multiplied under the ember/blood/char radial, an
// orange screen glow on the figures and a soft vignette.
// Source (CC0, Wilfredor): https://commons.wikimedia.org/wiki/File:Nike_of_Samothrace,_Louvre.jpg
// Usage: node scripts/gen-deck-back.mjs <path to the 3840px rendition>
const source = process.argv[2]
if (!source) throw new Error('pass the path of the 3840px Commons rendition')
const W = 2130, H = 928
const gradient = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="g" cx="50%" cy="30%" r="80%" fx="50%" fy="30%" gradientTransform="translate(0.5,0.3) scale(0.7,1) translate(-0.5,-0.3)">
    <stop offset="0" stop-color="#fa6800"/><stop offset="0.48" stop-color="#cc0000"/><stop offset="1" stop-color="#0f0f0f"/></radialGradient>
</defs>
  <rect width="100%" height="100%" fill="url(#g)"/></svg>`)
const screen = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="s" cx="50%" cy="38%" r="55%"><stop offset="0" stop-color="#fa6800" stop-opacity="0.45"/><stop offset="0.72" stop-color="#fa6800" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#s)"/></svg>`)
const vignette = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="v" cx="50%" cy="8%" r="110%"><stop offset="0.35" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.3"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/></svg>`)

async function make(name, file, crop) {
  const photo = await sharp(file).extract(crop).resize(W, H).grayscale().normalise().linear(1.45, -0.32 * 255).modulate({ brightness: 1.1 }).toBuffer()
  await sharp(gradient).composite([
    { input: photo, blend: 'multiply' },
    { input: screen, blend: 'screen' },
    { input: vignette, blend: 'over' },
  ]).webp({ quality: 82 }).toFile(name)
  console.log('wrote', name)
}
// The rendition is 3840 x 2560; the crop keeps the statue and the prow
// centred for the middle card, with the columns on the side cards.
await make('public/art/deck-back.webp', source, { left: 220, top: 500, width: 3400, height: Math.round(3400 / (W / H)) })
