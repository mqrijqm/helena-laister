'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { EASE, prefersReducedMotion } from '@/lib/motion'
import { onSplashDone } from '@/lib/splash'

gsap.registerPlugin(useGSAP)

/** Hero preko celog ekrana: sivi placeholder (budući video) + naslov u velikim slovima. */
export default function PageHero({
  lines,
  text,
  children,
}: {
  lines: string[]
  text?: string
  children?: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ paused: true })
      onSplashDone(() => tl.play())
      tl
        .from('[data-bg]', { scale: 1.08, duration: 2.4, ease: EASE.expo })
        .from('[data-line]', { yPercent: 105, duration: 1.4, ease: EASE.expo, stagger: 0.1 }, 0.3)
        .from('[data-fade]', { autoAlpha: 0, y: 16, duration: 1, stagger: 0.1, ease: EASE.out }, 0.8)
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative h-svh min-h-[640px] overflow-hidden text-white">
      <div data-bg className="placeholder-grey-dark absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <h1 className="t-display">
          {lines.map((l) => (
            <span key={l} className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block">
                {l}
              </span>
            </span>
          ))}
        </h1>
        {text && (
          <p data-fade className="t-small mt-7 max-w-[26rem] text-white/90">
            {text}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}
