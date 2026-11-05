'use client'

import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { KEY_CODES, strokesToPath } from '@/lib/keycodes'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Statična linijska ilustracija koda (bela na lila, ili lila na crnoj).
 * `draw` = linija se iscrta kad uđe u ekran; `spin` = sporo okretanje.
 */
export default function CodeGlyph({
  code,
  className = '',
  strokeWidth = 1.2,
  draw = true,
  spin = false,
}: {
  code: string
  className?: string
  strokeWidth?: number
  draw?: boolean
  spin?: boolean
}) {
  const ref = useRef<SVGSVGElement>(null)
  const d = useMemo(() => {
    const c = KEY_CODES.find((k) => k.id === code) ?? KEY_CODES[0]
    return strokesToPath(c.strokes)
  }, [code])

  useGSAP(
    () => {
      if (!draw || prefersReducedMotion()) return
      const path = ref.current!.querySelector('path')!
      gsap.fromTo(
        path,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 3.2,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        },
      )
    },
    { scope: ref, dependencies: [d] },
  )

  return (
    <svg
      ref={ref}
      viewBox="-1.08 -1.08 2.16 2.16"
      fill="none"
      aria-hidden="true"
      className={`${spin ? 'animate-[spin_120s_linear_infinite] motion-reduce:animate-none' : ''} ${className}`}
    >
      <path
        d={d}
        pathLength={1}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
