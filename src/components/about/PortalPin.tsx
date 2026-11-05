'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '@/lib/motion'
import { ABOUT_PAGE } from '@/lib/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Pinovana sekcija: rečenica se pojavi i nestane, pa se jedan po jedan crtaju
 * parovi reči spojeni svetlećom linijom. Iza: glavna animacija (data-stage="center").
 */
export default function PortalPin() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.set('[data-heading]', { autoAlpha: 0, y: 40 })
      gsap.set('[data-pair-end]', { autoAlpha: 0, y: 10 })
      gsap.set('[data-pair-line]', { scaleY: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=400%', pin: true, scrub: 0.8 },
      })
      tl.to('[data-heading]', { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' })
        .to({}, { duration: 1 })
        .to('[data-heading]', { autoAlpha: 0, y: -40, duration: 1, ease: 'power2.in' })

      gsap.utils.toArray<HTMLElement>('[data-pair]').forEach((p, i) => {
        const at = 3.2 + i * 0.9
        const [top, bottom] = p.querySelectorAll('[data-pair-end]')
        tl.to(top, { autoAlpha: 1, y: 0, duration: 0.4 }, at)
          .to(p.querySelector('[data-pair-line]'), { scaleY: 1, duration: 0.8 }, at + 0.2)
          .to(bottom, { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.8)
      })
      tl.to({}, { duration: 1 })
    },
    { scope: ref },
  )

  return (
    // data-stage je na omotaču: pin pomera samu sekciju, a omotač zadrži celu dužinu skrola
    <div data-stage="dim">
    <section ref={ref} className="relative h-svh overflow-hidden motion-reduce:h-auto motion-reduce:py-32">
      <div className="relative flex h-full items-center justify-center px-5 motion-reduce:flex-col motion-reduce:gap-20">
        <h2 data-heading className="t-h2 absolute max-w-[12ch] text-center text-white motion-reduce:static">
          {ABOUT_PAGE.portal}
        </h2>
        <div className="grid grid-cols-2 justify-items-center gap-10 sm:flex sm:justify-center sm:gap-x-[clamp(1.5rem,4.5vw,4.5rem)]">
          {ABOUT_PAGE.pairs.map(([a, b]) => (
            <div key={a} data-pair className="flex flex-col items-center font-serif text-[1.05rem] text-neon">
              <div data-pair-end className="flex flex-col items-center gap-3">
                <span>{a}</span>
                <span className="size-5 rounded-full border border-lilac/70 shadow-[0_0_12px_rgba(143,124,240,0.6)]" />
              </div>
              <span data-pair-line className="h-[clamp(120px,21vh,190px)] w-px origin-top bg-lilac/60 shadow-[0_0_8px_#8f7cf0]" />
              <div data-pair-end className="flex flex-col items-center gap-3">
                <span className="size-5 rounded-full border border-lilac/70 shadow-[0_0_12px_rgba(143,124,240,0.6)]" />
                <span>{b}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>
  )
}
