'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import KeyCodeMorph, { type MorphApi } from './KeyCodeMorph'
import { morphBus } from '@/lib/morphBus'
import { KEY_CODES } from '@/lib/keycodes'
import { prefersReducedMotion } from '@/lib/motion'

/**
 * GLAVNA animacija sajta — jedna jedina.
 * Fiksirana iza sadržaja (lila sekcije je prekrivaju, crne je otkrivaju).
 * Sekcije sa `data-stage="right|left|center|dim|hide"` kažu gde da stoji,
 * a opcioni `data-code="merkaba"` koji kod da složi kad se sekcija aktivira.
 */
type Preset = { x: number; y: number; opacity: number; scale: number }
const DESKTOP: Record<string, Preset> = {
  right: { x: 24, y: 0, opacity: 1, scale: 1 },
  left: { x: -24, y: 0, opacity: 1, scale: 1 },
  center: { x: 0, y: 0, opacity: 0.55, scale: 1.1 },
  dim: { x: 0, y: 0, opacity: 0.22, scale: 1.15 },
  hide: { x: 0, y: 0, opacity: 0, scale: 0.9 },
}
// Na mobilnom nema mesta "pored" teksta: ili gore iznad teksta, ili prigušeno iza.
const MOBILE: Record<string, Preset> = {
  top: { x: 0, y: -24, opacity: 0.9, scale: 0.78 },
  right: { x: 0, y: 0, opacity: 0.2, scale: 1 },
  left: { x: 0, y: 0, opacity: 0.2, scale: 1 },
  center: { x: 0, y: 0, opacity: 0.4, scale: 1 },
  dim: { x: 0, y: 0, opacity: 0.16, scale: 1.1 },
  hide: { x: 0, y: 0, opacity: 0, scale: 0.9 },
}

export default function MorphStage() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<MorphApi | null>(null)
  const pathname = usePathname()

  // registruj goTo na magistrali
  useEffect(() => {
    morphBus.register({ goTo: (i) => apiRef.current?.goTo(i) })
    return () => morphBus.register(null)
  }, [])

  // na svakoj stranici: pronađi sekcije i poveži ih sa pozornicom
  useEffect(() => {
    const wrap = wrapRef.current!
    const reduced = prefersReducedMotion()

    const apply = (el: HTMLElement) => {
      const mobile = window.innerWidth < 1024
      const key = mobile ? (el.dataset.stageMobile ?? el.dataset.stage) : el.dataset.stage
      const p = (mobile ? MOBILE : DESKTOP)[key ?? 'dim'] ?? DESKTOP.dim
      gsap.to(wrap, {
        xPercent: p.x,
        yPercent: p.y,
        autoAlpha: p.opacity,
        scale: p.scale,
        duration: reduced ? 0 : 1.6,
        ease: 'power3.inOut',
        overwrite: true,
      })
      const code = el.dataset.code
      if (code) {
        const i = KEY_CODES.findIndex((k) => k.id === code)
        if (i >= 0) morphBus.goTo(i)
      }
    }

    // Koja [data-stage] sekcija je na sredini ekrana? (čita se uživo, pa pin i
    // naknadno učitan sadržaj ne mogu da poremete pozicije)
    let current: HTMLElement | null = null
    const check = () => {
      const mid = window.innerHeight * 0.5
      const els = document.querySelectorAll<HTMLElement>('[data-stage]')
      for (const el of els) {
        const r = el.getBoundingClientRect()
        if (r.top <= mid && r.bottom >= mid) {
          if (el !== current) {
            current = el
            apply(el)
          }
          return
        }
      }
      // sredina je na lila sekciji (nema data-stage) → pozornica ostaje gde je
    }

    const id = requestAnimationFrame(() => {
      check()
      if (!current) {
        const first = document.querySelector<HTMLElement>('[data-stage]')
        if (first) {
          current = first
          apply(first)
        }
      }
    })
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [pathname])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[5] h-lvh w-screen opacity-0"
    >
      <KeyCodeMorph
        chaos={2.4}
        hold={4}
        scale={0.34}
        apiRef={apiRef}
        onPhase={(i, phase) => morphBus.set({ i, phase })}
      />
    </div>
  )
}
