'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP)

/* 4–7–9 disanje: širine ćelija su proporcionalne sekundama,
   pa svetlo koje putuje linearno kroz traku pokazuje pravo vreme. */
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
          const idx = PHASES.findIndex((p) => (acc += p.seconds) > state.t)
          setPhase((prev) => (prev === idx ? prev : idx))
        },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="w-[min(92vw,756px)] text-white">
      {/* oznake iznad */}
      <div className="flex text-[0.82rem]">
        {PHASES.map((p) => (
          <div key={p.label} style={{ flex: p.seconds }} className="flex items-center gap-2 whitespace-nowrap pb-3">
            <span className="size-2 rounded-full bg-white/60" />
            {p.seconds}
            <span className="sm:hidden">s</span>
            <span className="hidden sm:inline">seconds</span>
          </div>
        ))}
      </div>

      <div className="relative flex h-[clamp(84px,8.5vw,122px)] overflow-hidden border border-white/45">
        {/* svetlo koje putuje */}
        <div
          data-fill
          className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-[linear-gradient(90deg,transparent_0%,rgb(255_255_255/0.06)_60%,rgb(194_190_240/0.45)_100%)]"
          aria-hidden="true"
        />
        {PHASES.map((p, i) => (
          <div
            key={p.label}
            style={{ flex: p.seconds }}
            className={`relative border-white/45 p-4 text-[0.82rem] transition-opacity duration-500 ${i > 0 ? 'border-l' : ''} ${phase === i ? 'opacity-100' : 'opacity-60'}`}
          >
            {p.label}
            {p.label === 'Exhale' && (
              <div className="absolute inset-y-0 left-[30%] right-0 flex justify-between" aria-hidden="true">
                {[0, 1, 2, 3].map((d) => (
                  <span key={d} className="h-full border-l border-dashed border-white/50" />
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
