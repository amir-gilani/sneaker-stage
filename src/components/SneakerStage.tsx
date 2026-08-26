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
const EXIT_MS = 640
const OVERSHOOT = 0.27
/** Fraction of the entry spent flying in; the rest is the spring settle. */
const SETTLE_FROM = 0.55
/** Leftward nudge of the entry arc, as a fraction of the viewport width. */
const ARC_SHIFT_X = -0.2
/** How far the exit arc bows sideways off its straight line, as a fraction of
 *  the viewport width. Purely horizontal on purpose: bowing the control point
 *  *back* along the path is what holds the shoe high and then drops it all at
 *  once, which is the nose-dive. A sideways bow curves the exit without
 *  touching how evenly it loses height. */
const EXIT_BOW_X = -0.34
/** Shape of the corner diagonal the shoe travels along. */
const DIAG_X = 0.62
const DIAG_Y = 0.72
/** Clear the edge by this much more than the shoe's own half-span. */
const OFFSCREEN_PAD = 32
/** Size the shoe travels at, so it reads as distance rather than a shrink. */
const FLY_SCALE = 0.88

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

    // How far along the diagonal the shoe has to travel to be fully past the
    // edge of the screen. Measured from where the shoe actually rests rather
    // than assumed to be centred, and cleared by its half-diagonal because
    // the rotation on the way out swings the corners wider than the box.
    const rect = shoeRef.current?.getBoundingClientRect()
    const halfSpan = rect ? Math.hypot(rect.width, rect.height) / 2 : Math.min(w, h) * 0.4
    const cx = rect ? rect.left + rect.width / 2 : w / 2
    const cy = rect ? rect.top + rect.height / 2 : h / 2

    // Take the larger requirement on each axis so the same distance clears
    // the edge whichever way the colourway is stepped, then the smaller of
    // the two axes — clearing either one already puts the shoe out of sight.
    const reach = (centre: number, extent: number, shape: number) =>
      (Math.max(centre, extent - centre) + halfSpan + OFFSCREEN_PAD) / shape
    const travel = Math.min(reach(cx, w, DIAG_X), reach(cy, h, DIAG_Y))

    // Forward: in from top-right, out to bottom-left. Backward mirrors both.
    const inFrom = { x: dir * DIAG_X * travel, y: dir * -DIAG_Y * travel }
    const outTo = { x: dir * -DIAG_X * travel, y: dir * DIAG_Y * travel }

    // Control points sit further out along the corner diagonal than the
    // straight-line midpoint, which is what bends the path into an arc.
    // ARC_SHIFT_X nudges the incoming arc leftwards in screen space (not
    // mirrored by direction), so the shoe swings back in a little left of
    // centre whichever way the colourway is stepped.
    const inCtrl = {
      x: inFrom.x * 0.72 + w * 0.16 * dir + ARC_SHIFT_X * w,
      y: inFrom.y * 0.78 - h * 0.14 * dir,
    }
    // The two exits are shaped differently on purpose.
    //
    // Forward, the shoe leaves down and to the left: chord midpoint bowed
    // sideways, which swings it out past the social row on its way off the
    // bottom-left corner. Sitting the control at the chord's own height is
    // what keeps the descent even — the original weights put it a seventh of
    // the way down while x was already two fifths across, so the shoe hung
    // and then fell off a cliff.
    //
    // Backward, it leaves up and to the right, and keeps the original arc.
    // The sideways bow is screen-space, not mirrored, so applying it to this
    // one would drag it left — across the frame it is trying to leave.
    const outCtrl =
      dir === 1
        ? { x: outTo.x * 0.5 + EXIT_BOW_X * w, y: outTo.y * 0.5 }
        : { x: outTo.x * 0.42 - w * 0.14 * dir, y: outTo.y * 0.34 - h * 0.18 * dir }

    const enterRot = dir * 22
    // shallower tip on the way out — a hard pitch-over on top of the fall was
    // the other half of what read as a dive
    const exitRot = dir === 1 ? -16 : 30

    // starts at full size and fully opaque — it is off the edge of the screen,
    // so there is nothing to hide, and it flies in rather than growing in
    apply(shoeRef.current, { ...inFrom, rot: enterRot, scale: FLY_SCALE, opacity: 1 })
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
        scale = FLY_SCALE + (1 - FLY_SCALE) * easeOutCubic(te / SETTLE_FROM)
      } else {
        const ts = (te - SETTLE_FROM) / (1 - SETTLE_FROM)
        scale = springOvershoot(ts, OVERSHOOT)
      }
      const frame: Frame = { x, y, rot, scale, opacity: 1 }
      apply(shoeRef.current, frame)
      apply(shadowRef.current, { x, y: y * 0.35, rot: 0, scale: 0.7 + 0.3 * p, opacity: p }, true)

      // --- exit (shorter, ease-in) ---
      const tx = Math.min(elapsed / EXIT_MS, 1)
      const q = easeInCubic(tx)
      const ox = qbez(q, 0, outCtrl.x, outTo.x)
      const oy = qbez(q, 0, outCtrl.y, outTo.y)
      // it leaves at very nearly full size and full opacity: the slide clips
      // its own overflow, so the shoe genuinely exits past the edge instead of
      // shrinking and dissolving somewhere over the middle of the screen
      apply(outShoeRef.current, {
        x: ox,
        y: oy,
        rot: exitRot * q,
        scale: 1 - (1 - FLY_SCALE) * q,
        opacity: 1,
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
