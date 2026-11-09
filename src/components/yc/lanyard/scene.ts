import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DataTexture,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  LinearFilter,
  LinearMipmapLinearFilter,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PMREMGenerator,
  Path,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  RepeatWrapping,
  SRGBColorSpace,
  Scene,
  Shape,
  ShapeGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import {
  DEFAULT_INPUT,
  ROPE_NODES,
  createBody,
  createState,
  derive,
  flip,
  isFlipped,
  layout,
  step,
  strapEndIndex,
} from './physics'
import {
  STRAP_ASPECT,
  type FaceAssets,
  type FaceCopy,
  loadImage,
  noiseNormalData,
  paintBack,
  paintFront,
  paintStrap,
  weaveNormalData,
} from './textures'

export interface LanyardOptions {
  copy: FaceCopy
  ycMarkSrc: string
  koddaSrc: string
  portraitSrc: string
  reducedMotion: boolean
  onFlip?: (flipped: boolean) => void
}

export interface LanyardHandle {
  flip: () => void
  dispose: () => void
}

// Scene units: the card is 1.6 × 2.25 with a 0.117 corner (cornerRadius
// 0.3 of the short side's 0.2). The slot sits 0.13 below the top edge, the
// ring hangs 0.055 below it and the rope ties 0.095 above the ring.
const CARD = { width: 1.6, height: 2.25, radius: 0.03 + 0.29 * 0.3, depth: 0.018 }
const INSET = 0.007
const SLOT = { width: 0.34, height: 0.07, y: CARD.height / 2 - 0.13 }
const RING_Y = CARD.height / 2 - 0.055
const HANG_Y = RING_Y + 0.095
const FACE_Z = CARD.depth / 2 + INSET + 0.0006
const STRAP_WIDTH = 0.36 * 0.65
const STRAP_SAMPLES = 72
// Four vertices across the ribbon: flat middle, rounded edges.
const PROFILE = [0, 0.07, 0.93, 1]
const PROFILE_ANGLES = [-0.95, -0.28, 0.28, 0.95].map((a) => [Math.cos(a), Math.sin(a)] as const)
const CARD_SHARE = 0.6
const STRAP_SHARE = 0.5
// The canvas runs past the stage, half a stage above it and a full one
// below, so a pulled card is drawn over the neighbouring sections instead of
// being cut at the stage's edge.
const OVER = { top: 0.5, bottom: 1.1 }
const CANVAS_SPAN = 1 + OVER.top + OVER.bottom
// Pixels the canvas may hold; the pixel ratio drops on large stages to stay
// under it.
const MAX_PIXELS = 6_500_000
const FOV = 24
const TAP_MS = 450
const TAP_PX = 6
const ORANGE = '#f26625'

function roundedPath(into: Shape | Path, x: number, y: number, w: number, h: number, r: number) {
  into.moveTo(x + r, y)
  into.lineTo(x + w - r, y)
  into.quadraticCurveTo(x + w, y, x + w, y + r)
  into.lineTo(x + w, y + h - r)
  into.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  into.lineTo(x + r, y + h)
  into.quadraticCurveTo(x, y + h, x, y + h - r)
  into.lineTo(x, y + r)
  into.quadraticCurveTo(x, y, x + r, y)
}

function cardGeometry() {
  const outline = new Shape()
  roundedPath(
    outline,
    -CARD.width / 2 + INSET,
    -CARD.height / 2 + INSET,
    CARD.width - 2 * INSET,
    CARD.height - 2 * INSET,
    Math.max(CARD.radius - INSET, 0.005),
  )
  const hole = new Path()
  roundedPath(
    hole,
    -SLOT.width / 2 - INSET,
    SLOT.y - SLOT.height / 2 - INSET,
    SLOT.width + 2 * INSET,
    SLOT.height + 2 * INSET,
    SLOT.height / 2 + INSET,
  )
  outline.holes.push(hole)
  const body = new ExtrudeGeometry(outline, {
    depth: CARD.depth,
    bevelEnabled: true,
    bevelThickness: INSET,
    bevelSize: INSET,
    bevelSegments: 5,
    curveSegments: 24,
  })
  body.translate(0, 0, -CARD.depth / 2)
  const face = new ShapeGeometry(outline, 24)
  const pos = face.getAttribute('position')
  const uv = face.getAttribute('uv')
  for (let i = 0; i < pos.count; i += 1) {
    uv.setXY(i, (pos.getX(i) + CARD.width / 2) / CARD.width, (pos.getY(i) + CARD.height / 2) / CARD.height)
  }
  uv.needsUpdate = true
  return { body, face }
}

