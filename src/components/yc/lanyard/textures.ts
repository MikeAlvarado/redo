// Card faces and strap are painted on 2D canvases at runtime, so the badge
// ships no image files and follows the dictionary (wordmark, role, batch).

export interface FaceCopy {
  batch: string
  name: string
  role: string
}

export interface FaceAssets {
  // The official lockup: an orange square with the white Y at its left.
  ycMark: HTMLImageElement | null
  // Cream wordmark; the front strip recolours it to ink.
  kodda: HTMLImageElement | null
  portrait: HTMLImageElement | null
}

export const FACE_WIDTH = 1024
export const FACE_HEIGHT = 1440
// Side of the orange square inside the lockup PNG (1600 × 331).
const YC_SQUARE = 331

const ORANGE = '#f26625'
const INK = '#0b0a09'
const CREAM = '#eae7e0'

const SANS = "'Mona Sans Variable', 'Mona Sans', system-ui, sans-serif"

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// The white Y alone, lifted out of the official square: orange pixels go
// transparent, the glyph stays white.
function whiteGlyph(mark: HTMLImageElement, size: number): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(mark, 0, 0, YC_SQUARE, YC_SQUARE, 0, 0, size, size)
  const image = ctx.getImageData(0, 0, size, size)
  const px = image.data
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i] ?? 0
    const g = px[i + 1] ?? 0
    const b = px[i + 2] ?? 0
    // Whiteness: how far the pixel is from the orange; keeps the edges soft.
    const white = Math.max(0, Math.min(1, (Math.min(r, g, b) - 90) / 140))
    px[i] = 255
    px[i + 1] = 255
    px[i + 2] = 255
    px[i + 3] = Math.round(white * 255)
  }
  ctx.putImageData(image, 0, 0)
  return canvas
}

// A one-colour image (the cream wordmark) repainted in another colour.
function tinted(image: HTMLImageElement, width: number, height: number, colour: string): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(width)
  canvas.height = Math.ceil(height)
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(image, 0, 0, width, height)
  ctx.globalCompositeOperation = 'source-in'
  ctx.fillStyle = colour
  ctx.fillRect(0, 0, width, height)
  return canvas
}

function pill(ctx: CanvasRenderingContext2D, label: string, cy: number, fill: string, ink: string) {
  ctx.font = `600 34px ${SANS}`
  ctx.textBaseline = 'middle'
  const tracked = label.toUpperCase().split('')
  const widths = tracked.map((ch) => ctx.measureText(ch).width)
  const textWidth = widths.reduce((sum, w) => sum + w + 7, -7)
  const pillW = textWidth + 120
  const pillH = 70
  roundedRect(ctx, (FACE_WIDTH - pillW) / 2, cy - pillH / 2, pillW, pillH, pillH / 2)
  ctx.fillStyle = fill
  ctx.fill()
  ctx.fillStyle = ink
  ctx.textAlign = 'left'
  let x = (FACE_WIDTH - textWidth) / 2
  tracked.forEach((ch, i) => {
    ctx.fillText(ch, x, cy + 1)
    x += (widths[i] ?? 0) + 7
  })
}

