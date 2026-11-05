'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { KEY_CODES, strokesToPath } from '@/lib/keycodes'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Statična linijska ilustracija koda (bela na lila, ili lila na crnoj).
 * Svaki potez je zaseban <path> → `draw` ih iscrtava jedan za drugim kad uđu u ekran.
 * (Jedan path sa više delova bi u Chrome-u ostao isprekidan zbog crtkanja po delovima.)
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
  // debljina linije u jedinicama viewBox-a, tako da na ekranu bude `strokeWidth` px
  const [userStroke, setUserStroke] = useState(0.01)
  useEffect(() => {
    const el = ref.current!
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width || 1
      setUserStroke((strokeWidth * 2.16) / w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [strokeWidth])
  const paths = useMemo(() => {
    const c = KEY_CODES.find((k) => k.id === code) ?? KEY_CODES[0]
    return c.strokes.map((s) => strokesToPath([s]))
  }, [code])

  useGSAP(
    () => {
      if (!draw || prefersReducedMotion()) return
      const els = ref.current!.querySelectorAll('path')
      gsap.fromTo(
        els,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: 'power2.inOut',
          stagger: { each: 0.12, from: 'start' },
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        },
      )
    },
    { scope: ref, dependencies: [paths] },
  )

  return (
    <svg
      ref={ref}
      viewBox="-1.08 -1.08 2.16 2.16"
      fill="none"
      aria-hidden="true"
      className={`${spin ? 'animate-[spin_120s_linear_infinite] motion-reduce:animate-none' : ''} ${className}`}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={userStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
