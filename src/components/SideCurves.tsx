'use client'

import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '@/lib/motion'

/**
 * Tanke krive linije sa obe strane ekrana koje polako "dišu".
 * Svaka linija je kubna Bezier kriva; kontrolne tačke se pomeraju po sinusu.
 * Animacija radi samo dok je komponenta na ekranu (IntersectionObserver).
 */
const LINES = [
  { phase: 0.0, amp: 1.0, speed: 0.22, opacity: 0.95, width: 1.1 },
  { phase: 1.7, amp: 0.8, speed: 0.17, opacity: 0.75, width: 0.9 },
  { phase: 3.1, amp: 1.2, speed: 0.13, opacity: 0.45, width: 0.8 },
  { phase: 4.4, amp: 0.6, speed: 0.19, opacity: 0.3, width: 0.7 },
]

// viewBox: 0..200 (širina jedne strane) × 0..1000 (visina)
function curve(t: number, l: (typeof LINES)[number]) {
  const s = Math.sin(t * l.speed + l.phase)
  const c = Math.cos(t * l.speed * 0.8 + l.phase * 1.3)
  const topX = 150 + s * 22 * l.amp
  const botX = 155 + c * 26 * l.amp
  const c1x = 10 + c * 40 * l.amp
  const c1y = 260 + s * 60
  const c2x = 0 + s * 45 * l.amp
  const c2y = 700 + c * 70
  return `M${topX} 40 C ${c1x} ${c1y}, ${c2x} ${c2y}, ${botX} 960`
}

export default function SideCurves({
  color = 'currentColor',
  className = '',
}: {
  color?: string
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathsRef = useRef<SVGPathElement[]>([])
  const uid = useId().replace(/:/g, '')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const paths = pathsRef.current
    const draw = (t: number) =>
      paths.forEach((p, i) => p?.setAttribute('d', curve(t, LINES[i % LINES.length])))

    draw(0)
    if (prefersReducedMotion()) return

    let visible = false
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(root)
    const tick = (time: number) => {
      if (visible) draw(time)
    }
    gsap.ticker.add(tick)
    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
    }
  }, [])

  const side = (mirror: boolean) => (
    <svg
      viewBox="0 0 200 1000"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className={`h-full w-[clamp(90px,15vw,240px)] ${mirror ? '-scale-x-100' : ''}`}
    >
      <defs>
        <linearGradient id={`${uid}-${mirror ? 'r' : 'l'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0" />
          <stop offset="0.3" stopColor={color} />
          <stop offset="0.7" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {LINES.map((l, i) => (
        <path
          key={i}
          ref={(el) => {
            if (el) pathsRef.current[(mirror ? LINES.length : 0) + i] = el
          }}
          stroke={`url(#${uid}-${mirror ? 'r' : 'l'})`}
          strokeWidth={l.width}
          opacity={l.opacity}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )

  return (
    <div
      ref={rootRef}
      className={`pointer-events-none absolute inset-0 flex justify-between py-[4vh] ${className}`}
    >
      {side(false)}
      {side(true)}
    </div>
  )
}
