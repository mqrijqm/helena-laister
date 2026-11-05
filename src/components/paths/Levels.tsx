'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLenis } from 'lenis/react'
import Reveal from '@/components/Reveal'
import { PATHS_PAGE } from '@/lib/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const LEVELS = PATHS_PAGE.levels

/**
 * Stari "teacher training" UX: levo lepljiv naslov nivoa, desno detalji,
 * dole fiksni prekidač koji pokazuje aktivni nivo i skroluje do njega.
 * Prazna leva kolona je pozornica: glavna animacija tu složi kod tog puta (data-code).
 */
export default function Levels() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [switcherVisible, setSwitcherVisible] = useState(true)
  const lenis = useLenis()

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-level]').forEach((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setActive(i),
        }),
      )
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
      {LEVELS.map((lvl, i) => (
        <section
          key={lvl.numeral}
          id={`level-${i + 1}`}
          data-level
          data-stage="left"
          data-code={lvl.code}
          className="grid border-t border-lilac/20 md:min-h-[111vh] md:grid-cols-2"
        >
          {/* levo: lepljiv naslov (ispod njega pozornica za kod) */}
          <div>
            <div className="flex items-baseline gap-[clamp(1.5rem,3vw,3rem)] border-b border-lilac/20 bg-void/40 px-5 py-6 backdrop-blur-sm md:sticky md:top-0 md:px-10">
              <span className="w-[2.6em] font-serif text-[clamp(2.2rem,3.2vw,3.4rem)] font-light leading-none text-lilac">
                ( {lvl.numeral} )
              </span>
              <span className="font-serif text-[clamp(2.2rem,3.2vw,3.4rem)] font-light leading-none text-white">
                {lvl.name}
              </span>
            </div>
          </div>

          {/* desno: detalji */}
          <Reveal className="bg-void/30 px-5 pb-16 pt-8 md:border-l md:border-lilac/20 md:px-10 md:pt-7">
            <p data-reveal className="t-lead max-w-[24ch] text-white">
              {lvl.statement}
            </p>
            <dl data-reveal className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
              {lvl.info.map(([k, v]) => (
                <div key={k}>
                  <dt className="t-code text-lilac/60">{k}</dt>
                  <dd className="t-small mt-2 text-white/90">{v}</dd>
                </div>
              ))}
            </dl>
            <div data-reveal className="mt-12 max-w-[35rem]">
              <p className="t-code text-lilac/60">Overview</p>
              <p className="t-body mt-3 text-white/75">{lvl.overview}</p>
            </div>
            <div data-reveal className="mt-10">
              <Link href="/sessions" className="btn btn-lilac">
                {lvl.cta}
              </Link>
            </div>
          </Reveal>
        </section>
      ))}

      {/* fiksni prekidač */}
      <nav
        aria-label="Paths"
        className={`fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 gap-1.5 transition-all duration-700 ease-(--ease-soft) ${switcherVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
      >
        {LEVELS.map((lvl, i) => (
          <button
            key={lvl.numeral}
            type="button"
            onClick={() => goTo(i)}
            aria-current={active === i ? 'true' : undefined}
            aria-label={lvl.name}
            className={`t-code flex h-11 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 backdrop-blur-md transition-all duration-500 sm:px-4 ${
              active === i
                ? 'border-lilac bg-lilac text-ink shadow-[0_0_24px_rgba(194,190,240,0.5)]'
                : 'border-lilac/25 bg-void/60 text-lilac/80 hover:border-lilac'
            }`}
          >
            ( {lvl.numeral} )<span className="hidden sm:inline">{lvl.name}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
