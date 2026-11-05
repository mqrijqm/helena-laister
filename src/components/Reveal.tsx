'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { DUR, EASE, prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Blagi fade-up deteta označenih sa [data-reveal] kad sekcija uđe u ekran. */
export default function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  stagger = 0.08,
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section'
  stagger?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      if (!items.length) return
      gsap.set(items, { autoAlpha: 0, y: 28 })
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: DUR.slow,
            ease: EASE.expo,
            stagger,
          }),
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
