'use client'

import { useEffect, useRef } from 'react'
import { KEY_CODES, sampleStrokes, type Sampled } from '@/lib/keycodes'

export type MorphPhase = 'chaos' | 'forming' | 'formed' | 'unraveling'
export type MorphApi = { goTo: (index: number) => void }

type Props = {
  /** koliko dugo linija "luta" pre nego što se složi u kod (s) */
  chaos?: number
  /** koliko dugo kod stoji složen (s) */
  hold?: number
  /** veličina forme u odnosu na manju stranicu platna */
  scale?: number
  className?: string
  onPhase?: (index: number, phase: MorphPhase) => void
  apiRef?: React.RefObject<MorphApi | null>
  /** kojim redom se pojavljuju kodovi */
  startIndex?: number
}

/* Boje (RGB) — blago neon lila */
const GLOW = '143,124,240'
const MID = '194,190,240'
const CORE = '246,244,255'

const FORM = 1.9
const UNRAVEL = 1.7

const sampleCache = new Map<number, Sampled[]>()
function targetsFor(n: number) {
  if (!sampleCache.has(n)) sampleCache.set(n, KEY_CODES.map((c) => sampleStrokes(c.strokes, n)))
  return sampleCache.get(n)!
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function KeyCodeMorph({
  chaos = 2.6,
  hold = 3.6,
  scale = 0.42,
  className = '',
  onPhase,
  apiRef,
  startIndex = 0,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onPhaseRef = useRef(onPhase)
  useEffect(() => {
    onPhaseRef.current = onPhase
  }, [onPhase])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const weak = (navigator.hardwareConcurrency ?? 8) <= 4

    let w = 0
    let h = 0
    let R = 0
    let n = 0
    let targets: Sampled[] = []
    let delay = new Float32Array(0)
    let glow: CanvasGradient | null = null

    // stanje mašine
    let idx = startIndex % KEY_CODES.length
    let phase: MorphPhase = reduce ? 'formed' : 'chaos'
    let phaseT = 0
    let M = reduce ? 1 : 0 // koliko je kod "složen" (0..1)
    let queued: number | null = null
    let T = Math.random() * 100 // globalno vreme za haos
    let raf = 0
    let last = 0
    let visible = true

    const emit = () => onPhaseRef.current?.(idx, phase)
    let fromM = M // od koje "složenosti" kreće nova faza (bez skokova)
    const setPhase = (p: MorphPhase) => {
      phase = p
      phaseT = 0
      fromM = M
      emit()
    }

    // bucket-i providnosti → malo stroke() poziva po frejmu
    const buckets = [new Path2D(), new Path2D(), new Path2D()]
    const bucketAlpha = [0.3, 0.62, 1]

    const draw = (dt: number) => {
      const tgt = targets[idx]
      const cx = w / 2
      const cy = h / 2

      // tragovi: briši delimično umesto clearRect
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = `rgba(0,0,0,${reduce ? 1 : Math.min(1, 0.3 * dt)})`
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      // meki sjaj iza složenog koda
      if (glow && M > 0.01) {
        ctx.globalAlpha = 0.22 * M
        ctx.fillStyle = glow
        ctx.fillRect(cx - R * 1.4, cy - R * 1.4, R * 2.8, R * 2.8)
        ctx.globalAlpha = 1
      }

      for (let b = 0; b < 3; b++) buckets[b] = new Path2D()

      // frekvencije haosa polako "plivaju" → oblik se stalno menja
      const f1 = 3 + 1.3 * Math.sin(T * 0.05)
      const f2 = 5 + 2.2 * Math.sin(T * 0.037 + 1)
      const g1 = 2 + 1.1 * Math.sin(T * 0.043 + 2)
      const g2 = 7 + 2.6 * Math.sin(T * 0.029 + 0.5)
      const breathe = 0.9 + 0.08 * Math.sin(T * 0.6)
      const jitter = phase === 'formed' ? 0.004 : 0.012

      let px = 0
      let py = 0
      let pm = 0
      const maxLink = R * 0.55

      for (let i = 0; i < n; i++) {
        const u = i / n
        const th = u * Math.PI * 2
        const chx =
          (0.62 * Math.sin(f1 * th + T * 0.31) + 0.3 * Math.sin(f2 * th - T * 0.23 + 1.3)) * breathe +
          jitter * Math.sin(i * 12.9898 + T * 3.1)
        const chy =
          (0.62 * Math.cos(g1 * th + T * 0.27) + 0.3 * Math.sin(g2 * th + T * 0.19)) * breathe +
          jitter * Math.cos(i * 78.233 + T * 2.7)

        // svaka čestica kreće sa malim zakašnjenjem → kod se "skuplja", ne skače
        const m = easeInOut(clamp01(M * 1.35 - delay[i]))
        const x = cx + (chx + (tgt.x[i] - chx) * m) * R
        const y = cy + (chy + (tgt.y[i] - chy) * m) * R

        if (i > 0) {
          const same = tgt.stroke[i] === tgt.stroke[i - 1]
          let a = same ? 1 : 1 - Math.min(m, pm)
          const d = Math.hypot(x - px, y - py)
          if (d > maxLink) a = 0
          if (a > 0.12) {
            const b = a > 0.75 ? 2 : a > 0.42 ? 1 : 0
            buckets[b].moveTo(px, py)
            buckets[b].lineTo(x, y)
          }
        }
        px = x
        py = y
        pm = m
      }

      const lw = Math.max(0.8, R / 260)
      for (let b = 0; b < 3; b++) {
        const a = bucketAlpha[b]
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = `rgba(${GLOW},${0.07 * a})`
        ctx.lineWidth = lw * 9
        ctx.stroke(buckets[b])
        ctx.strokeStyle = `rgba(${MID},${0.32 * a})`
        ctx.lineWidth = lw * 3
        ctx.stroke(buckets[b])
        ctx.strokeStyle = `rgba(${CORE},${0.9 * a})`
        ctx.lineWidth = lw
        ctx.stroke(buckets[b])
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const step = (dt: number) => {
      const sec = dt / 60
      T += sec
      phaseT += sec
      if (phase === 'chaos') {
        M = 0
        if (phaseT >= chaos) setPhase('forming')
      } else if (phase === 'forming') {
        M = fromM + (1 - fromM) * clamp01(phaseT / FORM)
        if (M >= 1) setPhase('formed')
      } else if (phase === 'formed') {
        M = 1
        if (phaseT >= hold || queued !== null) setPhase('unraveling')
      } else {
        M = fromM * clamp01(1 - phaseT / UNRAVEL)
        if (M <= 0) {
          idx = queued ?? (idx + 1) % KEY_CODES.length
          // ako je korisnik izabrao kod, preskoči haos i odmah ga sklapaj
          if (queued !== null) {
            queued = null
            setPhase('forming')
          } else setPhase('chaos')
        }
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, weak ? 1 : 1.5)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      R = Math.min(w, h) * scale

      const nextN = weak || w < 640 ? 260 : 420
      if (nextN !== n) {
        n = nextN
        targets = targetsFor(n)
        delay = new Float32Array(n)
        for (let i = 0; i < n; i++) delay[i] = ((Math.sin(i * 91.3458) * 47453.5453) % 1 + 1) % 1 * 0.35
      }

      glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, R * 1.4)
      glow.addColorStop(0, `rgba(${GLOW},0.55)`)
      glow.addColorStop(1, `rgba(${GLOW},0)`)

      ctx.clearRect(0, 0, w, h)
      draw(1)
    }

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 16.667, 3)
      last = t
      step(dt)
      draw(dt)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (raf || !visible || reduce) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    if (apiRef) {
      apiRef.current = {
        goTo: (i: number) => {
          const target = ((i % KEY_CODES.length) + KEY_CODES.length) % KEY_CODES.length
          if (reduce) {
            idx = target
            emit()
            ctx.clearRect(0, 0, w, h)
            draw(1)
            return
          }
          if (target === idx && (phase === 'formed' || phase === 'forming')) return
          if (phase === 'chaos') {
            idx = target
            setPhase('forming')
          } else {
            queued = target
            if (phase === 'forming') setPhase('unraveling')
          }
        },
      }
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)
    emit()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      if (apiRef) apiRef.current = null
    }
  }, [chaos, hold, scale, startIndex, apiRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
