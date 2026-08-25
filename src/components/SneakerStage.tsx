import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Product } from '../data/products'
import SneakerPhoto from './SneakerPhoto'
import '../styles/stage.css'

export type Direction = 1 | -1 // 1 = forward, -1 = backward

interface Props {
  products: Product[]
  index: number
  direction: Direction
  onTransitionEnd: () => void
}

const ENTER_MS = 900
const EXIT_MS = 520
const OVERSHOOT = 0.27
/** Fraction of the entry spent flying in; the rest is the spring settle. */
const SETTLE_FROM = 0.55
/** Leftward nudge of the entry arc, as a fraction of the viewport width. */
const ARC_SHIFT_X = -0.2

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInCubic = (t: number) => t * t * t

function springOvershoot(t: number, overshoot: number) {
  // t in [0,1], 0 at start of settle phase, 1 at end
  const c4 = (2 * Math.PI) / 3
  const decay = Math.pow(2, -8 * t)
  return 1 + decay * Math.sin((t * 8 - 0.75) * c4) * overshoot
}

/** Quadratic bezier on one axis. */
const qbez = (t: number, p0: number, p1: number, p2: number) => {
  const u = 1 - t
  return u * u * p0 + 2 * u * t * p1 + t * t * p2
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Frame {
  x: number
  y: number
  rot: number
  scale: number
  opacity: number
}

const apply = (el: HTMLElement | null, f: Frame, shadow = false) => {
  if (!el) return
  el.style.transform = `translate3d(${f.x}px, ${f.y}px, 0) rotate(${f.rot}deg) scale(${f.scale})`
  el.style.opacity = String(shadow ? f.opacity * 0.55 : f.opacity)
}

export default function SneakerStage({ products, index, direction, onTransitionEnd }: Props) {
  const [pair, setPair] = useState<{ cur: number; out: number | null }>({ cur: index, out: null })
  const shoeRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const outShoeRef = useRef<HTMLDivElement>(null)
  const outShadowRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const dirRef = useRef<Direction>(direction)
  dirRef.current = direction

  // Pick up a new selection: stash the previous shoe as the outgoing layer.
  useEffect(() => {
    if (index === pair.cur) return
    if (prefersReducedMotion()) {
      setPair({ cur: index, out: null })
      onTransitionEnd()
      return
    }
    setPair((p) => ({ cur: index, out: p.cur }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // Run one manual rAF loop per transition.
  useLayoutEffect(() => {
    if (pair.out === null) return

    const dir = dirRef.current
    const w = window.innerWidth
    const h = window.innerHeight
    // Forward: in from top-right, out to bottom-left. Backward mirrors both.
    const inFrom = { x: dir * w * 0.62, y: dir * -h * 0.72 }
    const outTo = { x: dir * -w * 0.62, y: dir * h * 0.72 }

    // Control points sit further out along the corner diagonal than the
    // straight-line midpoint, which is what bends the path into an arc.
    // ARC_SHIFT_X nudges the incoming arc leftwards in screen space (not
    // mirrored by direction), so the shoe swings back in a little left of
    // centre whichever way the colourway is stepped.
    const inCtrl = {
      x: inFrom.x * 0.72 + w * 0.16 * dir + ARC_SHIFT_X * w,
      y: inFrom.y * 0.78 - h * 0.14 * dir,
    }
    const outCtrl = { x: outTo.x * 0.42 - w * 0.14 * dir, y: outTo.y * 0.34 - h * 0.18 * dir }

    const enterRot = dir * 22
    const exitRot = dir * -30

    apply(shoeRef.current, { ...inFrom, rot: enterRot, scale: 0, opacity: 0 })
    apply(shadowRef.current, { ...inFrom, rot: 0, scale: 0.2, opacity: 0 }, true)
    apply(outShoeRef.current, { x: 0, y: 0, rot: 0, scale: 1, opacity: 1 })
    apply(outShadowRef.current, { x: 0, y: 0, rot: 0, scale: 1, opacity: 1 }, true)

    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start

      // --- entry ---
      const te = Math.min(elapsed / ENTER_MS, 1)
      const p = easeOutCubic(te)
      const x = qbez(p, inFrom.x, inCtrl.x, 0)
      const y = qbez(p, inFrom.y, inCtrl.y, 0)
      const rot = enterRot * (1 - p)
      let scale: number
      if (te < SETTLE_FROM) {
        scale = easeOutCubic(te / SETTLE_FROM)
      } else {
        const ts = (te - SETTLE_FROM) / (1 - SETTLE_FROM)
        scale = springOvershoot(ts, OVERSHOOT)
      }
      // with no shoe over it the halo reads as a bare white blob, so it dips
      // out on the swap and comes back up as the new shoe settles in
      if (glowRef.current) glowRef.current.style.opacity = String(0.15 + 0.85 * p)

      const frame: Frame = { x, y, rot, scale, opacity: Math.min(1, te * 4) }
      apply(shoeRef.current, frame)
      apply(shadowRef.current, { x, y: y * 0.35, rot: 0, scale: 0.7 + 0.3 * p, opacity: p }, true)

      // --- exit (shorter, ease-in) ---
      const tx = Math.min(elapsed / EXIT_MS, 1)
      const q = easeInCubic(tx)
      const ox = qbez(q, 0, outCtrl.x, outTo.x)
      const oy = qbez(q, 0, outCtrl.y, outTo.y)
      apply(outShoeRef.current, {
        x: ox,
        y: oy,
        rot: exitRot * q,
        scale: 1 - 0.65 * q,
        opacity: 1 - q,
      })
      apply(
        outShadowRef.current,
        { x: ox, y: oy * 0.35, rot: 0, scale: 1 - 0.5 * q, opacity: 1 - q },
        true,
      )

      if (te < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        apply(shoeRef.current, { x: 0, y: 0, rot: 0, scale: 1, opacity: 1 })
        apply(shadowRef.current, { x: 0, y: 0, rot: 0, scale: 1, opacity: 1 }, true)
        if (glowRef.current) glowRef.current.style.opacity = '1'
        setPair((prev) => ({ cur: prev.cur, out: null }))
        onTransitionEnd()
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair.out, pair.cur])

  const current = products[pair.cur]
  const outgoing = pair.out === null ? null : products[pair.out]

  return (
    <div className="stage">
      <div className="stage__glow" ref={glowRef} aria-hidden="true" />

      {outgoing && (
        <>
          <div className="stage__shadow" ref={outShadowRef} />
          <div className="stage__shoe" ref={outShoeRef}>
            <SneakerPhoto name={outgoing.name} tint={outgoing.tint} className="stage__photo" />
          </div>
        </>
      )}
      <div className="stage__shadow" ref={shadowRef} />
      <div className="stage__shoe" ref={shoeRef} key={current.id}>
        <SneakerPhoto name={current.name} tint={current.tint} className="stage__photo" />
      </div>
    </div>
  )
}