function clipPlateGeometry(width: number) {
  const shape = new Shape()
  const w = 1.16 * width
  roundedPath(shape, -w / 2 + 0.014, -0.061, w - 0.028, 0.122, 0.024)
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.014,
    bevelSegments: 6,
    curveSegments: 10,
  })
  geometry.translate(0, 0, -0.01)
  return geometry
}

function strapGeometry() {
  const geometry = new BufferGeometry()
  const count = STRAP_SAMPLES * PROFILE.length
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3))
  geometry.setAttribute('normal', new BufferAttribute(new Float32Array(count * 3), 3))
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array(count * 2), 2))
  const index: number[] = []
  const across = PROFILE.length
  for (let i = 0; i < STRAP_SAMPLES - 1; i += 1) {
    for (let j = 0; j < across - 1; j += 1) {
      const a = i * across + j
      index.push(a, a + across, a + 1, a + 1, a + across, a + across + 1)
    }
  }
  geometry.setIndex(index)
  return geometry
}

// A dark room with a handful of bright panels, baked into an environment
// map: that is where the clearcoat highlights and the metal come from.
function roomEnvironment(renderer: WebGLRenderer) {
  const room = new Scene()
  room.background = new Color(0.035, 0.035, 0.04)
  const plane = new PlaneGeometry(1, 1)
  const materials: MeshBasicMaterial[] = []
  const panel = (intensity: number, at: [number, number, number], size: [number, number], roll = 0) => {
    const material = new MeshBasicMaterial({ color: new Color(intensity, intensity, intensity), side: BackSide })
    materials.push(material)
    const mesh = new Mesh(plane, material)
    mesh.position.set(...at)
    mesh.scale.set(size[0], size[1], 1)
    mesh.lookAt(0, 0, 0)
    mesh.rotateZ(roll)
    room.add(mesh)
  }
  panel(2.6, [0, 4.5, 8], [9, 4])
  panel(6, [-5.5, 0.5, 7], [0.9, 14])
  panel(4, [5, -0.5, 8], [0.6, 14])
  panel(3.5, [0, -1, 9], [24, 0.35], Math.PI / 3)
  panel(2.5, [1, 2.5, 9], [24, 0.2], Math.PI / 3)
  panel(1.4, [0, 6, -6], [12, 4])
  panel(0.5, [0, -7, 1], [16, 6])
  panel(0.9, [8, 0, -2], [4, 10])
  const pmrem = new PMREMGenerator(renderer)
  const target = pmrem.fromScene(room, 0.035)
  pmrem.dispose()
  plane.dispose()
  for (const material of materials) material.dispose()
  return target
}

function dataNormal(data: Uint8Array, repeatX: number, repeatY: number) {
  const texture = new DataTexture(data, 128, 128)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.magFilter = LinearFilter
  texture.minFilter = LinearMipmapLinearFilter
  texture.generateMipmaps = true
  texture.repeat.set(repeatX, repeatY)
  texture.needsUpdate = true
  return texture
}

