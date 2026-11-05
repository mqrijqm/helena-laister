import Reveal from '@/components/Reveal'
import CodeGlyph from '@/components/CodeGlyph'
import { CIRCLE } from '@/lib/content'

type Card = { code: string; title: string; text: string }

function FeatureCard({ c, className = '' }: { c: Card; className?: string }) {
  return (
    <article
      data-reveal
      className={`group flex min-h-[clamp(190px,13.4vw,250px)] flex-col justify-between rounded-md border border-white/60 p-4 transition-colors duration-500 hover:bg-white/15 ${className}`}
    >
      <span className="grid size-[clamp(44px,3.2vw,56px)] place-items-center rounded-full bg-ink text-lilac transition-shadow duration-500 group-hover:shadow-[0_0_24px_rgba(28,22,51,0.45)]">
        <CodeGlyph code={c.code} className="size-[62%]" strokeWidth={1} draw={false} />
      </span>
      <div className="mt-10">
        <h3 className="t-title">{c.title}</h3>
        <p className="t-small mt-2 max-w-[34ch] text-ink/80">{c.text}</p>
      </div>
    </article>
  )
}

/** Sivi mockup telefona — ovde kasnije ide screenshot članskog prostora */
function PhoneMock() {
  return (
    <div
      data-reveal
      role="img"
      aria-label="Member area preview — placeholder"
      className="relative mx-auto aspect-[9/19.4] w-[clamp(190px,14vw,270px)] rounded-[2.4rem] bg-ink p-[7px] shadow-[0_30px_60px_-30px_rgba(28,22,51,0.7)]"
    >
      <div className="placeholder-grey relative h-full w-full overflow-hidden rounded-[2rem]">
        <span className="absolute left-1/2 top-3 h-[22px] w-[34%] -translate-x-1/2 rounded-full bg-ink" />
      </div>
    </div>
  )
}

export default function Circle() {
  const all = [...CIRCLE.left, ...CIRCLE.right]
  return (
    <section id="circle" className="bg-lilac px-5 pb-[clamp(5rem,9vw,9rem)] pt-[clamp(5rem,8vw,8rem)] text-ink md:px-10">
      <Reveal className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
        <p data-reveal className="tag t-code text-ink/70">
          {CIRCLE.tag}
        </p>
        <h2 data-reveal className="t-h2 mt-6 text-white">
          {CIRCLE.title[0]}
          <br />
          <span className="italic">{CIRCLE.title[1]}</span>
        </h2>
        <p data-reveal className="t-body mt-6 max-w-[30rem] text-ink/80">
          {CIRCLE.text}
        </p>
        <div data-reveal className="mt-8">
          <a href="#contact" className="btn btn-ink">
            {CIRCLE.cta}
          </a>
        </div>
      </Reveal>

      {/* desktop: kartice "u stepenik", telefon u sredini */}
      <Reveal stagger={0.1} className="mt-[clamp(4rem,6.4vw,6rem)] hidden grid-cols-[35.5fr_29fr_35.5fr] items-center lg:grid">
        <div className="flex flex-col gap-5">
          <FeatureCard c={CIRCLE.left[0]} className="w-[64.8%] self-start" />
          <FeatureCard c={CIRCLE.left[1]} className="w-[64.8%] self-end" />
        </div>
        <PhoneMock />
        <div className="flex flex-col gap-5">
          <FeatureCard c={CIRCLE.right[0]} className="w-[64.8%] self-end" />
          <FeatureCard c={CIRCLE.right[1]} className="w-[64.8%] self-start" />
        </div>
      </Reveal>

      {/* mobilni: telefon, pa horizontalna traka kartica */}
      <Reveal className="mt-14 lg:hidden">
        <PhoneMock />
        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 md:-mx-10 md:scroll-px-10 md:px-10">
          {all.map((c) => (
            <FeatureCard key={c.title} c={c} className="w-[78vw] max-w-[340px] shrink-0 snap-start" />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
