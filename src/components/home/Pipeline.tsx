'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/* Putanja kruga — viewBox 375 × 1376. Kreće gore desno, širi se ulevo,
   pa udesno, pa se smiruje ka dnu. */
const VB = { w: 375, h: 1376 }
const PATH =
  'M240 2 C150 62 12 128 6 240 C-2 404 362 356 369 520 C374 652 272 690 246 810 C204 1010 258 1290 262 1374'

/* progress = na kojoj visini krive (0–1) stoji tačka; side = gde ide tekst */
const STEPS = [
  {
    progress: 0.25,
    side: 'left',
    title: 'Stress → Rest',
    copy: 'Slow, rhythmic breathing guides the body out of fight-or-flight and into repair.',
  },
  {
    progress: 0.45,
    side: 'right',
    title: 'CO₂ Tolerance',
    copy: 'A steadier relationship with CO₂ quiets panic signals and evens out reactivity.',
  },
  {
    progress: 0.65,
    side: 'left',
    title: 'Heart-Rate Variability',
    copy: 'Higher HRV is linked with calmer moods and quicker recovery from stress.',
  },
  {
    progress: 0.85,
    side: 'right',
    title: 'Vagal Tone',
    copy: 'Long exhales stimulate the vagus nerve — the body’s own brake pedal.',
  },
] as const

const VISIBILITY_BUFFER = 0.015

export default function Pipeline() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current!
      const reduced = prefersReducedMotion()
      const mm = gsap.matchMedia()

      /* ---------------- Desktop: kriva + tačke ---------------- */
      mm.add('(min-width: 1024px)', () => {
        const wrapper = section.querySelector<HTMLElement>('[data-timeline]')!
        const svg = wrapper.querySelector('svg')!
        const path = svg.querySelector<SVGPathElement>('[data-path]')!
        const maskRect = svg.querySelector<SVGRectElement>('[data-mask]')!
        const items = gsap.utils.toArray<HTMLElement>('[data-step]', wrapper)
        const total = path.getTotalLength()

        // Za svaku tačku nađi mesto na krivoj gde je y = progress × visina.
        // Tako se tačka upali tačno kad maska (koja raste odozgo) stigne do nje.
        const samples = Array.from({ length: 600 }, (_, i) => path.getPointAtLength((total * i) / 599))
        const pointAtY = (y: number) => samples.find((p) => p.y >= y) ?? samples[samples.length - 1]

        const position = () => {
          const w = svg.getBoundingClientRect().width
          const h = svg.getBoundingClientRect().height
          items.forEach((el) => {
            const p = pointAtY(Number(el.dataset.progress) * VB.h)
            el.style.left = `${(p.x / VB.w) * w}px`
            el.style.top = `${(p.y / VB.h) * h}px`
          })
        }
        position()

        const apply = (progress: number) => {
          maskRect.setAttribute('height', String(VB.h * progress))
          let order = 0
          items.forEach((el) => {
            const raw = Number(el.dataset.progress)
            const shouldShow = progress >= raw - VISIBILITY_BUFFER
            if (shouldShow && !el.classList.contains('is-visible')) {
              el.style.transitionDelay = `${order++ * 0.08}s`
              el.classList.add('is-visible')
            } else if (!shouldShow && el.classList.contains('is-visible')) {
              el.style.transitionDelay = '0s'
              el.classList.remove('is-visible')
            }
          })
        }

        if (reduced) {
          apply(1)
          return
        }

        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top 85%', // linija kreće kad vrh sekcije pređe 85% ekrana
          end: () => `+=${section.offsetHeight + window.innerHeight * 0.2}`,
          onUpdate: (self) => apply(self.progress),
          onRefresh: (self) => {
            position()
            apply(self.progress)
          },
        })
        return () => st.kill()
      })

      /* ---------------- Mobilni: prava linija levo ---------------- */
      mm.add('(max-width: 1023px)', () => {
        const line = section.querySelector<HTMLElement>('[data-mobile-line]')!
        const steps = gsap.utils.toArray<HTMLElement>('[data-mobile-step]', section)
        if (reduced) {
          gsap.set(line, { scaleY: 1 })
          return
        }
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: line.parentElement, start: 'top 70%', end: 'bottom 60%', scrub: true },
          },
        )
        steps.forEach((s) =>
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
    <section
      ref={sectionRef}
      className="placeholder-grey-dark relative overflow-hidden text-white lg:min-h-[125vw]"
    >
      <div className="relative px-5 pb-24 pt-24 md:px-7 lg:pb-0 lg:pt-[8vw]">
        <div className="md:ml-[50%] md:max-w-[48vw]">
          <h2 className="t-h2">How breath reshapes the nervous system</h2>
          <p className="t-body mt-5 max-w-[28rem] text-white/85">
            The way you breathe sets the tone for stress, energy and emotional balance. Here is
            what changes inside.
          </p>
        </div>

        {/* Desktop */}
        <div
          data-timeline
          className="relative mx-auto mt-10 hidden w-[min(375px,26vw)] lg:block"
          style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
        >
          <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            fill="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="pipeline-stroke" x1="0" y1="0" x2="0" y2={VB.h} gradientUnits="userSpaceOnUse">
                <stop stopColor="white" stopOpacity="0" />
                <stop offset="0.12" stopColor="white" />
                <stop offset="0.88" stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <mask id="pipeline-mask" maskUnits="userSpaceOnUse" x="-20" y="0" width={VB.w + 40} height={VB.h}>
                <rect data-mask x="-20" y="0" width={VB.w + 40} height="0" fill="white" />
              </mask>
            </defs>
            {/* bleda "senka" cele putanje da se nasluti kuda ide */}
            <path d={PATH} stroke="white" strokeOpacity="0.12" strokeWidth="1" />
            <path
              data-path
              d={PATH}
              stroke="url(#pipeline-stroke)"
              strokeWidth="1.5"
              strokeLinecap="round"
              mask="url(#pipeline-mask)"
            />
          </svg>

          <ol className="absolute inset-0">
            {STEPS.map((s) => (
              <li key={s.title} data-step data-progress={s.progress} data-side={s.side} className="timeline-item">
                <span className="timeline-dot" />
                <div className="timeline-panel">
                  <h3 className="t-title">{s.title}</h3>
                  <p className="t-small mt-2 max-w-[22rem] text-white/85">{s.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Mobilni */}
        <div className="relative mt-14 lg:hidden">
          <span className="absolute bottom-0 left-[5px] top-0 w-px bg-white/15" aria-hidden="true" />
          <span
            data-mobile-line
            className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-white"
            aria-hidden="true"
          />
          <ol className="space-y-14">
            {STEPS.map((s) => (
              <li key={s.title} data-mobile-step className="relative pl-9">
                <span className="absolute left-0 top-1.5 size-[11px] rounded-full bg-white" />
                <h3 className="t-title">{s.title}</h3>
                <p className="t-small mt-2 max-w-[20rem] text-white/85">{s.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