export function createLanyard(container: HTMLElement, options: LanyardOptions): LanyardHandle | null {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = NeutralToneMapping
  renderer.toneMappingExposure = 1
  const canvas = renderer.domElement
  canvas.className = 'pointer-events-none absolute left-0 w-full'
  canvas.style.top = `${-100 * OVER.top}%`
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.height = `${100 * CANVAS_SPAN}%`
  container.appendChild(canvas)

  const scene = new Scene()
  const environment = roomEnvironment(renderer)
  scene.environment = environment.texture
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 200)
  const key = new DirectionalLight(0xffffff, 1.6)
  key.position.set(-2.5, 4, 6)
  const fill = new DirectionalLight(0xffffff, 0.35)
  fill.position.set(3, -1, 4)
  scene.add(key, fill)

  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
  const frontCanvas = document.createElement('canvas')
  const backCanvas = document.createElement('canvas')
  const strapCanvas = document.createElement('canvas')
  const assets: FaceAssets = { ycMark: null, kodda: null, portrait: null }
  paintFront(frontCanvas, options.copy, assets)
  paintBack(backCanvas, options.copy, assets)
  paintStrap(strapCanvas)
  const frontMap = new CanvasTexture(frontCanvas)
  const backMap = new CanvasTexture(backCanvas)
  const strapMap = new CanvasTexture(strapCanvas)
  for (const map of [frontMap, backMap, strapMap]) {
    map.colorSpace = SRGBColorSpace
    map.anisotropy = anisotropy
  }
  strapMap.wrapS = RepeatWrapping
  strapMap.wrapT = RepeatWrapping
  const grainNormal = dataNormal(noiseNormalData(), 5, 7)
  const weaveNormal = dataNormal(weaveNormalData(), 2, 2 * STRAP_ASPECT)

  const { body: bodyGeometry, face: faceGeometry } = cardGeometry()
  const edgeMaterial = new MeshPhysicalMaterial({
    color: new Color(ORANGE).multiplyScalar(0.92),
    roughness: 0.35,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  })
  const faceMaterial = (map: CanvasTexture) =>
    new MeshPhysicalMaterial({
      map,
      normalMap: grainNormal,
      normalScale: new Vector2(0.06, 0.06),
      roughness: 0.42,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
    })
  const frontMaterial = faceMaterial(frontMap)
  const backMaterial = faceMaterial(backMap)
  const metal = new MeshStandardMaterial({ color: 0xd9dce2, metalness: 1, roughness: 0.16 })
  const strapMaterial = new MeshPhysicalMaterial({
    map: strapMap,
    normalMap: weaveNormal,
    normalScale: new Vector2(0.7, 0.7),
    roughness: 0.68,
    sheen: 1,
    sheenRoughness: 0.42,
    sheenColor: new Color(0.32, 0.32, 0.34),
    side: DoubleSide,
  })

  const card = new Group()
  const bodyMesh = new Mesh(bodyGeometry, edgeMaterial)
  const frontMesh = new Mesh(faceGeometry, frontMaterial)
  frontMesh.position.z = FACE_Z
  const backMesh = new Mesh(faceGeometry.clone(), backMaterial)
  backMesh.rotation.y = Math.PI
  backMesh.position.z = -FACE_Z
  const ring = new Mesh(new TorusGeometry(0.095, 0.0135, 18, 72), metal)
  ring.position.set(0, RING_Y, 0)
  ring.rotation.y = Math.PI / 2 - 0.7
  card.add(bodyMesh, frontMesh, backMesh, ring)
  scene.add(card)

  const strapMesh = new Mesh(strapGeometry(), strapMaterial)
  strapMesh.frustumCulled = false
  scene.add(strapMesh)
  const clip = new Group()
  const clipPlate = new Mesh(clipPlateGeometry(STRAP_WIDTH), metal)
  clipPlate.position.y = 0.107
  const clipRing = new Mesh(new TorusGeometry(0.036, 0.0105, 14, 40), metal)
  clip.add(clipPlate, clipRing)
  scene.add(clip)

  const physicsBody = createBody(CARD.width, CARD.height, HANG_Y)
  const state = createState(physicsBody)
  const params = derive({ ...DEFAULT_INPUT, breeze: options.reducedMotion ? 0 : DEFAULT_INPUT.breeze })
  const size = { width: 1, height: 1 }
  let frame = 0
  let visible = true
  let alive = true
  let laidOut = false
  let lastTime = performance.now()

  // How far up and down the pointer may take the card: the canvas, less the
  // card itself, so it is never cut. Sideways it is free: the canvas is as
  // wide as the page.
  const bounds = { top: 1, bottom: -1 }
  const grabOffset = new Vector3()
  const fit = () => {
    const aspect = size.width / size.height
    let visibleHeight = CARD.height / CARD_SHARE
    const minWidth = CARD.width / 0.72
    if (visibleHeight * aspect < minWidth) visibleHeight = minWidth / aspect
    camera.aspect = aspect
    camera.position.set(0, 0, visibleHeight / 2 / Math.tan((FOV * Math.PI) / 360))
    camera.lookAt(0, 0, 0)
    camera.setViewOffset(
      size.width,
      size.height,
      0,
      -size.height * OVER.top,
      size.width,
      size.height * CANVAS_SPAN,
    )
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    const anchorY = visibleHeight / 2 + 0.2
    bounds.top = visibleHeight / 2 + visibleHeight * OVER.top - CARD.height * 0.6
    bounds.bottom = -visibleHeight / 2 - visibleHeight * OVER.bottom + CARD.height * 0.6
    const slotY = visibleHeight / 2 - visibleHeight * (0.12 + 0.3 * STRAP_SHARE) + (HANG_Y - CARD.height / 2)
    if (!laidOut) {
      layout(state, new Vector3(0, anchorY, 0), anchorY - slotY, options.reducedMotion ? 'rest' : 'drop')
      laidOut = true
    } else {
      state.anchor.set(0, anchorY, 0)
      state.nodes[0]?.copy(state.anchor)
      state.previous[0]?.copy(state.anchor)
      state.rest = (anchorY - slotY) / (ROPE_NODES - 1)
    }
  }

  const curvePoints: Vector3[] = []
  const curve = new CatmullRomCurve3(curvePoints, false, 'centripetal')
  const samples = Array.from({ length: STRAP_SAMPLES }, () => new Vector3())
  const acrossAt = Array.from({ length: STRAP_SAMPLES }, () => new Vector3())
  const guideA = new Vector3()
  const guideB = new Vector3()
  const tmp = {
    tangent: new Vector3(),
    toCamera: new Vector3(),
    up: new Vector3(),
    across: new Vector3(),
    facing: new Vector3(),
    end: new Vector3(),
    fallback: new Vector3(1, 0, 0),
    basis: new Matrix4(),
  }
  const updateStrap = () => {
    const slot = state.nodes[ROPE_NODES - 1]
    if (!slot) return
    const endIndex = strapEndIndex(state)
    const endNode = state.nodes[endIndex]
    if (!endNode) return
    const up = tmp.up.subVectors(endNode, slot)
    if (up.lengthSq() < 1e-8) up.set(0, 1, 0).applyQuaternion(physicsBody.quaternion)
    up.normalize()
    guideA.copy(slot).addScaledVector(up, 0.236)
    guideB.copy(slot).addScaledVector(up, 0.0885)
    curvePoints.length = 0
    for (let i = 0; i <= endIndex; i += 1) {
      const node = state.nodes[i]
      if (node) curvePoints.push(node)
    }
    curvePoints.push(guideA, guideB)
    curve.updateArcLengths()
    for (let i = 0; i < STRAP_SAMPLES; i += 1) curve.getPointAt(i / (STRAP_SAMPLES - 1), samples[i])
    const length = curve.getLength()
    const guideShare = 1 - guideA.distanceTo(guideB) / Math.max(length, 0.001)
    const position = strapMesh.geometry.getAttribute('position')
    const normal = strapMesh.geometry.getAttribute('normal')
    const uv = strapMesh.geometry.getAttribute('uv')
    const ropeLength = (ROPE_NODES - 1) * state.rest
    const repeats = ropeLength / (STRAP_WIDTH * STRAP_ASPECT)
    // The strap narrows a little as it is pulled longer than the rope.
    const width = STRAP_WIDTH / Math.max(1, length / Math.max(ropeLength, 0.001)) ** 0.35
    const across = PROFILE.length
    for (let i = 0; i < STRAP_SAMPLES; i += 1) {
      const p = samples[i]
      const prev = samples[Math.max(0, i - 1)]
      const next = samples[Math.min(STRAP_SAMPLES - 1, i + 1)]
      const side = acrossAt[i]
      if (!p || !prev || !next || !side) continue
      tmp.tangent.subVectors(next, prev)
      if (tmp.tangent.lengthSq() < 1e-12) tmp.tangent.set(0, -1, 0)
      tmp.tangent.normalize()
      tmp.toCamera.subVectors(camera.position, p).normalize()
      side.crossVectors(tmp.toCamera, tmp.tangent)
      if (side.lengthSq() < 1e-10) side.copy(i > 0 ? (acrossAt[i - 1] ?? tmp.fallback) : tmp.fallback)
      side.normalize()
      const previousSide = acrossAt[i - 1]
      if (i > 0 && previousSide && side.dot(previousSide) < 0) side.negate()
      // Twist the ribbon about its tangent as the card has turned, more
      // towards the card end.
      const twist = -state.twist * Math.min(1, i / (STRAP_SAMPLES - 1) / guideShare) ** 1.3
      tmp.facing.crossVectors(tmp.tangent, side)
      tmp.across.copy(side).multiplyScalar(Math.cos(twist)).addScaledVector(tmp.facing, Math.sin(twist))
      tmp.facing.crossVectors(tmp.tangent, tmp.across)
      const v = (1 - i / (STRAP_SAMPLES - 1)) * repeats
      for (let j = 0; j < across; j += 1) {
        const vertex = i * across + j
        const offset = ((PROFILE[j] ?? 0) - 0.5) * width
        const [cos, sin] = PROFILE_ANGLES[j] ?? [1, 0]
        position.setXYZ(vertex, p.x + tmp.across.x * offset, p.y + tmp.across.y * offset, p.z + tmp.across.z * offset)
        normal.setXYZ(
          vertex,
          tmp.facing.x * cos + tmp.across.x * sin,
          tmp.facing.y * cos + tmp.across.y * sin,
          tmp.facing.z * cos + tmp.across.z * sin,
        )
        uv.setXY(vertex, PROFILE[j] ?? 0, v)
      }
    }
    tmp.end.copy(tmp.across)
    position.needsUpdate = true
    normal.needsUpdate = true
    uv.needsUpdate = true
    // The clip sits at the slot, its plate across the strap's end.
    const clipAcross = tmp.across.copy(tmp.end).addScaledVector(up, -tmp.end.dot(up)).normalize()
    const clipFacing = tmp.facing.crossVectors(clipAcross, up).normalize()
    tmp.basis.makeBasis(clipAcross, up, clipFacing)
    clip.quaternion.setFromRotationMatrix(tmp.basis)
    clip.position.copy(slot)
  }

  const render = () => {
    card.position.copy(physicsBody.position)
    card.quaternion.copy(physicsBody.quaternion)
    updateStrap()
    renderer.render(scene, camera)
  }

  let wasFlipped = false
  const tick = (now: number) => {
    frame = 0
    if (!alive) return
    const dt = Math.min(1 / 30, Math.max(1 / 240, (now - lastTime) / 1000))
    lastTime = now
    step(state, dt, params)
    if (!Number.isFinite(physicsBody.position.x + physicsBody.quaternion.w)) {
      state.grab = null
      laidOut = false
      fit()
    }
    render()
    const flippedNow = isFlipped(state)
    if (flippedNow !== wasFlipped) {
      wasFlipped = flippedNow
      options.onFlip?.(flippedNow)
    }
    const settled = state.calm > 1.2 && !state.grab && params.breeze === 0
    if (visible && !settled) frame = requestAnimationFrame(tick)
  }
  const wake = () => {
    if (!frame && visible && alive) {
      state.calm = 0
      lastTime = performance.now()
      frame = requestAnimationFrame(tick)
    }
  }

  const raycaster = new Raycaster()
  const pointer = new Vector2()
  let tap: { x: number; y: number; time: number; point: Vector3 } | null = null
  let hovering = false
  const aim = (event: { clientX: number; clientY: number }) => {
    const rect = canvas.getBoundingClientRect()
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(pointer, camera)
  }
  const hitCard = () => {
    card.updateMatrixWorld()
    return raycaster.intersectObjects([bodyMesh, frontMesh, backMesh], false)[0] ?? null
  }
  const setCursor = (value: string) => {
    const root = document.documentElement
    if (root.style.cursor !== value) root.style.cursor = value
  }
  // A tap or drag that lands on the card must not also click whatever the
  // canvas overhangs.
  const swallowClick = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }
  const onPointerDown = (event: PointerEvent) => {
    if (event.button > 0 || !visible) return
    aim(event)
    const hit = hitCard()
    if (!hit) return
    state.grab = {
      local: hit.point.clone().sub(physicsBody.position).applyQuaternion(physicsBody.quaternion.clone().invert()),
      rotation: physicsBody.quaternion.clone(),
      reach: hit.distance,
      from: hit.point.clone(),
      target: hit.point.clone(),
    }
    grabOffset.copy(state.grab.local).applyQuaternion(state.grab.rotation)
    tap = { x: event.clientX, y: event.clientY, time: performance.now(), point: hit.point.clone() }
    window.addEventListener('click', swallowClick, { capture: true })
    setCursor('grabbing')
    event.preventDefault()
    wake()
  }
  const onPointerMove = (event: PointerEvent) => {
    if (!state.grab && (!visible || event.pointerType === 'touch')) return
    aim(event)
    if (state.grab) {
      if (tap && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > TAP_PX) tap = null
      const target = raycaster.ray.at(state.grab.reach, state.grab.target)
      target.y = Math.min(bounds.top + grabOffset.y, Math.max(bounds.bottom + grabOffset.y, target.y))
      wake()
      return
    }
    if (event.pointerType !== 'touch') {
      hovering = Boolean(hitCard())
      setCursor(hovering ? 'grab' : '')
    }
  }
  const onPointerUp = (event: PointerEvent) => {
    if (!state.grab) return
    state.grab = null
    if (tap && event.type === 'pointerup' && performance.now() - tap.time < TAP_MS) {
      flip(state, tap.point, camera.position)
    }
    tap = null
    window.setTimeout(() => window.removeEventListener('click', swallowClick, { capture: true }), 60)
    setCursor(hovering && event.pointerType !== 'touch' ? 'grab' : '')
    wake()
  }
  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (!visible || event.touches.length !== 1 || !touch) return
    aim(touch)
    if (hitCard()) event.preventDefault()
  }
  // On the window, not the stage: the card can hang or be pulled outside the
  // stage, and it has to be grabbable wherever it is drawn. Every handler
  // starts with a hit test, so anything that misses the card goes through.
  container.style.touchAction = 'pan-y pinch-zoom'
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
  window.addEventListener('touchstart', onTouchStart, { passive: false })

  const resize = () => {
    size.width = Math.max(1, container.clientWidth)
    size.height = Math.max(1, container.clientHeight)
    const canvasHeight = Math.round(size.height * CANVAS_SPAN)
    const budget = Math.sqrt(MAX_PIXELS / (size.width * canvasHeight))
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2, budget))
    renderer.setSize(size.width, canvasHeight, false)
    fit()
    render()
    wake()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  // The margins are the canvas's overhang: the card can be on screen while
  // the stage itself is not.
  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? true
      if (visible) wake()
    },
    { rootMargin: `${110 * OVER.bottom}% 0px ${110 * OVER.top}% 0px` },
  )
  intersection.observe(container)
  const onVisibility = () => {
    if (!document.hidden) wake()
  }
  document.addEventListener('visibilitychange', onVisibility)

  // Fonts and the two marks arrive after first paint: repaint both faces.
  const repaint = () => {
    if (!alive) return
    paintFront(frontCanvas, options.copy, assets)
    paintBack(backCanvas, options.copy, assets)
    frontMap.needsUpdate = true
    backMap.needsUpdate = true
    wake()
  }
  void document.fonts?.ready.then(repaint)
  void Promise.all([
    loadImage(options.ycMarkSrc),
    loadImage(options.koddaSrc),
    loadImage(options.portraitSrc),
  ]).then(([ycMark, kodda, portrait]) => {
    assets.ycMark = ycMark
    assets.kodda = kodda
    assets.portrait = portrait
    repaint()
  })

  resize()

  return {
    flip: () => {
      flip(state, physicsBody.position.clone().setX(physicsBody.position.x + 0.3), camera.position)
      wake()
    },
    dispose: () => {
      alive = false
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('click', swallowClick, { capture: true })
      document.documentElement.style.cursor = ''
      for (const mesh of [bodyMesh, frontMesh, backMesh, ring, strapMesh, clipPlate, clipRing]) mesh.geometry.dispose()
      for (const material of [edgeMaterial, frontMaterial, backMaterial, metal, strapMaterial]) material.dispose()
      for (const map of [frontMap, backMap, strapMap, grainNormal, weaveNormal]) map.dispose()
      environment.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    },
  }
}
