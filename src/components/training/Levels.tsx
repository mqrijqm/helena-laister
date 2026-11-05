'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLenis } from 'lenis/react'
import Reveal from '@/components/Reveal'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const LEVELS = [
  {
    numeral: 'I',
    statement: 'Learn to hold space, work with breath as medicine and meet your own inner healer.',
    info: [
      ['Dates', 'Feb 6 – 8'],
      ['Format', 'Three weekly live calls, Mondays at 7pm'],
      ['Prerequisites', 'None'],
      ['Duration', 'One-month foundation program'],
    ],
    overview:
      'Level I is an immersive introduction to breathwork, energy and trauma-aware facilitation. Whether you are new to the practice or already guiding others, you will build the knowledge and embodied skill to lead safe one-to-one sessions — understanding the physiology of breath, your own frequency, and how to stay grounded while holding someone else.',
  },
  {
    numeral: 'II',
    statement: 'Guide transformational group journeys with clarity, confidence and care.',
    info: [
      ['Dates', 'May 8 – 10'],
      ['Format', 'Hybrid'],
      ['Prerequisites', 'Level I'],
      ['Duration', 'One-month advanced program'],
    ],
    overview:
      'Level II bridges personal practice and professional facilitation. You will learn to read a room, build a musical arc for a session, work with intense emotional release in a group, and design journeys that feel safe, alive and deeply held from the first breath to the last.',
  },
  {
    numeral: 'III',
    statement: 'Explore the subtle science of breath — where consciousness, healing and the unseen meet.',
    info: [
      ['Dates', 'To be announced'],
      ['Format', 'Hybrid'],
      ['Prerequisites', 'Levels I & II'],
      ['Duration', 'One-month mastery intensive'],
    ],
    overview:
      'Level III is the mastery path. We go beyond technique into lineage, energetics and the quiet art of presence — refining your voice as a facilitator and your capacity to hold expanded states with integrity.',
  },
] as const

export default function Levels() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [switcherVisible, setSwitcherVisible] = useState(true)
  const lenis = useLenis()

  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>('[data-level]')
      sections.forEach((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setActive(i),
        }),
      )
      // Prekidač nivoa je vidljiv od vrha stranice do kraja poslednjeg nivoa
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 0,
        end: 'bottom 92%',
        onToggle: (self) => setSwitcherVisible(self.isActive),
      })
    },
    { scope: rootRef },
  )

  const goTo = (i: number) => {
    const el = rootRef.current?.querySelectorAll<HTMLElement>('[data-level]')[i]
    if (el) lenis?.scrollTo(el, { duration: 1.4 })
  }

  return (
    <div ref={rootRef}>
      <Reveal className="border-b border-line px-5 py-10 text-center md:px-7">
        <h2 data-reveal className="t-h3">
          Explore the Levels
        </h2>
      </Reveal>

      {LEVELS.map((lvl, i) => (
        <section
          key={lvl.numeral}
          data-level
          id={`level-${i + 1}`}
          className="grid border-b border-line md:min-h-[111vh] md:grid-cols-2"
        >
          {/* Levo: lepljiv naslov nivoa */}
          <div>
            <div className="flex items-center gap-[clamp(1.5rem,3vw,3rem)] border-b border-line px-5 py-6 font-serif text-[clamp(2.2rem,3.2vw,3.4rem)] font-light leading-none md:sticky md:top-0 md:px-7">
              <span className="w-[2.2em]">( {lvl.numeral} )</span>
              <span>Level</span>
            </div>
          </div>

          {/* Desno: detalji */}
          <Reveal className="px-5 pb-16 pt-8 md:border-l md:border-line md:px-7 md:pt-6">
            <p data-reveal className="t-lead max-w-[22ch] md:max-w-[24ch]">
              {lvl.statement}
            </p>

            <dl data-reveal className="mt-10 grid grid-cols-2 gap-x-6 gap-y-9">
              {lvl.info.map(([k, v]) => (
                <div key={k}>
                  <dt className="t-small text-ink/60">{k}</dt>
                  <dd className="t-small mt-1">{v}</dd>
                </div>
              ))}
            </dl>

            <div data-reveal className="mt-12 max-w-[35rem]">
              <p className="t-small text-ink/60">Overview</p>
              <p className="t-body mt-3 text-ink/85">{lvl.overview}</p>
            </div>

            <div data-reveal className="mt-9">
              <Link href="/studio" className="btn btn-lilac">
                Explore Level
              </Link>
            </div>
          </Reveal>
        </section>
      ))}

      {/* Fiksni prekidač nivoa dole */}
      <nav
        aria-label="Levels"
        className={`fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 gap-1.5 transition-all duration-700 ease-(--ease-soft) ${switcherVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
      >
        {LEVELS.map((lvl, i) => (
          <button
            key={lvl.numeral}
            type="button"
            onClick={() => goTo(i)}
            aria-current={active === i ? 'true' : undefined}
            className={`flex h-12 items-center justify-between gap-3 whitespace-nowrap rounded-md border px-2.5 font-serif text-[0.85rem] sm:min-w-[6.9rem] sm:gap-6 sm:px-3 sm:text-[0.92rem] backdrop-blur-md transition-colors duration-500 ${
              active === i
                ? 'border-lilac-deep bg-lilac text-ink'
                : 'border-line bg-beige-soft/90 text-ink/70 hover:bg-white'
            }`}
          >
            <span>( {lvl.numeral} )</span>
            <span>Level</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
