'use client'

import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SideCurves from '@/components/SideCurves'
import { EASE, prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP)

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap
        .timeline({ delay: 0.15 })
        .from('[data-hero-bg]', { scale: 1.08, duration: 2.4, ease: EASE.expo })
        .from('[data-hero-curves]', { autoAlpha: 0, duration: 2 }, 0.3)
        .from(
          '[data-hero-line]',
          { yPercent: 105, duration: 1.4, ease: EASE.expo, stagger: 0.1 },
          0.35,
        )
        .from('[data-hero-fade]', { autoAlpha: 0, y: 16, duration: 1, stagger: 0.08, ease: EASE.out }, 0.8)
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative h-svh min-h-[640px] overflow-hidden text-white">
      {/* Grey placeholder — ovde ide video */}
      <div data-hero-bg className="placeholder-grey-dark absolute inset-0" aria-hidden="true" />
      <div data-hero-curves className="absolute inset-0">
        <SideCurves color="#ffffff" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <p data-hero-fade className="t-eyebrow mb-8 opacity-90">
          A moment to come home
        </p>
        <h1 className="t-display">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block">Every breath</span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block">brings you back</span>
          </span>
        </h1>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <span data-hero-fade>
            <a href="#app" className="btn btn-lilac w-full sm:w-auto">
              Download App
            </a>
          </span>
          <span data-hero-fade>
            <Link href="/teacher-training" className="btn btn-ghost-light w-full sm:w-auto">
              Teacher Training
            </Link>
          </span>
        </div>
      </div>
    </section>
  )
}
