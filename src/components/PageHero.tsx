'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { EASE, prefersReducedMotion } from '@/lib/motion'
import { onSplashDone } from '@/lib/splash'

gsap.registerPlugin(useGSAP)

/** Hero preko celog ekrana na crnoj galaksiji; glavna animacija iza (data-stage). */
export default function PageHero({
  eyebrow,
  lines,
  text,
  stage = 'dim',
  code,
  children,
}: {
  eyebrow?: string
  lines: string[]
  text?: string
  stage?: string
  code?: string
  children?: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ paused: true })
      onSplashDone(() => tl.play())
      tl.from('[data-line]', { yPercent: 110, duration: 1.5, ease: EASE.expo, stagger: 0.09 }).from(
        '[data-fade]',
        { autoAlpha: 0, y: 16, duration: 1, stagger: 0.1, ease: EASE.out },
        0.6,
      )
    },
    { scope: ref },
  )

  return (
    <section ref={ref} data-stage={stage} data-code={code} className="relative h-svh min-h-[640px] overflow-hidden">
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        {eyebrow && (
          <p data-fade className="t-code neon mb-7">
            [ {eyebrow} ]
          </p>
        )}
        <h1 className="t-hero text-white">
          {lines.map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.08em]">
              <span data-line className={`block ${i % 2 ? 'italic text-lilac' : ''}`}>
                {l}
              </span>
            </span>
          ))}
        </h1>
        {text && (
          <p data-fade className="t-body mt-8 max-w-[28rem] text-white/75">
            {text}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}
