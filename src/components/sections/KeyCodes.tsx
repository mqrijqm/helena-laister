'use client'

import Reveal from '@/components/Reveal'
import { KEY_CODES } from '@/lib/keycodes'
import { CODES, MANIFEST } from '@/lib/content'
import { morphBus, useMorphState } from '@/lib/morphBus'

const PHASE_LABEL = { formed: '· active', chaos: '· searching', forming: '· forming', unraveling: '· releasing' } as const

export default function KeyCodes() {
  const state = useMorphState()
  const code = KEY_CODES[state.i]
  const shown = state.phase === 'formed'

  return (
    <>
      {/* data-stage="left" → glavna animacija prelazi levo, tekst je desno */}
      <section id="codes" data-stage="left" data-stage-mobile="top" className="relative px-5 py-[clamp(6rem,10vw,9rem)] md:px-10">
        <div className="grid min-h-[80svh] items-center lg:grid-cols-2">
          {/* desktop: prazna leva kolona = pozornica; mobilni: prazan prostor iznad teksta */}
          <div aria-hidden="true" className="h-[48svh] lg:h-auto" />

          <div>
            <Reveal>
              <p data-reveal className="t-code neon">
                [ high-frequency symbols ]
              </p>
              <h2 data-reveal className="t-h2 mt-5 text-white">
                {CODES.title}
              </h2>
              <p data-reveal className="t-body mt-6 max-w-[30rem] text-white/75">
                {CODES.text}
              </p>
            </Reveal>

            <div className="mt-12 min-h-[11rem] border-t border-lilac/25 pt-6" aria-live="polite">
              <p className="t-code text-lilac/60">
                {String(state.i + 1).padStart(2, '0')} / {String(KEY_CODES.length).padStart(2, '0')}
                <span className="ml-3 text-neon/60">{PHASE_LABEL[state.phase]}</span>
              </p>
              <h3
                className={`t-h3 neon mt-4 transition-all duration-700 ease-(--ease-soft) ${shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-3 opacity-0 blur-sm'}`}
              >
                {code.name}
              </h3>
              <p
                className={`t-body mt-3 max-w-[28rem] text-white/75 transition-all delay-150 duration-700 ease-(--ease-soft) ${shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
              >
                {code.line}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Choose a key code">
              {KEY_CODES.map((k, i) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => morphBus.goTo(i)}
                  aria-pressed={state.i === i}
                  aria-label={k.name}
                  className={`t-code grid size-11 place-items-center rounded-full border transition-all duration-500 ${
                    state.i === i
                      ? 'border-lilac bg-lilac text-ink shadow-[0_0_24px_rgba(194,190,240,0.55)]'
                      : 'border-lilac/30 text-lilac/70 hover:border-lilac hover:text-neon'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* manifest — njen format: belo na crnom, veliki serif; animacija se prigušuje */}
      <section data-stage="dim" className="px-5 py-[clamp(6rem,12vw,11rem)] text-center md:px-10">
        <Reveal stagger={0.18}>
          {MANIFEST.map((l) => (
            <p key={l} data-reveal className="t-hero text-white">
              {l}
            </p>
          ))}
        </Reveal>
      </section>
    </>
  )
}
