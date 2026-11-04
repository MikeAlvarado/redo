import { Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { DEFAULT_INPUT, ROPE_NODES, createBody, createState, derive, flip, isFlipped, layout, step } from './physics'

const CARD = { width: 1.6, height: 2.25, hangY: 1.165 }
const STILL = derive({ ...DEFAULT_INPUT, breeze: 0 })

function build() {
  const body = createBody(CARD.width, CARD.height, CARD.hangY)
  const state = createState(body)
  layout(state, new Vector3(0, 3, 0), 1.2)
  return { body, state }
}

describe('lanyard physics', () => {
  it('falls from above the anchor and ends up hanging below it', () => {
    const body = createBody(CARD.width, CARD.height, CARD.hangY)
    const state = createState(body)
    layout(state, new Vector3(0, 3, 0), 1.2, 'drop')
    expect(state.body.position.y).toBeGreaterThan(3)
    for (let i = 0; i < 420; i += 1) step(state, 1 / 60, STILL)
    expect(state.body.position.y).toBeLessThan(3 - 1.2 - CARD.hangY + 0.2)
    expect(Math.abs(state.body.position.x)).toBeLessThan(0.15)
  })

  it('hangs straight from the anchor at rest', () => {
    const { state } = build()
    expect(state.nodes[0]?.y).toBe(3)
    expect(state.nodes[ROPE_NODES - 1]?.y).toBeCloseTo(1.8, 5)
    expect(state.body.position.y).toBeCloseTo(1.8 - CARD.hangY, 5)
  })

  it('swings back under the anchor and settles without the cable stretching', () => {
    const { state } = build()
    // Push the card sideways and let it swing.
    state.body.position.x += 0.8
    for (let i = 0; i < 300; i += 1) step(state, 1 / 60, STILL)
    for (let i = 0; i < ROPE_NODES - 1; i += 1) {
      const a = state.nodes[i]
      const b = state.nodes[i + 1]
      if (!a || !b) throw new Error('missing node')
      expect(a.distanceTo(b)).toBeLessThanOrEqual(state.rest + 0.03)
    }
    expect(Math.abs(state.body.position.x)).toBeLessThan(0.1)
    expect(Number.isFinite(state.body.quaternion.w)).toBe(true)
  })

  it('turns half a revolution on a tap and turns back on the next', () => {
    const { state } = build()
    const viewer = new Vector3(0, 0, 10)
    const tap = new Vector3(0.3, state.body.position.y, 0)
    flip(state, tap, viewer)
    expect(isFlipped(state)).toBe(true)
    for (let i = 0; i < 300; i += 1) step(state, 1 / 60, STILL)
    expect(Math.abs(Math.abs(state.twist) - Math.PI)).toBeLessThan(0.1)
    flip(state, tap, viewer)
    expect(isFlipped(state)).toBe(false)
    for (let i = 0; i < 300; i += 1) step(state, 1 / 60, STILL)
    expect(Math.abs(state.twist)).toBeLessThan(0.1)
    flip(state, tap, viewer)
    expect(isFlipped(state)).toBe(true)
    expect(state.turn).toBeCloseTo(Math.PI * Math.sign(state.turn))
  })
})
