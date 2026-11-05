'use client'

import Image from 'next/image'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Slika preko cele širine koja se "otvara" iz ovala dok ulazi u ekran (bez src → sivi placeholder). */
export default function WideImage({ src, label = 'Image placeholder' }: { src?: string; label?: string }) {
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
      <div data-img className="relative h-full w-full overflow-hidden bg-void">
        <div data-img-inner className={`relative h-full w-full ${src ? '' : 'placeholder-grey'}`} role={src ? undefined : 'img'} aria-label={src ? undefined : label}>
          {src && <Image src={src} alt={label} fill sizes="100vw" className="object-cover object-[45%_55%]" />}
        </div>
      </div>
    </div>
  )
}
