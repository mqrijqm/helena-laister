import Reveal from '@/components/Reveal'

/* ---- Ikonice (originalne, linijske) ---- */
const icons = {
  wave: (
    <path
      d="M5 13c1.6-6 3.2-6 4.8 0s3.2 6 4.8 0 3.2-6 4.4-1"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  ),
  sun: (
    <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2
        const r1 = 4.6
        const r2 = i % 2 ? 7.2 : 8.4
        return (
          <line
            key={i}
            x1={12 + Math.cos(a) * r1}
            y1={12 + Math.sin(a) * r1}
            x2={12 + Math.cos(a) * r2}
            y2={12 + Math.sin(a) * r2}
          />
        )
      })}
    </g>
  ),
  rings: (
    <g stroke="currentColor" strokeWidth="1.4">
      <circle cx="9.5" cy="12" r="5" />
      <circle cx="14.5" cy="12" r="5" />
    </g>
  ),
  growth: (
    <path
      d="M5 5v14h14M8.5 15.5l9-9m0 0h-5m5 0v5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
}

type Feature = { icon: keyof typeof icons; title: string; text: string }

const LEFT: Feature[] = [
  { icon: 'wave', title: 'Guided journeys', text: 'Breath patterns layered with sound cues and a steady rhythmic voice.' },
  { icon: 'sun', title: 'Daily rituals', text: 'Five-minute practices for waking up, winding down and everything between.' },
]
const RIGHT: Feature[] = [
  { icon: 'rings', title: 'Made for your state', text: 'Tell the app how you feel — anxious, foggy, restless — and it adapts.' },
  { icon: 'growth', title: 'Gentle tracking', text: 'Notice how your mood and nervous system shift week over week.' },
]

function FeatureCard({ f, className = '' }: { f: Feature; className?: string }) {
  return (
    <article
      data-reveal
      className={`flex min-h-[clamp(190px,13.4vw,250px)] flex-col justify-between rounded-md border border-line p-4 transition-colors duration-500 hover:bg-beige-soft/50 ${className}`}
    >
      <span className="grid size-[clamp(44px,3.2vw,56px)] place-items-center rounded-full bg-lilac-deep text-ink">
        <svg viewBox="0 0 24 24" fill="none" className="size-[55%]" aria-hidden="true">
          {icons[f.icon]}
        </svg>
      </span>
      <div className="mt-10">
        <h3 className="t-title">{f.title}</h3>
        <p className="t-body mt-2 max-w-[34ch] text-ink/80">{f.text}</p>
      </div>
    </article>
  )
}

/** Grey mockup telefona — ovde kasnije ide screenshot aplikacije */
function PhoneMock() {
  return (
    <div
      data-reveal
      className="relative mx-auto aspect-[9/19.4] w-[clamp(190px,14vw,270px)] rounded-[2.4rem] bg-ink/85 p-[7px] shadow-[0_24px_40px_-28px_rgb(41_39_46/0.5)]"
      role="img"
      aria-label="App preview placeholder"
    >
      <div className="placeholder-grey relative h-full w-full overflow-hidden rounded-[2rem]">
        <span className="absolute left-1/2 top-3 h-[22px] w-[34%] -translate-x-1/2 rounded-full bg-ink/85" />
      </div>
    </div>
  )
}

export default function AppShowcase() {
  return (
    <section id="app" className="bg-beige px-5 pb-[clamp(5rem,9vw,9rem)] pt-[clamp(5rem,8vw,8rem)] md:px-7">
      <Reveal>
        <div className="mx-auto flex max-w-[44rem] flex-col items-center text-center">
          <p data-reveal className="t-tag text-ink/70">
            iOS App
          </p>
          <h2 data-reveal className="t-h2 mt-5">
            Breathwork for every
            <br />
            state of being
          </h2>
          <p data-reveal className="t-body mt-6 max-w-[30rem] text-ink/80">
            A guided practice that meets your nervous system where it is — and walks it,
            breath by breath, somewhere softer.
          </p>
          <div data-reveal className="mt-8">
            <a href="#" className="btn btn-lilac">
              Download App
            </a>
          </div>
        </div>
      </Reveal>

      {/* Desktop: kartice u "stepenik" rasporedu, telefon u sredini */}
      <Reveal
        stagger={0.1}
        className="mt-[clamp(4rem,6.4vw,6rem)] hidden grid-cols-[35.5fr_29fr_35.5fr] items-center lg:grid"
      >
        <div className="flex flex-col gap-5">
          <FeatureCard f={LEFT[0]} className="w-[64.8%] self-start" />
          <FeatureCard f={LEFT[1]} className="w-[64.8%] self-end" />
        </div>
        <PhoneMock />
        <div className="flex flex-col gap-5">
          <FeatureCard f={RIGHT[0]} className="w-[64.8%] self-end" />
          <FeatureCard f={RIGHT[1]} className="w-[64.8%] self-start" />
        </div>
      </Reveal>

      {/* Mobilni/tablet: telefon pa horizontalna traka kartica */}
      <Reveal className="mt-14 lg:hidden">
        <PhoneMock />
        <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 md:-mx-7 md:scroll-px-7 md:px-7">
          {[...LEFT, ...RIGHT].map((f) => (
            <FeatureCard key={f.title} f={f} className="w-[78vw] max-w-[340px] shrink-0 snap-start" />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
