'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP)

/* 4–7–9 disanje: širine ćelija = sekunde, pa svetlo koje putuje linearno pokazuje pravo vreme. */
const PHASES = [
  { label: 'Inhale', seconds: 4 },
  { label: 'Hold', seconds: 7 },
  { label: 'Exhale', seconds: 9 },
]
const TOTAL = PHASES.reduce((s, p) => s + p.seconds, 0)

export default function BreathBar() {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const state = { t: 0 }
      gsap.to(state, {
        t: TOTAL,
        duration: TOTAL,
        ease: 'none',
        repeat: -1,
        onUpdate: () => {
          gsap.set('[data-fill]', { width: `${(state.t / TOTAL) * 100}%` })
          let acc = 0
          // na samom kraju kruga (t === TOTAL) findIndex vrati -1 → ostani na poslednjoj fazi
          const found = PHASES.findIndex((p) => (acc += p.seconds) > state.t)
          const idx = found === -1 ? PHASES.length - 1 : found
          setPhase((prev) => (prev === idx ? prev : idx))
        },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="w-[min(92vw,756px)] text-white">
      <div className="t-code flex text-lilac/80">
        {PHASES.map((p) => (
          <div key={p.label} style={{ flex: p.seconds }} className="flex items-center gap-2 whitespace-nowrap pb-3">
            <span className="size-1.5 rounded-full bg-neon shadow-[0_0_8px_#8f7cf0]" />
            {p.seconds}s
          </div>
        ))}
      </div>
      <div className="relative flex h-[clamp(84px,8.5vw,122px)] overflow-hidden rounded-sm border border-lilac/40 bg-void/30 backdrop-blur-sm">
        <div
          data-fill
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-[linear-gradient(90deg,transparent_0%,rgb(143_124_240/0.08)_55%,rgb(194_190_240/0.55)_100%)]"
        />
        {PHASES.map((p, i) => (
          <div
            key={p.label}
            style={{ flex: p.seconds }}
            className={`t-code relative border-lilac/40 p-4 transition-opacity duration-500 ${i > 0 ? 'border-l' : ''} ${phase === i ? 'opacity-100' : 'opacity-50'}`}
          >
            {p.label}
            {p.label === 'Exhale' && (
              <div className="absolute inset-y-0 left-[30%] right-0 flex justify-between" aria-hidden="true">
                {[0, 1, 2, 3].map((d) => (
                  <span key={d} className="h-full border-l border-dashed border-lilac/40" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {PHASES[phase].label}
      </p>
    </div>
  )
}
