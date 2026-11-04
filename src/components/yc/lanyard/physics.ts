import { Quaternion, Vector3 } from 'three'

// A lanyard as a small rigid-body simulation, after the model behind
// useboom.ai/yc: a cable of five points (the first fixed at the anchor, the
// last tied to the card's slot) whose segments only pull, with a non-linear
// spring force clamped as an accumulated impulse, a rigid card with a plate's
// inertia, a pointer grab that pins a point and holds the orientation it was
// grabbed with, and a torque controller that turns the card over on a tap.

export const ROPE_NODES = 5
const SEGMENTS = ROPE_NODES - 1
const SUBSTEP = 1 / 960
const ITERATIONS = 2
const NODE_INVERSE_MASS = 20
const SLACK_DISTANCE = 0.2596

export interface RigidBody {
  position: Vector3
  previous: Vector3
  velocity: Vector3
  quaternion: Quaternion
  previousQuaternion: Quaternion
  angular: Vector3
  mass: number
  inverseInertia: Vector3
  hang: Vector3
}

export interface Grab {
  local: Vector3
  rotation: Quaternion
  reach: number
  from: Vector3
  target: Vector3
}

export interface LanyardState {
  anchor: Vector3
  nodes: Vector3[]
  previous: Vector3[]
  velocities: Vector3[]
  lengths: Float64Array
  impulses: Float64Array
  rest: number
  body: RigidBody
  grab: Grab | null
  turn: number
  twist: number
  twistRaw: number
  calm: number
  time: number
}

export interface PhysicsInput {
  // 0..3, 1 is Earth-ish for this scale
  gravity: number
  // 0..1
  damping: number
  // 0..1
  elasticity: number
  // 0..1, 0 under reduced motion
  breeze: number
}

export const DEFAULT_INPUT: PhysicsInput = { gravity: 1, damping: 0.5, elasticity: 0.5, breeze: 0.5 }

