'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SideCurves from '@/components/SideCurves'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const PAIRS = [
  ['Creativity', 'Groundedness'],
  ['Spaciousness', 'Energy'],
  ['Connection', 'Calm'],
  ['Clarity', 'Self-Healing'],
] as const

/**
 * Pinovana sekcija: naslov se pojavi i nestane, pa se jedan po jedan
 * crtaju parovi reči spojeni linijom. Sve vezano za skrol (scrub).
 */
export default function PortalPin() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const pairs = gsap.utils.toArray<HTMLElement>('[data-pair]')

      gsap.set('[data-heading]', { autoAlpha: 0, y: 40 })
      gsap.set('[data-pair-end]', { autoAlpha: 0, y: 10 })
      gsap.set('[data-pair-line]', { scaleY: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 0.8,
        },
      })

      tl.to('[data-heading]', { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' })
        .to({}, { duration: 1 }) // zadrži naslov
        .to('[data-heading]', { autoAlpha: 0, y: -40, duration: 1, ease: 'power2.in' })

      pairs.forEach((p, i) => {
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
    <section
      ref={ref}
      className="relative h-svh overflow-hidden bg-paper text-ink motion-reduce:h-auto motion-reduce:py-32"
    >
      <SideCurves color="#29272e" className="opacity-80" />

      <div className="relative flex h-full items-center justify-center px-5 motion-reduce:flex-col motion-reduce:gap-20">
        <h2
          data-heading
          className="t-h2 absolute max-w-[12ch] text-center motion-reduce:static"
        >
          We believe breath is a doorway into
        </h2>

        <div className="grid grid-cols-2 justify-items-center gap-x-10 gap-y-10 sm:flex sm:justify-center sm:gap-x-[clamp(1.5rem,4.5vw,4.5rem)]">
          {PAIRS.map(([a, b]) => (
            <div key={a} data-pair className="flex flex-col items-center font-serif text-[0.95rem] text-ink/70">
              <div data-pair-end className="flex flex-col items-center gap-3">
                <span>{a}</span>
                <span className="size-5 rounded-full border border-ink/50" />
              </div>
              <span
                data-pair-line
                className="h-[clamp(120px,21vh,190px)] w-px origin-top bg-ink/35"
              />
              <div data-pair-end className="flex flex-col items-center gap-3">
                <span className="size-5 rounded-full border border-ink/50" />
                <span>{b}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