// Front: the white Y, "Y Combinator", the batch, and a white strip with
// the Kodda wordmark.
export function paintFront(canvas: HTMLCanvasElement, copy: FaceCopy, assets: FaceAssets) {
  canvas.width = FACE_WIDTH
  canvas.height = FACE_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = ORANGE
  ctx.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT)
  const sheen = ctx.createLinearGradient(0, 0, FACE_WIDTH, FACE_HEIGHT)
  sheen.addColorStop(0, 'rgba(255,255,255,0.08)')
  sheen.addColorStop(0.5, 'rgba(255,255,255,0)')
  sheen.addColorStop(1, 'rgba(0,0,0,0.06)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT)

  const glyphSize = 360
  const glyphY = 360
  const glyph = assets.ycMark ? whiteGlyph(assets.ycMark, glyphSize) : null
  if (glyph) {
    ctx.drawImage(glyph, (FACE_WIDTH - glyphSize) / 2, glyphY)
  } else {
    ctx.fillStyle = '#ffffff'
    ctx.font = `700 ${glyphSize * 0.8}px ${SANS}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('Y', FACE_WIDTH / 2, glyphY + glyphSize * 0.82)
  }

  ctx.fillStyle = '#ffffff'
  ctx.font = `600 84px ${SANS}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('Y Combinator', FACE_WIDTH / 2, glyphY + glyphSize + 110)
  pill(ctx, copy.batch, glyphY + glyphSize + 200, 'rgba(255,255,255,0.22)', '#ffffff')

  const stripH = 150
  const stripY = FACE_HEIGHT - stripH - 56
  roundedRect(ctx, 56, stripY, FACE_WIDTH - 112, stripH, 26)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  if (assets.kodda) {
    const width = 300
    const height = (width * assets.kodda.naturalHeight) / assets.kodda.naturalWidth
    const mark = tinted(assets.kodda, width, height, INK)
    if (mark) ctx.drawImage(mark, (FACE_WIDTH - width) / 2, stripY + (stripH - height) / 2)
  }
}

// Back: the portrait, the name and the role.
export function paintBack(canvas: HTMLCanvasElement, copy: FaceCopy, assets: FaceAssets) {
  canvas.width = FACE_WIDTH
  canvas.height = FACE_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = INK
  ctx.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT)
  const glow = ctx.createRadialGradient(FACE_WIDTH / 2, 560, 40, FACE_WIDTH / 2, 560, 760)
  glow.addColorStop(0, 'rgba(242,102,37,0.22)')
  glow.addColorStop(1, 'rgba(242,102,37,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, FACE_WIDTH, FACE_HEIGHT)
  roundedRect(ctx, 24, 24, FACE_WIDTH - 48, FACE_HEIGHT - 48, 120)
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 3
  ctx.stroke()

  const radius = 230
  const cy = 600
  ctx.beginPath()
  ctx.arc(FACE_WIDTH / 2, cy, radius, 0, Math.PI * 2)
  ctx.closePath()
  if (assets.portrait) {
    ctx.save()
    ctx.clip()
    const side = Math.min(assets.portrait.naturalWidth, assets.portrait.naturalHeight)
    ctx.drawImage(
      assets.portrait,
      (assets.portrait.naturalWidth - side) / 2,
      (assets.portrait.naturalHeight - side) / 2,
      side,
      side,
      FACE_WIDTH / 2 - radius,
      cy - radius,
      radius * 2,
      radius * 2,
    )
    ctx.restore()
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.fill()
  }
  ctx.beginPath()
  ctx.arc(FACE_WIDTH / 2, cy, radius + 6, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(234,231,224,0.25)'
  ctx.lineWidth = 4
  ctx.stroke()

  ctx.fillStyle = CREAM
  ctx.font = `600 84px ${SANS}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(copy.name, FACE_WIDTH / 2, cy + radius + 130)
  ctx.fillStyle = 'rgba(234,231,224,0.72)'
  ctx.font = `500 54px ${SANS}`
  ctx.fillText(copy.role, FACE_WIDTH / 2, cy + radius + 230)
}

export const STRAP_WIDTH = 192
export const STRAP_LENGTH = 384
// Length-to-width of the strap texture; the ribbon's V repeats by it.
export const STRAP_ASPECT = STRAP_LENGTH / STRAP_WIDTH

// Woven black strap: faint weave lines and two rows of stitching.
export function paintStrap(canvas: HTMLCanvasElement) {
  canvas.width = STRAP_WIDTH
  canvas.height = STRAP_LENGTH
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = '#111111'
  ctx.fillRect(0, 0, STRAP_WIDTH, STRAP_LENGTH)
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  for (let y = 0; y < STRAP_LENGTH; y += 4) ctx.fillRect(0, y, STRAP_WIDTH, 1)
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  for (let y = 0; y < STRAP_LENGTH; y += 14) {
    ctx.fillRect(14.4, y, 2, 8)
    ctx.fillRect(STRAP_WIDTH * 0.925 - 2, y, 2, 8)
  }
}

export function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// Deterministic pseudo-random for the procedural normal maps.
function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Height field → tangent-space normal map, 128×128, tiling.
function normalMapFrom(height: (x: number, y: number) => number, gain: number): Uint8Array {
  const out = new Uint8Array(128 * 128 * 4)
  for (let y = 0; y < 128; y += 1) {
    for (let x = 0; x < 128; x += 1) {
      const dx = (height(x - 1, y) - height(x + 1, y)) * gain
      const dy = (height(x, y - 1) - height(x, y + 1)) * gain
      const len = Math.hypot(dx, dy, 1)
      const o = (y * 128 + x) * 4
      out[o] = ((dx / len) * 0.5 + 0.5) * 255
      out[o + 1] = ((dy / len) * 0.5 + 0.5) * 255
      out[o + 2] = ((1 / len) * 0.5 + 0.5) * 255
      out[o + 3] = 255
    }
  }
  return out
}

// Soft blurred noise: the faint grain on the card faces.
export function noiseNormalData(): Uint8Array {
  const rand = mulberry(7)
  const field = Float32Array.from({ length: 128 * 128 }, () => rand())
  const sample = (x: number, y: number) => {
    let sum = 0
    for (let j = -1; j <= 1; j += 1) {
      for (let i = -1; i <= 1; i += 1) {
        sum += field[(((y + j + 128) % 128) * 128 + ((x + i + 128) % 128))] ?? 0
      }
    }
    return (sum / 9) * 1.6
  }
  return normalMapFrom(sample, 1)
}

// Twill weave: alternating over/under cells with a little fibre noise.
export function weaveNormalData(): Uint8Array {
  const rand = mulberry(19)
  const fibre = Float32Array.from({ length: 128 * 128 }, () => rand())
  const bulge = (t: number) => Math.sqrt(Math.max(0, 1 - 4 * t * t))
  const sample = (x: number, y: number) => {
    const px = ((x % 128) + 128) % 128
    const py = ((y % 128) + 128) % 128
    const u = (px / 128) * 8
    const v = (py / 128) * 8
    const cu = Math.floor(u)
    const cv = Math.floor(v)
    const fu = u - cu - 0.5
    const fv = v - cv - 0.5
    const over = (cu + cv) % 2 === 0
    const warp = bulge(fu) * (0.55 + 0.45 * Math.cos(fv * Math.PI * (over ? 1 : 0.6)))
    const weft = bulge(fv) * (0.55 + 0.45 * Math.cos(fu * Math.PI * (over ? 0.6 : 1)))
    return (over ? Math.max(warp, 0.7 * weft) : Math.max(weft, 0.7 * warp)) + 0.08 * (fibre[py * 128 + px] ?? 0)
  }
  return normalMapFrom(sample, 1.6)
}
