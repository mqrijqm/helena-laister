'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import KeyCodeMorph, { type MorphPhase } from '@/components/KeyCodeMorph'
import { KEY_CODES } from '@/lib/keycodes'
import { HERO } from '@/lib/content'
import { EASE, prefersReducedMotion } from '@/lib/motion'
import { onSplashDone } from '@/lib/splash'

gsap.registerPlugin(useGSAP)

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [label, setLabel] = useState<{ i: number; on: boolean }>({ i: 0, on: false })

  const onPhase = (i: number, p: MorphPhase) =>
    setLabel((prev) => {
      const on = p === 'formed'
      return prev.i === i && prev.on === on ? prev : { i, on }
    })

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ paused: true })
      onSplashDone(() => tl.play())
      tl.from('[data-line]', { yPercent: 110, duration: 1.6, ease: EASE.expo, stagger: 0.09 })
        .from('[data-fade]', { autoAlpha: 0, y: 14, duration: 1.1, stagger: 0.1, ease: EASE.out }, 0.5)
        .from('[data-morph]', { autoAlpha: 0, scale: 0.92, duration: 2.4, ease: EASE.out }, 0)
    },
    { scope: ref },
  )

  const code = KEY_CODES[label.i]

  return (
    <section ref={ref} id="top" className="relative grid min-h-svh items-center overflow-hidden px-5 pb-16 pt-28 md:px-10 lg:grid-cols-[1.05fr_1fr]">
      {/* tekst */}
      <div className="relative z-10">
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

      {/* kod koji se sklapa i raspliće */}
      <div
        data-morph
        className="pointer-events-none absolute inset-0 opacity-60 lg:pointer-events-auto lg:relative lg:inset-auto lg:h-[min(86svh,820px)] lg:opacity-100"
      >
        <KeyCodeMorph chaos={3.4} hold={3.2} scale={0.4} onPhase={onPhase} />
        <p
          aria-live="polite"
          className={`t-code absolute inset-x-0 bottom-6 text-center text-neon/80 transition-all duration-700 ease-(--ease-soft) ${label.on ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
        >
          key code {String(label.i + 1).padStart(2, '0')} · {code.name}
        </p>
      </div>

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
