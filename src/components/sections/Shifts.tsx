'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '@/lib/motion'
import { SHIFTS } from '@/lib/content'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/* Stari "pipeline": kriva se crta skrolom, tačke i tekst se pale kad linija stigne do njih. */
const VB = { w: 375, h: 1376 }
const PATH =
  'M240 2 C150 62 12 128 6 240 C-2 404 362 356 369 520 C374 652 272 690 246 810 C204 1010 258 1290 262 1374'
const PROGRESS = [0.25, 0.45, 0.65, 0.85]
const SIDES = ['left', 'right', 'left', 'right'] as const

export default function Shifts() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current!
      const reduced = prefersReducedMotion()
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const wrapper = section.querySelector<HTMLElement>('[data-timeline]')!
        const svg = wrapper.querySelector('svg')!
        const path = svg.querySelector<SVGPathElement>('[data-path]')!
        const maskRect = svg.querySelector<SVGRectElement>('[data-mask]')!
        const items = gsap.utils.toArray<HTMLElement>('[data-step]', wrapper)
        const total = path.getTotalLength()
        const samples = Array.from({ length: 600 }, (_, i) => path.getPointAtLength((total * i) / 599))
        const pointAtY = (y: number) => samples.find((p) => p.y >= y) ?? samples[samples.length - 1]

        const position = () => {
          const r = svg.getBoundingClientRect()
          items.forEach((el) => {
            const p = pointAtY(Number(el.dataset.progress) * VB.h)
            el.style.left = `${(p.x / VB.w) * r.width}px`
            el.style.top = `${(p.y / VB.h) * r.height}px`
          })
        }
        position()

        const apply = (progress: number) => {
          maskRect.setAttribute('height', String(VB.h * progress))
          let order = 0
          items.forEach((el) => {
            const show = progress >= Number(el.dataset.progress) - 0.015
            if (show && !el.classList.contains('is-visible')) {
              el.style.transitionDelay = `${order++ * 0.08}s`
              el.classList.add('is-visible')
            } else if (!show && el.classList.contains('is-visible')) {
              el.style.transitionDelay = '0s'
              el.classList.remove('is-visible')
            }
          })
        }
        if (reduced) return apply(1)

        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top 85%',
          end: () => `+=${section.offsetHeight + window.innerHeight * 0.2}`,
          onUpdate: (self) => apply(self.progress),
          onRefresh: (self) => {
            position()
            apply(self.progress)
          },
        })
        return () => st.kill()
      })

      mm.add('(max-width: 1023px)', () => {
        const line = section.querySelector<HTMLElement>('[data-mobile-line]')!
        if (reduced) return void gsap.set(line, { scaleY: 1 })
        gsap.fromTo(
          line,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: line.parentElement, start: 'top 70%', end: 'bottom 60%', scrub: true } },
        )
        gsap.utils.toArray<HTMLElement>('[data-mobile-step]', section).forEach((s) =>
          gsap.from(s, {
            autoAlpha: 0,
            y: 24,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: s, start: 'top 75%', toggleActions: 'play none none reverse' },
          }),
        )
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} data-stage="hide" className="relative overflow-hidden text-white lg:min-h-[125vw]">
      <div className="relative px-5 pb-24 pt-24 md:px-10 lg:pb-0 lg:pt-[8vw]">
        <div className="md:ml-[50%] md:max-w-[46vw]">
          <p className="t-code neon">[ integration ]</p>
          <h2 className="t-h2 mt-5">{SHIFTS.title}</h2>
          <p className="t-body mt-5 max-w-[28rem] text-white/75">{SHIFTS.text}</p>
        </div>

        {/* desktop: kriva */}
        <div
          data-timeline
          className="relative mx-auto mt-10 hidden w-[min(375px,26vw)] lg:block"
          style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
        >
          <svg viewBox={`0 0 ${VB.w} ${VB.h}`} fill="none" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="shift-stroke" x1="0" y1="0" x2="0" y2={VB.h} gradientUnits="userSpaceOnUse">
                <stop stopColor="#dcd6ff" stopOpacity="0" />
                <stop offset="0.12" stopColor="#dcd6ff" />
                <stop offset="0.88" stopColor="#dcd6ff" />
                <stop offset="1" stopColor="#dcd6ff" stopOpacity="0" />
              </linearGradient>
              <mask id="shift-mask" maskUnits="userSpaceOnUse" x="-20" y="0" width={VB.w + 40} height={VB.h}>
                <rect data-mask x="-20" y="0" width={VB.w + 40} height="0" fill="white" />
              </mask>
            </defs>
            <path d={PATH} stroke="#c2bef0" strokeOpacity="0.14" strokeWidth="1" />
            {/* neon: širok mutan sloj + tanko jezgro */}
            <g mask="url(#shift-mask)">
              <path d={PATH} stroke="#8f7cf0" strokeOpacity="0.35" strokeWidth="7" strokeLinecap="round" />
              <path data-path d={PATH} stroke="url(#shift-stroke)" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </svg>
          <ol className="absolute inset-0">
            {SHIFTS.steps.map((s, i) => (
              <li key={s.title} data-step data-progress={PROGRESS[i]} data-side={SIDES[i]} className="timeline-item">
                <span className="timeline-dot" />
                <div className="timeline-panel">
                  <p className="t-code text-lilac/60">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="t-title mt-2">{s.title}</h3>
                  <p className="t-small mt-2 max-w-[22rem] text-white/75">{s.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* mobilni: prava linija */}
        <div className="relative mt-14 lg:hidden">
          <span className="absolute bottom-0 left-[5px] top-0 w-px bg-lilac/20" aria-hidden="true" />
          <span data-mobile-line className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-neon shadow-[0_0_10px_#8f7cf0]" aria-hidden="true" />
          <ol className="space-y-14">
            {SHIFTS.steps.map((s) => (
              <li key={s.title} data-mobile-step className="relative pl-9">
                <span className="absolute left-0 top-1.5 size-[11px] rounded-full bg-neon shadow-[0_0_12px_#8f7cf0]" />
                <h3 className="t-title">{s.title}</h3>
                <p className="t-small mt-2 max-w-[20rem] text-white/75">{s.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
