'use client'

import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import gsap from 'gsap'
import { markSplashDone } from '@/lib/splash'
import { prefersReducedMotion } from '@/lib/motion'

const LETTERS = ['H', 'E', 'L', 'E', 'N']
const MIN_DURATION = 1800 // ms — da splash ne "trepne" na brzoj vezi

/**
 * Splash / preloader:
 * crn ekran, znak + ime u sredini, tanak krug koji se crta kao progres,
 * "[loading status]" + procenat dole. Na 100%: ime izbledi → krug se raširi
 * i nestane → ceo ekran izbledi i otkrije sajt.
 */
export default function Splash() {
  const rootRef = useRef<HTMLDivElement>(null)
  const arcRef = useRef<SVGCircleElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const [gone, setGone] = useState(false)
  const lenis = useLenis()

  // Zaključaj skrol dok traje splash
  useEffect(() => {
    if (gone) return
    lenis?.stop()
    document.documentElement.classList.add('splash-lock')
    return () => {
      lenis?.start()
      document.documentElement.classList.remove('splash-lock')
    }
  }, [lenis, gone])

  useEffect(() => {
    const root = rootRef.current!
    const reduced = prefersReducedMotion()
    const start = performance.now()

    // --- Pravi signali učitavanja: fontovi, slike, window load ---
    const tasks: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((r) => window.addEventListener('load', r, { once: true })),
      ...Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((r) => {
              img.addEventListener('load', r, { once: true })
              img.addEventListener('error', r, { once: true }) // i slika koja pukne "završava" učitavanje
            }),
        ),
    ]
    let finished = 0
    tasks.forEach((t) => t.then(() => finished++))

    // Prikazani procenat klizi ka cilju; do kraja učitavanja staje na 92
    const state = { shown: 0 }
    let raf = 0
    let exiting = false

    // Intro: znak pa slova jedno po jedno
    const intro = gsap.timeline()
    if (!reduced) {
      intro
        .from('[data-splash-icon]', { autoAlpha: 0, duration: 0.6, ease: 'power2.out' })
        .from('[data-splash-letter]', { autoAlpha: 0, duration: 0.35, stagger: 0.07, ease: 'power2.out' }, 0.25)
    }

    const render = () => {
      const elapsed = performance.now() - start
      const loadRatio = tasks.length ? finished / tasks.length : 1
      const allLoaded = finished === tasks.length
      const timeRatio = Math.min(elapsed / MIN_DURATION, 1)
      const target = allLoaded ? 100 * timeRatio : Math.min(92, 100 * Math.min(loadRatio, timeRatio) + 10 * timeRatio)

      state.shown += (target - state.shown) * 0.08
      if (allLoaded && timeRatio === 1 && target - state.shown < 0.5) state.shown = 100

      const p = Math.min(100, state.shown)
      arcRef.current?.setAttribute('stroke-dasharray', `${p.toFixed(3)} 100`)
      if (numRef.current) numRef.current.textContent = String(Math.round(p))
      root.setAttribute('aria-valuenow', String(Math.round(p)))

      if (p >= 100 && !exiting) {
        exiting = true
        exit()
        return
      }
      raf = requestAnimationFrame(render)
    }

    const exit = () => {
      if (reduced) {
        markSplashDone()
        gsap.to(root, { autoAlpha: 0, duration: 0.4, onComplete: () => setGone(true) })
        return
      }
      gsap
        .timeline({ delay: 0.25, onComplete: () => setGone(true) })
        .to('[data-splash-logo]', { autoAlpha: 0, duration: 1, ease: 'power1.inOut' })
        .to('[data-splash-ring]', { scale: 1.5, autoAlpha: 0, duration: 1.5, ease: 'power1.inOut' }, 1)
        .to('[data-splash-meta]', { autoAlpha: 0, duration: 1.5, ease: 'power1.inOut' }, 1)
        .add(() => markSplashDone(), 2.3)
        .to(root, { autoAlpha: 0, duration: 0.8, ease: 'power1.inOut' }, 2.5)
    }

    raf = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(raf)
      intro.kill()
    }
  }, [])

  if (gone) return null

  return (
    <div
      ref={rootRef}
      id="splash"
      role="progressbar"
      aria-label="Loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="fixed inset-0 z-[1000] grid place-items-center bg-black text-white select-none"
    >
      <div className="relative grid size-[min(444px,78vw,62vh)] place-items-center">
        <svg data-splash-ring viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
          {/* krug kreće sa desne strane (3 h) i crta se u smeru kazaljke */}
          <circle
            ref={arcRef}
            cx="50"
            cy="50"
            r="49.5"
            pathLength={100}
            fill="none"
            stroke="white"
            strokeWidth="0.2252"
            strokeDasharray="0 100"
            shapeRendering="geometricPrecision"
          />
        </svg>

        <div data-splash-logo className="flex items-center gap-[0.35em] font-serif text-[clamp(1.6rem,calc(min(444px,78vw,62vh)*0.085),2.4rem)] leading-none font-light tracking-[0.06em]">
          <svg data-splash-icon viewBox="0 0 40 40" fill="none" aria-hidden="true" className="size-[1.15em]">
            <ellipse cx="20" cy="20" rx="15" ry="15.6" stroke="currentColor" strokeWidth="1.4" />
            <ellipse cx="20.6" cy="19.6" rx="14.2" ry="15" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
            <ellipse cx="19.4" cy="20.4" rx="15.4" ry="14.4" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
          </svg>
          <span aria-hidden="true" className="flex">
            {LETTERS.map((l, i) => (
              <span key={i} data-splash-letter>
                {l}
              </span>
            ))}
          </span>
          <span className="sr-only">Helen</span>
        </div>
      </div>

      <div
        data-splash-meta
        className="pointer-events-none absolute inset-x-0 bottom-[max(28px,env(safe-area-inset-bottom))] flex flex-col items-center gap-0.5"
      >
        <span className="font-mono text-[14px] leading-[1.3] text-[#808080]">[loading status]</span>
        <span className="text-[16px] leading-[1.2]">
          <span ref={numRef}>0</span>%
        </span>
      </div>
    </div>
  )
}
