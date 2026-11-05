'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { KEY_CODES } from '@/lib/keycodes'
import { HERO } from '@/lib/content'
import { EASE, prefersReducedMotion } from '@/lib/motion'
import { onSplashDone } from '@/lib/splash'
import { useMorphState } from '@/lib/morphBus'

gsap.registerPlugin(useGSAP)

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const morph = useMorphState()
  const formed = morph.phase === 'formed'

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ paused: true })
      onSplashDone(() => tl.play())
      tl.from('[data-line]', { yPercent: 110, duration: 1.6, ease: EASE.expo, stagger: 0.09 }).from(
        '[data-fade]',
        { autoAlpha: 0, y: 14, duration: 1.1, stagger: 0.1, ease: EASE.out },
        0.5,
      )
    },
    { scope: ref },
  )

  return (
    // data-stage="right" → glavna animacija stoji desno od teksta
    <section
      ref={ref}
      id="top"
      data-stage="right"
      data-stage-mobile="top"
      className="relative flex min-h-svh flex-col justify-end px-5 pb-16 pt-[46svh] md:px-10 lg:justify-center lg:pt-28"
    >
      <div className="relative z-10 lg:max-w-[52%]">
        <p data-fade className="t-code neon">
          [ {HERO.eyebrow} ]
        </p>
        <h1 className="t-hero mt-6 text-white">
          {HERO.title.map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.08em]">
              <span data-line className={`block ${i % 2 ? 'italic text-lilac' : ''}`}>
                {l}
              </span>
            </span>
          ))}
        </h1>
        <p data-fade className="t-body mt-8 max-w-[30rem] text-white/75">
          {HERO.text}
        </p>
        <div data-fade className="mt-9 flex flex-wrap gap-3">
          <a href="#paths" className="btn btn-lilac">
            the paths
          </a>
          <a href="#contact" className="btn btn-ghost">
            book a 1:1 activation
          </a>
        </div>
      </div>

      {/* naziv koda koji je trenutno složen */}
      <p
        aria-live="polite"
        className={`t-code absolute inset-x-0 top-[40svh] text-center text-neon/80 transition-all duration-700 ease-(--ease-soft) lg:inset-x-auto lg:top-auto lg:bottom-10 lg:right-[24%] lg:translate-x-1/2 ${formed ? 'opacity-100' : 'opacity-0'}`}
      >
        key code {String(morph.i + 1).padStart(2, '0')} · {KEY_CODES[morph.i].name}
      </p>

      <a
        href="#why"
        data-fade
        aria-label="Scroll to why we are here"
        className="t-code absolute bottom-6 left-5 hidden items-center gap-3 text-white/50 transition-colors hover:text-white md:left-10 lg:flex"
      >
        <span className="block h-px w-10 bg-current" /> scroll
      </a>
    </section>
  )
}
