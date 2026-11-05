'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Sivi placeholder preko cele širine koji se "otvara" dok ulazi u ekran. */
export default function WideImage({ label = 'Image placeholder' }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '[data-img]',
        { clipPath: 'inset(12% 16% 12% 16% round 999px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 95%', end: 'top 10%', scrub: true } },
      )
      gsap.fromTo(
        '[data-img-inner]',
        { scale: 1.18 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    },
    { scope: ref },
  )

  return (
    <div ref={ref} data-stage="hide" className="h-[90svh] min-h-[420px]">
      <div data-img className="h-full w-full overflow-hidden" role="img" aria-label={label}>
        <div data-img-inner className="placeholder-grey h-full w-full" />
      </div>
    </div>
  )
}