interface Derived {
  gravity: number
  hold: number
  stiffness: number
  spring: number
  bandDamping: number
  linearDrag: number
  angularDrag: number
  air: number
  broadside: number
  spinAir: number
  nodeDrag: number
  nodeAir: number
  twist: number
  twistDamping: number
  grip: number
  gripDamping: number
  breeze: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function derive(input: PhysicsInput): Derived {
  const gravity = 40 * clamp(input.gravity, 0, 3)
  const scale = Math.max(gravity, 20)
  const elasticity = clamp(input.elasticity, 0, 1)
  const damping = clamp(input.damping, 0, 1)
  return {
    gravity,
    hold: scale * lerp(2.2, 5.5, elasticity),
    stiffness: 10 * scale * 4,
    spring: scale * lerp(0.1, 0.4, elasticity) * 4,
    bandDamping: scale * lerp(0.3, 0.08, elasticity) * 4,
    linearDrag: 0.25 * 16 ** damping,
    angularDrag: 0.5 * 12 ** damping,
    air: 0.15,
    broadside: 0.5,
    spinAir: 0.03,
    nodeDrag: 2,
    nodeAir: 0.2,
    twist: 30,
    twistDamping: 3,
    grip: 40,
    gripDamping: 6,
    breeze: clamp(input.breeze, 0, 1),
  }
}

const s = {
  a: new Vector3(),
  b: new Vector3(),
  c: new Vector3(),
  d: new Vector3(),
  e: new Vector3(),
  f: new Vector3(),
  g: new Vector3(),
  pin: new Vector3(),
  q: new Quaternion(),
  r: new Quaternion(),
}

export function createBody(width: number, height: number, hangY: number): RigidBody {
  return {
    position: new Vector3(),
    previous: new Vector3(),
    velocity: new Vector3(),
    quaternion: new Quaternion(),
    previousQuaternion: new Quaternion(),
    angular: new Vector3(),
    mass: 1,
    inverseInertia: new Vector3(
      12 / (height * height + 0.001024),
      12 / (width * width + 0.001024),
      12 / (width * width + height * height),
    ),
    hang: new Vector3(0, hangY, 0),
  }
}

export function createState(body: RigidBody): LanyardState {
  const make = () => Array.from({ length: ROPE_NODES }, () => new Vector3())
  return {
    anchor: new Vector3(),
    nodes: make(),
    previous: make(),
    velocities: make(),
    lengths: new Float64Array(SEGMENTS),
    impulses: new Float64Array(SEGMENTS),
    rest: 1,
    body,
    grab: null,
    turn: 0,
    twist: 0,
    twistRaw: 0,
    calm: 0,
    time: Math.random() * 60,
  }
}

export type LayoutMode = 'rest' | 'drop'

// Rope straight down from the anchor, card hanging from its last point,
// everything still. 'drop' stacks the rope and the card above the anchor
// instead, so on load the badge falls past it and the cable catches it.
export function layout(state: LanyardState, anchor: Vector3, ropeLength: number, mode: LayoutMode = 'rest') {
  const { nodes, previous, velocities, body } = state
  state.anchor.copy(anchor)
  state.rest = ropeLength / SEGMENTS
  nodes[0]?.copy(anchor)
  for (let i = 1; i < ROPE_NODES; i += 1) {
    const node = nodes[i]
    const prev = nodes[i - 1]
    if (!node || !prev) continue
    node.copy(prev)
    if (mode === 'drop') {
      node.y += state.rest
      node.x += 0.04 * i
    } else {
      node.y -= state.rest
    }
  }
  body.quaternion.identity()
  if (mode === 'drop') body.quaternion.setFromAxisAngle(new Vector3(0, 0, 1), -0.35)
  const slot = s.a.copy(body.hang).applyQuaternion(body.quaternion)
  const last = nodes[ROPE_NODES - 1]
  if (last) body.position.copy(last).sub(slot)
  body.previous.copy(body.position)
  body.previousQuaternion.copy(body.quaternion)
  body.velocity.set(0, 0, 0)
  body.angular.set(0, 0, 0)
  for (let i = 0; i < ROPE_NODES; i += 1) {
    previous[i]?.copy(nodes[i] ?? anchor)
    velocities[i]?.set(0, 0, 0)
  }
  state.lengths.fill(state.rest)
  state.turn = 0
  state.twist = 0
  state.twistRaw = 0
  state.calm = 0
}

function rotateBy(q: Quaternion, omega: Vector3) {
  const { x, y, z, w } = q
  q.x += 0.5 * (omega.x * w + omega.y * z - omega.z * y)
  q.y += 0.5 * (omega.y * w + omega.z * x - omega.x * z)
  q.z += 0.5 * (omega.z * w + omega.x * y - omega.y * x)
  q.w += 0.5 * (-omega.x * x - omega.y * y - omega.z * z)
  q.normalize()
}

// I⁻¹ applied to a world vector: into body space, scale, back out.
function inverseInertiaTimes(body: RigidBody, v: Vector3, out: Vector3) {
  s.r.copy(body.quaternion).invert()
  out.copy(v).applyQuaternion(s.r)
  out.set(
    out.x * body.inverseInertia.x,
    out.y * body.inverseInertia.y,
    out.z * body.inverseInertia.z,
  )
  return out.applyQuaternion(body.quaternion)
}

function inverseMassAt(body: RigidBody, r: Vector3, n: Vector3) {
  const rn = s.c.crossVectors(r, n)
  return 1 / body.mass + rn.dot(inverseInertiaTimes(body, rn, s.d))
}

function applyImpulseAt(body: RigidBody, r: Vector3, j: Vector3) {
  body.position.addScaledVector(j, 1 / body.mass)
  rotateBy(body.quaternion, inverseInertiaTimes(body, s.e.crossVectors(r, j), s.f))
}

function slotWorld(body: RigidBody, out: Vector3) {
  return out.copy(body.hang).applyQuaternion(body.quaternion).add(body.position)
}

function solveSegment(state: LanyardState, index: number, h: number, p: Derived) {
  const { nodes, body } = state
  const a = nodes[index]
  if (!a) return
  const wa = index === 0 ? 0 : NODE_INVERSE_MASS
  const toBody = index === SEGMENTS - 1
  const hang = s.g
  let b = nodes[index + 1]
  if (toBody) {
    hang.copy(body.hang).applyQuaternion(body.quaternion)
    b = s.b.copy(body.position).add(hang)
  }
  if (!b) return
  const delta = s.a.subVectors(b, a)
  const dist = delta.length()
  const stretch = dist - state.rest
  if (stretch <= 0 || dist < 1e-9) return
  const n = delta.divideScalar(dist)
  const wb = toBody ? inverseMassAt(body, hang, n) : NODE_INVERSE_MASS
  const rate = (dist - (state.lengths[index] ?? dist)) / h
  // Force-based: a saturating hold, a linear spring and damping on the
  // stretch rate, turned into an impulse and clamped to what still remains.
  const allowed =
    (p.hold * Math.tanh((p.stiffness * stretch) / p.hold) + p.spring * stretch + p.bandDamping * Math.max(0, rate)) * h * h -
    (state.impulses[index] ?? 0)
  if (allowed <= 0) return
  const impulse = Math.min(stretch / (wa + wb), allowed)
  state.impulses[index] = (state.impulses[index] ?? 0) + impulse
  if (wa) a.addScaledVector(n, impulse * wa)
  if (toBody) applyImpulseAt(body, hang, n.multiplyScalar(-impulse))
  else b.addScaledVector(n, -impulse * wb)
}

function solvePin(body: RigidBody, grab: Grab, target: Vector3) {
  const r = s.g.copy(grab.local).applyQuaternion(body.quaternion)
  const delta = s.a.copy(target).sub(body.position).sub(r)
  const dist = delta.length()
  if (dist < 1e-9) return
  const n = delta.divideScalar(dist)
  const impulse = dist / inverseMassAt(body, r, n)
  applyImpulseAt(body, r, n.multiplyScalar(impulse))
}

export function step(state: LanyardState, dt: number, p: Derived) {
  const substeps = Math.max(1, Math.ceil(dt / SUBSTEP - 1e-6))
  const h = dt / substeps
  const { nodes, previous, velocities, body } = state
  state.time += dt
  const t = state.time
  const breezeX = p.breeze * (0.7 * Math.sin(0.53 * t) + 0.3 * Math.sin(1.31 * t + 1.7)) * 3
  const breezeZ = p.breeze * Math.sin(0.37 * t + 0.6) * 2
  const grab = state.grab
  const nodeDecay = Math.exp(-p.nodeDrag * h)
  const linearDecay = Math.exp(-p.linearDrag * h)
  const angularDecay = Math.exp(-p.angularDrag * h)

  for (let sub = 0; sub < substeps; sub += 1) {
    for (let i = 1; i < SEGMENTS; i += 1) {
      const v = velocities[i]
      const node = nodes[i]
      const prev = previous[i]
      if (!v || !node || !prev) continue
      v.y -= p.gravity * h
      v.x += breezeX * h
      v.z += breezeZ * h
      prev.copy(node)
      node.addScaledVector(v, h)
    }
    body.previous.copy(body.position)
    body.previousQuaternion.copy(body.quaternion)
    const q = body.quaternion
    if (grab) {
      // Hold the orientation the card had when it was grabbed.
      const error = s.q.copy(grab.rotation).multiply(s.r.copy(q).invert())
      if (error.w < 0) error.set(-error.x, -error.y, -error.z, -error.w)
      const torque = s.a.set(error.x, error.y, error.z).multiplyScalar(2 * p.grip)
      torque.addScaledVector(body.angular, -p.gripDamping)
      body.angular.addScaledVector(inverseInertiaTimes(body, torque, s.b), h)
    }
    // Yaw about the card's own up axis, measured against world Z projected
    // onto the plane the up axis is normal to, accumulated without wrapping.
    const up = s.a.set(0, 1, 0).applyQuaternion(q)
    const reference = s.b.set(-up.x * up.z, -up.y * up.z, 1 - up.z * up.z)
    if (reference.lengthSq() > 0.001) {
      const forward = s.d.set(0, 0, 1).applyQuaternion(q)
      const raw = Math.atan2(s.e.crossVectors(reference, forward).dot(up), reference.dot(forward))
      let delta = raw - state.twistRaw
      if (delta > Math.PI) delta -= 2 * Math.PI
      else if (delta < -Math.PI) delta += 2 * Math.PI
      state.twist += delta
      state.twistRaw = raw
    }
    if (!grab) {
      const yawRate = body.angular.dot(up)
      body.angular.addScaledVector(up, (p.twist * (state.turn - state.twist) - p.twistDamping * yawRate) * h)
    }
    body.velocity.y -= p.gravity * h
    body.velocity.x += 0.35 * breezeX * h
    body.velocity.z += 0.35 * breezeZ * h
    body.position.addScaledVector(body.velocity, h)
    rotateBy(q, s.f.copy(body.angular).multiplyScalar(h))
    state.impulses.fill(0)
    if (grab) s.pin.lerpVectors(grab.from, grab.target, (sub + 1) / substeps)

    for (let k = 0; k < ITERATIONS; k += 1) {
      for (let i = 0; i < SEGMENTS; i += 1) solveSegment(state, i, h, p)
      if (grab) solvePin(body, grab, s.pin)
    }

    for (let i = 1; i < SEGMENTS; i += 1) {
      const v = velocities[i]
      const node = nodes[i]
      const prev = previous[i]
      if (!v || !node || !prev) continue
      v.subVectors(node, prev).divideScalar(h).multiplyScalar(nodeDecay)
      v.multiplyScalar(1 / (1 + p.nodeAir * v.length() * h))
    }
    body.velocity.subVectors(body.position, body.previous).divideScalar(h)
    const dq = s.q.copy(body.previousQuaternion).invert().premultiply(body.quaternion)
    body.angular.set(dq.x, dq.y, dq.z).multiplyScalar((2 / h) * (dq.w < 0 ? -1 : 1))
    const normal = s.a.set(0, 0, 1).applyQuaternion(body.quaternion)
    const along = body.velocity.dot(normal)
    const across = s.b.copy(body.velocity).addScaledVector(normal, -along)
    across.multiplyScalar(1 / (1 + p.air * across.length() * h))
    body.velocity
      .copy(across)
      .addScaledVector(normal, along / (1 + p.broadside * Math.abs(along) * h))
      .multiplyScalar(linearDecay)
    body.angular.multiplyScalar(angularDecay / (1 + p.spinAir * body.angular.length() * h))
    if (body.velocity.lengthSq() > 3600) body.velocity.setLength(60)
    if (body.angular.lengthSq() > 1600) body.angular.setLength(40)
    const last = nodes[ROPE_NODES - 1]
    if (last) slotWorld(body, last)
    for (let i = 0; i < SEGMENTS; i += 1) {
      const a = nodes[i]
      const b = nodes[i + 1]
      if (a && b) state.lengths[i] = a.distanceTo(b)
    }
  }
  if (grab) grab.from.copy(grab.target)

  let energy = body.velocity.lengthSq() + 0.3 * body.angular.lengthSq()
  for (let i = 1; i < SEGMENTS; i += 1) energy += 0.05 * (velocities[i]?.lengthSq() ?? 0)
  state.calm = energy < 2e-4 ? state.calm + dt : 0
}

// A tap turns the card half a turn, pushing the side that was tapped away
// from the viewer. A tap on a turned card turns it back the way it came, so
// the badge alternates front, back, front and never winds up.
export function flip(state: LanyardState, tapPoint: Vector3, viewer: Vector3) {
  const { body } = state
  const up = s.a.set(0, 1, 0).applyQuaternion(body.quaternion)
  if (isFlipped(state)) {
    const back = state.turn > 0 ? -1 : 1
    state.turn = 0
    body.angular.addScaledVector(up, 9 * back)
    state.calm = 0
    return
  }
  const toViewer = s.c.subVectors(tapPoint, viewer).normalize()
  const direction = s.b.subVectors(tapPoint, body.position).cross(toViewer).dot(up) < 0 ? -1 : 1
  state.turn = Math.PI * direction
  body.angular.addScaledVector(up, 9 * direction)
  state.calm = 0
}

export function isFlipped(state: LanyardState) {
  return Math.round(state.turn / Math.PI) % 2 !== 0
}

// Index of the last rope node that is not already inside the slot's reach,
// so the strap curve ends cleanly instead of folding onto the clip.
export function strapEndIndex(state: LanyardState) {
  const slot = state.nodes[ROPE_NODES - 1]
  if (!slot) return SEGMENTS - 1
  let index = SEGMENTS - 1
  while (index > 0 && (state.nodes[index]?.distanceTo(slot) ?? Infinity) < SLACK_DISTANCE) index -= 1
  return index
}

export { SLACK_DISTANCE }
